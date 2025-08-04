import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './HomePage';
import AddMarketingEmployee from './modules/marketingmanager/AddMarketingEmployee';
import ManagerLogin from './modules/manager/ManagerLogin';
import ManagerDashboard from './modules/manager/ManagerDashboard';
import AddEmployee from './modules/manager/AddEmployee';
import EmployeeList from './modules/manager/EmployeeList';
import AddProject from './modules/manager/AddProject';
import TaskManager from './modules/manager/TaskManager';
import EmployeesWithTasks from './modules/manager/EmployeesWithTasks';
import AmountDashboard from "./modules/amounts/Amountdashboard";


import EmployeeLogin from './modules/employee/EmployeeLogin'; 
import EmployeeDashboard from './modules/employee/EmployeeDashboard';
import EmployeeTaskBoard from './modules/employee/EmployeeTaskBoard';

import HRLogin from './modules/hr/HRLogin';
import HRDashboard from './modules/hr/HRDashboard';
import EmployeeLogin1 from './modules/marketingmanager/EmployeeLogin1';

import ResetStep1Email from './modules/auth/ResetStep1Email';
import ResetStep2VerifyOtp from './modules/auth/ResetStep2VerifyOtp';
import ResetStep3NewPassword from './modules/auth/ResetStep3NewPassword';

import ViewCampaigns from './modules/marketingmanager/ViewCampaigns';
import MarketingManager from './modules/marketingmanager/MarketingManager';
import CreateTeam from './modules/marketingmanager/CreateTeam';
import CreateCampaign from './modules/marketingmanager/CreateCampaign';
import EmployeeDashboardMarket from './modules/marketingmanager/EmployeeDashboardMarket';
import RaiseTicket from './modules/marketingmanager/RiseTickets';
import SupportManagerDashboard from './modules/support/SupportManagerDashboard';
import SupportEmployeeLogin from './modules/support/SupportEmployeeLogin';
import SupportEmployeeDashboard from './modules/support/SupportEmployeeDashboard';
import SalesManager from './modules/sales/salesmanager';
import AddSalesEmployee from './modules/sales/salesAddEmployee';
import SalesEmployeeLogin from './modules/sales/salesEmployeeLogin';
import SalesEmployeeDashboard from './modules/sales/SalesEmployeeDashboard';
import Amountlogin from './modules/amounts/Amountlogin'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Manager */}
        <Route path="/manager/login" element={<ManagerLogin />} />
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/manager/add-employee" element={<AddEmployee />} />
        <Route path="/manager/employees" element={<EmployeeList />} />
        <Route path="/manager/addproject" element={<AddProject />} />
        <Route path="/manager/task" element={<TaskManager />} />
        <Route path="/manager/employees-with-tasks" element={<EmployeesWithTasks />} />

        {/* Employee */}
        <Route path="/employee/login" element={<EmployeeLogin />} />
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/kanban" element={<EmployeeTaskBoard />} />

<Route path="/reset-password" element={<ResetStep1Email />} />
<Route path="/verify-otp" element={<ResetStep2VerifyOtp />} />
<Route path="/set-new-password" element={<ResetStep3NewPassword />} />

        {/* HR */}
        <Route path="/hr/login" element={<HRLogin />} />
        <Route path="/hr/dashboard" element={<HRDashboard />} />
       

      <Route path="/marketingmanager/dashboard" element={<MarketingManager/>} />
    <Route path="/addmarketingemployee" element={<AddMarketingEmployee/>} />
      <Route path="/create-team" element={<CreateTeam/>} />
       <Route path="/create-campaign" element={<CreateCampaign/>} />
       <Route path="/view-campaign" element={<ViewCampaigns/>} />
       <Route path="/marketempLogin" element={<EmployeeLogin1/>} />
       <Route path="/marketingemplogin" element={<EmployeeDashboardMarket/>} />
       <Route path="/rise-tickets" element={<RaiseTicket/>} />
        <Route path="/suportmanagerdash" element={<SupportManagerDashboard/>} />
       <Route path="/suportemployeelogin" element={<SupportEmployeeLogin/>} />
       <Route path="/support/dashboard" element={<SupportEmployeeDashboard/>} />
     

 <Route path="/add-employee" element={<AddSalesEmployee />} />
        <Route path="/salesmanager/dashboard" element={<SalesManager />} />
        <Route path="/salesemployee/dashboard" element={<SalesEmployeeDashboard />} />
        <Route path="/salesemployee/login" element={<SalesEmployeeLogin />} />

       <Route path="/amount/login" element={<Amountlogin />} />
       <Route path="/amountdashboard" element={<AmountDashboard />} />

      </Routes>
       

    </BrowserRouter>
  );
}

export default App;
