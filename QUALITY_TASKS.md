# EMT Calculator Tools - Quality Improvement Tasks

## 🎯 **IMMEDIATE PRIORITY TASKS** (Critical Issues)

### **🚨 Medical Safety Issues** (Fix Immediately)
- [ ] **Fix APGAR State Management Inconsistency**
  - Current: Mixed nullable/non-nullable patterns causing potential undefined errors
  - Location: `src/components/APGARCalculator.svelte` lines 12-17
  - Fix: Standardize to consistent nullable state pattern with proper initial values
  - Risk: Component crashes when accessing undefined state values

- [ ] **Add Input Validation with Physiological Limits**
  - Current: No bounds checking on medical inputs (dangerous)
  - Locations: All calculator components lack input validation
  - Add: Min/max validation for heart rates (40-220), blood pressure (40-300), O2 flow (0-25 L/min)
  - Risk: Users could enter impossible/dangerous values leading to incorrect calculations

- [ ] **Implement Critical Value Double-Check Prompts**
  - Current: No confirmation for life-threatening readings
  - Add: Confirmation dialogs for critical values (BP <70, HR <40 or >150, O2 duration <30 min)
  - Location: Add to all calculator result displays
  - Risk: Medical professionals may not double-check dangerous readings

- [ ] **Enhanced Error Boundary Implementation**
  - Current: No error boundaries around calculations
  - Add: Try-catch blocks with medical-appropriate error messages
  - Location: All `$derived.by()` calculation functions
  - Risk: Calculation errors crash entire calculator component

### **🐛 Code Quality Issues** (Fix Before New Features)
- [ ] **Standardize Event Handler Syntax**
  - Current: Mixed `on:click` and `onclick` usage throughout codebase
  - Location: Multiple components still using deprecated Svelte 4 syntax
  - Fix: Convert all to Svelte 5 `onclick` syntax for consistency
  - Impact: Prevents future compatibility issues

- [ ] **Remove Unused Imports and Dead Code**
  - Current: Several components import unused libraries
  - Tools needed: ESLint with `unused-vars` rule enabled
  - Action: Audit and remove all unused dependencies
  - Benefit: Reduced bundle size and cleaner codebase

- [ ] **Improve Type Safety in State Management**
  - Current: Some state variables lack proper TypeScript typing
  - Location: Several `$state()` declarations without explicit types
  - Fix: Add explicit types to all reactive state
  - Example: `let value = $state<number | null>(null)` instead of `let value = $state(null)`

## 🔐 **SECURITY IMPROVEMENTS** (High Priority)

### **Input Sanitization and Validation**
- [ ] **Implement Comprehensive Input Sanitization**
  - Current: Basic HTML input validation only
  - Add: Server-side style validation for all numeric inputs
  - Location: Create `src/utils/validation.ts` with medical input validators
  - Include: Range checking, type validation, SQL injection prevention

```typescript
// Example implementation needed:
export function validateMedicalNumber(
  value: string,
  min: number,
  max: number,
  fieldName: string
): ValidationResult {
  const num = parseFloat(value);
  if (isNaN(num)) return { valid: false, message: `${fieldName} must be a number` };
  if (num < min || num > max) return { valid: false, message: `${fieldName} must be between ${min} and ${max}` };
  return { valid: true };
}
```

- [ ] **Enhanced Content Security Policy (CSP)**
  - Current: Basic CSP in `_headers` file
  - Improve: Add stricter CSP with nonce-based inline scripts
  - Location: Update `public/_headers`
  - Add: `script-src 'self' 'nonce-{random}'; object-src 'none'; base-uri 'self';`

- [ ] **Dependency Vulnerability Scanning**
  - Current: No automated dependency checking
  - Add: GitHub Dependabot configuration
  - Location: Create `.github/dependabot.yml`
  - Include: Weekly npm audit, security updates, version pinning

### **Data Protection**
- [ ] **Local Storage Encryption for Sensitive Data**
  - Current: Calculation history stored in plain text localStorage
  - Add: AES encryption for calculation history if it contains patient data
  - Location: `src/utils/storage.ts` (new file needed)
  - Consideration: Key management for client-side encryption

- [ ] **Privacy Controls Implementation**
  - Add: User opt-out for any analytics or usage tracking
  - Location: Settings page with clear privacy controls
  - Include: Clear data deletion option, export user data capability

## 🎨 **UX/UI Quality Improvements**

### **Mobile and Field Use Optimization**
- [ ] **Emergency Mode Implementation**
  - Add: Toggle for larger touch targets (60px minimum instead of 44px)
  - Include: Higher contrast colors, larger fonts for stress/low-light conditions
  - Location: New component `src/components/EmergencyModeToggle.svelte`
  - Benefit: Better usability with gloved hands and in emergency situations

- [ ] **Improved Visual Hierarchy for Critical Information**
  - Current: All results have similar visual weight
  - Improve: Color-code results by urgency (normal=green, caution=yellow, critical=red)
  - Location: Update theme CSS with urgency classes
  - Add: Animation/pulsing for critical values

