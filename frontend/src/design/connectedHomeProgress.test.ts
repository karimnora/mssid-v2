import { describe, expect, it } from 'vitest';
import type { CourseLesson } from '../types';
import { connectedHomeProgress } from './connectedHomeProgress';
const catalog = [{id:'one',grade:'1AP'},{id:'two',grade:'2AP'},{id:'three',grade:'2AP'}] as CourseLesson[];
describe('connected home progress', () => {
 it('counts only published lessons of the selected class and ignores duplicates or removed lessons', () => {
  expect(connectedHomeProgress('2AP',catalog,['one','two','two','removed'])).toEqual({total:2,completed:1});
 });
 it('shows a new class with its own denominator, never the previous class completion', () => {
  expect(connectedHomeProgress('1AP',catalog,['two','three'])).toEqual({total:1,completed:0});
 });
 it('distinguishes loading from an empty or completed catalog', () => {
  expect(connectedHomeProgress('2AP',null,['two'])).toEqual({total:null,completed:0});
  expect(connectedHomeProgress('5AP',catalog,[])).toEqual({total:0,completed:0});
  expect(connectedHomeProgress('2AP',catalog,['two','three'])).toEqual({total:2,completed:2});
 });
});
