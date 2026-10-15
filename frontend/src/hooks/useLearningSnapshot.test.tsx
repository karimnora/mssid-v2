import {it,expect,vi,beforeEach,afterEach} from 'vitest';
import {renderHook,waitFor,act,cleanup} from '@testing-library/react';
import {useLearningSnapshot} from './useLearningSnapshot';
import {AuthService} from '../services/authService';
import {springBootApi} from '../services/springBootApi';
import {cleanLearningResults} from '../utils/learningSnapshot';
const read=()=>cleanLearningResults(JSON.parse(localStorage.getItem('snapshot')??'{}'));
beforeEach(()=>{localStorage.clear();vi.spyOn(AuthService,'getCurrentUser').mockReturnValue({id:7} as never);vi.spyOn(springBootApi,'getLearningSnapshot').mockResolvedValue({status:200,data:{}});vi.spyOn(springBootApi,'saveLearningSnapshot').mockImplementation(async(_,__,r)=>({status:200,data:r}));});
afterEach(()=>{cleanup();vi.restoreAllMocks();});
it('imports remote observations for the correct child and retains unsent local work',async()=>{
 localStorage.setItem('snapshot',JSON.stringify({local:{outcome:'helped',at:'2026-10-15T09:00:00Z'}}));
 vi.mocked(springBootApi.getLearningSnapshot).mockResolvedValue({status:200,data:{remote:{outcome:'independent',at:'2026-10-15T10:00:00Z'}}});
 const {result}=renderHook(()=>useLearningSnapshot('user:7:child:2','family-2AP','snapshot',read));
 await waitFor(()=>expect(result.current.status).toBe('synced'));expect(Object.keys(result.current.results)).toEqual(expect.arrayContaining(['local','remote']));expect(springBootApi.saveLearningSnapshot).toHaveBeenCalledWith('family-2AP',2,expect.any(Object));
});
it('keeps offline results and retries explicitly without claiming synchronization',async()=>{
 vi.mocked(springBootApi.getLearningSnapshot).mockResolvedValueOnce({status:0,error:'offline'});
 const {result}=renderHook(()=>useLearningSnapshot('user:7','family-2AP','snapshot',read));
 await waitFor(()=>expect(result.current.status).toBe('pending'));act(()=>result.current.save({a:{outcome:'review',at:'2026-10-15T10:00:00Z'}}));expect(read().a).toBeDefined();act(()=>result.current.refresh());await waitFor(()=>expect(result.current.status).toBe('synced'));
});
it('ignores late responses after account switch',async()=>{
 let resolve!: (v:any)=>void;vi.mocked(springBootApi.getLearningSnapshot).mockReturnValue(new Promise(r=>{resolve=r;}));
 const {result,unmount}=renderHook(()=>useLearningSnapshot('user:7:child:2','family-2AP','snapshot',read));
 vi.mocked(AuthService.getCurrentUser).mockReturnValue({id:8} as never);await act(async()=>resolve({status:200,data:{foreign:{outcome:'independent',at:'2026-10-15T10:00:00Z'}}}));expect(result.current.results).toEqual({});expect(localStorage.getItem('snapshot')).toBeNull();expect(springBootApi.saveLearningSnapshot).not.toHaveBeenCalled();unmount();
});
it('does not send guest observations to an account',()=>{renderHook(()=>useLearningSnapshot('guest','family-2AP','snapshot',read));expect(springBootApi.getLearningSnapshot).not.toHaveBeenCalled();});

it('can synchronize the current result even when browser storage is full',async()=>{
 vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('quota');});
 const {result}=renderHook(()=>useLearningSnapshot('user:7','family-2AP','snapshot',read));await waitFor(()=>expect(result.current.status).toBe('synced'));
 act(()=>{result.current.save({a:{outcome:'helped',at:'2026-10-15T10:00:00Z'}});result.current.refresh();});
 await waitFor(()=>expect(springBootApi.saveLearningSnapshot).toHaveBeenCalledWith('family-2AP',undefined,expect.objectContaining({a:expect.anything()})));expect(result.current.results.a.outcome).toBe('helped');expect(result.current.storageError).toBe(true);
});
