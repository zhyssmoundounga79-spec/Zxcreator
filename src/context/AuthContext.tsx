import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
  plan: 'free' | 'pro' | 'elite';
  balance: number;
  referralCode?: string;
  lastDailyBonus?: string;
  affiliateEarnings?: number;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateBalance: (newBalance: number) => void;
  claimDailyBonus: () => Promise<void>;
  isLoading: boolean;
  reloadUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = () => {
    fetch('/api/auth/me')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Not logged in');
      })
      .then(data => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (userData: User) => setUser(userData);
  const logout = () => {
    fetch('/api/auth/logout', { method: 'POST' }).then(() => setUser(null));
  };

  const updateBalance = (newBalance: number) => {
    if (user) {
      setUser({ ...user, balance: newBalance });
    }
  };

  const claimDailyBonus = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/auth/daily-bonus', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setUser({ ...user, balance: data.balance, lastDailyBonus: data.lastDailyBonus });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Failed to claim bonus:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateBalance, claimDailyBonus, isLoading, reloadUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
