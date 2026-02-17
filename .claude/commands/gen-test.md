Generate a Vitest test file for the specified data module or component.

Follow these patterns:
- Test file goes in `src/__tests__/<module-name>.test.ts`
- Import the calculation function from `src/data/<module>.ts`
- Test boundary conditions (min/max validation ranges from the module's VALIDATION constant)
- Test critical medical thresholds (values that trigger warnings or special handling)
- Test edge cases (zero, negative, NaN, Infinity, division by zero)
- Test expected calculation accuracy against known reference values
- Test that all exported functions return the correct types
- Use `describe` blocks grouped by function name
- Use clear test names that describe the medical scenario (e.g., "returns severe shock for SI > 1.7")

Before generating:
1. Read the target module to understand its exports, types, and validation ranges
2. Ensure `vitest` is in devDependencies — if not, run `pnpm add -D vitest`
3. Ensure `vitest.config.ts` exists at the project root — if not, create a minimal one:
   ```ts
   import { defineConfig } from 'vitest/config';
   export default defineConfig({ test: { include: ['src/__tests__/**/*.test.ts'] } });
   ```
4. Ensure a `"test": "vitest run"` script exists in package.json

After generating, run the tests with `pnpm test` to verify they pass.

Target module: $ARGUMENTS