```css
/* Add to src/styles/global.css */
.result-normal { border-left: 4px solid #10b981; }
.result-caution { border-left: 4px solid #f59e0b; }
.result-critical {
  border-left: 4px solid #ef4444;
  animation: pulse-critical 2s infinite;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
}
```

- [ ] **Gesture Support for Common Operations**
  - Add: Swipe right to reset calculator
  - Add: Swipe left to toggle between units
  - Location: Add touch handlers to calculator wrapper components
  - Benefit: Faster operation in field conditions

### **Accessibility Improvements**
- [ ] **Complete Keyboard Navigation**
  - Current: Some calculators not fully keyboard accessible
  - Fix: Ensure all inputs and buttons have proper tab order
  - Test: Navigate entire app using only keyboard
  - Add: Focus indicators and skip-to-content links

- [ ] **Screen Reader Optimization**
  - Improve: Add more descriptive ARIA labels
  - Location: All form inputs and result displays
  - Add: Live regions for dynamic calculation results
  - Test: Verify with NVDA/JAWS screen readers

## 🏗️ **Code Architecture Improvements**

### **Component Structure Cleanup**
- [ ] **Create Shared Validation Component**
  - Current: Validation logic duplicated across calculators
  - Create: `src/components/shared/InputValidator.svelte`
  - Refactor: Move common validation to reusable component
  - Benefit: Consistent validation behavior, easier maintenance

- [ ] **Implement Proper Error Boundaries**
  - Current: Individual try-catch blocks in calculations
  - Create: `src/components/shared/ErrorBoundary.svelte`
  - Wrap: All calculator components with error boundary
  - Include: Graceful fallback UI and error reporting

```svelte
<!-- ErrorBoundary.svelte implementation needed -->
{#if error}
  <div class="error-boundary">
    <h3>⚠️ Calculation Error</h3>
    <p>Please check your inputs and try again</p>
    <button onclick={() => resetError()}>Reset Calculator</button>
  </div>
{:else}
  <slot />
{/if}
```

- [ ] **Standardize Calculator Component Pattern**
  - Current: Each calculator has different structure
  - Create: Base calculator class with consistent interface
  - Standardize: Input handling, validation, result display
  - Document: Component development guidelines in CLAUDE.md

### **Performance Optimization**
- [ ] **Bundle Size Analysis and Optimization**
  - Tool: Add webpack-bundle-analyzer or astro build analysis
  - Action: Identify large dependencies and optimize imports
  - Target: Reduce initial bundle size by 20%
  - Focus: Critical calculators should load first

- [ ] **Service Worker Cache Optimization**
  - Current: Caches all pages equally
  - Improve: Priority caching for critical calculators
  - Location: `public/sw.ts` cache strategies
  - Add: Stale-while-revalidate for non-critical content

## 🔄 **Version Management and PWA Updates**

### **PWA Version Consistency (Critical for Update Notifications)**
- [ ] **Implement Version Consistency Validation Script**
  - Current: No automated checking of version sync across PWA files
  - Create: `scripts/check-versions.ts` to validate all version files match
  - Risk: Version mismatches break PWA update notifications and cache invalidation

- [ ] **Add Automated Version Update Script**
  - Create: `scripts/update-version.sh` for consistent version bumping
  - Location: Update all 4 required files: `package.json`, `src/config/version.ts`, `public/manifest.json`, `public/sw.ts`
  - Benefit: Prevents human error in version management

- [ ] **Integrate Version Check into CI Pipeline**
  - Add: Version consistency validation to GitHub Actions
  - Location: Add to `quality-checks` job in `.github/workflows/ci.yml`
  - Prevent: Deployment with mismatched versions

```yaml
# Add to ci.yml quality-checks job
- name: Validate version consistency
  run: pnpm run check-versions
```

- [ ] **Add npm Scripts for Version Management**
  - Add to `package.json` scripts section:
  ```json
  {
    "scripts": {
      "check-versions": "tsx scripts/check-versions.ts",
      "version-check": "npm run check-versions",
      "update-version": "./scripts/update-version.sh"
    }
  }
  ```

### **PWA Update Notification Testing**
- [ ] **Verify Update Notification Component Works**
  - Current: `src/components/UpdateNotification.svelte` exists but needs testing
  - Test: Version change triggers update prompt correctly
  - Validate: User can refresh to get new version immediately

- [ ] **Service Worker Cache Invalidation Testing**
  - Test: Version change clears old caches properly
  - Validate: New version loads fresh content, not cached
  - Check: `emt-calc-v${APP_VERSION}` cache naming works correctly

## 📋 **Testing and Quality Assurance**

### **Automated Testing Setup**
- [ ] **Unit Tests for Medical Calculations**
  - Framework: Vitest with jsdom for Svelte components
  - Coverage: All calculation functions with known test cases
  - Location: Create `src/tests/calculations/` directory
  - Include: Edge cases, boundary conditions, error handling

