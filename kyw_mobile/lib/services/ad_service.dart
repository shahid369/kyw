import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/providers.dart';

class AdHelper {
  static String get bannerAdUnitId {
    if (kDebugMode) {
      if (Platform.isAndroid) {
        return 'ca-app-pub-3940256099942544/6300978111';
      } else if (Platform.isIOS) {
        return 'ca-app-pub-3940256099942544/2934735716';
      }
    }
    if (Platform.isAndroid) {
      return 'ca-app-pub-1057630872229405/6392968780';
    } else if (Platform.isIOS) {
      // TODO: Replace with production iOS Banner ID when available
      return '';
    }
    return '';
  }

  static String get interstitialAdUnitId {
    if (kDebugMode) {
      if (Platform.isAndroid) {
        return 'ca-app-pub-3940256099942544/1033173712';
      } else if (Platform.isIOS) {
        return 'ca-app-pub-3940256099942544/4411468910';
      }
    }
    if (Platform.isAndroid) {
      return 'ca-app-pub-1057630872229405/9683678236';
    } else if (Platform.isIOS) {
      // TODO: Replace with production iOS Interstitial ID when available
      return '';
    }
    return '';
  }
}

final adServiceProvider = Provider<AdService>((ref) {
  final service = AdService(ref);
  service.createInterstitialAd(); // Preload interstitial
  return service;
});

class AdService {
  final Ref ref;
  InterstitialAd? _interstitialAd;
  int _numInterstitialLoadAttempts = 0;
  static const int maxFailedLoadAttempts = 3;

  AdService(this.ref);

  void createInterstitialAd() {
    if (ref.read(isProProvider)) return; // Don't load if Pro

    InterstitialAd.load(
      adUnitId: AdHelper.interstitialAdUnitId,
      request: const AdRequest(),
      adLoadCallback: InterstitialAdLoadCallback(
        onAdLoaded: (InterstitialAd ad) {
          _interstitialAd = ad;
          _numInterstitialLoadAttempts = 0;
        },
        onAdFailedToLoad: (LoadAdError error) {
          _numInterstitialLoadAttempts += 1;
          _interstitialAd = null;
          if (_numInterstitialLoadAttempts < maxFailedLoadAttempts) {
            createInterstitialAd();
          }
        },
      ),
    );
  }

  void showInterstitialAd() {
    if (ref.read(isProProvider)) return; // Don't show if Pro

    if (_interstitialAd == null) {
      debugPrint('Warning: attempt to show interstitial before loaded.');
      createInterstitialAd();
      return;
    }
    
    _interstitialAd!.fullScreenContentCallback = FullScreenContentCallback(
      onAdShowedFullScreenContent: (InterstitialAd ad) => debugPrint('ad onAdShowedFullScreenContent.'),
      onAdDismissedFullScreenContent: (InterstitialAd ad) {
        debugPrint('$ad onAdDismissedFullScreenContent.');
        ad.dispose();
        createInterstitialAd(); // Load next ad
      },
      onAdFailedToShowFullScreenContent: (InterstitialAd ad, AdError error) {
        debugPrint('$ad onAdFailedToShowFullScreenContent: $error');
        ad.dispose();
        createInterstitialAd();
      },
    );
    
    _interstitialAd!.show();
    _interstitialAd = null;
  }
}
