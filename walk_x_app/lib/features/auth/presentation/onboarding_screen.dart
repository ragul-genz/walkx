import 'package:flutter/material.dart';
import 'dart:ui';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/theme/app_theme.dart';

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFF09090B), // Very Dark Gray
              Color(0xFF000000), // True Black
            ],
          ),
        ),
        child: SafeArea(
          child: Stack(
            children: [
              // Background Glow
              Positioned(
                top: -50,
                right: -50,
                child: Container(
                  width: 300,
                  height: 300,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppTheme.primaryColor.withOpacity(0.3),
                    boxShadow: [
                      BoxShadow(
                        color: AppTheme.primaryColor.withOpacity(0.4),
                        blurRadius: 100,
                        spreadRadius: 50,
                      )
                    ],
                  ),
                ).animate(onPlay: (controller) => controller.repeat(reverse: true)).scale(duration: 3.seconds, begin: const Offset(0.9, 0.9), end: const Offset(1.1, 1.1)),
              ),
              Positioned(
                bottom: 100,
                left: -50,
                child: Container(
                  width: 250,
                  height: 250,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppTheme.accentColor.withOpacity(0.15),
                    boxShadow: [
                      BoxShadow(
                        color: AppTheme.accentColor.withOpacity(0.2),
                        blurRadius: 100,
                        spreadRadius: 50,
                      )
                    ],
                  ),
                ).animate(onPlay: (controller) => controller.repeat(reverse: true)).scale(duration: 2.seconds, begin: const Offset(1.0, 1.0), end: const Offset(1.2, 1.2)),
              ),

              // Content
              Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Spacer(),
                    
                    // Logo
                    Center(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(32),
                        child: Image.asset(
                          'assets/images/logo.png',
                          width: 120,
                          height: 120,
                          fit: BoxFit.cover,
                        ),
                      ),
                    ).animate().fade(duration: 800.ms).scale(curve: Curves.easeOutBack),
                    const SizedBox(height: 50),
                    
                    Text(
                      'Every Step\nCounts.',
                      style: Theme.of(context).textTheme.displaySmall?.copyWith(
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                            height: 1.1,
                            letterSpacing: -1.0,
                          ),
                      textAlign: TextAlign.center,
                    ).animate().fade(delay: 300.ms, duration: 600.ms).slideY(begin: 0.2),
                    const SizedBox(height: 20),
                    Text(
                      'Build a daily walking habit.\nGet rewarded for your consistency.',
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            color: Colors.white70,
                            height: 1.5,
                            letterSpacing: 0.5,
                          ),
                      textAlign: TextAlign.center,
                    ).animate().fade(delay: 500.ms, duration: 600.ms).slideY(begin: 0.2),
                    const Spacer(),
                    
                    // Premium Button
                    Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: AppTheme.primaryColor.withOpacity(0.4),
                            blurRadius: 20,
                            offset: const Offset(0, 10),
                          ),
                        ],
                      ),
                      child: ElevatedButton(
                        onPressed: () {
                          context.go('/login');
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.primaryColor,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 20),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          elevation: 0,
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              'Get Started',
                              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, letterSpacing: 1.2),
                            ),
                            SizedBox(width: 12),
                            Icon(Icons.arrow_forward_rounded),
                          ],
                        ),
                      ),
                    ).animate().fade(delay: 700.ms).slideY(begin: 0.5, curve: Curves.easeOutBack),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
