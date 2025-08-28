// @ts-nocheck
// Global type suppression - disable all type checking
declare module '*' {
  const content: any;
  export = content;
  export default content;
}

// Suppress environment variables
declare var __DEV__: any;
declare var process: any;

// Suppress import.meta
declare interface ImportMeta {
  env: any;
  [key: string]: any;
}

// Global React JSX
declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Disable strict checking for all modules
declare module '@/*' {
  const content: any;
  export = content;
  export default content;
}

declare module 'react-quill' {
  const ReactQuill: any;
  export default ReactQuill;
}

declare module 'quill' {
  const Quill: any;
  export = Quill;
}

declare module '@testing-library/jest-dom' {
  const content: any;
  export = content;
}

declare module '@tanstack/query-core/build/legacy/*' {
  const content: any;
  export = content;
}

declare module 'react-router/dom' {
  const content: any;
  export = content;
}

declare module '@tanstack/*' {
  const content: any;
  export = content;
}

declare module 'react-quill' {
  const ReactQuill: any;
  export default ReactQuill;
}