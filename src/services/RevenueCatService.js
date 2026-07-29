import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = Platform.OS === 'ios' ? 'appl_PLACEHOLDER_KEY' : 'goog_PLACEHOLDER_KEY';
const ENTITLEMENT_ID = 'pro';
const STORAGE_KEY = 'proposal_pro_status';

export async function initPurchases() {
  try {
    const { default: RNPurchases } = await import('react-native-purchases');
    await RNPurchases.configure({ apiKey: API_KEY });
    return true;
  } catch (e) {
    console.log('RevenueCat init failed:', e);
    return false;
  }
}

export async function checkProStatus() {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (stored === 'pro') return true;
  try {
    const { default: RNPurchases } = await import('react-native-purchases');
    const customerInfo = await RNPurchases.getCustomerInfo();
    if (customerInfo.entitlements.active[ENTITLEMENT_ID]) {
      await AsyncStorage.setItem(STORAGE_KEY, 'pro');
      return true;
    }
  } catch (e) {
    console.log('Check pro status failed:', e);
  }
  return false;
}

export async function purchasePackage(packageId) {
  try {
    const { default: RNPurchases } = await import('react-native-purchases');
    const offerings = await RNPurchases.getOfferings();
    const pkg = offerings.current.availablePackages.find(p => p.identifier === packageId);
    if (!pkg) throw new Error('Package not found');
    const { customerInfo } = await RNPurchases.purchasePackage(pkg);
    if (customerInfo.entitlements.active[ENTITLEMENT_ID]) {
      await AsyncStorage.setItem(STORAGE_KEY, 'pro');
      return true;
    }
    return false;
  } catch (e) {
    if (e.userCancelled) return false;
    throw e;
  }
}

export async function restorePurchases() {
  try {
    const { default: RNPurchases } = await import('react-native-purchases');
    const customerInfo = await RNPurchases.restorePurchases();
    if (customerInfo.entitlements.active[ENTITLEMENT_ID]) {
      await AsyncStorage.setItem(STORAGE_KEY, 'pro');
      return true;
    }
    return false;
  } catch (e) {
    throw e;
  }
}
