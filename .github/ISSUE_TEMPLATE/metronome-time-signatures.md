---
name: Add Multiple Time Signatures to Metronome
about: Enhance metronome with selectable time signatures for different practice needs
title: '[Enhancement] Add time signature selector to metronome'
labels: enhancement, metronome, ui-ux
assignees: ''
---

## Feature Description
Add a time signature selector to the navbar metronome, allowing users to practice with different time signatures beyond the default 4/4.

## Current Behavior
- Metronome is hardcoded to 4/4 time signature
- Always displays 4 beat indicators
- All practice sessions use quarter note clicks in 4/4 time

## Proposed Behavior
Add a dropdown or button group to select common time signatures:

### Suggested Time Signatures
- **4/4** (Common time) - Current default
- **3/4** (Waltz time)
- **2/4** (March time)
- **6/8** (Compound time)
- **5/4** (Irregular time)
- **7/8** (Irregular time)
- **3/8** 
- **2/2** (Cut time)

## User Benefits
- **Practice versatility**: Work with different rhythmic feels
- **Exam preparation**: Some scale requirements may benefit from different time signatures
- **Musical awareness**: Develop sense of different meters
- **Flexible practice**: Adapt metronome to different musical contexts

## Implementation Notes

### UI Components to Modify
- `index.html` - Add time signature selector to navbar metronome
- `js/app.js` - Update navbar metronome event handlers
- `js/components/metronome.js` - Already supports variable beatsPerBar
- `css/main.css` - Style time signature selector

### Suggested UI Layout

**Option 1: Dropdown**
```html
<select id="time-signature-select" class="form-select form-select-sm">
  <option value="4">4/4</option>
  <option value="3">3/4</option>
  <option value="2">2/4</option>
  <option value="6">6/8</option>
  <option value="5">5/4</option>
  <option value="7">7/8</option>
</select>
```

**Option 2: Button Group (Mobile-friendly)**
```html
<div class="btn-group btn-group-sm" role="group">
  <button class="btn btn-outline-secondary active">4/4</button>
  <button class="btn btn-outline-secondary">3/4</button>
  <button class="btn btn-outline-secondary">6/8</button>
  <button class="btn btn-outline-secondary">More...</button>
</div>
```

### Visual Beat Indicators
- Dynamically adjust number of beat dots based on time signature
- For 6/8, could show 6 dots or 2 groups of 3
- Compound meters (6/8, 9/8, 12/8) could have different visual grouping

### Code Changes

**app.js - Update setupNavbarMetronome()**
```javascript
const timeSigSelect = document.getElementById('time-signature-select');

if (timeSigSelect) {
    timeSigSelect.addEventListener('change', (e) => {
        const beatsPerBar = parseInt(e.target.value);
        this.updateBeatIndicatorCount(beatsPerBar);
        
        if (metronome.isPlaying) {
            const tempo = parseInt(metroTempoInput.value) || 88;
            metronome.stop();
            metronome.start(tempo, beatsPerBar);
        } else {
            metronome.beatsPerBar = beatsPerBar;
        }
    });
}
```

**app.js - New method**
```javascript
updateBeatIndicatorCount(count) {
    const beatIndicator = document.querySelector('.beat-indicator-navbar');
    if (!beatIndicator) return;
    
    // Clear existing dots
    beatIndicator.innerHTML = '';
    
    // Add new dots based on count
    for (let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        dot.className = 'beat-dot-small';
        beatIndicator.appendChild(dot);
    }
}
```

### Storage and Persistence
- Save selected time signature to localStorage or settings database
- Restore last used time signature on app load
- Per-scale time signature suggestions (optional)

## Acceptance Criteria
- [ ] Time signature selector visible in navbar metronome
- [ ] Common time signatures selectable (at minimum: 4/4, 3/4, 2/4, 6/8)
- [ ] Beat indicator dots update to match selected time signature
- [ ] Metronome clicks correctly for each time signature
- [ ] Downbeat emphasis on first beat of each bar
- [ ] Time signature persists across page reloads
- [ ] Works on mobile and desktop
- [ ] No visual overflow or layout issues with more/fewer dots
- [ ] Smooth transition when changing time signature

## Priority
**Medium** - Enhances practice flexibility but current 4/4 works for most scales

## Related Components
- `index.html` - Navbar structure
- `js/app.js` - Navbar metronome setup
- `js/components/metronome.js` - Already supports beatsPerBar parameter
- `css/main.css` - Beat indicator styling
- `js/services/storage-manager.js` - Settings persistence

## Additional Considerations

### Compound Meter Handling
For 6/8, 9/8, 12/8 time signatures:
- Could group beat indicators visually (e.g., 6/8 as two groups of 3)
- Consider different click sounds for primary and secondary beats
- Strong beat on 1 and 4 in 6/8 (compound duple)

### Visual Grouping Ideas
```
4/4: • • • •
3/4: • • •
6/8: • • • | • • •
5/4: • • • | • •
```

### Alternative Enhancement
Add a "Custom" option allowing users to input any number from 1-12 beats per bar

### Future Extensions
- Polyrhythm support (two metronomes at once)
- Subdivision clicks (eighth notes, triplets)
- Accent patterns within bars
- Tempo ramping (gradual speed changes)
