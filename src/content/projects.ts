import { roles } from './profile.ts';
export type ProjectImage = {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  title?: string;
  previewCaption?: string;
  preview?: { src: string; width: number; height: number };
  presentation?: 'portrait' | 'landscape' | 'document';
  order: number;
  provenance: 'original' | 'sanitized original' | 'reconstructed prototype' | 'new concept' | 'owner-provided prototype' | 'owner-provided example';
};
export type NarrativeSection = {
  id: string;
  title: string;
  body: string;
  images?: ProjectImage[];
  excerpt?: { text: string; label: string; href: string };
};
export type Project = {
  slug: string;
  category: 'employer' | 'independent';
  publication: 'listed' | 'draft';
  title: string;
  company: string;
  role: string;
  themes: string[];
  summary: string;
  format?: string;
  repository?: { href: string; label: 'View code on GitHub' | 'View project on GitHub' };
  liveUrl?: string;
  exampleUrl?: string;
  descriptor?: string;
  homepageExcerpt?: { text: string; context: string; attribution: string; limitation?: string };
  outcomeNote?: string;
  homepageOutcome?: { label?: string; supportingPoint: string };
  outcomes: { value: string; label: string; context?: string; statement?: string }[];
  sections: NarrativeSection[];
  responsibility?: NarrativeSection;
  decision?: NarrativeSection;
  tradeoff?: NarrativeSection;
  measurement?: NarrativeSection;
  cover?: ProjectImage;
  gallery: ProjectImage[];
  prototype: { status: 'planned' | 'available'; href?: string };
};

export const projects: Project[] = [
  {
    slug: 'uber-tasks', company: 'Uber', category: 'employer', publication: 'listed',
    title: 'Launching Uber Tasks',
    role: roles.uber,
    themes: ['0→1 launch', 'AI data collection', 'Marketplace supply', 'Global execution'],
    summary: 'Launched data-collection tasks as a new way for Uber driver-partners to earn.',
    homepageOutcome: { label: 'Revenue in three months', supportingPoint: '≈ $1M earned by driver-partners in the same period.' },
    outcomes: [
      { value: '≈ $10M', label: 'Revenue', context: 'Within three months · US, EMEA & APAC' },
      { value: '≈ $1M', label: 'Driver-partner earnings', context: 'Within the same three-month period', statement: '≈ $1M in driver-partner earnings within the same three months.' },
    ],
    sections: [
      { id: 'scope', title: 'My role in the launch', body: `As ${roles.uber}, I launched Data Collection on Uber, including work with AI Solutions. Tasks introduced a new gig for driver-partners.` },
      { id: 'outcomes', title: 'Commercial impact, shared with driver-partners', body: 'Within three months, the initiative delivered approximately $10M in revenue and $1M in driver-partner earnings across the US, EMEA, and APAC.' },
    ], gallery: [], prototype: { status: 'planned' },
  },
  {
    slug: 'oportun-partnerships', company: 'Oportun', category: 'employer', publication: 'listed',
    title: 'Scaling lending partnerships',
    role: roles.oportun,
    themes: ['Fintech', 'Enterprise partnerships', 'Distribution', 'Growth'],
    summary: 'Scaled enterprise partnerships to expand personal-loan distribution and improve acquisition costs.',
    homepageOutcome: { supportingPoint: 'At 50% lower acquisition cost.' },
    outcomes: [
      { value: '≈ $50M', label: 'Incremental annual disbursements', context: 'Enterprise partnerships' },
      { value: '50%', label: 'Lower acquisition cost', context: 'Enterprise partnerships', statement: '50% lower acquisition cost' },
    ],
    sections: [
      { id: 'scope', title: 'What I worked on', body: `As ${roles.oportun}, I scaled enterprise partnerships at Oportun. The broader business scope was a $3B personal-loans portfolio.` },
    ], gallery: [], prototype: { status: 'planned' },
  },
  {
    slug: 'oportun-verification', company: 'Oportun', category: 'employer', publication: 'listed',
    title: 'Automating document verification',
    role: roles.oportun,
    themes: ['Automation', 'Document verification', 'Operational efficiency'],
    summary: 'Used OCR to automate document verification.',
    homepageOutcome: { supportingPoint: 'Disbursement time reduced from 120 minutes to under 60 minutes.' },
    outcomeNote: 'This work included OCR document verification. The disbursement turnaround measure covers the broader process, not OCR alone; these results do not describe autonomous underwriting.',
    outcomes: [
      { value: '50%', label: 'Loans auto-approved' },
      { value: '120 minutes to under 60 minutes', label: 'Disbursement turnaround time', context: 'Broader disbursement process', statement: 'Disbursement turnaround time reduced from 120 minutes to under 60 minutes.' },
    ],
    sections: [
      { id: 'scope', title: 'What I worked on', body: 'Within Personal Loans at Oportun, I implemented optical character recognition (OCR) for document verification, bringing automation to this part of loan operations.' },
    ], gallery: [], prototype: { status: 'planned' },
  },
  {
    slug: 'byjus-tutor-platform', company: 'BYJU’S', category: 'employer', publication: 'listed',
    title: 'Improving tutor matching',
    role: roles.byjus,
    themes: ['Marketplace matching', 'Operational efficiency', 'Unit economics'],
    summary: 'Revamped the tutor platform and matching algorithm to improve class efficiency and economics.',
    homepageOutcome: { supportingPoint: 'Gross margin improved from negative to 80%.' },
    outcomes: [
      { value: '$10M', label: 'Annual savings', context: 'Tutor-platform initiative' },
      { value: '80%', label: 'Gross margin', context: 'Tutor-platform business', statement: 'Gross margin improved from negative to 80%.' },
    ],
    sections: [
      { id: 'scope', title: 'What I worked on', body: `As ${roles.byjus}, I revamped the tutor platform and implemented a matching algorithm that improved the efficiency of classes.` },
      { id: 'outcomes', title: 'A change in business economics', body: 'The tutor-platform business moved from negative gross margin to 80% gross margin.' },
    ], gallery: [], prototype: { status: 'planned' },
  },
];

export function projectPath(project: Project) {
  return `/${project.category === 'independent' ? 'builds' : 'work'}/${project.slug}`;
}
