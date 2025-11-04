## Feature Request

Add support for different time signatures to the metronome component.

### Current Behavior:

- Metronome only supports 4/4 time signature
- Beat indicator shows 4 dots for 4 beats
- No way to change time signature for different practice needs

### Proposed Behavior:

Add a time signature selector to the navbar metronome that supports common time signatures:

- **4/4** (Common time) - current default
- **3/4** (Waltz time)
- **2/4** (March time)
- **6/8** (Compound time)
- **5/4** (Irregular time)
- **7/8** (Irregular time)

### Implementation Details:

1. **UI Component:**
   - Add dropdown or button group next to tempo controls
   - Display current time signature (e.g., "4/4")
   - Compact design to fit in navbar

2. **Beat Indicator:**
   - Dynamically adjust number of beat dots based on time signature
   - Highlight downbeat (first beat) differently
   - Handle compound time signatures (6/8 = 2 groups of 3)

3. **Audio:**
   - Adjust beat emphasis pattern for different signatures
   - Downbeat at higher pitch/volume
   - Secondary accents for compound meters

4. **Persistence:**
   - Save selected time signature to localStorage
   - Restore on page load

### Benefits:

- Practice with correct rhythmic feel for different scales
- Better preparation for exam conditions
- More versatile practice tool
- Educational value understanding different meters

### Technical Notes:

- Update `metronome.js` to accept time signature parameter
- Modify beat scheduling logic for different beat counts
- Update navbar HTML/CSS for time signature selector
- Consider accessibility for screen readers
