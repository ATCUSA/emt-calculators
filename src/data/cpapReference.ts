// CPAP Quick Reference Data — EMS Prehospital
// Sources: NAEMSP, AHA 2020 Guidelines, ACEP, Pace & Fuller (2019), Goodacre et al.

import type { CPAPReference } from '../types/medical.js';

export const CPAP_DATA: CPAPReference = {
  indications: [
    {
      condition: 'Acute Pulmonary Edema / CHF',
      description: 'Acute respiratory distress from fluid overload. CPAP reduces preload, afterload, and improves oxygenation.',
      notes: 'Most common prehospital CPAP indication. Consider concurrent nitroglycerin per protocol.'
    },
    {
      condition: 'COPD Exacerbation',
      description: 'Acute worsening of chronic obstructive pulmonary disease with increased work of breathing.',
      notes: 'Start at lower pressures (5 cmH₂O). Monitor closely for CO₂ retention.'
    },
    {
      condition: 'Severe Asthma',
      description: 'Severe bronchospasm unresponsive to initial nebulizer therapy.',
      notes: 'Use as adjunct to bronchodilators. Can deliver nebulized meds inline with some CPAP devices.'
    },
    {
      condition: 'Pneumonia',
      description: 'Community-acquired pneumonia with significant hypoxia and respiratory distress.',
      notes: 'Supportive use. Does not treat underlying infection.'
    },
    {
      condition: 'Near-Drowning',
      description: 'Submersion injury with pulmonary edema and hypoxia after initial airway clearance.',
      notes: 'Ensure airway is clear of water/debris first. Monitor for vomiting.'
    },
    {
      condition: 'Post-Extubation Support',
      description: 'Respiratory support following field extubation or failed intubation attempt.',
      notes: 'Bridge therapy while preparing for definitive airway if needed.'
    }
  ],

  contraindications: [
    {
      condition: 'Apnea / Respiratory Arrest',
      type: 'absolute',
      description: 'Patient must have spontaneous respirations. CPAP does not ventilate — it only augments existing breathing.'
    },
    {
      condition: 'Inability to Protect Airway',
      type: 'absolute',
      description: 'Patient cannot maintain airway patency or clear secretions independently.'
    },
    {
      condition: 'Facial / Airway Trauma',
      type: 'absolute',
      description: 'Significant facial fractures, burns, or trauma preventing mask seal.'
    },
    {
      condition: 'Pneumothorax (Untreated)',
      type: 'absolute',
      description: 'Positive pressure will worsen pneumothorax. Decompress first if tension pneumothorax suspected.'
    },
    {
      condition: 'Active Vomiting',
      type: 'absolute',
      description: 'High aspiration risk. Suction airway and manage nausea before applying CPAP.'
    },
    {
      condition: 'Hypotension (SBP < 90 mmHg)',
      type: 'relative',
      description: 'CPAP reduces venous return and may worsen hypotension. Treat BP first.'
    },
    {
      condition: 'Altered Mental Status (GCS < 10)',
      type: 'relative',
      description: 'Patient may not tolerate mask or protect airway. Close monitoring required.'
    },
    {
      condition: 'Nausea',
      type: 'relative',
      description: 'Risk of vomiting into mask. Have suction ready and monitor closely.'
    },
    {
      condition: 'Tracheostomy',
      type: 'relative',
      description: 'Standard CPAP mask may not be applicable. Requires specialized adapter.'
    },
    {
      condition: 'Patient Non-Compliance',
      type: 'relative',
      description: 'Patient refusing or unable to tolerate mask. Coach patient; do not force.'
    }
  ],

  settings: [
    {
      condition: 'Acute Pulmonary Edema / CHF',
      pressureRange: '7.5–10 cmH₂O',
      o2Flow: '10–15 LPM',
      fio2: '~100%',
      notes: 'Start at 10 cmH₂O. Higher pressures well-tolerated in CHF.'
    },
    {
      condition: 'COPD Exacerbation',
      pressureRange: '5–7.5 cmH₂O',
      o2Flow: '10–15 LPM',
      fio2: '~100%',
      notes: 'Start low (5 cmH₂O). Titrate up cautiously. Watch for hypercapnia.'
    },
    {
      condition: 'Severe Asthma',
      pressureRange: '5–7.5 cmH₂O',
      o2Flow: '10–15 LPM',
      fio2: '~100%',
      notes: 'Lower pressure for comfort. Can deliver inline nebulized meds on some devices.'
    },
    {
      condition: 'Pneumonia / General Hypoxia',
      pressureRange: '5–10 cmH₂O',
      o2Flow: '10–15 LPM',
      fio2: '~100%',
      notes: 'Titrate to maintain SpO₂ > 94%.'
    },
    {
      condition: 'Near-Drowning',
      pressureRange: '7.5–10 cmH₂O',
      o2Flow: '15 LPM',
      fio2: '~100%',
      notes: 'Higher pressures to recruit collapsed alveoli. Monitor for vomiting.'
    },
    {
      condition: 'Pediatric (General)',
      pressureRange: '5–8 cmH₂O',
      o2Flow: '10–15 LPM',
      fio2: '~100%',
      notes: 'Use appropriately sized pediatric mask. Typically ages 8+ with cooperative patient.'
    }
  ],

  monitoring: [
    {
      parameter: 'SpO₂',
      target: '≥ 94% (≥ 88–92% for COPD)',
      frequency: 'Continuous',
      actionIfAbnormal: 'Increase O₂ flow. Reassess mask seal. Consider escalation to BVM or intubation.'
    },
    {
      parameter: 'Respiratory Rate',
      target: '12–20 breaths/min (adult)',
      frequency: 'Every 5 minutes',
      actionIfAbnormal: 'RR > 30: reassess CPAP pressure, consider escalation. RR < 10: discontinue CPAP, assist ventilations.'
    },
    {
      parameter: 'Work of Breathing',
      target: 'Decreased accessory muscle use, tripoding, retractions',
      frequency: 'Continuous',
      actionIfAbnormal: 'No improvement in 5–10 min: adjust pressure, reassess diagnosis, prepare for escalation.'
    },
    {
      parameter: 'Mental Status',
      target: 'Alert and oriented, following commands',
      frequency: 'Every 5 minutes',
      actionIfAbnormal: 'Deteriorating mental status: discontinue CPAP, manage airway, prepare for intubation.'
    },
    {
      parameter: 'Blood Pressure',
      target: 'SBP ≥ 90 mmHg',
      frequency: 'Every 5 minutes',
      actionIfAbnormal: 'SBP < 90: discontinue CPAP. Consider fluid bolus, vasopressor per protocol.'
    },
    {
      parameter: 'Heart Rate',
      target: 'Trending toward normal for age',
      frequency: 'Continuous (monitor)',
      actionIfAbnormal: 'New bradycardia or tachycardia: reassess patient, check for complications.'
    },
    {
      parameter: 'Mask Seal / Comfort',
      target: 'Minimal air leak, patient tolerating mask',
      frequency: 'Continuous',
      actionIfAbnormal: 'Reposition mask. Try different size. Coach patient on breathing through mouth.'
    }
  ],

  troubleshooting: [
    {
      problem: 'Air Leak Around Mask',
      causes: [
        'Incorrect mask size',
        'Poor strap tension',
        'Facial hair preventing seal',
        'Patient movement'
      ],
      solutions: [
        'Try different mask size (most common fix)',
        'Adjust head straps — snug but not tight',
        'Apply thin layer of water-soluble lubricant to mask edge',
        'Hold mask manually during transport if needed'
      ]
    },
    {
      problem: 'Patient Intolerance / Claustrophobia',
      causes: [
        'Anxiety about mask',
        'Feeling of suffocation',
        'Pressure too high initially',
        'Lack of coaching'
      ],
      solutions: [
        'Coach patient: "Breathe normally, the machine is helping you"',
        'Start at lower pressure and titrate up',
        'Let patient hold mask initially for sense of control',
        'Consider anxiolytic per protocol if severe'
      ]
    },
    {
      problem: 'Gastric Distention',
      causes: [
        'Air swallowing (aerophagia)',
        'Pressure too high',
        'Mouth breathing with poor seal'
      ],
      solutions: [
        'Reduce CPAP pressure if tolerated',
        'Position patient upright (45° minimum)',
        'Monitor for vomiting — have suction ready',
        'Consider nasogastric decompression if severe'
      ]
    },
    {
      problem: 'Skin Irritation / Pressure Injury',
      causes: [
        'Straps too tight',
        'Prolonged use',
        'Allergic reaction to mask material'
      ],
      solutions: [
        'Loosen straps slightly — small leak is acceptable vs. skin injury',
        'Pad bridge of nose with gauze',
        'Reassess need for continued CPAP'
      ]
    },
    {
      problem: 'O₂ Tank Depletion',
      causes: [
        'High flow rate (10–15 LPM)',
        'Long transport time',
        'Did not check tank level before use'
      ],
      solutions: [
        'Always check tank pressure before applying CPAP',
        'Have backup tank accessible',
        'Calculate expected duration (use O₂ Tank Calculator)',
        'Switch to NRB if tank runs low during transport'
      ]
    }
  ],

  discontinuation: [
    {
      criterion: 'Respiratory arrest or apnea',
      action: 'Remove CPAP immediately. Begin BVM ventilation. Prepare for intubation.',
      urgency: 'immediate'
    },
    {
      criterion: 'Cardiac arrest',
      action: 'Remove CPAP. Begin CPR and follow ACLS/BLS protocols.',
      urgency: 'immediate'
    },
    {
      criterion: 'Uncontrolled vomiting',
      action: 'Remove CPAP. Suction airway. Position patient laterally. Reassess.',
      urgency: 'immediate'
    },
    {
      criterion: 'Severe hypotension (SBP < 80 mmHg)',
      action: 'Remove CPAP. Position supine. Fluid resuscitation per protocol.',
      urgency: 'immediate'
    },
    {
      criterion: 'Deteriorating mental status (GCS dropping)',
      action: 'Remove CPAP. Assess airway. Prepare for definitive airway management.',
      urgency: 'urgent'
    },
    {
      criterion: 'No improvement after 10–15 minutes',
      action: 'Reassess diagnosis. Consider escalation to BVM-assisted ventilation or intubation.',
      urgency: 'urgent'
    },
    {
      criterion: 'Patient able to maintain SpO₂ > 94% on nasal cannula',
      action: 'Wean to nasal cannula or NRB. Continue monitoring.',
      urgency: 'routine'
    }
  ],

  pediatricConsiderations: [
    'CPAP is generally used in children ages 8+ who are cooperative and can maintain a mask seal.',
    'Use appropriately sized pediatric CPAP masks — adult masks will not seal properly.',
    'Start at lower pressures: 5 cmH₂O, titrate up to max 8 cmH₂O.',
    'Children are more prone to gastric distention from air swallowing — monitor closely.',
    'Neonatal/infant CPAP is a specialized hospital procedure — not typical prehospital application.',
    'Parental presence and coaching can significantly improve pediatric CPAP tolerance.',
    'Lower threshold for discontinuation in pediatric patients — escalate early if no improvement.',
    'Weight-based considerations: ensure device can deliver appropriate pressures for patient size.'
  ],

  citations: [
    'NAEMSP Position Statement: Prehospital Use of CPAP (2019)',
    'AHA/ACC 2022 Guidelines for Heart Failure Management',
    'Pace J, Fuller K. "Out-of-hospital continuous positive airway pressure for acute respiratory failure." Cochrane Database Syst Rev. 2019.',
    'Goodacre S et al. "Prehospital CPAP for acute cardiogenic pulmonary edema." JAMA. 2019.',
    'NHTSA National EMS Education Standards (2021)',
    'Weitz G et al. "Prehospital CPAP vs standard therapy in acute pulmonary edema." Am J Emerg Med. 2007;25(7):802-807.'
  ]
};

export const CPAP_SETUP_CHECKLIST: string[] = [
  'Confirm indication and rule out contraindications',
  'Assess and document baseline vitals (SpO₂, RR, HR, BP, mental status)',
  'Select appropriate mask size — test seal before connecting O₂',
  'Connect O₂ supply at 10–15 LPM',
  'Set initial CPAP pressure per condition (typically 5–10 cmH₂O)',
  'Apply mask to patient — coach on breathing technique',
  'Secure head straps — snug but comfortable',
  'Reassess vitals at 5 minutes, then every 5 minutes',
  'Document time of CPAP application and all reassessments',
  'Have suction and BVM immediately accessible'
];
