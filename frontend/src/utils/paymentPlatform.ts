import { Capacitor } from '@capacitor/core';
// Native builds consume subscriptions; Android browsers and PWAs retain web checkout.
export const canUseWebCheckout = (): boolean => !Capacitor.isNativePlatform();
