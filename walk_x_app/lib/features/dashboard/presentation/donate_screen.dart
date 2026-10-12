import 'package:flutter/material.dart';
import 'dart:ui';
import '../../../core/theme/app_theme.dart';

class DonateScreen extends StatefulWidget {
  const DonateScreen({super.key});

  @override
  State<DonateScreen> createState() => _DonateScreenState();
}

class _DonateScreenState extends State<DonateScreen> {
  int _selectedCategory = 0;
  final List<String> _categories = ['All', 'Health', 'Children', 'Elderly', 'Community'];

  final List<Map<String, dynamic>> _causes = [
    {
      'title': "Children's Education",
      'desc': 'Help underprivileged children get quality education, books, and brighter futures.',
      'raised': 5000,
      'goal': 10000,
      'category': 'Children',
      'icon': Icons.school_rounded,
      'accent': AppTheme.cyanAccent,
    },
    {
      'title': 'Healthcare Support',
      'desc': 'Support critical medicines and medical treatments for low-income families.',
      'raised': 3500,
      'goal': 10000,
      'category': 'Health',
      'icon': Icons.medical_services_rounded,
      'accent': const Color(0xFFEC4899),
    },
    {
      'title': 'Elderly Care',
      'desc': 'Provide daily meals, medical checkups, and elder companionship.',
      'raised': 6500,
      'goal': 10000,
      'category': 'Elderly',
      'icon': Icons.elderly_rounded,
      'accent': AppTheme.violetAccent,
    },
    {
      'title': 'Community Health',
      'desc': 'Install clean water filters and organize open-air community health camps.',
      'raised': 4200,
      'goal': 10000,
      'category': 'Community',
      'icon': Icons.volunteer_activism_rounded,
      'accent': AppTheme.electricBlue,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.scaffoldBackground,
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF0F0B1E),
              Color(0xFF09090E),
              Color(0xFF050508),
            ],
          ),
        ),
        child: SafeArea(
          bottom: false,
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.only(left: 20, right: 20, top: 12, bottom: 120),
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 800),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: const [
                        Text(
                          'Donate',
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                            letterSpacing: -0.5,
                          ),
                        ),
                        Icon(Icons.favorite_rounded, color: Color(0xFFEC4899), size: 24),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Heart Banner (matches Image 1)
                    Container(
                      padding: const EdgeInsets.all(22),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF2E1235), Color(0xFF18152B)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: const Color(0xFFEC4899).withOpacity(0.3)),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFFEC4899).withOpacity(0.12),
                            blurRadius: 20,
                            offset: const Offset(0, 6),
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: const Color(0xFFEC4899).withOpacity(0.2),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.volunteer_activism_rounded, color: Color(0xFFEC4899), size: 30),
                          ),
                          const SizedBox(width: 16),
                          const Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Your support creates real change',
                                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Colors.white),
                                ),
                                SizedBox(height: 4),
                                Text(
                                  'Convert your WalkX Coins into life-changing micro donations.',
                                  style: TextStyle(fontSize: 12, color: AppTheme.textSecondary, height: 1.4),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 22),

                    // Category Filter Pills
                    SizedBox(
                      height: 38,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        physics: const BouncingScrollPhysics(),
                        itemCount: _categories.length,
                        separatorBuilder: (_, __) => const SizedBox(width: 8),
                        itemBuilder: (context, index) {
                          final isSel = _selectedCategory == index;
                          return GestureDetector(
                            onTap: () => setState(() => _selectedCategory = index),
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                              decoration: BoxDecoration(
                                gradient: isSel ? AppTheme.logoGradient : null,
                                color: isSel ? null : AppTheme.surfaceColor.withOpacity(0.8),
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                  color: isSel ? Colors.transparent : Colors.white.withOpacity(0.06),
                                ),
                              ),
                              child: Text(
                                _categories[index],
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: isSel ? FontWeight.w800 : FontWeight.w600,
                                  color: isSel ? Colors.white : AppTheme.textSecondary,
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 22),

                    // Causes List
                    ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: _causes.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 16),
                      itemBuilder: (context, index) {
                        final cause = _causes[index];
                        final progress = (cause['raised'] as int) / (cause['goal'] as int);
                        final accent = cause['accent'] as Color;

                        return Container(
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            color: AppTheme.surfaceColor.withOpacity(0.85),
                            borderRadius: BorderRadius.circular(22),
                            border: Border.all(color: Colors.white.withOpacity(0.06)),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.3),
                                blurRadius: 14,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(10),
                                    decoration: BoxDecoration(
                                      color: accent.withOpacity(0.15),
                                      shape: BoxShape.circle,
                                    ),
                                    child: Icon(cause['icon'] as IconData, color: accent, size: 20),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Text(
                                      cause['title'] as String,
                                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Colors.white),
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: accent.withOpacity(0.15),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(
                                      '${(progress * 100).toInt()}% Funded',
                                      style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: accent),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 10),
                              Text(
                                cause['desc'] as String,
                                style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary, height: 1.4),
                              ),
                              const SizedBox(height: 14),

                              // Progress bar
                              ClipRRect(
                                borderRadius: BorderRadius.circular(6),
                                child: Container(
                                  height: 6,
                                  color: const Color(0xFF1E1E2C),
                                  child: FractionallySizedBox(
                                    alignment: Alignment.centerLeft,
                                    widthFactor: progress,
                                    child: Container(
                                      decoration: BoxDecoration(
                                        gradient: LinearGradient(colors: [accent, AppTheme.electricBlue]),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 12),

                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    '₹${cause['raised']} raised of ₹${cause['goal']}',
                                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Colors.white70),
                                  ),
                                  GestureDetector(
                                    onTap: () => _showDonationModal(context, cause),
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                                      decoration: BoxDecoration(
                                        gradient: AppTheme.logoGradient,
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: const Text(
                                        'Donate Now',
                                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: Colors.white),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  void _showDonationModal(BuildContext context, Map<String, dynamic> cause) {
    int selectedAmount = 100;
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
              child: Container(
                padding: const EdgeInsets.all(26),
                decoration: BoxDecoration(
                  color: const Color(0xFF101018).withOpacity(0.96),
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(30)),
                  border: Border.all(color: AppTheme.violetAccent.withOpacity(0.3)),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child: Container(
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    Text(
                      'Donate to ${cause['title']}',
                      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Colors.white),
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Your donation transforms steps into smiles and support.',
                      style: TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                    ),
                    const SizedBox(height: 22),

                    const Text(
                      'Select Amount',
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Colors.white),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [50, 100, 200, 500].map((amt) {
                        final isSel = selectedAmount == amt;
                        return Expanded(
                          child: GestureDetector(
                            onTap: () => setModalState(() => selectedAmount = amt),
                            child: Container(
                              margin: const EdgeInsets.symmetric(horizontal: 4),
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              alignment: Alignment.center,
                              decoration: BoxDecoration(
                                gradient: isSel ? AppTheme.logoGradient : null,
                                color: isSel ? null : AppTheme.surfaceLight,
                                borderRadius: BorderRadius.circular(14),
                                border: Border.all(
                                  color: isSel ? Colors.transparent : Colors.white.withOpacity(0.06),
                                ),
                              ),
                              child: Text(
                                '₹$amt',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w900,
                                  color: isSel ? Colors.white : AppTheme.textSecondary,
                                ),
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 24),

                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AppTheme.surfaceLight,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: Colors.white.withOpacity(0.04)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Equivalent WalkX Coins:', style: TextStyle(color: AppTheme.textSecondary, fontSize: 13)),
                          Text(
                            '${selectedAmount * 10} Coins',
                            style: const TextStyle(color: AppTheme.cyanAccent, fontWeight: FontWeight.w800, fontSize: 14),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: AppTheme.logoGradient,
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(
                              color: AppTheme.violetAccent.withOpacity(0.35),
                              blurRadius: 14,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.transparent,
                            shadowColor: Colors.transparent,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          ),
                          onPressed: () {
                            Navigator.pop(context);
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('Thank you! Donated ₹$selectedAmount to ${cause['title']} ❤️'),
                                backgroundColor: const Color(0xFF1F1A35),
                              ),
                            );
                          },
                          child: Text(
                            'Donate ₹$selectedAmount Now',
                            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Colors.white),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }
}