```typescript
// Example test needed:
describe('O2 Tank Calculator', () => {
  test('calculates correct duration for standard E tank', () => {
    const result = calculateO2Duration(2000, 0.28, 15, 500);
    expect(result.usableDuration).toBe(26); // minutes
  });

  test('handles zero flow rate gracefully', () => {
    expect(() => calculateO2Duration(2000, 0.28, 0, 500)).not.toThrow();
  });
});
```

- [ ] **End-to-End Testing for Critical Paths**
  - Framework: Playwright for full user flows
  - Coverage: Calculator usage, PWA installation, offline functionality
  - Location: Create `e2e/` directory
  - Scenarios: Complete O2 calculation, APGAR scoring, vital signs assessment

### **Medical Validation Process**
- [ ] **Create Medical Review Checklist**
  - Document: Medical accuracy validation checklist
  - Location: `MEDICAL_REVIEW.md`
  - Include: Formula verification, citation checking, clinical correlation
  - Process: Required sign-off before production deployment

- [ ] **Test Data with Known Medical Cases**
  - Create: Test dataset with verified medical scenarios
  - Location: `src/tests/medical-cases/`
  - Include: Normal values, edge cases, emergency situations
  - Validate: All calculators against established medical references

## 🚀 **CI/CD and Development Process**

### **GitHub Actions Status**
**CURRENT STATE**: Basic CI working, advanced features disabled until dependencies are added

**Working Now:**
- ✅ `.github/workflows/basic-ci.yml` - TypeScript checking, build verification, basic security audit
- ✅ `.github/dependabot.yml` - Simplified weekly dependency updates
- ✅ Basic PR status notifications

**Disabled Until Setup Complete:**
- 🔄 `.github/workflows/ci.yml.disabled` - Full CI/CD pipeline (needs ESLint, Prettier, testing framework)
- 🔄 `.github/workflows/security.yml.disabled` - Advanced security scanning (needs CodeQL, OWASP ZAP setup)
- 🔄 `.github/workflows/dependabot-automerge.yml.disabled` - Smart auto-merge (needs proper testing)

### **Required Dependencies for Full GitHub Actions**
- [ ] **Add ESLint Configuration**
  - Install: `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `eslint-plugin-svelte`
  - Create: `.eslintrc.js` configuration for TypeScript + Svelte
  - Add script: `"lint": "eslint . --ext .ts,.js,.svelte"`

- [ ] **Add Prettier Configuration**
  - Install: `prettier`, `prettier-plugin-svelte`
  - Create: `.prettierrc` configuration
  - Add script: `"format": "prettier --check ."`

- [ ] **Add Testing Framework**
  - Install: `vitest`, `@testing-library/svelte`, `jsdom`
  - Create: `vitest.config.ts` configuration
  - Add script: `"test": "vitest"`

- [ ] **Add End-to-End Testing**
  - Install: `@playwright/test`
  - Create: `playwright.config.ts` configuration
  - Add script: `"test:e2e": "playwright test"`

- [ ] **Add Security Tools**
  - Setup: GitHub CodeQL (enable in repository security settings)
  - Configure: OWASP ZAP rules for medical applications
  - Install: `lighthouse` for performance auditing

### **GitHub Actions Restoration Plan**
1. **Phase 1**: Add basic dev dependencies (ESLint, Prettier)
2. **Phase 2**: Enable full CI workflow with linting/formatting
3. **Phase 3**: Add testing framework and medical calculation tests
4. **Phase 4**: Enable security scanning workflows
5. **Phase 5**: Enable smart Dependabot auto-merge

## 📊 **Completion Tracking**

### **Week 1 Priorities** (Complete Before New Features)
1. [ ] Fix APGAR state management bug
2. [ ] Add physiological input validation
3. [ ] Implement critical value confirmations
4. [ ] **Setup PWA version consistency system**
5. [ ] Standardize Svelte 5 event handlers
6. [ ] Add error boundaries to all calculators

### **Week 2 Priorities**
1. [ ] Enhanced CSP and security headers
2. [ ] Emergency mode interface implementation
3. [ ] Complete keyboard navigation
4. [ ] Input sanitization system
5. [ ] Bundle size optimization

### **Week 3-4 Priorities**
1. [ ] Automated testing setup
2. [ ] Medical validation process
3. [ ] Performance monitoring
4. [ ] CI/CD pipeline implementation
5. [ ] Documentation updates

---

## ⚠️ **CRITICAL SAFETY REMINDER**

**All items marked as "Medical Safety Issues" MUST be completed before any new feature development. These issues pose potential risks to medical decision-making and patient safety.**

---

## 📈 **Success Criteria**

- [ ] **Zero critical bugs** in medical calculations
- [ ] **100% input validation** on all medical inputs
- [ ] **Complete accessibility** compliance (WCAG 2.1 AA)
- [ ] **Sub-second load times** for critical calculators
- [ ] **Automated testing coverage** > 80% for calculation logic
- [ ] **Security scan passing** with zero high/critical vulnerabilities