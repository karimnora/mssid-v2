import React from 'react';
import {describe,it,expect,vi,afterEach} from 'vitest';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {LessonQuizPanel} from './lessonViewer/LessonQuizPanel';
import {LocaleProvider} from '../context/LocaleContext';
import {setStoredLocale} from '../localePreference';
import type {CourseLesson,QuizQuestion} from '../types';
vi.mock('../utils/speech',()=>({speakText:vi.fn(),stopSpeech:vi.fn()}));
afterEach(cleanup);
it('keeps guided practice separate from the real quiz answer and score',()=>{
 setStoredLocale('fr');const select=vi.fn();const q={id:'q1',questionAr:'Question réelle',competenceId:'math-1ap-c-spatial-position',options:[{id:'a',textAr:'Réponse réelle',isCorrect:true},{id:'b',textAr:'Autre réponse',isCorrect:false}]} as QuizQuestion;
 const lesson={id:'math-1ap-t1-spatial-relations',grade:'1AP',subject:'math',quiz:[q]} as CourseLesson;
 render(<LessonQuizPanel lesson={lesson} shuffledQuiz={[q]} selectedAnswers={{}} recentAnswerId={null} renderArabicText={s=>s??''} onSelectOption={select} onShuffle={vi.fn()} onReset={vi.fn()}/>,{wrapper:LocaleProvider});
 fireEvent.click(screen.getByRole('button',{name:'J’ai besoin d’aide'}));fireEvent.click(screen.getByRole('button',{name:'Un exemple similaire'}));fireEvent.click(screen.getByRole('button',{name:'Sous la chaise.'}));
 expect(select).not.toHaveBeenCalled();expect(screen.queryByText('100%')).not.toBeInTheDocument();
 fireEvent.click(screen.getByRole('button',{name:/Réponse réelle/}));expect(select).toHaveBeenCalledWith('q1','a');
});
