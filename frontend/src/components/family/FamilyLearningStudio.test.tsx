import React from 'react';
import { describe,it,expect,vi,beforeEach } from 'vitest';
import { render,screen,fireEvent,cleanup } from '@testing-library/react';
import { FamilyLearningStudio } from './FamilyLearningStudio';
import { LocaleProvider } from '../../context/LocaleContext';
import { setStoredLocale } from '../../localePreference';
import { setActiveProgressOwner } from '../../utils/progressOwner';
const state=vi.hoisted(()=>({premium:false,error:false}));
vi.mock('../../hooks/useCahierAccess',()=>({useCahierAccess:()=>({authUser:{id:7,role:state.premium?'ROLE_PREMIUM':'ROLE_FREE'},access:{premium:state.premium},error:state.error,loading:false,refresh:vi.fn()})}));
vi.mock('../PremiumOffer',()=>({PremiumOffer:()=> <button>Discover Premium</button>}));
const mount=()=>render(<LocaleProvider><FamilyLearningStudio grade="3AP"/></LocaleProvider>);
describe('family studio',()=>{
 beforeEach(()=>{cleanup();localStorage.clear();setStoredLocale('fr');setActiveProgressOwner(7,1);state.premium=false;state.error=false;});
 it('gives a genuine free exercise but excludes full program printing',()=>{mount();expect(screen.getByText(/Écris le nombre qui suit 748/)).toBeInTheDocument();expect(screen.queryByText(/quel est le chiffre des dizaines/)).not.toBeInTheDocument();expect(screen.queryByRole('button',{name:'Imprimer le programme'})).not.toBeInTheDocument();});
 it('offers all services and an interactive free market mission',()=>{mount();for(const name of ['Cahiers de vacances','Préparer la rentrée','Ma semaine guidée','Avant une évaluation','Laboratoires Premium'])expect(screen.getByRole('button',{name:new RegExp(name)})).toBeInTheDocument();fireEvent.click(screen.getByRole('button',{name:/Laboratoires Premium/}));for(let i=0;i<4;i++)fireEvent.click(screen.getByRole('button',{name:'Ajouter un sachet'}));fireEvent.click(screen.getByRole('button',{name:'Vérifier'}));fireEvent.click(screen.getByRole('button',{name:'Continuer'}));expect(screen.getByText(/Mission découverte terminée/)).toBeInTheDocument();expect(screen.queryByText(/Quel est le total/)).not.toBeInTheDocument();});
 it('Premium opens the complete corrected session and its print program',()=>{state.premium=true;mount();expect(screen.getByText(/quel est le chiffre des dizaines/)).toBeInTheDocument();fireEvent.click(screen.getByRole('button',{name:'Imprimer le programme'}));expect(document.querySelectorAll('.family-print-page')).toHaveLength(5);fireEvent.click(screen.getByRole('button',{name:'Afficher les corrigés'}));expect(document.querySelectorAll('.family-answer-space')).toHaveLength(0);fireEvent.click(screen.getByRole('button',{name:'Fermer'}));});
 it('saves a real failed attempt to the active child without granting mastery',()=>{mount();fireEvent.change(screen.getByRole('textbox'),{target:{value:'0'}});fireEvent.click(screen.getByRole('button',{name:'Vérifier ma réponse'}));const saved=JSON.parse(localStorage.getItem('mssid_family_learning_v1:user:7:child:1:3AP')!);expect(saved['3AP-n1'].outcome).toBe('review');expect(localStorage.getItem('mssid_family_learning_v1:user:7:child:2:3AP')).toBeNull();});
 it('keeps discovery available during API failure and never opens Premium by error',()=>{state.error=true;mount();expect(screen.getByRole('alert')).toHaveTextContent('Accès Premium indisponible');expect(screen.queryByRole('button',{name:'Imprimer la séance'})).not.toBeInTheDocument();});
});
