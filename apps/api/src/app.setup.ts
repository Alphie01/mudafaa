import type { INestApplication } from '@nestjs/common';

/** main.ts ile e2e testlerinin paylaştığı uygulama ayarları; testler üretimdeki yolları (`/v1/...`) kullanır. */
export function configureApp<T extends INestApplication>(app: T): T {
  app.setGlobalPrefix('v1');
  return app;
}
