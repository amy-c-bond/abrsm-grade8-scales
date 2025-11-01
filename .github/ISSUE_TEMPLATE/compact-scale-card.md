---
name: Compact Scale Card with Expandable Details
about: Improve randomizer UX with a small initial card and expandable information
title: '[Enhancement] Compact scale card with expandable details in randomizer'
labels: enhancement, ui-ux, randomizer
assignees: ''
---

## Feature Description
When using the "Randomize Scale" button, the app currently displays all scale information immediately. This should be improved with a two-stage approach:
1. Show a **small, compact scale card** initially with just essential information
2. Provide an **"Show Details" button** to expand and view full scale information

## Current Behavior
- Clicking "Randomize Scale" displays full scale information immediately
- All details (notation, fingering suggestions, key signature, etc.) are visible at once
- Can be overwhelming for quick practice sessions

## Proposed Behavior
### Initial Small Card
Display minimal information:
- Scale name (e.g., "C major scale")
- Key signature
- Scale type/category badge
- Tempo/BPM recommendation
- **"Show Details" button**

### Expanded View (after clicking button)
Show complete information:
- Full musical notation (treble and bass clef)
- Fingering diagram suggestions
- Technical notes
- Practice tips
- Audio playback controls
- Record button

## User Benefits
- **Quick glance**: Users can see the scale name immediately without distraction
- **Progressive disclosure**: Details only when needed
- **Faster practice flow**: Quick randomization without information overload
- **Better mobile experience**: Less scrolling on smaller screens

## Implementation Notes

### UI Components to Modify
- `js/components/randomizer.js` - Update `displayScale()` method
- `js/components/dashboard.js` - Add compact card template
- `css/main.css` - Add styles for compact vs expanded states

### Suggested Structure
```javascript
// Compact card HTML structure
<div class="scale-card compact">
  <h3 class="scale-name">C major scale</h3>
  <span class="key-signature-badge">No sharps/flats</span>
  <span class="category-badge">Major Scales</span>
  <div class="tempo-info">♩ = 120 BPM</div>
  <button class="btn btn-primary btn-show-details">
    <i class="bi bi-info-circle"></i> Show Details
  </button>
</div>

// Expanded card (toggled by button)
<div class="scale-card expanded">
  <!-- All existing scale information -->
  <button class="btn btn-secondary btn-hide-details">
    <i class="bi bi-chevron-up"></i> Hide Details
  </button>
</div>
```

### CSS Transitions
- Smooth expansion animation using CSS transitions
- Fade-in effect for detailed content
- Maintain card position to prevent layout shift

### State Management
- Use class toggles: `.compact` / `.expanded`
- Store user preference in localStorage (always expanded/compact)
- Event listener for "Show Details" button

## Acceptance Criteria
- [ ] Clicking "Randomize Scale" shows compact card first
- [ ] Compact card displays scale name, key signature, category, and tempo
- [ ] "Show Details" button is clearly visible and accessible
- [ ] Clicking "Show Details" smoothly expands to full information
- [ ] Option to collapse back to compact view
- [ ] Animations are smooth (300ms transition recommended)
- [ ] Works on mobile and desktop viewports
- [ ] User preference can be saved (optional enhancement)

## Priority
**Medium** - Enhances UX but current functionality works

## Related Components
- `js/components/randomizer.js` - Main logic
- `js/components/dashboard.js` - UI rendering
- `css/main.css` - Styling
- `js/components/scale-challenge.js` - May benefit from similar approach

## Additional Considerations
- Could apply same pattern to "Scale Browser" when clicking individual scales
- Consider adding keyboard shortcut (e.g., Space bar to expand/collapse)
- Analytics: Track how often users expand details vs practice immediately
