import { OAuth2Client } from 'google-auth-library';
import type { GoogleOidcVerifier } from '../store-notifications.service.js';

/**
 * Pub/Sub push OIDC token'ı: Google'ın açık anahtarlarıyla imza, süre, yayıncı (accounts.google.com) ve audience
 * google-auth-library tarafından doğrulanır.
 */
export class GoogleIdTokenVerifier implements GoogleOidcVerifier {
  private readonly client = new OAuth2Client();

  async verify(idToken: string, audience: string): Promise<{ email?: string; emailVerified?: boolean }> {
    const ticket = await this.client.verifyIdToken({ idToken, audience });
    const p = ticket.getPayload();
    if (p === undefined) throw new Error('OIDC token yükü boş');
    return {
      ...(p.email === undefined ? {} : { email: p.email }),
      ...(p.email_verified === undefined ? {} : { emailVerified: p.email_verified }),
    };
  }
}
