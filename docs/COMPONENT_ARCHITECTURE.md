# Component Architecture

## Application Component Breakdown

This document defines the modular architecture for the ABRSM Grade 8 Piano Scales app using vanilla JavaScript with a component-based approach.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Application Shell                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │           Service Worker (Offline Support)        │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │                  App Controller                   │   │
│  │          (State Management & Routing)             │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  ┌───────────────┬──────────────┬────────────────────┐  │
│  │  Data Layer   │ Audio Engine │  Storage Manager   │  │
│  │  (Scales DB)  │  (Web Audio) │  (IndexedDB API)   │  │
│  └───────────────┴──────────────┴────────────────────┘  │
│                                                           │
│  ┌────────────────────── UI Components ──────────────┐  │
│  │                                                    │  │
│  │  ┌──────────┐ ┌──────────┐ ┌─────────────────┐  │  │
│  │  │Dashboard │ │Challenge │ │  Progress View  │  │  │
│  │  └──────────┘ └──────────┘ └─────────────────┘  │  │
│  │                                                    │  │
│  │  ┌──────────┐ ┌──────────┐ ┌─────────────────┐  │  │
│  │  │Randomizer│ │ Metronome│ │  Virtual Keyboard│  │  │
│  │  └──────────┘ └──────────┘ └─────────────────┘  │  │
│  │                                                    │  │
│  │  ┌──────────┐ ┌──────────┐ ┌─────────────────┐  │  │
│  │  │  Audio   │ │ Fingering│ │  Settings Panel │  │  │
│  │  │  Player  │ │  Diagram │ └─────────────────┘  │  │
│  │  └──────────┘ └──────────┘                       │  │
│  └────────────────────────────────────────────────── ┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. App Controller (`app.js`)

**Purpose**: Main application controller managing state, routing, and component lifecycle

**Responsibilities**:
- Initialize all components
- Manage application state
- Handle navigation/routing
- Coordinate component communication
- Handle global events

**Structure**:
```javascript
class AppController {
  constructor() {
    this.state = {
      currentView: 'dashboard',
      currentScale: null,
      user: { id: 'default-user' },
      settings: null
    };
    this.components = {};
  }
  
  async init() {
    // Initialize storage
    // Load user settings
    // Initialize components
    // Register service worker
    // Set up event listeners
  }
  
  navigate(view, data) {
    // Handle view transitions
    // Update URL (if using history API)
    // Render appropriate component
  }
  
  updateState(updates) {
    // Update application state
    // Notify dependent components
  }
}
```

---

### 2. Dashboard Component (`components/dashboard.js`)

**Purpose**: Main landing page showing overview and quick actions

**Features**:
- Random scale generator button
- Progress overview cards
- Recent practice history
- Quick access to scale categories
- Current streak display

**Structure**:
```javascript
class Dashboard {
  constructor(container, appController) {
    this.container = container;
    this.app = appController;
    this.data = null;
  }
  
  async render() {
    // Fetch user progress data
    // Build dashboard HTML
    // Attach event listeners
  }
  
  handleRandomScale() {
    // Generate random scale
    // Navigate to challenge view
  }
  
  updateProgressCards() {
    // Update progress statistics
    // Refresh charts
  }
}
```

**Template Structure**:
```html
<div class="dashboard">
  <div class="hero-section">
    <button class="btn btn-lg btn-primary" id="randomScaleBtn">
      <i class="bi bi-dice-3"></i> Generate Random Scale
    </button>
  </div>
  
  <div class="quick-access row">
    <!-- Scale category cards -->
  </div>
  
  <div class="progress-overview card">
    <!-- Progress statistics -->
  </div>
  
  <div class="recent-practice">
    <!-- Recent practice list -->
  </div>
</div>
```

---

### 3. Scale Challenge Component (`components/scale-challenge.js`)

**Purpose**: Display current scale challenge with all practice tools

**Features**:
- Scale information display
- Fingering diagram integration
- Audio player integration
- Metronome controls
- Practice mode selection (hands, articulation)
- Completion actions

