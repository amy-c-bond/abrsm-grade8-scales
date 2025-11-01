/**
 * Audio Player Component
 * Plays reference audio for scales with playback controls
 * Phase 3.2 - Full Implementation
 */

class AudioPlayer {
    constructor() {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentScale = null;
        this.currentTempo = null;
        this.playbackControl = null;
        this.noteIndex = 0;
        this.callbacks = {
            onPlay: [],
            onStop: [],
            onPause: [],
            onNotePlay: []
        };
    }

    /**
     * Play a scale
     * @param {Object} scale - Scale object from ScalesData
     * @param {number} tempo - Optional tempo override (uses scale.tempo.minim if not provided)
     * @returns {Promise} Resolves when playback completes
     */
    async play(scale, tempo = null) {
        // Stop any current playback
        this.stop();

        // Initialize audio engine if needed
        if (!audioEngine.isInitialized) {
            await audioEngine.init();
        }

        this.currentScale = scale;
        this.currentTempo = tempo || scale.tempo?.minim || 60;
        this.isPlaying = true;
        this.isPaused = false;
        this.noteIndex = 0;

        console.log('Playing scale:', scale.displayName, 'at', this.currentTempo, 'BPM');

        // Notify listeners
        this.notifyCallbacks('onPlay', { scale, tempo: this.currentTempo });

        // Emit event
        if (typeof eventBus !== 'undefined') {
            eventBus.emit('audio:play', { scale: scale.id, tempo: this.currentTempo });
        }

        // Play the scale with note callback for visual feedback
        this.playbackControl = await audioEngine.playScale(
            scale,
            this.currentTempo,
            (index, note) => {
                this.noteIndex = index;
                this.notifyCallbacks('onNotePlay', { index, note, scale });
            }
        );

        // Wait for playback to complete
        try {
            await this.playbackControl.promise;
        } catch (error) {
            console.error('Playback error:', error);
        }

        // Clean up after playback completes
        if (this.isPlaying) {
            this.stop();
        }
    }

    /**
     * Stop playback
     */
    stop() {
        if (!this.isPlaying && !this.isPaused) {
            return;
        }

        // Stop the audio
        if (this.playbackControl && this.playbackControl.stop) {
            this.playbackControl.stop();
        }

        const wasPlaying = this.isPlaying;
        
        this.isPlaying = false;
        this.isPaused = false;
        this.playbackControl = null;
        this.noteIndex = 0;

        console.log('Playback stopped');

        // Notify listeners only if we were actually playing
        if (wasPlaying) {
            this.notifyCallbacks('onStop', { scale: this.currentScale });
        }

        // Emit event
        if (typeof eventBus !== 'undefined') {
            eventBus.emit('audio:stop', { scale: this.currentScale?.id });
        }
    }

    /**
     * Pause playback (note: full pause/resume is complex with Web Audio, so we stop for now)
     */
    pause() {
        if (!this.isPlaying) {
            return;
        }

        // For now, pause acts like stop (implementing true pause is complex)
        this.stop();
        this.isPaused = true;

        console.log('Playback paused');

        // Notify listeners
        this.notifyCallbacks('onPause', { scale: this.currentScale });

        // Emit event
        if (typeof eventBus !== 'undefined') {
            eventBus.emit('audio:pause', { scale: this.currentScale?.id });
        }
    }

    /**
     * Toggle play/pause
     * @param {Object} scale - Scale to play
     * @param {number} tempo - Optional tempo
     */
    async toggle(scale, tempo = null) {
        if (this.isPlaying) {
            this.stop();
        } else {
            await this.play(scale, tempo);
        }
    }

    /**
     * Set playback tempo
     * @param {number} tempo - New tempo in BPM
     */
    setTempo(tempo) {
        this.currentTempo = Math.max(20, Math.min(300, tempo));
        
        // If currently playing, restart with new tempo
        if (this.isPlaying && this.currentScale) {
            this.play(this.currentScale, this.currentTempo);
        }
    }

    /**
     * Register callback for events
     * @param {string} event - Event name: 'onPlay', 'onStop', 'onPause', 'onNotePlay'
     * @param {Function} callback - Callback function
     */
    on(event, callback) {
        if (this.callbacks[event] && typeof callback === 'function') {
            this.callbacks[event].push(callback);
        }
    }

    /**
     * Unregister callback
     * @param {string} event - Event name
     * @param {Function} callback - Callback function to remove
     */
    off(event, callback) {
        if (this.callbacks[event]) {
            this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
        }
    }

    /**
     * Notify all callbacks for an event
     * @param {string} event - Event name
     * @param {Object} data - Data to pass to callbacks
     */
    notifyCallbacks(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in ${event} callback:`, error);
                }
            });
        }
    }

    /**
     * Clear all callbacks
     */
    clearCallbacks() {
        Object.keys(this.callbacks).forEach(event => {
            this.callbacks[event] = [];
        });
    }

    /**
     * Get current playback state
     * @returns {Object} State object
     */
    getState() {
        return {
            isPlaying: this.isPlaying,
            isPaused: this.isPaused,
            currentScale: this.currentScale,
            currentTempo: this.currentTempo,
            noteIndex: this.noteIndex
        };
    }
}

// Create global instance
let audioPlayer = new AudioPlayer();
