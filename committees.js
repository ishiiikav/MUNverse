// ─── COMMITTEES ───────────────────────────────────────────────────────────────

export const COMMITTEES = [
  { id: 'UNSC',   name: 'Security Council',        short: 'UNSC',   icon: '🛡️', color: '#A78BFA' },
  { id: 'UNGA',   name: 'General Assembly',         short: 'UNGA',   icon: '🌐', color: '#818CF8' },
  { id: 'WHO',    name: 'World Health Org',         short: 'WHO',    icon: '🏥', color: '#C084FC' },
  { id: 'UNHRC',  name: 'Human Rights Council',     short: 'UNHRC',  icon: '⚖️', color: '#A78BFA' },
  { id: 'ECOSOC', name: 'Economic & Social',        short: 'ECOSOC', icon: '📊', color: '#8B5CF6' },
  { id: 'UNICEF', name: 'UNICEF Committee',         short: 'UNICEF', icon: '👶', color: '#C084FC' },
  { id: 'DISEC',  name: 'Disarmament & Security',   short: 'DISEC',  icon: '☮️', color: '#7C3AED' },
  { id: 'UNEP',   name: 'Environment Committee',    short: 'UNEP',   icon: '🌿', color: '#9333EA' },
];

// ─── AGENDA TOPICS ────────────────────────────────────────────────────────────

export const AGENDA = {
  UNSC:   [
    'Cyber warfare & global security',
    'Nuclear non-proliferation',
    'Maritime piracy & law',
    'Peacekeeping in conflict zones',
  ],
  UNGA:   [
    'Climate change cooperation',
    'Global pandemic preparedness',
    'Refugee & migration crisis',
    'Universal education access',
  ],
  WHO:    [
    'Vaccine distribution equity',
    'Mental health as human right',
    'Antimicrobial resistance',
    'Pandemic response & surveillance',
  ],
  UNHRC:  [
    'Press freedom & digital censorship',
    'Refugee & displaced persons',
    'Human trafficking',
    'Minority rights in conflict',
  ],
  ECOSOC: [
    'Global income inequality',
    'Sustainable urban development',
    'International trade & labor',
    'Clean water & sanitation',
  ],
  UNICEF: [
    'Child labor & education',
    'Conflict impact on children',
    'Child nutrition & health',
    'Refugee children education',
  ],
  DISEC:  [
    'AI in military applications',
    'Global arms trade regulation',
    'Autonomous weapons ethics',
    'Chemical weapons & law',
  ],
  UNEP:   [
    'Ocean pollution & microplastics',
    'Deforestation & biodiversity',
    'Renewable energy transition',
    'Climate refugee management',
  ],
};
