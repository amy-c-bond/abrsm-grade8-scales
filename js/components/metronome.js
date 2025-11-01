/**
 * Metronome Component
 * Provides precise tempo and beat tracking using Web Audio API
 * Phase 3.2 - Full Implementation
 */

class Metronome {
    constructor() {
        this.isPlaying = false;
        this.tempo = 60;
        this.beatsPerBar = 4;
        this.currentBeat = 0;
        this.nextBeatTime = 0;
        this.scheduleAheadTime = 0.1; // How far ahead to schedule audio (seconds)
        this.timerID = null;
        this.beatCallbacks = [];
    }

    /**
     * Start the metronome
     * @param {number} tempo - Beats per minute
     * @param {number} beatsPerBar - Time signature (default 4 for 4/4)
     */
    start(tempo = 60, beatsPerBar = 4) {
        if (this.isPlaying) {
            this.stop();
        }

        this.tempo = tempo;
        this.beatsPerBar = beatsPerBar;
        this.currentBeat = 0;
        this.isPlaying = true;

        // Initialize audio engine if needed
        if (!audioEngine.isInitialized) {
            audioEngine.init();
        }

        // Set the time of the next beat
        if (audioEngine.audioContext) {
            this.nextBeatTime = audioEngine.audioContext.currentTime;
        }

        // Start the scheduler
        this.schedule();

        console.log(`Metronome started at ${tempo} BPM, ${beatsPerBar}/4 time`);
    }

    /**
     * Stop the metronome
     */
    stop() {
        this.isPlaying = false;
        if (this.timerID) {
            clearTimeout(this.timerID);
            this.timerID = null;
        }
        this.currentBeat = 0;
        console.log('Metronome stopped');
    }

    /**
     * Toggle play/pause
     */
    toggle() {
        if (this.isPlaying) {
            this.stop();
        } else {
            this.start(this.tempo, this.beatsPerBar);
        }
    }

    /**
     * Set tempo
     * @param {number} tempo - Beats per minute
     */
    setTempo(tempo) {
        this.tempo = Math.max(20, Math.min(300, tempo)); // Clamp between 20-300 BPM
        
        // If playing, restart with new tempo
        if (this.isPlaying) {
            const wasPlaying = this.isPlaying;
            const currentBeatsPerBar = this.beatsPerBar;
            this.stop();
            if (wasPlaying) {
                this.start(this.tempo, currentBeatsPerBar);
            }
        }
    }

    /**
     * Set time signature
     * @param {number} beatsPerBar - Number of beats per bar
     */
    setTimeSignature(beatsPerBar) {
        this.beatsPerBar = Math.max(1, Math.min(12, beatsPerBar));
        
        // If playing, restart with new time signature
        if (this.isPlaying) {
            const wasPlaying = this.isPlaying;
            const currentTempo = this.tempo;
            this.stop();
            if (wasPlaying) {
                this.start(currentTempo, this.beatsPerBar);
            }
        }
    }

    /**
     * Schedule beats ahead of time for precise timing
     */
    schedule() {
        if (!this.isPlaying || !audioEngine.audioContext) {
            return;
        }

        const currentTime = audioEngine.audioContext.currentTime;

        // Schedule all beats that need to play before the next scheduling interval
        while (this.nextBeatTime < currentTime + this.scheduleAheadTime) {
            this.scheduleBeat(this.currentBeat, this.nextBeatTime);
            this.nextNote();
        }

        // Schedule next call
        this.timerID = setTimeout(() => this.schedule(), 25); // Check every 25ms
    }

    /**
     * Schedule a single beat
     * @param {number} beatNumber - Current beat number in the bar (0-indexed)
     * @param {number} time - Time to play the beat
     */
    scheduleBeat(beatNumber, time) {
        // Play click sound
        const isDownbeat = (beatNumber % this.beatsPerBar) === 0;
        
        // Schedule the audio click at the precise time
        if (audioEngine.isInitialized) {
            const now = audioEngine.audioContext.currentTime;
            
            const oscillator = audioEngine.audioContext.createOscillator();
            const gain = audioEngine.audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.value = isDownbeat ? 1000 : 800;
            
            gain.gain.value = 0.6; // Uniform volume for all beats
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
            
            oscillator.connect(gain);
            gain.connect(audioEngine.masterGain);
            
            oscillator.start(time);
            oscillator.stop(time + 0.05);
        }

        // Notify listeners for visual feedback
        this.notifyBeat(beatNumber, isDownbeat);
    }

    /**
     * Move to the next beat
     */
    nextNote() {
        // Tempo is in minims per minute, but metronome clicks on quarter notes
        // Convert minim BPM to quarter note BPM: minim_bpm * 2
        const quarterNoteBPM = this.tempo * 2;
        const secondsPerBeat = 60.0 / quarterNoteBPM;
        this.nextBeatTime += secondsPerBeat;

        // Advance beat counter
        this.currentBeat++;
        if (this.currentBeat >= this.beatsPerBar) {
            this.currentBeat = 0;
        }
    }

    /**
     * Register callback for beat events
     * @param {Function} callback - Function to call on each beat (receives beatNumber, isDownbeat)
     */
    onBeat(callback) {
        if (typeof callback === 'function') {
            this.beatCallbacks.push(callback);
        }
    }

    /**
     * Notify all listeners of a beat
     * @param {number} beatNumber - Current beat number
     * @param {boolean} isDownbeat - True if this is the first beat of the bar
     */
    notifyBeat(beatNumber, isDownbeat) {
        this.beatCallbacks.forEach(callback => {
            try {
                callback(beatNumber, isDownbeat);
            } catch (error) {
                console.error('Error in beat callback:', error);
            }
        });

        // Emit event for other components
        if (typeof eventBus !== 'undefined') {
            eventBus.emit('metronome:beat', { beatNumber, isDownbeat, tempo: this.tempo });
        }
    }

    /**
     * Clear all beat callbacks
     */
    clearCallbacks() {
        this.beatCallbacks = [];
    }

    /**
     * Get current state
     * @returns {Object} Current state
     */
    getState() {
        return {
            isPlaying: this.isPlaying,
            tempo: this.tempo,
            beatsPerBar: this.beatsPerBar,
            currentBeat: this.currentBeat
        };
    }
}

// Create global instance
let metronome = new Metronome();
