declare module '@solana/wallet-standard-features';

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

declare module 'quill' {
  class Quill {
    constructor(container: string | Element, options?: any);
    [key: string]: any;
  }
  export = Quill;
}

// Suppress testing library types to avoid conflicts
declare module '@testing-library/jest-dom' {
  const content: any;
  export = content;
}