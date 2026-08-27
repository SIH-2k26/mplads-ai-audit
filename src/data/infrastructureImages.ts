export interface InfrastructureImage {
  id: string;
  src: string;
  category: 'roads' | 'schools' | 'water' | 'health' | 'community' | 'bridges' | 'sanitation';
  label: string;
  title: string;
  location: string;
  alt: string;
}

export const infrastructureImages: InfrastructureImage[] = [
  {
    id: 'img-1',
    src: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80',
    category: 'roads',
    label: 'ROAD INFRASTRUCTURE',
    title: 'Rural Bituminous Road Connectivity',
    location: 'Haveli Taluka, Maharashtra',
    alt: 'Civil road construction and paving',
  },
  {
    id: 'img-2',
    src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    category: 'schools',
    label: 'EDUCATION INFRASTRUCTURE',
    title: 'Zilla Parishad STEM Smart Classroom',
    location: 'East Delhi Constituency',
    alt: 'Modern public school classroom',
  },
  {
    id: 'img-3',
    src: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    category: 'water',
    label: 'WATER INFRASTRUCTURE',
    title: 'Solar Powered Drinking Water Plant',
    location: 'Bangalore Rural, Karnataka',
    alt: 'Public clean water filtration facility',
  },
  {
    id: 'img-4',
    src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    category: 'health',
    label: 'PUBLIC HEALTH',
    title: 'Primary Health Sub-centre Diagnostic Unit',
    location: 'Lucknow District, UP',
    alt: 'Healthcare and diagnostic facility',
  },
  {
    id: 'img-5',
    src: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    category: 'community',
    label: 'COMMUNITY ASSET',
    title: 'Multipurpose Community & Skill Centre',
    location: 'Pune District, Maharashtra',
    alt: 'Community multipurpose hall',
  },
  {
    id: 'img-6',
    src: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    category: 'bridges',
    label: 'CIVIL WORKS',
    title: 'High-Level River Causeway Bridge',
    location: 'Satara District, Maharashtra',
    alt: 'Bridge and culvert infrastructure',
  },
  {
    id: 'img-7',
    src: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
    category: 'sanitation',
    label: 'SANITATION & DRAINAGE',
    title: 'Underground Drainage & STP Network',
    location: 'Nagpur District, Maharashtra',
    alt: 'Sanitation and civil drainage infrastructure',
  },
  {
    id: 'img-8',
    src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    category: 'community',
    label: 'FIELD INSPECTION',
    title: 'Independent Quality Monitor (IQM) Survey',
    location: 'Nashik District, Maharashtra',
    alt: 'Field engineer inspection on site',
  },
];
