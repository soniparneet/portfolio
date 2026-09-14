import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { projects, projectPath } from '../src/content/projects.ts';
import { builds } from '../src/content/builds.ts';
import { profile } from '../src/content/profile.ts';
import { existsSync, readFileSync } from 'node:fs';
import sharp from 'sharp';

test('owner-authorized external résumé configuration', () => {
  assert.equal(profile.resume.enabled, true);
  assert.equal(profile.resume.href, 'https://drive.google.com/file/d/1P_Z6FG8J2kMTeueyN__kfePSGHAvxGTN/view?usp=drive_link');
});

test('owner corrections supersede prior wording without losing scope or attribution', () => {
  assert.match(projects[2].outcomeNote!, /broader process, not OCR alone/);
  assert.deepEqual(projects[2].outcomes.map(o => [o.value, o.label]), [['50%', 'Loans auto-approved'], ['120 minutes to under 60 minutes', 'Disbursement turnaround time']]);
  assert.deepEqual(projects[1].outcomes.map(o => o.value), ['≈ $50M', '50%']);
  assert.deepEqual(projects[3].outcomes.map(o => o.value), ['$10M', '80%']);
  assert.equal(projects[1].role, 'Principal Product Manager - Acquisitions and Innovation');
  assert.equal(projects[2].role, projects[1].role);
  assert.equal(projects[3].role, 'AVP - Product');
  assert.equal(profile.headline, 'Product leadership across AI, fintech, edtech, and marketplaces.');
  assert.equal(profile.about, 'I have an MBA in Finance from XLRI Jamshedpur and a BE in Electronics from Mumbai University. Away from work, I enjoy hiking.');
  assert.equal(builds[1].title, 'AI Skill: PM Interviewer');
  assert.equal(builds[1].summary, 'AI skill for practising PM interviews with structured prompts, examples, and coaching.');
  assert.equal(builds[1].format, 'AI instruction workflow. Framework: Ben Erez / Lenny’s Newsletter.');
  assert.doesNotMatch(JSON.stringify([profile, projects, builds]), /—|Product Sense Practice|Hypothetical example; no Zerodha affiliation\./);
  assert.ok(builds[1].sections.find(s => s.id === 'built')!.body.startsWith('I adapted the credited framework into reusable instructions, designed the interaction, refined the rules, and documented setup and limitations. It runs as an instruction-based experience inside ChatGPT'));
});

test('only reviewed variants are public, metadata-free and mapped to their project', async () => {
  const asset = builds[1].cover!;
  assert.equal(asset.provenance, 'owner-provided example');
  for (const variant of [asset, asset.preview!]) {
    assert.ok(variant.src.startsWith('/projects/product-sense-practice/'));
    const metadata = await sharp(readFileSync(`public${variant.src}`)).metadata();
    assert.equal(metadata.width, variant.width);
    assert.equal(metadata.height, variant.height);
    assert.equal(metadata.exif, undefined);
    assert.equal(metadata.xmp, undefined);
    assert.equal(metadata.icc, undefined);
  }
  assert.equal(existsSync('public/Images'), false);
  assert.equal(existsSync('public/images'), false);
  assert.ok(readFileSync('.gitignore', 'utf8').includes('Images/'));
  assert.ok(readFileSync('.vercelignore', 'utf8').includes('Images/'));
  for (const project of projects) assert.equal(project.cover, undefined, 'Unmapped employer images must remain unselected');
});
import { publication } from '../src/lib/publication.mjs';

