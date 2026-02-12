// APGAR Score Data and Assessment Logic
// Based on Virginia Apgar's original criteria (1953) and ACOG guidelines

import type { APGARCategoryData, APGARScore, APGARResult, APGARInterpretation } from '../types/medical.js';

// APGAR Scoring Criteria - Official Clinical Standards
export const APGAR_CATEGORIES: Record<string, APGARCategoryData> = {
  appearance: {
    name: 'Appearance',
    fullName: 'Skin Color/Appearance',
    criteria: [
      {
        score: 0,
        description: 'Blue or pale all over',
        clinicalSign: 'Cyanotic/pallid throughout body'
      },
      {
        score: 1,
        description: 'Extremities blue; body pink',
        clinicalSign: 'Acrocyanosis (peripheral cyanosis only)'
      },
      {
        score: 2,
        description: 'Extremities and body pink',
        clinicalSign: 'Well-oxygenated, good color throughout'
      }
    ]
  },
  pulse: {
    name: 'Pulse',
    fullName: 'Heart Rate',
    criteria: [
      {
        score: 0,
        description: 'Absent',
        clinicalSign: 'No heartbeat detected'
      },
      {
        score: 1,
        description: '< 100 bpm',
        clinicalSign: 'Bradycardia, weak pulse'
      },
      {
        score: 2,
        description: '≥ 100 bpm',
        clinicalSign: 'Normal heart rate, strong pulse'
      }
    ]
  },
  grimace: {
    name: 'Grimace',
    fullName: 'Reflex Irritability/Response',
    criteria: [
      {
        score: 0,
        description: 'No reaction',
        clinicalSign: 'No response to stimulation'
      },
      {
        score: 1,
        description: 'Grimace',
        clinicalSign: 'Facial grimace or weak cry to stimulation'
      },
      {
        score: 2,
        description: 'Sneeze, cough, vigorous cry',
        clinicalSign: 'Active response, cough, sneeze, or vigorous cry'
      }
    ]
  },
  activity: {
    name: 'Activity',
    fullName: 'Muscle Tone/Activity',
    criteria: [
      {
        score: 0,
        description: 'None; limp',
        clinicalSign: 'Flaccid, no muscle tone'
      },
      {
        score: 1,
        description: 'Some flexion',
        clinicalSign: 'Minimal flexion of extremities'
      },
      {
        score: 2,
        description: 'Flexed arms and legs that resist extension',
        clinicalSign: 'Active movement, good muscle tone'
      }
    ]
  },
  respiration: {
    name: 'Respiration',
    fullName: 'Respiratory Effort',
    criteria: [
      {
        score: 0,
        description: 'Absent',
        clinicalSign: 'No respiratory effort'
      },
      {
        score: 1,
        description: 'Weak, irregular, gasping',
        clinicalSign: 'Slow, irregular, or gasping respirations'
      },
      {
        score: 2,
        description: 'Strong cry',
        clinicalSign: 'Good respiratory effort, strong cry'
      }
    ]
  }
} as const;

// Calculate APGAR score and provide clinical interpretation
export function calculateAPGAR(
  appearance: APGARScore,
  pulse: APGARScore,
  grimace: APGARScore,
  activity: APGARScore,
  respiration: APGARScore,
  timeOfAssessment: string = '1 minute'
): APGARResult {
  const totalScore = appearance + pulse + grimace + activity + respiration;

  let interpretation: APGARInterpretation;
  let clinicalGuidance: string[];
  let immediateActions: string[];

  // Score interpretation based on ACOG guidelines
  if (totalScore >= 7) {
    interpretation = 'normal';
    clinicalGuidance = [
      'Normal adaptation to extrauterine life',
      'Continue routine newborn care',
      'Monitor for normal transitions',
      'Reassess at standard intervals'
    ];
    immediateActions = [
      'Continue routine care',
      'Maintain warmth',
      'Support bonding'
    ];
  } else if (totalScore >= 3) {
    interpretation = 'moderate_depression';
    clinicalGuidance = [
      'Moderate neurologic/cardiorespiratory depression',
      'May require intervention and close monitoring',
      'Consider underlying causes',
      'Reassess frequently'
    ];
    immediateActions = [
      'Provide tactile stimulation',
      'Ensure airway patency',
      'Consider oxygen support',
      'Prepare for potential resuscitation'
    ];
  } else {
    interpretation = 'severe_depression';
    clinicalGuidance = [
      'Severe neurologic/cardiorespiratory depression',
      'Immediate resuscitation likely required',
      'Activate neonatal resuscitation protocol',
      'Consider advanced interventions'
    ];
    immediateActions = [
      'Begin immediate resuscitation',
      'Positive pressure ventilation if needed',
      'Chest compressions if HR <60 after ventilation',
      'Consider epinephrine and volume expansion',
      'Rapid transport with advanced care'
    ];
  }

  // Add specific guidance based on individual scores
  if (pulse === 0) {
    immediateActions.unshift('CRITICAL: No heartbeat - begin CPR immediately');
  } else if (pulse === 1) {
    immediateActions.push('Monitor heart rate closely, consider cardiac support');
  }

  if (respiration === 0) {
    immediateActions.unshift('CRITICAL: No breathing - begin ventilation immediately');
  } else if (respiration === 1) {
    immediateActions.push('Assist ventilation, consider bag-mask ventilation');
  }

  if (appearance === 0) {
    immediateActions.push('Address severe cyanosis - ensure oxygenation');
  }

  return {
    totalScore,
    interpretation,
    categoryScores: {
      appearance,
      pulse,
      grimace,
      activity,
      respiration
    },
    clinicalGuidance,
    immediateActions,
    timeOfAssessment
  };
}

// Get interpretation color for UI display
export function getAPGARColor(interpretation: APGARInterpretation): string {
  switch (interpretation) {
    case 'normal':
      return 'text-green-400 bg-green-900/20 border-green-700/50';
    case 'moderate_depression':
      return 'text-yellow-400 bg-yellow-900/20 border-yellow-700/50';
    case 'severe_depression':
      return 'text-red-400 bg-red-900/20 border-red-700/50';
    default:
      return 'text-gray-400 bg-gray-900/20 border-gray-700/50';
  }
}

// Get interpretation display text
export function getAPGARInterpretationText(interpretation: APGARInterpretation): string {
  switch (interpretation) {
    case 'normal':
      return 'Normal';
    case 'moderate_depression':
      return 'Moderate Depression';
    case 'severe_depression':
      return 'Severe Depression';
    default:
      return 'Unknown';
  }
}

// Clinical notes for APGAR assessment
export const APGAR_CLINICAL_NOTES = {
  timing: 'APGAR should be assessed at 1 and 5 minutes after birth. If 5-minute score is <7, continue assessments every 5 minutes up to 20 minutes.',
  limitations: 'APGAR score should not delay resuscitation efforts. Begin resuscitation based on initial assessment, not APGAR score.',
  documentation: 'Document each category score individually along with total score and time of assessment.',
  interpretation: 'APGAR reflects condition at specific time point. Low scores may not predict long-term outcomes.',
  resuscitation: 'Follow neonatal resuscitation algorithm (NRP) regardless of APGAR score if infant shows signs of distress.'
} as const;