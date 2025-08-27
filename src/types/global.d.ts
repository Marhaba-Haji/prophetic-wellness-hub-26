/// <reference types="vite/client" />

declare module '*.tsx' {
  const component: React.ComponentType<any>;
  export default component;
}

declare module '*.ts' {
  const content: any;
  export default content;
}

declare module '@/components/ui/sonner';
declare module '@/components/ui/tooltip';
declare module '@/components/providers/HelmetProvider';
declare module '@/components/ScrollToTop';

// Override problematic types
declare module '@solana/wallet-standard-features' {
  export const content: any;
}

declare module 'quill' {
  export interface QuillOptionsStatic {
    [key: string]: any;
  }
  export interface DeltaStatic {
    [key: string]: any;
  }
  export interface RangeStatic {
    [key: string]: any;
  }
  export interface BoundsStatic {
    [key: string]: any;
  }
  export interface StringMap {
    [key: string]: any;
  }
  export interface Sources {
    [key: string]: any;
  }
}

declare global {
  interface ImportMetaEnv {
    readonly MODE: string;
    readonly DEV: boolean;
    readonly PROD: boolean;
    readonly SSR: boolean;
  }
}

export {};