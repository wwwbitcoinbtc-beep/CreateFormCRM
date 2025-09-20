import React, { useState, useEffect } from 'react';
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
import apiService from './apiService';

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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [usersData, customersData, purchaseContractsData, supportContractsData, ticketsData, referralsData] = await Promise.all([
          apiService.get('/users'),
          apiService.get('/customers'),
          apiService.get('/purchase-contracts'),
          apiService.get('/support-contracts'),
          apiService.get('/tickets'),
          apiService.get('/referrals'),
        ]);
        setUsers(usersData);
        setCustomers(customersData);
        setPurchaseContracts(purchaseContractsData);
        setSupportContracts(supportContractsData);
        setTickets(ticketsData);
        setReferrals(referralsData);
      } catch (err: any) {
        setError("Failed to load initial data from server. Is the backend running?");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (currentUser) {
        fetchData();
    }
  }, [currentUser]);

  const handleSaveUser = async (userData: User | Omit<User, 'id'>) => {
    try {
        if ('id' in userData) {
            const updatedUser = await apiService.put(`/users/${userData.id}`, userData);
            setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        } else {
            const newUser = await apiService.post('/users', userData);
            setUsers([...users, newUser]);
        }
    } catch (error) {
        console.error("Failed to save user:", error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
        await apiService.del(`/users/${userId}`);
        setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
        console.error("Failed to delete user:", error);
    }
  };

  const handleDeleteUsers = async (userIds: number[]) => {
    try {
        await apiService.post('/users/delete-many', { ids: userIds });
        setUsers(users.filter(u => !userIds.includes(u.id)));
    } catch (error) {
        console.error("Failed to delete users:", error);
    }
  };
  
  const handleSaveCustomer = async (customerData: Customer | Omit<Customer, 'id'>) => {
    try {
        if ('id' in customerData) {
            const updatedCustomer = await apiService.put(`/customers/${customerData.id}`, customerData);
            setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
        } else {
            const newCustomer = await apiService.post('/customers', customerData);
            setCustomers([...customers, newCustomer]);
        }
    } catch (error) {
        console.error("Failed to save customer:", error);
    }
  };

  const handleDeleteCustomer = async (customerId: number) => {
    try {
        await apiService.del(`/customers/${customerId}`);
        setCustomers(customers.filter(c => c.id !== customerId));
    } catch (error) {
        console.error("Failed to delete customer:", error);
    }
  };
  
  const handleDeleteCustomers = async (customerIds: number[]) => {
    try {
        await apiService.post('/customers/delete-many', { ids: customerIds });
        setCustomers(customers.filter(c => !customerIds.includes(c.id)));
    } catch (error) {
        console.error("Failed to delete customers:", error);
    }
  };

  const handleSavePurchaseContract = async (contractData: PurchaseContract | Omit<PurchaseContract, 'id'>) => {
     try {
        if ('id' in contractData) {
            const updatedContract = await apiService.put(`/purchase-contracts/${contractData.id}`, contractData);
            setPurchaseContracts(purchaseContracts.map(c => c.id === updatedContract.id ? updatedContract : c));
        } else {
            const newContract = await apiService.post('/purchase-contracts', contractData);
            setPurchaseContracts([...purchaseContracts, newContract]);
        }
    } catch (error) {
        console.error("Failed to save purchase contract:", error);
    }
  };

  const handleDeletePurchaseContract = async (contractId: number) => {
    try {
        await apiService.del(`/purchase-contracts/${contractId}`);
        setPurchaseContracts(purchaseContracts.filter(c => c.id !== contractId));
    } catch (error) {
        console.error("Failed to delete purchase contract:", error);
    }
  };
  
  const handleDeletePurchaseContracts = async (contractIds: number[]) => {
    try {
        await apiService.post('/purchase-contracts/delete-many', { ids: contractIds });
        setPurchaseContracts(purchaseContracts.filter(c => !contractIds.includes(c.id)));
    } catch (error) {
        console.error("Failed to delete purchase contracts:", error);
    }
  };
  
  const handleSaveSupportContract = async (contractData: SupportContract | Omit<SupportContract, 'id'>) => {
    try {
        if ('id' in contractData) {
            const updatedContract = await apiService.put(`/support-contracts/${contractData.id}`, contractData);
            setSupportContracts(supportContracts.map(c => c.id === updatedContract.id ? updatedContract : c));
        } else {
            const newContract = await apiService.post('/support-contracts', contractData);
            setSupportContracts([...supportContracts, newContract]);
        }
    } catch (error) {
        console.error("Failed to save support contract:", error);
    }
  };

  const handleDeleteSupportContract = async (contractId: number) => {
     try {
        await apiService.del(`/support-contracts/${contractId}`);
        setSupportContracts(supportContracts.filter(c => c.id !== contractId));
    } catch (error) {
        console.error("Failed to delete support contract:", error);
    }
  };
  
  const handleDeleteSupportContracts = async (contractIds: number[]) => {
    try {
        await apiService.post('/support-contracts/delete-many', { ids: contractIds });
        setSupportContracts(supportContracts.filter(c => !contractIds.includes(c.id)));
    } catch (error) {
        console.error("Failed to delete support contracts:", error);
    }
  };
  
  const handleSaveTicket = async (ticketData: Ticket | Omit<Ticket, 'id'>, isFromReferral: boolean) => {
      const now = new Date();
      try {
        if ('id' in ticketData) {
            const updatedTicketData = { 
                ...ticketData,
                editableUntil: new Date(now.getTime() + 30 * 60 * 1000).toISOString(),
            };
            const updatedTicket = await apiService.put(`/tickets/${updatedTicketData.id}`, updatedTicketData);
            if (isFromReferral) {
                setReferrals(prev => prev.map(r => r.ticket.id === updatedTicket.id ? { ...r, ticket: updatedTicket } : r));
            } else {
                setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
            }
        } else {
            const lastTicketNum = tickets.length > 0 ? Math.max(...tickets.map(t => parseInt(t.ticketNumber.split('-')[2], 10) || 0)) : 100;
            const newTicketNum = `T-${jalaali.toJalaali(now).jy}-${String(lastTicketNum + 1).padStart(3, '0')}`;
            const newTicketData = {
                ...ticketData,
                ticketNumber: newTicketNum,
                creationDateTime: formatJalaaliDateTime(now),
                lastUpdateDate: formatJalaaliDateTime(now),
                status: 'انجام نشده',
                editableUntil: new Date(now.getTime() + 30 * 60 * 1000).toISOString(),
                totalWorkDuration: 0,
                updates: [],
            } as Omit<Ticket, 'id'>;
            const newTicket = await apiService.post('/tickets', newTicketData);
            setTickets(prev => [...prev, newTicket]);
        }
      } catch (error) {
          console.error("Failed to save ticket:", error);
      }
  };

  const handleToggleWork = async (itemId: number, isFromReferral: boolean) => {
      const sourceArray = isFromReferral ? referrals.map(r => r.ticket) : tickets;
      const ticket = sourceArray.find(t => t.id === itemId);
      if (!ticket) return;

      let updatedTicket: Ticket;
      if (ticket.status === 'در حال پیگیری' && ticket.workSessionStartedAt) {
          const sessionStart = new Date(ticket.workSessionStartedAt);
          const durationSeconds = (new Date().getTime() - sessionStart.getTime()) / 1000;
          updatedTicket = { ...ticket, status: 'اتمام یافته', workSessionStartedAt: undefined, totalWorkDuration: ticket.totalWorkDuration + durationSeconds };
      } else if (ticket.status === 'انجام نشده') {
          updatedTicket = { ...ticket, status: 'در حال پیگیری', workSessionStartedAt: new Date().toISOString() };
      } else {
          return;
      }

      try {
        await apiService.put(`/tickets/${updatedTicket.id}`, updatedTicket);
        if (isFromReferral) {
            setReferrals(prev => prev.map(r => r.ticket.id === itemId ? { ...r, ticket: updatedTicket } : r));
        } else {
            setTickets(prev => prev.map(t => t.id === itemId ? updatedTicket : t));
        }
      } catch (error) {
        console.error("Failed to toggle work:", error);
      }
  };
  
  const handleReferTicket = async (ticketId: number, isFromReferral: boolean, referredBy: User, referredToUsername: string) => {
    try {
        const referralData = {
            ticket_id: ticketId,
            referredBy: referredBy.username,
            referredTo: referredToUsername,
            referralDate: new Date().toISOString()
        };
        const newReferral = await apiService.post('/referrals', referralData);
        
        // Optimistic update on the client
        setReferrals(prev => [...prev, newReferral]);
        setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'ارجاع شده' } : t));

    } catch (error) {
        console.error("Failed to refer ticket:", error);
        // Optionally revert optimistic update on error
    }
  };

  const handleLogin = async (username: string, password: string): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);
      const user = await apiService.post('/login', { username, password });
      setCurrentUser(user);
      const landingPage = user.accessibleMenus.includes('dashboard') ? 'dashboard' : user.accessibleMenus[0] || 'no_access';
      setActivePage(landingPage);
      return user;
    } catch (err) {
      setError("نام کاربری یا رمز عبور اشتباه است.");
      return null;
    } finally {
        setLoading(false);
    }
  };
  
  const handleLogout = () => {
      setCurrentUser(null);
      // Clear all data on logout
      setUsers([]);
      setCustomers([]);
      setPurchaseContracts([]);
      setSupportContracts([]);
      setTickets([]);
      setReferrals([]);
  };

  if (!currentUser) return <LoginPage onLogin={handleLogin} />;
  
  if (loading) {
      return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (error) {
       return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;
  }
  
  const hasAccess = (pageId: string) => currentUser.accessibleMenus.includes(pageId as any);

  const renderActivePage = () => {
    if (!hasAccess(activePage) && activePage !== 'no_access') return <PlaceholderPage title="دسترسی غیر مجاز" />;
    
    switch (activePage) {
      case 'dashboard': return <DashboardPage users={users} customers={customers} purchaseContracts={purchaseContracts} supportContracts={supportContracts} tickets={tickets} referrals={referrals} />;
      case 'users': return <UserManagement users={users} onSave={handleSaveUser} onDelete={handleDeleteUser} onDeleteMany={handleDeleteUsers} />;
      case 'customers': return <CustomerList customers={customers} onSave={handleSaveCustomer} onDelete={handleDeleteCustomer} onDeleteMany={handleDeleteCustomers} />;
      case 'contracts': return (
        <div className="flex-1 bg-gray-50 text-slate-800 p-4 sm:p-6 lg:p-8 overflow-y-auto">
           <main className="max-w-7xl mx-auto">
            <div className="mb-8"><PurchaseContracts contracts={purchaseContracts} users={users} customers={customers} onSave={handleSavePurchaseContract} onDelete={handleDeletePurchaseContract} onDeleteMany={handleDeletePurchaseContracts} /></div>
            <div className="mt-12"><SupportContracts contracts={supportContracts} customers={customers} onSave={handleSaveSupportContract} onDelete={handleDeleteSupportContract} onDeleteMany={handleDeleteSupportContracts} /></div>
          </main>
        </div>
      );
      case 'tickets': return <Tickets tickets={tickets} referrals={referrals} customers={customers} users={users} onSave={handleSaveTicket} onReferTicket={handleReferTicket} currentUser={currentUser} onToggleWork={handleToggleWork} supportContracts={supportContracts} />;
      case 'reports': return <ReportsPage customers={customers} users={users} purchaseContracts={purchaseContracts} supportContracts={supportContracts} tickets={tickets} />;
      case 'referrals': return <ReferralsPage referrals={referrals} currentUser={currentUser} users={users} customers={customers} onSave={handleSaveTicket} onReferTicket={handleReferTicket} onToggleWork={handleToggleWork} supportContracts={supportContracts} />;
      case 'no_access': return <PlaceholderPage title="شما به هیچ صفحه‌ای دسترسی ندارید." />;
      default: return <PlaceholderPage title="صفحه مورد نظر یافت نشد" />;
    }
  };

  return (
    <div className="relative lg:flex h-screen bg-gray-100 font-sans" dir="rtl">
      {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-30 lg:hidden" aria-hidden="true"></div>}
      <Sidebar activePage={activePage} setActivePage={setActivePage} isSidebarOpen={isSidebarOpen} user={currentUser} onLogout={handleLogout} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center bg-white border-b border-gray-200 h-20 px-6 flex-shrink-0">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500"><MenuIcon /></button>
        </header>
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">{renderActivePage()}</div>
      </div>
    </div>
  );
}

export default App;
