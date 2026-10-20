import type { Issue } from '@mudafaa/engine';

export type { Issue } from '@mudafaa/engine';
export type Severity = Issue['severity'];

export const error = (code: string, path: string, message: string): Issue => ({
  severity: 'ERROR',
  code,
  path,
  message,
});
export const warning = (code: string, path: string, message: string): Issue => ({
  severity: 'WARNING',
  code,
  path,
  message,
});
export const info = (code: string, path: string, message: string): Issue => ({ severity: 'INFO', code, path, message });
