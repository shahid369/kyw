import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:purchases_flutter/purchases_flutter.dart';
import 'package:purchases_ui_flutter/purchases_ui_flutter.dart';

class RevenueCatService {
  static String get _apiKey {
    if (kDebugMode) {
      return 'test_hoyHHOGdCBwMEjKYpUncYAZGQjs';
    }
    return 'goog_EKOwWKZGZpskZahEFTkaaRyzxrF';
  }
  static const String entitlementPro = 'com․knowyourwomen․app Pro';

  static Future<void> init([String? userId]) async {
    try {
      await Purchases.setLogLevel(kDebugMode ? LogLevel.debug : LogLevel.info);
      
      // Both platforms share the same API key in this setup based on the prompt, 
      // though typically you'd have separate keys for iOS and Android.
      // If you separate them later, replace _apiKey here conditionally.
      PurchasesConfiguration configuration;
      if (Platform.isIOS || Platform.isMacOS) {
        configuration = PurchasesConfiguration(_apiKey);
      } else if (Platform.isAndroid) {
        configuration = PurchasesConfiguration(_apiKey);
      } else {
        debugPrint('RevenueCat unsupported platform');
        return; 
      }
      
      if (userId != null) {
        configuration.appUserID = userId;
      }
      await Purchases.configure(configuration);
    } catch (e) {
      debugPrint('RevenueCat initialization error: $e');
    }
  }

  static Future<void> login(String userId) async {
    try {
      await Purchases.logIn(userId);
    } catch (e) {
      debugPrint('RevenueCat login error: $e');
    }
  }

  static Future<void> logout() async {
    try {
      await Purchases.logOut();
    } catch (e) {
      debugPrint('RevenueCat logout error: $e');
    }
  }

  static Future<bool> isUserPro() async {
    try {
      final customerInfo = await Purchases.getCustomerInfo();
      return customerInfo.entitlements.all[entitlementPro]?.isActive == true;
    } catch (e) {
      debugPrint('RevenueCat check error: $e');
      return false;
    }
  }

  static Future<void> presentPaywall() async {
    try {
      await RevenueCatUI.presentPaywallIfNeeded(entitlementPro);
    } catch (e) {
      debugPrint('RevenueCat paywall error: $e');
    }
  }

  static Future<void> presentCustomerCenter() async {
    try {
      await RevenueCatUI.presentCustomerCenter();
    } catch (e) {
      debugPrint('RevenueCat customer center error: $e');
    }
  }

  static Future<Offerings?> getOfferings() async {
    try {
      return await Purchases.getOfferings();
    } catch (e) {
      debugPrint('RevenueCat getOfferings error: $e');
      return null;
    }
  }

  static Future<bool> purchasePackage(Package package) async {
    try {
      final result = await Purchases.purchasePackage(package);
      return result.customerInfo.entitlements.all[entitlementPro]?.isActive == true;
    } catch (e) {
      debugPrint('RevenueCat purchase error: $e');
      return false;
    }
  }

  static Future<void> restorePurchases() async {
    try {
      await Purchases.restorePurchases();
    } catch (e) {
      debugPrint('RevenueCat restore error: $e');
    }
  }
}
