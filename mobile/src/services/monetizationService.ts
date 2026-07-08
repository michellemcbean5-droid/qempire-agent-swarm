import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';
import { SubscriptionTier } from '../types';

const REVENUECAT_API_KEY = Platform.select({
  ios: 'rc_apple_api_key',
  android: 'rc_google_api_key',
  default: 'rc_api_key',
});

export const monetizationService = {
  async initialize() {
    try {
      await Purchases.configure({ apiKey: REVENUECAT_API_KEY! });
    } catch (e) {
      console.error('RevenueCat init error:', e);
    }
  },

  async getOfferings() {
    try {
      const offerings = await Purchases.getOfferings();
      return offerings.current;
    } catch (e) {
      return null;
    }
  },

  async purchasePackage(packageIdentifier: string) {
    try {
      const offerings = await Purchases.getOfferings();
      const pkg = offerings.current?.availablePackages.find(
        (p) => p.identifier === packageIdentifier
      );
      if (!pkg) throw new Error('Package not found');
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      return customerInfo;
    } catch (e) {
      throw e;
    }
  },

  async restorePurchases() {
    try {
      const { customerInfo } = await Purchases.restorePurchases();
      return customerInfo;
    } catch (e) {
      throw e;
    }
  },

  async getCustomerInfo() {
    try {
      return await Purchases.getCustomerInfo();
    } catch (e) {
      return null;
    }
  },
};

// AdMob configuration
export const ADMOB_CONFIG = {
  bannerId: Platform.select({
    ios: 'ca-app-pub-3940256099942544/2934735716',
    android: 'ca-app-pub-3940256099942544/6300978111',
  }),
  interstitialId: Platform.select({
    ios: 'ca-app-pub-3940256099942544/4411468910',
    android: 'ca-app-pub-3940256099942544/1033173712',
  }),
  rewardedId: Platform.select({
    ios: 'ca-app-pub-3940256099942544/1712485313',
    android: 'ca-app-pub-3940256099942544/5224354917',
  }),
};
