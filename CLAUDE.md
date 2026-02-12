# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
pnpm dev             # Start local development server at localhost:4321
pnpm build           # Build production site to ./dist/
pnpm preview         # Preview production build locally

# Astro CLI
pnpm astro           # Run Astro CLI commands
```

## Architecture Overview

This is an **EMT Calculator Tools** Progressive Web App built with **Astro 5** and **Svelte 5**, designed for Emergency Medical Technicians. The application provides medical calculators and reference materials optimized for field use.

### Tech Stack
- **Astro 5**: Static site generator with TypeScript support
- **Svelte 5**: UI components using the new runes syntax (`$state`, `$derived`, `$effect`)
- **Tailwind CSS 4**: Styling with Vite plugin integration
- **TypeScript**: Strict mode with comprehensive medical type definitions
- **PWA**: Service worker with offline caching strategies

### Data Architecture

**Centralized Tool Registry (`src/data/tools.ts`):**
- `CALCULATORS` and `REFERENCES` arrays define all available tools
- Each tool has `featured`, `status`, and `level` flags for filtering
- Home page dynamically shows `featured: true` tools
- Search functionality uses this single source of truth

**Medical Types (`src/types/medical.ts`):**
- Comprehensive TypeScript interfaces for all medical calculations
- EMT certification levels: `EMT-B`, `EMT-A`, `AEMT`, `Paramedic`, `All`
- Tool statuses: `active`, `coming-soon`, `planned`
- Specific calculator types: O2, APGAR, GCS, Vital Signs, i-gel

**Domain-Specific Data Files:**
- `src/data/vitalSigns.ts`: Age-based vital sign ranges from WikEM/clinical guidelines
- `src/data/apgar.ts`: APGAR scoring criteria and clinical interpretation logic

### Component Architecture

**Medical Calculator Pattern:**
Each calculator follows a consistent pattern:
1. **Svelte 5 Component**: Uses `$state` for inputs, `$derived` for calculations
2. **Data Module**: Contains clinical logic and reference data
3. **Type Definitions**: Medical interfaces in `types/medical.ts`
4. **Astro Page**: Wraps component with Layout and educational content

**Key Svelte 5 Patterns:**
- Use `$state<Type>()` for reactive variables
- Use `$derived.by(() => {...})` for complex derived calculations
- Use `onclick={function}` event syntax (NOT `on:click`)
- Components are client-loaded: `<Component client:load />`
- **MCP Integration**: Use `mcp__svelte-docs__svelte-autofixer` tool to validate Svelte components
- **MCP Integration**: Use `mcp__astro-docs__search_astro_docs` tool for Astro framework guidance

### PWA Features

**Service Worker (`public/sw.ts`):**
- TypeScript service worker with proper type definitions
- Caches essential files and calculator pages for offline use
- Runtime caching for dynamic content
- Version-based cache invalidation

**Offline Strategy:**
- Essential calculators work completely offline
- Medical reference data cached locally
- Update notifications for new versions

### Medical Safety Considerations

**CRITICAL SAFETY PRINCIPLES:**
- **Safety First**: All code changes must maintain or improve medical safety
- **Validation Required**: Every medical calculation must have input validation with physiological limits
- **Double-Check Critical Values**: Life-threatening readings require confirmation prompts
- **Error Handling**: Medical calculations must never crash - implement proper error boundaries
- **Citation Accuracy**: All medical formulas must cite current, peer-reviewed sources

**Clinical Accuracy Standards:**
- All calculations based on established medical guidelines with proper citations
- Include manufacturer specifications (i-gel sizing, tank factors, medical device data)
- Physiological limits validation (HR: 40-220 bpm, BP: 40-300 mmHg, O2 flow: 0-25 L/min)
- Warning systems for concerning values with color-coded urgency (normal/caution/critical)
- Professional medical disclaimers on all clinical tools

**User Experience for Field Use:**
- **Emergency Mode**: Larger touch targets (60px) for gloved hands and stress conditions
- **Visual Hierarchy**: Color-coded results by medical urgency level
- **Clear Feedback**: Immediate visual/audio feedback for normal/abnormal ranges
- **Age-Appropriate**: Separate pediatric vs adult calculation pathways
- **Safety Reserves**: Conservative calculations with safety margins (O2 duration, drug dosing)
- **Quick Access**: Critical calculators accessible within 2 taps from home screen

### File Organization

```
src/
├── components/          # Svelte 5 components
├── data/               # Medical data and tool registry
├── layouts/            # Astro layout components
├── pages/              # Astro pages (file-based routing)
├── types/              # TypeScript definitions
└── styles/             # Global CSS
```

### Adding New Tools

1. **Define in Registry**: Add to `CALCULATORS` or `REFERENCES` in `src/data/tools.ts`
2. **Create Types**: Add interfaces to `src/types/medical.ts`
3. **Build Component**: Create Svelte 5 component following medical calculator pattern
4. **Add Page**: Create Astro page that wraps component
5. **Set Featured**: Tools marked `featured: true` appear on home page automatically

### TypeScript Configuration

Strict TypeScript configuration enabled:
- `exactOptionalPropertyTypes`: Prevents `| undefined` confusion in medical calculations
- `noUncheckedIndexedAccess`: Ensures safe array access for medical data
- Medical type safety is critical for patient care applications

## Git Workflow and Version Management

### Repository Setup
```bash
# Initialize repository (if needed)
git init
git remote add origin https://github.com/ATCUSA/emt-calculators.git

