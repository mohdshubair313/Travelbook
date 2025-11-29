import { create } from 'zustand';
import { authClient } from '@/lib/auth-client';

interface User {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null;
    location?: string | null;
    userRoomCategory?: string | null;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    checkSession: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: true,
    checkSession: async () => {
        try {
            const { data } = await authClient.getSession();
            // @ts-ignore - better-auth types might be slightly different but compatible at runtime
            set({ user: data?.user || null, isLoading: false });
        } catch (error) {
            set({ user: null, isLoading: false });
        }
    },
    logout: async () => {
        await authClient.signOut();
        set({ user: null });
    }
}));
