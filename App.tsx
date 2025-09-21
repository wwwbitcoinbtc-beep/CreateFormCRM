import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
// Corrected import statement
import UserManagement from './pages/UserManagement';
import CustomerList from './pages/CustomerList';
import PurchaseContracts from './pages/PurchaseContracts';
import SupportContracts from './pages/SupportContracts';
import Tickets from './pages/Tickets';
import ReportsPage from './pages/ReportsPage';
import LoginPage from './LoginPage';
import PlaceholderPage from './PlaceholderPage';
import ReferralsPage from './ReferralsPage';
import apiService, { socket } from './apiService'; 
import { User, Customer, PurchaseContract, SupportContract, Ticket, Referral } from './types';
import { MenuIcon } from './components/icons/MenuIcon';

declare const jalaali: any;

// Helper function to safely parse the accessibleMenus JSON string
const parseUserMenus = (user: User | null): User | null => {
  if (!user) return null;
  if (user.accessibleMenus && typeof user.accessibleMenus === 'string') {
    try {
      return { ...user, accessibleMenus: JSON.parse(user.accessibleMenus) };
    } catch (e) {
      console.error("Failed to parse accessibleMenus:", e);
      return { ...user, accessibleMenus: [] };
    }
  }
  return user;
};

function App() {
  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [purchaseContracts, setPurchaseContracts] = useState<PurchaseContract[]>([]);
  const [supportContracts, setSupportContracts] = useState<SupportContract[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  
  // App states
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- AUTH LOGIC ---
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userFromServer = await apiService.getMe();
          setCurrentUser(parseUserMenus(userFromServer));
        } catch (err) {
          apiService.logout();
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    };
    verifyToken();
  }, []);

  const handleLogout = useCallback(() => {
      apiService.logout();
      setCurrentUser(null);
      setUsers([]);
      setCustomers([]);
      setPurchaseContracts([]);
      setSupportContracts([]);
      setTickets([]);
      setReferrals([]);
  }, []);

  const handleLogin = async (username: string, password: string) => {
    try {
      setError(null);
      const { user } = await apiService.login({ username, password });
      const parsedUser = parseUserMenus(user);
      setCurrentUser(parsedUser);
      
      const menus = parsedUser?.accessibleMenus || [];
      const landingPage = menus.includes('*') || menus.includes('dashboard') ? 'dashboard' : menus[0] || 'no_access';
      setActivePage(landingPage);
    } catch (err: any) {
      setError(err.message || "نام کاربری یا رمز عبور اشتباه است.");
    }
  };

  // --- DATA FETCHING --- 
  const fetchData = useCallback(async () => {
      if (!currentUser) return;
      try {
        setDataLoading(true);
        setError(null);
        const [usersData, customersData, purchaseContractsData, supportContractsData, ticketsData, referralsData] = await Promise.all([
          apiService.getAll('users'),
          apiService.getAll('customers'),
          apiService.getAll('purchase-contracts'),
          apiService.getAll('support-contracts'),
          apiService.getAll('tickets'),
          apiService.getAll('referrals'),
        ]);
        setUsers(usersData);
        setCustomers(customersData);
        setPurchaseContracts(purchaseContractsData);
        setSupportContracts(supportContractsData);
        setTickets(ticketsData);
        setReferrals(referralsData);
      } catch (err: any) {
        setError("Failed to load data. Session may be expired.");
        if (String(err.message).includes("403") || String(err.message).includes("401")) {
            handleLogout(); 
        }
      } finally {
        setDataLoading(false);
      }
    }, [currentUser, handleLogout]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- DATA MANIPULATION HANDLERS ---
  const handleSaveUser = (userData: User | Omit<User, 'id'>) => {
    try {
      if ('id' in userData) apiService.update('users', String(userData.id), userData);
      else apiService.create('users', userData);
    } catch (error) { console.error("Failed to save user:", error); }
  };

  const handleDeleteUsers = async (userIds: number[]) => {
    try {
      await apiService.deleteMany('users', userIds.map(String));
      setUsers(prev => prev.filter(u => !userIds.includes(u.id))); // Optimistic update
    } catch (error) { console.error("Failed to delete users:", error); }
  };
  
  const handleSaveCustomer = (customerData: Customer | Omit<Customer, 'id'>) => {
    try {
      if ('id' in customerData) apiService.update('customers', String(customerData.id), customerData);
      else apiService.create('customers', customerData);
    } catch (error) { console.error("Failed to save customer:", error); }
  };

  const handleDeleteCustomers = async (customerIds: number[]) => {
    try {
      await apiService.deleteMany('customers', customerIds.map(String));
      setCustomers(prev => prev.filter(c => !customerIds.includes(c.id))); // Optimistic update
    } catch (error) { console.error("Failed to delete customers:", error); }
  };

  const handleSavePurchaseContract = async (contractData: PurchaseContract | Omit<PurchaseContract, 'id'>) => {
     try {
        if ('id' in contractData) {
            const updatedContract = await apiService.update('purchase-contracts', String(contractData.id), contractData);
            setPurchaseContracts(prev => prev.map(c => c.id === updatedContract.id ? updatedContract : c));
        } else {
            const newContract = await apiService.create('purchase-contracts', contractData);
            setPurchaseContracts(prev => [...prev, newContract]);
        }
    } catch (error) { console.error("Failed to save purchase contract:", error); }
  };

  const handleDeletePurchaseContracts = async (contractIds: number[]) => {
    try {
        await apiService.deleteMany('purchase-contracts', contractIds.map(String));
        setPurchaseContracts(prev => prev.filter(c => !contractIds.includes(c.id))); // Optimistic update
    } catch (error) { console.error("Failed to delete purchase contracts:", error); }
  };
  
  const handleSaveSupportContract = async (contractData: SupportContract | Omit<SupportContract, 'id'>) => {
    try {
        if ('id' in contractData) {
            const updatedContract = await apiService.update('support-contracts', String(contractData.id), contractData);
            setSupportContracts(prev => prev.map(c => c.id === updatedContract.id ? updatedContract : c));
        } else {
            const newContract = await apiService.create('support-contracts', contractData);
            setSupportContracts(prev => [...prev, newContract]);
        }
    } catch (error) { console.error("Failed to save support contract:", error); }
  };
  
  const handleDeleteSupportContracts = async (contractIds: number[]) => {
    try {
      await apiService.deleteMany('support-contracts', contractIds.map(String));
      setSupportContracts(prev => prev.filter(c => !contractIds.includes(c.id))); // Optimistic update
    } catch (error) { console.error("Failed to delete support contracts:", error); }
  };

  // --- SOCKET LISTENERS ---
  useEffect(() => {
    if (!currentUser) return;
    socket.on('users_created', (newUser: User) => { setUsers(prev => [...prev, newUser]); });
    socket.on('users_updated', (updatedUser: User) => { setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u)); });
    socket.on('customers_created', (newCustomer: Customer) => { setCustomers(prev => [...prev, newCustomer]); });
    socket.on('customers_updated', (updatedCustomer: Customer) => { setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c)); });

    return () => {
        socket.off('users_created');
        socket.off('users_updated');
        socket.off('customers_created');
        socket.off('customers_updated');
    };
  }, [currentUser]);

  // --- RENDER LOGIC ---
  if (authLoading) return <div className="flex h-screen items-center justify-center">در حال بررسی احراز هویت...</div>;
  if (!currentUser) return <LoginPage onLogin={handleLogin} error={error} />;
  if (dataLoading) return <div className="flex h-screen items-center justify-center">در حال بارگذاری اطلاعات...</div>;
  if (error) return (
      <div className="flex flex-col h-screen items-center justify-center text-red-500">
          <p>{error}</p>
          <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">بازگشت به صفحه لاگین</button>
      </div>
  );
  
  const hasAccess = (pageId: string) => {
    if (!currentUser?.accessibleMenus) return false;
    return currentUser.accessibleMenus.includes('*') || currentUser.accessibleMenus.includes(pageId);
  };

  const renderActivePage = () => {
    if (!hasAccess(activePage) && activePage !== 'no_access') return <PlaceholderPage title="دسترسی غیر مجاز" />;
    
    switch (activePage) {
      case 'dashboard': return <DashboardPage users={users} customers={customers} purchaseContracts={purchaseContracts} supportContracts={supportContracts} tickets={tickets} referrals={referrals} />;
      case 'users': return <UserManagement users={users} onSave={handleSaveUser} onDeleteMany={handleDeleteUsers} />;
      case 'customers': return <CustomerList customers={customers} onSave={handleSaveCustomer} onDeleteMany={handleDeleteCustomers} />;
      case 'contracts': return (
        <div className="p-4 sm:p-6 lg:p-8"><main className="max-w-7xl mx-auto">
          <div className="mb-8"><PurchaseContracts contracts={purchaseContracts} users={users} customers={customers} onSave={handleSavePurchaseContract} onDeleteMany={handleDeletePurchaseContracts} /></div>
          <div className="mt-12"><SupportContracts contracts={supportContracts} customers={customers} onSave={handleSaveSupportContract} onDeleteMany={handleDeleteSupportContracts} /></div>
        </main></div>
      );
      case 'tickets': return <Tickets tickets={tickets} users={users} customers={customers} onSave={() => {}} onToggleWork={() => {}} onRefer={() => {}} />;
      case 'referrals': return <ReferralsPage referrals={referrals} onSaveTicket={() => {}} onToggleWork={() => {}}/>;
      default: return <PlaceholderPage title="صفحه مورد نظر یافت نشد" />;
    }
  };

  return (
    <div className="relative lg:flex h-screen bg-gray-100 font-sans" dir="rtl">
      <Sidebar activePage={activePage} setActivePage={setActivePage} isSidebarOpen={isSidebarOpen} user={currentUser} onLogout={handleLogout} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center bg-white border-b h-20 px-6 shrink-0">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full hover:bg-gray-100"><MenuIcon /></button>
        </header>
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">{renderActivePage()}</div>
      </div>
    </div>
  );
}

export default App;