# Create GitHub repository
gh repo create ATCUSA/emt-calculators --public --description "Essential calculators and reference tools for Emergency Medical Technicians, Advanced EMTs, and Paramedics"
```

### Branching Strategy

**Main Branch Protection:**
- `main` branch contains production-ready code
- All changes must go through feature branches and pull requests
- Never commit directly to `main` in production

**Feature Branch Workflow:**
```bash
# Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/calculator-name

# Work on feature with descriptive commits
git add .
git commit -m "feat: add APGAR score calculator with clinical guidance"

# Push feature branch
git push -u origin feature/calculator-name

# Create pull request
gh pr create --title "Add APGAR Score Calculator" --body "Implements APGAR scoring with 0-2 scale and clinical interpretation"
```

### Commit Message Conventions

Follow conventional commits for automated versioning:

**Format:** `type(scope): description`

**Types:**
- `feat`: New medical calculator or reference tool
- `fix`: Bug fix in calculation logic or UI
- `docs`: Documentation updates (medical citations, user guides)
- `style`: Code style changes (no logic changes)
- `refactor`: Code refactoring without feature changes
- `test`: Adding or updating tests
- `chore`: Build process, dependency updates

**Examples:**
```bash
# New features
git commit -m "feat(calculator): add Glasgow Coma Scale with pediatric scoring"
git commit -m "feat(reference): add pediatric vital signs ranges"

# Bug fixes
git commit -m "fix(o2-calc): correct tank factor calculation for E cylinders"
git commit -m "fix(mobile): resolve hamburger menu click handler"

# Documentation
git commit -m "docs(medical): add UF citation for O2 tank calculations"
git commit -m "docs(readme): update installation instructions"
```

**Important:** Never mention Claude, AI assistants, or automated tools in commit messages. Keep all commit messages professional and focused on the actual changes made.

### Semantic Versioning

**Version Format:** `MAJOR.MINOR.PATCH`

**Version Bump Rules:**
- **MAJOR** (1.0.0 → 2.0.0): Breaking changes to calculator logic or API
- **MINOR** (1.0.0 → 1.1.0): New calculators, reference tools, or significant features
- **PATCH** (1.0.0 → 1.0.1): Bug fixes, UI improvements, documentation updates

**Version Management:**

**CRITICAL: All PWA version references must be updated together for proper update notifications!**

**Required Files for Version Updates:**
1. `package.json` - NPM version for dependency management
2. `src/config/version.ts` - App version, changelog, and feature list
3. `public/manifest.json` - PWA version for app store behavior
4. `public/sw.ts` - Service worker cache version (triggers cache invalidation)

**Version Update Workflow:**
```bash
# 1. Determine version type (patch/minor/major)
# 2. Update ALL version files consistently
# 3. Commit and tag release

git checkout main
git pull origin main

# Update versions (example for 1.1.0)
# package.json: "version": "1.1.0"
# src/config/version.ts: version: '1.1.0'
# public/manifest.json: "version": "1.1.0"
# public/sw.ts: APP_VERSION: string = '1.1.0'

