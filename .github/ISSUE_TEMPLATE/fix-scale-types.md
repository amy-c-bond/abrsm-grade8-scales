---
name: Fix Scale Types and Special Scales
about: Correct scale type categorization and ensure all special scales are properly implemented
title: 'Fix scale types: dominant 7ths, staccato sixths, and scales in thirds'
labels: bug, data, enhancement
assignees: ''
---

## 🐛 Bug Description

Several scale types in the database need to be corrected or enhanced to properly match the ABRSM Grade 8 (2025/2026) syllabus requirements.

## 📋 Issues to Fix

### 1. Dominant 7th Arpeggios - Incorrect Tonality Value
**Current State:**
- Dominant 7th arpeggios have `tonality: 'dominant7'`
- This should be a proper tonality designation

**Expected Behavior:**
- Should use a standard tonality or `null` since dominant 7ths aren't major/minor
- Consider using `tonality: null` or a more descriptive value

**Affected Files:**
- `js/data/scales-data.js` (lines ~490, 507, 524, 541 - all dominant 7th entries)

**Example:**
```javascript
// Current (INCORRECT):
{
    id: 'c7-arpeggio-root',
    type: 'arpeggio',
    category: 'dominant7',
    key: 'C',
    tonality: 'dominant7',  // ❌ Should be null or different
    displayName: 'C7 Arpeggio (Root Position)',
    ...
}

// Should be:
{
    id: 'c7-arpeggio-root',
    type: 'arpeggio',
    category: 'dominant7',
    key: 'C',
    tonality: null,  // ✅ or 'dominant' if needed
    displayName: 'C7 Arpeggio (Root Position)',
    ...
}
```

### 2. Diminished 7th Arpeggios - Same Issue
**Current State:**
- Diminished 7th arpeggios have `tonality: 'diminished7'`

**Expected Behavior:**
- Should use `tonality: null` or a more appropriate value

**Affected Files:**
- `js/data/scales-data.js` (lines ~558, 575 - diminished 7th entries)

### 3. Staccato Scale in Sixths - Missing Category Label
**Current State:**
- C Major Staccato Scale in Sixths exists but may not have proper category
- Category label might not display correctly in scale browser

**Expected Behavior:**
- Ensure proper categorization for display
- Add to `getCategoryLabel()` method in dashboard.js if needed

**Affected Files:**
- `js/data/scales-data.js` (line ~337)
- `js/components/dashboard.js` - `getCategoryLabel()` method

### 4. Scale in Thirds - Not Fully Implemented
**Current State:**
- E♭ Major Scale in Thirds exists (line ~79)
- Need to verify it has all required properties
- Tempo should be 52 BPM (currently correct)
- Should be 2 octaves (currently correct)

**Expected Behavior:**
- Confirm proper implementation
- Ensure category label displays correctly
- Verify tempo and range match ABRSM requirements

**Affected Files:**
- `js/data/scales-data.js` (line ~79)
- `js/components/dashboard.js` - `getCategoryLabel()` method

## 🔧 Proposed Solution

### Step 1: Fix Tonality for 7th Arpeggios
```javascript
// Update all dominant 7th arpeggios:
tonality: null,  // or 'dominant'

// Update all diminished 7th arpeggios:
tonality: null,  // or 'diminished'
```

### Step 2: Update getCategoryLabel() Method
Add special scale type labels to the dashboard component:

```javascript
getCategoryLabel(category) {
    const labels = {
        'major': 'Major',
        'minor': 'Minor',
        'minorHarmonic': 'Harmonic Minor',
        'minorMelodic': 'Melodic Minor',
        'chromatic': 'Chromatic',
        'wholeTone': 'Whole-Tone',
        'dominant7': 'Dominant 7th',
        'diminished7': 'Diminished 7th',
        'thirds': 'In Thirds',           // ✅ ADD
        'sixths': 'Staccato in Sixths',  // ✅ ADD
        'sixthsApart': 'Sixth Apart'     // ✅ ADD (for chromatic)
    };
    return labels[category] || category;
}
```

### Step 3: Review All Special Scales
Ensure these scales have appropriate category values:
- C Major Staccato Scale in Sixths → `category: 'sixths'`
- E♭ Major Scale in Thirds → `category: 'thirds'` (verify)
- C Chromatic Scale → `category: 'chromatic'` or `category: 'sixthsApart'`

## ✅ Acceptance Criteria

- [ ] All dominant 7th arpeggios have correct tonality value (not `'dominant7'`)
- [ ] All diminished 7th arpeggios have correct tonality value (not `'diminished7'`)
- [ ] Staccato scale in sixths displays correct category label in browser
- [ ] Scale in thirds displays correct category label in browser
- [ ] All special scales are easily identifiable in the scale browser
- [ ] No console errors or warnings related to scale type categorization
- [ ] Updated `getCategoryLabel()` method handles all scale types

## 📝 Additional Context

**ABRSM 2025/2026 Syllabus Requirements:**
- Scale in thirds: E♭ major, 2 octaves, legato only, 52 BPM (minims)
- Staccato scale in sixths: C major, 2 octaves, hands separately, 54 BPM (minims)
- Chromatic: Hands a sixth apart, 4 octaves, 60 BPM (minims)

**Current Scale Count:** 35 scales/arpeggios
- 21 scales
- 8 major/minor arpeggios (2nd inversion)
- 4 dominant 7th arpeggios (root position)
- 2 diminished 7th arpeggios (root position)

## 🔗 Related Files

- `js/data/scales-data.js` - Main scales database
- `js/components/dashboard.js` - Scale browser with category labels
- `docs/ABRSM_GRADE_8_REQUIREMENTS.md` - Official requirements reference

## 🏷️ Labels

- `bug` - Incorrect tonality values
- `data` - Database structure issue
- `enhancement` - Improve category labeling
- `good first issue` - Clear solution provided

---

**Priority:** Medium  
**Estimated Effort:** 1-2 hours  
**Impact:** Improves data accuracy and user experience in scale browser
