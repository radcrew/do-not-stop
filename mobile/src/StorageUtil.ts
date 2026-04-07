import AsyncStorage from '@react-native-async-storage/async-storage';
import { Storage } from '@reown/appkit-react-native';

// Custom storage implementation using AsyncStorage
export const storage: Storage = {
    async getKeys(): Promise<string[]> {
        try {
            return [...(await AsyncStorage.getAllKeys())];
        } catch (error) {
            console.error('Error getting storage keys:', error);
            return [];
        }
    },

    async getEntries<T = any>(): Promise<[string, T][]> {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const entries: [string, T][] = [];

            for (const key of keys) {
                const value = await AsyncStorage.getItem(key);
                if (value !== null) {
                    try {
                        entries.push([key, JSON.parse(value)]);
                    } catch {
                        entries.push([key, value as T]);
                    }
                }
            }

            return entries;
        } catch (error) {
            console.error('Error getting storage entries:', error);
            return [];
        }
    },

    async getItem<T = any>(key: string): Promise<T | undefined> {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value === null) return undefined;

            try {
                return JSON.parse(value);
            } catch {
                return value as T;
            }
        } catch (error) {
            console.error('Error getting storage item:', error);
            return undefined;
        }
    },

    async setItem<T = any>(key: string, value: T): Promise<void> {
        try {
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
            await AsyncStorage.setItem(key, stringValue);
        } catch (error) {
            console.error('Error setting storage item:', error);
        }
    },

    async removeItem(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing storage item:', error);
        }
    },
};
