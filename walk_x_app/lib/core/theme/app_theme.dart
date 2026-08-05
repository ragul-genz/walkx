import 'package:flutter/material.dart';

class AppTheme {
  // Gen Z Neural-X Brand Colors
  static const Color primaryColor = Color(0xFF3F48CC); // Vibrant Purplish-Blue
  static const Color primaryDark = Color(0xFF2C328E);
  static const Color secondaryColor = Color(0xFF000000); // True Black
  static const Color scaffoldBackground = Color(0xFF000000); // True Black
  static const Color accentColor = Color(0xFF6366F1); // Lighter Indigo
  static const Color surfaceColor = Color(0xFF09090B); // Very Dark Gray
  static const Color textPrimary = Colors.white;
  static const Color textSecondary = Color(0xFFA1A1AA); // Zinc 400

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: scaffoldBackground,
      primaryColor: primaryColor,
      colorScheme: const ColorScheme.dark(
        primary: primaryColor,
        secondary: accentColor,
        surface: surfaceColor,
        background: scaffoldBackground,
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
        selectedItemColor: accentColor,
        unselectedItemColor: textSecondary,
        type: BottomNavigationBarType.fixed,
        elevation: 20,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryColor,
          foregroundColor: Colors.white,
          elevation: 8,
          shadowColor: primaryColor.withOpacity(0.5),
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
