import React from 'react';
import {it,expect} from 'vitest';
import {render} from '@testing-library/react';
import {MusaidiText} from './MusaidiText';
it('isolates fractions and operations without changing the prepared text',()=>{
 const text='احصر 23/5 بين عددين: 4 < 23/5 < 5';
 const {container}=render(<p dir="rtl"><MusaidiText text={text}/></p>);
 expect(container.textContent).toBe(text);
 expect([...container.querySelectorAll('bdi')].map(el=>el.textContent)).toEqual(['23/5','4 < 23/5 < 5']);
});
