import type { ProjectImage } from '../../src/content/projects';
export const cover: ProjectImage = { id: 'test-cover', src: '/projects/uber-tasks/test-cover.svg', width: 1200, height: 600, alt: 'Abstract olive rectangle with an ivory circle', caption: 'Non-confidential cover fixture.', order: 0, provenance: 'new concept' };
export const gallery: ProjectImage[] = [
  { id: 'test-mobile', src: '/projects/uber-tasks/test-mobile.svg', width: 390, height: 780, alt: 'Tall sage rectangle with two circles', caption: 'Portrait proportion fixture.', order: 2, provenance: 'reconstructed prototype' },
  { id: 'test-desktop', src: '/projects/uber-tasks/test-cover.svg', width: 1200, height: 600, alt: 'Wide olive rectangle with one circle', caption: 'Landscape proportion fixture.', order: 1, provenance: 'new concept' },
  { id: 'test-square', src: '/projects/uber-tasks/test-square.svg', width: 700, height: 700, alt: 'Square lavender field with a central circle', caption: 'Square proportion fixture.', order: 3, provenance: 'sanitized original' },
];
