# ABRSM Grade 8 Piano Scales Practice App

A modern, interactive web application designed to help ABRSM Grade 8 pianists master their scales, arpeggios, and broken chords through intelligent practice and real-time feedback.

## 🎹 Features

### ✅ Implemented (Current Version)
- **Complete ABRSM Grade 8 Syllabus (2025/2026)**: 35 scales and arpeggios covering all requirements
  - 4 keys: C, E♭, F#, A (major and minor)
  - Major/minor scales in similar and contrary motion
  - Harmonic and melodic minor scales
  - Chromatic, whole-tone, and special scales
  - Arpeggios (2nd inversion for major/minor, root position for dominant/diminished 7th)
- **Enhanced Scale Browser**: 
  - Grouped by key with visual hierarchy
  - Filter by type (All/Scales/Arpeggios)
  - Real-time search with category matching
  - Hover effects with visual feedback
- **Musical Notation Display**: 
  - VexFlow-powered grand staff notation
  - Automatic key signatures
  - Proper clef assignment (treble/bass)
- **Intelligent Randomizer**: Random scale selection for varied practice
- **Progress Tracking Infrastructure**: IndexedDB backend ready for session recording
- **Modern UI**: Clean, responsive Bootstrap 5 design with dark mode support
- **Offline-First Architecture**: IndexedDB for data persistence

### 🔄 In Development
- **Audio Integration**: 
  - Play reference audio for each scale
  - Record and assess your performance with microphone input
  - Visual and audio metronome with adjustable tempo
- **Interactive Fingering Diagrams**: Visual guides showing proper hand positions
- **Adaptive Learning**: Difficulty adjusts based on your performance
- **Progress Visualization**: Charts and analytics dashboard

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/amy-c-bond/abrsm-grade8-scales.git
   cd abrsm-grade8-scales
   ```

2. Open `index.html` in your browser (Chrome or Firefox recommended)

That's it! No build process or dependencies required - it's a simple single-page application.

## 🆕 Recent Updates (November 2025)

- ✅ **Complete scales database**: All 35 ABRSM Grade 8 scales/arpeggios (2025/2026 syllabus)
- ✅ **Enhanced scale browser**: Grouped by key, filterable, with improved search
- ✅ **Key signatures**: Automatic key signature display in musical notation
- ✅ **Improved UX**: Better hover effects, visual feedback, and dark mode support
- ✅ **Correct arpeggio inversions**: 2nd inversion for major/minor, root for dominant/diminished 7th
- ✅ **Accurate tempo markings**: All scales set to correct BPM per ABRSM requirements

## 📖 How to Use

1. **Start Practice**: Click "Generate Random Scale" to get a challenge
2. **View Fingering**: See the interactive fingering diagram for the selected scale
3. **Set Tempo**: Adjust the metronome to your comfortable practice speed
4. **Play Along**: Practice the scale on your keyboard
5. **Record & Assess**: Use the microphone feature to record and get feedback
6. **Track Progress**: View your improvement statistics over time

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Bootstrap 5, Vanilla JavaScript
- **Audio**: Web Audio API
- **Storage**: IndexedDB for offline persistence
- **Graphics**: Canvas API for interactive diagrams
- **PWA**: Service Workers for offline support

## 🤝 Contributing

Contributions are welcome! This is an open-source educational project.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development process.

## 📋 Roadmap

See [PROJECT_PLAN.md](PROJECT_PLAN.md) for the complete development roadmap.

### Phase 1: Research & Requirements ✅ COMPLETE
- [x] Project setup and documentation
- [x] ABRSM Grade 8 syllabus research (2025/2026 requirements)
- [x] Database structure and JSON schemas
- [x] User journey mapping and wireframes
- [x] Component architecture design
- [x] Technical specifications

### Phase 2: Core Infrastructure ✅ COMPLETE
- [x] Complete scales database (35 scales/arpeggios)
- [x] Enhanced UI with Bootstrap 5.3.2
- [x] Random scale selector
- [x] Musical notation with VexFlow
- [x] Scale browser with filtering and grouping
- [x] Dark mode support

### Phase 3: Audio & Practice 🔄 IN PROGRESS
- [ ] Audio playback system (Web Audio API)
- [ ] Microphone input and assessment
- [ ] Metronome implementation
- [x] Basic challenge interface

### Phase 4: Learning Features 🔄 IN PROGRESS
- [x] Progress tracking infrastructure
- [ ] Progress visualization dashboard
- [ ] Adaptive difficulty
- [ ] Fingering diagrams
- [ ] Session recording

### Phase 5: Polish & Testing ⏳ PLANNED
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] Complete offline functionality
- [x] Responsive design

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎓 About ABRSM Grade 8 (2025/2026 Syllabus)

The ABRSM (Associated Board of the Royal Schools of Music) Grade 8 examination represents an advanced level of piano proficiency. This app covers all the technical requirements for the 2025/2026 syllabus including:

**Keys**: C, E♭, F#, A (major and minor)

**Scales** (88 BPM in minims):
- Major scales: similar motion (4 octaves), contrary motion (2 octaves)
- Minor scales: harmonic and melodic (4 octaves)
- Chromatic scale: hands a sixth apart (4 octaves, 60 BPM)
- Whole-tone scales: C and E♭ (4 octaves)
- Scale in thirds: E♭ major (2 octaves, 52 BPM)
- Staccato scale in sixths: C major, hands separately (2 octaves, 54 BPM)

**Arpeggios** (66 BPM in minims):
- Major and minor: 2nd inversion (4 octaves)
- Dominant 7th: root position (4 octaves)
- Diminished 7th: root position (4 octaves)

All scales and arpeggios to be played **hands together** (unless specified separately), with both **legato** and **staccato** articulation as required.

## 🙏 Acknowledgments

- ABRSM for setting the standards in music education
- The open-source community for inspiration and tools
- Piano students and teachers for valuable feedback

## 📧 Contact

Project Link: [https://github.com/amy-c-bond/abrsm-grade8-scales](https://github.com/amy-c-bond/abrsm-grade8-scales)

---

**Note**: This is an educational tool and is not officially affiliated with ABRSM.
