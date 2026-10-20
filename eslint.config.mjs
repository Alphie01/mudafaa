import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/generated/**',
      '**/coverage/**',
      'apps/mobile/**',
      'design/**',
      // Claude Code iş akışı betikleri: agent/args/pipeline global'leri ve üst düzey return ile çalışır.
      'tools/content/workflows/**',
      '.superpowers/**',
      '.claude/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Motor deterministik ve I/O'suz olmalı (docs/plan.md §4 ilke 1).
    files: ['packages/engine/src/**/*.ts'],
    rules: {
      'no-restricted-globals': [
        'error',
        { name: 'Date', message: 'Motor deterministik olmalı: Date kullanılamaz.' },
        { name: 'performance', message: 'Motor deterministik olmalı: performance kullanılamaz.' },
      ],
      'no-restricted-properties': [
        'error',
        { object: 'Math', property: 'random', message: 'Motor deterministik olmalı: Math.random kullanılamaz.' },
      ],
      'no-restricted-imports': [
        'error',
        { patterns: [{ group: ['node:*'], message: 'Motor I/O yapmaz: node:* modülleri kullanılamaz.' }] },
      ],
    },
  },
  {
    // AI izolasyonu (docs/plan.md §8): Claude SDK'sı yalnızca içerik üretimi modülünde.
    files: ['apps/api/src/**/*.ts'],
    ignores: ['apps/api/src/modules/content-generation/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@anthropic-ai/sdk',
              message: 'AI SDK yalnızca modules/content-generation altında kullanılabilir.',
            },
          ],
        },
      ],
    },
  },
  {
    // Node betikleri (.mjs): Node genel değişkenleri.
    files: ['**/*.mjs'],
    languageOptions: { globals: { process: 'readonly', console: 'readonly', fetch: 'readonly', URL: 'readonly' } },
  },
);
