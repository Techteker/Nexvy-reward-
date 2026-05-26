import { Client, Account, Databases, Storage, Avatars } from 'appwrite';

// Patch native WebSocket.prototype.send to avoid InvalidStateError crashes in libraries (like Appwrite SDK’s Realtime client)
// that call .send() while the connection is still in CONNECTING state.
if (typeof window !== 'undefined' && window.WebSocket) {
    const originalSend = window.WebSocket.prototype.send;
    window.WebSocket.prototype.send = function(this: WebSocket, data: string | ArrayBufferLike | Blob | ArrayBufferView) {
        if (this.readyState === window.WebSocket.CONNECTING) {
            console.debug('[WEBSOCKET-PATCH] Queueing send() payload - socket is still CONNECTING');
            const socket = this;
            const handleDelayedSend = function() {
                try {
                    if (socket.readyState === window.WebSocket.OPEN) {
                        originalSend.call(socket, data);
                    }
                } catch (err: any) {
                    console.debug('[WEBSOCKET-PATCH] Delayed send suppressed:', err.message || err);
                } finally {
                    socket.removeEventListener('open', handleDelayedSend);
                }
            };
            socket.addEventListener('open', handleDelayedSend);
            return;
        }

        try {
            return originalSend.call(this, data);
        } catch (err: any) {
            if (err.name === 'InvalidStateError' || (err.message && err.message.includes('CONNECTING'))) {
                console.warn('[WEBSOCKET-PATCH] Suppressed WebSocket send during invalid connection state:', err.message);
                return;
            }
            throw err;
        }
    };
}

// Silence specific Appwrite SDK internal WebSocket connection messages to keep the developer console clean
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args: any[]) => {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('Realtime got disconnected')) {
        console.debug('[APPWRITE-REALTIME] Connection idle or disconnected, auto-retry scheduled.');
        return;
    }
    originalConsoleError.apply(console, args);
};

console.warn = (...args: any[]) => {
    if (args[0] && typeof args[0] === 'string' && (
        args[0].includes('WebSocket state busy') || 
        args[0].includes('Appwrite is using localStorage') ||
        args[0].includes('Warning: ')
    )) {
        return;
    }
    originalConsoleWarn.apply(console, args);
};

const getLocalStorageItem = (key: string, defaultValue: string): string => {
    try {
        return localStorage.getItem(key) || defaultValue;
    } catch (e) {
        return defaultValue;
    }
};

const endpoint = getLocalStorageItem('VITE_APPWRITE_ENDPOINT', import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1');
const projectId = getLocalStorageItem('VITE_APPWRITE_PROJECT_ID', import.meta.env.VITE_APPWRITE_PROJECT_ID || '6a016eac001c0af48909');
const databaseId = getLocalStorageItem('VITE_APPWRITE_DATABASE_ID', import.meta.env.VITE_APPWRITE_DATABASE_ID || '67d163d8000b08051772');
const bucketId = getLocalStorageItem('VITE_APPWRITE_STORAGE_BUCKET_ID', import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID || '67d16b1c000c19b02a9e');

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId);

// Configuration check
if (import.meta.env.DEV) {
    console.log('[APPWRITE] Initialized dynamically with endpoint:', endpoint);
}

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
export { client };

export const APPWRITE_CONFIG = {
    databaseId: databaseId,
    collections: {
        users: 'users',
        tasks: 'tasks',
        task_categories: 'task_categories',
        task_submissions: 'submissions',
        task_progress: 'user_task_progress',
        task_analytics: 'task_analytics',
        task_reports: 'task_reports',
        quizzes: 'quizzes', // Legacy or combined
        submissions: 'submissions',
        withdrawals: 'withdrawals',
        notifications: 'notifications',
        leaderboard: 'leaderboard',
        transactions: 'transactions',
        referrals: 'referrals',
        settings: 'settings',
        logs: 'logs',
        activity: 'activity',
        affiliate_partners: 'affiliate_partners',
        affiliate_offers: 'affiliate_offers',
        affiliate_clicks: 'affiliate_clicks',
        affiliate_claims: 'affiliate_claims',
        affiliate_categories: 'affiliate_categories'
    },
    buckets: {
        uploads: bucketId
    }
};
