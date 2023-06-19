interface GlobConfig {
    title: string;
    apiUrl: string;
    urlPrefix?: string;
    uploadUrl?: string
}

export interface GlobEnvConfig {
    // Site title
    VITE_GLOB_APP_TITLE: string;
    // Service interface url
    VITE_GLOB_API_URL: string;
    // Service interface url prefix
    VITE_GLOB_API_URL_PREFIX?: string;
    // Upload url
    VITE_GLOB_UPLOAD_URL?: string;
}

const useViteEnv = (): Readonly<GlobConfig> => {
    const ENV = (import.meta as ImportMeta).env as unknown as GlobEnvConfig;
    const {
        VITE_GLOB_APP_TITLE,
        VITE_GLOB_API_URL,
        VITE_GLOB_API_URL_PREFIX,
        VITE_GLOB_UPLOAD_URL
    } = ENV;
    const glob: Readonly<GlobConfig> = {
        title: VITE_GLOB_APP_TITLE,
        apiUrl: VITE_GLOB_API_URL,
        urlPrefix: VITE_GLOB_API_URL_PREFIX,
        uploadUrl: VITE_GLOB_UPLOAD_URL
    };
    return glob as Readonly<GlobConfig>;
};

export {
    useViteEnv
};