**Structure**:
```javascript
class ScaleChallenge {
  constructor(container, appController) {
    this.container = container;
    this.app = appController;
    this.scale = null;
    this.fingeringDiagram = null;
    this.audioPlayer = null;
    this.metronome = null;
  }
  
  async render(scaleId) {
    // Load scale data
    // Initialize sub-components
    // Build challenge UI
  }
  
  async loadScale(scaleId) {
    // Fetch scale from database
    // Update component state
  }
  
  handleComplete() {
    // Record practice session
    // Update progress
    // Show feedback
  }
  
  handleNewChallenge() {
    // Generate new scale
    // Re-render component
  }
}
```

---

### 4. Randomizer Component (`components/randomizer.js`)

**Purpose**: Intelligent scale selection based on user progress

**Modes**:
- Truly random
- Weighted by performance
- Adaptive (focuses on weak areas)
- Filtered by category/mastery

**Structure**:
```javascript
class ScaleRandomizer {
  constructor(database, progressTracker) {
    this.db = database;
    this.progress = progressTracker;
    this.filters = {};
  }
  
  async getRandomScale(mode = 'adaptive') {
    switch(mode) {
      case 'random':
        return this.getTrulyRandom();
      case 'weighted':
        return this.getWeightedRandom();
      case 'adaptive':
        return this.getAdaptiveScale();
      default:
        return this.getTrulyRandom();
    }
  }
  
  async getAdaptiveScale() {
    // Load user progress
    // Calculate weights per scale
    // Apply filters
    // Select weighted random
  }
  
  setFilters(filters) {
    // Update filter criteria
  }
}
```

---

### 5. Metronome Component (`components/metronome.js`)

**Purpose**: Provide visual and audio metronome functionality

**Features**:
- Adjustable tempo (slider)
- Start/stop controls
- Visual pulse indicator
- Multiple sound options
- Accent on first beat

**Structure**:
```javascript
class Metronome {
  constructor(container, audioContext) {
    this.container = container;
    this.audioContext = audioContext;
    this.isRunning = false;
    this.tempo = 120;
    this.intervalId = null;
    this.visualPulse = null;
  }
  
  render() {
    // Build metronome UI
    // Create tempo slider
    // Add controls
  }
  
  start() {
    // Calculate interval from tempo
    // Start audio clicks
    // Start visual pulse
  }
  
  stop() {
    // Stop all playback
    // Reset visual indicators
  }
  
  setTempo(bpm) {
    // Update tempo
    // Adjust interval if running
  }
  
  playClick(accent = false) {
    // Generate click sound using Web Audio API
  }
  
  animatePulse() {
    // Animate visual indicator
  }
}
```

---

### 6. Audio Player Component (`components/audio-player.js`)

**Purpose**: Play reference audio for scales

**Features**:
- Play/pause controls
- Speed adjustment (0.5x, 0.75x, 1x, 1.25x)
- Audio generation from scale data
- Volume control

**Structure**:
```javascript
class AudioPlayer {
  constructor(container, audioContext) {
    this.container = container;
    this.audioContext = audioContext;
    this.isPlaying = false;
    this.currentScale = null;
    this.playbackRate = 1.0;
  }
  
  render() {
    // Build player UI
  }
  
  async generateScaleAudio(scale) {
    // Convert note data to audio
    // Use Web Audio API to synthesize
    // Create audio buffer
  }
  
  play() {
    // Start playback
    // Update UI state
  }
  
  pause() {
    // Pause playback
  }
  
  setPlaybackRate(rate) {
    // Adjust speed
  }
}
```

---

### 7. Audio Recorder Component (`components/audio-recorder.js`)

**Purpose**: Record and analyze user performance

**Features**:
- Microphone input handling
- Real-time recording
- Basic pitch detection
- Performance assessment
- Recording playback

**Structure**:
```javascript
class AudioRecorder {
  constructor(container) {
    this.container = container;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.stream = null;
  }
  
  async render() {
    // Build recorder UI
    // Request microphone permission
  }
  
  async startRecording() {
    // Get microphone access
    // Initialize MediaRecorder
    // Start recording
  }
  
  async stopRecording() {
    // Stop recording
    // Create audio blob
    // Analyze recording
  }
  
  async analyzePerformance(audioBlob, expectedScale) {
    // Basic pitch detection
    // Compare with expected notes
    // Calculate accuracy score
    // Generate feedback
  }
}
```

