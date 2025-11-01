/**
 * Metronome Component
 * Provides tempo and beat tracking
 * (Stub - to be implemented in Phase 3)
 */

class Metronome {
    constructor() {
        this.isPlaying = false;
        this.tempo = 60;
    }

    start(tempo) {
        this.tempo = tempo;
        this.isPlaying = true;
        console.log('Metronome started at', tempo, 'BPM');
    }

    stop() {
        this.isPlaying = false;
        console.log('Metronome stopped');
    }
}

let metronome = null;
