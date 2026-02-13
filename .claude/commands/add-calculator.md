Scaffold a new medical calculator following the established 4-file pattern.

Ask the user for:
- Calculator name (e.g., "IV Drip Rate Calculator")
- Short name for navigation (e.g., "IV Drip")
- Brief description
- Medical subcategory (Respiratory, Airway, Medications, Assessment)
- EMT level (EMT-B, EMT-A, AEMT, Paramedic, All)
- Whether it should be featured on the home page

Then create these files:

1. **`src/data/[name].ts`** - Data module with:
   - TypeScript interfaces for the calculator's inputs/outputs
   - Clinical reference data and constants
   - Calculation functions with error handling
   - Medical citations in file header

2. **`src/components/[Name].svelte`** - Svelte 5 component with:
   - `$state` for inputs, `$derived.by` for calculations
   - Input validation with physiological limits
   - Error boundaries wrapping all calculations
   - Theme-aware styling (use `theme-*` classes + `dark:` variants)
   - Touch targets minimum 44px (`py-3` on buttons)
   - ARIA labels on all interactive elements
   - Run `mcp__svelte-docs__svelte-autofixer` to validate

3. **`src/pages/[name].astro`** - Astro page with:
   - Layout wrapper with title and description
   - `showBackButton={true}`
   - Component loaded with `client:load`
   - Educational content sections below the calculator

4. **`src/data/tools.ts`** - Add entry to `CALCULATORS` array with all fields

5. **`public/sw.ts`** - Add the new page URL to both `ESSENTIAL_FILES` and `PRECACHE_URLS`

After creating all files, run `pnpm build` to verify everything compiles.