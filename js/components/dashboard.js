/**
 * Dashboard Component
 * Main landing view with scale selection and statistics
 */

class Dashboard {
    constructor() {
        this.container = document.getElementById('dashboard-view');
        this.initPromise = this.init();
    }

    /**
     * Initialize dashboard
     */
    async init() {
        await this.render();
        this.attachEventListeners();
        return this;
    }

    /**
     * Render dashboard content
     */
    async render() {
        console.log('Dashboard rendering...');
        const stats = await progressTracker.getUserStatistics();
        const weakAreas = await progressTracker.getWeakAreas(3);
        const allScales = ScalesData.getAllScales();
        console.log('Dashboard data loaded:', { stats, weakAreas: weakAreas.length, scales: allScales.length });

        this.container.innerHTML = `
            <!-- Hero Section -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card text-center shadow-sm">
                        <div class="card-body py-5">
                            <h1 class="display-4 mb-3">ABRSM Grade 8 Scales</h1>
                            <p class="lead text-muted mb-4">Master your scales with adaptive practice</p>
                            <button id="random-scale-btn" class="btn btn-primary btn-lg px-5">
                                <i class="bi bi-shuffle me-2"></i>Start Random Practice
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Statistics Cards -->
            <div class="row mb-4">
                <div class="col-md-3 col-sm-6 mb-3">
                    <div class="card stat-card">
                        <div class="card-body text-center">
                            <div class="stat-value">${stats.totalScales}</div>
                            <div class="stat-label">Total Scales</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6 mb-3">
                    <div class="card stat-card">
                        <div class="card-body text-center">
                            <div class="stat-value">${stats.practiceScales}</div>
                            <div class="stat-label">Practiced</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6 mb-3">
                    <div class="card stat-card">
                        <div class="card-body text-center">
                            <div class="stat-value">${stats.masteredCount}</div>
                            <div class="stat-label">Mastered</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6 mb-3">
                    <div class="card stat-card">
                        <div class="card-body text-center">
                            <div class="stat-value">${stats.averageAccuracy}%</div>
                            <div class="stat-label">Avg Accuracy</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Practice Options -->
            <div class="row mb-4">
                <div class="col-md-6 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">
                                <i class="bi bi-bullseye text-warning me-2"></i>Weak Areas
                            </h5>
                            ${weakAreas.length > 0 ? `
                                <ul class="list-unstyled mb-0">
                                    ${weakAreas.map(scale => `
                                        <li class="d-flex justify-content-between align-items-center mb-2">
                                            <span>${scale.displayName || scale.name}</span>
                                            <span class="badge bg-${Helpers.getAccuracyColor(scale.accuracy)}">${Math.round(scale.accuracy)}%</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            ` : `
                                <p class="text-muted mb-0">No practice data yet. Start practicing to see your progress!</p>
                            `}
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">
                                <i class="bi bi-list-ul text-info me-2"></i>Browse Scales
                            </h5>
                            <div class="mb-3">
                                <input type="text" 
                                       id="scale-search" 
                                       class="form-control mb-2" 
                                       placeholder="Search scales...">
                                <div class="btn-group w-100" role="group">
                                    <button type="button" class="btn btn-sm btn-outline-secondary filter-btn active" data-filter="all">All (${allScales.length})</button>
                                    <button type="button" class="btn btn-sm btn-outline-secondary filter-btn" data-filter="scale">Scales</button>
                                    <button type="button" class="btn btn-sm btn-outline-secondary filter-btn" data-filter="arpeggio">Arpeggios</button>
                                </div>
                            </div>
                            <div id="scale-list" class="list-group" style="max-height: 300px; overflow-y: auto;">
                                ${this.renderScaleList(allScales)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Start Guide -->
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">
                                <i class="bi bi-lightbulb text-success me-2"></i>Quick Start
                            </h5>
                            <div class="row">
                                <div class="col-md-4 mb-3 mb-md-0">
                                    <div class="text-center">
                                        <div class="mb-2"><i class="bi bi-play-circle fs-1 text-primary"></i></div>
                                        <h6>1. Select a Scale</h6>
                                        <p class="text-muted small">Click "Start Random Practice" or browse the scale list</p>
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3 mb-md-0">
                                    <div class="text-center">
                                        <div class="mb-2"><i class="bi bi-music-note-beamed fs-1 text-primary"></i></div>
                                        <h6>2. Practice</h6>
                                        <p class="text-muted small">Listen to the reference, then record yourself playing</p>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="text-center">
                                        <div class="mb-2"><i class="bi bi-graph-up fs-1 text-primary"></i></div>
                                        <h6>3. Track Progress</h6>
                                        <p class="text-muted small">View your improvement and mastery over time</p>
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
     * Render scale list
     * @param {Array} scales - Scales to render
     */
    renderScaleList(scales) {
        if (scales.length === 0) {
            return '<div class="text-muted text-center py-3">No scales found</div>';
        }

        // Group scales by key
        const grouped = {};
        scales.forEach(scale => {
            const key = scale.key || 'Other';
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(scale);
        });

        let html = '';
        Object.keys(grouped).sort().forEach(key => {
            html += `<div class="list-group-item list-group-item-secondary py-1 px-2"><small><strong>${key}</strong></small></div>`;
            grouped[key].forEach(scale => {
                const typeColor = scale.type === 'arpeggio' ? 'primary' : 'success';
                const categoryLabel = this.getCategoryLabel(scale.category);
                html += `
                    <button class="list-group-item list-group-item-action scale-item py-2" 
                            data-scale-id="${scale.id}"
                            data-type="${scale.type}">
                        <div class="d-flex w-100 justify-content-between align-items-center">
                            <div>
                                <div>${scale.displayName || scale.name}</div>
                                <small class="text-muted">${categoryLabel}</small>
                            </div>
                            <div>
                                <span class="badge bg-${typeColor} me-1">${scale.type}</span>
                                <small class="text-muted">${scale.tempo.examTempo} BPM</small>
                            </div>
                        </div>
                    </button>
                `;
            });
        });
        return html;
    }

    /**
     * Get category label
     */
    getCategoryLabel(category) {
        const labels = {
            'major': 'Major',
            'minor': 'Minor',
            'minorHarmonic': 'Harmonic Minor',
            'minorMelodic': 'Melodic Minor',
            'chromatic': 'Chromatic',
            'wholeTone': 'Whole-Tone',
            'dominant7': 'Dominant 7th',
            'diminished7': 'Diminished 7th'
        };
        return labels[category] || category;
    }

    /**
     * Filter scales based on search and type filter
     */
    async filterScales() {
        const searchInput = document.getElementById('scale-search');
        const activeFilter = document.querySelector('.filter-btn.active');
        const scaleList = document.getElementById('scale-list');
        
        if (!searchInput || !activeFilter || !scaleList) return;

        const query = searchInput.value.toLowerCase();
        const filterType = activeFilter.dataset.filter;
        const allScales = ScalesData.getAllScales();

        let filtered = allScales;

        // Apply type filter
        if (filterType !== 'all') {
            filtered = filtered.filter(scale => scale.type === filterType);
        }

        // Apply search filter
        if (query) {
            filtered = filtered.filter(scale => {
                const displayName = (scale.displayName || scale.name || '').toLowerCase();
                const key = (scale.key || '').toLowerCase();
                const category = (scale.category || '').toLowerCase();
                return displayName.includes(query) || 
                       key.includes(query) || 
                       category.includes(query);
            });
        }

        scaleList.innerHTML = this.renderScaleList(filtered);
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Random scale button
        const randomBtn = document.getElementById('random-scale-btn');
        if (randomBtn) {
            randomBtn.addEventListener('click', async () => {
                const scale = ScalesData.getRandomScale();
                eventBus.emit(Events.SCALE_SELECTED, scale);
            });
        }

        // Scale list items
        this.container.addEventListener('click', (e) => {
            const scaleItem = e.target.closest('.scale-item');
            if (scaleItem) {
                const scaleId = scaleItem.dataset.scaleId;
                const scale = ScalesData.getScaleById(scaleId);
                if (scale) {
                    eventBus.emit(Events.SCALE_SELECTED, scale);
                }
            }
        });

        // Scale search and filter
        const searchInput = document.getElementById('scale-search');
        if (searchInput) {
            searchInput.addEventListener('input', Helpers.debounce(async (e) => {
                await this.filterScales();
            }, 300));
        }

        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                await this.filterScales();
            });
        });

        // Listen for progress updates to refresh stats
        eventBus.on(Events.PROGRESS_UPDATED, async () => {
            await this.render();
            this.attachEventListeners();
        });
    }
}

// Will be initialized when app loads
let dashboard = null;
