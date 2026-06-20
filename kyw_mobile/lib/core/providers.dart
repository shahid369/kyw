import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:purchases_flutter/purchases_flutter.dart';
import '../services/revenuecat_service.dart';
import 'cycle_engine.dart';

final supabaseClientProvider = Provider<SupabaseClient>((ref) {
  return Supabase.instance.client;
});

final authStateProvider = StreamProvider<AuthState>((ref) {
  return ref.watch(supabaseClientProvider).auth.onAuthStateChange;
});

final currentUserProvider = Provider<User?>((ref) {
  final authState = ref.watch(authStateProvider).value;
  return authState?.session?.user ?? ref.watch(supabaseClientProvider).auth.currentUser;
});

class UserProfile {
  final String id;
  final String name;
  final String partnerName;
  final int defaultCycleLength;

  UserProfile({required this.id, required this.name, required this.partnerName, required this.defaultCycleLength});

  factory UserProfile.fromMap(Map<String, dynamic> map) {
    return UserProfile(
      id: map['id'],
      name: map['name'] ?? '',
      partnerName: map['partner_name'] ?? '',
      defaultCycleLength: map['default_cycle_length'] ?? 28,
    );
  }
}

final userProfileProvider = FutureProvider<UserProfile?>((ref) async {
  final user = ref.watch(currentUserProvider);
  if (user == null) return null;

  final client = ref.watch(supabaseClientProvider);
  final response = await client.from('profiles').select().eq('id', user.id).maybeSingle();
  
  if (response != null) {
    return UserProfile.fromMap(response);
  }
  return null;
});

final cyclesProvider = FutureProvider<List<Cycle>>((ref) async {
  final user = ref.watch(currentUserProvider);
  if (user == null) return [];

  final client = ref.watch(supabaseClientProvider);
  final response = await client
      .from('cycles')
      .select()
      .eq('user_id', user.id)
      .order('start_date', ascending: false);

  return (response as List).map((data) => Cycle.fromMap(data)).toList();
});

class SignupLoading extends Notifier<bool> {
  @override
  bool build() => false;

  void set(bool value) => state = value;
}

final signupLoadingProvider = NotifierProvider<SignupLoading, bool>(SignupLoading.new);

class ProNotifier extends Notifier<bool> {
  @override
  bool build() {
    _init();
    return false;
  }

  Future<void> _init() async {
    Purchases.addCustomerInfoUpdateListener((customerInfo) {
      state = customerInfo.entitlements.all[RevenueCatService.entitlementPro]?.isActive == true;
    });
    state = await RevenueCatService.isUserPro();
  }
}

final isProProvider = NotifierProvider<ProNotifier, bool>(ProNotifier.new);