git add package.json src/config/version.ts public/manifest.json public/sw.ts
git commit -m "chore: bump version to 1.1.0"
git tag v1.1.0
git push origin main --tags
```

**PWA Update Mechanism Requirements:**

**Service Worker Version Management:**
- `public/sw.ts` APP_VERSION must match other files exactly
- Cache names include version: `emt-calc-v${APP_VERSION}`
- Version change triggers automatic cache invalidation
- Old caches are automatically deleted on activation

**Update Notification System:**
- `src/components/UpdateNotification.svelte` detects SW updates
- Compares `src/config/version.ts` version with SW version
- Shows update prompt when versions mismatch
- User can refresh to get new version immediately

**Version Consistency Validation:**
```typescript
// Add this check to prevent version mismatches
export function validateVersionConsistency(): boolean {
  const appVersion = APP_CONFIG.version;
  const swVersion = navigator.serviceWorker?.controller?.scriptURL.includes(appVersion);
  const manifestVersion = /* check manifest version */;

  if (!swVersion || !manifestVersion) {
    console.warn('Version mismatch detected - update required');
    return false;
  }
  return true;
}
```

**Critical Version Update Checklist:**
- [ ] `package.json` version updated
- [ ] `src/config/version.ts` version and changelog updated
- [ ] `public/manifest.json` version updated
- [ ] `public/sw.ts` APP_VERSION updated
- [ ] Cache name patterns include new version
- [ ] Test update notification appears correctly
- [ ] Verify old caches are cleared
- [ ] Confirm offline functionality works with new version

**Automated Version Consistency Checking:**

Create a script to validate version consistency across all files:
```typescript
// scripts/check-versions.ts
import { readFileSync } from 'fs';
import { APP_CONFIG } from '../src/config/version.js';

