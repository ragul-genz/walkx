import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _healthConnectEnabled = true;
  bool _appleHealthEnabled = false;
  bool _backgroundSyncEnabled = true;

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
                          'Profile',
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                            letterSpacing: -0.5,
                          ),
                        ),
                        GestureDetector(
                          onTap: () => context.push('/admin'),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                            decoration: BoxDecoration(
                              color: AppTheme.violetAccent.withOpacity(0.18),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: AppTheme.violetAccent.withOpacity(0.3)),
                            ),
                            child: Row(
                              children: const [
                                Icon(Icons.admin_panel_settings_rounded, color: AppTheme.cyanAccent, size: 16),
                                SizedBox(width: 4),
                                Text(
                                  'Admin View',
                                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.cyanAccent),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // User Card (matches Image 1: Priya Sharma)
                    Container(
                      padding: const EdgeInsets.all(22),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF23163A), Color(0xFF141933), Color(0xFF0F1224)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: AppTheme.violetAccent.withOpacity(0.25)),
                        boxShadow: [
                          BoxShadow(
                            color: AppTheme.violetAccent.withOpacity(0.15),
                            blurRadius: 20,
                            offset: const Offset(0, 6),
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(3),
                            decoration: const BoxDecoration(
                              gradient: AppTheme.logoGradient,
                              shape: BoxShape.circle,
                            ),
                            child: Container(
                              width: 64,
                              height: 64,
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
                          const SizedBox(width: 18),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    const Text(
                                      'Priya Sharma',
                                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Colors.white),
                                    ),
                                    const SizedBox(width: 6),
                                    const Icon(Icons.verified_rounded, color: AppTheme.cyanAccent, size: 18),
                                  ],
                                ),
                                const SizedBox(height: 2),
                                const Text(
                                  'priya@email.com',
                                  style: TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                                ),
                                const SizedBox(height: 8),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                                  decoration: BoxDecoration(
                                    color: AppTheme.violetAccent.withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: const Text(
                                    'WalkX Elite Member ⚡',
                                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppTheme.cyanAccent),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 26),

                    // Health Permissions & Sync (from Image 1)
                    const Text(
                      'Health Permissions & Sync',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Colors.white),
                    ),
                    const SizedBox(height: 12),

                    Container(
                      padding: const EdgeInsets.all(18),
                      decoration: BoxDecoration(
                        color: AppTheme.surfaceColor.withOpacity(0.85),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: Colors.white.withOpacity(0.05)),
                      ),
                      child: Column(
                        children: [
                          _buildSwitchTile(
                            icon: Icons.health_and_safety_rounded,
                            title: 'Google Health Connect',
                            subtitle: 'Sync step counts & distance automatically',
                            value: _healthConnectEnabled,
                            onChanged: (val) => setState(() => _healthConnectEnabled = val),
                            color: AppTheme.cyanAccent,
                          ),
                          const Divider(color: Color(0xFF222233), height: 24),
                          _buildSwitchTile(
                            icon: Icons.favorite_rounded,
                            title: 'Apple Health',
                            subtitle: 'Import workouts and heart rate telemetry',
                            value: _appleHealthEnabled,
                            onChanged: (val) => setState(() => _appleHealthEnabled = val),
                            color: const Color(0xFFEC4899),
                          ),
                          const Divider(color: Color(0xFF222233), height: 24),
                          _buildSwitchTile(
                            icon: Icons.sync_rounded,
                            title: 'Background Step Tracking',
                            subtitle: 'Keep counting steps when the app is minimized',
                            value: _backgroundSyncEnabled,
                            onChanged: (val) => setState(() => _backgroundSyncEnabled = val),
                            color: AppTheme.violetAccent,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 26),

                    // Account Settings Menu List (from Image 1)
                    const Text(
                      'Account & Settings',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Colors.white),
                    ),
                    const SizedBox(height: 12),

                    _buildMenuTile(
                      icon: Icons.person_outline_rounded,
                      title: 'Personal Information',
                      onTap: () => context.push('/settings/edit-profile'),
                    ),
                    _buildMenuTile(
                      icon: Icons.notifications_none_rounded,
                      title: 'Notifications & Alerts',
                      onTap: () => context.push('/settings'),
                    ),
                    _buildMenuTile(
                      icon: Icons.security_rounded,
                      title: 'Security & Change Password',
                      onTap: () => context.push('/settings/change-password'),
                    ),
                    _buildMenuTile(
                      icon: Icons.admin_panel_settings_rounded,
                      title: 'WalkX Admin Dashboard',
                      onTap: () => context.push('/admin'),
                      badge: 'New',
                    ),
                    _buildMenuTile(
                      icon: Icons.info_outline_rounded,
                      title: 'About WalkX & Neural-X',
                      onTap: () => context.push('/about'),
                    ),
                    _buildMenuTile(
                      icon: Icons.logout_rounded,
                      title: 'Log Out',
                      color: Colors.redAccent,
                      onTap: () => context.go('/login'),
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

  Widget _buildSwitchTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
    required Color color,
  }) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: color.withOpacity(0.15),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: color, size: 20),
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Colors.white)),
              const SizedBox(height: 2),
              Text(subtitle, style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
            ],
          ),
        ),
        Switch(
          value: value,
          onChanged: onChanged,
          activeColor: AppTheme.cyanAccent,
          activeTrackColor: AppTheme.violetAccent.withOpacity(0.4),
        ),
      ],
    );
  }

  Widget _buildMenuTile({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
    Color color = Colors.white,
    String? badge,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      child: Material(
        color: AppTheme.surfaceColor.withOpacity(0.85),
        borderRadius: BorderRadius.circular(18),
        child: InkWell(
          borderRadius: BorderRadius.circular(18),
          onTap: onTap,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: Colors.white.withOpacity(0.04)),
            ),
            child: Row(
              children: [
                Icon(icon, color: color == Colors.white ? AppTheme.violetAccent : color, size: 22),
                const SizedBox(width: 16),
                Expanded(
                  child: Text(
                    title,
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: color),
                  ),
                ),
                if (badge != null) ...[
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      gradient: AppTheme.logoGradient,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      badge,
                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                  ),
                  const SizedBox(width: 8),
                ],
                const Icon(Icons.arrow_forward_ios_rounded, color: AppTheme.textMuted, size: 14),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
