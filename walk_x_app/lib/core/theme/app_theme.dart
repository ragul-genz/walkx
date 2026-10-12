import 'package:flutter/material.dart';

class AppTheme {
  // WalkX Signature Logo Palette (Obsidian, Neon Violet & Electric Royal Blue)
  static const Color primaryColor = Color(0xFF6366F1); // Electric Indigo
  static const Color primaryDark = Color(0xFF4338CA);
  static const Color violetAccent = Color(0xFFA855F7); // Neon Purple / Violet from Logo
  static const Color electricBlue = Color(0xFF3B82F6); // Electric Blue from Logo
  static const Color cyanAccent = Color(0xFF38BDF8); // Bright Cyan
  static const Color accentColor = violetAccent; // Compatibility alias
  static const Color secondaryColor = Color(0xFF000000); // True Pitch Black
  static const Color scaffoldBackground = Color(0xFF09090E); // Deep Obsidian
  static const Color surfaceColor = Color(0xFF13131A); // Glassy Surface
  static const Color surfaceLight = Color(0xFF1A1A24); // Elevated Surface
  static const Color cardBorder = Color(0xFF242435); // Border subtle
  
  static const Color textPrimary = Colors.white;
  static const Color textSecondary = Color(0xFF94A3B8); // Slate 400
  static const Color textMuted = Color(0xFF64748B); // Slate 500

  // WalkX Logo Signature Gradients
  static const LinearGradient logoGradient = LinearGradient(
    colors: [violetAccent, primaryColor, electricBlue],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient violetBlueGradient = LinearGradient(
    colors: [Color(0xFFC084FC), Color(0xFFA855F7), Color(0xFF3B82F6)],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );

  static const LinearGradient cardGlowGradient = LinearGradient(
    colors: [Color(0x22A855F7), Color(0x113B82F6), Colors.transparent],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: scaffoldBackground,
      primaryColor: primaryColor,
      colorScheme: const ColorScheme.dark(
        primary: primaryColor,
        secondary: violetAccent,
        surface: surfaceColor,
      ),
      fontFamily: 'Inter',
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        iconTheme: IconThemeData(color: textPrimary),
        titleTextStyle: TextStyle(
          color: textPrimary,
          fontSize: 20,
          fontWeight: FontWeight.w700,
          letterSpacing: 1.2,
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: surfaceColor,
        selectedItemColor: violetAccent,
        unselectedItemColor: textSecondary,
        type: BottomNavigationBarType.fixed,
        elevation: 20,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryColor,
          foregroundColor: Colors.white,
          elevation: 8,
          shadowColor: violetAccent.withOpacity(0.4),
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
