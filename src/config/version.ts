// Application version configuration
import type { AppVersion, VersionChange } from '../types/medical.js';

// Version change entries
const VERSION_CHANGES: VersionChange[] = [
  {
    version: '1.3.0',
    date: '2026-02-17',
    type: 'minor',
    changes: [
      'Parkland Burn Formula Calculator with Rule of Nines reference',
      'Pediatric Weight Estimation with APLS formulas and Broselow zones',
      'Shock Index Calculator with severity classification',
      'Shared input validation with physiological limits',
      'Emergency mode for larger touch targets in field use',
      'Critical value confirmation dialogs for dangerous vital signs',
      'Safety retrofit across all existing calculators',
      'Vitest testing infrastructure and gen-test skill',
    ]
  },
  {
    version: '1.2.0',
    date: '2026-02-12',
    type: 'minor',
    changes: [
      'Stroke Assessment Calculator with FAST, BEFAST, Cincinnati, and NIHSS scales',
      'Dark mode improvements across components',
      'Touch target sizing for emergency field use',
      'Accessibility improvements with ARIA labels'
    ]
  },
  {
    version: '1.1.0',
    date: '2026-02-11',
    type: 'minor',
    changes: [
      'APGAR Score Calculator for delivery calls',
      'Vital Signs Assessment with age-based ranges',
      'Searchable calculator database',
      'Dark/Light theme support with auto detection'
    ]
  },
  {
    version: '1.0.0',
    date: '2026-02-11',
    type: 'major',
    changes: [
      'Initial release of EMT Calculator Tools',
      'O₂ Tank Duration Calculator with safety reserves',
      'Glasgow Coma Scale Calculator',
      'i-gel Size Calculator with medical guidelines',
      'Vital Signs Reference tables',
      'Progressive Web App with offline support',
      'Mobile-responsive design with hamburger navigation',
      'Medical citations and safety disclaimers'
    ]
  }
];

export const APP_CONFIG: AppVersion = {
  version: '1.3.0',
  buildDate: new Date().toISOString(),
  features: [
    'O2 Tank Duration Calculator',
    'i-gel Size Calculator with manufacturer colors',
    'Glasgow Coma Scale Calculator',
    'Parkland Burn Formula Calculator',
    'Pediatric Weight Estimation',
    'Shock Index Calculator',
    'IV Drip Rate Calculator',
    'IV Catheter Quick Reference',
    'CPAP Quick Reference',
    'Stroke Assessment with multiple validated scales',
    'Emergency Mode for field use',
    'Critical Value Confirmation',
    'Dark/Light Theme Support',
    'PWA Offline Functionality',
    'Medical Disclaimer System',
    'Auto-Update Notifications',
    'Medical Citations System',
    'Searchable Calculator Database',
  ],
  changelog: VERSION_CHANGES
} satisfies AppVersion;

export const { version: APP_VERSION } = APP_CONFIG;