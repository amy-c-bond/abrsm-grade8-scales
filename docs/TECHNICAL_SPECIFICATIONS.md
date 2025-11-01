# Technical Specifications

## Detailed Technical Implementation Guide

This document provides comprehensive technical specifications for implementing the ABRSM Grade 8 Piano Scales application.

---

## Technology Stack

### Frontend Framework
- **HTML5**: Semantic markup with ARIA accessibility
- **CSS3**: Modern styling with custom properties
- **Bootstrap 5.3+**: UI component library
- **Vanilla JavaScript (ES6+)**: No framework dependencies

### Audio Technologies
- **Web Audio API**: Sound generation and processing
- **MediaRecorder API**: Audio recording from microphone
- **AudioContext**: Real-time audio synthesis

### Storage Solutions
- **IndexedDB**: Primary offline storage (user progress, settings)
- **LocalStorage**: Quick access to simple preferences
- **Cache API**: Service worker cache for assets

### Progressive Web App
- **Service Workers**: Offline functionality
- **Web App Manifest**: Installable app metadata
- **Cache-First Strategy**: Optimize for offline use

---

## Browser Support

### Target Browsers:
- **Chrome**: 90+ ✓
- **Firefox**: 88+ ✓  
- **Edge**: 90+ (Chromium-based)
- **Safari**: 14+ (limited testing)

### Required APIs:
- ✓ IndexedDB
- ✓ Web Audio API
- ✓ Service Workers
- ✓ MediaRecorder (for recording feature)
- ✓ Canvas API (for visualizations)

---

## Performance Requirements

### Load Time Targets:
- **First Contentful Paint (FCP)**: < 1.5s
- **Time to Interactive (TTI)**: < 3.0s
- **First Input Delay (FID)**: < 100ms

### Runtime Performance:
- **60 FPS** for all animations
- **< 50ms** response time for user interactions
- **< 200ms** for database queries
- **< 100ms** audio latency for metronome

### Storage Limits:
- **IndexedDB**: ~50MB max usage
- **Cache Storage**: ~100MB for assets
- **Total**: < 150MB installed app size

---

## Data Structures

### Scales Database Schema

```javascript
// Complete scale entry with all metadata
const scaleEntry = {
  id: "c-major-scale-hands-together",
  type: "scale",
  category: "major",
  key: "C",
  tonality: "major",
  displayName: "C Major Scale (Hands Together)",
  
  tempo: {
    minTempo: 120,           // Exam minimum
    recommendedTempo: 100,   // Practice starting point
    examTempo: 120           // Required for exam
  },
  
  range: {
    octaves: 4,
    startNote: "C2",         // MIDI note name
    endNote: "C6"
  },
  
  handsOptions: {
    together: true,
    separately: false,
    contraryMotion: false
  },
  
  articulation: {
    legato: true,
    staccato: true
  },
  
  notes: {
    ascending: ["C", "D", "E", "F", "G", "A", "B", "C", ...],
    descending: ["C", "B", "A", "G", "F", "E", "D", "C", ...]
  },
  
  fingering: {
    rightHand: {
      ascending: [1, 2, 3, 1, 2, 3, 4, 5, 1, 2, 3, 1, 2, 3, 4, 5, ...],
      descending: [5, 4, 3, 2, 1, 3, 2, 1, 5, 4, 3, 2, 1, 3, 2, 1, ...]
    },
    leftHand: {
      ascending: [5, 4, 3, 2, 1, 3, 2, 1, 5, 4, 3, 2, 1, 3, 2, 1, ...],
      descending: [1, 2, 3, 1, 2, 3, 4, 5, 1, 2, 3, 1, 2, 3, 4, 5, ...]
    }
  },
  
  audioFiles: {
    reference: null,  // Generated on-demand
    slow: null,
    handsOnly: {
      right: null,
      left: null
    }
  },
  
  difficulty: {
    technicalLevel: 5,          // 1-10 scale
    fingeringComplexity: 3,
    rhythmicComplexity: 2
  },
  
  practiceNotes: "Focus on smooth thumb crossings...",
  commonMistakes: [
    "Uneven tempo",
    "Hesitation at thumb crossing"
  ],
  relatedScales: [
    "c-major-scale-contrary-motion",
    "a-minor-harmonic-scale"
  ]
};
```