function checkVersionConsistency(): void {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  const manifestJson = JSON.parse(readFileSync('public/manifest.json', 'utf8'));
  const swContent = readFileSync('public/sw.ts', 'utf8');

  const appVersion = APP_CONFIG.version;
  const packageVersion = packageJson.version;
  const manifestVersion = manifestJson.version;
  const swVersionMatch = swContent.match(/APP_VERSION:\s*string\s*=\s*['"`]([^'"`]+)['"`]/);
  const swVersion = swVersionMatch?.[1];

  console.log('🔍 Version Consistency Check:');
  console.log(`📦 package.json: ${packageVersion}`);
  console.log(`⚙️  src/config/version.ts: ${appVersion}`);
  console.log(`📱 public/manifest.json: ${manifestVersion}`);
  console.log(`🔧 public/sw.ts: ${swVersion}`);

  const allVersionsMatch = appVersion === packageVersion &&
                          packageVersion === manifestVersion &&
                          manifestVersion === swVersion;

  if (allVersionsMatch) {
    console.log('✅ All versions are consistent');
    process.exit(0);
  } else {
    console.error('❌ Version mismatch detected!');
    console.error('All version files must be updated together for PWA updates to work correctly');
    process.exit(1);
  }
}

checkVersionConsistency();
```

Add to `package.json` scripts:
```json
{
  "scripts": {
    "check-versions": "tsx scripts/check-versions.ts",
    "version-check": "npm run check-versions"
  }
}
```

**Pre-deployment Version Validation:**
Add to GitHub Actions CI pipeline to prevent deployment with version mismatches:
```yaml
- name: Validate version consistency
  run: pnpm run check-versions
```

**Version Update Automation Script:**
```bash
#!/bin/bash
# scripts/update-version.sh
NEW_VERSION=$1

if [ -z "$NEW_VERSION" ]; then
  echo "Usage: ./scripts/update-version.sh 1.2.0"
  exit 1
fi

echo "🔄 Updating version to $NEW_VERSION..."

# Update package.json
npm version $NEW_VERSION --no-git-tag-version

# Update src/config/version.ts
sed -i "s/version: '[^']*'/version: '$NEW_VERSION'/g" src/config/version.ts

# Update public/manifest.json
sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"$NEW_VERSION\"/g" public/manifest.json

# Update public/sw.ts
sed -i "s/APP_VERSION: string = '[^']*'/APP_VERSION: string = '$NEW_VERSION'/g" public/sw.ts

echo "✅ All version files updated to $NEW_VERSION"
echo "📝 Don't forget to update the changelog in src/config/version.ts"
echo "🏷️  Ready to commit and tag: git add . && git commit -m \"chore: bump version to $NEW_VERSION\""
```

### Release Process

**For Medical Safety:**
1. **Test Calculations**: Verify all medical calculations with known test cases
2. **Review Citations**: Ensure all medical sources are properly cited
3. **Offline Testing**: Test PWA functionality without network connection
4. **Mobile Testing**: Verify responsive design on various devices
5. **Accessibility**: Check keyboard navigation and screen reader compatibility

**Release Steps:**
```bash
# 1. Create release branch
git checkout -b release/v1.1.0

# 2. Update changelog in src/config/version.ts
# 3. Run build and test
pnpm build
pnpm preview

# 4. Create release commit
git add .
git commit -m "chore: prepare release v1.1.0"

# 5. Merge to main and tag
git checkout main
git merge release/v1.1.0
git tag v1.1.0
git push origin main --tags

# 6. Deploy to production
# (Cloudflare Pages will auto-deploy from main branch)
```

### Development Best Practices

**Before Committing:**
1. Run type check: `pnpm astro check`
2. Test calculations manually with known medical scenarios
3. Verify PWA functionality works offline
4. Check mobile responsiveness

**Medical Code Review Checklist:**
- [ ] Calculations match established medical guidelines
- [ ] Proper medical citations included
- [ ] Warning systems for concerning values
- [ ] Age-appropriate calculations (pediatric vs adult)
- [ ] Safety reserves for critical calculations
- [ ] Clear visual feedback for normal/abnormal ranges

**Emergency Hotfixes:**
```bash
# For critical medical calculation errors
git checkout main
git checkout -b hotfix/critical-calculation-fix
# Fix the issue
git commit -m "fix(critical): correct O2 tank duration formula"
git checkout main
git merge hotfix/critical-calculation-fix
git tag v1.0.1
git push origin main --tags
```

## Code Quality Standards and Best Practices

### **Development Priorities (Always Follow This Order)**
1. **Medical Safety First** - All changes must maintain or improve medical accuracy and safety
2. **Security** - Input validation, sanitization, and secure coding practices
3. **Quality & Testing** - Code review, automated testing, error handling
4. **Performance** - Fast, reliable operation for emergency situations
5. **New Features** - Only add features after quality foundation is solid

### **Code Review Requirements**

**Pre-Development Checklist:**
- [ ] Review `QUALITY_TASKS.md` for current priorities
- [ ] Understand medical context and safety implications
- [ ] Check `FUTURE_FEATURES.md` for planned approach
- [ ] Ensure change aligns with EMT field use requirements

**Code Quality Standards:**
- **TypeScript Strict Mode**: All new code must use strict TypeScript with explicit types
- **Svelte 5 Best Practices**: Use new runes syntax (`$state`, `$derived`, `$effect`)
- **Medical Input Validation**: Every medical input must have physiological bounds checking
- **Error Boundaries**: All calculations must be wrapped in error handling
- **Consistent Patterns**: Follow established component patterns and naming conventions

**Medical Code Review Checklist:**
- [ ] **Calculation Accuracy**: Formula matches medical literature citations
- [ ] **Input Validation**: Physiological limits enforced (see limits in CLAUDE.md)
- [ ] **Critical Value Handling**: Life-threatening values trigger confirmation prompts
- [ ] **Age Appropriateness**: Pediatric vs adult calculations properly separated
- [ ] **Units Consistency**: Clear unit labels and proper conversion handling
- [ ] **Error Handling**: Graceful fallbacks for invalid inputs or calculation errors
- [ ] **Citations**: Proper medical references included for all clinical decisions

### **Security and Safety Standards**

**Input Validation Requirements:**
```typescript
// Required pattern for all medical inputs
interface MedicalInputValidation {
  min: number;           // Physiological minimum
  max: number;           // Physiological maximum
  type: 'integer' | 'decimal';
  required: boolean;
  fieldName: string;     // For error messages
  clinicalContext?: string; // When validation fails
}

// Example: Heart rate validation
const HR_VALIDATION: MedicalInputValidation = {
  min: 40,               // Severe bradycardia threshold
  max: 220,              // Maximum theoretical heart rate
  type: 'integer',
  required: true,
  fieldName: 'Heart Rate',
  clinicalContext: 'Values outside 40-220 bpm may indicate measurement error'
};
```

**Critical Value Thresholds:**
- **Heart Rate**: <40 or >150 bpm requires confirmation
- **Blood Pressure**: Systolic <70 or >200 mmHg requires confirmation
- **Oxygen Saturation**: <88% requires confirmation
- **O2 Tank Duration**: <30 minutes requires confirmation
- **Temperature**: <94°F or >106°F requires confirmation

**Error Handling Pattern:**
```typescript
// Required pattern for all medical calculations
const calculation = $derived.by(() => {
  try {
    if (!isValidInput(input)) {
      return { error: 'Invalid input', result: null };
    }
    const result = performMedicalCalculation(input);
    return { error: null, result };
  } catch (error) {
    console.error('Calculation error:', error);
    return {
      error: 'Calculation failed. Please verify inputs and try again.',
      result: null
    };
  }
});
```

### **Performance and Accessibility Standards**

**Performance Requirements:**
- **Initial Load**: Critical calculators must load within 2 seconds
- **Calculation Speed**: All calculations must complete within 500ms
- **Offline Support**: Essential tools must work completely offline
- **Bundle Size**: Critical path must be <100KB compressed
- **Memory Usage**: No memory leaks in long-running sessions

**Accessibility Requirements (WCAG 2.1 AA):**
- **Keyboard Navigation**: All functionality accessible via keyboard only
- **Touch Targets**: Minimum 44px (60px in emergency mode)
- **Color Contrast**: Minimum 4.5:1 ratio for normal text, 3:1 for large text
- **Screen Readers**: Proper ARIA labels and live regions for dynamic content
- **Focus Management**: Clear focus indicators and logical tab order

### **Testing Requirements**

**Required Tests Before Deployment:**
```typescript
// Unit tests for all medical calculations
describe('Medical Calculator Tests', () => {
  test('handles normal values correctly', () => { });
  test('validates input boundaries', () => { });
  test('handles edge cases gracefully', () => { });
  test('returns appropriate error messages', () => { });
  test('matches known medical reference values', () => { });
});

// Integration tests for user workflows
describe('User Workflow Tests', () => {
  test('complete O2 calculation workflow', () => { });
  test('handles offline functionality', () => { });
  test('emergency mode accessibility', () => { });
});
```

**Medical Validation Process:**
1. **Formula Verification**: Cross-reference with medical literature
2. **Test Case Validation**: Verify against known clinical scenarios
3. **Edge Case Testing**: Test boundary conditions and error states
4. **Clinical Review**: Medical professional validation of calculations
5. **Field Testing**: Real-world usability testing with EMT professionals

### **Documentation Standards**

**Code Documentation Requirements:**
- **Medical Formulas**: Include citation and explanation for all medical calculations
- **Component Purpose**: Clear description of medical use case
- **Input Parameters**: Document expected ranges and units
- **Error Conditions**: Document all possible error states and handling
- **Accessibility**: Document keyboard shortcuts and screen reader behavior

**File Header Template:**
```typescript
/**
 * @fileoverview [Medical Calculator Name] - [Brief description of clinical use]
 * @description [Detailed explanation of medical application and formulas used]
 * @citations [Medical literature references with DOI/URL]
 * @safety [Critical safety considerations and validation requirements]
 * @accessibility [Keyboard shortcuts and screen reader features]
 */
```

### **Deployment and Monitoring**

**Pre-Deployment Checklist:**
- [ ] All QUALITY_TASKS.md items for current phase completed
- [ ] Medical calculations validated against test cases
- [ ] Security scan passes with zero critical/high vulnerabilities
- [ ] Performance benchmarks meet requirements
- [ ] Accessibility testing passes WCAG 2.1 AA
- [ ] Offline functionality tested and working
- [ ] Mobile responsiveness verified on target devices

**Post-Deployment Monitoring:**
- Monitor Core Web Vitals for performance regressions
- Track PWA installation rates and usage patterns
- Monitor error rates and user-reported calculation issues
- Review medical accuracy feedback from EMT professionals
- Track accessibility compliance and user feedback

### **Emergency Response Procedures**

**Critical Bug Response (Medical Safety Issues):**
1. **Immediate**: Take affected calculator offline if possible
2. **Assess**: Determine scope and medical safety implications
3. **Fix**: Create hotfix branch with minimal, targeted changes
4. **Review**: Expedited medical and code review process
5. **Deploy**: Emergency deployment with monitoring
6. **Document**: Post-incident review and prevention measures

**Communication Protocol:**
- **Critical Issues**: Immediate notification to all stakeholders
- **Security Issues**: Follow responsible disclosure and patch procedures
- **Feature Requests**: Route through FUTURE_FEATURES.md planning process
- **Bug Reports**: Triage based on medical safety impact level