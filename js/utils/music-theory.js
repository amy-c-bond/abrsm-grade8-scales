/**
 * Music Theory Utilities
 * Functions for calculating notes, frequencies, scales, and fingerings
 */

class MusicTheory {
    /**
     * Note to MIDI number mapping
     */
    static NOTE_MAP = {
        'C': 0, 'C#': 1, 'Db': 1,
        'D': 2, 'D#': 3, 'Eb': 3,
        'E': 4,
        'F': 5, 'F#': 6, 'Gb': 6,
        'G': 7, 'G#': 8, 'Ab': 8,
        'A': 9, 'A#': 10, 'Bb': 10,
        'B': 11
    };

    /**
     * MIDI number to note name (prefer sharps)
     */
    static MIDI_TO_NOTE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    /**
     * MIDI number to note name (prefer flats)
     */
    static MIDI_TO_NOTE_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

    /**
     * Scale interval patterns (in semitones)
     */
    static INTERVALS = {
        major: [2, 2, 1, 2, 2, 2, 1],
        minorHarmonic: [2, 1, 2, 2, 1, 3, 1],
        minorMelodic: [2, 1, 2, 2, 2, 2, 1],
        minorNatural: [2, 1, 2, 2, 1, 2, 2],
        chromatic: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        wholeTone: [2, 2, 2, 2, 2, 2],
        majorArpeggio: [4, 3, 5],  // Root, 3rd, 5th, octave
        minorArpeggio: [3, 4, 5],
        dominant7: [4, 3, 3, 2],  // Root, 3rd, 5th, 7th
        diminished7: [3, 3, 3, 3]
    };

    /**
     * Convert MIDI note number to frequency in Hz
     * @param {number} midiNote - MIDI note number (0-127)
     * @returns {number} Frequency in Hz
     */
    static midiToFrequency(midiNote) {
        return 440 * Math.pow(2, (midiNote - 69) / 12);
    }

