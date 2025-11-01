/**
 * Audio Player Component
 * Plays reference audio for scales
 * (Stub - to be implemented in Phase 3)
 */

class AudioPlayer {
    constructor() {
        this.isPlaying = false;
    }

    async play(scale) {
        console.log('Playing scale:', scale.name);
        // Implementation with Web Audio API coming in Phase 3
    }

    stop() {
        this.isPlaying = false;
    }
}

let audioPlayer = null;
