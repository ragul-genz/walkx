import 'package:flutter/material.dart';
import 'dart:math' as math;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../data/step_repository.dart';

class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  bool _showWebLanding = false;
  int _selectedDayIndex = 3;

  final List<Map<String, dynamic>> _weekDays = [
    {'day': 'S', 'date': '21', 'completed': true},
    {'day': 'M', 'date': '22', 'completed': true},
    {'day': 'T', 'date': '23', 'completed': true},
    {'day': 'W', 'date': '24', 'completed': true},
    {'day': 'T', 'date': '25', 'completed': false},
    {'day': 'F', 'date': '26', 'completed': false},
    {'day': 'S', 'date': '27', 'completed': false},
  ];

  @override
  Widget build(BuildContext context) {
    final liveStepsAsync = ref.watch(stepCountProvider);
    final currentSteps = liveStepsAsync.value ?? 6420;

    return Scaffold(
      backgroundColor: AppTheme.scaffoldBackground,
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF130E26), // WalkX Violet ambient top
              Color(0xFF09090E), // Obsidian body
              Color(0xFF050508), // Pitch dark bottom
            ],
            stops: [0.0, 0.45, 1.0],
          ),
        ),
        child: SafeArea(
          bottom: false,
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.only(bottom: 120),
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 1100),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Top App Bar & View Mode Switcher
                    _buildTopBar(context),
                    const SizedBox(height: 16),

                    if (_showWebLanding) ...[
                      // FULL WEB LANDING PAGE (Image 1 Left Side)
                      _buildWebLandingPage(context, currentSteps),
                    ] else ...[
                      // COMPLETE MOBILE / DESKTOP HOME APP EXPERIENCE (Image 1 Center/Right)
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            _buildAppHeader(context),
                            const SizedBox(height: 20),
                            _buildHeroScenicStepCard(currentSteps),
                            const SizedBox(height: 18),
                            _buildPointsAndStreakRow(context),
                            const SizedBox(height: 22),
                            _buildWeeklyDateStrip(),
                            const SizedBox(height: 24),
                            _buildBentoGrid(currentSteps),
                            const SizedBox(height: 28),
                            _buildQuickActionButtons(context),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  // ==========================================
  // TOP BAR WITH VIEW SWITCHER
  // ==========================================
  Widget _buildTopBar(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: Image.asset(
                  'assets/images/logo.png',
                  width: 34,
                  height: 34,
                  fit: BoxFit.cover,
                ),
              ),
              const SizedBox(width: 10),
              ShaderMask(
                shaderCallback: (b) => AppTheme.logoGradient.createShader(b),
                child: const Text(
                  'WalkX',
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: -0.5),
                ),
              ),
            ],
          ),
          // View Switcher: [📱 App View] [🌐 Landing View]
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: AppTheme.surfaceColor.withOpacity(0.85),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.white.withOpacity(0.06)),
            ),
            child: Row(
              children: [
                GestureDetector(
                  onTap: () => setState(() => _showWebLanding = false),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      gradient: !_showWebLanding ? AppTheme.logoGradient : null,
                      color: !_showWebLanding ? null : Colors.transparent,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.phone_android_rounded, color: !_showWebLanding ? Colors.white : AppTheme.textMuted, size: 14),
                        const SizedBox(width: 4),
                        Text(
                          'App View',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: !_showWebLanding ? Colors.white : AppTheme.textMuted,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                GestureDetector(
                  onTap: () => setState(() => _showWebLanding = true),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      gradient: _showWebLanding ? AppTheme.logoGradient : null,
                      color: _showWebLanding ? null : Colors.transparent,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.public_rounded, color: _showWebLanding ? Colors.white : AppTheme.textMuted, size: 14),
                        const SizedBox(width: 4),
                        Text(
                          'Landing Page',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: _showWebLanding ? Colors.white : AppTheme.textMuted,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ==========================================
  // SECTION 1: MOBILE APP EXPERIENCE (Center of Image 1)
  // ==========================================
  Widget _buildAppHeader(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text(
              'Hello, Priya! 👋',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.w900,
                color: Colors.white,
                letterSpacing: -0.5,
              ),
            ),
            SizedBox(height: 4),
            Text(
              'Keep walking towards a healthier you!',
              style: TextStyle(fontSize: 13, color: AppTheme.textSecondary, fontWeight: FontWeight.w500),
            ),
          ],
        ),
        GestureDetector(
          onTap: () => context.push('/profile'),
          child: Container(
            padding: const EdgeInsets.all(2.5),
            decoration: const BoxDecoration(
              gradient: AppTheme.logoGradient,
              shape: BoxShape.circle,
            ),
            child: Container(
              width: 46,
              height: 46,
              decoration: const BoxDecoration(
                color: AppTheme.surfaceColor,
                shape: BoxShape.circle,
                image: DecorationImage(
                  image: AssetImage('assets/images/logo.png'),
                  fit: BoxFit.cover,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  // --- Hero Scenic Nature Card with Step Gauge (Direct match to Image 1) ---
  Widget _buildHeroScenicStepCard(int steps) {
    const int goal = 10000;
    final double progress = (steps / goal).clamp(0.0, 1.0);

    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(28),
        gradient: const LinearGradient(
          colors: [Color(0xFF1E1736), Color(0xFF111428), Color(0xFF0D0F1E)],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
        border: Border.all(color: AppTheme.violetAccent.withOpacity(0.3)),
        boxShadow: [
          BoxShadow(
            color: AppTheme.violetAccent.withOpacity(0.2),
            blurRadius: 24,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Stack(
        children: [
          // Scenic Mountain/Trail Backdrop Silhouette
          Positioned.fill(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(28),
              child: CustomPaint(
                painter: _ScenicBackdropPainter(),
              ),
            ),
          ),

          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 26),
            child: Column(
              children: [
                // Top Tag
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.5),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.white.withOpacity(0.08)),
                      ),
                      child: Row(
                        children: const [
                          Icon(Icons.directions_walk_rounded, color: AppTheme.cyanAccent, size: 14),
                          SizedBox(width: 4),
                          Text('Daily Goal Target', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white)),
                        ],
                      ),
                    ),
                    Text(
                      '${(progress * 100).toInt()}%',
                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: AppTheme.cyanAccent),
                    ),
                  ],
                ),
                const SizedBox(height: 18),

                // Radial Step Circle
                Center(
                  child: SizedBox(
                    width: 170,
                    height: 170,
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        CustomPaint(
                          size: const Size(170, 170),
                          painter: _GradientCircularProgressPainter(
                            progress: progress,
                            strokeWidth: 15,
                            gradientColors: const [
                              AppTheme.violetAccent,
                              AppTheme.primaryColor,
                              AppTheme.cyanAccent,
                            ],
                            backgroundColor: const Color(0x331E1E2C),
                          ),
                        ),
                        Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              _formatNumber(steps),
                              style: const TextStyle(
                                fontSize: 32,
                                fontWeight: FontWeight.w900,
                                color: Colors.white,
                                letterSpacing: -0.5,
                              ),
                            ),
                            const SizedBox(height: 2),
                            const Text(
                              'steps',
                              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Colors.white70),
                            ),
                            const SizedBox(height: 2),
                            const Text(
                              '/ 10,000',
                              style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.textSecondary),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // 3 Metrics Row: 4.8 km | 285 kcal | 48 min
                Row(
                  children: [
                    Expanded(child: _buildMetricCol('4.8 km', 'Distance', Icons.near_me_rounded, AppTheme.cyanAccent)),
                    Container(height: 30, width: 1, color: Colors.white.withOpacity(0.1)),
                    Expanded(child: _buildMetricCol('285 kcal', 'Calories', Icons.local_fire_department_rounded, const Color(0xFFEC4899))),
                    Container(height: 30, width: 1, color: Colors.white.withOpacity(0.1)),
                    Expanded(child: _buildMetricCol('48 min', 'Walking Time', Icons.access_time_rounded, AppTheme.violetAccent)),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetricCol(String value, String label, IconData icon, Color color) {
    return Column(
      children: [
        Icon(icon, color: color, size: 18),
        const SizedBox(height: 6),
        Text(value, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: Colors.white)),
        const SizedBox(height: 2),
        Text(label, style: const TextStyle(fontSize: 10, color: AppTheme.textSecondary, fontWeight: FontWeight.w500)),
      ],
    );
  }

  // --- Points Earned Card & Streak Card (Direct match to Image 1) ---
  Widget _buildPointsAndStreakRow(BuildContext context) {
    return Column(
      children: [
        // Points Earned Card
        Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: AppTheme.surfaceColor.withOpacity(0.9),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: Colors.white.withOpacity(0.06)),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  gradient: AppTheme.logoGradient,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.stars_rounded, color: Colors.white, size: 24),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text('6,420 Points Earned', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Colors.white)),
                    SizedBox(height: 2),
                    Text('≈ ₹6.42 Equivalent Value', style: TextStyle(fontSize: 12, color: AppTheme.cyanAccent, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
              GestureDetector(
                onTap: () => context.push('/wallet'),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: AppTheme.violetAccent.withOpacity(0.18),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppTheme.violetAccent.withOpacity(0.3)),
                  ),
                  child: const Text('Convert', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white)),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),

        // Streak & Next Reward Card
        Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: AppTheme.surfaceColor.withOpacity(0.9),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: Colors.white.withOpacity(0.06)),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF59E0B).withOpacity(0.15),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.local_fire_department_rounded, color: Color(0xFFF59E0B), size: 22),
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text('5 Days', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: Colors.white)),
                      Text('Streak Bonus 🔥', style: TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
                    ],
                  ),
                ],
              ),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppTheme.violetAccent.withOpacity(0.15),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.card_giftcard_rounded, color: AppTheme.violetAccent, size: 22),
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text('Next Reward', style: TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
                      Text('10,000 pts (₹10)', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: Colors.white)),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  // --- Calendar Date Strip ---
  Widget _buildWeeklyDateStrip() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor.withOpacity(0.7),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: Colors.white.withOpacity(0.04)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: List.generate(_weekDays.length, (index) {
          final item = _weekDays[index];
          final isSelected = index == _selectedDayIndex;
          return GestureDetector(
            onTap: () => setState(() => _selectedDayIndex = index),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 250),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                gradient: isSelected ? AppTheme.logoGradient : null,
                color: isSelected ? null : Colors.transparent,
                borderRadius: BorderRadius.circular(18),
                boxShadow: isSelected
                    ? [
                        BoxShadow(
                          color: AppTheme.violetAccent.withOpacity(0.4),
                          blurRadius: 12,
                          offset: const Offset(0, 3),
                        ),
                      ]
                    : null,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    item['day'],
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: isSelected ? Colors.white : AppTheme.textMuted,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    item['date'],
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                      color: isSelected ? Colors.white : AppTheme.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
          );
        }),
      ),
    );
  }

  // --- Bento Grid (Readiness, Sleep, Calories, Protein) ---
  Widget _buildBentoGrid(int steps) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(child: _buildReadinessTile()),
            const SizedBox(width: 14),
            Expanded(child: _buildSleepTile()),
          ],
        ),
        const SizedBox(height: 14),
        Row(
          children: [
            Expanded(child: _buildCaloriesTile()),
            const SizedBox(width: 14),
            Expanded(child: _buildProteinTile()),
          ],
        ),
      ],
    );
  }

  Widget _buildReadinessTile() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor.withOpacity(0.85),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: const [
              Text('Readiness', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Colors.white)),
              Icon(Icons.fitness_center_rounded, color: AppTheme.violetAccent, size: 16),
            ],
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 32,
            child: CustomPaint(painter: _WaveChartPainter()),
          ),
          const SizedBox(height: 10),
          Row(
            children: const [
              Text('92', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white)),
              SizedBox(width: 4),
              Text('/85 (Goal)', style: TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSleepTile() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor.withOpacity(0.85),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: const [
              Text('Sleep', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Colors.white)),
              Icon(Icons.nightlight_round, color: Color(0xFFF59E0B), size: 16),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: const [
              Text('7.4', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white)),
              SizedBox(width: 4),
              Text('hrs / 9hrs', style: TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
            ],
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: Container(
              height: 6,
              color: const Color(0xFF1E1E2C),
              child: FractionallySizedBox(
                alignment: Alignment.centerLeft,
                widthFactor: 0.82,
                child: Container(color: const Color(0xFFF59E0B)),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCaloriesTile() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor.withOpacity(0.85),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: const [
              Text('Calories', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Colors.white)),
              SizedBox(height: 8),
              Text('245', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white)),
              Text('kcal burned', style: TextStyle(fontSize: 10, color: AppTheme.textSecondary)),
            ],
          ),
          const Icon(Icons.local_fire_department_rounded, color: Color(0xFFEC4899), size: 28),
        ],
      ),
    );
  }

  Widget _buildProteinTile() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor.withOpacity(0.85),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: const [
              Text('Protein / Fuel', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Colors.white)),
              SizedBox(height: 8),
              Text('160g', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white)),
              Text('/ 300g target', style: TextStyle(fontSize: 10, color: AppTheme.textSecondary)),
            ],
          ),
          const Icon(Icons.restaurant_rounded, color: AppTheme.cyanAccent, size: 28),
        ],
      ),
    );
  }

  Widget _buildQuickActionButtons(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: GestureDetector(
            onTap: () => context.push('/activity'),
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 14),
              decoration: BoxDecoration(
                gradient: AppTheme.logoGradient,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.violetAccent.withOpacity(0.3),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Icon(Icons.timeline_rounded, color: Colors.white, size: 18),
                  SizedBox(width: 8),
                  Text('View Activity', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: Colors.white)),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: GestureDetector(
            onTap: () => context.push('/donate'),
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 14),
              decoration: BoxDecoration(
                color: AppTheme.surfaceLight,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white.withOpacity(0.06)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Icon(Icons.volunteer_activism_rounded, color: Color(0xFFEC4899), size: 18),
                  SizedBox(width: 8),
                  Text('Donate Steps', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: Colors.white)),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  // ==========================================
  // SECTION 2: WEB LANDING PAGE (Image 1 Left Side)
  // ==========================================
  Widget _buildWebLandingPage(BuildContext context, int steps) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Landing Hero Section (matches Image 1: "Every Step Counts")
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ShaderMask(
                shaderCallback: (b) => AppTheme.logoGradient.createShader(b),
                child: const Text(
                  'Every Step\nCounts.',
                  style: TextStyle(
                    fontSize: 48,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                    height: 1.1,
                    letterSpacing: -1.0,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Walk for your health. Earn rewards. Make a difference.',
                style: TextStyle(fontSize: 17, color: AppTheme.textSecondary, height: 1.4),
              ),
              const SizedBox(height: 28),

              // Action Buttons: "Get Started ->" & "Explore Causes"
              Row(
                children: [
                  Container(
                    height: 48,
                    decoration: BoxDecoration(
                      gradient: AppTheme.logoGradient,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: AppTheme.violetAccent.withOpacity(0.4),
                          blurRadius: 16,
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
                      onPressed: () => setState(() => _showWebLanding = false),
                      child: Row(
                        children: const [
                          Text('Get Started', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                          SizedBox(width: 6),
                          Icon(Icons.arrow_forward_rounded, size: 16),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Container(
                    height: 48,
                    decoration: BoxDecoration(
                      color: AppTheme.surfaceLight,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.white.withOpacity(0.08)),
                    ),
                    child: TextButton(
                      onPressed: () => context.push('/donate'),
                      child: const Text(
                        'Explore Causes',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 14),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 36),

              // 3 Live Impact Badges: 10K+ Walkers | 2M+ Steps | ₹5L+ Donated
              Row(
                children: [
                  Expanded(child: _buildLandingBadge(Icons.group_rounded, '10K+', 'Active Walkers', AppTheme.cyanAccent)),
                  const SizedBox(width: 10),
                  Expanded(child: _buildLandingBadge(Icons.directions_walk_rounded, '2M+', 'Steps Tracked', AppTheme.violetAccent)),
                  const SizedBox(width: 10),
                  Expanded(child: _buildLandingBadge(Icons.currency_rupee_rounded, '₹5L+', 'Donated So Far', const Color(0xFFEC4899))),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 32),

        // Section: "How WalkX Works - Simple steps. Real impact."
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 36),
          color: const Color(0xFF0D0D14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'How WalkX Works',
                style: TextStyle(fontSize: 26, fontWeight: FontWeight.w900, color: Colors.white),
              ),
              const SizedBox(height: 4),
              const Text(
                'Simple steps. Real impact.',
                style: TextStyle(fontSize: 14, color: AppTheme.textSecondary),
              ),
              const SizedBox(height: 24),

              // 4 Step Cards
              _buildStepRow(1, 'Walk', 'Track your steps using Google Fit, Apple Health or built-in pedometer.', Icons.directions_walk_rounded, AppTheme.cyanAccent),
              const SizedBox(height: 16),
              _buildStepRow(2, 'Earn Points', 'Get valuable WalkX Coins for every step and streak milestone.', Icons.stars_rounded, AppTheme.violetAccent),
              const SizedBox(height: 16),
              _buildStepRow(3, 'Redeem', 'Use points for UPI cash withdrawals, discounts, or vouchers.', Icons.redeem_rounded, AppTheme.electricBlue),
              const SizedBox(height: 16),
              _buildStepRow(4, 'Donate', 'Support children, healthcare, and seniors to create a better tomorrow.', Icons.favorite_rounded, const Color(0xFFEC4899)),
            ],
          ),
        ),
        const SizedBox(height: 32),

        // Section: "Featured Causes"
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Featured Causes', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white)),
                  GestureDetector(
                    onTap: () => context.push('/donate'),
                    child: const Text('View All →', style: TextStyle(color: AppTheme.cyanAccent, fontWeight: FontWeight.bold, fontSize: 13)),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              const Text('Your steps can help build a healthier, kinder world.', style: TextStyle(fontSize: 12, color: AppTheme.textSecondary)),
              const SizedBox(height: 18),

              _buildCauseCard("Children's Education", 'Help children get better education and brighter futures.', '₹5,000 / ₹10,000', 0.5, AppTheme.cyanAccent),
              const SizedBox(height: 12),
              _buildCauseCard('Healthcare Support', 'Support critical access to medical care for those in need.', '₹3,500 / ₹10,000', 0.35, const Color(0xFFEC4899)),
              const SizedBox(height: 12),
              _buildCauseCard('Elderly Care', 'Care for seniors and improve their quality of life.', '₹6,500 / ₹10,000', 0.65, AppTheme.violetAccent),
            ],
          ),
        ),
        const SizedBox(height: 36),

        // Section: "Why WalkX?"
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 20),
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF221438), Color(0xFF13172E)],
            ),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: AppTheme.violetAccent.withOpacity(0.3)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Why WalkX?', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Colors.white)),
              const SizedBox(height: 16),
              _buildWhyItem(Icons.favorite_rounded, 'Better Health', 'Stay active, reduce stress, and live longer.', AppTheme.cyanAccent),
              const SizedBox(height: 14),
              _buildWhyItem(Icons.redeem_rounded, 'Earn Rewards', 'Turn your everyday steps into valuable coins.', AppTheme.violetAccent),
              const SizedBox(height: 14),
              _buildWhyItem(Icons.volunteer_activism_rounded, 'Make an Impact', 'Your steps and donations help real people every day.', const Color(0xFFEC4899)),
            ],
          ),
        ),
        const SizedBox(height: 40),

        // Landing Footer
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 20),
          decoration: const BoxDecoration(
            border: Border(top: BorderSide(color: Color(0xFF1A1A28))),
          ),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Image.asset('assets/images/logo.png', width: 28, height: 28),
                  ),
                  const SizedBox(width: 8),
                  const Text('WalkX', style: TextStyle(fontWeight: FontWeight.w900, color: Colors.white, fontSize: 18)),
                ],
              ),
              const SizedBox(height: 6),
              const Text('Walk More. Live Better. Give More.', style: TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
              const SizedBox(height: 14),
              const Text('© 2026 WalkX. All rights reserved. Powered by Gen Z Neural-X.', style: TextStyle(fontSize: 10, color: AppTheme.textMuted)),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildLandingBadge(IconData icon, String num, String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 10),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor.withOpacity(0.9),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(height: 6),
          Text(num, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Colors.white)),
          const SizedBox(height: 2),
          Text(label, style: const TextStyle(fontSize: 9, color: AppTheme.textSecondary, fontWeight: FontWeight.w600), textAlign: TextAlign.center),
        ],
      ),
    );
  }

  Widget _buildStepRow(int number, String title, String desc, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor.withOpacity(0.85),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: Colors.white.withOpacity(0.04)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color.withOpacity(0.18),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 22),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('$number. $title', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Colors.white)),
                const SizedBox(height: 2),
                Text(desc, style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary, height: 1.3)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCauseCard(String title, String desc, String goal, double progress, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor.withOpacity(0.85),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: Colors.white.withOpacity(0.04)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Colors.white)),
              Text(goal, style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: color)),
            ],
          ),
          const SizedBox(height: 6),
          Text(desc, style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
          const SizedBox(height: 10),
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: Container(
              height: 5,
              color: const Color(0xFF1E1E2C),
              child: FractionallySizedBox(
                alignment: Alignment.centerLeft,
                widthFactor: progress,
                child: Container(color: color),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWhyItem(IconData icon, String title, String desc, Color color) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(color: color.withOpacity(0.18), shape: BoxShape.circle),
          child: Icon(icon, color: color, size: 18),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Colors.white)),
              Text(desc, style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
            ],
          ),
        ),
      ],
    );
  }

  String _formatNumber(int number) {
    return number.toString().replaceAllMapped(
          RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
          (Match m) => '${m[1]},',
        );
  }
}