---

### 8. Fingering Diagram Component (`components/fingering-diagram.js`)

**Purpose**: Visual display of correct fingering patterns

**Features**:
- Interactive keyboard visualization
- Finger number overlays
- Highlight active notes
- Separate views for each hand

**Structure**:
```javascript
class FingeringDiagram {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.scale = null;
  }
  
  render(scale) {
    // Create canvas
    // Draw keyboard
    // Draw finger numbers
    // Highlight scale notes
  }
  
  drawKeyboard() {
    // Draw piano keys
    // Label keys
  }
  
  drawFingeringNumbers(hand, fingering, notes) {
    // Overlay finger numbers on keys
  }
  
  highlightNotes(notes) {
    // Highlight active scale notes
  }
}
```

---

### 9. Virtual Keyboard Component (`components/virtual-keyboard.js`)

**Purpose**: Interactive visual keyboard reference

**Features**:
- Full piano keyboard display
- Highlight current scale notes
- Show fingering numbers
- Optional MIDI input support

**Structure**:
```javascript
class VirtualKeyboard {
  constructor(container) {
    this.container = container;
    this.keys = [];
    this.activeNotes = [];
  }
  
  render() {
    // Build keyboard HTML
    // Create key elements
  }
  
  highlightScale(scale) {
    // Clear previous highlights
    // Highlight scale notes
    // Show fingering
  }
  
  playNote(noteKey) {
    // Visual feedback when note played
    // Optional audio playback
  }
}
```

---

### 10. Progress Dashboard Component (`components/progress-dashboard.js`)

**Purpose**: Detailed progress tracking and analytics

**Features**:
- Overall statistics
- Category mastery breakdown
- Practice frequency chart
- Weak areas identification
- Recommendation system

**Structure**:
```javascript
class ProgressDashboard {
  constructor(container, progressTracker) {
    this.container = container;
    this.progress = progressTracker;
    this.charts = [];
  }
  
  async render() {
    // Load all progress data
    // Build statistics cards
    // Create charts
    // Generate recommendations
  }
  
  renderMasteryChart() {
    // Category-wise mastery chart
  }
  
  renderFrequencyChart() {
    // Practice frequency over time
  }
  
  generateRecommendations() {
    // Identify weak areas
    // Suggest practice schedule
  }
}
```

---

### 11. Settings Panel Component (`components/settings-panel.js`)

**Purpose**: User preferences and configuration

**Features**:
- Practice preferences
- Randomizer options
- Audio settings
- Appearance customization
- Data management

**Structure**:
```javascript
class SettingsPanel {
  constructor(container, appController) {
    this.container = container;
    this.app = appController;
    this.settings = null;
  }
  
  async render() {
    // Load current settings
    // Build settings form
    // Attach event listeners
  }
  
  async saveSettings(updates) {
    // Validate settings
    // Update storage
    // Apply changes to app
  }
  
  resetSettings() {
    // Reset to defaults
  }
}
```

---

## Data Layer Components

### 12. Database Manager (`services/database.js`)

**Purpose**: Interface with IndexedDB for all data operations

**Responsibilities**:
- Database initialization
- Scale data CRUD operations
- Progress data management
- Query interface

**Structure**:
```javascript
class DatabaseManager {
  constructor() {
    this.db = null;
    this.dbName = 'abrsm-grade8-scales';
    this.version = 1;
  }
  
  async init() {
    // Open/create IndexedDB
    // Create object stores
    // Populate initial scale data
  }
  
  async getAllScales() { }
  async getScaleById(id) { }
  async getScalesByFilter(filter) { }
  
  async getUserProgress(userId) { }
  async updateProgress(userId, scaleId, data) { }
  async recordSession(session) { }
  
  async getSettings(userId) { }
  async saveSettings(userId, settings) { }
}
```

---

### 13. Progress Tracker (`services/progress-tracker.js`)

**Purpose**: Manage user progress and analytics

