import 'package:flutter/material.dart';

import '../../data/auth.dart';
import '../../design_system/tokens/px_colors.dart';
import '../../design_system/tokens/px_text.dart';
import '../../design_system/widgets/px_box.dart';

/// Giriş: e-posta/şifre (kayıt, şifre sıfırlama), Google, Apple (Apple platformları) ve misafir olarak oyna.
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _email = TextEditingController();
  final _password = TextEditingController();
  bool _register = false;
  bool _busy = false;
  String? _error;
  String? _info;

  Future<void> _run(Future<void> Function() action) async {
    setState(() {
      _busy = true;
      _error = null;
      _info = null;
    });
    try {
      await action();
    } catch (e) {
      setState(() => _error = e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  InputDecoration _field(String label) => InputDecoration(
        labelText: label,
        labelStyle: PxText.pixel(12, weight: FontWeight.w600, color: PxColors.muted),
        filled: true,
        fillColor: PxColors.panel,
        enabledBorder: const OutlineInputBorder(borderRadius: BorderRadius.zero, borderSide: BorderSide(color: PxColors.ink, width: 3)),
        focusedBorder: const OutlineInputBorder(borderRadius: BorderRadius.zero, borderSide: BorderSide(color: PxColors.gold, width: 3)),
      );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 40, 20, 26),
          children: [
            Text('BİR AVUKATIN DAVA DEFTERİ', textAlign: TextAlign.center, style: PxText.eyebrow),
            const SizedBox(height: 8),
            Text('MÜDAFAA', textAlign: TextAlign.center, style: PxText.logo(56)),
            const SizedBox(height: 4),
            Text('Her dosyanın bir hikâyesi var.', textAlign: TextAlign.center, style: PxText.body(22, color: PxColors.muted)),
            const SizedBox(height: 36),
            TextField(controller: _email, keyboardType: TextInputType.emailAddress, style: PxText.body(22), decoration: _field('E-POSTA')),
            const SizedBox(height: 12),
            TextField(controller: _password, obscureText: true, style: PxText.body(22), decoration: _field('ŞİFRE')),
            const SizedBox(height: 18),
            PxButton(
              label: _register ? 'Kayıt ol' : 'Giriş yap',
              onTap: _busy ? null : () => _run(() => _register ? AuthActions.register(_email.text, _password.text) : AuthActions.signIn(_email.text, _password.text)),
            ),
            const SizedBox(height: 12),
            Row(children: [
              Expanded(child: TextButton(onPressed: () => setState(() => _register = !_register), child: Text(_register ? 'Hesabım var' : 'Hesap oluştur', style: PxText.pixel(13, color: PxColors.gold)))),
              Expanded(
                child: TextButton(
                  onPressed: _busy ? null : () => _run(() async {
                        await AuthActions.reset(_email.text);
                        setState(() => _info = 'Şifre sıfırlama bağlantısı gönderildi.');
                      }),
                  child: Text('Şifremi unuttum', style: PxText.pixel(13, color: PxColors.muted)),
                ),
              ),
            ]),
            const SizedBox(height: 18),
            PxButton(label: 'Google ile devam et', tone: PxTone.blue, onTap: _busy ? null : () => _run(AuthActions.google)),
            if (AuthActions.appleAvailable) ...[
              const SizedBox(height: 12),
              PxButton(label: 'Apple ile devam et', tone: PxTone.secondary, onTap: _busy ? null : () => _run(AuthActions.apple)),
            ],
            const SizedBox(height: 12),
            PxButton(label: 'Misafir olarak oyna', tone: PxTone.secondary, onTap: _busy ? null : () => _run(AuthActions.guest)),
            if (_error != null) Padding(padding: const EdgeInsets.only(top: 16), child: Text(_error!, textAlign: TextAlign.center, style: PxText.body(20, color: PxColors.coral))),
            if (_info != null) Padding(padding: const EdgeInsets.only(top: 16), child: Text(_info!, textAlign: TextAlign.center, style: PxText.body(20, color: PxColors.greenHi))),
          ],
        ),
      ),
    );
  }
}
