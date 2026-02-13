# Development Guide

## Component Pattern

Each medical calculator follows a 4-file pattern:

1. **Data module** (`src/data/[name].ts`) - Clinical logic, reference data, types
2. **Svelte component** (`src/components/[Name].svelte`) - UI with `$state`/`$derived`
3. **Astro page** (`src/pages/[name].astro`) - Layout wrapper with `client:load`
4. **Tool registry** (`src/data/tools.ts`) - Add entry with `featured`, `status`, `level`

### Svelte 5 Component Template

```svelte
<script lang="ts">
  import { dataFunction } from '../data/[name].js';

  let input = $state<number>(0);
  const result = $derived.by(() => {
    try {
      if (!isValidInput(input)) return { error: 'Invalid', result: null };
      return { error: null, result: calculate(input) };
    } catch (error) {
      return { error: 'Calculation failed', result: null };
    }
  });
</script>
```

### Astro Page Template

```astro
---
import Layout from '../layouts/Layout.astro';
import CalculatorComponent from '../components/Calculator.svelte';
---
<Layout title="Calculator | EMT Calculator Tools" showBackButton={true}>
  <CalculatorComponent client:load />
</Layout>
```

## TypeScript

- Strict mode enabled with `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess`
- All medical types in `src/types/medical.ts`
- EMT levels: `EMT-B`, `EMT-A`, `AEMT`, `Paramedic`, `All`
- Tool statuses: `active`, `coming-soon`, `planned`

## Code Quality

- Run `pnpm astro check` before committing (catches TS errors in Astro/Svelte)
- Run `pnpm build` to verify all pages compile
- Use `$derived.by()` for calculations, not manual state updates
- Error boundaries on all medical calculations
- No `any` types in medical calculation code

## Testing (Planned)

Future: `vitest` for unit tests, `@playwright/test` for E2E. See [PWA & Deployment Guide](pwa-deployment.md) for CI/CD integration plans.