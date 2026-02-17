// IV Catheter Quick Reference Data — EMS Prehospital
// Sources: Pedagogy Education, NYSORA, INS Standards of Practice

import type { IVCatheterReference } from '../types/medical.js';

export const IV_CATHETER_DATA: IVCatheterReference = {
  catheters: [
    {
      gauge: 14,
      color: 'Orange',
      outerDiameter: '2.1 mm',
      length: '4.5 cm (1.75")',
      flowRate: '~330 mL/min',
      flowRateValue: 330,
      uses: ['Major trauma resuscitation', 'Rapid volume replacement', 'Surgical settings']
    },
    {
      gauge: 16,
      color: 'Gray',
      outerDiameter: '1.7 mm',
      length: '4.5 cm (1.75")',
      flowRate: '~210 mL/min',
      flowRateValue: 210,
      uses: ['Trauma', 'Blood transfusion', 'Rapid fluid administration', 'Surgery']
    },
    {
      gauge: 18,
      color: 'Green',
      outerDiameter: '1.3 mm',
      length: '3.0 cm (1.25")',
      flowRate: '~105 mL/min',
      flowRateValue: 105,
      uses: ['Blood products', 'General medical patients', 'Moderate fluid resuscitation']
    },
    {
      gauge: 20,
      color: 'Pink',
      outerDiameter: '1.1 mm',
      length: '2.5 cm (1.0")',
      flowRate: '~60 mL/min',
      flowRateValue: 60,
      uses: ['Most IV infusions', 'Maintenance fluids', 'Medication administration']
    },
    {
      gauge: 22,
      color: 'Blue',
      outerDiameter: '0.9 mm',
      length: '2.5 cm (1.0")',
      flowRate: '~36 mL/min',
      flowRateValue: 36,
      uses: ['Pediatric patients', 'Elderly/fragile veins', 'Medication infusions']
    },
    {
      gauge: 24,
      color: 'Yellow',
      outerDiameter: '0.7 mm',
      length: '1.9 cm (0.75")',
      flowRate: '~22 mL/min',
      flowRateValue: 22,
      uses: ['Neonatal', 'Pediatric', 'Very small or fragile veins']
    },
    {
      gauge: 26,
      color: 'Violet',
      outerDiameter: '0.6 mm',
      length: '1.9 cm (0.75")',
      flowRate: '~13 mL/min',
      flowRateValue: 13,
      uses: ['Neonatal', 'Very fragile veins', 'Slow medication infusions only']
    }
  ],

  selectionGuidelines: [
    {
      scenario: 'Major Trauma / Hemorrhagic Shock',
      recommendedGauge: '14G–16G',
      rationale: 'Maximum flow rates needed for rapid volume replacement. Insert two large-bore IVs when possible.'
    },
    {
      scenario: 'Blood Transfusion',
      recommendedGauge: '18G or larger',
      rationale: 'Red blood cells can hemolyze through smaller catheters. 18G is minimum for blood products.'
    },
    {
      scenario: 'General Medical / Fluid Therapy',
      recommendedGauge: '18G–20G',
      rationale: 'Adequate flow for most IV fluid therapy and medication administration.'
    },
    {
      scenario: 'Medication Administration Only',
      recommendedGauge: '20G–22G',
      rationale: 'Sufficient for IV push medications and slow infusions. Smaller gauge = less patient discomfort.'
    },
    {
      scenario: 'Elderly / Fragile Veins',
      recommendedGauge: '20G–22G',
      rationale: 'Smaller catheter reduces vessel trauma in fragile veins. Use hand or forearm veins.'
    },
    {
      scenario: 'Pediatric Patients',
      recommendedGauge: '22G–24G',
      rationale: 'Smaller veins require smaller catheters. 22G for children, 24G for infants and neonates.'
    },
    {
      scenario: 'Cardiac Arrest / Resuscitation',
      recommendedGauge: '16G–18G',
      rationale: 'Large-bore access for ACLS medications and fluid boluses. Consider IO if IV is delayed.'
    }
  ],

  complications: [
    {
      complication: 'Infiltration',
      signs: [
        'Swelling at or near insertion site',
        'Cool skin around the site',
        'Pain or discomfort',
        'Slowed or stopped infusion',
        'Blanching of skin'
      ],
      intervention: 'Stop infusion immediately. Remove catheter. Elevate extremity. Apply warm or cool compress based on infusate. Document and reassess. Start new IV at different site.'
    },
    {
      complication: 'Phlebitis',
      signs: [
        'Redness along the vein (erythema)',
        'Warmth at the insertion site',
        'Pain or tenderness along the vein',
        'Swelling',
        'Palpable venous cord'
      ],
      intervention: 'Discontinue IV immediately. Apply warm compress. Document severity. Monitor for signs of infection. Restart IV in opposite extremity if possible.'
    },
    {
      complication: 'Hematoma',
      signs: [
        'Rapid swelling and discoloration at site',
        'Bruising around insertion point',
        'Pain and tenderness',
        'Firmness to palpation'
      ],
      intervention: 'Remove catheter. Apply direct pressure for minimum 5 minutes. Elevate extremity. Apply ice pack. Do not use affected site again.'
    },
    {
      complication: 'Air Embolism',
      signs: [
        'Sudden dyspnea',
        'Chest pain',
        'Hypotension',
        'Tachycardia',
        'Altered mental status',
        'Churning "mill wheel" heart murmur'
      ],
      intervention: 'Clamp IV line immediately. Place patient in left lateral Trendelenburg position. Administer high-flow O2. Monitor vitals. Transport emergently — this is a life-threatening emergency.'
    },
    {
      complication: 'Catheter Shear / Embolism',
      signs: [
        'Sudden sharp pain at insertion site',
        'Catheter fragment visible or missing on removal',
        'Signs of distal embolism (pain, cyanosis downstream)'
      ],
      intervention: 'Apply tourniquet proximal to site to trap fragment. Do NOT attempt to retrieve. Transport emergently. Notify receiving facility.'
    },
    {
      complication: 'Local Infection',
      signs: [
        'Redness and swelling at site',
        'Purulent drainage',
        'Warmth and tenderness',
        'Fever (systemic sign)'
      ],
      intervention: 'Remove catheter using sterile technique. Clean site with antiseptic. Apply sterile dressing. Document. In prehospital setting, establish new IV at different site.'
    }
  ],

  siteSelection: [
    'Antecubital fossa (AC) — Large, accessible veins. Best for rapid access and trauma. Limits arm movement; avoid for long transport if possible.',
    'Forearm (cephalic / basilic veins) — Good for most prehospital IV access. Allows arm mobility. Generally well-tolerated.',
    'Dorsal hand (metacarpal veins) — Accessible in most patients. Good for elderly with fragile forearm veins. More painful; secure well to prevent dislodgement.',
    'External jugular (EJ) — Last resort for peripheral access. Use when extremity access fails. Requires specific training and protocols. Higher complication risk.',
    'Avoid: Lower extremity veins (risk of DVT), veins near joints (except AC), injured extremities, side of mastectomy or fistula.'
  ],

  prehospitalTips: [
    'Apply tourniquet 4-6 inches above intended site',
    'Allow vein to fill for 30-60 seconds before attempt',
    'Anchor vein by pulling skin taut distal to insertion point',
    'Insert at 15-30 degree angle, bevel up',
    'Advance catheter after flash, then remove needle',
    'Secure catheter well — prehospital movement increases dislodgement risk'
  ],

  citations: [
    'Pedagogy Education. "Peripheral IV Catheter Gauge Chart and Uses." 2023.',
    'NYSORA (New York School of Regional Anesthesia). "Peripheral Venous Catheter Selection Guide." 2022.',
    'INS (Infusion Nurses Society). "Standards of Practice for Infusion Therapy." J Infusion Nursing. 2021;44(1S).',
    'NAEMSP. "Prehospital Vascular Access Position Statement." 2020.',
    'Emergency Nurses Association. "Clinical Practice Guideline: Difficult Intravenous Access." 2015.'
  ]
};
