import { beforeEach, describe, expect, test } from "vitest";
import { localStorageService } from "./localStorage";

describe('LocalStorage service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('get return empty value', () => {
    expect(localStorageService.get('empty')).toBe('');
  });

  test('get no emoty value', () => {
    localStorage.setItem('test', 'value');
    expect(localStorageService.get('test')).toBe('value');
  });

  test('set value', () => {
    localStorageService.set('test', 'value');
    expect(localStorage.getItem('test')).toBe('value');
  })
})