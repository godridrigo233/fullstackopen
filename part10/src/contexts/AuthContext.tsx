import { useApolloClient } from '@apollo/client/react';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { authStorage } from '../utils/authStorage';

type AuthContextValue = {
  accessToken: string | null;
  isLoading: boolean;
  storageError: string | null;
  signIn: (accessToken: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const client = useApolloClient();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    authStorage
      .getAccessToken()
      .then(setAccessToken)
      .catch((error: unknown) => {
        setStorageError(
          error instanceof Error
            ? error.message
            : 'Unable to read saved authentication.',
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  const signIn = useCallback(async (token: string) => {
    await authStorage.setAccessToken(token);
    setAccessToken(token);
  }, []);

  const signOut = useCallback(async () => {
    await authStorage.removeAccessToken();
    setAccessToken(null);
    await client.clearStore();
  }, [client]);

  const value = useMemo(
    () => ({ accessToken, isLoading, storageError, signIn, signOut }),
    [accessToken, isLoading, storageError, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }
  return context;
};
