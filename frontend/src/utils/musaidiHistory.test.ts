import {beforeEach,it,expect} from 'vitest';
import {readMusaidiHelp,recordMusaidiHelp} from './musaidiHistory';
beforeEach(()=>localStorage.clear());
it('isolates two children in the same family and persists actual help requests',()=>{
 const entry={lessonId:'math-5ap-fractions',competenceId:'math-5ap-c-fractions',grade:'5AP' as const};
 recordMusaidiHelp('user:7:child:1',entry);recordMusaidiHelp('user:7:child:1',entry);
 expect(readMusaidiHelp('user:7:child:1')[0].count).toBe(2);
 expect(readMusaidiHelp('user:7:child:2')).toEqual([]);
});
it('ignores damaged stored records',()=>{
 localStorage.setItem('mssid_musaidi_help_v1:guest',JSON.stringify([{lessonId:'x',grade:'5AP',count:'3'}]));
 expect(readMusaidiHelp('guest')).toEqual([]);
});
