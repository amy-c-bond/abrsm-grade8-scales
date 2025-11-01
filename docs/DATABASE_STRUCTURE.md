# Scales Database Structure

## JSON Schema Design

This document defines the data structures for storing all ABRSM Grade 8 technical requirements in the application.

---

## Core Data Models

### 1. Scale Entry

```json
{
  "id": "string (unique identifier, e.g., 'c-major-scale')",
  "type": "string (scale|arpeggio|broken-chord)",
  "category": "string (major|minor-harmonic|minor-melodic|chromatic|whole-tone|dominant-7th|diminished-7th)",
  "key": "string (e.g., 'C', 'F#', 'Bb')",
  "tonality": "string (major|minor|null)",
  "displayName": "string (e.g., 'C Major Scale')",
  "
": {
    "minTempo": "number (quarter note BPM)",
    "recommendedTempo": "number (practice tempo)",
    "examTempo": "number (exam minimum tempo)"
  },
  "range": {
    "octaves": "number (2|3|4)",
    "startNote": "string (MIDI note name, e.g., 'C3')",
    "endNote": "string (MIDI note name, e.g., 'C7')"
  },
  "handsOptions": {
    "together": "boolean",
    "separately": "boolean",
    "contraryMotion": "boolean"
  },
  "articulation": {
    "legato": "boolean",
    "staccato": "boolean"
  },
  "notes": {
    "ascending": "array of strings (note names)",
    "descending": "array of strings (note names)"
  },
  "fingering": {
    "rightHand": {
      "ascending": "array of numbers (1-5)",
      "descending": "array of numbers (1-5)"
    },
    "leftHand": {
      "ascending": "array of numbers (1-5)",
      "descending": "array of numbers (1-5)"
    }
  },
  "audioFiles": {
    "reference": "string (URL to reference audio)",
    "slow": "string (URL to slow practice audio)",
    "handsOnly": {
      "right": "string (optional)",
      "left": "string (optional)"
    }
  },
  "difficulty": {
    "technicalLevel": "number (1-10)",
    "fingeringComplexity": "number (1-10)",
    "rhythmicComplexity": "number (1-10)"
  },
  "practiceNotes": "string (tips and guidance)",
  "commonMistakes": "array of strings",
  "relatedScales": "array of scale IDs"
}
```

### 2. User Progress Entry

```json
{
  "userId": "string (default: 'default-user')",
  "scaleId": "string (references scale.id)",
  "statistics": {
    "totalAttempts": "number",
    "successfulAttempts": "number",
    "lastAttempted": "ISO 8601 timestamp",
    "averageAccuracy": "number (0-100 percentage)",
    "bestAccuracy": "number (0-100 percentage)",
    "currentStreak": "number",
    "longestStreak": "number"
  },
  "performance": {
    "tempoAchieved": "number (BPM)",
    "handsTogetherMastered": "boolean",
    "handsSeparatelyMastered": "boolean",
    "contraryMotionMastered": "boolean",
    "legatoMastered": "boolean",
    "staccatoMastered": "boolean"
  },
  "adaptiveLearning": {
    "currentDifficulty": "number (1-10)",
    "recommendedNextPractice": "ISO 8601 timestamp",
    "focusAreas": "array of strings"
  },
  "practiceHistory": "array of practice session objects"
}
```

### 3. Practice Session

```json
{
  "sessionId": "string (UUID)",
  "scaleId": "string",
  "timestamp": "ISO 8601 timestamp",
  "duration": "number (seconds)",
  "handsMode": "string (together|right-only|left-only|contrary)",
  "articulation": "string (legato|staccato)",
  "tempo": "number (BPM)",
  "accuracy": "number (0-100 percentage)",
  "errorsDetected": "array of error objects",
  "completed": "boolean",
  "notes": "string (user notes)"
}
```

### 4. App Settings

```json
{
  "userId": "string",
  "preferences": {
    "defaultTempo": "number",
    "metronomeEnabled": "boolean",
    "metronomeSound": "string (click|beep|wood)",
    "visualMetronome": "boolean",
    "audioFeedback": "boolean",
    "showFingering": "boolean",
    "showKeyboard": "boolean",
    "theme": "string (light|dark|auto)"
  },
  "practice": {
    "sessionLength": "number (minutes)",
    "breakReminders": "boolean",
    "randomizeMode": "string (truly-random|weighted|adaptive)",
    "filterByMastery": "boolean",
    "excludeMastered": "boolean"
  },
  "audio": {
    "inputDevice": "string (device ID)",
    "inputSensitivity": "number (0-100)",
    "playbackVolume": "number (0-100)",
    "recordSessions": "boolean"
  },
  "accessibility": {
    "highContrast": "boolean",
    "largeText": "boolean",
    "keyboardNavigation": "boolean",
    "screenReaderMode": "boolean"
  }
}
```

---

## IndexedDB Schema

### Database Name: `abrsm-grade8-scales`
### Version: 1

### Object Stores:

#### 1. `scales`
- **Key Path**: `id`
- **Indexes**:
  - `type`: Non-unique index on `type` field
  - `category`: Non-unique index on `category` field
  - `key`: Non-unique index on `key` field
  - `difficulty`: Non-unique index on `difficulty.technicalLevel` field

