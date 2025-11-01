/**
 * Main Application Controller
 * Initializes and manages application state
 */

class App {
    constructor() {
        this.currentView = 'dashboard';
        this.settings = null;
        this.initialized = false;
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            // Show loading screen
            this.showLoading('Initializing ABRSM Grade 8 Scales...');

            // Initialize database
            await database.init();
            await database.populateScales();
            console.log('✓ Database initialized');

            // Initialize progress tracker
            progressTracker = new ProgressTracker(database);
            console.log('✓ Progress tracker initialized');

            // Initialize audio engine
            audioEngine.init();
            console.log('✓ Audio engine initialized');

            // Load settings
            this.settings = await database.getSettings();
            console.log('✓ Settings loaded:', this.settings);

            // Initialize components
            await this.initializeComponents();
            console.log('✓ Components initialized');

            // Set up event listeners
            this.setupEventListeners();
            console.log('✓ Event listeners attached');

            // Hide loading and show dashboard
            this.hideLoading();
            
            // Dashboard is now fully rendered, activate it
            const dashboardView = document.getElementById('dashboard-view');
            if (dashboardView) {
                dashboardView.classList.add('active');
                console.log('Dashboard view activated');
            }
            
            this.currentView = 'dashboard';
            this.initialized = true;
            eventBus.emit(Events.APP_INITIALIZED);

            console.log('✓ Application initialized successfully');
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showError('Failed to initialize application. Please refresh the page.');
        }
    }

    /**
     * Initialize all components
     */
    async initializeComponents() {
        // Initialize dashboard and wait for rendering to complete
        dashboard = new Dashboard();
        await dashboard.initPromise;
        console.log('✓ Dashboard initialized and rendered');
        
        // Initialize scale challenge
        scaleChallenge = new ScaleChallenge();
        console.log('✓ Scale Challenge initialized');
        
        // Other components will be initialized as we create them
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Navigation click handling
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.target.getAttribute('data-view');
                if (view) {
                    this.showView(view);
                }
            });
        });

        // Navbar Metronome Controls
        this.setupNavbarMetronome();

        // Listen for scale selection
        eventBus.on(Events.SCALE_SELECTED, (data) => {
            console.log('Scale selected:', data);
            // View switching now handled by ScaleChallenge component after rendering
        });

        // Listen for progress updates
        eventBus.on(Events.PROGRESS_UPDATED, (data) => {
            console.log('Progress updated:', data);
        });

        // Listen for settings changes
        eventBus.on(Events.SETTINGS_CHANGED, async (data) => {
            console.log('Settings changed:', data);
            this.settings = await database.getSettings();
        });
    }

    /**
     * Set up navbar metronome controls
     */
    setupNavbarMetronome() {
        const metronomeBtn = document.getElementById('navbar-toggle-metronome');
        const metroTempoInput = document.getElementById('navbar-metro-tempo-input');
        const metroTempoUpBtn = document.getElementById('navbar-metro-tempo-up');
        const metroTempoDownBtn = document.getElementById('navbar-metro-tempo-down');
        const metronomeText = document.getElementById('navbar-metronome-text');

        if (metronomeBtn) {
            metronomeBtn.addEventListener('click', () => {
                if (metronome.isPlaying) {
                    metronome.stop();
                    metronomeBtn.classList.remove('btn-secondary');
                    metronomeBtn.classList.add('btn-outline-secondary');
                    metronomeText.textContent = 'Metronome';
                    this.clearNavbarBeatIndicators();
                } else {
                    const tempo = parseInt(metroTempoInput.value) || 88;
                    metronome.start(tempo, 4);
                    metronomeBtn.classList.remove('btn-outline-secondary');
                    metronomeBtn.classList.add('btn-secondary');
                    metronomeText.textContent = 'Stop';
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
            this.updateNavbarBeatIndicator(beatNumber, isDownbeat);
        });
    }

    /**
     * Update the navbar beat indicator
     * @param {number} beatNumber - Current beat (0-indexed)
     * @param {boolean} isDownbeat - True if first beat of bar
     */
    updateNavbarBeatIndicator(beatNumber, isDownbeat) {
        const beatDots = document.querySelectorAll('.beat-dot-small');
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
     * Clear navbar beat indicator highlights
     */
    clearNavbarBeatIndicators() {
        const beatDots = document.querySelectorAll('.beat-dot-small');
        beatDots.forEach(dot => {
            dot.classList.remove('active', 'downbeat');
        });
    }

    /**
     * Show a specific view
     * @param {string} viewName - View to show
     */
    showView(viewName) {
        console.log('Switching to view:', viewName);
        
        // Hide all views
        document.querySelectorAll('.view-container').forEach(view => {
            view.classList.remove('active');
            console.log('Hiding view:', view.id);
        });

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-view') === viewName) {
                link.classList.add('active');
            }
        });

        // Re-render dashboard if switching to it
        if (viewName === 'dashboard' && this.dashboard) {
            this.dashboard.render();
        }

        // Show selected view
        const view = document.getElementById(`${viewName}-view`);
        if (view) {
            view.classList.add('active');
            this.currentView = viewName;
            console.log('View activated:', viewName, 'classes:', view.className, 'has content:', view.innerHTML.length > 100);
            eventBus.emit(Events.VIEW_CHANGED, { view: viewName });
        } else {
            console.error('View not found:', `${viewName}-view`);
        }
    }

    /**
     * Show loading screen
     * @param {string} message - Loading message
     */
    showLoading(message = 'Loading...') {
        const loadingScreen = document.getElementById('loading-screen');
        const loadingText = loadingScreen.querySelector('p');
        if (loadingText) {
            loadingText.textContent = message;
        }
        loadingScreen.style.display = 'flex';
    }

    /**
     * Hide loading screen
     */
    hideLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.display = 'none';
        
        // Show app container
        const appContainer = document.getElementById('app-container');
        if (appContainer) {
            appContainer.classList.remove('d-none');
            console.log('App container shown, has classes:', appContainer.className);
        } else {
            console.error('App container not found!');
        }
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        this.hideLoading();
        Helpers.showToast(message, 'danger');
    }
}

// Initialize app when DOM is ready
let app;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new App();
        app.init();
    });
} else {
    app = new App();
    app.init();
}
