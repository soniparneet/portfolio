export type ExternalResume = { enabled: boolean; href: string };
export const roles = { uber: 'Lead, Product & Strategy - Supply Ops', oportun: 'Principal Product Manager - Acquisitions and Innovation', byjus: 'AVP - Product' };

export const profile = {
  resume: { enabled: true, href: 'https://drive.google.com/file/d/1P_Z6FG8J2kMTeueyN__kfePSGHAvxGTN/view?usp=drive_link' } satisfies ExternalResume,
  github: 'https://github.com/soniparneet',
  name: 'Parneet Soni', label: 'Product & Strategy', location: 'Bangalore, India',
  headline: 'Product leadership across AI, fintech, edtech, and marketplaces.',
  intro: 'I’m Parneet. I’ve launched a new way for driver-partners to earn at Uber, scaled lending partnerships at Oportun, and led customer service, platform products, and tutor marketplace at BYJU’S.',
  about: 'I have an MBA in Finance from XLRI Jamshedpur and a BE in Electronics from Mumbai University. Away from work, I enjoy hiking.',
  contact: 'For product leadership opportunities, get in touch by email or LinkedIn.',
  email: 'soniparneet@gmail.com', linkedin: 'https://www.linkedin.com/in/soniparneet/',
  experience: [
    { company: 'Uber', role: roles.uber, summary: 'Beyond Tasks, my work included capital allocation across India / South Asia Rides and Eats, regional OKRs, and competition intelligence.' },
    { company: 'Oportun', role: roles.oportun, summary: 'Led product work within a $3B personal-loans portfolio, including prequalification and operations innovation alongside partnerships and document verification.' },
    { company: 'BYJU’S', role: roles.byjus, summary: 'Led customer service and platform products, including CRM tools and internal platforms, alongside tutor marketplace work.' },
  ],
};
