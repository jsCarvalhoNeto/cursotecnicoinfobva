import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { login, logout, getCurrentUser, type UserProfile as AuthUserProfile } from '@/services/authService';
import { hasTemporaryPassword } from '@/services/studentService';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  student_registration?: string | null;
  phone?: string | null;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'admin' | 'student' | 'teacher';

interface AuthContextType {
  user: { id: string; email: string } | null;
  profile: UserProfile | null;
  userRole: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isStudent: boolean;
  isTeacher: boolean;
  hasTemporaryPassword: boolean;
  checkTemporaryPassword: (userId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
 const [hasTempPassword, setHasTempPassword] = useState(false);

  const setUserData = useCallback((authUser: AuthUserProfile | null) => {
    if (!authUser) {
      setUser(null);
      setProfile(null);
      setUserRole(null);
      setHasTempPassword(false);
      localStorage.removeItem('session');
      return;
    }

    const userData = { id: authUser.id, email: authUser.email };
    const profileData: UserProfile = {
      id: authUser.id,
      user_id: authUser.id,
      full_name: authUser.full_name,
      email: authUser.email,
      student_registration: null, // Pode ser obtido do backend se necessário
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Verificar se o usuário tem senha temporária (apenas para estudantes)
    if (authUser.role === 'student') {
      hasTemporaryPassword(authUser.id).then(isTemp => {
        setHasTempPassword(isTemp);
      }).catch(() => {
        setHasTempPassword(false);
      });
    } else {
      setHasTempPassword(false);
    }

    setUser(userData);
    setProfile(profileData);
    setUserRole(authUser.role as UserRole);
    localStorage.setItem('session', JSON.stringify({ user: userData }));
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        const sessionData = localStorage.getItem('session');
        if (sessionData) {
          const parsedSession = JSON.parse(sessionData);
          const loggedInUserEmail = parsedSession.user?.email;
          
          // Tentar obter informações do usuário atual via API
          const currentUser = await getCurrentUser();
          if (currentUser) {
            setUserData(currentUser);
          }
        }
      } catch (error) {
        console.error("Failed to parse session:", error);
        localStorage.removeItem('session');
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, [setUserData]);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    setLoading(true);
    
    try {
      const result = await login({ email, password });
      
      if (result.success && result.user) {
        setUserData(result.user);
        setLoading(false);
        return { error: null };
      } else {
        setLoading(false);
        return { error: result.error || 'Credenciais inválidas.' };
      }
    } catch (error) {
      setLoading(false);
      return { error: 'Erro de conexão com o servidor.' };
    }
  };

  const signOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
    setUserData(null);
    setHasTempPassword(false);
    localStorage.removeItem('session');
  };

  const checkTemporaryPassword = async (userId: string): Promise<boolean> => {
    return await hasTemporaryPassword(userId);
  };

  const value = {
    user,
    profile,
    userRole,
    loading,
    signIn,
    signOut,
    isAdmin: userRole === 'admin',
    isStudent: userRole === 'student',
    isTeacher: userRole === 'teacher',
    hasTemporaryPassword: hasTempPassword,
    checkTemporaryPassword,
  };

  return (
    <AuthContext.Provider value={value}>
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
