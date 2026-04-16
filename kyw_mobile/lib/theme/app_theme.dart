import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

// ─────────────────────────────────────────────────────────────────────────────
// Color Palettes
// ─────────────────────────────────────────────────────────────────────────────

class AppColors {
  // Phase Colors (same in both themes)
  static const Color phaseMenstrual = Color(0xFFEF4B4B);
  static const Color phaseFollicular = Color(0xFF2B9EE0);
  static const Color phaseOvulation = Color(0xFFF7BD11);
  static const Color phaseLuteal = Color(0xFF9761DE);
  static const Color phasePms = Color(0xFFCA4EE0);

  // Brand Colors (same in both themes)
  static const Color primary = Color(0xFFED4187);
  static const Color primarySubtle = Color(0xFFFDEAF2);
  static const Color secondary = Color(0xFF249EE0);
  static const Color accent = Color(0xFF8F51D6);

  // ── Light Mode ────────────────────────────────────────────────────────────
  static const Color bg = Color(0xFFF4F5F8);
  static const Color bgSecondary = Color(0xFFEBEDF2);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surface2 = Color(0xFFF1F2F6);
  static const Color border = Color(0xFFDEE1E8);
  static const Color borderStrong = Color(0xFFBFC4D1);
  static const Color text = Color(0xFF12141A);
  static const Color textSecondary = Color(0xFF535865);
  static const Color muted = Color(0xFF868C9E);
}

class DarkColors {
  // Surfaces
  static const Color bg = Color(0xFF0D0E14);
  static const Color bgSecondary = Color(0xFF13151E);
  static const Color surface = Color(0xFF1A1C27);
  static const Color surface2 = Color(0xFF1F2130);
  static const Color border = Color(0xFF2A2D3E);
  static const Color borderStrong = Color(0xFF3A3D52);

  // Typography
  static const Color text = Color(0xFFF0F1F6);
  static const Color textSecondary = Color(0xFF9BA3B8);
  static const Color muted = Color(0xFF5A6080);

  // Brand subtle (darker for dark mode)
  static const Color primarySubtle = Color(0xFF2A0E1A);
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared Text Styles (font + weight only; colors injected per theme)
// ─────────────────────────────────────────────────────────────────────────────

TextTheme _buildTextTheme(Color textColor, Color textSecondary) {
  return TextTheme(
    displayLarge: GoogleFonts.spaceGrotesk(
      fontSize: 32,
      fontWeight: FontWeight.w700,
      color: textColor,
      letterSpacing: -1,
    ),
    displayMedium: GoogleFonts.spaceGrotesk(
      fontSize: 24,
      fontWeight: FontWeight.w700,
      color: textColor,
      letterSpacing: -0.5,
    ),
    titleLarge: GoogleFonts.spaceGrotesk(
      fontSize: 20,
      fontWeight: FontWeight.w700,
      color: textColor,
    ),
    bodyLarge: GoogleFonts.dmSans(
      fontSize: 16,
      fontWeight: FontWeight.w400,
      color: textColor,
    ),
    bodyMedium: GoogleFonts.dmSans(
      fontSize: 14,
      fontWeight: FontWeight.w400,
      color: textSecondary,
    ),
    labelLarge: GoogleFonts.spaceGrotesk(
      fontSize: 14,
      fontWeight: FontWeight.w600,
      color: Colors.white,
    ),
  );
}

ButtonStyle _elevatedButtonStyle() {
  return ElevatedButton.styleFrom(
    backgroundColor: AppColors.primary,
    foregroundColor: Colors.white,
    elevation: 0,
    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999)),
    textStyle: GoogleFonts.spaceGrotesk(fontSize: 15, fontWeight: FontWeight.w600),
  );
}

ButtonStyle _outlinedButtonStyle(Color borderColor, Color textColor) {
  return OutlinedButton.styleFrom(
    foregroundColor: textColor,
    side: BorderSide(color: borderColor),
    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999)),
    textStyle: GoogleFonts.spaceGrotesk(fontSize: 15, fontWeight: FontWeight.w600),
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// App Theme
// ─────────────────────────────────────────────────────────────────────────────

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      brightness: Brightness.light,
      primaryColor: AppColors.primary,
      scaffoldBackgroundColor: AppColors.bg,
      colorScheme: const ColorScheme.light(
        primary: AppColors.primary,
        secondary: AppColors.secondary,
        surface: AppColors.surface,
        error: AppColors.phaseMenstrual,
        onPrimary: Colors.white,
        onSurface: AppColors.text,
      ),
      cardTheme: CardThemeData(
        color: AppColors.surface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: AppColors.border),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.surface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: AppColors.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: AppColors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
        ),
        labelStyle: GoogleFonts.dmSans(color: AppColors.textSecondary),
        hintStyle: GoogleFonts.dmSans(color: AppColors.muted),
      ),
      textTheme: _buildTextTheme(AppColors.text, AppColors.textSecondary),
      elevatedButtonTheme: ElevatedButtonThemeData(style: _elevatedButtonStyle()),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: _outlinedButtonStyle(AppColors.border, AppColors.text),
      ),
      dividerColor: AppColors.border,
      dividerTheme: const DividerThemeData(color: AppColors.border, space: 1, thickness: 1),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      primaryColor: AppColors.primary,
      scaffoldBackgroundColor: DarkColors.bg,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.primary,
        secondary: AppColors.secondary,
        surface: DarkColors.surface,
        error: AppColors.phaseMenstrual,
        onPrimary: Colors.white,
        onSurface: DarkColors.text,
      ),
      cardTheme: CardThemeData(
        color: DarkColors.surface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: DarkColors.border),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: DarkColors.surface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: DarkColors.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: DarkColors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
        ),
        labelStyle: GoogleFonts.dmSans(color: DarkColors.textSecondary),
        hintStyle: GoogleFonts.dmSans(color: DarkColors.muted),
      ),
      textTheme: _buildTextTheme(DarkColors.text, DarkColors.textSecondary),
      elevatedButtonTheme: ElevatedButtonThemeData(style: _elevatedButtonStyle()),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: _outlinedButtonStyle(DarkColors.border, DarkColors.text),
      ),
      dividerColor: DarkColors.border,
      dividerTheme: const DividerThemeData(color: DarkColors.border, space: 1, thickness: 1),
    );
  }
}
