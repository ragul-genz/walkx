import 'package:flutter/material.dart';
import 'dart:ui';
import '../../../core/theme/app_theme.dart';

class WalletScreen extends StatefulWidget {
  const WalletScreen({super.key});

  @override
  State<WalletScreen> createState() => _WalletScreenState();
}

class _WalletScreenState extends State<WalletScreen> {
  int _activeTab = 0; // 0: My Wallet, 1: Rewards & Redemption

  final List<Map<String, dynamic>> _rewards = [
    {
      'amount': '₹1 Reward',
      'points': '1,000 points',
      'ptsNum': 1000,
      'color': const Color(0xFFF59E0B),
      'unlocked': true,
    },
    {
      'amount': '₹5 Reward',
      'points': '5,000 points',
      'ptsNum': 500,
      'color': const Color(0xFF10B981),
      'unlocked': true,
    },
    {
      'amount': '₹10 Reward',
      'points': '10,000 points',
      'ptsNum': 10000,
      'color': AppTheme.violetAccent,
      'unlocked': false,
    },
    {
      'amount': '₹50 Mega Reward',
      'points': '50,000 points',
      'ptsNum': 50000,
      'color': AppTheme.electricBlue,
      'unlocked': false,
    },
  ];

  final List<Map<String, dynamic>> _transactions = [
    {
      'title': 'Steps Reward',
      'date': '12 Apr 2026',
      'pts': '+1,000',
      'isCredit': true,
    },
    {
      'title': 'Steps Reward',
      'date': '11 Apr 2026',
      'pts': '+1,240',
      'isCredit': true,
    },
    {
      'title': 'Donation: Children Education',
      'date': '10 Apr 2026',
      'pts': '-2,000',
      'isCredit': false,
    },
    {
      'title': 'Steps Reward',
      'date': '09 Apr 2026',
      'pts': '+1,000',
      'isCredit': true,
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
                          'My Wallet',
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                            letterSpacing: -0.5,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            gradient: AppTheme.logoGradient,
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Row(
                            children: const [
                              Icon(Icons.currency_rupee, color: Colors.white, size: 14),
                              Text('₹6.42', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 13)),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Tab Selector: [My Wallet] [Rewards & Redemption]
                    Container(
                      padding: const EdgeInsets.all(4),
                      decoration: BoxDecoration(
                        color: AppTheme.surfaceColor.withOpacity(0.8),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.white.withOpacity(0.05)),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: _buildTabButton(0, 'My Wallet'),
                          ),
                          Expanded(
                            child: _buildTabButton(1, 'Rewards & Redemption'),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    if (_activeTab == 0) ...[
                      _buildWalletView(context),
                    ] else ...[
                      _buildRewardsView(context),
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

  Widget _buildTabButton(int index, String label) {
    final isSel = _activeTab == index;
    return GestureDetector(
      onTap: () => setState(() => _activeTab = index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(vertical: 10),
        alignment: Alignment.center,
        decoration: BoxDecoration(
          gradient: isSel ? AppTheme.logoGradient : null,
          color: isSel ? null : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 13,
            fontWeight: isSel ? FontWeight.w800 : FontWeight.w600,
            color: isSel ? Colors.white : AppTheme.textSecondary,
          ),
        ),
      ),
    );
  }

  // ==========================================
  // TAB 1: MY WALLET
  // ==========================================
  Widget _buildWalletView(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Main Points Balance Hero Card (matches Image 1)
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF24153B), Color(0xFF141933), Color(0xFF0F1224)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: AppTheme.violetAccent.withOpacity(0.3)),
            boxShadow: [
              BoxShadow(
                color: AppTheme.violetAccent.withOpacity(0.18),
                blurRadius: 24,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          color: AppTheme.cyanAccent.withOpacity(0.2),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.stars_rounded, color: AppTheme.cyanAccent, size: 20),
                      ),
                      const SizedBox(width: 8),
                      const Text(
                        'Total Points Balance',
                        style: TextStyle(fontSize: 14, color: AppTheme.textSecondary, fontWeight: FontWeight.w600),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppTheme.cyanAccent.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Text(
                      '≈ ₹6.42 INR',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.cyanAccent),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              const Text(
                '6,420',
                style: TextStyle(
                  fontSize: 42,
                  fontWeight: FontWeight.w900,
                  color: Colors.white,
                  letterSpacing: -1.0,
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                'WalkX Coins',
                style: TextStyle(fontSize: 14, color: AppTheme.textSecondary, fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 20),

              // Point Conversion Banner
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.surfaceLight.withOpacity(0.8),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: Colors.white.withOpacity(0.06)),
                ),
                child: Row(
                  children: const [
                    Icon(Icons.swap_horiz_rounded, color: AppTheme.violetAccent, size: 20),
                    SizedBox(width: 8),
                    Text(
                      'Point Conversion: ',
                      style: TextStyle(fontSize: 12, color: AppTheme.textSecondary, fontWeight: FontWeight.w600),
                    ),
                    Text(
                      '1,000 points = ₹1',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // 4 Points Summary Tiles
        Row(
          children: [
            Expanded(child: _buildStatTile("Today's Points", '1,240', AppTheme.cyanAccent)),
            const SizedBox(width: 12),
            Expanded(child: _buildStatTile('Total Points', '6,420', AppTheme.violetAccent)),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(child: _buildStatTile('Redeemed Points', '0', AppTheme.electricBlue)),
            const SizedBox(width: 12),
            Expanded(child: _buildStatTile('Donation Points', '0', const Color(0xFFEC4899))),
          ],
        ),
        const SizedBox(height: 24),

        // Withdraw & Convert Action Buttons
        Row(
          children: [
            Expanded(
              child: SizedBox(
                height: 50,
                child: Container(
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
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      shadowColor: Colors.transparent,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    onPressed: () => _showWithdrawDialog(context),
                    child: const Text('Withdraw to UPI', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                  ),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 28),

        // Recent Transactions Section (matches Image 1)
        const Text(
          'Recent Transactions',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white),
        ),
        const SizedBox(height: 14),

        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _transactions.length,
          separatorBuilder: (_, __) => const SizedBox(height: 10),
          itemBuilder: (context, index) {
            final tx = _transactions[index];
            final isCredit = tx['isCredit'] as bool;
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
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: isCredit ? AppTheme.cyanAccent.withOpacity(0.15) : Colors.redAccent.withOpacity(0.15),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      isCredit ? Icons.arrow_downward_rounded : Icons.arrow_upward_rounded,
                      color: isCredit ? AppTheme.cyanAccent : Colors.redAccent,
                      size: 18,
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          tx['title'] as String,
                          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Colors.white),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          tx['date'] as String,
                          style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary),
                        ),
                      ],
                    ),
                  ),
                  Text(
                    tx['pts'] as String,
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w900,
                      color: isCredit ? AppTheme.cyanAccent : Colors.redAccent,
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildStatTile(String label, String value, Color accent) {
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
          Text(label, style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary, fontWeight: FontWeight.w600)),
          const SizedBox(height: 6),
          Text(value, style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: accent)),
        ],
      ),
    );
  }

  // ==========================================
  // TAB 2: REWARDS & REDEMPTION (matches Image 1)
  // ==========================================
  Widget _buildRewardsView(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Choose Your Reward',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white),
        ),
        const SizedBox(height: 14),

        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _rewards.length,
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemBuilder: (context, index) {
            final rew = _rewards[index];
            final color = rew['color'] as Color;
            final isUnlocked = rew['unlocked'] as bool;

            return Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: AppTheme.surfaceColor.withOpacity(0.85),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: isUnlocked ? color.withOpacity(0.3) : Colors.white.withOpacity(0.04)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: color.withOpacity(0.18),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(Icons.card_giftcard_rounded, color: color, size: 24),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          rew['amount'] as String,
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Colors.white),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          rew['points'] as String,
                          style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary, fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                  ),
                  GestureDetector(
                    onTap: isUnlocked
                        ? () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('Claimed ${rew['amount']} successfully! Sent to your account.'),
                                backgroundColor: const Color(0xFF1B1832),
                              ),
                            );
                          }
                        : null,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        gradient: isUnlocked ? AppTheme.logoGradient : null,
                        color: isUnlocked ? null : const Color(0xFF1E1E2C),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        isUnlocked ? 'Claim' : 'Locked',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          color: isUnlocked ? Colors.white : AppTheme.textMuted,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        ),
        const SizedBox(height: 24),

        // Reward Eligibility Card (from Image 1)
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppTheme.surfaceLight,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: Colors.white.withOpacity(0.06)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: const [
              Text(
                'Reward Eligibility Rules',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Colors.white),
              ),
              SizedBox(height: 12),
              _RuleBullet(text: 'Minimum redemption: 1,000 points (₹1)'),
              SizedBox(height: 8),
              _RuleBullet(text: 'Daily conversion cap: 20,000 points'),
              SizedBox(height: 8),
              _RuleBullet(text: 'WalkX coins are valid for 12 months'),
              SizedBox(height: 8),
              _RuleBullet(text: 'Subject to fair-play and active pedometer verification'),
            ],
          ),
        ),
      ],
    );
  }

  void _showWithdrawDialog(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
          child: Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: const Color(0xFF101018).withOpacity(0.96),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
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
                const Text('Withdraw to UPI', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Colors.white)),
                const SizedBox(height: 6),
                const Text('Enter your UPI ID to transfer funds directly via Razorpay Gateway.', style: TextStyle(fontSize: 12, color: AppTheme.textSecondary)),
                const SizedBox(height: 20),
                TextField(
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    labelText: 'UPI ID (e.g. yourname@okhdfcbank)',
                    labelStyle: const TextStyle(color: AppTheme.textSecondary),
                    filled: true,
                    fillColor: AppTheme.surfaceLight,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                    prefixIcon: const Icon(Icons.account_balance_rounded, color: AppTheme.cyanAccent),
                  ),
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: AppTheme.logoGradient,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(backgroundColor: Colors.transparent, shadowColor: Colors.transparent),
                      onPressed: () {
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Withdrawal request initiated successfully!'), backgroundColor: Color(0xFF1B1832)),
                        );
                      },
                      child: const Text('Confirm Withdrawal', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
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
  }
}

class _RuleBullet extends StatelessWidget {
  final String text;
  const _RuleBullet({required this.text});

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          margin: const EdgeInsets.only(top: 6),
          width: 5,
          height: 5,
          decoration: const BoxDecoration(
            color: AppTheme.cyanAccent,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Text(text, style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary, height: 1.4)),
        ),
      ],
    );
  }
}
