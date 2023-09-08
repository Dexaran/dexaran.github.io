export const isProd = process.env.NODE_ENV === 'production';

export const basePath = isProd ? "/token-converter" : "";
