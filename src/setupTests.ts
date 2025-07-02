import '@testing-library/jest-dom';

// Mock window.matchMedia for jsdom
globalThis.window.matchMedia = globalThis.window.matchMedia || function() {
  return {
    matches: false,
    media: '',
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  };
};

// Mock window.scrollTo for jsdom
globalThis.window.scrollTo = globalThis.window.scrollTo || (() => {}); 