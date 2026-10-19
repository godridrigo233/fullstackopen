import AsyncStorage from '@react-native-async-storage/async-storage';

export class AuthStorage {
  private readonly key: string;

  constructor(namespace = 'rate-repository') {
    this.key = `${namespace}:access-token`;
  }

  getAccessToken(): Promise<string | null> {
    return AsyncStorage.getItem(this.key);
  }

  setAccessToken(accessToken: string): Promise<void> {
    return AsyncStorage.setItem(this.key, accessToken);
  }

  removeAccessToken(): Promise<void> {
    return AsyncStorage.removeItem(this.key);
  }
}

export const authStorage = new AuthStorage();
