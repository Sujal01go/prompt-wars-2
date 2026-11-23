import type { PersonaId, PersonaProfile } from '../types/index.ts'

export const PERSONA_PROFILES: Record<PersonaId, PersonaProfile> = {
  children: {
    id: 'children',
    name: 'Infants & Children',
    tagline: 'Developing Lungs & Pediatric Airway Shield',
    icon: '👶',
    vulnerabilityLevel: 'Critical',
    vulnerabilityColor: '#ef4444',
    description:
      'Children breathe ~50% more air per kilogram of body weight than adults. 80% of alveoli form post-birth, making them acutely prone to permanent lung capacity reduction.',
    clinicalRisks: [
      'Stunted lifelong lung growth and reduced vital capacity (FVC)',
      'High incidence of childhood asthma flare-ups and wheezing',
      'Increased susceptibility to viral bronchiolitis and pneumonia',
      'Stroller height places child directly at ground exhaust tailpipe level',
    ],
    recommendedMask: 'Pediatric-certified KF94 or Small N95 (tight seal)',
    maxOutdoorMinutes: 20,
    dos: [
      'Keep school commutes inside sealed vehicles with recirculated AC or metro',
      'Run a Corsi-Rosenthal box or HEPA filter in nursery/bedroom 24/7',
      'Perform gentle sterile saline nasal rinses after returning from outdoors',
      'Replace outdoor recess with indoor creative games during smog alerts',
    ],
    donts: [
      'Do NOT use loose cloth or paper surgical masks; they leak >70% around cheeks',
      'Do NOT walk strollers along busy urban arterial roads or intersections',
      'Do NOT allow morning outdoor sports or playground runs before 11:00 AM',
    ],
    medicationCheck:
      'Consult pediatrician if child coughs at night. Keep prescribed pediatric inhaler and spacer chamber clean and ready.',
    hepaTargetAqi: 25,
  },

  elderly: {
    id: 'elderly',
    name: 'Seniors & Heart Patients',
    tagline: 'Cardiovascular & COPD Smog Defense',
    icon: '🧓',
    vulnerabilityLevel: 'Severe',
    vulnerabilityColor: '#f97316',
    description:
      'Fine particulates (PM2.5) enter deep alveolar capillaries, triggering systemic endothelial inflammation, arterial plaque destabilization, and blood pressure spikes.',
    clinicalRisks: [
      'Acute elevation in risk of ischemic stroke and heart attacks (MI)',
      'Exacerbation of Chronic Obstructive Pulmonary Disease (COPD)',
      'Cardiac arrhythmia and oxygen desaturation episodes',
      'Reduced exercise tolerance and heavy chest tightness',
    ],
    recommendedMask: 'N95 / FFP2 with soft foam seal and low breathing resistance',
    maxOutdoorMinutes: 25,
    dos: [
      'Check blood pressure twice daily; winter smog is proven to elevate vascular tone',
      'Position an air cleaner within 2 meters of favorite armchair and bed',
      'Stay well hydrated with warm broths, ginger tea, and herbal infusions',
      'Ventilate rooms only during the brief Golden Window (1:00 PM – 3:00 PM)',
    ],
    donts: [
      'Do NOT go for early morning walks in parks (ground smog inversion is highest)',
      'Do NOT skip daily maintenance cardiac, hypertensive, or pulmonary medications',
      'Do NOT dry-sweep floors with brooms; use damp microfiber mops instead',
    ],
    medicationCheck:
      'Ensure 30-day buffer of antihypertensive, statin, and bronchodilator prescriptions. Keep pulse oximeter handy.',
    hepaTargetAqi: 30,
  },

  athlete: {
    id: 'athlete',
    name: 'Runners & Outdoor Athletes',
    tagline: 'High-Ventilation Athletic Performance Shield',
    icon: '🏃',
    vulnerabilityLevel: 'High',
    vulnerabilityColor: '#eab308',
    description:
      'During running or heavy cycling, respiratory minute ventilation surges from 6 L/min to 80-120 L/min with oral breathing, forcing massive PM2.5 deposits into deep lung tissue.',
    clinicalRisks: [
      'Massive soot ingestion: 1-hour hard run at AQI 250 = smoking 4-6 cigarettes',
      'Exercise-induced acute bronchospasm and prolonged chest tightness',
      'Systemic oxidative stress that impairs muscle recovery and athletic output',
      'Microvascular endothelial dysfunction in coronary arteries',
    ],
    recommendedMask: 'Valved N99/FFP3 for walking transit; ZERO heavy exertion outdoors',
    maxOutdoorMinutes: 15,
    dos: [
      'Shift all high-intensity cardio indoors (treadmill/turbo trainer next to air filter)',
      'Restructure training cycles toward indoor strength and core conditioning',
      'Consume high-dose dietary antioxidants (Vitamin C, E, Curcumin) post-workout',
      'If running outdoors is non-negotiable, restrict to the Golden Window (1-3 PM)',
    ],
    donts: [
      'Do NOT run outdoors in the early morning (6:00 - 9:00 AM) during thermal inversions',
      'Do NOT attempt sprint intervals or VO2-max intervals in unventilated street air',
      'Do NOT rely on thin cloth gaiters or bandanas; they do not filter PM2.5',
    ],
    medicationCheck:
      'If you have mild exercise-induced asthma, use a prescribed preventative bronchodilator puff 15 min prior to training.',
    hepaTargetAqi: 35,
  },

  respiratory: {
    id: 'respiratory',
    name: 'Asthma & Allergy Patients',
    tagline: 'Hyper-Reactive Bronchial & Alveolar Protection',
    icon: '🫁',
    vulnerabilityLevel: 'Critical',
    vulnerabilityColor: '#ef4444',
    description:
      'Airways are hyper-reactive to acidic aerosols (SO2, NO2) and carbon nanoparticles, precipitating acute bronchoconstriction, nocturnal coughing, and severe asthma attacks.',
    clinicalRisks: [
      'Acute asthma exacerbations requiring emergency nebulization or systemic steroids',
      'Severe allergic rhinitis, conjunctival burning, and sinus headaches',
      'Progressive drop in Peak Expiratory Flow Rate (PEFR)',
      'Secondary bacterial superinfections following airway epithelial damage',
    ],
    recommendedMask: 'Strictly sealed N99 / FFP3 with headbands and silicone face seal',
    maxOutdoorMinutes: 10,
    dos: [
      'Measure peak flow (PEFR) daily upon waking; report >20% drops to your physician',
      'Keep fast-acting rescue inhaler (Salbutamol) on your person at all times',
      'Run Corsi-Rosenthal boxes continuously to keep indoor PM2.5 strictly under 15 µg/m³',
      'Perform warm saline steam inhalation before bedtime to soothe irritated bronchial tree',
    ],
    donts: [
      'Do NOT burn incense, candles, mosquito coils, or cook with open chili frying',
      'Do NOT step outside during dense morning smog without a sealed N95/N99',
      'Do NOT delay using rescue inhaler if wheezing or tight chest sensation begins',
    ],
    medicationCheck:
      'Check rescue inhaler dose counter daily. Ensure spacer chamber is clean and maintenance steroid inhaler is taken.',
    hepaTargetAqi: 20,
  },

  pregnant: {
    id: 'pregnant',
    name: 'Expectant Mothers',
    tagline: 'Maternal-Fetal Micro-Vascular Shield',
    icon: '🤰',
    vulnerabilityLevel: 'Severe',
    vulnerabilityColor: '#ec4899',
    description:
      'Ultrafine combustion particles can cross the alveolar-capillary barrier and enter fetal circulation, posing heightened risks for intrauterine growth restriction and maternal preeclampsia.',
    clinicalRisks: [
      'Higher statistical incidence of low birth weight and preterm delivery',
      'Elevated maternal gestational hypertension and vascular resistance',
      'Systemic placental inflammation and altered epigenetic markers',
      'Increased pregnancy fatigue and nasal mucosal congestion',
    ],
    recommendedMask: 'High-breathability NIOSH N95 or KF94 with adjustable ear-loops',
    maxOutdoorMinutes: 20,
    dos: [
      'Create a pristine "clean air sanctuary" in the master bedroom with 24/7 HEPA filtration',
      'Consume iron, folate, and polyphenol-rich foods (berries, dark leafy greens, walnuts)',
      'Monitor resting pulse and blood pressure during smog alert weeks',
      'Take relaxing indoor strolls in HEPA-filtered spaces (e.g. filtered indoor malls)',
    ],
    donts: [
      'Do NOT travel via open auto-rickshaw or two-wheeler through high-traffic bottlenecks',
      'Do NOT use harsh chemical aerosol sprays, perfumes, or synthetic air fresheners indoors',
      'Do NOT hesitate to contact obstetrician if headaches or unusual shortness of breath occur',
    ],
    medicationCheck:
      'Confirm prenatal vitamins and iron supplements. Review all allergy medications with your OB-GYN.',
    hepaTargetAqi: 20,
  },

  commuter: {
    id: 'commuter',
    name: 'Daily Commuters & Drivers',
    tagline: 'Transit Smog & Vehicular Exhaust Shield',
    icon: '🛵',
    vulnerabilityLevel: 'High',
    vulnerabilityColor: '#eab308',
    description:
      'Commuters on two-wheelers, auto-rickshaws, or open pedestrian sidewalks spend hours in direct proximity to vehicle tailpipe emissions, diesel soot, and toxic brake dust.',
    clinicalRisks: [
      'Massive acute inhalation of raw Black Carbon, Benzene, and Nitrogen Dioxide (NO2)',
      'Severe eye burning, dry throat, and persistent dry hacking cough',
      'Cognitive fatigue and reduced reaction time due to low-level Carbon Monoxide (CO)',
      'Long-term elevated risk of cardiovascular atherosclerosis',
    ],
    recommendedMask: 'N95 / FFP2 with active carbon layer for odor/VOC reduction',
    maxOutdoorMinutes: 45,
    dos: [
      'Prioritize Metro Rail or Electric Train transit; cuts inhaled PM2.5 by up to ~78%',
      'If driving a car, strictly turn HVAC to "Recirculate" and inspect cabin air filter',
      'Wear a snug valveless N95 respirator under your motorcycle helmet',
      'Wash face and flush eyes with cold clean water immediately upon reaching destination',
    ],
    donts: [
      'Do NOT stop directly behind heavy diesel trucks or old buses at red traffic lights',
      'Do NOT leave vehicle windows rolled down in bumper-to-bumper traffic jams',
      'Do NOT use simple cloth bandanas or cotton scarves; they offer <15% particulate filtration',
    ],
    medicationCheck:
      'Carry lubricating eye drops (artificial tears) to soothe smog-induced conjunctival irritation.',
    hepaTargetAqi: 40,
  },
}
