import { useState, useEffect, createContext, useContext } from 'react';

interface AuthContextType {
  user: { email: string } | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const adminUser = localStorage.getItem('adminUser');
    if (adminUser) {
      setUser(JSON.parse(adminUser));
    }
  }, []);

  const signIn = async (username: string, password: string) => {
    if (username === 'admin' && password === 'rupdhari') {
      const adminUser = { email: 'admin@rupdhari.com' };
      setUser(adminUser);
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      return { error: null };
    }
    return { error: { message: 'Invalid credentials' } };
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('adminUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};