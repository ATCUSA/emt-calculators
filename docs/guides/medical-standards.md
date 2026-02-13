# Medical Standards Guide

## Safety Principles

1. **Safety First** - All changes must maintain or improve medical accuracy
2. **Validation Required** - Every input needs physiological limit checking
3. **Never Crash** - Wrap all calculations in error handling
4. **Cite Sources** - All formulas must reference peer-reviewed literature
5. **Conservative Values** - Use safety margins for critical calculations

## Input Validation Limits

| Parameter | Min | Max | Confirm At |
|-----------|-----|-----|------------|
| Heart Rate (bpm) | 40 | 220 | <40 or >150 |
| Systolic BP (mmHg) | 40 | 300 | <70 or >200 |
| Diastolic BP (mmHg) | 20 | 200 | - |
| SpO2 (%) | 0 | 100 | <88% |
| Respiratory Rate | 0 | 60 | - |
| Temperature (F) | 80 | 110 | <94 or >106 |
| O2 Flow Rate (L/min) | 0 | 25 | - |
| O2 Tank Duration | - | - | <30 min |

## Error Handling Pattern

```typescript
const result = $derived.by(() => {
  try {
    if (!isValidInput(input)) {
      return { error: 'Invalid input', result: null };
    }
    const value = performCalculation(input);
    return { error: null, result: value };
  } catch (error) {
    console.error('Calculation error:', error);
    return { error: 'Calculation failed. Verify inputs.', result: null };
  }
});
```

## Urgency Color Coding

| Level | Use | Colors (with dark mode) |
|-------|-----|------------------------|
| Normal | Values within range | `bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200` |
| Caution | Borderline values | `bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200` |
| Critical | Life-threatening | `bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200` |

## Citation Format

Include in file header comments:
```typescript
/**
 * @citations
 *   - Author, et al. Title. Journal. Year;Volume:Pages
 *   - Organization. Guideline Name. Year
 */
```

## Age-Appropriate Calculations

- Always separate pediatric vs adult pathways
- Use established age group breakpoints from clinical guidelines
- Reference data in `src/data/vitalSigns.ts` for age-based normal ranges

## Medical Review Checklist

- [ ] Formula matches cited medical literature
- [ ] Input validation with physiological limits
- [ ] Critical values trigger confirmation/warnings
- [ ] Age-appropriate calculations properly separated
- [ ] Units clearly labeled
- [ ] Error handling wraps all calculations
- [ ] Citations included