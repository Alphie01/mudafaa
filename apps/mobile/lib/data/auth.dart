import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

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

  static Future<void> signOut() => FirebaseAuth.instance.signOut();

  static Future<void> _wrap(Future<void> Function() run) async {
    try {
      await run();
    } on FirebaseAuthException catch (e) {
      throw Exception(switch (e.code) {
        'invalid-email' => 'E-posta adresi geçersiz.',
        'user-not-found' || 'wrong-password' || 'invalid-credential' => 'E-posta ya da şifre hatalı.',
        'email-already-in-use' || 'credential-already-in-use' => 'Bu e-posta zaten kullanılıyor; giriş yapmayı deneyin.',
        'weak-password' => 'Şifre en az 6 karakter olmalı.',
        'network-request-failed' => 'Bağlantı yok; tekrar deneyin.',
        _ => 'Giriş yapılamadı (${e.code}).',
      });
    }
  }
}
