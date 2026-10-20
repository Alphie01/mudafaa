import 'package:flutter/material.dart';

import '../../../core/config.dart';
import '../../../design_system/tokens/px_colors.dart';
import '../../../design_system/tokens/px_text.dart';
import '../common.dart';

/// Sahne görseli (sahne birimiyle ölçeklenir); bulunan nesne çerçeveleri ve isteğe bağlı dokunma.
class SceneImage extends StatelessWidget {
  const SceneImage({super.key, required this.scene, this.markers = const [], this.found = const [], this.onTap, this.pending});
  final Map<String, dynamic> scene;
  final List<Map<String, dynamic>> markers;
  final List<Map<String, dynamic>> found;
  final void Function(int x, int y)? onTap;
  final Offset? pending;

  @override
  Widget build(BuildContext context) {
    final w = (scene['width'] as num).toDouble();
    final h = (scene['height'] as num).toDouble();
    final url = scene['imageUrl'] as String;
    final src = url.startsWith('http') ? url : '${AppConfig.apiUrl}$url';
    return AspectRatio(
      aspectRatio: w / h,
      child: LayoutBuilder(builder: (ctx, c) {
        final k = c.maxWidth / w;
        Widget rect(Map<String, dynamic> r, Color color, String? label) => Positioned(
              left: (r['x'] as num) * k,
              top: (r['y'] as num) * k,
              width: (r['w'] as num) * k,
              height: (r['h'] as num) * k,
              child: Container(
                decoration: BoxDecoration(border: Border.all(color: color, width: 3)),
                alignment: Alignment.topLeft,
                child: label == null ? null : Container(color: color, padding: const EdgeInsets.symmetric(horizontal: 3), child: Text(label, style: PxText.pixel(9, color: PxColors.ink))),
              ),
            );
        return GestureDetector(
          onTapUp: onTap == null ? null : (d) => onTap!((d.localPosition.dx / k).floor().clamp(0, w.toInt() - 1), (d.localPosition.dy / k).floor().clamp(0, h.toInt() - 1)),
          child: Stack(children: [
            Positioned.fill(child: Image.network(src, fit: BoxFit.fill, filterQuality: FilterQuality.none, errorBuilder: (_, _, _) => Container(color: PxColors.panel))),
            for (final mk in markers) rect(m(mk['rect']), mk['state'] == 'EXAMINED' ? PxColors.greenHi : PxColors.gold, mk['label'] as String?),
            for (final f in found) rect(m(f['rect']), PxColors.greenHi, f['label'] as String?),
            if (pending != null) Positioned(left: pending!.dx * k - 8, top: pending!.dy * k - 8, child: Container(width: 16, height: 16, decoration: BoxDecoration(border: Border.all(color: PxColors.white, width: 3)))),
          ]),
        );
      }),
    );
  }
}
