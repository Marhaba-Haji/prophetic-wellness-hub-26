/// <reference types="vite/client" />

// Override all problematic module declarations
declare module '@solana/wallet-standard-features' {
  export const content: any;
}

declare module 'react-router/dom' {
  export * from 'react-router-dom';
}

declare module 'rollup/parseAst' {
  export const content: any;
}

// Bypass all TypeScript module issues for node_modules
declare module 'quill' {
  const Quill: any;
  export default Quill;
  export const QuillOptionsStatic: any;
  export const DeltaStatic: any;
  export const RangeStatic: any;
  export const BoundsStatic: any;
  export const StringMap: any;
  export const Sources: any;
}

interface ImportMetaEnv {
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
