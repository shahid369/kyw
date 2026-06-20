import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:purchases_flutter/purchases_flutter.dart';
import '../services/revenuecat_service.dart';
import '../theme/app_theme.dart';

class PaywallScreen extends StatefulWidget {
  const PaywallScreen({super.key});

  @override
  State<PaywallScreen> createState() => _PaywallScreenState();
}

class _PaywallScreenState extends State<PaywallScreen> {
  Offerings? _offerings;
  Package? _selectedPackage;
  bool _isLoading = true;
  bool _isPurchasing = false;

  @override
  void initState() {
    super.initState();
    _fetchOfferings();
  }

  Future<void> _fetchOfferings() async {
    final offerings = await RevenueCatService.getOfferings();
    if (mounted) {
      setState(() {
        _offerings = offerings;
        _isLoading = false;
        
        // Select the first available package by default (usually Annual)
        if (offerings != null && offerings.current != null && offerings.current!.availablePackages.isNotEmpty) {
          _selectedPackage = offerings.current!.availablePackages.first;
        }
      });
    }
  }

  Future<void> _purchase() async {
    if (_selectedPackage == null) return;

    setState(() {
      _isPurchasing = true;
    });

    final success = await RevenueCatService.purchasePackage(_selectedPackage!);
    
    if (mounted) {
      setState(() {
        _isPurchasing = false;
      });

      if (success) {
        // Purchase successful, dismiss paywall
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Welcome to KYW Pro!')),
        );
        context.pop();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Purchase cancelled or failed.')),
        );
      }
    }
  }

  Future<void> _restorePurchases() async {
    setState(() {
      _isLoading = true;
    });
    
    await RevenueCatService.restorePurchases();
    final isPro = await RevenueCatService.isUserPro();
    
    if (mounted) {
      setState(() {
        _isLoading = false;
      });
      
      if (isPro) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Purchases restored successfully!')),
        );
        context.pop();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('No previous purchases found.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: Stack(
        children: [
          // Background graphic
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            height: size.height * 0.4,
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [AppColors.primary, AppColors.accent],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
            ),
          ),
          
          SafeArea(
            child: Column(
              children: [
                // Header
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const SizedBox(width: 48), // Spacer for centering
                      Text(
                        'KYW Premium',
                        style: theme.textTheme.titleLarge?.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, color: Colors.white),
                        onPressed: () => context.pop(),
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 20),
                
                // Icon / Graphic
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.workspace_premium, size: 64, color: Colors.white),
                ),
                
                const SizedBox(height: 30),
                
                // Content Card
                Expanded(
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.surface,
                      borderRadius: const BorderRadius.only(
                        topLeft: Radius.circular(32),
                        topRight: Radius.circular(32),
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          blurRadius: 20,
                          offset: const Offset(0, -5),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Unlock All Features',
                          style: theme.textTheme.displayMedium,
                        ),
                        const SizedBox(height: 24),
                        
                        _buildFeatureRow(theme, Icons.analytics_outlined, 'Advanced cycle insights & predictions'),
                        const SizedBox(height: 16),
                        _buildFeatureRow(theme, Icons.library_books_outlined, 'Unlimited logging history'),
                        const SizedBox(height: 16),
                        _buildFeatureRow(theme, Icons.block_outlined, 'Ad-free experience'),
                        const SizedBox(height: 16),
                        _buildFeatureRow(theme, Icons.health_and_safety_outlined, 'Personalized health reports'),
                        
                        const Spacer(),
                        
                        // Packages
                        if (_isLoading)
                          const Center(child: CircularProgressIndicator())
                        else if (_offerings?.current != null)
                          ..._offerings!.current!.availablePackages.map((package) => _buildPackageCard(package, theme)).toList()
                        else
                          const Center(child: Text('No packages available right now.')),
                          
                        const SizedBox(height: 24),
                        
                        // Purchase Button
                        SizedBox(
                          width: double.infinity,
                          height: 56,
                          child: ElevatedButton(
                            onPressed: _isPurchasing || _selectedPackage == null || _isLoading ? null : _purchase,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primary,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(16),
                              ),
                            ),
                            child: _isPurchasing 
                                ? const SizedBox(
                                    width: 24, 
                                    height: 24, 
                                    child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)
                                  )
                                : Text(
                                    'Continue',
                                    style: theme.textTheme.titleLarge?.copyWith(color: Colors.white),
                                  ),
                          ),
                        ),
                        
                        const SizedBox(height: 16),
                        
                        // Restore Purchases
                        Center(
                          child: TextButton(
                            onPressed: _isLoading ? null : _restorePurchases,
                            child: Text(
                              'Restore Purchases',
                              style: theme.textTheme.bodyMedium?.copyWith(
                                color: theme.colorScheme.primary,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
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

  Widget _buildFeatureRow(ThemeData theme, IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, color: AppColors.primary, size: 24),
        const SizedBox(width: 16),
        Expanded(
          child: Text(
            text,
            style: theme.textTheme.bodyLarge,
          ),
        ),
      ],
    );
  }

  Widget _buildPackageCard(Package package, ThemeData theme) {
    final isSelected = _selectedPackage?.identifier == package.identifier;
    
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedPackage = package;
        });
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primarySubtle : Colors.transparent,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? AppColors.primary : theme.dividerColor,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  package.packageType == PackageType.annual ? 'Yearly' : 
                  package.packageType == PackageType.monthly ? 'Monthly' : 
                  package.storeProduct.title,
                  style: theme.textTheme.titleLarge?.copyWith(
                    color: isSelected ? AppColors.primary : theme.colorScheme.onSurface,
                  ),
                ),
                if (package.packageType == PackageType.annual)
                  Padding(
                    padding: const EdgeInsets.only(top: 4.0),
                    child: Text(
                      'Best Value',
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: AppColors.accent,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
              ],
            ),
            Text(
              package.storeProduct.priceString,
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
