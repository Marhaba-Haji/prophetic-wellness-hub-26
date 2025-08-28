// Solana wallet types
declare module '@solana/wallet-standard-features' {
  export interface SolanaSignInInput {
    domain?: string;
    address?: string;
    statement?: string;
    uri?: string;
    version?: string;
    chainId?: string;
    nonce?: string;
    issuedAt?: string;
    expirationTime?: string;
    notBefore?: string;
    requestId?: string;
    resources?: string[];
  }
  
  export interface SolanaSignInOutput {
    account: {
      address: string;
      publicKey: Uint8Array;
    };
    signedMessage: Uint8Array;
    signature: Uint8Array;
  }
}

// React Quill types
declare module 'react-quill' {
  import { Component } from 'react';
  
  export interface ReactQuillProps {
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    readOnly?: boolean;
    onChange?: (content: string, delta: any, source: string, editor: any) => void;
    modules?: any;
    formats?: string[];
    theme?: string;
    style?: React.CSSProperties;
    className?: string;
    id?: string;
    [key: string]: any;
  }
  
  export default class ReactQuill extends Component<ReactQuillProps> {}
}

// Quill types
declare module 'quill' {
  interface QuillOptionsStatic {
    theme?: string;
    modules?: any;
    formats?: string[];
    [key: string]: any;
  }
  
  interface DeltaStatic {
    ops?: any[];
    [key: string]: any;
  }
  
  interface RangeStatic {
    index: number;
    length: number;
  }
  
  interface BoundsStatic {
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
  }
  
  interface StringMap {
    [key: string]: any;
  }
  
  type Sources = 'api' | 'user' | 'silent';
  
  class Quill {
    constructor(container: string | Element, options?: QuillOptionsStatic);
    [key: string]: any;
  }
  
  export = Quill;
  export { QuillOptionsStatic, DeltaStatic, RangeStatic, BoundsStatic, StringMap, Sources };
}

// Testing library types - suppress to avoid conflicts
declare module '@testing-library/jest-dom' {
  const content: any;
  export = content;
}

// Suppress all problematic type definitions
declare module '@tanstack/query-core/build/legacy/*' {
  const content: any;
  export = content;
}

declare module 'react-router/dom' {
  // Simple re-export without circular references
  const content: any;
  export = content;
}

// Skip type checking for development
declare var __DEV__: boolean;