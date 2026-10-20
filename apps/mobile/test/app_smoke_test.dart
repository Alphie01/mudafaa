import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mudafaa/app/app.dart';

void main() {
  testWidgets('shows the title on the design background', (tester) async {
    await tester.pumpWidget(const MudafaaApp());

    expect(find.text('MÜDAFAA'), findsOneWidget);
    final scaffold = tester.widget<Scaffold>(find.byType(Scaffold));
    expect(scaffold.backgroundColor, const Color(0xFF1D1733));
  });

  testWidgets('title uses Pixelify Sans bold 62 in gold', (tester) async {
    await tester.pumpWidget(const MudafaaApp());

    final style = tester.widget<Text>(find.text('MÜDAFAA')).style;
    expect(style?.fontFamily, 'PixelifySans');
    expect(style?.fontWeight, FontWeight.w700);
    expect(style?.fontSize, 62);
    expect(style?.color, const Color(0xFFE8B13C));
  });
}