    /**
     * Convert note name and octave to MIDI number
     * @param {string} noteName - Note name (e.g., 'C4', 'F#5', 'Bb3')
     * @returns {number} MIDI note number
     */
    static noteNameToMidi(noteName) {
        const match = noteName.match(/^([A-G][#b]?)(\d+)$/);
        if (!match) {
            throw new Error(`Invalid note name: ${noteName}`);
        }
        
        const [, note, octave] = match;
        const noteValue = this.NOTE_MAP[note];
        if (noteValue === undefined) {
            throw new Error(`Unknown note: ${note}`);
        }
        
        return (parseInt(octave) + 1) * 12 + noteValue;
    }

    /**
     * Convert MIDI number to note name with octave
     * @param {number} midiNote - MIDI note number
     * @param {boolean} preferFlats - Use flat notation instead of sharps
     * @returns {string} Note name (e.g., 'C4')
     */
    static midiToNoteName(midiNote, preferFlats = false) {
        const octave = Math.floor(midiNote / 12) - 1;
        const noteIndex = midiNote % 12;
        const noteName = preferFlats ? this.MIDI_TO_NOTE_FLAT[noteIndex] : this.MIDI_TO_NOTE[noteIndex];
        return `${noteName}${octave}`;
    }

    /**
     * Generate notes for a scale
     * @param {string} rootNote - Root note (e.g., 'C4')
     * @param {string} scaleType - Type of scale
     * @param {number} octaves - Number of octaves
     * @returns {Array<Object>} Array of note objects {name, midi, frequency}
     */
    static generateScale(rootNote, scaleType, octaves) {
        const intervals = this.INTERVALS[scaleType];
        if (!intervals) {
            throw new Error(`Unknown scale type: ${scaleType}`);
        }

        const notes = [];
        let currentMidi = this.noteNameToMidi(rootNote);
        const preferFlats = rootNote.includes('b');

        // Generate ascending notes
        for (let octave = 0; octave < octaves; octave++) {
            for (let i = 0; i < intervals.length; i++) {
                notes.push({
                    name: this.midiToNoteName(currentMidi, preferFlats),
                    midi: currentMidi,
                    frequency: this.midiToFrequency(currentMidi)
                });
                currentMidi += intervals[i];
            }
        }
        
        // Add final tonic
        notes.push({
            name: this.midiToNoteName(currentMidi, preferFlats),
            midi: currentMidi,
            frequency: this.midiToFrequency(currentMidi)
        });

        return notes;
    }

    /**
     * Get standard fingering pattern for a scale
     * @param {string} key - Key of scale (e.g., 'C', 'F#')
     * @param {string} scaleType - Type of scale
     * @param {string} hand - 'right' or 'left'
     * @returns {Array<number>} Array of finger numbers (1-5)
     */
    static getFingeringPattern(key, scaleType, hand) {
        // Standard fingering patterns
        // This is a simplified version - real implementation would have specific patterns per key
        
        const standardRight = {
            'C': [1, 2, 3, 1, 2, 3, 4, 5],
            'G': [1, 2, 3, 1, 2, 3, 4, 5],
            'D': [1, 2, 3, 1, 2, 3, 4, 5],
            'A': [1, 2, 3, 1, 2, 3, 4, 5],
            'E': [1, 2, 3, 1, 2, 3, 4, 5],
            'B': [1, 2, 3, 1, 2, 3, 4, 5],
            'F#': [2, 3, 4, 1, 2, 3, 1, 2],
            'Gb': [2, 3, 4, 1, 2, 3, 1, 2],
            'Db': [2, 3, 1, 2, 3, 4, 1, 2],
            'Ab': [2, 3, 1, 2, 3, 4, 1, 2],
            'Eb': [3, 1, 2, 3, 4, 1, 2, 3],
            'Bb': [4, 1, 2, 3, 1, 2, 3, 4],
            'F': [1, 2, 3, 4, 1, 2, 3, 4]
        };

        const standardLeft = {
            'C': [5, 4, 3, 2, 1, 3, 2, 1],
            'G': [5, 4, 3, 2, 1, 3, 2, 1],
            'D': [5, 4, 3, 2, 1, 3, 2, 1],
            'A': [5, 4, 3, 2, 1, 3, 2, 1],
            'E': [5, 4, 3, 2, 1, 3, 2, 1],
            'B': [4, 3, 2, 1, 4, 3, 2, 1],
            'F#': [4, 3, 2, 1, 3, 2, 1, 2],
            'Gb': [4, 3, 2, 1, 3, 2, 1, 2],
            'Db': [3, 2, 1, 4, 3, 2, 1, 2],
            'Ab': [3, 2, 1, 4, 3, 2, 1, 2],
            'Eb': [3, 2, 1, 4, 3, 2, 1, 2],
            'Bb': [3, 2, 1, 4, 3, 2, 1, 3],
            'F': [5, 4, 3, 2, 1, 3, 2, 1]
        };

        const patterns = hand === 'right' ? standardRight : standardLeft;
        const basePattern = patterns[key] || patterns['C'];

        // Extend pattern for multiple octaves (simple repetition for now)
        const extendedPattern = [];
        for (let i = 0; i < 4; i++) {  // 4 octaves
            extendedPattern.push(...basePattern);
        }
        extendedPattern.push(hand === 'right' ? 5 : 1);  // Final tonic

        return extendedPattern;
    }

    /**
     * Determine if a key uses sharps or flats
     * @param {string} key - Key name
     * @returns {string} 'sharp', 'flat', or 'natural'
     */
    static getKeyAccidental(key) {
        if (key.includes('#')) return 'sharp';
        if (key.includes('b')) return 'flat';
        return 'natural';
    }

    /**
     * Get the number of sharps or flats in a key signature
     * @param {string} key - Key name
     * @param {string} tonality - 'major' or 'minor'
     * @returns {Object} {type: 'sharp'|'flat', count: number}
     */
    static getKeySignature(key, tonality = 'major') {
        const majorSharps = {
            'C': 0, 'G': 1, 'D': 2, 'A': 3, 'E': 4, 'B': 5, 'F#': 6, 'C#': 7
        };
        
        const majorFlats = {
            'C': 0, 'F': 1, 'Bb': 2, 'Eb': 3, 'Ab': 4, 'Db': 5, 'Gb': 6, 'Cb': 7
        };

        if (majorSharps[key] !== undefined) {
            return { type: 'sharp', count: majorSharps[key] };
        }
        
        if (majorFlats[key] !== undefined) {
            return { type: 'flat', count: majorFlats[key] };
        }

        return { type: 'natural', count: 0 };
    }

    /**
     * Calculate tempo in milliseconds per beat
     * @param {number} bpm - Beats per minute
     * @returns {number} Milliseconds per beat
     */
    static bpmToMs(bpm) {
        return 60000 / bpm;
    }

    /**
     * Calculate note duration in seconds
     * @param {number} bpm - Beats per minute
     * @param {string} noteValue - 'whole', 'half', 'quarter', 'eighth', 'sixteenth'
     * @returns {number} Duration in seconds
     */
    static noteDuration(bpm, noteValue) {
        const beatDuration = 60 / bpm;  // Quarter note duration in seconds
        
        const durations = {
            'whole': 4,
            'half': 2,
            'quarter': 1,
            'eighth': 0.5,
            'sixteenth': 0.25
        };

        return beatDuration * (durations[noteValue] || 1);
    }
}
