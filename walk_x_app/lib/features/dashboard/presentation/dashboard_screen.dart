import 'package:flutter/material.dart';
import 'dart:ui';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/theme/app_theme.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: const Text('WALKX').animate().fade(duration: 600.ms).slideY(begin: -0.5),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            decoration: BoxDecoration(
              color: AppTheme.surfaceColor.withOpacity(0.5),
              shape: BoxShape.circle,
            ),
            child: IconButton(
              icon: const Icon(Icons.notifications_outlined, color: AppTheme.accentColor),
              onPressed: () {},
            ),
          ).animate().fade(delay: 200.ms).scale(),
        ],
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF09090B),
              Color(0xFF000000),
            ],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Good Morning,',
                  style: TextStyle(fontSize: 16, color: AppTheme.textSecondary, fontWeight: FontWeight.w500),
                ).animate().fade(duration: 500.ms).slideX(begin: -0.1),
                const SizedBox(height: 4),
                const Text(
                  'Walker ⚡',
                  style: TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: 0.5),
                ).animate().fade(delay: 200.ms, duration: 500.ms).slideX(begin: -0.1),
                const SizedBox(height: 40),

                // Glassmorphism Step Circle
                Center(
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      // Outer glow
                      Container(
                        width: 280,
                        height: 280,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: AppTheme.accentColor.withOpacity(0.15),
                              blurRadius: 40,
                              spreadRadius: 10,
                            ),
                          ],
                        ),
                      ),
                      SizedBox(
                        width: 260,
                        height: 260,
                        child: TweenAnimationBuilder<double>(
                          tween: Tween<double>(begin: 0.0, end: 0.65),
                          duration: const Duration(seconds: 2),
                          curve: Curves.easeOutCubic,
                          builder: (context, value, child) {
                            return CircularProgressIndicator(
                              value: value,
                              strokeWidth: 24,
                              backgroundColor: AppTheme.surfaceColor,
                              valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.accentColor),
                              strokeCap: StrokeCap.round,
                            );
                          },
                        ),
                      ),
                      Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.directions_walk, size: 36, color: AppTheme.accentColor),
                          const SizedBox(height: 8),
                          const Text(
                            '3,250',
                            style: TextStyle(
                              fontSize: 54, 
                              fontWeight: FontWeight.w900, 
                              color: Colors.white, 
                              height: 1.0,
                              letterSpacing: -1.5,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '/ 5,000 STEPS',
                            style: TextStyle(
                              fontSize: 14, 
                              color: AppTheme.accentColor.withOpacity(0.8), 
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1.2,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ).animate().fade(delay: 400.ms).scale(duration: 800.ms, curve: Curves.easeOutBack),
                const SizedBox(height: 50),

                // Stats Glass Cards
                Row(
                  children: [
                    Expanded(child: _buildGlassStatCard(Icons.local_fire_department, '240', 'KCAL', const Color(0xFFF97316))),
                    const SizedBox(width: 16),
                    Expanded(child: _buildGlassStatCard(Icons.timer, '45', 'MINS', const Color(0xFF3B82F6))),
                    const SizedBox(width: 16),
                    Expanded(child: _buildGlassStatCard(Icons.map, '2.1', 'KM', const Color(0xFFA855F7))),
                  ],
                ).animate().fade(delay: 600.ms).slideY(begin: 0.2),
                const SizedBox(height: 32),

                // Streak Card
                ClipRRect(
                  borderRadius: BorderRadius.circular(24),
                  child: BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                    child: Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: AppTheme.surfaceColor.withOpacity(0.4),
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: Colors.white.withOpacity(0.1)),
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: const Color(0xFFEAB308).withOpacity(0.2),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.local_fire_department, color: Color(0xFFEAB308), size: 32).animate(onPlay: (controller) => controller.repeat(reverse: true)).scale(begin: const Offset(1, 1), end: const Offset(1.2, 1.2), duration: 800.ms),
                          ),
                          const SizedBox(width: 20),
                          const Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  '3 Day Streak!',
                                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white),
                                ),
                                SizedBox(height: 4),
                                Text(
                                  'You are on fire. Keep it up!',
                                  style: TextStyle(fontSize: 14, color: AppTheme.textSecondary),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ).animate().fade(delay: 800.ms).slideY(begin: 0.2),
                const SizedBox(height: 30),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildGlassStatCard(IconData icon, String value, String unit, Color accent) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 20),
          decoration: BoxDecoration(
            color: AppTheme.surfaceColor.withOpacity(0.4),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: Colors.white.withOpacity(0.05)),
          ),
          child: Column(
            children: [
              Icon(icon, color: accent, size: 28),
              const SizedBox(height: 12),
              Text(
                value,
                style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: Colors.white),
              ),
              const SizedBox(height: 2),
              Text(
                unit,
                style: TextStyle(fontSize: 12, color: accent.withOpacity(0.8), fontWeight: FontWeight.bold, letterSpacing: 1.0),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
