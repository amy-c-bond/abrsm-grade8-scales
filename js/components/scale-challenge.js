/**
 * Scale Challenge Component
 * Handles the practice session for a selected scale
 */

class ScaleChallenge {
    constructor() {
        this.container = document.getElementById('challenge-view');
        this.currentScale = null;
        this.init();
    }

    /**
     * Initialize the component
     */
    init() {
        // Listen for scale selection events
        eventBus.on(Events.SCALE_SELECTED, async (scale) => {
            await this.start(scale);
            // After rendering completes, switch to challenge view
            app.showView('challenge');
        });
    }

    /**
     * Start a challenge with the given scale
     * @param {Object} scale - Scale to practice
     */
    async start(scale) {
        this.currentScale = scale;
        console.log('Starting challenge for:', scale.displayName);
        
        await this.render();
        console.log('Scale challenge rendered');
    }

    /**
     * Render the challenge view
     */
    async render() {
        const scale = this.currentScale;
        
        // Determine how many octaves to display
        // Chromatic scales: 1 octave only
        // Arpeggios: 2 octaves
        // Major/Minor scales: 2 octaves
        const displayOctaves = scale.category === 'chromatic' ? 1 : 2;
        
        // Generate scale notes - use the correct method based on type
        let ascendingNotes, descendingNotes;
        let rightHandNotes, leftHandNotes;
        
        // Check if this is a contrary motion scale with pre-defined hand notes
        if (scale.handsOptions?.contraryMotion && scale.rightHand?.notes && scale.leftHand?.notes) {
            // Use pre-defined right and left hand notes from the database
            rightHandNotes = scale.rightHand.notes.map(noteName => ({
                name: noteName,
                midi: MusicTheory.noteNameToMidi(noteName),
                frequency: MusicTheory.midiToFrequency(MusicTheory.noteNameToMidi(noteName))
            }));
            
            leftHandNotes = scale.leftHand.notes.map(noteName => ({
                name: noteName,
                midi: MusicTheory.noteNameToMidi(noteName),
                frequency: MusicTheory.midiToFrequency(MusicTheory.noteNameToMidi(noteName))
            }));
            
            // Set empty arrays for ascendingNotes/descendingNotes since we're not using them
            ascendingNotes = [];
            descendingNotes = [];
            
        } else if (scale.ascendingNotes && scale.descendingNotes) {
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
            
            // For dominant7-arpeggio: display only 2 octaves even though 4 octaves are defined
            // Ascending: first 9 notes (E3, G#3, B3, D4, E4, G#4, B4, D5, E5)
            // Descending: need D5, B4, G#4, E4, D4, B3, G#3, A3 (8 notes)
            if (scale.category === 'dominant7-arpeggio') {
                ascendingNotes = allAscending.slice(0, 9); // First 9 notes for 2 octaves up
                
                // Find where D5 is in the descending array (it should be at index 8)
                // Then take 7 notes from there (D5 to G#3), and add the resolution A3
                const d5Index = allDescending.findIndex(note => note.name === 'D5');
                if (d5Index !== -1) {
                    // Take 7 notes starting from D5: D5, B4, G#4, E4, D4, B3, G#3
                    const sevenNotes = allDescending.slice(d5Index, d5Index + 7);
                    // Add the resolution note A3 (last note in allDescending)
                    descendingNotes = [...sevenNotes, allDescending[allDescending.length - 1]];
                } else {
                    // Fallback: take last 8 notes
                    descendingNotes = allDescending.slice(-8);
                }
            } else {
                ascendingNotes = allAscending;
                descendingNotes = allDescending;
            }
        } else if (scale.type === 'arpeggio') {
            // For arpeggios, determine if it's 2nd inversion based on the scale ID
            const is2ndInversion = scale.id.includes('2nd-inversion');
            
            // Select correct intervals based on category and inversion
            let intervals;
            if (scale.category === 'major') {
                intervals = is2ndInversion ? MusicTheory.INTERVALS.majorArpeggio2ndInv : MusicTheory.INTERVALS.majorArpeggio;
            } else {
                intervals = is2ndInversion ? MusicTheory.INTERVALS.minorArpeggio2ndInv : MusicTheory.INTERVALS.minorArpeggio;
            }
            
            ascendingNotes = this.generateArpeggio(scale.range.startNote, intervals, displayOctaves);
            // For regular arpeggios: descending is just reversed ascending (excluding the top note to avoid duplication)
            descendingNotes = ascendingNotes.slice(0, -1).reverse();
        } else {
            // For scales, use generateScale
            ascendingNotes = MusicTheory.generateScale(scale.range.startNote, scale.category, displayOctaves);
            // Add descending notes based on category
            if (scale.category === 'minorMelodic') {
                // MELODIC MINOR: Descending uses natural minor (lowered 6th and 7th)
                // Generate natural minor scale for descending
                const descendingScale = MusicTheory.generateScale(scale.range.startNote, 'minorNatural', displayOctaves);
                // Reverse it (excluding the starting note to avoid duplicate) and remove the top note
                descendingNotes = descendingScale.slice(0, -1).reverse();
            } else {
                // All other scales: descending is just reversed ascending (excluding the top note to avoid duplication)
                descendingNotes = ascendingNotes.slice(0, -1).reverse();
            }
        }
        
        // Create combined notes array (only if not using pre-defined hand notes)
        const notes = (ascendingNotes && descendingNotes) ? [...ascendingNotes, ...descendingNotes] : [];
        
        // Define minimum starting notes for each hand
        const C2_MIDI = 36; // C2 (minimum for left hand in bass clef - default)
        const A1_MIDI = 33; // A1 (minimum for left hand in contrary motion scales)
        const E2_MIDI = 40; // E2 (minimum for left hand in dominant7 arpeggios)
        const F3_MIDI = 53; // F3 (minimum for right hand in treble clef)
        const F4_MIDI = 65; // F4
        const middleC = 60; // MIDI note for C4
        
        // Check if we're using pre-defined notes (dominant7 arpeggios, etc.)
        const usingPredefinedNotes = scale.ascendingNotes && scale.descendingNotes;
        
        // Only declare rightHandNotes and leftHandNotes if not already set from contrary motion database
        if (!rightHandNotes && !leftHandNotes) {
            if (usingPredefinedNotes) {
            // For pre-defined notes (like dominant7 arpeggios), use them directly for right hand
            // They already have the correct octaves set for right hand
            rightHandNotes = notes;
            
            // For left hand, transpose down to start from E2 minimum
            const startingNoteMidi = notes[0].midi;
            let leftHandShift = -24; // Start 2 octaves below right hand
            
            // Adjust up if we go below E2
            while (startingNoteMidi + leftHandShift < E2_MIDI) {
                leftHandShift += 12;
            }
            
            // Apply key context for proper enharmonic spelling
            const keyContext = scale.key;
            
            // Transpose left hand notes
            leftHandNotes = notes.map(note => ({
                name: MusicTheory.midiToNoteName(note.midi + leftHandShift, note.name.includes('b'), keyContext),
                midi: note.midi + leftHandShift,
                frequency: MusicTheory.midiToFrequency(note.midi + leftHandShift)
            }));
        } else if (scale.handsOptions.together && !scale.handsOptions.separately) {
            // Calculate transposition for each hand to meet minimum requirements
            const startingNoteMidi = notes[0].midi;
            
            // Right hand: minimum F3 in treble clef
            let rightHandShift = 0;
            while (startingNoteMidi + rightHandShift < F3_MIDI) {
                rightHandShift += 12;
            }
            
            // Left hand: start two octaves below right hand (typical piano range)
            // Then adjust up only if we go below the minimum (C2 for similar motion, A1 for contrary motion)
            let leftHandShift = rightHandShift - 24;
            
            // Ensure left hand doesn't go below minimum (A1 for contrary motion, C2 for similar motion)
            const leftHandMinimum = scale.handsOptions.contraryMotion ? A1_MIDI : C2_MIDI;
            while (startingNoteMidi + leftHandShift < leftHandMinimum) {
                leftHandShift += 12;
            }
            
            console.log('Transposition Debug:', {
                scaleStart: scale.range.startNote,
                startingNoteMidi,
                rightHandShift,
                leftHandShift,
                firstNoteRH: startingNoteMidi + rightHandShift,
                firstNoteLH: startingNoteMidi + leftHandShift,
                firstNoteNameRH: MusicTheory.midiToNoteName(startingNoteMidi + rightHandShift),
                firstNoteNameLH: MusicTheory.midiToNoteName(startingNoteMidi + leftHandShift)
            });
            
            // Apply transpositions with key context for proper enharmonic spelling
            const keyContext = scale.key; // Pass the key for context-aware note naming
            
            if (scale.handsOptions.contraryMotion) {
                // CONTRARY MOTION: Hands move in opposite directions
                // Both hands start on middle C (C4)
                // Right hand ascends: C4-D4-E4-F4-G4-A4-B4-C5-D5-E5-F5-G5-A5-B5-C6, then back down
                // Left hand descends: C4-B3-A3-G3-F3-E3-D3-C3-B2-A2-G2-F2-E2-D2-C2, then back up
                
                const middleC = 60; // MIDI 60 = C4
                const shiftToMiddleC = middleC - startingNoteMidi;
                
                // Right hand: Start on middle C, ascend, then descend back to middle C
                const rightAscending = ascendingNotes.map(note => ({
                    name: MusicTheory.midiToNoteName(note.midi + shiftToMiddleC, note.name.includes('b'), keyContext),
                    midi: note.midi + shiftToMiddleC,
                    frequency: MusicTheory.midiToFrequency(note.midi + shiftToMiddleC)
                }));
                const rightDescending = [...rightAscending].reverse().slice(1);
                rightHandNotes = [...rightAscending, ...rightDescending];
                
                // Left hand: Start on middle C (same as right hand)
                // Descend using the SAME intervals as right hand ascending, but going DOWN
                const leftDescending = [];
                let currentMidi = middleC; // Start on C4
                
                // Add starting note
                leftDescending.push({
                    name: MusicTheory.midiToNoteName(currentMidi, false, keyContext),
                    midi: currentMidi,
                    frequency: MusicTheory.midiToFrequency(currentMidi)
                });
                
                // Go DOWN using the intervals from rightAscending
                for (let i = 1; i < rightAscending.length; i++) {
                    const interval = rightAscending[i].midi - rightAscending[i-1].midi;
                    currentMidi -= interval; // Subtract to go down
                    leftDescending.push({
                        name: MusicTheory.midiToNoteName(currentMidi, false, keyContext),
                        midi: currentMidi,
                        frequency: MusicTheory.midiToFrequency(currentMidi)
                    });
                }
                
                // Then ascend back up (reverse without duplicate bottom note)
                const leftAscending = [...leftDescending].reverse().slice(1);
                leftHandNotes = [...leftDescending, ...leftAscending];
                
            } else {
                // SIMILAR MOTION: Both hands play the same direction
                rightHandNotes = notes.map(note => ({
                    name: MusicTheory.midiToNoteName(note.midi + rightHandShift, note.name.includes('b'), keyContext),
                    midi: note.midi + rightHandShift,
                    frequency: MusicTheory.midiToFrequency(note.midi + rightHandShift)
                }));
                
                leftHandNotes = notes.map(note => ({
                    name: MusicTheory.midiToNoteName(note.midi + leftHandShift, note.name.includes('b'), keyContext),
                    midi: note.midi + leftHandShift,
                    frequency: MusicTheory.midiToFrequency(note.midi + leftHandShift)
                }));
            }
            } else {
                // Hands separately: split at middle C
                rightHandNotes = notes.filter(n => n.midi >= middleC);
                leftHandNotes = notes.filter(n => n.midi < middleC);
            }
        }
        
        this.container.innerHTML = `
            <!-- Challenge Header -->
            <div class="row mb-4">
                <div class="col-12">
                    <h2 class="mb-1">${scale.displayName}</h2>
                    <div class="text-muted">
                        <span class="badge bg-primary me-2">${scale.type}</span>
                        <span class="badge bg-secondary me-2">${scale.category}</span>
                        <span class="badge bg-info">${scale.key} ${scale.tonality}</span>
                    </div>
                </div>
            </div>

            <!-- Scale Information Cards -->
            <div class="row mb-4">
                <div class="col-md-4 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">
                                <i class="bi bi-speedometer2 text-primary me-2"></i>Tempo
                            </h5>
                            <div class="fs-3">${scale.tempo.examTempo} <small class="text-muted fs-6">BPM</small></div>
                            <small class="text-muted">Recommended: ${scale.tempo.recommendedTempo} BPM</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">
                                <i class="bi bi-arrow-up-circle text-success me-2"></i>Range
                            </h5>
                            <div class="fs-5">${scale.range.octaves} Octaves</div>
                            <small class="text-muted">${scale.range.startNote} to ${scale.range.endNote}</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">
                                <i class="bi bi-hand-index text-warning me-2"></i>Hands
                            </h5>
                            <div class="d-flex flex-wrap gap-2 mt-2">
                                ${scale.handsOptions.together ? '<span class="badge bg-success">Together</span>' : ''}
                                ${scale.handsOptions.separately ? '<span class="badge bg-info">Separately</span>' : ''}
                                ${scale.handsOptions.contraryMotion ? '<span class="badge bg-warning">Contrary</span>' : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Practice Controls -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title mb-3">
                                <i class="bi bi-play-circle text-primary me-2"></i>Practice Controls
                            </h5>
                            
                            <!-- Audio Player -->
                            <div class="audio-player-section mb-3">
                                <div class="d-flex flex-wrap gap-3 align-items-center">
                                    <button id="play-reference" class="btn btn-primary">
                                        <i class="bi bi-play-fill me-2"></i><span id="play-button-text">Play Scale</span>
                                    </button>
                                    <div class="vr"></div>
                                    <div class="tempo-control">
                                        <label class="form-label mb-1 small">Tempo</label>
                                        <div class="input-group" style="width: 150px;">
                                            <button id="tempo-down" class="btn btn-outline-secondary btn-sm">
                                                <i class="bi bi-dash"></i>
                                            </button>
                                            <input type="number" id="tempo-input" class="form-control form-control-sm text-center" 
                                                   value="${scale.tempo.examTempo}" min="20" max="300" step="2">
                                            <button id="tempo-up" class="btn btn-outline-secondary btn-sm">
                                                <i class="bi bi-plus"></i>
                                            </button>
                                        </div>
                                        <small class="text-muted">BPM</small>
                                    </div>
                                </div>
                                <div id="audio-status" class="mt-2 text-muted small"></div>
                            </div>

                            <!-- Additional Controls -->
                            <div class="additional-controls mt-3 pt-3 border-top">
                                <div class="d-flex flex-wrap gap-3">
                                    <button id="start-recording" class="btn btn-outline-danger" disabled>
                                        <i class="bi bi-record-circle me-2"></i>Record Practice
                                    </button>
                                    <button id="show-fingering" class="btn btn-outline-info">
                                        <i class="bi bi-hand-index me-2"></i>Show Fingering
                                    </button>
                                </div>
                                <small class="text-muted mt-2 d-block">
                                    <i class="bi bi-info-circle me-1"></i>
                                    Recording feature coming soon. Metronome and audio playback are now functional!
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Scale Notes -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">
                                <i class="bi bi-music-note-list text-success me-2"></i>Scale Notation
                            </h5>
                            <div id="notation-output" class="scale-notation-display"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Practice Tips -->
            <div class="row mb-4">
                <div class="col-md-6 mb-3">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">
                                <i class="bi bi-lightbulb text-warning me-2"></i>Practice Tips
                            </h5>
                            <p class="mb-2">${scale.practiceNotes}</p>
                            <div class="mt-3">
                                <h6 class="text-muted small">Articulation Options:</h6>
                                <div class="d-flex gap-2">
                                    ${scale.articulation.legato ? '<span class="badge bg-success">Legato</span>' : ''}
                                    ${scale.articulation.staccato ? '<span class="badge bg-info">Staccato</span>' : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">
                                <i class="bi bi-exclamation-triangle text-danger me-2"></i>Common Mistakes
                            </h5>
                            <ul class="mb-0">
                                ${scale.commonMistakes.map(mistake => `
                                    <li class="mb-2">${mistake}</li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Difficulty Indicators -->
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title mb-3">
                                <i class="bi bi-bar-chart text-info me-2"></i>Difficulty Analysis
                            </h5>
                            <div class="row">
                                <div class="col-md-4 mb-2">
                                    <label class="small text-muted">Technical Level</label>
                                    <div class="progress" style="height: 25px;">
                                        <div class="progress-bar" role="progressbar" 
                                             style="width: ${(scale.difficulty.technicalLevel / 5) * 100}%"
                                             aria-valuenow="${scale.difficulty.technicalLevel}" 
                                             aria-valuemin="0" aria-valuemax="5">
                                            ${scale.difficulty.technicalLevel}/5
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4 mb-2">
                                    <label class="small text-muted">Fingering Complexity</label>
                                    <div class="progress" style="height: 25px;">
                                        <div class="progress-bar bg-warning" role="progressbar" 
                                             style="width: ${(scale.difficulty.fingeringComplexity / 5) * 100}%"
                                             aria-valuenow="${scale.difficulty.fingeringComplexity}" 
                                             aria-valuemin="0" aria-valuemax="5">
                                            ${scale.difficulty.fingeringComplexity}/5
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4 mb-2">
                                    <label class="small text-muted">Rhythmic Complexity</label>
                                    <div class="progress" style="height: 25px;">
                                        <div class="progress-bar bg-success" role="progressbar" 
                                             style="width: ${(scale.difficulty.rhythmicComplexity / 5) * 100}%"
                                             aria-valuenow="${scale.difficulty.rhythmicComplexity}" 
                                             aria-valuemin="0" aria-valuemax="5">
                                            ${scale.difficulty.rhythmicComplexity}/5
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Attach event listeners now that DOM is ready
        this.attachEventListeners();
        
        // Render musical notation after HTML is inserted
        this.renderNotation(rightHandNotes, leftHandNotes);
    }