### User Progress Schema

```javascript
const userProgress = {
  userId: "default-user",
  scaleId: "c-major-scale-hands-together",
  
  statistics: {
    totalAttempts: 25,
    successfulAttempts: 20,
    lastAttempted: "2025-11-01T14:30:00Z",
    averageAccuracy: 87.5,      // 0-100
    bestAccuracy: 95.0,
    currentStreak: 5,
    longestStreak: 12
  },
  
  performance: {
    tempoAchieved: 115,         // BPM
    handsTogetherMastered: true,
    handsSeparatelyMastered: true,
    contraryMotionMastered: false,
    legatoMastered: true,
    staccatoMastered: false
  },
  
  adaptiveLearning: {
    currentDifficulty: 6,       // Calculated difficulty (1-10)
    recommendedNextPractice: "2025-11-02T10:00:00Z",
    focusAreas: [
      "staccato articulation",
      "tempo consistency"
    ]
  },
  
  practiceHistory: [
    {
      sessionId: "uuid-123",
      timestamp: "2025-11-01T14:30:00Z",
      duration: 180,            // seconds
      accuracy: 90.0,
      completed: true
    }
  ]
};
```

---

## API Interfaces

### Database API

```javascript
class DatabaseManager {
  // Initialization
  async init(): Promise<void>
  
  // Scale queries
  async getAllScales(): Promise<Scale[]>
  async getScaleById(id: string): Promise<Scale>
  async getScalesByType(type: string): Promise<Scale[]>
  async getScalesByCategory(category: string): Promise<Scale[]>
  async getScalesByKey(key: string): Promise<Scale[]>
  async searchScales(query: string): Promise<Scale[]>
  
  // Progress management
  async getUserProgress(userId: string): Promise<UserProgress[]>
  async getScaleProgress(userId: string, scaleId: string): Promise<UserProgress>
  async updateProgress(userId: string, scaleId: string, data: ProgressUpdate): Promise<void>
  async recordSession(session: PracticeSession): Promise<void>
  
  // Settings
  async getSettings(userId: string): Promise<Settings>
  async saveSettings(userId: string, settings: Settings): Promise<void>
  
  // Analytics
  async getUserStatistics(userId: string): Promise<Statistics>
  async getWeakAreas(userId: string, limit: number): Promise<Scale[]>
  async getRecommendations(userId: string): Promise<Scale[]>
}
```

### Audio Engine API

```javascript
class AudioEngine {
  // Initialization
  async init(): Promise<void>
  
  // Playback
  async playNote(frequency: number, duration: number, volume: number): Promise<void>
  async playNoteByName(noteName: string, duration: number, volume: number): Promise<void>
  async playScale(scale: Scale, tempo: number, articulation: string): Promise<void>
  async stopPlayback(): void
  
  // Recording
  async startRecording(): Promise<void>
  async stopRecording(): Promise<Blob>
  async getMicrophonePermission(): Promise<boolean>
  
  // Analysis
  async analyzePitch(audioBlob: Blob): Promise<NoteDetection[]>
  async compareWithExpected(detected: NoteDetection[], expected: Note[]): Promise<AccuracyScore>
  
  // Synthesis
  createOscillator(frequency: number, type: string): OscillatorNode
  createPianoSound(frequency: number): AudioBuffer
}
```

---

## Music Theory Utilities

### Note Calculation

