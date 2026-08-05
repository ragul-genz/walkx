import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pedometer/pedometer.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:shared_preferences/shared_preferences.dart';

final stepRepositoryProvider = Provider<StepRepository>((ref) {
  return StepRepository();
});

final stepCountProvider = StreamProvider<int>((ref) {
  final repository = ref.watch(stepRepositoryProvider);
  return repository.getStepStream();
});

class StepRepository {
  late Stream<StepCount> _stepCountStream;

  StepRepository() {
    _initPedometer();
  }

  void _initPedometer() async {
    bool granted = await _checkPermissions();
    if (granted) {
      _stepCountStream = Pedometer.stepCountStream;
    }
  }

  Future<bool> _checkPermissions() async {
    if (await Permission.activityRecognition.request().isGranted) {
      return true;
    } else {
      return false;
    }
  }

  Stream<int> getStepStream() async* {
    if (await _checkPermissions()) {
      await for (final StepCount stepCount in Pedometer.stepCountStream) {
        // Save to local storage for persistence
        final prefs = await SharedPreferences.getInstance();
        await prefs.setInt('last_step_count', stepCount.steps);
        
        yield stepCount.steps;
      }
    } else {
      yield 0;
    }
  }

  Future<int> getSavedSteps() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt('last_step_count') ?? 0;
  }
}