**Responsibilities**:
- Track practice sessions
- Calculate statistics
- Determine mastery levels
- Generate recommendations

**Structure**:
```javascript
class ProgressTracker {
  constructor(database) {
    this.db = database;
  }
  
  async recordPractice(scaleId, performance) {
    // Create session record
    // Update scale progress
    // Update overall statistics
  }
  
  async calculateMastery(scaleId) {
    // Analyze performance history
    // Determine mastery level
  }
  
  async getWeakAreas(userId) {
    // Identify scales needing practice
  }
  
  async getRecommendedNext(userId) {
    // Suggest next practice scale
  }
}
```

---

### 14. Audio Engine (`services/audio-engine.js`)

**Purpose**: Centralized Web Audio API management

**Responsibilities**:
- Audio context initialization
- Sound synthesis
- Audio playback coordination
- Microphone input handling

**Structure**:
```javascript
class AudioEngine {
  constructor() {
    this.audioContext = null;
    this.masterVolume = null;
  }
  
  async init() {
    // Initialize AudioContext
    // Set up master gain
    // Check microphone permissions
  }
  
  async playNote(frequency, duration, volume) {
    // Synthesize piano tone
    // Play through audio graph
  }
  
  async playScale(notes, tempo) {
    // Play sequence of notes
  }
  
  async getMicrophoneStream() {
    // Request microphone access
    // Return media stream
  }
}
```

---

### 15. Storage Manager (`services/storage-manager.js`)

**Purpose**: Manage localStorage and cache

**Responsibilities**:
- Settings persistence
- Cache management
- Data export/import
- Storage quota monitoring

**Structure**:
```javascript
class StorageManager {
  async saveToLocal(key, value) { }
  async getFromLocal(key) { }
  async clearCache() { }
  async exportData() { }
  async importData(data) { }
  async checkStorageQuota() { }
}
```

---

## Component Communication

### Event System:
```javascript
// Custom event bus for component communication
class EventBus {
  constructor() {
    this.listeners = {};
  }
  
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }
  
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
}
```

### Key Events:
- `scale:selected` - New scale chosen
- `practice:completed` - Practice session finished
- `progress:updated` - Progress data changed
- `settings:changed` - Settings updated
- `navigation:change` - View navigation

---

## File Structure

```
/
├── index.html
├── css/
│   ├── main.css
│   ├── components/
│   │   ├── dashboard.css
│   │   ├── challenge.css
│   │   ├── progress.css
│   │   └── ...
│   └── themes/
│       ├── light.css
│       └── dark.css
├── js/
│   ├── app.js (main controller)
│   ├── components/
│   │   ├── dashboard.js
│   │   ├── scale-challenge.js
│   │   ├── randomizer.js
│   │   ├── metronome.js
│   │   ├── audio-player.js
│   │   ├── audio-recorder.js
│   │   ├── fingering-diagram.js
│   │   ├── virtual-keyboard.js
│   │   ├── progress-dashboard.js
│   │   └── settings-panel.js
│   ├── services/
│   │   ├── database.js
│   │   ├── progress-tracker.js
│   │   ├── audio-engine.js
│   │   └── storage-manager.js
│   ├── utils/
│   │   ├── event-bus.js
│   │   ├── music-theory.js (note calculations)
│   │   └── helpers.js
│   └── data/
│       └── scales-data.js (initial scale definitions)
├── service-worker.js
└── manifest.json (PWA manifest)
```

---

## Bootstrap Integration

### Utilized Bootstrap Components:
- **Grid System**: Responsive layout
- **Cards**: Content containers
- **Buttons**: All interactive actions
- **Forms**: Settings and inputs
- **Modals**: Dialogs and overlays
- **Nav**: Navigation elements
- **Progress Bars**: Progress indicators
- **Badges**: Status indicators
- **Tooltips**: Helpful hints
- **Alerts**: Notifications

### Custom Components:
- Virtual keyboard (Canvas-based)
- Fingering diagram (Canvas-based)
- Metronome pulse (CSS animations)
- Audio visualizations

---

*This architecture supports modularity, maintainability, and extensibility while keeping the codebase manageable for a single-page application.*
