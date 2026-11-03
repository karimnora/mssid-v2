import React from 'react';
import {describe,it,expect,vi,beforeEach,afterEach} from 'vitest';
import {render,screen,fireEvent,waitFor,cleanup} from '@testing-library/react';
import {Capacitor} from '@capacitor/core';
import {SubscriptionPaywall} from './SubscriptionPaywall';
import {LocaleProvider} from '../context/LocaleContext';
import {setStoredLocale} from '../localePreference';
import {AuthService} from '../services/authService';
import {springBootApi} from '../services/springBootApi';
import {canUseWebCheckout} from '../utils/paymentPlatform';
import {BrandWebsiteLink} from './BrandWebsiteLink';
const user={id:7,nom:'Parent',email:'parent@test.invalid',role:'ROLE_FREE' as const};
const show=()=>render(<SubscriptionPaywall parentVerified user={user} onClose={vi.fn()} onSuccessUpgrade={vi.fn()}/>,{wrapper:LocaleProvider});
beforeEach(()=>{setStoredLocale('fr');AuthService.setCurrentUser(user);});
afterEach(()=>{cleanup();vi.restoreAllMocks();AuthService.setCurrentUser(null);});
describe('Web checkout and native consumption',()=>{
 it('retains checkout in a mobile Android browser',()=>{
  vi.spyOn(navigator,'userAgent','get').mockReturnValue('Android');vi.spyOn(Capacitor,'isNativePlatform').mockReturnValue(false);expect(canUseWebCheckout()).toBe(true);show();expect(document.querySelector('input[type=file]')).not.toBeNull();expect(screen.getAllByRole('radio')).toHaveLength(2);
 });
 it('never renders prices, receipt form or purchase links in a native direct entry',async()=>{
  vi.spyOn(Capacitor,'isNativePlatform').mockReturnValue(true);
  vi.spyOn(springBootApi,'getSubscriptionStatus').mockResolvedValue({status:200,data:{status:'ACTIVE',startDate:'2026-10-10',endDate:'2027-10-10'}});
  vi.spyOn(springBootApi,'fetchCurrentUser').mockResolvedValue({status:200,data:{...user,role:'ROLE_PREMIUM'}});
  show();await waitFor(()=>expect(screen.getByRole('status')).toHaveTextContent('Abonnement actif'));
  expect(screen.getByText(/2027/)).toBeInTheDocument();expect(document.querySelector('input[type=file],form,a')).toBeNull();expect(screen.queryAllByRole('radio')).toHaveLength(0);expect(AuthService.getCurrentUser()?.role).toBe('ROLE_PREMIUM');
  fireEvent.click(screen.getByRole('button',{name:'Actualiser mes accès'}));await waitFor(()=>expect(springBootApi.getSubscriptionStatus).toHaveBeenCalledTimes(2));
 });
 it('blocks receipt API submission in native even if called directly',async()=>{
  vi.spyOn(Capacitor,'isNativePlatform').mockReturnValue(true);await expect(springBootApi.submitReceipt({paymentMethod:'BARIDIMOB',amountDzd:900,transactionRef:'test',receiptImageUrl:'data:test'})).rejects.toThrow('only');
 });
 it('does not grant premium or show a confirmed status on network failure',async()=>{
  vi.spyOn(Capacitor,'isNativePlatform').mockReturnValue(true);vi.spyOn(springBootApi,'getSubscriptionStatus').mockResolvedValue({status:503,error:'offline'});vi.spyOn(springBootApi,'fetchCurrentUser').mockResolvedValue({status:503,error:'offline'});
  show();await screen.findByRole('alert');expect(AuthService.getCurrentUser()?.role).toBe('ROLE_FREE');expect(screen.getByRole('status')).toHaveTextContent('Statut non confirmé');
 });
 it('ignores a delayed refresh after the signed-in account changes',async()=>{
  vi.spyOn(Capacitor,'isNativePlatform').mockReturnValue(true);let finish!:(value:any)=>void;
  vi.spyOn(springBootApi,'getSubscriptionStatus').mockImplementation(()=>new Promise(resolve=>{finish=resolve;}));
  vi.spyOn(springBootApi,'fetchCurrentUser').mockResolvedValue({status:200,data:{...user,role:'ROLE_PREMIUM'}});
  show();AuthService.setCurrentUser({...user,id:8,email:'other@test.invalid'});finish({status:200,data:{status:'ACTIVE',startDate:null,endDate:'2027-10-10'}});
  await waitFor(()=>expect(screen.getByRole('status')).not.toHaveTextContent('Vérification en cours'));
  expect(AuthService.getCurrentUser()?.id).toBe(8);expect(AuthService.getCurrentUser()?.role).toBe('ROLE_FREE');expect(screen.queryByText(/2027/)).not.toBeInTheDocument();
 });
 it('allows guests to close the status view without fetching private account data',()=>{
  vi.spyOn(Capacitor,'isNativePlatform').mockReturnValue(true);AuthService.setCurrentUser(null);const status=vi.spyOn(springBootApi,'getSubscriptionStatus');
  const close=vi.fn();render(<SubscriptionPaywall user={null} onClose={close} onSuccessUpgrade={vi.fn()}/>,{wrapper:LocaleProvider});
  expect(screen.getByText(/Connecte-toi/)).toBeInTheDocument();fireEvent.click(screen.getByRole('button',{name:'Fermer'}));expect(close).toHaveBeenCalledOnce();expect(status).not.toHaveBeenCalled();
 });
 it('preserves printed branding without a native link to checkout',()=>{
  vi.spyOn(Capacitor,'isNativePlatform').mockReturnValue(true);render(<BrandWebsiteLink/>);expect(screen.getByText('mssid-dz.com')).toBeInTheDocument();expect(screen.queryByRole('link')).not.toBeInTheDocument();
 });
});
