import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';

/// The KYW brand logo — rendered as a RichText widget.
/// The "Y" is always rendered in [AppColors.primary] (pink).
class KywLogo extends StatelessWidget {
  final double fontSize;
  final Color? kColor;
  final Color? wColor;

  const KywLogo({
    super.key,
    this.fontSize = 36,
    this.kColor,
    this.wColor,
  });

  @override
  Widget build(BuildContext context) {
    final letterColor = kColor ?? Theme.of(context).colorScheme.onSurface;
    final style = GoogleFonts.spaceGrotesk(
      fontSize: fontSize,
      fontWeight: FontWeight.w800,
      letterSpacing: -1,
      height: 1,
    );

    return RichText(
      text: TextSpan(
        style: style,
        children: [
          TextSpan(text: 'K', style: TextStyle(color: letterColor)),
          const TextSpan(
            text: 'Y',
            style: TextStyle(color: AppColors.primary),
          ),
          TextSpan(text: 'W', style: TextStyle(color: wColor ?? letterColor)),
        ],
      ),
    );
  }
}
