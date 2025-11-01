/**
 * Storage Manager
 * Handles localStorage and general storage operations
 */

class StorageManager {
    constructor() {
        this.prefix = 'abrsm-scales-';
    }

    /**
     * Save to localStorage
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     */
    save(key, value) {
        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(this.prefix + key, serialized);
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    /**
     * Load from localStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if not found
     * @returns {*} Stored value or default
     */
    load(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return defaultValue;
        }
    }

    /**
     * Remove from localStorage
     * @param {string} key - Storage key
     */
    remove(key) {
        localStorage.removeItem(this.prefix + key);
    }

    /**
     * Clear all app data from localStorage
     */
    clear() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        });
    }

    /**
     * Get storage usage
     * @returns {Object} Storage usage info
     */
    getUsage() {
        let total = 0;
        const keys = Object.keys(localStorage);
        
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                total += localStorage.getItem(key).length;
            }
        });

        return {
            used: total,
            usedKB: (total / 1024).toFixed(2),
            usedMB: (total / 1024 / 1024).toFixed(2)
        };
    }

    /**
     * Export all data
     * @returns {Object} All stored data
     */
    exportData() {
        const data = {};
        const keys = Object.keys(localStorage);
        
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                const cleanKey = key.replace(this.prefix, '');
                data[cleanKey] = this.load(cleanKey);
            }
        });

        return data;
    }

    /**
     * Import data
     * @param {Object} data - Data to import
     */
    importData(data) {
        Object.keys(data).forEach(key => {
            this.save(key, data[key]);
        });
    }
}

// Create global instance
const storageManager = new StorageManager();
