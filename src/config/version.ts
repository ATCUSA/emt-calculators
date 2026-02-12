// Application version configuration
import type { AppVersion, VersionChange } from '../types/medical.js';

// Version change entries
const VERSION_CHANGES: VersionChange[] = [
  {
    version: '1.0.0',
    date: '2026-02-11',
    type: 'major',
    changes: [
      'Initial release of EMT Calculator Tools',
      'O₂ Tank Duration Calculator with safety reserves',
      'Vital Signs Assessment with age-based ranges',
      'APGAR Score Calculator for delivery calls',
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
  version: '1.2.0',
  buildDate: new Date().toISOString(),
  features: [
    'O2 Tank Duration Calculator',
    'i-gel Size Calculator with manufacturer colors',
    'Glasgow Coma Scale Calculator',
    'Dark/Light Theme Support',
    'PWA Offline Functionality',
    'Medical Disclaimer System',
    'Auto-Update Notifications',
    'Medical Citations System',
    'Searchable Calculator Database'
  ],
  changelog: VERSION_CHANGES
} satisfies AppVersion;

export const { version: APP_VERSION } = APP_CONFIG;