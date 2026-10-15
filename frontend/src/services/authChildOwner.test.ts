import {beforeEach,it,expect} from 'vitest';
import {AuthService} from './authService';
import {getActiveProgressOwner,setActiveProgressOwner} from '../utils/progressOwner';
import type {AuthUser} from '../types/auth';
const parent={id:7,nom:'Parent',role:'ROLE_FREE'} as AuthUser;
beforeEach(()=>{AuthService.setCurrentUser(null);localStorage.clear();});
it('preserves the active child on a refresh or update of the same parent',()=>{
 AuthService.setCurrentUser(parent);setActiveProgressOwner(7,11);AuthService.setCurrentUser({...parent,nom:'Parent modifié'});expect(getActiveProgressOwner()).toBe('user:7:child:11');
});
it('never carries a child selection into another account or logout',()=>{
 AuthService.setCurrentUser(parent);setActiveProgressOwner(7,11);AuthService.setCurrentUser({...parent,id:8});expect(getActiveProgressOwner()).toBe('user:8');AuthService.setCurrentUser(null);expect(getActiveProgressOwner()).toBe('guest');
});
