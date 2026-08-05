import 'package:flutter/material.dart';
import 'dart:ui';
import '../../../core/theme/app_theme.dart';

class AboutUsScreen extends StatelessWidget {
  const AboutUsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: const Text('ABOUT US'),
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topRight,
            end: Alignment.bottomLeft,
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
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(24),
                  child: BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                    child: Container(
                      padding: const EdgeInsets.all(32),
                      decoration: BoxDecoration(
                        color: AppTheme.surfaceColor.withOpacity(0.4),
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: Colors.white.withOpacity(0.1)),
                      ),
                      child: Column(
                        children: [
                          const Icon(Icons.directions_walk, size: 80, color: AppTheme.accentColor),
                          const SizedBox(height: 24),
                          const Text(
                            'WalkX was created with one simple mission:',
                            textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 16),
                          const Text(
                            'To encourage people to walk every day and live healthier lives.',
                            textAlign: TextAlign.center,
                            style: TextStyle(color: AppTheme.accentColor, fontSize: 22, fontWeight: FontWeight.w900),
                          ),
                          const SizedBox(height: 24),
                          Text(
                            'In today\'s digital world, many people spend hours sitting and rarely make time for physical activity. WalkX motivates users to build a consistent walking habit by offering small rewards for every milestone they achieve.',
                            textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 15, height: 1.5),
                          ),
                          const SizedBox(height: 24),
                          Text(
                            'Our goal is not to pay people to walk. Our goal is to inspire healthier lifestyles through positive motivation.',
                            textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 15, height: 1.5, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 24),
                          const Text(
                            'Every reward is a symbol of appreciation for choosing health.',
                            textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.white, fontSize: 16, fontStyle: FontStyle.italic),
                          ),
                          const SizedBox(height: 40),
                          const Text(
                            'Walk More.\nLive Better.',
                            textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w900, letterSpacing: 1.2),
                          ),
                          const SizedBox(height: 40),
                          Text(
                            'POWERED BY GEN Z NEURAL-X',
                            textAlign: TextAlign.center,
                            style: TextStyle(color: AppTheme.textSecondary.withOpacity(0.5), fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 2.0),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 40),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
