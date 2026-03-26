import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const withCredentialsEnv = import.meta.env.VITE_WITH_CREDENTIALS;
const withCredentials =
    withCredentialsEnv === true ||
    withCredentialsEnv === 'true' ||
    withCredentialsEnv === '1';

if (!apiBaseUrl) {
    throw new Error(
        'Konfigurasi tidak lengkap: VITE_API_BASE_URL belum diset di file .env. ' +
            'Salin .env.example menjadi .env dan sesuaikan nilainya.',
    );
}

const apiClient = axios.create({
    baseURL: apiBaseUrl,
    withCredentials,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

// Selalu tulis VITE_API_KEY ke sessionStorage (overwrite key lama dari deploy sebelumnya)
const envApiKey = import.meta.env.VITE_API_KEY as string | undefined;
if (envApiKey) {
    sessionStorage.setItem('api_key', envApiKey);
}

// Interceptor to add X-API-Key header from stored key
apiClient.interceptors.request.use((config) => {
    const apiKey = sessionStorage.getItem('api_key');
    if (apiKey) {
        config.headers['X-API-Key'] = apiKey;
    }
    return config;
});

export default apiClient;
