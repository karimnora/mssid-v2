import React from 'react';
import {it,expect,afterEach,vi} from 'vitest';
import {render,screen,cleanup,act} from '@testing-library/react';
import {LocaleProvider} from '../../context/LocaleContext';
import {setStoredLocale} from '../../localePreference';
import {setActiveProgressOwner} from '../../utils/progressOwner';
import {recordMusaidiHelp} from '../../utils/musaidiHistory';
import type {CourseLesson} from '../../types';
import {MusaidiParentSummary} from './MusaidiParentSummary';
afterEach(()=>{cleanup();setActiveProgressOwner();localStorage.clear();});
it('removes the first child help counts immediately on switching to a sibling',()=>{
 setStoredLocale('fr');setActiveProgressOwner(8,1);
 recordMusaidiHelp('user:8:child:1',{lessonId:'math-5ap-fractions',grade:'5AP'});
 render(<LocaleProvider><MusaidiParentSummary grade="5AP" courses={[{id:'math-5ap-fractions',grade:'5AP',titleAr:'الكسور'} as CourseLesson]} onReview={vi.fn()}/></LocaleProvider>);
 expect(screen.getByText(/Aide demandée/)).toBeInTheDocument();
 act(()=>setActiveProgressOwner(8,2));
 expect(screen.queryByText(/Aide demandée/)).not.toBeInTheDocument();
});
