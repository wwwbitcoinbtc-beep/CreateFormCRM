import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import UserManagement from './pages/UserManagement';
import CustomerList from './pages/CustomerList';
import PurchaseContracts from './pages/PurchaseContracts';
import SupportContracts from './pages/SupportContracts';
import Tickets from './pages/Tickets';
import ReportsPage from './pages/ReportsPage';
import LoginPage from './pages/LoginPage';
import PlaceholderPage from './pages/PlaceholderPage';
import ReferralsPage from './pages/ReferralsPage';
// Corrected import: Import the default export and the named socket export
import apiService, { socket } from './apiService'; 

import { User, Customer, PurchaseContract, SupportContract, Ticket, Referral } from './types';
import { MenuIcon } from './components/icons/MenuIcon';
import { formatJalaali, formatJalaaliDateTime } from './utils/dateFormatter';

// Declare globals loaded from CDN
declare const jalaali: any;

function App() {
  // State for data
  const [users, setUsers] = useState<User[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [purchaseContracts, setPurchaseContracts] = useState<PurchaseContract[]>([]);
  const [supportContracts, setSupportContracts] = useState<SupportContract[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  
  // App state
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Corrected initialization: Use the method from the imported service
  const [currentUser, setCurrentUser] = useState<User | null>(apiService.getUser()); 
  const [loading, setLoading] = useState(true);
  // --- BUG FIX: Initial state for error should be null, not an empty array ---
  const [error, setError] = useState<string | null>(null);

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

  const fetchData = useCallback(async () => {
      if (!currentUser) {
          setLoading(false);
          return;
      };
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching initial data...");
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
        console.log("Initial data loaded successfully.");
      } catch (err: any) {
        setError("Failed to load data. Your session might be expired. Please try logging in again.");
        console.error(err);
        if (err.message.includes("403") || err.message.includes("401")) {
            handleLogout(); // Log out user if token is invalid
        }
      } finally {
        setLoading(false);
      }
    }, [currentUser, handleLogout]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Socket.io event listeners for real-time updates ---
  useEffect(() => {
    socket.on('users_created', (newUser: User) => { setUsers(prev => [...prev, newUser]); });
    socket.on('users_updated', (updatedUser: User) => { setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u)); });
    socket.on('users_deleted', ({ id }) => { setUsers(prev => prev.filter(u => u.id !== id)); });
    socket.on('customers_created', (newCustomer: Customer) => { setCustomers(prev => [...prev, newCustomer]); });
    socket.on('customers_updated', (updatedCustomer: Customer) => { setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c)); });
    socket.on('customers_deleted', ({ id }) => { setCustomers(prev => prev.filter(c => c.id !== id)); });

    return () => { // Cleanup listeners on component unmount
        socket.off('users_created');
        socket.off('users_updated');
        socket.off('users_deleted');
        socket.off('customers_created');
        socket.off('customers_updated');
        socket.off('customers_deleted');
    };
  }, []);


  const handleSaveUser = (userData: User | Omit<User, 'id'>) => {
    try {
        if ('id' in userData) apiService.update('users', String(userData.id), userData);
        else apiService.create('users', userData);
    } catch (error) { console.error("Failed to save user:", error); }
  };

  const handleDeleteUsers = async (userIds: number[]) => {
    try {
        await apiService.deleteMany('users', userIds.map(String));
        setUsers(users.filter(u => !userIds.includes(u.id)));
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
        setCustomers(customers.filter(c => !customerIds.includes(c.id)));
    } catch (error) { console.error("Failed to delete customers:", error); }
  };

  const handleSavePurchaseContract = async (contractData: PurchaseContract | Omit<PurchaseContract, 'id'>) => {
     try {
        if ('id' in contractData) {
            const updatedContract = await apiService.update('purchase-contracts', String(contractData.id), contractData);
            setPurchaseContracts(purchaseContracts.map(c => c.id === updatedContract.id ? updatedContract : c));
        } else {
            const newContract = await apiService.create('purchase-contracts', contractData);
            setPurchaseContracts([...purchaseContracts, newContract]);
        }
    } catch (error) { console.error("Failed to save purchase contract:", error); }
  };

  const handleDeletePurchaseContracts = async (contractIds: number[]) => {
    try {
        await apiService.deleteMany('purchase-contracts', contractIds.map(String));
        setPurchaseContracts(purchaseContracts.filter(c => !contractIds.includes(c.id)));
    } catch (error) { console.error("Failed to delete purchase contracts:", error); }
  };
  
  const handleSaveSupportContract = async (contractData: SupportContract | Omit<SupportContract, 'id'>) => {
    try {
        if ('id' in contractData) {
            const updatedContract = await apiService.update('support-contracts', String(contractData.id), contractData);
            setSupportContracts(supportContracts.map(c => c.id === updatedContract.id ? updatedContract : c));
        } else {
            const newContract = await apiService.create('support-contracts', contractData);
            setSupportContracts([...supportContracts, newContract]);
        }
    } catch (error) { console.error("Failed to save support contract:", error); }
  };
  
  const handleDeleteSupportContracts = async (contractIds: number[]) => {
    try {
        await apiService.deleteMany('support-contracts', contractIds.map(String));
        setSupportContracts(supportContracts.filter(c => !contractIds.includes(c.id)));
    } catch (error) { console.error("Failed to delete support contracts:", error); }
  };
  
  const handleSaveTicket = async (ticketData: Ticket | Omit<Ticket, 'id'>, isFromReferral: boolean) => { /* ... */ };
  const handleToggleWork = async (itemId: number, isFromReferral: boolean) => { /* ... */ };
  const handleReferTicket = async (ticketId: number, isFromReferral: boolean, referredBy: User, referredToUsername: string) => { /* ... */ };

  const handleLogin = async (username: string, password: string) => {
    try {
      setError(null);
      const { user } = await apiService.login({ username, password });
      setCurrentUser(user);
      const landingPage = user.accessibleMenus.includes('*') || user.accessibleMenus.includes('dashboard') ? 'dashboard' : user.accessibleMenus[0] || 'no_access';
      setActivePage(landingPage);
    } catch (err: any) {
      setError(err.message || "نام کاربری یا رمز عبور اشتباه است.");
    }
  };
  
  // --- Render Logic ---
  if (!currentUser) return <LoginPage onLogin={handleLogin} error={error} />;
  
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (error && users.length === 0) return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;
  
  const hasAccess = (pageId: string) => currentUser.accessibleMenus.includes('*') || currentUser.accessibleMenus.includes(pageId as any);

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
      // ... other cases
      default: return <PlaceholderPage title="صفحه مورد نظر یافت نشد" />;
    }
  };

  return (
    <div className="relative lg:flex h-screen bg-gray-100 font-sans" dir="rtl">
      {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-30 lg:hidden" aria-hidden="true"></div>}
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