// ==========================================
// CUSTOM PAINTER: Scenic Dusk Trail Silhouette
// ==========================================
class _ScenicBackdropPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // Glowing dusk sky gradient behind mountains
    final skyPaint = Paint()
      ..shader = const RadialGradient(
        center: Alignment(0.0, -0.2),
        radius: 1.0,
        colors: [Color(0x44A855F7), Color(0x223B82F6), Colors.transparent],
      ).createShader(Rect.fromLTWH(0, 0, w, h));
    canvas.drawRect(Rect.fromLTWH(0, 0, w, h), skyPaint);

    // Far mountain layer
    final farMountain = Path();
    farMountain.moveTo(0, h * 0.75);
    farMountain.quadraticBezierTo(w * 0.25, h * 0.55, w * 0.5, h * 0.7);
    farMountain.quadraticBezierTo(w * 0.75, h * 0.5, w, h * 0.72);
    farMountain.lineTo(w, h);
    farMountain.lineTo(0, h);
    farMountain.close();

    canvas.drawPath(
      farMountain,
      Paint()..color = const Color(0xFF140E26).withOpacity(0.7),
    );

    // Foreground mountain trail layer
    final foreMountain = Path();
    foreMountain.moveTo(0, h * 0.85);
    foreMountain.quadraticBezierTo(w * 0.35, h * 0.72, w * 0.65, h * 0.82);
    foreMountain.quadraticBezierTo(w * 0.85, h * 0.75, w, h * 0.88);
    foreMountain.lineTo(w, h);
    foreMountain.lineTo(0, h);
    foreMountain.close();

    canvas.drawPath(
      foreMountain,
      Paint()..color = const Color(0xFF0C091A).withOpacity(0.85),
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// ==========================================
// CUSTOM PAINTER: Smooth Bézier Wave Line
// ==========================================
class _WaveChartPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final path = Path();
    final fillPath = Path();

    final w = size.width;
    final h = size.height;

    path.moveTo(0, h * 0.65);
    path.cubicTo(w * 0.25, h * 0.60, w * 0.35, h * 0.15, w * 0.55, h * 0.40);
    path.cubicTo(w * 0.70, h * 0.60, w * 0.85, h * 0.10, w, h * 0.35);

    fillPath.addPath(path, Offset.zero);
    fillPath.lineTo(w, h);
    fillPath.lineTo(0, h);
    fillPath.close();

    final fillPaint = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [Color(0x33A855F7), Color(0x00A855F7)],
      ).createShader(Rect.fromLTWH(0, 0, w, h))
      ..style = PaintingStyle.fill;
    canvas.drawPath(fillPath, fillPaint);

    final strokePaint = Paint()
      ..shader = const LinearGradient(
        colors: [AppTheme.violetAccent, AppTheme.cyanAccent],
      ).createShader(Rect.fromLTWH(0, 0, w, h))
      ..strokeWidth = 2.5
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    canvas.drawPath(path, strokePaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// ==========================================
// CUSTOM PAINTER: Gradient Circular Progress
// ==========================================
class _GradientCircularProgressPainter extends CustomPainter {
  final double progress;
  final double strokeWidth;
  final List<Color> gradientColors;
  final Color backgroundColor;

  _GradientCircularProgressPainter({
    required this.progress,
    required this.strokeWidth,
    required this.gradientColors,
    required this.backgroundColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = (size.width - strokeWidth) / 2;

    final bgPaint = Paint()
      ..color = backgroundColor
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke;
    canvas.drawCircle(center, radius, bgPaint);

    if (progress <= 0) return;

    final rect = Rect.fromCircle(center: center, radius: radius);
    final sweepGradient = SweepGradient(
      startAngle: -math.pi / 2,
      endAngle: 3 * math.pi / 2,
      colors: gradientColors,
      transform: const GradientRotation(-math.pi / 2),
    );

    final progressPaint = Paint()
      ..shader = sweepGradient.createShader(rect)
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    final sweepAngle = 2 * math.pi * progress;
    canvas.drawArc(rect, -math.pi / 2, sweepAngle, false, progressPaint);
  }

  @override
  bool shouldRepaint(covariant _GradientCircularProgressPainter oldDelegate) {
    return oldDelegate.progress != progress;
  }
}
