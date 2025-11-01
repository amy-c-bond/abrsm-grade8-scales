/**
 * Database Manager
 * Handles IndexedDB operations for scales and progress data
 */

class DatabaseManager {
    constructor() {
        this.dbName = 'abrsm-grade8-scales';
        this.version = 2; // Incremented to force database upgrade and scale repopulation
        this.db = null;
    }

    /**
     * Initialize the database
     * @returns {Promise<void>}
     */
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                console.error('Database failed to open');
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('Database opened successfully');
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create scales object store
                if (!db.objectStoreNames.contains('scales')) {
                    const scalesStore = db.createObjectStore('scales', { keyPath: 'id' });
                    scalesStore.createIndex('type', 'type', { unique: false });
                    scalesStore.createIndex('category', 'category', { unique: false });
                    scalesStore.createIndex('key', 'key', { unique: false });
                }

                // Create user progress object store
                if (!db.objectStoreNames.contains('progress')) {
                    const progressStore = db.createObjectStore('progress', { keyPath: ['userId', 'scaleId'] });
                    progressStore.createIndex('scaleId', 'scaleId', { unique: false });
                    progressStore.createIndex('lastAttempted', 'statistics.lastAttempted', { unique: false });
                }

                // Create practice sessions object store
                if (!db.objectStoreNames.contains('sessions')) {
                    const sessionsStore = db.createObjectStore('sessions', { keyPath: 'sessionId' });
                    sessionsStore.createIndex('scaleId', 'scaleId', { unique: false });
                    sessionsStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                // Create settings object store
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'userId' });
                }

                console.log('Database upgrade complete');
            };
        });
    }

    /**
     * Populate scales from ScalesData
     * @returns {Promise<void>}
     */
    async populateScales() {
        const transaction = this.db.transaction(['scales'], 'readwrite');
        const store = transaction.objectStore('scales');

        // Check if already populated
        const countRequest = store.count();
        
        return new Promise((resolve, reject) => {
            countRequest.onsuccess = async () => {
                const scales = ScalesData.getAllScales();
                const expectedCount = scales.length; // Should be 35
                
                // Repopulate if database is empty OR has wrong number of scales
                if (countRequest.result === 0 || countRequest.result !== expectedCount) {
                    console.log(`Database has ${countRequest.result} scales, expected ${expectedCount}. Repopulating...`);
                    
                    // Clear existing scales
                    const clearRequest = store.clear();
                    clearRequest.onsuccess = () => {
                        // Add all scales
                        for (const scale of scales) {
                            store.add(scale);
                        }
                        console.log(`Populated ${scales.length} scales into database`);
                        resolve();
                    };
                    clearRequest.onerror = () => reject(clearRequest.error);
                } else {
                    console.log(`Database already has ${expectedCount} scales`);
                    resolve();
                }
            };

            countRequest.onerror = () => reject(countRequest.error);
        });
    }

    /**
     * Get all scales
     * @returns {Promise<Array>}
     */
    async getAllScales() {
        const transaction = this.db.transaction(['scales'], 'readonly');
        const store = transaction.objectStore('scales');
        const request = store.getAll();

        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get scale by ID
     * @param {string} id - Scale ID
     * @returns {Promise<Object>}
     */
    async getScaleById(id) {
        const transaction = this.db.transaction(['scales'], 'readonly');
        const store = transaction.objectStore('scales');
        const request = store.get(id);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get user progress for all scales
     * @param {string} userId - User ID
     * @returns {Promise<Array>}
     */
    async getUserProgress(userId = 'default-user') {
        const transaction = this.db.transaction(['progress'], 'readonly');
        const store = transaction.objectStore('progress');
        const request = store.getAll();

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                const allProgress = request.result;
                const userProgress = allProgress.filter(p => p.userId === userId);
                resolve(userProgress);
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get progress for a specific scale
     * @param {string} userId - User ID
     * @param {string} scaleId - Scale ID
     * @returns {Promise<Object>}
     */
    async getScaleProgress(userId, scaleId) {
        const transaction = this.db.transaction(['progress'], 'readonly');
        const store = transaction.objectStore('progress');
        const request = store.get([userId, scaleId]);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Update scale progress
     * @param {string} userId - User ID
     * @param {string} scaleId - Scale ID
     * @param {Object} progressData - Progress data
     * @returns {Promise<void>}
     */
    async updateProgress(userId, scaleId, progressData) {
        const transaction = this.db.transaction(['progress'], 'readwrite');
        const store = transaction.objectStore('progress');

        // Get existing progress or create new
        const existing = await this.getScaleProgress(userId, scaleId);
        
        const progress = existing || {
            userId,
            scaleId,
            statistics: {
                totalAttempts: 0,
                successfulAttempts: 0,
                lastAttempted: null,
                averageAccuracy: 0,
                bestAccuracy: 0,
                currentStreak: 0,
                longestStreak: 0
            },
            performance: {
                tempoAchieved: 0,
                handsTogetherMastered: false,
                handsSeparatelyMastered: false,
                contraryMotionMastered: false,
                legatoMastered: false,
                staccatoMastered: false
            },
            adaptiveLearning: {
                currentDifficulty: 5,
                recommendedNextPractice: null,
                focusAreas: []
            },
            practiceHistory: []
        };

        // Update with new data
        Object.assign(progress, progressData);

        const request = store.put(progress);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Record a practice session
     * @param {Object} session - Session data
     * @returns {Promise<void>}
     */
    async recordSession(session) {
        const transaction = this.db.transaction(['sessions'], 'readwrite');
        const store = transaction.objectStore('sessions');
        const request = store.add(session);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get settings
     * @param {string} userId - User ID
     * @returns {Promise<Object>}
     */
    async getSettings(userId = 'default-user') {
        const transaction = this.db.transaction(['settings'], 'readonly');
        const store = transaction.objectStore('settings');
        const request = store.get(userId);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                resolve(request.result || this.getDefaultSettings());
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Save settings
     * @param {string} userId - User ID
     * @param {Object} settings - Settings data
     * @returns {Promise<void>}
     */
    async saveSettings(userId, settings) {
        const transaction = this.db.transaction(['settings'], 'readwrite');
        const store = transaction.objectStore('settings');
        const request = store.put({ userId, ...settings });

        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get default settings
     * @returns {Object}
     */
    getDefaultSettings() {
        return {
            preferences: {
                defaultTempo: 100,
                metronomeEnabled: true,
                metronomeSound: 'click',
                visualMetronome: true,
                audioFeedback: true,
                showFingering: true,
                showKeyboard: true,
                theme: 'auto'
            },
            practice: {
                sessionLength: 30,
                breakReminders: true,
                randomizeMode: 'adaptive',
                filterByMastery: false,
                excludeMastered: false
            },
            audio: {
                inputDevice: 'default',
                inputSensitivity: 50,
                playbackVolume: 70,
                recordSessions: false
            }
        };
    }
}

// Create global instance
const database = new DatabaseManager();
