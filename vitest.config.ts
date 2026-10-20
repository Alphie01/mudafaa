import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// Testler paketleri derlenmiş dist yerine kaynaktan kullanır (yalnızca kök giriş noktaları).
const alias = [
  { find: /^@mudafaa\/case-schema$/, replacement: r('./packages/case-schema/src/index.ts') },
  { find: /^@mudafaa\/engine$/, replacement: r('./packages/engine/src/index.ts') },
  { find: /^@mudafaa\/validator$/, replacement: r('./packages/validator/src/index.ts') },
];

const pkgProject = (name: string, dir: string, include = ['test/**/*.test.ts']) => ({
  resolve: { alias },
  test: { name, root: r(dir), include, passWithNoTests: true },
});

// Projeler, dizinleri oluştukça devreye girer (Vitest var olmayan kökleri hata sayar).
const projects = [
  pkgProject('case-schema', './packages/case-schema'),
  pkgProject('engine', './packages/engine'),
  pkgProject('validator', './packages/validator'),
  pkgProject('content-tools', './tools/content'),
  pkgProject('api-unit', './apps/api', ['test/unit/**/*.test.ts', 'src/**/*.spec.ts']),
  pkgProject('api-e2e', './apps/api', ['test/e2e/**/*.e2e.test.ts']),
].filter((p) => existsSync(p.test.root));

export default defineConfig({
  test: {
    passWithNoTests: true,
    projects,
  },
});
