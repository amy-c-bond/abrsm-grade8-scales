/**
 * Scale Randomizer Component
 * Implements weighted and adaptive scale selection algorithms
 */

class Randomizer {
    constructor() {
        this.history = [];
        this.maxHistorySize = 10; // Prevent repeating last 10 scales
        this.filters = {
            type: null,        // 'scale' or 'arpeggio'
            key: null,         // 'C', 'Eb', 'F#', 'A'
            category: null,    // 'major', 'minor', 'chromatic', etc.
            difficulty: null   // 1-10 scale
        };
        this.useWeighting = true;
    }

    /**
     * Set filter criteria
     * @param {Object} filterOptions - Filter options
     */
    setFilters(filterOptions) {
        this.filters = { ...this.filters, ...filterOptions };
        console.log('Randomizer filters updated:', this.filters);
    }

    /**
     * Clear all filters
     */
    clearFilters() {
        this.filters = {
            type: null,
            key: null,
            category: null,
            difficulty: null
        };
    }

    /**
     * Enable or disable weighted randomization
     * @param {boolean} enabled
     */
    setWeighting(enabled) {
        this.useWeighting = enabled;
    }

    /**
     * Get filtered scales based on current filter settings
     * @returns {Array} Filtered scales
     */
    getFilteredScales() {
        let scales = ScalesData.getAllScales();

        // Apply type filter
        if (this.filters.type) {
            scales = scales.filter(scale => scale.type === this.filters.type);
        }

        // Apply key filter
        if (this.filters.key) {
            scales = scales.filter(scale => scale.key === this.filters.key);
        }

        // Apply category filter
        if (this.filters.category) {
            scales = scales.filter(scale => scale.category === this.filters.category);
        }

        // Apply difficulty filter
        if (this.filters.difficulty !== null) {
            const minDiff = this.filters.difficulty;
            const maxDiff = this.filters.difficulty + 1;
            scales = scales.filter(scale => {
                const avgDiff = (scale.difficulty.technicalLevel + 
                               scale.difficulty.fingeringComplexity) / 2;
                return avgDiff >= minDiff && avgDiff <= maxDiff;
            });
        }

        // Exclude recently practiced scales
        scales = scales.filter(scale => !this.history.includes(scale.id));

        return scales;
    }

    /**
     * Get a random scale with optional weighting
     * @returns {Object} Selected scale
     */
    async getRandomScale() {
        const filteredScales = this.getFilteredScales();

        if (filteredScales.length === 0) {
            console.warn('No scales match current filters, clearing history and retrying');
            this.history = [];
            const retryScales = this.getFilteredScales();
            if (retryScales.length === 0) {
                console.error('No scales available even after clearing history');
                return ScalesData.getRandomScale(); // Fallback to any scale
            }
            return this.selectFromScales(retryScales);
        }

        return this.selectFromScales(filteredScales);
    }

    /**
     * Select a scale from the given array, optionally using weights
     * @param {Array} scales - Array of scales to choose from
     * @returns {Object} Selected scale
     */
    async selectFromScales(scales) {
        let selectedScale;

        if (this.useWeighting) {
            selectedScale = await this.weightedSelection(scales);
        } else {
            // Pure random selection
            const randomIndex = Math.floor(Math.random() * scales.length);
            selectedScale = scales[randomIndex];
        }

        // Add to history
        this.addToHistory(selectedScale.id);

        return selectedScale;
    }

    /**
     * Weighted random selection based on progress data
     * Scales with lower accuracy or less practice get higher weight
     * @param {Array} scales - Available scales
     * @returns {Object} Selected scale
     */
    async weightedSelection(scales) {
        const weights = await Promise.all(scales.map(async (scale) => {
            const progress = await database.getProgress(scale.id);
            
            if (!progress || progress.attempts === 0) {
                // Never practiced - high priority
                return 3.0;
            }

            // Calculate weight based on performance
            const accuracy = progress.accuracy || 0;
            const practiceCount = progress.attempts || 0;

            // Lower accuracy = higher weight (needs more practice)
            const accuracyWeight = accuracy < 70 ? 2.0 : 
                                  accuracy < 85 ? 1.5 : 1.0;

            // Less practice = slightly higher weight
            const practiceWeight = practiceCount < 5 ? 1.3 :
                                  practiceCount < 10 ? 1.1 : 1.0;

            // Combine weights
            return accuracyWeight * practiceWeight;
        }));

        // Calculate total weight
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);

        // Random selection based on weights
        let random = Math.random() * totalWeight;
        let selectedIndex = 0;

        for (let i = 0; i < weights.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                selectedIndex = i;
                break;
            }
        }

        return scales[selectedIndex];
    }

    /**
     * Add scale to history to prevent immediate repetition
     * @param {string} scaleId
     */
    addToHistory(scaleId) {
        this.history.unshift(scaleId);
        if (this.history.length > this.maxHistorySize) {
            this.history.pop();
        }
    }

    /**
     * Clear history
     */
    clearHistory() {
        this.history = [];
    }

    /**
     * Get current history
     * @returns {Array} Scale IDs in history
     */
    getHistory() {
        return [...this.history];
    }

    /**
     * Get difficulty-based recommendations
     * @returns {Object} Scale recommendations by difficulty
     */
    async getDifficultyRecommendations() {
        const allScales = ScalesData.getAllScales();
        
        const easy = [];
        const medium = [];
        const hard = [];

        allScales.forEach(scale => {
            const avgDiff = (scale.difficulty.technicalLevel + 
                           scale.difficulty.fingeringComplexity) / 2;
            
            if (avgDiff <= 3) {
                easy.push(scale);
            } else if (avgDiff <= 6) {
                medium.push(scale);
            } else {
                hard.push(scale);
            }
        });

        return { easy, medium, hard };
    }

    /**
     * Get recommended practice routine
     * @param {number} sessionLength - Minutes for practice
     * @returns {Array} Recommended scales to practice
     */
    async getRecommendedRoutine(sessionLength = 30) {
        const scalesPerMinute = 0.5; // Approximately 2 minutes per scale
        const targetScaleCount = Math.floor(sessionLength * scalesPerMinute);

        const recommendations = [];
        const tempHistory = [...this.history];

        // Get weak areas first
        const weakAreas = await progressTracker.getWeakAreas(Math.min(5, targetScaleCount));
        recommendations.push(...weakAreas);

        // Fill remaining slots with weighted random selection
        while (recommendations.length < targetScaleCount) {
            const scale = await this.getRandomScale();
            
            // Avoid duplicates in current routine
            if (!recommendations.find(s => s.id === scale.id)) {
                recommendations.push(scale);
            }
        }

        // Restore history after generating routine
        this.history = tempHistory;

        return recommendations;
    }

    /**
     * Get statistics about available scales
     * @returns {Object} Statistics
     */
    getStatistics() {
        const allScales = ScalesData.getAllScales();
        const filtered = this.getFilteredScales();

        const stats = {
            total: allScales.length,
            available: filtered.length,
            historySize: this.history.length,
            filters: { ...this.filters },
            byType: {},
            byKey: {},
            byCategory: {}
        };

        // Count by type
        filtered.forEach(scale => {
            stats.byType[scale.type] = (stats.byType[scale.type] || 0) + 1;
            stats.byKey[scale.key] = (stats.byKey[scale.key] || 0) + 1;
            stats.byCategory[scale.category] = (stats.byCategory[scale.category] || 0) + 1;
        });

        return stats;
    }
}

// Initialize randomizer
let randomizer = null;
