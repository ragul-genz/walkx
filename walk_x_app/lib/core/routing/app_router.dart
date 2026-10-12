import 'package:go_router/go_router.dart';
import '../../features/auth/presentation/onboarding_screen.dart';
import '../../features/auth/presentation/login_screen.dart';
import '../../features/auth/presentation/profile_screen.dart';
import '../../features/auth/presentation/phone_login_screen.dart';
import '../../features/auth/presentation/otp_screen.dart';
import '../../features/dashboard/presentation/dashboard_screen.dart';
import '../../features/dashboard/presentation/activity_screen.dart';
import '../../features/dashboard/presentation/wallet_screen.dart';
import '../../features/dashboard/presentation/donate_screen.dart';
import '../../features/profile/presentation/about_us_screen.dart';
import '../../features/profile/presentation/settings_screen.dart';
import '../../features/profile/presentation/edit_profile_screen.dart';
import '../../features/profile/presentation/change_password_screen.dart';
import '../../features/admin/presentation/admin_dashboard_screen.dart';
import '../../shared/widgets/main_navigation.dart';

final GoRouter appRouter = GoRouter(
  initialLocation: '/dashboard',
  routes: [
    GoRoute(
      path: '/settings/edit-profile',
      builder: (context, state) => const EditProfileScreen(),
    ),
    GoRoute(
      path: '/settings/change-password',
      builder: (context, state) => const ChangePasswordScreen(),
    ),
    GoRoute(
      path: '/settings',
      builder: (context, state) => const SettingsScreen(),
    ),
    GoRoute(
      path: '/about',
      builder: (context, state) => const AboutUsScreen(),
    ),
    GoRoute(
      path: '/admin',
      builder: (context, state) => const AdminDashboardScreen(),
    ),
    GoRoute(
      path: '/onboarding',
      builder: (context, state) => const OnboardingScreen(),
    ),
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/phone-login',
      builder: (context, state) => const PhoneLoginScreen(),
    ),
    GoRoute(
      path: '/otp',
      builder: (context, state) => const OtpScreen(),
    ),
    
    // Main App Navigation Shell (5 Branches matching Image 1)
    StatefulShellRoute.indexedStack(
      builder: (context, state, navigationShell) {
        return MainNavigation(navigationShell: navigationShell);
      },
      branches: [
        // Branch 0: Home Dashboard
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/dashboard',
              builder: (context, state) => const DashboardScreen(),
            ),
          ],
        ),
        // Branch 1: Activity
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/activity',
              builder: (context, state) => const ActivityScreen(),
            ),
          ],
        ),
        // Branch 2: Rewards & Wallet
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/wallet',
              builder: (context, state) => const WalletScreen(),
            ),
          ],
        ),
        // Branch 3: Donate & Causes
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/donate',
              builder: (context, state) => const DonateScreen(),
            ),
          ],
        ),
        // Branch 4: Profile & Health
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/profile',
              builder: (context, state) => const ProfileScreen(),
            ),
          ],
        ),
      ],
    ),
  ],
);
