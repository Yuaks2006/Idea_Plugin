/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly API_KEY: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}
