/**
 * Helper Utilities
 * General purpose helper functions
 */

const Helpers = {
    /**
     * Format a date to a readable string
     * @param {Date|string} date - Date to format
     * @returns {string} Formatted date string
     */
    formatDate(date) {
        const d = new Date(date);
        const now = new Date();
        const diffMs = now - d;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        
        return d.toLocaleDateString();
    },

    /**
     * Format duration in seconds to readable string
     * @param {number} seconds - Duration in seconds
     * @returns {string} Formatted duration
     */
    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        }
        return `${secs}s`;
    },

    /**
     * Format a number as a percentage
     * @param {number} value - Value to format (0-100)
     * @param {number} decimals - Number of decimal places
     * @returns {string} Formatted percentage
     */
    formatPercentage(value, decimals = 0) {
        return `${value.toFixed(decimals)}%`;
    },

    /**
     * Generate a UUID v4
     * @returns {string} UUID
     */
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    /**
     * Debounce a function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle a function
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in ms
     * @returns {Function} Throttled function
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Deep clone an object
     * @param {*} obj - Object to clone
     * @returns {*} Cloned object
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Check if object is empty
     * @param {Object} obj - Object to check
     * @returns {boolean} True if empty
     */
    isEmpty(obj) {
        return Object.keys(obj).length === 0;
    },

    /**
     * Shuffle an array (Fisher-Yates algorithm)
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled array
     */
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    /**
     * Get random element from array
     * @param {Array} array - Array to pick from
     * @returns {*} Random element
     */
    randomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * Clamp a number between min and max
     * @param {number} value - Value to clamp
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Clamped value
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    /**
     * Linear interpolation
     * @param {number} start - Start value
     * @param {number} end - End value
     * @param {number} t - Interpolation factor (0-1)
     * @returns {number} Interpolated value
     */
    lerp(start, end, t) {
        return start + (end - start) * t;
    },

    /**
     * Map a value from one range to another
     * @param {number} value - Value to map
     * @param {number} inMin - Input minimum
     * @param {number} inMax - Input maximum
     * @param {number} outMin - Output minimum
     * @param {number} outMax - Output maximum
     * @returns {number} Mapped value
     */
    map(value, inMin, inMax, outMin, outMax) {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    },

    /**
     * Create a toast notification
     * @param {string} message - Message to display
     * @param {string} type - Toast type ('success', 'error', 'info', 'warning')
     * @param {number} duration - Duration in ms (0 = no auto-hide)
     */
    showToast(message, type = 'info', duration = 3000) {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;

        const toastId = this.generateUUID();
        const bgClass = {
            success: 'bg-success',
            error: 'bg-danger',
            info: 'bg-info',
            warning: 'bg-warning'
        }[type] || 'bg-info';

        const icon = {
            success: 'check-circle-fill',
            error: 'exclamation-triangle-fill',
            info: 'info-circle-fill',
            warning: 'exclamation-circle-fill'
        }[type] || 'info-circle-fill';

        const toastHTML = `
            <div class="toast align-items-center text-white ${bgClass} border-0" role="alert" aria-live="assertive" aria-atomic="true" id="${toastId}">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="bi bi-${icon} me-2"></i>
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;

        toastContainer.insertAdjacentHTML('beforeend', toastHTML);

        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, {
            autohide: duration > 0,
            delay: duration
        });

        toast.show();

        // Remove from DOM after hidden
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    },

    /**
     * Show loading indicator
     */
    showLoading() {
        const loading = document.getElementById('loading-screen');
        if (loading) {
            loading.classList.remove('d-none');
        }
        eventBus.emit(Events.LOADING_START);
    },

    /**
     * Hide loading indicator
     */
    hideLoading() {
        const loading = document.getElementById('loading-screen');
        if (loading) {
            loading.classList.add('d-none');
        }
        const appContainer = document.getElementById('app-container');
        if (appContainer) {
            appContainer.classList.remove('d-none');
        }
        eventBus.emit(Events.LOADING_END);
    },

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        const errorContainer = document.getElementById('error-container');
        const errorMessage = document.getElementById('error-message');
        
        if (errorContainer && errorMessage) {
            errorMessage.textContent = message;
            errorContainer.classList.remove('d-none');
        }
        
        this.showToast(message, 'error', 5000);
        console.error('Error:', message);
    },

    /**
     * Format a scale name for display
     * @param {Object} scale - Scale object
     * @returns {string} Formatted scale name
     */
    formatScaleName(scale) {
        const { key, category, handsOptions } = scale;
        let name = `${key} `;
        
        // Add category
        if (category === 'major') name += 'Major';
        else if (category === 'minorHarmonic') name += 'Minor Harmonic';
        else if (category === 'minorMelodic') name += 'Minor Melodic';
        else if (category === 'chromatic') name += 'Chromatic';
        else if (category === 'wholeTone') name += 'Whole-Tone';
        else if (category === 'dominant7') name += 'Dominant 7th';
        else if (category === 'diminished7') name += 'Diminished 7th';
        else name += category;
        
        // Add scale type
        if (scale.type === 'arpeggio') name += ' Arpeggio';
        else if (scale.type === 'broken-chord') name += ' Broken Chord';
        else name += ' Scale';
        
        // Add hands option
        if (handsOptions.contraryMotion) name += ' (Contrary Motion)';
        else if (handsOptions.separately) name += ' (Hands Separately)';
        else if (handsOptions.together) name += ' (Hands Together)';
        
        return name;
    },

    /**
     * Get accuracy color class
     * @param {number} accuracy - Accuracy percentage (0-100)
     * @returns {string} Bootstrap color class
     */
    getAccuracyColor(accuracy) {
        if (accuracy >= 90) return 'success';
        if (accuracy >= 75) return 'info';
        if (accuracy >= 60) return 'warning';
        return 'danger';
    },

    /**
     * Get difficulty badge
     * @param {number} difficulty - Difficulty level (1-10)
     * @returns {string} HTML for difficulty badge
     */
    getDifficultyBadge(difficulty) {
        if (difficulty <= 3) {
            return '<span class="badge bg-success">Easy</span>';
        } else if (difficulty <= 6) {
            return '<span class="badge bg-info">Medium</span>';
        } else if (difficulty <= 8) {
            return '<span class="badge bg-warning">Hard</span>';
        } else {
            return '<span class="badge bg-danger">Very Hard</span>';
        }
    },

    /**
     * Sanitize HTML to prevent XSS
     * @param {string} html - HTML string
     * @returns {string} Sanitized HTML
     */
    sanitizeHTML(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    },

    /**
     * Calculate days between two dates
     * @param {Date|string} date1 - First date
     * @param {Date|string} date2 - Second date
     * @returns {number} Days between dates
     */
    daysBetween(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffTime = Math.abs(d2 - d1);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
};
