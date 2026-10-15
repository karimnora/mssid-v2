import { useEffect, useState, useCallback, useRef } from 'react';
import { AuthService } from '../services/authService';
import { springBootApi } from '../services/springBootApi';
import type { FamilyResults } from '../utils/familyLearning';
import { cleanLearningResults, mergeLearningResults, sameLearningResults } from '../utils/learningSnapshot';
const EVENT='mssid-learning-snapshot';
export type LearningSyncStatus='local'|'syncing'|'synced'|'pending';
const EMPTY_RESULTS:FamilyResults={};
interface Snapshot { key:string; results:FamilyResults; status:LearningSyncStatus; storageError:boolean }
export function useLearningSnapshot(owner:string,scope:string,key:string,readLocal:()=>FamilyResults) {
 const [state,setState]=useState<Snapshot>(()=>({key,results:readLocal(),status:'local',storageError:false}));
 const memory=useRef({key,results:state.results});
 const [retry,setRetry]=useState(0);
 const refresh=useCallback(()=>setRetry(n=>n+1),[]);
 useEffect(()=> {
  let alive=true,busy=false,again=false;let timer:ReturnType<typeof setTimeout>|undefined;
  const match=/^user:(\d+)(?::child:(\d+))?$/.exec(owner);
  const accountId=match?Number(match[1]):undefined;const childId=match?.[2]?Number(match[2]):undefined;
  const current=()=>alive && (accountId===undefined || AuthService.getCurrentUser()?.id===accountId);
  if(memory.current.key!==key)memory.current={key,results:readLocal()};
  const local=()=>mergeLearningResults(readLocal(),memory.current.results);
  const persist=(results:FamilyResults,status:LearningSyncStatus)=> {
   if(!current())return;
   memory.current={key,results};
   let storageError=false;try{localStorage.setItem(key,JSON.stringify(results));}catch{storageError=true;}
   setState({key,results,status,storageError});
  };
  const sync=async()=> {
   if(!current() || !accountId)return;
   if(busy){again=true;return;}busy=true;setState(s=>({...s,status:'syncing'}));
   try {
    const remote=await springBootApi.getLearningSnapshot(scope,childId);
    if(!current())return;
    if(remote.error || !remote.data)throw new Error('read');
    let merged=mergeLearningResults(local(),cleanLearningResults(remote.data));
    persist(merged,'syncing');
    if(!sameLearningResults(merged,cleanLearningResults(remote.data))){
     const saved=await springBootApi.saveLearningSnapshot(scope,childId,merged);
     if(!current())return;
     if(saved.error || !saved.data)throw new Error('write');
     const acknowledged=cleanLearningResults(saved.data);
     merged=mergeLearningResults(local(),acknowledged);
     if(!sameLearningResults(merged,acknowledged))again=true;
    }
    persist(merged,'synced');
   }catch{if(current())setState(s=>({...s,status:'pending'}));}
   finally{busy=false;if(again&&current()){again=false;timer=setTimeout(()=>void sync(),500);}}
  };
  const changed=(event:Event)=> {
   if(event instanceof CustomEvent && event.detail!==key)return;
   if(event instanceof StorageEvent && event.key!==key)return;
   if(!current())return;
   setState(s=>({...s,results:local(),status:accountId?'syncing':'local'}));
   clearTimeout(timer);timer=setTimeout(()=>void sync(),500);
  };
  const wake=()=>{if(document.visibilityState!=='hidden')void sync();};
  setState({key,results:local(),status:'local',storageError:false});void sync();
  window.addEventListener(EVENT,changed);window.addEventListener('storage',changed);window.addEventListener('online',wake);window.addEventListener('focus',wake);
  return()=>{alive=false;clearTimeout(timer);window.removeEventListener(EVENT,changed);window.removeEventListener('storage',changed);window.removeEventListener('online',wake);window.removeEventListener('focus',wake);};
  // The reader belongs to the immutable owner/scope/key; consumers remount on owner change.
 },[owner,scope,key,retry]);
 const save=useCallback((results:FamilyResults)=>{
  memory.current={key,results};
  let storageError=false;try{localStorage.setItem(key,JSON.stringify(results));}catch{storageError=true;}
  setState(s=>({...s,key,results,storageError,status:owner==='guest'?'local':'pending'}));
  window.dispatchEvent(new CustomEvent(EVENT,{detail:key}));
 },[key,owner]);
 return {...state,results:state.key===key?state.results:EMPTY_RESULTS,save,refresh};
}
