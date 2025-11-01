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
            commonMistakes: ['Hands not synchronized', 'Uneven dynamics']
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

        // ===== DOMINANT 7TH ARPEGGIOS =====
        {
            id: 'c7-arpeggio-root',
            type: 'arpeggio',
            category: 'dominant7',
            key: 'C',
            tonality: 'dominant7',
            displayName: 'C7 Arpeggio (Root Position)',
            tempo: { minTempo: 66, recommendedTempo: 54, examTempo: 66 },
            range: { octaves: 4, startNote: 'C2', endNote: 'C6' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: false },
            difficulty: { technicalLevel: 6, fingeringComplexity: 5, rhythmicComplexity: 2 },
            practiceNotes: 'C7: C-E-G-Bb. Four note arpeggio. Root position.',
            commonMistakes: ['Missing Bb', 'Fingering complexity']
        },

        // ===== DOMINANT 7TH - Eb =====
        {
            id: 'eb7-arpeggio-root',
            type: 'arpeggio',
            category: 'dominant7',
            key: 'Eb',
            tonality: 'dominant7',
            displayName: 'E♭7 Arpeggio (Root Position)',
            tempo: { minTempo: 66, recommendedTempo: 54, examTempo: 66 },
            range: { octaves: 4, startNote: 'Eb2', endNote: 'Eb6' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: false },
            difficulty: { technicalLevel: 7, fingeringComplexity: 6, rhythmicComplexity: 2 },
            practiceNotes: 'Eb7: Eb-G-Bb-Db. Root position with black keys.',
            commonMistakes: ['Black key control', 'Missing Db']
        },

        // ===== DOMINANT 7TH - F# =====
        {
            id: 'f-sharp-7-arpeggio-root',
            type: 'arpeggio',
            category: 'dominant7',
            key: 'F#',
            tonality: 'dominant7',
            displayName: 'F#7 Arpeggio (Root Position)',
            tempo: { minTempo: 66, recommendedTempo: 54, examTempo: 66 },
            range: { octaves: 4, startNote: 'F#2', endNote: 'F#6' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: false },
            difficulty: { technicalLevel: 8, fingeringComplexity: 7, rhythmicComplexity: 2 },
            practiceNotes: 'F#7: F#-A#-C#-E. Challenging black key arpeggio.',
            commonMistakes: ['Very complex fingering', 'Orientation challenges']
        },

        // ===== DOMINANT 7TH - A =====
        {
            id: 'a7-arpeggio-root',
            type: 'arpeggio',
            category: 'dominant7',
            key: 'A',
            tonality: 'dominant7',
            displayName: 'A7 Arpeggio (Root Position)',
            tempo: { minTempo: 66, recommendedTempo: 54, examTempo: 66 },
            range: { octaves: 4, startNote: 'A2', endNote: 'A6' },
            handsOptions: { together: true, separately: false, contraryMotion: false },
            articulation: { legato: true, staccato: false },
            difficulty: { technicalLevel: 6, fingeringComplexity: 5, rhythmicComplexity: 2 },
            practiceNotes: 'A7: A-C#-E-G. Root position.',
            commonMistakes: ['Missing G natural', 'Four-note coordination']
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
