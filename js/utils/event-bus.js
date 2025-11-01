/**
 * Event Bus - Simple pub/sub pattern for component communication
 */

class EventBus {
    constructor() {
        this.listeners = {};
    }

    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);

        // Return unsubscribe function
        return () => {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        };
    }

    /**
     * Subscribe to an event only once
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    once(event, callback) {
        const unsubscribe = this.on(event, (...args) => {
            callback(...args);
            unsubscribe();
        });
    }

    /**
     * Emit an event
     * @param {string} event - Event name
     * @param {*} data - Data to pass to listeners
     */
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for "${event}":`, error);
                }
            });
        }
    }

    /**
     * Remove all listeners for an event
     * @param {string} event - Event name
     */
    off(event) {
        delete this.listeners[event];
    }

    /**
     * Remove all listeners
     */
    clear() {
        this.listeners = {};
    }

    /**
     * Get count of listeners for an event
     * @param {string} event - Event name
     * @returns {number} Listener count
     */
    listenerCount(event) {
        return this.listeners[event] ? this.listeners[event].length : 0;
    }
}

// Create global event bus instance
const eventBus = new EventBus();

// Predefined event names for type safety and documentation
const Events = {
    // App lifecycle
    APP_INITIALIZED: 'app:initialized',
    APP_ERROR: 'app:error',
    
    // Navigation
    NAVIGATE: 'navigation:change',
    VIEW_CHANGED: 'view:changed',
    
    // Scale operations
    SCALE_SELECTED: 'scale:selected',
    SCALE_COMPLETED: 'scale:completed',
    SCALE_ATTEMPTED: 'scale:attempted',
    
    // Practice session
    PRACTICE_STARTED: 'practice:started',
    PRACTICE_COMPLETED: 'practice:completed',
    PRACTICE_CANCELLED: 'practice:cancelled',
    
    // Audio
    AUDIO_PLAYING: 'audio:playing',
    AUDIO_STOPPED: 'audio:stopped',
    AUDIO_ERROR: 'audio:error',
    METRONOME_STARTED: 'metronome:started',
    METRONOME_STOPPED: 'metronome:stopped',
    RECORDING_STARTED: 'recording:started',
    RECORDING_STOPPED: 'recording:stopped',
    
    // Progress
    PROGRESS_UPDATED: 'progress:updated',
    STATISTICS_CHANGED: 'statistics:changed',
    
    // Settings
    SETTINGS_CHANGED: 'settings:changed',
    SETTINGS_SAVED: 'settings:saved',
    
    // UI
    TOAST_SHOW: 'toast:show',
    MODAL_OPEN: 'modal:open',
    MODAL_CLOSE: 'modal:close',
    LOADING_START: 'loading:start',
    LOADING_END: 'loading:end'
};
