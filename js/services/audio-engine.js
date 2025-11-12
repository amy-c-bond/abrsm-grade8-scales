/**
 * Audio Engine
 * Handles Web Audio API for sound generation and playback
 * Phase 3.2 - Full Implementation
 */

class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.isInitialized = false;
        this.masterGain = null;
        this.activeNotes = new Map();
        this.stopCallbacks = [];
    }

    /**
     * Initialize Audio Context
     */
    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create master gain node for volume control
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = 0.3; // Default volume at 30%
            this.masterGain.connect(this.audioContext.destination);
            
            this.isInitialized = true;
            console.log('Audio Engine initialized');
            return true;
        } catch (error) {
            console.error('Audio initialization failed:', error);
            return false;
        }
    }

    /**
     * Resume audio context (required for user gesture on some browsers)
     */
    async resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    /**
     * Set master volume
     * @param {number} volume - Volume level (0.0 to 1.0)
     */
    setVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
        }
    }

    /**
     * Play a single note with piano-like characteristics
     * @param {number} frequency - Frequency in Hz
     * @param {number} duration - Duration in seconds
     * @param {number} velocity - Note velocity (0.0 to 1.0)
     * @returns {Promise} Resolves when note finishes
     */
    async playNote(frequency, duration, velocity = 0.7) {
        if (!this.isInitialized) {
            await this.init();
        }

        await this.resume();

        const now = this.audioContext.currentTime;
        
        // Create oscillators for piano-like timbre (fundamental + harmonics)
        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const oscillator3 = this.audioContext.createOscillator();
        
        oscillator1.type = 'sine';
        oscillator2.type = 'sine';
        oscillator3.type = 'triangle';
        
        oscillator1.frequency.value = frequency;
        oscillator2.frequency.value = frequency * 2; // First harmonic
        oscillator3.frequency.value = frequency * 3; // Second harmonic
        
        // Create gain nodes for each oscillator
        const gain1 = this.audioContext.createGain();
        const gain2 = this.audioContext.createGain();
        const gain3 = this.audioContext.createGain();
        
        // Mix harmonics for piano-like sound
        gain1.gain.value = 0.5 * velocity;
        gain2.gain.value = 0.15 * velocity;
        gain3.gain.value = 0.08 * velocity;
        
        // Create envelope gain for ADSR
        const envelopeGain = this.audioContext.createGain();
        envelopeGain.gain.value = 0;
        
        // ADSR envelope
        const attackTime = 0.01;
        const decayTime = 0.1;
        const sustainLevel = 0.7;
        const releaseTime = 0.3;
        
        // Attack
        envelopeGain.gain.setValueAtTime(0, now);
        envelopeGain.gain.linearRampToValueAtTime(1, now + attackTime);
        
        // Decay to sustain
        envelopeGain.gain.linearRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
        
        // Sustain (hold at sustainLevel)
        const releaseStart = now + duration - releaseTime;
        envelopeGain.gain.setValueAtTime(sustainLevel, releaseStart);
        
        // Release
        envelopeGain.gain.linearRampToValueAtTime(0, releaseStart + releaseTime);
        
        // Connect audio graph
        oscillator1.connect(gain1);
        oscillator2.connect(gain2);
        oscillator3.connect(gain3);
        
        gain1.connect(envelopeGain);
        gain2.connect(envelopeGain);
        gain3.connect(envelopeGain);
        
        envelopeGain.connect(this.masterGain);
        
        // Start and stop oscillators
        oscillator1.start(now);
        oscillator2.start(now);
        oscillator3.start(now);
        
        oscillator1.stop(now + duration);
        oscillator2.stop(now + duration);
        oscillator3.stop(now + duration);
        
        // Return promise that resolves when note completes
        return new Promise(resolve => {
            setTimeout(() => resolve(), duration * 1000);
        });
    }

    /**
     * Play a scale with proper timing (both hands together)
     * @param {Object} scale - Scale object from ScalesData
     * @param {number} tempo - BPM (beats per minute)
     * @param {Function} onNotePlay - Callback for each note (receives note index)
     * @returns {Promise} Resolves when scale completes, returns stop function
     */
    async playScale(scale, tempo, onNotePlay = null) {
        if (!this.isInitialized) {
            await this.init();
        }

        await this.resume();

        let isStopped = false;
        
        // Generate scale notes - check for pre-defined notes first (for dominant7 and special cases)
        let notes, descendingNotes = null;
        
        if (scale.ascendingNotes && scale.descendingNotes) {
            // Use pre-defined notes from the scale definition
            const allAscending = scale.ascendingNotes.map(noteName => ({
                name: noteName,
                midi: MusicTheory.noteNameToMidi(noteName),
                frequency: MusicTheory.midiToFrequency(MusicTheory.noteNameToMidi(noteName))
            }));
            const allDescending = scale.descendingNotes.map(noteName => ({
                name: noteName,
                midi: MusicTheory.noteNameToMidi(noteName),
                frequency: MusicTheory.midiToFrequency(MusicTheory.noteNameToMidi(noteName))
            }));
            
            // For audio, use all notes (4 octaves for dominant7-arpeggio)
            notes = allAscending;
            descendingNotes = allDescending;
        } else {
            // Generate scale/arpeggio notes using MusicTheory
            const rootNote = scale.key + '2';
            const octaves = scale.range?.octaves || 2;
            
            try {
                // Check if this is an arpeggio
                if (scale.type === 'arpeggio') {
                    const is2ndInversion = scale.id.includes('2nd-inversion');
                    
                    // Select correct intervals based on category and inversion
                    let intervals;
                    if (scale.category === 'major') {
                        intervals = is2ndInversion ? MusicTheory.INTERVALS.majorArpeggio2ndInv : MusicTheory.INTERVALS.majorArpeggio;
                    } else if (scale.category === 'minor') {
                        intervals = is2ndInversion ? MusicTheory.INTERVALS.minorArpeggio2ndInv : MusicTheory.INTERVALS.minorArpeggio;
                    } else {
                        // For other arpeggios (diminished7, etc.), use regular intervals
                        intervals = MusicTheory.INTERVALS.majorArpeggio;
                    }
                    
                    // Generate arpeggio using the intervals
                    notes = this.generateArpeggio(rootNote, intervals, octaves);
                } else {
                    // Generate scale notes
                    const scaleType = this.getScaleTypeForGeneration(scale);
                    notes = MusicTheory.generateScale(rootNote, scaleType, octaves);
                }
                
                // For melodic minor, generate separate descending notes using natural minor
                if (scale.category === 'minorMelodic') {
                    descendingNotes = MusicTheory.generateScale(rootNote, 'minorNatural', octaves);
                }
            } catch (error) {
                console.error('Error generating scale:', error);
                return { stop: () => {} };
            }
        }

        // MIDI constants
        const C2_MIDI = 36; // C2 (minimum for left hand - similar motion)
        const A1_MIDI = 33; // A1 (minimum for left hand - contrary motion)
        const E2_MIDI = 40; // E2 (minimum for left hand - dominant7 arpeggios)
        const F3_MIDI = 53; // F3
        
        // Check if we're using pre-defined notes (dominant7 arpeggios, etc.)
        const usingPredefinedNotes = scale.ascendingNotes && scale.descendingNotes;
        
        let rightHandNotes, leftHandNotes, rightDescendingSource, leftDescendingSource;
        
        if (usingPredefinedNotes) {
            // For pre-defined notes (like dominant7 arpeggios), use them directly for right hand
            // They already have the correct octaves set for right hand
            rightHandNotes = notes;
            rightDescendingSource = descendingNotes;
            
            // For left hand, transpose down to start from E2 minimum
            const startingNoteMidi = notes[0].midi;
            let leftHandShift = -24; // Start 2 octaves below right hand
            
            // Adjust up if we go below E2
            while (startingNoteMidi + leftHandShift < E2_MIDI) {
                leftHandShift += 12;
            }
            
            // Transpose left hand notes
            leftHandNotes = notes.map(note => ({
                name: MusicTheory.midiToNoteName(note.midi + leftHandShift),
                midi: note.midi + leftHandShift,
                frequency: MusicTheory.midiToFrequency(note.midi + leftHandShift)
            }));
            
            leftDescendingSource = descendingNotes.map(note => ({
                name: MusicTheory.midiToNoteName(note.midi + leftHandShift),
                midi: note.midi + leftHandShift,
                frequency: MusicTheory.midiToFrequency(note.midi + leftHandShift)
            }));
        } else {
            // Calculate transposition for each hand to meet minimum requirements
            const startingNoteMidi = notes[0].midi;
            
            // Right hand: minimum F3
            let rightHandShift = 0;
            while (startingNoteMidi + rightHandShift < F3_MIDI) {
                rightHandShift += 12;
            }
            
            console.log('Audio playback - Hand shifts:', { rightHandShift });
            
            // Generate right hand notes
            rightHandNotes = notes.map(note => ({
                name: MusicTheory.midiToNoteName(note.midi + rightHandShift),
                midi: note.midi + rightHandShift,
                frequency: MusicTheory.midiToFrequency(note.midi + rightHandShift)
            }));
            
            // Generate right hand descending notes (use natural minor for melodic minor)
            rightDescendingSource = descendingNotes ? descendingNotes.map(note => ({
                name: MusicTheory.midiToNoteName(note.midi + rightHandShift),
                midi: note.midi + rightHandShift,
                frequency: MusicTheory.midiToFrequency(note.midi + rightHandShift)
            })) : rightHandNotes;
            
            // Generate left hand notes
            if (scale.handsOptions?.contraryMotion) {
                // For contrary motion: both hands start on the SAME note (same octave)
                // Left hand goes DOWN while right hand goes UP
                const leftStartingNote = startingNoteMidi + rightHandShift; // SAME as right hand
                leftHandNotes = notes.map(note => {
                    const relativeShift = note.midi - startingNoteMidi;
                    return {
                        name: MusicTheory.midiToNoteName(leftStartingNote - relativeShift), // SUBTRACT to go down
                        midi: leftStartingNote - relativeShift,
                        frequency: MusicTheory.midiToFrequency(leftStartingNote - relativeShift)
                    };
                });
                
                // For melodic minor descending
                if (descendingNotes) {
                    leftDescendingSource = descendingNotes.map(note => {
                        const relativeShift = note.midi - startingNoteMidi;
                        return {
                            name: MusicTheory.midiToNoteName(leftStartingNote - relativeShift),
                            midi: leftStartingNote - relativeShift,
                            frequency: MusicTheory.midiToFrequency(leftStartingNote - relativeShift)
                        };
                    });
                } else {
                    leftDescendingSource = leftHandNotes;
                }
            } else {
                // For similar motion: left hand two octaves below right hand
                // Don't go below C2
                let leftHandShift = rightHandShift - 24;
                while (startingNoteMidi + leftHandShift < C2_MIDI) {
                    leftHandShift += 12;
                }
                leftHandNotes = notes.map(note => ({
                    name: MusicTheory.midiToNoteName(note.midi + leftHandShift),
                    midi: note.midi + leftHandShift,
                    frequency: MusicTheory.midiToFrequency(note.midi + leftHandShift)
                }));
                
                // For melodic minor descending
                if (descendingNotes) {
                    leftDescendingSource = descendingNotes.map(note => ({
                        name: MusicTheory.midiToNoteName(note.midi + leftHandShift),
                        midi: note.midi + leftHandShift,
                        frequency: MusicTheory.midiToFrequency(note.midi + leftHandShift)
                    }));
                } else {
                    leftDescendingSource = leftHandNotes;
                }
            }
        }

        // Tempo is in minims (half notes) per minute
        // Convert to quarter note BPM: minim BPM * 2 = quarter note BPM
        const quarterNoteBPM = tempo * 2; // Convert minim BPM to quarter note BPM
        const noteDuration = MusicTheory.noteDuration(quarterNoteBPM, 'eighth');
        const noteGap = 0.05; // Small gap between notes for clarity
        
        // Create descending notes 
        // For melodic minor and dominant7, use the pre-defined descending notes (already in correct order)
        // For others, reverse ascending
        let rightDescending, leftDescending;
        
        if (descendingNotes) {
            // Descending notes are already in correct descending order, don't reverse
            // Just remove the first note to avoid duplicate with top of ascending
            rightDescending = rightDescendingSource.slice(1);
            leftDescending = leftDescendingSource.slice(1);
        } else {
            // No pre-defined descending, so reverse the ascending and remove first to avoid duplicate
            rightDescending = [...rightDescendingSource].reverse().slice(1);
            leftDescending = [...leftDescendingSource].reverse().slice(1);
        }
        
        // Combine ascending and descending for full scale
        let allRightNotes, allLeftNotes;
        
        if (scale.handsOptions?.contraryMotion) {
            // CONTRARY MOTION: 
            // Right hand: ascending then descending (normal)
            // Left hand: descending then ascending (opposite direction)
            allRightNotes = [...rightHandNotes, ...rightDescending];
            
            // Left hand plays descending first (reversed ascending), then ascending (original without duplicate)
            const leftAscendingBack = leftHandNotes.slice(1); // Remove duplicate starting note
            allLeftNotes = [[...leftHandNotes].reverse(), ...leftAscendingBack].flat();
        } else {
            // SIMILAR MOTION: Both hands play same direction
            allRightNotes = [...rightHandNotes, ...rightDescending];
            allLeftNotes = [...leftHandNotes, ...leftDescending];
        }
        
        // Calculate quarter note duration for the final note
        const quarterNoteDuration = MusicTheory.noteDuration(quarterNoteBPM, 'quarter');
        
        // Play notes sequentially (ascending then descending, both hands together)
        const playPromise = (async () => {
            for (let i = 0; i < allRightNotes.length && !isStopped; i++) {
                const rightNote = allRightNotes[i];
                const leftNote = allLeftNotes[i];
                const isLastNote = (i === allRightNotes.length - 1);
                
                // Callback for visual feedback
                if (onNotePlay) {
                    onNotePlay(i, rightNote);
                }
                
                // Play both hands simultaneously - last note is a quarter note, others are eighth notes
                const currentDuration = isLastNote ? quarterNoteDuration : noteDuration;
                
                // Play both notes at the same time
                await Promise.all([
                    this.playNote(rightNote.frequency, currentDuration, 0.5), // Slightly quieter per hand
                    this.playNote(leftNote.frequency, currentDuration, 0.5)
                ]);
                
                // Small gap between notes
                if (i < allRightNotes.length - 1 && !isStopped) {
                    await new Promise(resolve => setTimeout(resolve, noteGap * 1000));
                }
            }
        })();

        // Return object with stop function
        return {
            stop: () => {
                isStopped = true;
            },
            promise: playPromise
        };
    }

    /**
     * Stop all currently playing audio
     */
    stopAll() {
        // Execute all stop callbacks
        this.stopCallbacks.forEach(callback => callback());
        this.stopCallbacks = [];
        
        // Clear active notes
        this.activeNotes.clear();
    }

    /**
     * Get scale type string for MusicTheory.generateScale
     * @param {Object} scale - Scale object
     * @returns {string} Scale type
     */
    getScaleTypeForGeneration(scale) {
        const category = scale.category?.toLowerCase() || '';
        const name = scale.name?.toLowerCase() || '';
        
        if (category.includes('major') && !category.includes('arpeggio')) {
            return 'major';
        }
        if (category.includes('harmonic') || name.includes('harmonic')) {
            return 'minorHarmonic';
        }
        if (category.includes('melodic') || name.includes('melodic')) {
            return 'minorMelodic';
        }
        if (category.includes('chromatic')) {
            return 'chromatic';
        }
        if (category.includes('whole') || name.includes('whole')) {
            return 'wholeTone';
        }
        if (category.includes('arpeggio')) {
            if (scale.tonality === 'major') {
                return 'majorArpeggio';
            } else if (scale.tonality === 'minor') {
                return 'minorArpeggio';
            } else if (name.includes('dominant')) {
                return 'dominant7';
            } else if (name.includes('diminished')) {
                return 'diminished7';
            }
        }
        
        // Default fallback
        return 'major';
    }

    /**
     * Play a metronome click
     * @param {boolean} isDownbeat - True for downbeat (first beat of bar)
     */
    playClick(isDownbeat = false) {
        if (!this.isInitialized) return;

        const now = this.audioContext.currentTime;
        
        const oscillator = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = isDownbeat ? 1000 : 800; // Higher pitch for downbeat
        
        gain.gain.value = 0.3;
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        
        oscillator.connect(gain);
        gain.connect(this.masterGain);
        
        oscillator.start(now);
        oscillator.stop(now + 0.05);
    }

    /**
     * Generate arpeggio notes
     * @param {string} rootNote - Starting note (e.g., 'C2')
     * @param {Array} intervals - Array of semitone intervals
     * @param {number} octaves - Number of octaves to generate
     * @returns {Array} Array of note objects with name, midi, frequency
     */
    generateArpeggio(rootNote, intervals, octaves) {
        const notes = [];
        let currentMidi = MusicTheory.noteNameToMidi(rootNote);
        
        // Add starting note
        notes.push({
            name: MusicTheory.midiToNoteName(currentMidi),
            midi: currentMidi,
            frequency: MusicTheory.midiToFrequency(currentMidi)
        });
        
        // Generate notes for each octave
        for (let octave = 0; octave < octaves; octave++) {
            for (let i = 0; i < intervals.length; i++) {
                currentMidi += intervals[i];
                notes.push({
                    name: MusicTheory.midiToNoteName(currentMidi),
                    midi: currentMidi,
                    frequency: MusicTheory.midiToFrequency(currentMidi)
                });
            }
        }
        
        return notes;
    }

    /**
     * Clean up resources
     */
    destroy() {
        this.stopAll();
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
            this.isInitialized = false;
        }
    }
}

// Create global instance
const audioEngine = new AudioEngine();
