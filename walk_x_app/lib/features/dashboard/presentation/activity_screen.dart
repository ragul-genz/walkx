import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';

class ActivityScreen extends StatefulWidget {
  const ActivityScreen({super.key});

  @override
  State<ActivityScreen> createState() => _ActivityScreenState();
}

class _ActivityScreenState extends State<ActivityScreen> {
  int _selectedTab = 1; // 0: Day, 1: Week, 2: Month

  final List<Map<String, dynamic>> _weeklyBars = [
    {'day': '12 AM', 'val': 0.15, 'height': 24.0, 'active': false},
    {'day': '3 AM', 'val': 0.05, 'height': 12.0, 'active': false},
    {'day': '6 AM', 'val': 0.55, 'height': 65.0, 'active': false},
    {'day': '9 AM', 'val': 0.85, 'height': 95.0, 'active': true},
    {'day': '12 PM', 'val': 0.40, 'height': 48.0, 'active': false},
    {'day': '3 PM', 'val': 0.70, 'height': 80.0, 'active': false},
    {'day': '6 PM', 'val': 1.00, 'height': 110.0, 'active': true},
    {'day': '9 PM', 'val': 0.60, 'height': 70.0, 'active': false},
  ];

  final List<Map<String, dynamic>> _history = [
    {
      'title': 'Today',
      'steps': '6,420 steps',
      'dist': '4.8 km',
      'cal': '285 kcal',
      'time': '48 min',
      'completed': false,
    },
    {
      'title': 'Yesterday',
      'steps': '8,120 steps',
      'dist': '6.2 km',
      'cal': '390 kcal',
      'time': '1h 10m',
      'completed': false,
    },
    {
      'title': '08 Oct 2026',
      'steps': '10,400 steps',
      'dist': '7.8 km',
      'cal': '510 kcal',
      'time': '1h 28m',
      'completed': true, // Goal reached
    },
    {
      'title': '07 Oct 2026',
      'steps': '9,150 steps',
      'dist': '6.9 km',
      'cal': '430 kcal',
      'time': '1h 15m',
      'completed': false,
    },
    {
      'title': '06 Oct 2026',
      'steps': '11,200 steps',
      'dist': '8.4 km',
      'cal': '560 kcal',
      'time': '1h 35m',
      'completed': true,
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
                      children: [
                        const Text(
                          'Activity',
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                            letterSpacing: -0.5,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppTheme.surfaceColor,
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.white.withOpacity(0.08)),
                          ),
                          child: const Icon(Icons.calendar_today_rounded, color: AppTheme.cyanAccent, size: 18),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Day / Week / Month Tab Switcher (matches Image 1)
                    Container(
                      padding: const EdgeInsets.all(4),
                      decoration: BoxDecoration(
                        color: AppTheme.surfaceColor.withOpacity(0.8),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.white.withOpacity(0.05)),
                      ),
                      child: Row(
                        children: [
                          _buildFilterTab(0, 'Day'),
                          _buildFilterTab(1, 'Week'),
                          _buildFilterTab(2, 'Month'),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Today Steps Summary Card
                    Container(
                      padding: const EdgeInsets.all(22),
                      decoration: BoxDecoration(
                        color: AppTheme.surfaceColor.withOpacity(0.9),
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: Colors.white.withOpacity(0.07)),
                        boxShadow: [
                          BoxShadow(
                            color: AppTheme.violetAccent.withOpacity(0.12),
                            blurRadius: 20,
                            offset: const Offset(0, 6),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                'Today',
                                style: TextStyle(fontSize: 14, color: AppTheme.textSecondary, fontWeight: FontWeight.w600),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: AppTheme.cyanAccent.withOpacity(0.15),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Text(
                                  '64% of 10,000',
                                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.cyanAccent),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.baseline,
                            textBaseline: TextBaseline.alphabetic,
                            children: const [
                              Text(
                                '6,420',
                                style: TextStyle(fontSize: 36, fontWeight: FontWeight.w900, color: Colors.white),
                              ),
                              SizedBox(width: 8),
                              Text(
                                'steps',
                                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: AppTheme.textSecondary),
                              ),
                            ],
                          ),
                          const SizedBox(height: 14),
                          ClipRRect(
                            borderRadius: BorderRadius.circular(10),
                            child: Container(
                              height: 8,
                              color: const Color(0xFF1E1E2C),
                              child: FractionallySizedBox(
                                alignment: Alignment.centerLeft,
                                widthFactor: 0.64,
                                child: Container(
                                  decoration: const BoxDecoration(
                                    gradient: AppTheme.logoGradient,
                                  ),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 24),

                          // Activity Bar Chart
                          SizedBox(
                            height: 140,
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              mainAxisAlignment: MainAxisAlignment.spaceAround,
                              children: _weeklyBars.map((bar) {
                                final isAct = bar['active'] as bool;
                                final height = bar['height'] as double;
                                return Column(
                                  mainAxisAlignment: MainAxisAlignment.end,
                                  children: [
                                    AnimatedContainer(
                                      duration: const Duration(milliseconds: 500),
                                      width: 18,
                                      height: height,
                                      decoration: BoxDecoration(
                                        gradient: isAct
                                            ? AppTheme.logoGradient
                                            : const LinearGradient(
                                                colors: [Color(0xFF2C2C40), Color(0xFF1E1E2C)],
                                                begin: Alignment.topCenter,
                                                end: Alignment.bottomCenter,
                                              ),
                                        borderRadius: BorderRadius.circular(6),
                                        boxShadow: isAct
                                            ? [
                                                BoxShadow(
                                                  color: AppTheme.violetAccent.withOpacity(0.4),
                                                  blurRadius: 8,
                                                ),
                                              ]
                                            : null,
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      bar['day'] as String,
                                      style: TextStyle(
                                        fontSize: 10,
                                        fontWeight: isAct ? FontWeight.bold : FontWeight.w500,
                                        color: isAct ? Colors.white : AppTheme.textMuted,
                                      ),
                                    ),
                                  ],
                                );
                              }).toList(),
                            ),
                          ),
                          const SizedBox(height: 20),

                          // Distance & Calories Row
                          Row(
                            children: [
                              Expanded(
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                  decoration: BoxDecoration(
                                    color: AppTheme.surfaceLight,
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(color: Colors.white.withOpacity(0.04)),
                                  ),
                                  child: Row(
                                    children: const [
                                      Icon(Icons.near_me_rounded, color: AppTheme.cyanAccent, size: 20),
                                      SizedBox(width: 10),
                                      Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text('4.8 km', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Colors.white)),
                                          Text('Distance', style: TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                  decoration: BoxDecoration(
                                    color: AppTheme.surfaceLight,
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(color: Colors.white.withOpacity(0.04)),
                                  ),
                                  child: Row(
                                    children: const [
                                      Icon(Icons.local_fire_department_rounded, color: Color(0xFFEC4899), size: 20),
                                      SizedBox(width: 10),
                                      Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text('285 kcal', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Colors.white)),
                                          Text('Calories', style: TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 28),

                    // Walking History Section
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: const [
                        Text(
                          'Walking History',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white),
                        ),
                        Text(
                          'See All',
                          style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppTheme.cyanAccent),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),

                    ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: _history.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 12),
                      itemBuilder: (context, index) {
                        final item = _history[index];
                        final isCompleted = item['completed'] as bool;
                        return Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: AppTheme.surfaceColor.withOpacity(0.8),
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(
                              color: isCompleted ? AppTheme.violetAccent.withOpacity(0.3) : Colors.white.withOpacity(0.04),
                            ),
                          ),
                          child: Row(
                            children: [
                              Container(
                                width: 44,
                                height: 44,
                                decoration: BoxDecoration(
                                  gradient: isCompleted ? AppTheme.logoGradient : null,
                                  color: isCompleted ? null : const Color(0xFF1E1E2C),
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(
                                  isCompleted ? Icons.emoji_events_rounded : Icons.directions_walk_rounded,
                                  color: isCompleted ? Colors.white : AppTheme.cyanAccent,
                                  size: 22,
                                ),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Text(
                                          item['title'] as String,
                                          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Colors.white),
                                        ),
                                        if (isCompleted) ...[
                                          const SizedBox(width: 8),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                            decoration: BoxDecoration(
                                              color: AppTheme.violetAccent.withOpacity(0.2),
                                              borderRadius: BorderRadius.circular(8),
                                            ),
                                            child: const Text(
                                              'GOAL HIT',
                                              style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: AppTheme.cyanAccent),
                                            ),
                                          ),
                                        ],
                                      ],
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      '${item['dist']} • ${item['cal']} • ${item['time']}',
                                      style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                                    ),
                                  ],
                                ),
                              ),
                              Text(
                                item['steps'] as String,
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w800,
                                  color: isCompleted ? AppTheme.cyanAccent : Colors.white,
                                ),
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

  Widget _buildFilterTab(int index, String label) {
    final isSelected = _selectedTab == index;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _selectedTab = index),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 10),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            gradient: isSelected ? AppTheme.logoGradient : null,
            color: isSelected ? null : Colors.transparent,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(
            label,
            style: TextStyle(
              fontSize: 13,
              fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
              color: isSelected ? Colors.white : AppTheme.textSecondary,
            ),
          ),
        ),
      ),
    );
  }
}
