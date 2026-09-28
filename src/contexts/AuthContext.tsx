import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Address } from '@/types/product';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  addresses: Address[];
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Mock user for demo purposes
const mockUser: User = {
  id: 'user-1',
  email: 'demo@StitchAndStone.com',
  firstName: 'Alex',
  lastName: 'Johnson',
  phone: '+1 (555) 123-4567',
};

const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    firstName: 'Alex',
    lastName: 'Johnson',
    street: '456 Fashion District Blvd',
    apartment: 'Suite 12',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'United States',
    phone: '+1 (555) 123-4567',
    isDefault: true,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    addresses: [],
  });

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('stitch-stone-user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          addresses: mockAddresses,
        });
      } catch {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Demo login - accept any email/password for now
    if (email && password) {
      const user = { ...mockUser, email };
      localStorage.setItem('stitch-stone-user', JSON.stringify(user));
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        addresses: mockAddresses,
      });
      return { success: true };
    }

    return { success: false, error: 'Invalid credentials' };
  };

  const register = async (data: RegisterData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    };

    localStorage.setItem('stitch-stone-user', JSON.stringify(user));
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
      addresses: [],
    });

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('stitch-stone-user');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      addresses: [],
    });
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!state.user) return;
    
    const updatedUser = { ...state.user, ...data };
    localStorage.setItem('stitch-stone-user', JSON.stringify(updatedUser));
    setState((prev) => ({ ...prev, user: updatedUser }));
  };

  const addAddress = async (address: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...address,
      id: `addr-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      addresses: [...prev.addresses, newAddress],
    }));
  };

  const updateAddress = async (id: string, address: Partial<Address>) => {
    setState((prev) => ({
      ...prev,
      addresses: prev.addresses.map((a) =>
        a.id === id ? { ...a, ...address } : a
      ),
    }));
  };

  const deleteAddress = async (id: string) => {
    setState((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((a) => a.id !== id),
    }));
  };

  const setDefaultAddress = async (id: string) => {
    setState((prev) => ({
      ...prev,
      addresses: prev.addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      })),
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
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
