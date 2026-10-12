import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';

class AdminDashboardScreen extends StatelessWidget {
  const AdminDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.scaffoldBackground,
      appBar: AppBar(
        title: const Text('Admin Dashboard', style: TextStyle(fontWeight: FontWeight.w900)),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded),
          onPressed: () => context.pop(),
        ),
      ),
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
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 900),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Overview Stats 2x2 Grid (matches Image 1 Admin Dashboard)
                    Row(
                      children: [
                        Expanded(child: _buildMetricCard('Total Users', '12,458', '+135%', AppTheme.cyanAccent, Icons.people_alt_rounded)),
                        const SizedBox(width: 14),
                        Expanded(child: _buildMetricCard('Total Donations', '₹5,42,680', '+18%', const Color(0xFFEC4899), Icons.volunteer_activism_rounded)),
                      ],
                    ),
                    const SizedBox(height: 14),
                    Row(
                      children: [
                        Expanded(child: _buildMetricCard('Total Steps', '2.4M', '+31%', AppTheme.violetAccent, Icons.directions_walk_rounded)),
                        const SizedBox(width: 14),
                        Expanded(child: _buildMetricCard('Pending Requests', '8', '+12%', const Color(0xFFF59E0B), Icons.pending_actions_rounded)),
                      ],
                    ),
                    const SizedBox(height: 28),

                    // User Activity Line Chart Container
                    Container(
                      padding: const EdgeInsets.all(22),
                      decoration: BoxDecoration(
                        color: AppTheme.surfaceColor.withOpacity(0.85),
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: Colors.white.withOpacity(0.06)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: const [
                              Text(
                                'User Activity & Stride Growth',
                                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Colors.white),
                              ),
                              Icon(Icons.more_horiz_rounded, color: AppTheme.textSecondary),
                            ],
                          ),
                          const SizedBox(height: 20),
                          SizedBox(
                            height: 140,
                            width: double.infinity,
                            child: CustomPaint(
                              painter: _AdminActivityChartPainter(),
                            ),
                          ),
                          const SizedBox(height: 12),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: const [
                              Text('Jan', style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                              Text('Feb', style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                              Text('Mar', style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                              Text('Apr', style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                              Text('May', style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                              Text('Jun', style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 28),

                    // Recent Donations Table
                    Container(
                      padding: const EdgeInsets.all(22),
                      decoration: BoxDecoration(
                        color: AppTheme.surfaceColor.withOpacity(0.85),
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: Colors.white.withOpacity(0.06)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Recent Donations',
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Colors.white),
                          ),
                          const SizedBox(height: 16),
                          _buildDonationRow("Children's Education", 'Rahul M.', '₹1,000', 'Success'),
                          const Divider(color: Color(0xFF222233), height: 20),
                          _buildDonationRow('Healthcare Support', 'Priya S.', '₹3,000', 'Success'),
                          const Divider(color: Color(0xFF222233), height: 20),
                          _buildDonationRow('Elderly Care', 'Vikram K.', '₹2,000', 'Success'),
                          const Divider(color: Color(0xFF222233), height: 20),
                          _buildDonationRow('Community Health', 'Deepa N.', '₹1,500', 'Success'),
                        ],
                      ),
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

  Widget _buildMetricCard(String title, String value, String growth, Color accent, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(18),
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
            children: [
              Text(title, style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary, fontWeight: FontWeight.w600)),
              Icon(icon, color: accent, size: 18),
            ],
          ),
          const SizedBox(height: 10),
          Text(value, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white)),
          const SizedBox(height: 6),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
            decoration: BoxDecoration(
              color: accent.withOpacity(0.15),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Text(growth, style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: accent)),
          ),
        ],
      ),
    );
  }

  Widget _buildDonationRow(String cause, String donor, String amount, String status) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(cause, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Colors.white)),
            const SizedBox(height: 2),
            Text(donor, style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
          ],
        ),
        Row(
          children: [
            Text(amount, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppTheme.cyanAccent)),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: Colors.green.withOpacity(0.15),
                borderRadius: BorderRadius.circular(6),
              ),
              child: const Text('Verified', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.greenAccent)),
            ),
          ],
        ),
      ],
    );
  }
}

class _AdminActivityChartPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    final path = Path();
    final fillPath = Path();

    path.moveTo(0, h * 0.8);
    path.cubicTo(w * 0.2, h * 0.65, w * 0.35, h * 0.85, w * 0.5, h * 0.35);
    path.cubicTo(w * 0.65, h * 0.6, w * 0.8, h * 0.2, w, h * 0.4);

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
        colors: [AppTheme.violetAccent, AppTheme.electricBlue, AppTheme.cyanAccent],
      ).createShader(Rect.fromLTWH(0, 0, w, h))
      ..strokeWidth = 3.0
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;
    canvas.drawPath(path, strokePaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
