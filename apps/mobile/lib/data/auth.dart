import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_sign_in/google_sign_in.dart';

/// Oturum açmış Firebase kullanıcısı (null: giriş yapılmamış).
final authStateProvider = StreamProvider<User?>((ref) => FirebaseAuth.instance.authStateChanges());

/// Giriş akışları; hatalar Türkçe mesaja çevrilir.
abstract final class AuthActions {
  static Future<void> guest() => FirebaseAuth.instance.signInAnonymously();

  static Future<void> signIn(String email, String password) => _wrap(() => FirebaseAuth.instance.signInWithEmailAndPassword(email: email.trim(), password: password));

  static Future<void> register(String email, String password) => _wrap(() => FirebaseAuth.instance.createUserWithEmailAndPassword(email: email.trim(), password: password));

  static Future<void> reset(String email) => _wrap(() => FirebaseAuth.instance.sendPasswordResetEmail(email: email.trim()));

  /// Misafir hesabı e-postaya bağlanır; UID aynı kaldığı için ilerleme korunur.
  static Future<void> linkEmail(String email, String password) => _wrap(() async {
        final user = FirebaseAuth.instance.currentUser;
        if (user == null) return;
        await user.linkWithCredential(EmailAuthProvider.credential(email: email.trim(), password: password));
      });

  /// Google: web'de açılır pencere, mobilde yerel Google hesabı seçici (google_sign_in 7) → Firebase kimliği.
  static Future<void> google() => _wrap(() async {
        if (kIsWeb) {
          await FirebaseAuth.instance.signInWithPopup(GoogleAuthProvider());
          return;
        }
        await _initGoogle();
        final account = await GoogleSignIn.instance.authenticate();
        final idToken = account.authentication.idToken;
        if (idToken == null) throw FirebaseAuthException(code: 'missing-id-token');
        await FirebaseAuth.instance.signInWithCredential(GoogleAuthProvider.credential(idToken: idToken));
      });

  /// Apple ile giriş (iOS'ta yerel sayfa; web'de açılır pencere). Firebase'in kendi sağlayıcısı kullanılır.
  static Future<void> apple() => _wrap(() async {
        final provider = AppleAuthProvider()..addScope('email')..addScope('name');
        if (kIsWeb) {
          await FirebaseAuth.instance.signInWithPopup(provider);
        } else {
          await FirebaseAuth.instance.signInWithProvider(provider);
        }
      });

  /// Apple girişi yalnızca Apple platformlarında (ve web'de) gösterilir.
  static bool get appleAvailable => kIsWeb || defaultTargetPlatform == TargetPlatform.iOS || defaultTargetPlatform == TargetPlatform.macOS;

  static bool _googleReady = false;
  static Future<void> _initGoogle() async {
    if (_googleReady) return;
    // iOS istemcisi GoogleService-Info.plist'ten; Android'de kimlik belirteci için web istemcisi (google-services.json, tür 3).
    await GoogleSignIn.instance.initialize(
      clientId: defaultTargetPlatform == TargetPlatform.iOS ? '600031550882-ps1fg8tbm8rifbjmmqpco0p22dv4fgk3.apps.googleusercontent.com' : null,
      serverClientId: '600031550882-vlacp2obi9f4vuoj3klonv86mmmhcpqs.apps.googleusercontent.com',
    );
    _googleReady = true;
  }

  static Future<void> signOut() async {
    if (!kIsWeb && _googleReady) await GoogleSignIn.instance.signOut();
    await FirebaseAuth.instance.signOut();
  }

  static Future<void> _wrap(Future<void> Function() run) async {
    try {
      await run();
    } on GoogleSignInException catch (e) {
      if (e.code == GoogleSignInExceptionCode.canceled) return;
      throw Exception('Google ile giriş yapılamadı (${e.code.name}).');
    } on FirebaseAuthException catch (e) {
      throw Exception(switch (e.code) {
        'invalid-email' => 'E-posta adresi geçersiz.',
        'user-not-found' || 'wrong-password' || 'invalid-credential' => 'E-posta ya da şifre hatalı.',
        'email-already-in-use' || 'credential-already-in-use' => 'Bu e-posta zaten kullanılıyor; giriş yapmayı deneyin.',
        'weak-password' => 'Şifre en az 6 karakter olmalı.',
        'network-request-failed' => 'Bağlantı yok; tekrar deneyin.',
        'canceled' || 'web-context-canceled' || 'popup-closed-by-user' => 'Giriş iptal edildi.',
        'account-exists-with-different-credential' => 'Bu e-posta başka bir giriş yöntemiyle kayıtlı.',
        _ => 'Giriş yapılamadı (${e.code}).',
      });
    }
  }
}