    /**
     * Generate arpeggio notes
     * @param {string} rootNote - Root note with octave (e.g., "C2")
     * @param {Array} intervals - Array of intervals
     * @param {number} octaves - Number of octaves
     * @returns {Array} Array of note objects
     */
    generateArpeggio(rootNote, intervals, octaves) {
        const notes = [];
        let currentMidi = MusicTheory.noteNameToMidi(rootNote);
        const preferFlats = rootNote.includes('b');

        // For arpeggios: root, 3rd, 5th, octave, then repeat
        for (let octave = 0; octave < octaves; octave++) {
            for (let i = 0; i < intervals.length; i++) {
                notes.push({
                    name: MusicTheory.midiToNoteName(currentMidi, preferFlats),
                    midi: currentMidi,
                    frequency: MusicTheory.midiToFrequency(currentMidi)
                });
                currentMidi += intervals[i];
            }
        }
        
        // Add final tonic
        notes.push({
            name: MusicTheory.midiToNoteName(currentMidi, preferFlats),
            midi: currentMidi,
            frequency: MusicTheory.midiToFrequency(currentMidi)
        });

        return notes;
    }

    /**
     * Render musical notation using VexFlow
     * @param {Array} rightHandNotes - Array of note objects for right hand (treble clef)
     * @param {Array} leftHandNotes - Array of note objects for left hand (bass clef)
     */
    renderNotation(rightHandNotes, leftHandNotes) {
        try {
            console.log('renderNotation input:', {
                rightHandNotes: rightHandNotes.slice(0, 5).map(n => ({ name: n.name, midi: n.midi })),
                leftHandNotes: leftHandNotes.slice(0, 5).map(n => ({ name: n.name, midi: n.midi })),
                totalRH: rightHandNotes.length,
                totalLH: leftHandNotes.length
            });
            
            const VF = Vex.Flow;
            const scale = this.currentScale;
            
            const div = document.getElementById('notation-output');
            div.innerHTML = ''; // Clear previous content
            
            // Determine if hands are together (show grand staff) or separately (show separate staves)
            const handsTogetherMode = scale.handsOptions.together && !scale.handsOptions.separately;
            
            // Calculate notes to show based on scale type (ascending + descending)
            // Major/Minor scales: 2 octaves up + down = 15 + 15 - 1 = 29 notes
            // Chromatic scales: 1 octave up + down = 13 + 13 - 1 = 25 notes
            // Regular arpeggios: 2 octaves up + down = 9 + 9 - 1 = 17 notes
            // Dominant 7th arpeggios: 2 octaves ascending (9) + 2 octaves descending (8) = 17 notes (no resolution shown)
            let notesPerDisplay;
            if (scale.category === 'dominant7-arpeggio') {
                // Dominant 7th arpeggios: show 2 octaves only (same as regular arpeggios)
                // 4 notes per octave, 2 octaves = 8 notes + starting note = 9 ascending
                // Coming back down = 8 notes
                // Total = 17 notes (don't show the resolution note in the 2-octave display)
                notesPerDisplay = 17;
            } else if (scale.type === 'arpeggio') {
                notesPerDisplay = 17;
            } else if (scale.category === 'chromatic') {
                notesPerDisplay = 25;
            } else {
                notesPerDisplay = 29; // major/minor scales
            }
            
            // Create renderer with appropriate size
            // Width needs to accommodate stave + margins (add extra space for overflow)
            const rendererWidth = Math.max(1500, notesPerDisplay * 40 + 300);
            const rendererHeight = handsTogetherMode ? 300 : 400;
            const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
            renderer.resize(rendererWidth, rendererHeight);
            const context = renderer.getContext();
            
            // Helper function to convert notes to VexFlow format
            const convertToVexNotes = (notes, maxNotes = notesPerDisplay, debugLabel = '', clef = 'treble') => {
                const notesToConvert = notes.slice(0, maxNotes);
                const result = notesToConvert.map((note, index) => {
                    // Parse note name (e.g., "C4" -> note: "C", octave: "4", or "Dn4" -> note: "D", octave: "4", natural: true)
                    const match = note.name.match(/^([A-G][#bn]?)(\d+)$/);
                    if (!match) return null;
                    
                    const [, noteName, octave] = match;
                    let vexNoteName = noteName.toLowerCase();
                    
                    // Handle accidentals
                    const hasSharp = noteName.includes('#');
                    const hasFlat = noteName.includes('b');
                    const hasNatural = noteName.includes('n');
                    
                    // Remove accidental from note name for VexFlow
                    if (hasSharp || hasFlat || hasNatural) {
                        vexNoteName = noteName[0].toLowerCase();
                    }
                    
                    const vexKey = vexNoteName + '/' + octave;
                    if (index === 0) {
                        console.log(`${debugLabel} First note:`, note.name, '-> VexFlow key:', vexKey, 'MIDI:', note.midi, 'Clef:', clef);
                    }
                    
                    // Last note is a quarter note, all others are eighth notes
                    const isLastNote = (index === notesToConvert.length - 1);
                    const duration = isLastNote ? 'q' : '8';
                    
                    const vexNote = new VF.StaveNote({
                        keys: [vexKey],
                        duration: duration, // quarter note for last note, eighth notes for others
                        clef: clef
                    });
                    
                    // Add accidentals for:
                    // 1. Chromatic scales (all accidentals shown)
                    // 2. Harmonic/melodic minor (for chromatic alterations like raised 7th)
                    // 3. Unusual notes that aren't in standard key signatures (B#, Cb, Fb)
                    // 4. Natural notes in sharp keys (E in F# major, etc.)
                    // Note: Dominant 7th arpeggios use key signature, no extra accidentals needed
                    const isUnusualNote = noteName === 'B#' || noteName === 'Cb' || noteName === 'Fb';
                    
                    // Check if this is a natural note in a sharp key that needs a natural sign
                    const needsNaturalSign = (scale.key === 'F#' && noteName === 'E') ||
                                           (scale.key === 'C#' && noteName === 'B') ||
                                           hasNatural; // Explicitly marked with 'n' (like "Dn4")
                    
                    if (scale.category === 'chromatic' || 
                        scale.category === 'minorHarmonic' || 
                        scale.category === 'minorMelodic' ||
                        isUnusualNote) {
                        if (hasSharp) {
                            vexNote.addModifier(new VF.Accidental('#'), 0);
                        } else if (hasFlat) {
                            vexNote.addModifier(new VF.Accidental('b'), 0);
                        } else if (hasNatural) {
                            vexNote.addModifier(new VF.Accidental('n'), 0);
                        }
                    } else if (needsNaturalSign) {
                        vexNote.addModifier(new VF.Accidental('n'), 0);
                    }
                    
                    return vexNote;
                }).filter(n => n !== null);
                return result;
            };

            if (handsTogetherMode && rightHandNotes.length > 0 && leftHandNotes.length > 0) {
                // GRAND STAFF MODE - Both hands together as in piano music
                // Calculate stave width based on number of notes
                const notesToDisplay = Math.min(rightHandNotes.length, leftHandNotes.length, notesPerDisplay);
                // Use compact spacing
                const pixelsPerNote = scale.category === 'chromatic' ? 26 : 34;
                // VexFlow adds clef & key signature INSIDE the stave width, so we need extra space:
                // - Clef: ~60px
                // - Key signature (6 sharps): ~120px  
                // - End margin & barline: ~50px
                const staveWidth = Math.max(1300, notesToDisplay * pixelsPerNote + 230);
                
                // Determine key signature (chromatic scales don't use key signatures)
                let keySignature = null;
                if (scale.category !== 'chromatic') {
                    keySignature = scale.key;
                    if (scale.tonality === 'minor') {
                        keySignature = scale.key + 'm'; // VexFlow uses 'm' suffix for minor keys
                    }
                }
                
                const trebleStave = new VF.Stave(10, 40, staveWidth);
                trebleStave.addClef('treble');
                if (keySignature) {
                    trebleStave.addKeySignature(keySignature);
                }
                trebleStave.setEndBarType(2); // Add final barline (2 = END barline)
                trebleStave.setContext(context).draw();

                const bassStave = new VF.Stave(10, 140, staveWidth);
                bassStave.addClef('bass');
                if (keySignature) {
                    bassStave.addKeySignature(keySignature);
                }
                bassStave.setEndBarType(2); // Add final barline (2 = END barline)
                bassStave.setContext(context).draw();

                // Add brace connecting the staves
                const brace = new VF.StaveConnector(trebleStave, bassStave);
                brace.setType(VF.StaveConnector.type.BRACE);
                brace.setContext(context).draw();

                // Add line connecting the staves
                const line = new VF.StaveConnector(trebleStave, bassStave);
                line.setType(VF.StaveConnector.type.SINGLE_LEFT);
                line.setContext(context).draw();

                // Convert notes - ensure both hands have same number of notes
                const trebleVexNotes = convertToVexNotes(rightHandNotes, notesPerDisplay, 'Treble', 'treble');
                const bassVexNotes = convertToVexNotes(leftHandNotes, notesPerDisplay, 'Bass', 'bass');
                
                // Make sure both voices have the same number of notes
                const maxNotes = Math.min(trebleVexNotes.length, bassVexNotes.length);
                const trebleNotesToUse = trebleVexNotes.slice(0, maxNotes);
                const bassNotesToUse = bassVexNotes.slice(0, maxNotes);

                // Create voices with matching tick durations
                // Calculate total beats: (maxNotes - 1) eighth notes + 1 quarter note = (maxNotes - 1)/2 + 1/2 = maxNotes/2
                const totalBeats = maxNotes / 2;
                const trebleVoice = new VF.Voice({ num_beats: totalBeats, beat_value: 4 });
                trebleVoice.setStrict(false); // Allow flexibility in voice timing
                trebleVoice.addTickables(trebleNotesToUse);

                const bassVoice = new VF.Voice({ num_beats: totalBeats, beat_value: 4 });
                bassVoice.setStrict(false); // Allow flexibility in voice timing
                bassVoice.addTickables(bassNotesToUse);

                // Generate beams BEFORE drawing voices
                const trebleBeams = VF.Beam.generateBeams(trebleNotesToUse);
                const bassBeams = VF.Beam.generateBeams(bassNotesToUse);

                // Format and draw - calculate available width with tighter spacing
                const formatterWidth = staveWidth - 30; // Account for clef and margins
                new VF.Formatter()
                    .joinVoices([trebleVoice, bassVoice])
                    .format([trebleVoice, bassVoice], formatterWidth);

                // Draw voices
                trebleVoice.draw(context, trebleStave);
                bassVoice.draw(context, bassStave);

                // Draw beams after voices
                trebleBeams.forEach(beam => beam.setContext(context).draw());
                bassBeams.forEach(beam => beam.setContext(context).draw());

            } else {
                // SEPARATE STAVES MODE - Hands shown separately
                const notesToDisplay = notesPerDisplay;
                const staveWidth = Math.max(1200, notesToDisplay * 40);
                
                // Determine key signature (chromatic scales don't use key signatures)
                let keySignature = null;
                if (scale.category !== 'chromatic') {
                    keySignature = scale.key;
                    if (scale.tonality === 'minor') {
                        keySignature = scale.key + 'm';
                    }
                }
                
                // Render treble clef (right hand) if there are notes
                if (rightHandNotes && rightHandNotes.length > 0) {
                    const trebleStave = new VF.Stave(10, 40, staveWidth);
                    trebleStave.addClef('treble');
                    if (keySignature) {
                        trebleStave.addKeySignature(keySignature);
                    }
                    trebleStave.setText('R.H.', VF.Modifier.Position.ABOVE);
                    trebleStave.setEndBarType(2); // Add final barline (2 = END barline)
                    trebleStave.setContext(context).draw();

                    const vexNotes = convertToVexNotes(rightHandNotes);
                    const beams = VF.Beam.generateBeams(vexNotes);

                    // Calculate total beats: (num notes - 1) eighth notes + 1 quarter note
                    const totalBeats = vexNotes.length / 2;
                    const voice = new VF.Voice({ num_beats: totalBeats, beat_value: 4 });
                    voice.setStrict(false);
                    voice.addTickables(vexNotes);

                    new VF.Formatter()
                        .joinVoices([voice])
                        .format([voice], staveWidth - 30);

                    voice.draw(context, trebleStave);
                    beams.forEach(beam => beam.setContext(context).draw());
                }

                // Render bass clef (left hand) if there are notes
                if (leftHandNotes && leftHandNotes.length > 0) {
                    const bassStave = new VF.Stave(10, 220, staveWidth);
                    bassStave.addClef('bass');
                    if (keySignature) {
                        bassStave.addKeySignature(keySignature);
                    }
                    bassStave.setText('L.H.', VF.Modifier.Position.ABOVE);
                    bassStave.setEndBarType(2); // Add final barline (2 = END barline)
                    bassStave.setContext(context).draw();

                    const vexNotes = convertToVexNotes(leftHandNotes);
                    const beams = VF.Beam.generateBeams(vexNotes);

                    // Calculate total beats: (num notes - 1) eighth notes + 1 quarter note
                    const totalBeats = vexNotes.length / 2;
                    const voice = new VF.Voice({ num_beats: totalBeats, beat_value: 4 });
                    voice.setStrict(false);
                    voice.addTickables(vexNotes);

                    new VF.Formatter()
                        .joinVoices([voice])
                        .format([voice], staveWidth - 30);

                    voice.draw(context, bassStave);
                    beams.forEach(beam => beam.setContext(context).draw());
                }
            }

            // Show note counts
            const noteInfo = document.createElement('p');
            noteInfo.className = 'text-muted small mt-2 mb-0';
            const displayMode = handsTogetherMode ? 'Grand Staff (Hands Together)' : 'Separate Staves';
            const octaveText = scale.category === 'chromatic' ? '1 octave' : '2 octaves';
            noteInfo.textContent = `${displayMode} - Showing ${octaveText} (ascending + descending) | R.H.: ${Math.min(rightHandNotes.length, notesPerDisplay)} notes | L.H.: ${Math.min(leftHandNotes.length, notesPerDisplay)} notes`;
            div.appendChild(noteInfo);
            
            console.log(`Musical notation rendered: ${rightHandNotes.length} R.H. notes, ${leftHandNotes.length} L.H. notes (${displayMode})`);
        } catch (error) {
            console.error('Error rendering notation:', error);
            // Fallback to text display
            const div = document.getElementById('notation-output');
            div.innerHTML = `
                <div class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Could not render musical notation.
                </div>
            `;
        }
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Audio Player Controls
        const playBtn = document.getElementById('play-reference');
        const tempoInput = document.getElementById('tempo-input');
        const tempoUpBtn = document.getElementById('tempo-up');
        const tempoDownBtn = document.getElementById('tempo-down');
        const audioStatus = document.getElementById('audio-status');
        const playButtonText = document.getElementById('play-button-text');

        if (playBtn) {
            playBtn.addEventListener('click', async () => {
                if (audioPlayer.isPlaying) {
                    // Stop playback
                    audioPlayer.stop();
                    playBtn.classList.remove('btn-danger');
                    playBtn.classList.add('btn-primary');
                    playButtonText.textContent = 'Play Scale';
                    playBtn.innerHTML = '<i class="bi bi-play-fill me-2"></i><span id="play-button-text">Play Scale</span>';
                    if (audioStatus) audioStatus.textContent = '';
                } else {
                    // Start playback
                    const tempo = parseInt(tempoInput.value) || this.currentScale.tempo.examTempo;
                    playBtn.classList.remove('btn-primary');
                    playBtn.classList.add('btn-danger');
                    playButtonText.textContent = 'Stop';
                    playBtn.innerHTML = '<i class="bi bi-stop-fill me-2"></i><span id="play-button-text">Stop</span>';
                    if (audioStatus) audioStatus.textContent = 'Playing...';
                    
                    await audioPlayer.play(this.currentScale, tempo);
                    
                    // Reset UI after playback completes
                    playBtn.classList.remove('btn-danger');
                    playBtn.classList.add('btn-primary');
                    playBtn.innerHTML = '<i class="bi bi-play-fill me-2"></i><span id="play-button-text">Play Scale</span>';
                    if (audioStatus) audioStatus.textContent = '';
                }
            });
        }

        if (tempoUpBtn && tempoInput) {
            tempoUpBtn.addEventListener('click', () => {
                const newTempo = Math.min(300, parseInt(tempoInput.value) + 2);
                tempoInput.value = newTempo;
                if (audioPlayer.isPlaying) {
                    audioPlayer.setTempo(newTempo);
                }
            });
        }

        if (tempoDownBtn && tempoInput) {
            tempoDownBtn.addEventListener('click', () => {
                const newTempo = Math.max(20, parseInt(tempoInput.value) - 2);
                tempoInput.value = newTempo;
                if (audioPlayer.isPlaying) {
                    audioPlayer.setTempo(newTempo);
                }
            });
        }

        if (tempoInput) {
            tempoInput.addEventListener('change', () => {
                const newTempo = Math.max(20, Math.min(300, parseInt(tempoInput.value)));
                tempoInput.value = newTempo;
                if (audioPlayer.isPlaying) {
                    audioPlayer.setTempo(newTempo);
                }
            });
        }

        // Show fingering button
        const fingeringBtn = document.getElementById('show-fingering');
        if (fingeringBtn) {
            fingeringBtn.addEventListener('click', () => {
                Helpers.showToast('Fingering diagram feature coming in Phase 4!', 'info');
            });
        }
    }
}

let scaleChallenge = null;