```javascript
class MusicTheory {
  // MIDI note number to frequency
  static midiToFrequency(midiNote: number): number {
    return 440 * Math.pow(2, (midiNote - 69) / 12);
  }
  
  // Note name to MIDI number
  static noteNameToMidi(noteName: string): number {
    // e.g., "C4" -> 60, "A4" -> 69
    const noteMap = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
    // Parse note name and octave
    // Return MIDI number
  }
  
  // Generate scale notes
  static generateScale(rootNote: string, scaleType: string, octaves: number): Note[] {
    const intervals = this.getScaleIntervals(scaleType);
    const notes = [];
    let currentMidi = this.noteNameToMidi(rootNote);
    
    for (let i = 0; i < octaves; i++) {
      for (let interval of intervals) {
        notes.push({
          name: this.midiToNoteName(currentMidi),
          midi: currentMidi,
          frequency: this.midiToFrequency(currentMidi)
        });
        currentMidi += interval;
      }
    }
    notes.push(this.midiToNoteName(currentMidi)); // Final tonic
    
    return notes;
  }
  
  // Get intervals for scale type
  static getScaleIntervals(scaleType: string): number[] {
    const intervals = {
      major: [2, 2, 1, 2, 2, 2, 1],
      minorHarmonic: [2, 1, 2, 2, 1, 3, 1],
      minorMelodic: [2, 1, 2, 2, 2, 2, 1],
      chromatic: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      wholeTone: [2, 2, 2, 2, 2, 2]
    };
    return intervals[scaleType] || [];
  }
  
  // Generate fingering pattern
  static generateFingering(scale: Scale, hand: string): number[] {
    // Complex logic based on key and scale type
    // Returns array of finger numbers (1-5)
  }
}
```

---

## Adaptive Learning Algorithm

### Difficulty Calculation

```javascript
class AdaptiveLearning {
  /**
   * Calculate current difficulty for a scale
   * @param progress - User's progress data for this scale
   * @param scale - Scale metadata
   * @returns Difficulty score 1-10
   */
  static calculateDifficulty(progress: UserProgress, scale: Scale): number {
    // Factor 1: Base scale difficulty
    const baseDifficulty = scale.difficulty.technicalLevel;
    
    // Factor 2: User's accuracy (lower accuracy = higher difficulty)
    const accuracyFactor = (100 - progress.statistics.averageAccuracy) / 10;
    
    // Factor 3: Time since last practice (decay factor)
    const daysSince = this.daysSinceLastAttempt(progress.statistics.lastAttempted);
    const decayFactor = Math.min(daysSince, 30) / 3;
    
    // Factor 4: Attempt count (fewer attempts = less familiar)
    const familiarityFactor = 1 / (progress.statistics.totalAttempts + 1) * 10;
    
    // Weighted formula
    const difficulty = 
      (baseDifficulty * 0.35) +
      (accuracyFactor * 0.35) +
      (decayFactor * 0.20) +
      (familiarityFactor * 0.10);
    
    return Math.max(1, Math.min(10, Math.round(difficulty)));
  }
  
  /**
   * Select next scale using weighted randomization
   * @param userId - User identifier
   * @returns Selected scale
   */
  static async selectAdaptiveScale(userId: string): Promise<Scale> {
    const allProgress = await db.getUserProgress(userId);
    
    // Calculate weight for each scale
    const scaledWeights = allProgress.map(progress => {
      const difficulty = this.calculateDifficulty(progress, progress.scale);
      const accuracy = progress.statistics.averageAccuracy;
      const attempts = progress.statistics.totalAttempts;
      
      // Higher weight = more likely to be selected
      // Prioritize: high difficulty, low accuracy, fewer attempts
      const weight = 
        (difficulty * 2.0) +
        ((100 - accuracy) * 1.5) +
        (1 / (attempts + 1) * 10);
      
      return { scale: progress.scale, weight };
    });
    
    // Weighted random selection
    return this.weightedRandom(scaledWeights);
  }
  
  /**
   * Weighted random selection
   */
  static weightedRandom(items: Array<{scale: Scale, weight: number}>): Scale {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let item of items) {
      random -= item.weight;
      if (random <= 0) {
        return item.scale;
      }
    }
    
    return items[0].scale; // Fallback
  }
}
```

---

## Service Worker Implementation

### Cache Strategy

