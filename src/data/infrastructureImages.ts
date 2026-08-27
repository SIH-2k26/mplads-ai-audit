export interface InfrastructureImage {
  id: string;
  src: string;
  category: 'roads' | 'schools' | 'water' | 'health' | 'community' | 'bridges' | 'sanitation' | 'inspection';
  label: string;
  title: string;
  location: string;
  alt: string;
  fallbackGradient?: string;
}

export const infrastructureImages: InfrastructureImage[] = [
  // 1. ROAD INFRASTRUCTURE
  {
    id: 'road-1',
    src: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80',
    category: 'roads',
    label: 'ROAD INFRASTRUCTURE',
    title: 'Rural Bituminous Road Connectivity',
    location: 'Haveli Taluka, Pune District · MH',
    alt: 'Asphalt road paving and civil connectivity work',
  },
  {
    id: 'road-2',
    src: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=800&q=80',
    category: 'roads',
    label: 'ROAD INFRASTRUCTURE',
    title: 'Village Link Concrete Pavement',
    location: 'Baramati Constituency · MH',
    alt: 'Concrete roadway construction',
  },

  // 2. SANITATION & DRAINAGE
  {
    id: 'san-1',
    src: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
    category: 'sanitation',
    label: 'SANITATION & DRAINAGE',
    title: 'Underground Drainage & Stormwater Line',
    location: 'Nagpur District · Maharashtra',
    alt: 'Civil drainage pipe installation and trenching',
  },
  {
    id: 'san-2',
    src: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
    category: 'sanitation',
    label: 'SANITATION & DRAINAGE',
    title: 'Community Sanitation & Waste Block',
    location: 'Lucknow District · Uttar Pradesh',
    alt: 'Public sanitation facility construction',
  },

  // 3. WATER INFRASTRUCTURE
  {
    id: 'wat-1',
    src: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    category: 'water',
    label: 'WATER INFRASTRUCTURE',
    title: 'Solar RO Drinking Water Filtration Plant',
    location: 'Bangalore Rural · Karnataka',
    alt: 'Public clean drinking water filtration plant',
  },
  {
    id: 'wat-2',
    src: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    category: 'water',
    label: 'WATER INFRASTRUCTURE',
    title: 'Overhead Reservoir & Piped Network',
    location: 'Satara District · Maharashtra',
    alt: 'Overhead water tank infrastructure',
  },

  // 4. FIELD INSPECTION
  {
    id: 'insp-1',
    src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    category: 'inspection',
    label: 'FIELD INSPECTION',
    title: 'Independent Quality Monitor (IQM) Survey',
    location: 'Nashik District · Maharashtra',
    alt: 'Field inspection engineer with civil blueprints on site',
  },
  {
    id: 'insp-2',
    src: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    category: 'inspection',
    label: 'FIELD INSPECTION',
    title: 'Geotagged Foundation Slab Audit',
    location: 'Hadapsar Ward 17, Pune · MH',
    alt: 'Engineer conducting structural inspection',
  },

  // 5. COMMUNITY ASSET
  {
    id: 'com-1',
    src: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    category: 'community',
    label: 'COMMUNITY ASSET',
    title: 'Multipurpose Community & Skill Centre',
    location: 'Ward 17, Pune District · MH',
    alt: 'Public community hall and training facility',
  },
  {
    id: 'com-2',
    src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    category: 'community',
    label: 'COMMUNITY ASSET',
    title: 'Panchayat Training & Youth Hall',
    location: 'Kolhapur District · Maharashtra',
    alt: 'Village civic community center',
  },

  // 6. PUBLIC HEALTH
  {
    id: 'hlth-1',
    src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    category: 'health',
    label: 'PUBLIC HEALTH',
    title: 'Primary Health Sub-Centre Diagnostic Unit',
    location: 'Lucknow District · Uttar Pradesh',
    alt: 'Rural public health clinic and dispensary facility',
  },
  {
    id: 'hlth-2',
    src: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
    category: 'health',
    label: 'PUBLIC HEALTH',
    title: 'Maternal & Child Health Care Wing',
    location: 'Baramati District · Maharashtra',
    alt: 'Primary healthcare center infrastructure',
  },

  // 7. EDUCATION / CIVIL WORKS
  {
    id: 'edu-1',
    src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    category: 'schools',
    label: 'EDUCATION INFRASTRUCTURE',
    title: 'Zilla Parishad STEM Smart Classroom',
    location: 'East Delhi Constituency',
    alt: 'Government public school STEM laboratory',
  },
  {
    id: 'edu-2',
    src: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    category: 'bridges',
    label: 'CIVIL WORKS & BRIDGES',
    title: 'High-Level River Causeway Bridge',
    location: 'Satara District · Maharashtra',
    alt: 'Reinforced concrete bridge and culvert work',
  },
];
