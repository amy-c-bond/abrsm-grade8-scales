/**
 * ABRSM Grade 8 Piano Scales Data (2025 & 2026 Syllabus)
 * Complete database based on official ABRSM requirements
 * Keys: C, Eb, F#, A (major and minor)
 * Tempos in minims: Scales = 88, Arpeggios = 66, Sixth apart = 60
 */

const ScalesData = {
    scales: [
        // ===== C MAJOR - Similar Motion =====
        {
            id: 'c-major-scale-together',
            type: 'scale',
            category: 'major',
            key: 'C',
            tonality: 'major',
            displayName: 'C Major Scale (Hands Together)',
            tempo: { minTempo: 88, recommendedTempo: 72, examTempo: 88 },
            range: { octaves: 4, startNote: 'C2', endNote: 'C6' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: true },
            difficulty: { technicalLevel: 3, fingeringComplexity: 2, rhythmicComplexity: 1 },
            practiceNotes: 'Standard fingering. Focus on smooth thumb crossings.',
            commonMistakes: ['Uneven tempo', 'Hesitation at thumb crossing']
        },
        {
            id: 'c-major-scale-contrary',
            type: 'scale',
            category: 'major',
            key: 'C',
            tonality: 'major',
            displayName: 'C Major Scale (Contrary Motion)',
            tempo: { minTempo: 88, recommendedTempo: 72, examTempo: 88 },
            range: { octaves: 2, startNote: 'C3', endNote: 'C5' },
            handsOptions: { together: true, separately: false, contraryMotion: true },
            articulation: { legato: true, staccato: true },
            difficulty: { technicalLevel: 5, fingeringComplexity: 4, rhythmicComplexity: 2 },
            practiceNotes: '2 octaves. Hands start one octave apart, move in opposite directions.',
            commonMistakes: ['Hands not synchronized', 'Uneven dynamics'],
            rightHand: {
                startNote: 'C4',
                notes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6',
                        'B5', 'A5', 'G5', 'F5', 'E5', 'D5', 'C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4']
            },
            leftHand: {
                startNote: 'C4',
                notes: ['C4', 'B3', 'A3', 'G3', 'F3', 'E3', 'D3', 'C3', 'B2', 'A2', 'G2', 'F2', 'E2', 'D2', 'C2',
                        'D2', 'E2', 'F2', 'G2', 'A2', 'B2', 'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4']
            }
        },

        // ===== Eb MAJOR - Similar Motion =====
        {
            id: 'eb-major-scale-together',
            type: 'scale',
            category: 'major',
            key: 'Eb',
            tonality: 'major',
            displayName: 'E♭ Major Scale (Hands Together)',
            tempo: { minTempo: 88, recommendedTempo: 72, examTempo: 88 },
            range: { octaves: 4, startNote: 'Eb2', endNote: 'Eb6' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: true },
            difficulty: { technicalLevel: 4, fingeringComplexity: 3, rhythmicComplexity: 1 },
            practiceNotes: '3 flats (Bb, Eb, Ab). Standard black key fingering.',
            commonMistakes: ['Missing flats', 'Uneven rhythm on black keys']
        },
        {
            id: 'eb-major-scale-contrary',
            type: 'scale',
            category: 'major',
            key: 'Eb',
            tonality: 'major',
            displayName: 'E♭ Major Scale (Contrary Motion)',
            tempo: { minTempo: 88, recommendedTempo: 72, examTempo: 88 },
            range: { octaves: 2, startNote: 'Eb3', endNote: 'Eb5' },
            handsOptions: { together: true, separately: false, contraryMotion: true },
            articulation: { legato: true, staccato: true },
            difficulty: { technicalLevel: 5, fingeringComplexity: 4, rhythmicComplexity: 2 },
            practiceNotes: '2 octaves contrary motion. Watch fingering on black keys.',
            commonMistakes: ['Hesitation on black keys', 'Uneven touch']
        },
        {
            id: 'eb-major-scale-thirds',
            type: 'scale',
            category: 'major',
            key: 'Eb',
            tonality: 'major',
            displayName: 'E♭ Major Scale in Thirds',
            tempo: { minTempo: 52, recommendedTempo: 40, examTempo: 52 },
            range: { octaves: 2, startNote: 'Eb3', endNote: 'Eb5' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: false },
            difficulty: { technicalLevel: 7, fingeringComplexity: 7, rhythmicComplexity: 3 },
            practiceNotes: 'Both hands in parallel thirds. Legato only. 2 octaves.',
            commonMistakes: ['Uneven intervals', 'Loss of synchronization']
        },

        // ===== F# MAJOR - Similar Motion =====
        {
            id: 'f-sharp-major-scale-together',
            type: 'scale',
            category: 'major',
            key: 'F#',
            tonality: 'major',
            displayName: 'F# Major Scale (Hands Together)',
            tempo: { minTempo: 88, recommendedTempo: 72, examTempo: 88 },
            range: { octaves: 4, startNote: 'F#2', endNote: 'F#6' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: true },
            difficulty: { technicalLevel: 7, fingeringComplexity: 6, rhythmicComplexity: 1 },
            practiceNotes: '6 sharps. RH starts on 2nd finger. Special fingering required.',
            commonMistakes: ['Wrong starting finger', 'Hesitation due to black keys']
        },
        {
            id: 'f-sharp-major-scale-contrary',
            type: 'scale',
            category: 'major',
            key: 'F#',
            tonality: 'major',
            displayName: 'F# Major Scale (Contrary Motion)',
            tempo: { minTempo: 88, recommendedTempo: 72, examTempo: 88 },
            range: { octaves: 2, startNote: 'F#3', endNote: 'F#5' },
            handsOptions: { together: true, separately: false, contraryMotion: true },
            articulation: { legato: true, staccato: true },
            difficulty: { technicalLevel: 8, fingeringComplexity: 7, rhythmicComplexity: 2 },
            practiceNotes: '2 octaves contrary motion. Challenging fingering on black keys.',
            commonMistakes: ['Finger confusion', 'Rushing through difficult passages']
        },

        // ===== A MAJOR - Similar Motion =====
        {
            id: 'a-major-scale-together',
            type: 'scale',
            category: 'major',
            key: 'A',
            tonality: 'major',
            displayName: 'A Major Scale (Hands Together)',
            tempo: { minTempo: 88, recommendedTempo: 72, examTempo: 88 },
            range: { octaves: 4, startNote: 'A2', endNote: 'A6' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: true },
            difficulty: { technicalLevel: 4, fingeringComplexity: 3, rhythmicComplexity: 1 },
            practiceNotes: '3 sharps (F#, C#, G#). Standard fingering.',
            commonMistakes: ['Missing sharps', 'Uneven tempo']
        },
        {
            id: 'a-major-scale-contrary',
            type: 'scale',
            category: 'major',
            key: 'A',
            tonality: 'major',
            displayName: 'A Major Scale (Contrary Motion)',
            tempo: { minTempo: 88, recommendedTempo: 72, examTempo: 88 },
            range: { octaves: 2, startNote: 'A3', endNote: 'A5' },
            handsOptions: { together: true, separately: false, contraryMotion: true },
            articulation: { legato: true, staccato: true },
            difficulty: { technicalLevel: 5, fingeringComplexity: 4, rhythmicComplexity: 2 },
            practiceNotes: '2 octaves contrary motion with 3 sharps.',
            commonMistakes: ['Coordination issues', 'Uneven articulation']
        },

        // ===== C MINOR (Harmonic & Melodic) =====
        {
            id: 'c-minor-harmonic-scale-together',
            type: 'scale',
            category: 'minorHarmonic',
            key: 'C',
            tonality: 'minor',
            displayName: 'C Minor Harmonic Scale (Hands Together)',
            tempo: { minTempo: 88, recommendedTempo: 72, examTempo: 88 },
            range: { octaves: 4, startNote: 'C2', endNote: 'C6' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: true },
            difficulty: { technicalLevel: 5, fingeringComplexity: 4, rhythmicComplexity: 2 },
            practiceNotes: 'Raised 7th (B natural). 3 flats with raised leading note.',
            commonMistakes: ['Missing raised 7th', 'Awkward fingering at augmented 2nd']
        },
        {
            id: 'c-minor-melodic-scale-together',
            type: 'scale',
            category: 'minorMelodic',
            key: 'C',
            tonality: 'minor',
            displayName: 'C Minor Melodic Scale (Hands Together)',
            tempo: { minTempo: 88, recommendedTempo: 72, examTempo: 88 },
            range: { octaves: 4, startNote: 'C2', endNote: 'C6' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: true },
            difficulty: { technicalLevel: 6, fingeringComplexity: 5, rhythmicComplexity: 2 },
            practiceNotes: 'Raised 6th and 7th ascending, natural descending.',
            commonMistakes: ['Forgetting to lower 6th and 7th descending', 'Uneven transitions']
        },

        // ===== Eb MINOR (Harmonic & Melodic) =====
        {
            id: 'eb-minor-harmonic-scale-together',
            type: 'scale',
            category: 'minorHarmonic',
            key: 'Eb',
            tonality: 'minor',
            displayName: 'E♭ Minor Harmonic Scale (Hands Together)',
            tempo: { minTempo: 88, recommendedTempo: 72, examTempo: 88 },
            range: { octaves: 4, startNote: 'Eb2', endNote: 'Eb6' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: true },
            difficulty: { technicalLevel: 6, fingeringComplexity: 5, rhythmicComplexity: 2 },
            practiceNotes: '6 flats with raised 7th (D natural). Complex key signature.',
            commonMistakes: ['Key signature errors', 'Raised 7th placement']
        },
        {
            id: 'eb-minor-melodic-scale-together',
            type: 'scale',
            category: 'minorMelodic',
            key: 'Eb',
            tonality: 'minor',
            displayName: 'E♭ Minor Melodic Scale (Hands Together)',
            tempo: { minTempo: 88, recommendedTempo: 72, examTempo: 88 },
            range: { octaves: 4, startNote: 'Eb2', endNote: 'Eb6' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: true },
            difficulty: { technicalLevel: 7, fingeringComplexity: 6, rhythmicComplexity: 2 },
            practiceNotes: 'Complex with 6 flats. Raised 6th and 7th ascending.',
            commonMistakes: ['Accidental confusion', 'Fingering challenges']
        },

        // ===== F# MINOR (Harmonic & Melodic) =====
        {
            id: 'f-sharp-minor-harmonic-scale-together',
            type: 'scale',
            category: 'minorHarmonic',
            key: 'F#',
            tonality: 'minor',
            displayName: 'F# Minor Harmonic Scale (Hands Together)',
            tempo: { minTempo: 88, recommendedTempo: 72, examTempo: 88 },
            range: { octaves: 4, startNote: 'F#2', endNote: 'F#6' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: true },
            difficulty: { technicalLevel: 6, fingeringComplexity: 5, rhythmicComplexity: 2 },
            practiceNotes: '3 sharps with raised 7th (E#). Augmented 2nd interval.',
            commonMistakes: ['Missing E#', 'Awkward augmented 2nd fingering']
        },
        {
            id: 'f-sharp-minor-melodic-scale-together',
            type: 'scale',
            category: 'minorMelodic',
            key: 'F#',
            tonality: 'minor',
            displayName: 'F# Minor Melodic Scale (Hands Together)',
            tempo: { minTempo: 88, recommendedTempo: 72, examTempo: 88 },
            range: { octaves: 4, startNote: 'F#2', endNote: 'F#6' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: true },
            difficulty: { technicalLevel: 7, fingeringComplexity: 6, rhythmicComplexity: 2 },
            practiceNotes: 'Raised 6th and 7th ascending (D#, E#), natural descending.',
            commonMistakes: ['Forgetting naturals descending', 'Fingering confusion']
        },

        // ===== A MINOR (Harmonic & Melodic) =====
        {
            id: 'a-minor-harmonic-scale-together',
            type: 'scale',
            category: 'minorHarmonic',
            key: 'A',
            tonality: 'minor',
            displayName: 'A Minor Harmonic Scale (Hands Together)',
            tempo: { minTempo: 88, recommendedTempo: 72, examTempo: 88 },
            range: { octaves: 4, startNote: 'A2', endNote: 'A6' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: true },
            difficulty: { technicalLevel: 5, fingeringComplexity: 4, rhythmicComplexity: 2 },
            practiceNotes: 'Raised 7th (G#). Augmented 2nd interval F-G#.',
            commonMistakes: ['Missing raised 7th', 'Awkward fingering at augmented 2nd']
        },
        {
            id: 'a-minor-melodic-scale-together',
            type: 'scale',
            category: 'minorMelodic',
            key: 'A',
            tonality: 'minor',
            displayName: 'A Minor Melodic Scale (Hands Together)',
            tempo: { minTempo: 88, recommendedTempo: 72, examTempo: 88 },
            range: { octaves: 4, startNote: 'A2', endNote: 'A6' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: true },
            difficulty: { technicalLevel: 6, fingeringComplexity: 5, rhythmicComplexity: 2 },
            practiceNotes: 'Raised 6th and 7th (F#, G#) ascending, natural descending.',
            commonMistakes: ['Forgetting to lower 6th and 7th descending']
        },

        // ===== CHROMATIC SCALE =====
        {
            id: 'c-chromatic-scale',
            type: 'scale',
            category: 'chromatic',
            key: 'C',
            tonality: null,
            displayName: 'C Chromatic Scale',
            tempo: { minTempo: 60, recommendedTempo: 50, examTempo: 60 },
            range: { octaves: 4, startNote: 'C2', endNote: 'C6' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: false },
            difficulty: { technicalLevel: 6, fingeringComplexity: 7, rhythmicComplexity: 1 },
            practiceNotes: 'Hands a sixth apart: RH starts on C, LH starts on Eb. 4 octaves.',
            commonMistakes: ['Wrong fingering', 'Rushing the pattern', 'Hand coordination']
        },

        // ===== WHOLE-TONE SCALES =====
        {
            id: 'c-whole-tone-scale',
            type: 'scale',
            category: 'wholeTone',
            key: 'C',
            tonality: null,
            displayName: 'C Whole-Tone Scale',
            tempo: { minTempo: 88, recommendedTempo: 72, examTempo: 88 },
            range: { octaves: 4, startNote: 'C2', endNote: 'C6' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: false },
            difficulty: { technicalLevel: 5, fingeringComplexity: 5, rhythmicComplexity: 1 },
            practiceNotes: '4 octaves. Whole tone intervals throughout.',
            commonMistakes: ['Uneven tone', 'Loss of orientation']
        },
        {
            id: 'eb-whole-tone-scale',
            type: 'scale',
            category: 'wholeTone',
            key: 'Eb',
            tonality: null,
            displayName: 'E♭ Whole-Tone Scale',
            tempo: { minTempo: 88, recommendedTempo: 72, examTempo: 88 },
            range: { octaves: 4, startNote: 'Eb2', endNote: 'Eb6' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: false },
            difficulty: { technicalLevel: 5, fingeringComplexity: 5, rhythmicComplexity: 1 },
            practiceNotes: '4 octaves starting on Eb. Whole tone intervals.',
            commonMistakes: ['Fingering confusion', 'Uneven spacing']
        },

        // ===== C MAJOR STACCATO SCALE IN SIXTHS =====
        {
            id: 'c-major-staccato-sixths',
            type: 'scale',
            category: 'major',
            key: 'C',
            tonality: 'major',
            displayName: 'C Major Staccato Scale in Sixths',
            tempo: { minTempo: 54, recommendedTempo: 44, examTempo: 54 },
            range: { octaves: 2, startNote: 'C3', endNote: 'C5' },
            handsOptions: { together: false, separately: true, contraryMotion: false },
            articulation: { legato: false, staccato: true },
            difficulty: { technicalLevel: 7, fingeringComplexity: 6, rhythmicComplexity: 3 },
            practiceNotes: 'Hands separately. Playing in sixths. Staccato only.',
            commonMistakes: ['Uneven staccato', 'Incorrect intervals']
        },

        // ===== ARPEGGIOS - C MAJOR =====
        {
            id: 'c-major-arpeggio-2nd-inversion',
            type: 'arpeggio',
            category: 'major',
            key: 'C',
            tonality: 'major',
            displayName: 'C Major Arpeggio (2nd Inversion)',
            tempo: { minTempo: 66, recommendedTempo: 54, examTempo: 66 },
            range: { octaves: 4, startNote: 'G2', endNote: 'G6' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: false },
            difficulty: { technicalLevel: 5, fingeringComplexity: 4, rhythmicComplexity: 2 },
            practiceNotes: '2nd inversion starting on G: G-C-E. 4 octaves.',
            commonMistakes: ['Starting note confusion', 'Fingering errors']
        },
        {
            id: 'g7-arpeggio-in-c',
            type: 'arpeggio',
            category: 'dominant7-arpeggio',
            key: 'C',
            tonality: 'dominant7',
            displayName: 'Dominant 7th in the key of C',
            tempo: { minTempo: 66, recommendedTempo: 54, examTempo: 66 },
            range: { octaves: 4, startNote: 'G2', endNote: 'C3' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: false },
            difficulty: { technicalLevel: 6, fingeringComplexity: 5, rhythmicComplexity: 2 },
            practiceNotes: 'G7 arpeggio (G-B-D-F) resolving to C. Ends on tonic C.',
            commonMistakes: ['Missing F natural', 'Final note confusion'],
            ascendingNotes: ['G2', 'B2', 'D3', 'F3', 'G3', 'B3', 'D4', 'F4', 'G4', 'B4', 'D5', 'F5', 'G5', 'B5', 'D6', 'F6', 'G6'],
            descendingNotes: ['F6', 'D6', 'B5', 'G5', 'F5', 'D5', 'B4', 'G4', 'F4', 'D4', 'B3', 'G3', 'F3', 'D3', 'B2', 'G2', 'C3']
        },

        // ===== ARPEGGIOS - Eb MAJOR =====
        {
            id: 'eb-major-arpeggio-2nd-inversion',
            type: 'arpeggio',
            category: 'major',
            key: 'Eb',
            tonality: 'major',
            displayName: 'E♭ Major Arpeggio (2nd Inversion)',
            tempo: { minTempo: 66, recommendedTempo: 54, examTempo: 66 },
            range: { octaves: 4, startNote: 'Bb2', endNote: 'Bb6' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: false },
            difficulty: { technicalLevel: 5, fingeringComplexity: 5, rhythmicComplexity: 2 },
            practiceNotes: '2nd inversion starting on Bb: Bb-Eb-G.',
            commonMistakes: ['Starting position errors', 'Black key control']
        },
        {
            id: 'bb7-arpeggio-in-eb',
            type: 'arpeggio',
            category: 'dominant7-arpeggio',
            key: 'Eb',
            tonality: 'dominant7',
            displayName: 'Dominant 7th in the key of E♭',
            tempo: { minTempo: 66, recommendedTempo: 54, examTempo: 66 },
            range: { octaves: 4, startNote: 'Bb2', endNote: 'Eb3' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: false },
            difficulty: { technicalLevel: 7, fingeringComplexity: 6, rhythmicComplexity: 2 },
            practiceNotes: 'Bb7 arpeggio (Bb-D-F-Ab) resolving to Eb. Ends on tonic Eb.',
            commonMistakes: ['Black key control', 'Missing Ab', 'Final note confusion'],
            ascendingNotes: ['Bb2', 'D3', 'F3', 'Ab3', 'Bb3', 'D4', 'F4', 'Ab4', 'Bb4', 'D5', 'F5', 'Ab5', 'Bb5', 'D6', 'F6', 'Ab6', 'Bb6'],
            descendingNotes: ['Ab6', 'F6', 'D6', 'Bb5', 'Ab5', 'F5', 'D5', 'Bb4', 'Ab4', 'F4', 'D4', 'Bb3', 'Ab3', 'F3', 'D3', 'Bb2', 'Eb3']
        },

        // ===== ARPEGGIOS - F# MAJOR =====
        {
            id: 'f-sharp-major-arpeggio-2nd-inversion',
            type: 'arpeggio',
            category: 'major',
            key: 'F#',
            tonality: 'major',
            displayName: 'F# Major Arpeggio (2nd Inversion)',
            tempo: { minTempo: 66, recommendedTempo: 54, examTempo: 66 },
            range: { octaves: 4, startNote: 'C#3', endNote: 'C#7' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: false },
            difficulty: { technicalLevel: 7, fingeringComplexity: 7, rhythmicComplexity: 2 },
            practiceNotes: '2nd inversion starting on C#: C#-F#-A#.',
            commonMistakes: ['Complex fingering', 'Orientation challenges']
        },
        {
            id: 'c-sharp-7-arpeggio-in-f-sharp',
            type: 'arpeggio',
            category: 'dominant7-arpeggio',
            key: 'F#',
            tonality: 'dominant7',
            displayName: 'Dominant 7th in the key of F#',
            tempo: { minTempo: 66, recommendedTempo: 54, examTempo: 66 },
            range: { octaves: 4, startNote: 'C#3', endNote: 'F#3' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: false },
            difficulty: { technicalLevel: 8, fingeringComplexity: 7, rhythmicComplexity: 2 },
            practiceNotes: 'C#7 arpeggio (C#-E#-G#-B) resolving to F#. Ends on tonic F#.',
            commonMistakes: ['Very complex fingering', 'E# placement', 'Final note confusion'],
            ascendingNotes: ['C#3', 'E#3', 'G#3', 'B3', 'C#4', 'E#4', 'G#4', 'B4', 'C#5', 'E#5', 'G#5', 'B5', 'C#6', 'E#6', 'G#6', 'B6', 'C#7'],
            descendingNotes: ['B6', 'G#6', 'E#6', 'C#6', 'B5', 'G#5', 'E#5', 'C#5', 'B4', 'G#4', 'E#4', 'C#4', 'B3', 'G#3', 'E#3', 'C#3', 'F#3']
        },

        // ===== ARPEGGIOS - A MAJOR =====
        {
            id: 'a-major-arpeggio-2nd-inversion',
            type: 'arpeggio',
            category: 'major',
            key: 'A',
            tonality: 'major',
            displayName: 'A Major Arpeggio (2nd Inversion)',
            tempo: { minTempo: 66, recommendedTempo: 54, examTempo: 66 },
            range: { octaves: 4, startNote: 'E3', endNote: 'E7' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: false },
            difficulty: { technicalLevel: 5, fingeringComplexity: 4, rhythmicComplexity: 2 },
            practiceNotes: '2nd inversion starting on E: E-A-C#.',
            commonMistakes: ['Incorrect starting note', 'Rhythm unevenness']
        },
        {
            id: 'e7-arpeggio-in-a',
            type: 'arpeggio',
            category: 'dominant7-arpeggio',
            key: 'A',
            tonality: 'dominant7',
            displayName: 'Dominant 7th in the key of A',
            tempo: { minTempo: 66, recommendedTempo: 54, examTempo: 66 },
            range: { octaves: 4, startNote: 'E3', endNote: 'A3' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: false },
            difficulty: { technicalLevel: 6, fingeringComplexity: 5, rhythmicComplexity: 2 },
            practiceNotes: 'E7 arpeggio (E-G#-B-D) resolving to A. Ends on tonic A.',
            commonMistakes: ['Missing D natural', 'Final note confusion'],
            ascendingNotes: ['E3', 'G#3', 'B3', 'D4', 'E4', 'G#4', 'B4', 'D5', 'E5', 'G#5', 'B5', 'D6', 'E6', 'G#6', 'B6', 'D7', 'E7'],
            descendingNotes: ['D7', 'B6', 'G#6', 'E6', 'D6', 'B5', 'G#5', 'E5', 'D5', 'B4', 'G#4', 'E4', 'D4', 'B3', 'G#3', 'E3', 'A3']
        },

        // ===== ARPEGGIOS - C MINOR =====
        {
            id: 'c-minor-arpeggio-2nd-inversion',
            type: 'arpeggio',
            category: 'minor',
            key: 'C',
            tonality: 'minor',
            displayName: 'C Minor Arpeggio (2nd Inversion)',
            tempo: { minTempo: 66, recommendedTempo: 54, examTempo: 66 },
            range: { octaves: 4, startNote: 'G2', endNote: 'G6' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: false },
            difficulty: { technicalLevel: 5, fingeringComplexity: 5, rhythmicComplexity: 2 },
            practiceNotes: '2nd inversion starting on G: G-C-Eb.',
            commonMistakes: ['Inversion confusion', 'Eb placement']
        },

        // ===== ARPEGGIOS - Eb MINOR =====
        {
            id: 'eb-minor-arpeggio-2nd-inversion',
            type: 'arpeggio',
            category: 'minor',
            key: 'Eb',
            tonality: 'minor',
            displayName: 'E♭ Minor Arpeggio (2nd Inversion)',
            tempo: { minTempo: 66, recommendedTempo: 54, examTempo: 66 },
            range: { octaves: 4, startNote: 'Bb2', endNote: 'Bb6' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: false },
            difficulty: { technicalLevel: 6, fingeringComplexity: 6, rhythmicComplexity: 2 },
            practiceNotes: '2nd inversion starting on Bb: Bb-Eb-Gb.',
            commonMistakes: ['Fingering errors on black keys', 'Inversion confusion']
        },

        // ===== ARPEGGIOS - F# MINOR =====
        {
            id: 'f-sharp-minor-arpeggio-2nd-inversion',
            type: 'arpeggio',
            category: 'minor',
            key: 'F#',
            tonality: 'minor',
            displayName: 'F# Minor Arpeggio (2nd Inversion)',
            tempo: { minTempo: 66, recommendedTempo: 54, examTempo: 66 },
            range: { octaves: 4, startNote: 'C#3', endNote: 'C#7' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: false },
            difficulty: { technicalLevel: 7, fingeringComplexity: 6, rhythmicComplexity: 2 },
            practiceNotes: '2nd inversion starting on C#: C#-F#-A.',
            commonMistakes: ['Starting position errors', 'Complex fingering']
        },

        // ===== ARPEGGIOS - A MINOR =====
        {
            id: 'a-minor-arpeggio-2nd-inversion',
            type: 'arpeggio',
            category: 'minor',
            key: 'A',
            tonality: 'minor',
            displayName: 'A Minor Arpeggio (2nd Inversion)',
            tempo: { minTempo: 66, recommendedTempo: 54, examTempo: 66 },
            range: { octaves: 4, startNote: 'E3', endNote: 'E7' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: false },
            difficulty: { technicalLevel: 5, fingeringComplexity: 4, rhythmicComplexity: 2 },
            practiceNotes: '2nd inversion starting on E: E-A-C.',
            commonMistakes: ['Inversion confusion', 'Legato breaks']
        },

        // ===== DIMINISHED 7TH ARPEGGIOS =====
        {
            id: 'c-dim7-arpeggio-root',
            type: 'arpeggio',
            category: 'diminished7',
            key: 'C',
            tonality: 'diminished7',
            displayName: 'C Diminished 7th Arpeggio (Root Position)',
            tempo: { minTempo: 66, recommendedTempo: 54, examTempo: 66 },
            range: { octaves: 4, startNote: 'C2', endNote: 'C6' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: false },
            difficulty: { technicalLevel: 7, fingeringComplexity: 6, rhythmicComplexity: 2 },
            practiceNotes: 'C dim7: C-Eb-Gb-A (Bbb). Equal intervals of minor 3rds.',
            commonMistakes: ['Enharmonic confusion', 'Fingering challenges']
        },

        // ===== DIMINISHED 7TH - Eb =====
        {
            id: 'eb-dim7-arpeggio-root',
            type: 'arpeggio',
            category: 'diminished7',
            key: 'Eb',
            tonality: 'diminished7',
            displayName: 'E♭ Diminished 7th Arpeggio (Root Position)',
            tempo: { minTempo: 66, recommendedTempo: 54, examTempo: 66 },
            range: { octaves: 4, startNote: 'Eb2', endNote: 'Eb6' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: false },
            difficulty: { technicalLevel: 7, fingeringComplexity: 6, rhythmicComplexity: 2 },
            practiceNotes: 'Eb dim7: Eb-Gb-A-C (Bbb-Dbb). Symmetrical intervals.',
            commonMistakes: ['Enharmonic issues', 'Black key control']
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

// Complete ABRSM Grade 8 scales database loaded
console.log(`Scales database loaded: ${ScalesData.scales.length} scales available`);