test('publication and résumé require explicit approval and the correct environment', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'portfolio-resume-test-'));
  try {
    assert.equal(publication({}, root).indexable, false);
    assert.equal(publication({ RESUME_APPROVED: 'true' }, root).resumeAvailable, false);
    mkdirSync(path.join(root, 'public/resume'), { recursive: true });
    writeFileSync(path.join(root, 'public/resume/parneet-soni-resume.pdf'), 'non-confidential existence fixture');
    assert.equal(publication({}, root).resumeAvailable, false);
    assert.equal(publication({ RESUME_APPROVED: 'true' }, root).resumeAvailable, true);
    assert.throws(() => publication({ PUBLICATION_APPROVED: 'true' }, root));
    for (const origin of ['http://portfolio.example', 'https://portfolio.example/path', 'https://user:secret@portfolio.example', 'https://localhost']) assert.throws(() => publication({ PRODUCTION_ORIGIN: origin }, root));
    const env = { PUBLICATION_APPROVED: 'true', PRODUCTION_ORIGIN: 'https://portfolio.example' };
    assert.equal(publication(env, root).indexable, true);
    assert.equal(publication({ ...env, VERCEL_ENV: 'preview' }, root).indexable, false);
  } finally { rmSync(root, { recursive: true }); }
});

test('curated builds keep publication, evidence actions and prototypes distinct', () => {
  assert.deepEqual(builds.map(p => p.slug), ['citizen-sir-watch', 'product-sense-practice']);
  for (const project of [...projects, ...builds]) {
    assert.equal(project.publication, 'listed');
    assert.equal(project.prototype.status, 'planned');
    assert.equal(project.prototype.href, undefined);
    assert.equal(projectPath(project), `/${project.category === 'employer' ? 'work' : 'builds'}/${project.slug}`);
    for (const asset of [project.cover, ...project.gallery].filter(a => a !== undefined)) {
      assert.ok(asset.src.startsWith(`/projects/${project.slug}/`));
      assert.ok(asset.width > 0 && asset.height > 0 && asset.alt && asset.caption && asset.id);
    }
  }
  for (const project of projects) {
    assert.equal(project.repository, undefined);
    assert.equal(project.liveUrl, undefined);
    assert.equal(project.exampleUrl, undefined);
  }
  assert.equal(builds[0].repository?.href, 'https://github.com/soniparneet/citizen-sir-watch');
  assert.equal(builds[0].liveUrl, 'https://citizen-sir-watch.vercel.app/');
  assert.equal(builds[1].repository?.href, 'https://github.com/soniparneet/product-sense-practice');
  assert.equal(builds[1].liveUrl, undefined);
  assert.equal(builds[1].gallery.length, 0);
  assert.equal(builds[1].exampleUrl, 'https://github.com/soniparneet/product-sense-practice/blob/main/examples/candidate-example.md');
});

test('four complete employer overviews without unmapped images or unfinished prototypes', () => {
  assert.equal(new Set(projects.map(p => p.slug)).size, 4);
  for (const project of projects) {
    assert.equal(project.prototype.status, 'planned');
    assert.equal(project.prototype.href, undefined);
    assert.equal(project.gallery.length, 0);
    assert.equal(project.cover, undefined);
    assert.ok(project.outcomes.every(o => o.value && o.label));
    assert.ok(project.homepageOutcome?.supportingPoint);
    assert.ok(project.sections.length > 0);
  }
});

test('seven corrections: locked homepage copy and active phrase removal', () => {
  assert.equal(profile.intro, 'I’m Parneet. I’ve launched a new way for driver-partners to earn at Uber, scaled lending partnerships at Oportun, and led customer service, platform products, and tutor marketplace at BYJU’S.');
  assert.deepEqual(projects.map(p => [p.outcomes[0].value, p.homepageOutcome?.label || p.outcomes[0].label, p.homepageOutcome?.supportingPoint]), [
    ['≈ $10M', 'Revenue in three months', '≈ $1M earned by driver-partners in the same period.'],
    ['≈ $50M', 'Incremental annual disbursements', 'At 50% lower acquisition cost.'],
    ['50%', 'Loans auto-approved', 'Disbursement time reduced from 120 minutes to under 60 minutes.'],
    ['$10M', 'Annual savings', 'Gross margin improved from negative to 80%.'],
  ]);
  assert.doesNotMatch(JSON.stringify([profile, projects, builds]), /Document-verification and lending operations work|Dollar amounts in US dollars\./);
});
