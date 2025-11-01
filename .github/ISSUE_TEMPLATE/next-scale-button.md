---
name: Add "Next Scale" Button to Randomizer
about: Quick navigation to next random scale for efficient practice sessions
title: '[Enhancement] Add "Next Scale" button to randomizer for continuous practice'
labels: enhancement, ui-ux, randomizer
assignees: ''
---

## Feature Description
Add a **"Next Scale" button** to the randomizer interface that allows users to quickly move to the next random scale without scrolling back to the top or navigating away from the current scale card.

## Current Behavior
- User clicks "Randomize Scale" button (typically at top of page)
- Scale information is displayed
- To get another random scale, user must:
  - Scroll back to top
  - Click "Randomize Scale" again
  - Scroll back down to see new scale

## Proposed Behavior
- After a scale is displayed, show a prominent **"Next Scale"** button within or below the scale card
- Clicking "Next Scale" immediately loads another random scale using the same filters/settings
- Maintains practice flow without requiring navigation or scrolling
- Button persists and updates with each new scale

## User Benefits
- **Seamless practice flow**: Stay focused on practicing without UI interruption
- **Faster scale rotation**: One click to next scale vs scroll-click-scroll
- **Better mobile experience**: Less scrolling and navigation on touch devices
- **Continuous practice mode**: Practice multiple scales in quick succession
- **Reduced friction**: Lower barrier to practicing more scales per session

## Implementation Notes

### UI Placement Options
**Option 1: Below scale card**
```html
<div class="scale-card">
  <!-- Scale information -->
</div>
<button class="btn btn-primary btn-lg btn-next-scale">
  Next Scale <i class="bi bi-arrow-right"></i>
</button>
```

**Option 2: Within scale card footer**
```html
<div class="scale-card">
  <!-- Scale information -->
  <div class="card-footer">
    <button class="btn btn-primary btn-next-scale">
      <i class="bi bi-shuffle"></i> Next Scale
    </button>
    <button class="btn btn-secondary">
      <i class="bi bi-bookmark"></i> Save Progress
    </button>
  </div>
</div>
```

**Option 3: Floating action button (mobile-friendly)**
```html
<button class="btn btn-primary btn-floating btn-next-scale">
  <i class="bi bi-arrow-right-circle"></i>
</button>
```

### Components to Modify
- `js/components/randomizer.js` - Add `nextScale()` method
- `js/components/dashboard.js` - Update scale display template
- `css/main.css` - Style "Next Scale" button

### Suggested Implementation
```javascript
class Randomizer {
  // ... existing code ...
  
  nextScale() {
    // Reuse existing randomize logic with current filters
    const randomScale = this.getRandomScale();
    this.displayScale(randomScale);
    
    // Optional: Add to practice history
    this.addToHistory(randomScale);
    
    // Trigger event for analytics/tracking
    eventBus.emit('scale:next', { scaleId: randomScale.id });
  }
  
  displayScale(scale) {
    // ... existing display code ...
    
    // Add "Next Scale" button
    const nextButton = document.createElement('button');
    nextButton.className = 'btn btn-primary btn-lg mt-3 btn-next-scale';
    nextButton.innerHTML = '<i class="bi bi-arrow-right"></i> Next Scale';
    nextButton.addEventListener('click', () => this.nextScale());
    
    scaleContainer.appendChild(nextButton);
  }
}
```

### Keyboard Shortcut (Optional Enhancement)
- Add keyboard shortcut: `N` key or `→` (right arrow) for "Next Scale"
- Improve accessibility and speed for keyboard users
- Document shortcut in help/settings panel

### Analytics Considerations
- Track "Next Scale" button usage vs top "Randomize Scale" button
- Monitor average scales practiced per session (may increase)
- Identify power users who cycle through many scales quickly

## Acceptance Criteria
- [ ] "Next Scale" button appears after a scale is displayed
- [ ] Clicking "Next Scale" loads a new random scale
- [ ] Button respects current randomizer filters and settings
- [ ] Scale history continues to update correctly
- [ ] Button is visually prominent and accessible
- [ ] Works on mobile and desktop viewports
- [ ] No page scroll or layout shift when clicked
- [ ] Loading state shows while fetching next scale (if needed)
- [ ] Optional: Keyboard shortcut implemented and documented

## Priority
**High** - Significant UX improvement for practice workflow

## Related Issues
- #[compact-scale-card] - Could combine with expandable details feature
- Phase 3.1 - Advanced Randomizer (already complete)

## Related Components
- `js/components/randomizer.js` - Main logic
- `js/components/dashboard.js` - UI rendering
- `js/components/progress-tracker.js` - Session tracking
- `css/main.css` - Button styling

## Design Considerations
- Button should be visually distinct from other actions
- Consider using primary color for emphasis
- Icon suggestion: arrow-right, shuffle, or repeat icon
- Maintain consistent spacing with other UI elements
- Ensure button doesn't interfere with scale information

## Additional Enhancements (Future)
- "Previous Scale" button to go back in history
- "Practice Session Mode" - auto-advance after X seconds/minutes
- Quick practice statistics: "5 scales practiced in this session"
- Option to "Skip" scales that are too easy/hard
