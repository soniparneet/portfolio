import { defineConfig, globalIgnores } from 'eslint/config';
import { fixupConfigRules } from '@eslint/compat';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
export default defineConfig([
  ...fixupConfigRules([...nextVitals, ...nextTs]),
  // Native links intentionally preserve document navigation and avoid route prefetching.
  { rules: { '@next/next/no-html-link-for-pages': 'off' } },
  globalIgnores(['.next/**', 'output/**', 'next-env.d.ts', 'source-materials/**', 'playwright-report/**', 'test-results/**']),
]);
