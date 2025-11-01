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
        let ascendingNotes;
        if (scale.type === 'arpeggio') {
            // For arpeggios, use arpeggio intervals
            const intervals = scale.category === 'major' 
                ? MusicTheory.INTERVALS.majorArpeggio 
                : MusicTheory.INTERVALS.minorArpeggio;
            ascendingNotes = this.generateArpeggio(scale.range.startNote, intervals, displayOctaves);
        } else {
            // For scales, use generateScale
            ascendingNotes = MusicTheory.generateScale(scale.range.startNote, scale.category, displayOctaves);
        }
        
        // Add descending notes (excluding the top note to avoid duplication)
        const descendingNotes = ascendingNotes.slice(0, -1).reverse();
        const notes = [...ascendingNotes, ...descendingNotes];
        
        // Define minimum starting notes for each hand
        const F2_MIDI = 41; // F2 (minimum for left hand in bass clef)
        const F3_MIDI = 53; // F3 (minimum for right hand in treble clef)
        const F4_MIDI = 65; // F4
        const middleC = 60; // MIDI note for C4
        
        let rightHandNotes, leftHandNotes;
        
        if (scale.handsOptions.together && !scale.handsOptions.separately) {
            // Calculate transposition for each hand to meet minimum requirements
            const startingNoteMidi = notes[0].midi;
            
            // Right hand: minimum F3 in treble clef
            let rightHandShift = 0;
            while (startingNoteMidi + rightHandShift < F3_MIDI) {
                rightHandShift += 12;
            }
            
            // Left hand: one octave below right hand for the actual pitch
            let leftHandShift = rightHandShift - 12;
            
            // Ensure left hand doesn't go below F2
            while (startingNoteMidi + leftHandShift < F2_MIDI) {
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
            
            // Apply transpositions
            rightHandNotes = notes.map(note => ({
                name: MusicTheory.midiToNoteName(note.midi + rightHandShift, note.name.includes('b')),
                midi: note.midi + rightHandShift,
                frequency: MusicTheory.midiToFrequency(note.midi + rightHandShift)
            }));
            
            leftHandNotes = notes.map(note => ({
                name: MusicTheory.midiToNoteName(note.midi + leftHandShift, note.name.includes('b')),
                midi: note.midi + leftHandShift,
                frequency: MusicTheory.midiToFrequency(note.midi + leftHandShift)
            }));
        } else {
            // Hands separately: split at middle C
            rightHandNotes = notes.filter(n => n.midi >= middleC);
            leftHandNotes = notes.filter(n => n.midi < middleC);
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
                                                   value="${scale.tempo.recommendedTempo}" min="20" max="300" step="2">
                                            <button id="tempo-up" class="btn btn-outline-secondary btn-sm">
                                                <i class="bi bi-plus"></i>
                                            </button>
                                        </div>
                                        <small class="text-muted">BPM</small>
                                    </div>
                                </div>
                                <div id="audio-status" class="mt-2 text-muted small"></div>
                            </div>

                            <!-- Metronome -->
                            <div class="metronome-section mt-3 pt-3 border-top">
                                <div class="d-flex flex-wrap gap-3 align-items-center">
                                    <button id="toggle-metronome" class="btn btn-outline-secondary">
                                        <i class="bi bi-music-note me-2"></i><span id="metronome-button-text">Start Metronome</span>
                                    </button>
                                    <div class="tempo-control">
                                        <label class="form-label mb-1 small">Metronome Tempo</label>
                                        <div class="input-group" style="width: 150px;">
                                            <button id="metro-tempo-down" class="btn btn-outline-secondary btn-sm">
                                                <i class="bi bi-dash"></i>
                                            </button>
                                            <input type="number" id="metro-tempo-input" class="form-control form-control-sm text-center" 
                                                   value="${scale.tempo.recommendedTempo}" min="20" max="300" step="2">
                                            <button id="metro-tempo-up" class="btn btn-outline-secondary btn-sm">
                                                <i class="bi bi-plus"></i>
                                            </button>
                                        </div>
                                        <small class="text-muted">BPM</small>
                                    </div>
                                    <div class="beat-indicator ms-3">
                                        <div id="beat-display" class="d-flex gap-2">
                                            <div class="beat-dot"></div>
                                            <div class="beat-dot"></div>
                                            <div class="beat-dot"></div>
                                            <div class="beat-dot"></div>
                                        </div>
                                    </div>
                                </div>
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
            // Arpeggios: 2 octaves up + down = 9 + 9 - 1 = 17 notes
            let notesPerDisplay;
            if (scale.type === 'arpeggio') {
                notesPerDisplay = 17;
            } else if (scale.category === 'chromatic') {
                notesPerDisplay = 25;
            } else {
                notesPerDisplay = 29; // major/minor scales
            }
            
            // Create renderer with appropriate size
            // Width needs to accommodate all notes (approximately 40 pixels per note)
            const rendererWidth = Math.max(1250, notesPerDisplay * 40 + 100);
            const rendererHeight = handsTogetherMode ? 300 : 400;
            const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
            renderer.resize(rendererWidth, rendererHeight);
            const context = renderer.getContext();
            
            // Helper function to convert notes to VexFlow format
            const convertToVexNotes = (notes, maxNotes = notesPerDisplay, debugLabel = '', clef = 'treble') => {
                const result = notes.slice(0, maxNotes).map((note, index) => {
                    // Parse note name (e.g., "C4" -> note: "C", octave: "4")
                    const match = note.name.match(/^([A-G][#b]?)(\d+)$/);
                    if (!match) return null;
                    
                    const [, noteName, octave] = match;
                    let vexNoteName = noteName.toLowerCase();
                    
                    // Handle accidentals
                    const hasSharp = noteName.includes('#');
                    const hasFlat = noteName.includes('b');
                    
                    // Remove accidental from note name for VexFlow
                    if (hasSharp || hasFlat) {
                        vexNoteName = noteName[0].toLowerCase();
                    }
                    
                    const vexKey = vexNoteName + '/' + octave;
                    if (index === 0) {
                        console.log(`${debugLabel} First note:`, note.name, '-> VexFlow key:', vexKey, 'MIDI:', note.midi, 'Clef:', clef);
                    }
                    
                    const vexNote = new VF.StaveNote({
                        keys: [vexKey],
                        duration: '8', // 8th note
                        clef: clef
                    });
                    
                    // Add accidentals for:
                    // 1. Chromatic scales (all accidentals shown)
                    // 2. Harmonic/melodic minor (for chromatic alterations like raised 7th)
                    if (scale.category === 'chromatic' || 
                        scale.category === 'minorHarmonic' || 
                        scale.category === 'minorMelodic') {
                        if (hasSharp) {
                            vexNote.addModifier(new VF.Accidental('#'), 0);
                        } else if (hasFlat) {
                            vexNote.addModifier(new VF.Accidental('b'), 0);
                        }
                    }
                    
                    return vexNote;
                }).filter(n => n !== null);
                return result;
            };

            if (handsTogetherMode && rightHandNotes.length > 0 && leftHandNotes.length > 0) {
                // GRAND STAFF MODE - Both hands together as in piano music
                // Calculate stave width based on number of notes
                const notesToDisplay = Math.min(rightHandNotes.length, leftHandNotes.length, notesPerDisplay);
                // Use tighter spacing for chromatic scales to make it more compact
                const pixelsPerNote = scale.category === 'chromatic' ? 32 : 40;
                const staveWidth = Math.max(1100, notesToDisplay * pixelsPerNote);
                
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
                const trebleVoice = new VF.Voice({ num_beats: maxNotes, beat_value: 8 });
                trebleVoice.setStrict(false); // Allow flexibility in voice timing
                trebleVoice.addTickables(trebleNotesToUse);

                const bassVoice = new VF.Voice({ num_beats: maxNotes, beat_value: 8 });
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

                    const voice = new VF.Voice({ num_beats: vexNotes.length, beat_value: 8 });
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

                    const voice = new VF.Voice({ num_beats: vexNotes.length, beat_value: 8 });
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
                    const tempo = parseInt(tempoInput.value) || this.currentScale.tempo.recommendedTempo;
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

        // Metronome Controls
        const metronomeBtn = document.getElementById('toggle-metronome');
        const metroTempoInput = document.getElementById('metro-tempo-input');
        const metroTempoUpBtn = document.getElementById('metro-tempo-up');
        const metroTempoDownBtn = document.getElementById('metro-tempo-down');
        const metronomeButtonText = document.getElementById('metronome-button-text');

        if (metronomeBtn) {
            metronomeBtn.addEventListener('click', () => {
                if (metronome.isPlaying) {
                    metronome.stop();
                    metronomeBtn.classList.remove('btn-secondary');
                    metronomeBtn.classList.add('btn-outline-secondary');
                    metronomeButtonText.textContent = 'Start Metronome';
                    this.clearBeatIndicators();
                } else {
                    const tempo = parseInt(metroTempoInput.value) || this.currentScale.tempo.recommendedTempo;
                    metronome.start(tempo, 4);
                    metronomeBtn.classList.remove('btn-outline-secondary');
                    metronomeBtn.classList.add('btn-secondary');
                    metronomeButtonText.textContent = 'Stop Metronome';
                }
            });
        }

        if (metroTempoUpBtn && metroTempoInput) {
            metroTempoUpBtn.addEventListener('click', () => {
                const newTempo = Math.min(300, parseInt(metroTempoInput.value) + 2);
                metroTempoInput.value = newTempo;
                if (metronome.isPlaying) {
                    metronome.setTempo(newTempo);
                }
            });
        }

        if (metroTempoDownBtn && metroTempoInput) {
            metroTempoDownBtn.addEventListener('click', () => {
                const newTempo = Math.max(20, parseInt(metroTempoInput.value) - 2);
                metroTempoInput.value = newTempo;
                if (metronome.isPlaying) {
                    metronome.setTempo(newTempo);
                }
            });
        }

        if (metroTempoInput) {
            metroTempoInput.addEventListener('change', () => {
                const newTempo = Math.max(20, Math.min(300, parseInt(metroTempoInput.value)));
                metroTempoInput.value = newTempo;
                if (metronome.isPlaying) {
                    metronome.setTempo(newTempo);
                }
            });
        }

        // Listen for metronome beats to update visual indicator
        metronome.clearCallbacks();
        metronome.onBeat((beatNumber, isDownbeat) => {
            this.updateBeatIndicator(beatNumber, isDownbeat);
        });

        // Show fingering button
        const fingeringBtn = document.getElementById('show-fingering');
        if (fingeringBtn) {
            fingeringBtn.addEventListener('click', () => {
                Helpers.showToast('Fingering diagram feature coming in Phase 4!', 'info');
            });
        }
    }

    /**
     * Update the visual beat indicator
     * @param {number} beatNumber - Current beat (0-indexed)
     * @param {boolean} isDownbeat - True if first beat of bar
     */
    updateBeatIndicator(beatNumber, isDownbeat) {
        const beatDots = document.querySelectorAll('.beat-dot');
        if (beatDots.length === 0) return;

        // Clear all dots
        beatDots.forEach(dot => {
            dot.classList.remove('active', 'downbeat');
        });

        // Highlight current beat
        const currentDot = beatDots[beatNumber % beatDots.length];
        if (currentDot) {
            currentDot.classList.add('active');
            if (isDownbeat) {
                currentDot.classList.add('downbeat');
            }
        }
    }

    /**
     * Clear beat indicator highlights
     */
    clearBeatIndicators() {
        const beatDots = document.querySelectorAll('.beat-dot');
        beatDots.forEach(dot => {
            dot.classList.remove('active', 'downbeat');
        });
    }
}

let scaleChallenge = null;