#### 2. `userProgress`
- **Key Path**: `[userId, scaleId]` (compound key)
- **Indexes**:
  - `scaleId`: Non-unique index
  - `lastAttempted`: Non-unique index on `statistics.lastAttempted`
  - `averageAccuracy`: Non-unique index on `statistics.averageAccuracy`
  - `currentDifficulty`: Non-unique index on `adaptiveLearning.currentDifficulty`

#### 3. `practiceSessions`
- **Key Path**: `sessionId`
- **Indexes**:
  - `scaleId`: Non-unique index
  - `timestamp`: Non-unique index
  - `accuracy`: Non-unique index

#### 4. `settings`
- **Key Path**: `userId`
- No indexes needed (single user only)

---

## Data Generation Strategy

### Scale Data Population:
1. **Major Scales**: 15 keys × 2 motion types = 30 entries
2. **Minor Scales**: 15 keys × 4 types = 60 entries
3. **Chromatic Scales**: 12 starting notes = 12 entries
4. **Whole-Tone Scales**: 2 patterns = 2 entries
5. **Arpeggios (Major/Minor)**: 30 entries
6. **Dominant 7th Arpeggios**: 15 entries
7. **Diminished 7th Arpeggios**: 3 entries
8. **Broken Chords**: 30 entries

**Total**: 182 scale entries

### Note Generation Algorithm:
```javascript
// Pseudo-code for generating scale notes
function generateScaleNotes(key, type, octaves) {
  const intervals = getIntervalsForType(type); // e.g., [2,2,1,2,2,2,1] for major
  const startNote = getMIDINote(key);
  const notes = [];
  
  let currentNote = startNote;
  for (let octave = 0; octave < octaves; octave++) {
    for (let interval of intervals) {
      notes.push(currentNote);
      currentNote += interval; // semitone steps
    }
  }
  notes.push(currentNote); // final tonic
  
  return {
    ascending: notes,
    descending: notes.reverse()
  };
}
```

### Fingering Generation:
- Use standard fingering patterns for each scale type
- Store as arrays parallel to note arrays
- Include special cases (e.g., B major, F# major)

---

## API Interface

### Read Operations:
```javascript
// Get all scales
getAllScales()

// Get scales by filter
getScalesByType(type)
getScalesByCategory(category)
getScalesByKey(key)
getScalesByDifficulty(minLevel, maxLevel)

// Get single scale
getScaleById(id)

// Get random scale
getRandomScale(filters)
getAdaptiveScale(userId) // Based on learning algorithm
```

### Write Operations:
```javascript
// Update progress
recordPracticeSession(session)
updateUserProgress(userId, scaleId, performance)

// Settings
updateSettings(userId, settings)
getSettings(userId)
```

### Progress Operations:
```javascript
// Analytics
getUserStatistics(userId)
getWeakAreas(userId)
getStrengthAreas(userId)
getRecommendedPractice(userId)
```

---

## Adaptive Learning Algorithm

### Difficulty Calculation:
```javascript
function calculateDifficulty(userProgress, scale) {
  // Factors:
  // 1. Historical accuracy
  // 2. Time since last practice
  // 3. Inherent scale difficulty
  // 4. Related scale performance
  
  const accuracy = userProgress.statistics.averageAccuracy;
  const daysSinceLastAttempt = calculateDays(userProgress.statistics.lastAttempted);
  const baseScaleDifficulty = scale.difficulty.technicalLevel;
  
  // Weight formula
  const currentDifficulty = 
    (baseScaleDifficulty * 0.4) +
    ((100 - accuracy) / 10 * 0.3) +
    (Math.min(daysSinceLastAttempt, 30) / 3 * 0.3);
  
  return Math.round(currentDifficulty);
}
```

### Scale Selection (Weighted Random):
```javascript
function selectAdaptiveScale(userId) {
  const allProgress = getUserProgress(userId);
  
  // Calculate weights for each scale
  const weights = allProgress.map(progress => {
    const difficulty = progress.adaptiveLearning.currentDifficulty;
    const accuracy = progress.statistics.averageAccuracy;
    const attempts = progress.statistics.totalAttempts;
    
    // Prioritize:
    // - Higher difficulty scales (need more practice)
    // - Lower accuracy scales
    // - Less frequently practiced scales
    
    return (difficulty * 2) + ((100 - accuracy) * 1.5) + (1 / (attempts + 1) * 10);
  });
  
  return weightedRandomSelection(allProgress, weights);
}
```

---

## Performance Considerations

### Caching Strategy:
- Cache all scale data in memory on app load
- IndexedDB for persistence only
- Batch write operations for progress updates

### Optimization:
- Lazy load audio files (only when needed)
- Pre-generate common scale patterns
- Index frequently queried fields
- Compress audio using Web Audio API

### Offline Support:
- All scale data embedded in app
- Service Worker caches app shell
- IndexedDB for all user data
- No external API calls required

---

*This structure supports all requirements for the ABRSM Grade 8 Piano Scales app with extensibility for future enhancements.*
