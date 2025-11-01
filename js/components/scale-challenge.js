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
        this.attachEventListeners();
        console.log('Scale challenge rendered');
    }

    /**
     * Render the challenge view
     */
    async render() {
        const scale = this.currentScale;
        
        // Generate scale notes - use the correct method based on type
        let notes;
        if (scale.type === 'arpeggio') {
            // For arpeggios, use arpeggio intervals
            const intervals = scale.category === 'major' 
                ? MusicTheory.INTERVALS.majorArpeggio 
                : MusicTheory.INTERVALS.minorArpeggio;
            notes = this.generateArpeggio(scale.range.startNote, intervals, scale.range.octaves);
        } else {
            // For scales, use generateScale
            notes = MusicTheory.generateScale(scale.range.startNote, scale.category, scale.range.octaves);
        }
        
        // Split notes into right hand (treble) and left hand (bass)
        // Typically split at middle C (C4)
        const middleC = 60; // MIDI note for C4
        const rightHandNotes = notes.filter(n => n.midi >= middleC);
        const leftHandNotes = notes.filter(n => n.midi < middleC);
        
        this.container.innerHTML = `
            <!-- Challenge Header -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 class="mb-1">${scale.displayName}</h2>
                            <div class="text-muted">
                                <span class="badge bg-primary me-2">${scale.type}</span>
                                <span class="badge bg-secondary me-2">${scale.category}</span>
                                <span class="badge bg-info">${scale.key} ${scale.tonality}</span>
                            </div>
                        </div>
                        <button id="back-to-dashboard" class="btn btn-outline-secondary">
                            <i class="bi bi-arrow-left me-2"></i>Back to Dashboard
                        </button>
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
                            <div class="d-flex flex-wrap gap-3">
                                <button id="play-reference" class="btn btn-primary" disabled>
                                    <i class="bi bi-play-fill me-2"></i>Play Reference
                                </button>
                                <button id="start-recording" class="btn btn-danger" disabled>
                                    <i class="bi bi-record-circle me-2"></i>Record Practice
                                </button>
                                <button id="toggle-metronome" class="btn btn-outline-secondary" disabled>
                                    <i class="bi bi-music-note me-2"></i>Metronome
                                </button>
                                <div class="vr"></div>
                                <button id="show-fingering" class="btn btn-outline-info">
                                    <i class="bi bi-hand-index me-2"></i>Show Fingering
                                </button>
                            </div>
                            <div class="alert alert-info mt-3 mb-0">
                                <i class="bi bi-info-circle me-2"></i>
                                <strong>Audio features coming in Phase 3.</strong> 
                                For now, use this view to see scale information and notes.
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
            const VF = Vex.Flow;
            
            const div = document.getElementById('notation-output');
            div.innerHTML = ''; // Clear previous content
            
            // Create renderer with enough height for two staves
            const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
            renderer.resize(900, 400);
            const context = renderer.getContext();
            
            // Helper function to convert notes to VexFlow format
            const convertToVexNotes = (notes, maxNotes = 16) => {
                return notes.slice(0, maxNotes).map(note => {
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
                    
                    const vexNote = new VF.StaveNote({
                        keys: [vexNoteName + '/' + octave],
                        duration: '8' // 8th note
                    });
                    
                    // Add accidental modifier
                    if (hasSharp) {
                        vexNote.addModifier(new VF.Accidental('#'), 0);
                    } else if (hasFlat) {
                        vexNote.addModifier(new VF.Accidental('b'), 0);
                    }
                    
                    return vexNote;
                }).filter(n => n !== null);
            };

            // Render treble clef (right hand) if there are notes
            if (rightHandNotes && rightHandNotes.length > 0) {
                const trebleStave = new VF.Stave(10, 40, 880);
                trebleStave.addClef('treble');
                trebleStave.setText('R.H.', VF.Modifier.Position.ABOVE);
                trebleStave.setContext(context).draw();

                const vexNotes = convertToVexNotes(rightHandNotes);
                const beams = VF.Beam.generateBeams(vexNotes);

                const voice = new VF.Voice({ num_beats: vexNotes.length, beat_value: 8 });
                voice.addTickables(vexNotes);

                new VF.Formatter()
                    .joinVoices([voice])
                    .format([voice], 850);

                voice.draw(context, trebleStave);
                beams.forEach(beam => beam.setContext(context).draw());
            }

            // Render bass clef (left hand) if there are notes
            if (leftHandNotes && leftHandNotes.length > 0) {
                const bassStave = new VF.Stave(10, 220, 880);
                bassStave.addClef('bass');
                bassStave.setText('L.H.', VF.Modifier.Position.ABOVE);
                bassStave.setContext(context).draw();

                const vexNotes = convertToVexNotes(leftHandNotes);
                const beams = VF.Beam.generateBeams(vexNotes);

                const voice = new VF.Voice({ num_beats: vexNotes.length, beat_value: 8 });
                voice.addTickables(vexNotes);

                new VF.Formatter()
                    .joinVoices([voice])
                    .format([voice], 850);

                voice.draw(context, bassStave);
                beams.forEach(beam => beam.setContext(context).draw());
            }

            // Show note counts
            const noteInfo = document.createElement('p');
            noteInfo.className = 'text-muted small mt-2 mb-0';
            noteInfo.textContent = `R.H.: ${rightHandNotes.length} notes | L.H.: ${leftHandNotes.length} notes`;
            div.appendChild(noteInfo);
            
            console.log(`Musical notation rendered: ${rightHandNotes.length} R.H. notes, ${leftHandNotes.length} L.H. notes`);
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
        // Back button
        const backBtn = document.getElementById('back-to-dashboard');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                app.showView('dashboard');
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
