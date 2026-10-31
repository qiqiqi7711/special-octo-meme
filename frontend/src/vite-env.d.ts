/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 后端 API 地址；本地开发默认 /api（走 vite 代理），部署时填完整地址。 */
  readonly VITE_API_BASE_URL?: string;
  /** "true" 时走 mock 数据，否则走真实后端。 */
  readonly VITE_USE_MOCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
