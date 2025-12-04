/* eslint-disable @typescript-eslint/no-unused-vars */
import { WebStorage } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

interface NoopStorage {
  getItem(_key: string): Promise<null>;
  setItem(_key: string, value: any): Promise<any>;
  removeItem(_key: string): Promise<void>;
}

const createNoopStorage = (): NoopStorage => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

// Define the type for the storage object which can be either WebStorage or NoopStorage
type StorageType = WebStorage | NoopStorage;

// Check if the window object is available to determine which storage to use
const storage: StorageType =
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage();

export default storage;
