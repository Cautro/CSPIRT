/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL?: string
    // добавь свои переменные окружения сюда
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}