```javascript
// service-worker.js
const CACHE_NAME = 'abrsm-scales-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/main.css',
  '/js/app.js',
  '/js/components/*.js',
  '/js/services/*.js',
  // Bootstrap CDN
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone response
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

---

## Audio Synthesis

### Piano Sound Generation

```javascript
class PianoSynthesizer {
  constructor(audioContext) {
    this.context = audioContext;
  }
  
  /**
   * Generate piano-like tone using additive synthesis
   * @param frequency - Note frequency in Hz
   * @param duration - Note duration in seconds
   * @param time - Start time (audioContext.currentTime)
   * @returns void
   */
  playPianoNote(frequency, duration, time = this.context.currentTime) {
    // Create multiple oscillators for harmonics
    const harmonics = [1, 2, 3, 4, 5, 6, 7, 8];
    const harmonicAmplitudes = [1.0, 0.5, 0.25, 0.125, 0.1, 0.05, 0.025, 0.0125];
    
    const masterGain = this.context.createGain();
    masterGain.connect(this.context.destination);
    
    harmonics.forEach((harmonic, index) => {
      const oscillator = this.context.createOscillator();
      const gainNode = this.context.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency * harmonic;
      
      // ADSR envelope for piano-like attack and decay
      const now = time;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(harmonicAmplitudes[index] * 0.3, now + 0.005); // Attack
      gainNode.gain.exponentialRampToValueAtTime(harmonicAmplitudes[index] * 0.1, now + 0.1); // Decay
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration); // Release
      
      oscillator.connect(gainNode);
      gainNode.connect(masterGain);
      
      oscillator.start(now);
      oscillator.stop(now + duration);
    });
    
    // Master volume envelope
    masterGain.gain.setValueAtTime(0.3, time);
    masterGain.gain.exponentialRampToValueAtTime(0.001, time + duration);
  }
}
```

---

## Security Considerations

### Data Privacy:
- All data stored locally (no server transmission)
- No user authentication required
- No external API calls for core functionality
- Microphone access only when explicitly requested

### Content Security Policy:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; 
               script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; 
               connect-src 'self';">
```

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance:
- ✓ Keyboard navigation for all features
- ✓ Screen reader support (ARIA labels)
- ✓ Sufficient color contrast (4.5:1 minimum)
- ✓ Focus indicators visible
- ✓ Descriptive alt text for images
- ✓ Logical heading structure

### Keyboard Shortcuts:
- `Space`: Play/pause audio
- `Enter`: Generate new scale
- `M`: Toggle metronome
- `R`: Start/stop recording
- `Escape`: Close modals
- `Tab/Shift+Tab`: Navigate interface

---

## Testing Strategy

### Unit Tests:
- Music theory calculations
- Database operations
- Progress tracking logic
- Adaptive algorithm

### Integration Tests:
- Component interactions
- Audio playback flow
- Progress persistence
- Service worker caching

### Browser Tests:
- Chrome automated testing
- Firefox manual testing
- Cross-browser compatibility

### Performance Tests:
- Load time measurement
- Database query speed
- Audio latency testing
- Memory leak detection

---

## Deployment Strategy

### Build Process:
1. Lint all JavaScript files
2. Minify CSS and JavaScript
3. Generate service worker with asset hashes
4. Create web manifest
5. Optimize images (if any)

### Hosting:
- **GitHub Pages**: Primary hosting
- **Custom Domain** (optional): Via CNAME
- **HTTPS**: Required for service workers

### Version Control:
- Semantic versioning (MAJOR.MINOR.PATCH)
- Git tags for releases
- CHANGELOG.md maintenance

---

## Performance Optimization

### Code Splitting:
- Lazy load components on demand
- Defer non-critical JavaScript
- Async load external resources

### Asset Optimization:
- Minified CSS/JS
- Compressed fonts
- Optimized icons
- No large images

### Caching Strategy:
- Cache-first for app shell
- Network-first for data updates
- Stale-while-revalidate for assets

### Database Optimization:
- Indexed queries
- Batch updates
- Lazy loading of scale data
- Pagination for large lists

---

*These technical specifications provide a complete blueprint for implementing the ABRSM Grade 8 Piano Scales application with modern web technologies and best practices.*
