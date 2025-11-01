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
        
        // Generate scale notes - use startNote from range which includes octave
        const notes = MusicTheory.generateScale(scale.range.startNote, scale.category, scale.range.octaves);
        
        // Extract just the note names for display
        const noteNames = notes.map(n => n.name);
        
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
                                <i class="bi bi-music-note-list text-success me-2"></i>Scale Notes
                            </h5>
                            <div class="scale-notes-display p-3 bg-light rounded">
                                <div class="d-flex flex-wrap gap-2">
                                    ${noteNames.map((note, i) => `
                                        <span class="badge bg-primary fs-6 px-3 py-2">
                                            ${note}
                                            <small class="text-white-50 ms-1">${i + 1}</small>
                                        </span>
                                    `).join('')}
                                </div>
                            </div>
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
