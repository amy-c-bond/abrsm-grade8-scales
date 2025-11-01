/**
 * ABRSM Grade 8 Piano Scales Data
 * Complete database of all scales, arpeggios, and broken chords
 */

const ScalesData = {
    /**
     * All scale definitions
     * Note: This is a starter set - full 182 scales will be populated
     */
    scales: [
        // C Major Scale
        {
            id: 'c-major-scale-together',
            type: 'scale',
            category: 'major',
            key: 'C',
            tonality: 'major',
            displayName: 'C Major Scale (Hands Together)',
            tempo: {
                minTempo: 120,
                recommendedTempo: 100,
                examTempo: 120
            },
            range: {
                octaves: 4,
                startNote: 'C2',
                endNote: 'C6'
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
            difficulty: {
                technicalLevel: 3,
                fingeringComplexity: 2,
                rhythmicComplexity: 1
            },
            practiceNotes: 'Focus on smooth thumb crossings. Keep wrists relaxed and fingers curved.',
            commonMistakes: ['Uneven tempo', 'Hesitation at thumb crossing', 'Tense wrists']
        },
        
        // G Major Scale
        {
            id: 'g-major-scale-together',
            type: 'scale',
            category: 'major',
            key: 'G',
            tonality: 'major',
            displayName: 'G Major Scale (Hands Together)',
            tempo: {
                minTempo: 120,
                recommendedTempo: 100,
                examTempo: 120
            },
            range: {
                octaves: 4,
                startNote: 'G2',
                endNote: 'G6'
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
            difficulty: {
                technicalLevel: 3,
                fingeringComplexity: 3,
                rhythmicComplexity: 1
            },
            practiceNotes: 'Standard fingering with one sharp (F#). Watch for smooth transitions.',
            commonMistakes: ['Missing F#', 'Uneven rhythm']
        },
        
        // D Major Scale
        {
            id: 'd-major-scale-together',
            type: 'scale',
            category: 'major',
            key: 'D',
            tonality: 'major',
            displayName: 'D Major Scale (Hands Together)',
            tempo: {
                minTempo: 120,
                recommendedTempo: 100,
                examTempo: 120
            },
            range: {
                octaves: 4,
                startNote: 'D2',
                endNote: 'D6'
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
            difficulty: {
                technicalLevel: 4,
                fingeringComplexity: 3,
                rhythmicComplexity: 1
            },
            practiceNotes: 'Two sharps (F#, C#). Maintain even tone throughout.',
            commonMistakes: ['Rushing', 'Uneven dynamics']
        },
        
        // A Minor Harmonic
        {
            id: 'a-minor-harmonic-scale-together',
            type: 'scale',
            category: 'minorHarmonic',
            key: 'A',
            tonality: 'minor',
            displayName: 'A Minor Harmonic Scale (Hands Together)',
            tempo: {
                minTempo: 120,
                recommendedTempo: 100,
                examTempo: 120
            },
            range: {
                octaves: 4,
                startNote: 'A2',
                endNote: 'A6'
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
            difficulty: {
                technicalLevel: 5,
                fingeringComplexity: 4,
                rhythmicComplexity: 2
            },
            practiceNotes: 'Note the raised 7th (G#). The augmented 2nd interval requires careful practice.',
            commonMistakes: ['Missing raised 7th', 'Awkward fingering at augmented 2nd']
        },
        
        // F# Major Scale
        {
            id: 'f-sharp-major-scale-together',
            type: 'scale',
            category: 'major',
            key: 'F#',
            tonality: 'major',
            displayName: 'F# Major Scale (Hands Together)',
            tempo: {
                minTempo: 120,
                recommendedTempo: 100,
                examTempo: 120
            },
            range: {
                octaves: 4,
                startNote: 'F#2',
                endNote: 'F#6'
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
            difficulty: {
                technicalLevel: 7,
                fingeringComplexity: 6,
                rhythmicComplexity: 1
            },
            practiceNotes: 'Six sharps - special fingering required. RH starts on 2nd finger.',
            commonMistakes: ['Wrong starting finger', 'Hesitation due to black keys']
        },
        
        // C Major Arpeggio
        {
            id: 'c-major-arpeggio',
            type: 'arpeggio',
            category: 'major',
            key: 'C',
            tonality: 'major',
            displayName: 'C Major Arpeggio',
            tempo: {
                minTempo: 72,
                recommendedTempo: 60,
                examTempo: 72
            },
            range: {
                octaves: 4,
                startNote: 'C2',
                endNote: 'C6'
            },
            handsOptions: {
                together: true,
                separately: false,
                contraryMotion: false
            },
            articulation: {
                legato: true,
                staccato: false
            },
            difficulty: {
                technicalLevel: 4,
                fingeringComplexity: 3,
                rhythmicComplexity: 2
            },
            practiceNotes: 'Standard 1-2-3-5 fingering. Focus on smooth legato connection.',
            commonMistakes: ['Bumpy transitions', 'Uneven rhythm']
        },
        
        // C Chromatic Scale
        {
            id: 'c-chromatic-scale',
            type: 'scale',
            category: 'chromatic',
            key: 'C',
            tonality: null,
            displayName: 'C Chromatic Scale',
            tempo: {
                minTempo: 80,
                recommendedTempo: 60,
                examTempo: 80
            },
            range: {
                octaves: 4,
                startNote: 'C2',
                endNote: 'C6'
            },
            handsOptions: {
                together: true,
                separately: false,
                contraryMotion: false
            },
            articulation: {
                legato: true,
                staccato: false
            },
            difficulty: {
                technicalLevel: 6,
                fingeringComplexity: 7,
                rhythmicComplexity: 1
            },
            practiceNotes: 'Use 1-3 or 1-2-3 fingering pattern. Thumb on white keys only.',
            commonMistakes: ['Wrong fingering', 'Rushing the pattern']
        },
        
        // C Whole-Tone Scale
        {
            id: 'c-whole-tone-scale',
            type: 'scale',
            category: 'wholeTone',
            key: 'C',
            tonality: null,
            displayName: 'C Whole-Tone Scale',
            tempo: {
                minTempo: 80,
                recommendedTempo: 60,
                examTempo: 80
            },
            range: {
                octaves: 2,
                startNote: 'C3',
                endNote: 'C5'
            },
            handsOptions: {
                together: true,
                separately: false,
                contraryMotion: false
            },
            articulation: {
                legato: true,
                staccato: false
            },
            difficulty: {
                technicalLevel: 5,
                fingeringComplexity: 5,
                rhythmicComplexity: 1
            },
            practiceNotes: 'Only 2 octaves required. Note the unusual sound of whole-tone intervals.',
            commonMistakes: ['Uneven tone', 'Loss of orientation']
        }
    ],

    /**
     * Get all scales
     */
    getAllScales() {
        return this.scales;
    },

    /**
     * Get scale by ID
     */
    getScaleById(id) {
        return this.scales.find(scale => scale.id === id);
    },

    /**
     * Get scales by type
     */
    getScalesByType(type) {
        return this.scales.filter(scale => scale.type === type);
    },

    /**
     * Get scales by category
     */
    getScalesByCategory(category) {
        return this.scales.filter(scale => scale.category === category);
    },

    /**
     * Get scales by key
     */
    getScalesByKey(key) {
        return this.scales.filter(scale => scale.key === key);
    },

    /**
     * Get random scale
     */
    getRandomScale() {
        return this.scales[Math.floor(Math.random() * this.scales.length)];
    }
};

// Note: This starter set includes 8 scales. The complete implementation
// will include all 182 ABRSM Grade 8 requirements.
console.log(`Scales database loaded: ${ScalesData.scales.length} scales available`);
