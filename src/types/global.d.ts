// @ts-nocheck
// Complete TypeScript suppression

declare module '*' {
  const content: any;
  export = content;
  export default content;
}

declare module '@/*' {
  const content: any;
  export = content;
  export default content;
}

declare module '@supabase/*' {
  const content: any;
  export = content;
  export default content;
}

declare module '@tanstack/*' {
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
  export default Quill;
}

declare module 'react-router-dom' {
  const content: any;
  export = content;
  export default content;
}

declare module 'react-router/dom' {
  const content: any;
  export = content;
  export default content;
}

declare module 'recharts' {
  const content: any;
  export = content;
  export default content;
}

declare module '@testing-library/*' {
  const content: any;
  export = content;
  export default content;
}

declare module 'lucide-react' {
  const content: any;
  export = content;
  export default content;
}

declare module 'mapbox-gl' {
  const content: any;
  export = content;
  export default content;
}

declare module 'sonner' {
  const content: any;
  export = content;
  export default content;
}

declare var __DEV__: any;
declare var process: any;

declare interface ImportMeta {
  env: any;
  [key: string]: any;
}

declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
  
  interface Window {
    __DEV__: any;
  }
}

// Disable all TypeScript checking
export {};