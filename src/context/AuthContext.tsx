import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  state: string;
  highestQualification: string;
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  interests: string[];
  createdAt: string;
  avatarColor: string;
}

export interface NotificationPreferences {
  govtPostings: boolean;
  privateJobs: boolean;
  breakingNews: boolean;
  admitCardsAndResults: boolean;
  welfareYojana: boolean;
  preferredLanguage: 'hi' | 'en' | 'both';
  selectedStates: string[];
  frequency: 'instant' | 'daily';
  browserPushEnabled: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (userData: {
    name: string;
    email: string;
    password: string;
    state?: string;
    qualification?: string;
    category?: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  updatePasswordWithToken: (email: string, token: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (updatedData: Partial<UserProfile>) => void;
  notificationPreferences: NotificationPreferences;
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => void;
  loginAsDemoUser: () => void;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  govtPostings: true,
  privateJobs: true,
  breakingNews: true,
  admitCardsAndResults: true,
  welfareYojana: true,
  preferredLanguage: 'both',
  selectedStates: ['All India (अखिल भारतीय)'],
  frequency: 'instant',
  browserPushEnabled: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'bharat_saathi_registered_users';
const CURRENT_USER_KEY = 'bharat_saathi_current_user';
const NOTIF_PREFS_KEY = 'bharat_saathi_notif_prefs';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>(() => {
    try {
      const saved = localStorage.getItem(NOTIF_PREFS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  // Pre-seed a friendly default demo user if empty
  useEffect(() => {
    try {
      const existingUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
      let usersMap = existingUsersRaw ? JSON.parse(existingUsersRaw) : {};

      if (!usersMap['rahul.sharma@bharat.in']) {
        usersMap['rahul.sharma@bharat.in'] = {
          id: 'user-demo-1',
          name: 'Rahul Sharma (राहुल शर्मा)',
          email: 'rahul.sharma@bharat.in',
          password: 'Password@123',
          phone: '+91 98765 43210',
          state: 'Uttar Pradesh (उत्तर प्रदेश)',
          highestQualification: 'Graduate',
          category: 'OBC',
          interests: ['SSC', 'Railways', 'Tech', 'Yojana'],
          createdAt: new Date().toISOString(),
          avatarColor: 'from-amber-500 to-orange-600',
        };
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersMap));
      }

      const activeUserRaw = localStorage.getItem(CURRENT_USER_KEY);
      if (activeUserRaw) {
        setUser(JSON.parse(activeUserRaw));
      }
    } catch (e) {
      console.error('Error loading auth state', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const existingUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
    const usersMap = existingUsersRaw ? JSON.parse(existingUsersRaw) : {};

    const existing = usersMap[trimmedEmail];
    if (!existing) {
      return { success: false, message: 'No account found with this email. Please Sign Up.' };
    }

    if (existing.password !== password) {
      return { success: false, message: 'Incorrect password. Try again or reset password.' };
    }

    const { password: _, ...userSafe } = existing;
    setUser(userSafe);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userSafe));
    return { success: true, message: 'Welcome back to Bharat Saathi!' };
  };

  const signup = async (userData: {
    name: string;
    email: string;
    password: string;
    state?: string;
    qualification?: string;
    category?: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  }): Promise<{ success: boolean; message: string }> => {
    const trimmedEmail = userData.email.trim().toLowerCase();
    const existingUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
    const usersMap = existingUsersRaw ? JSON.parse(existingUsersRaw) : {};

    if (usersMap[trimmedEmail]) {
      return { success: false, message: 'An account with this email already exists. Please log in.' };
    }

    const newUser: any = {
      id: `user-${Date.now()}`,
      name: userData.name.trim(),
      email: trimmedEmail,
      password: userData.password,
      state: userData.state || 'All India (अखिल भारतीय)',
      highestQualification: userData.qualification || 'Graduate',
      category: userData.category || 'General',
      interests: ['Govt', 'Jobs', 'News', 'Schemes'],
      createdAt: new Date().toISOString(),
      avatarColor: 'from-blue-500 to-indigo-600',
    };

    usersMap[trimmedEmail] = newUser;
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersMap));

    const { password: _, ...userSafe } = newUser;
    setUser(userSafe);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userSafe));
    return { success: true, message: 'Account created successfully!' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const existingUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
    const usersMap = existingUsersRaw ? JSON.parse(existingUsersRaw) : {};

    if (!usersMap[trimmedEmail]) {
      return { success: false, message: 'No registered user found with this email address.' };
    }

    // In a browser app, simulate sending a 6-digit OTP code to the email
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem(`reset_otp_${trimmedEmail}`, resetOtp);

    return {
      success: true,
      message: `Password reset OTP generated for ${trimmedEmail}: [ ${resetOtp} ]. (Check your inbox or enter this simulated OTP code to set new password).`,
    };
  };

  const updatePasswordWithToken = async (
    email: string,
    token: string,
    newPass: string
  ): Promise<{ success: boolean; message: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const savedOtp = sessionStorage.getItem(`reset_otp_${trimmedEmail}`);

    if (!savedOtp || savedOtp !== token.trim()) {
      return { success: false, message: 'Invalid or expired OTP code. Please request again.' };
    }

    const existingUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
    const usersMap = existingUsersRaw ? JSON.parse(existingUsersRaw) : {};

    if (!usersMap[trimmedEmail]) {
      return { success: false, message: 'User record not found.' };
    }

    usersMap[trimmedEmail].password = newPass;
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersMap));
    sessionStorage.removeItem(`reset_otp_${trimmedEmail}`);

    return { success: true, message: 'Password reset successfully! You can now log in.' };
  };

  const updateProfile = (updatedData: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    setUser(updated);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));

    // Also update storage map
    const existingUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
    const usersMap = existingUsersRaw ? JSON.parse(existingUsersRaw) : {};
    if (usersMap[user.email]) {
      usersMap[user.email] = { ...usersMap[user.email], ...updatedData };
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersMap));
    }
  };

  const updateNotificationPreferences = (prefs: Partial<NotificationPreferences>) => {
    setNotificationPreferences((prev) => {
      const next = { ...prev, ...prefs };
      localStorage.setItem(NOTIF_PREFS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const loginAsDemoUser = () => {
    const demoUser: UserProfile = {
      id: 'demo-citizen-1',
      name: 'Rahul Sharma (राहुल शर्मा)',
      email: 'rahul.sharma@bharat.in',
      phone: '+91 98765 43210',
      state: 'Uttar Pradesh (उत्तर प्रदेश)',
      highestQualification: 'Graduate',
      category: 'OBC',
      interests: ['SSC', 'Railways', 'Tech', 'Yojana'],
      createdAt: new Date().toISOString(),
      avatarColor: 'from-amber-500 to-orange-600',
    };
    setUser(demoUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(demoUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        resetPassword,
        updatePasswordWithToken,
        updateProfile,
        notificationPreferences,
        updateNotificationPreferences,
        loginAsDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
