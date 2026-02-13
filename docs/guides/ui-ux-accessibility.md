# UI/UX & Accessibility Guide

## Theme System

Defined in `src/styles/global.css` using CSS custom properties. Supports dark (default), light, and auto themes.

### Theme Classes (Always Use These)

| Class | Purpose |
|-------|---------|
| `theme-bg-primary` | Page background |
| `theme-bg-secondary` | Card/section background |
| `theme-bg-tertiary` | Input/nested backgrounds |
| `theme-text-primary` | Main text |
| `theme-text-secondary` | Supporting text |
| `theme-text-muted` | Subtle/disabled text |
| `theme-accent-primary` | Links, highlights |
| `theme-border-primary` | Primary borders |
| `theme-border-secondary` | Secondary borders |

### Semantic Colors (Alerts, Badges)

For colored elements that must work in both themes, always pair light and dark variants:

```html
<!-- Correct -->
<div class="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700">

<!-- Wrong - breaks in dark mode -->
<div class="bg-red-100 text-red-800">
```

### Common Patterns

- **Alert boxes:** `bg-{color}-100 dark:bg-{color}-900/20 border border-{color}-200 dark:border-{color}-700`
- **Badges:** `bg-{color}-100 dark:bg-{color}-900/30 text-{color}-800 dark:text-{color}-200`
- **Hover states:** `hover:bg-gray-50 dark:hover:bg-gray-700/50`

## Touch Targets

EMT field use requires larger targets for gloved hands and stress conditions:

| Element | Minimum | Preferred | Tailwind |
|---------|---------|-----------|----------|
| Primary buttons | 44px | 60px | `py-3 px-4` |
| Radio/checkbox labels | 44px | - | `p-3` |
| Header nav links | 32px | 44px | `py-2 px-3` |
| Input fields | 44px | - | `p-3` |

## Accessibility (WCAG 2.1 AA)

### Required

- **Labels:** All inputs need associated `<label>` with `for` attribute
- **ARIA:** Buttons need descriptive `aria-label` when text isn't clear
- **Focus:** Visible focus indicators (`focus:ring-2 focus:ring-blue-500`)
- **Color contrast:** 4.5:1 minimum for normal text, 3:1 for large text
- **Screen readers:** Use `aria-live="assertive"` for critical result announcements

### Emergency Mode Considerations

- Large text for rapid reading under stress
- Color-coded urgency levels (green/yellow/red)
- Clear visual hierarchy - most important info first
- Results accessible within 2 taps from home screen
- Offline-first - all critical calculators work without network

## Button Styling Standard

```html
<!-- Primary action -->
<button class="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">

<!-- Secondary/reset -->
<button class="px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
```