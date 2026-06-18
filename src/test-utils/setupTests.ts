import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';

beforeAll(() => {});

afterEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

afterAll(() => {});