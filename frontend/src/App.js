import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './HomePage';

import ManagerLogin from './modules/manager/ManagerLogin';
import ManagerDashboard from './modules/manager/ManagerDashboard';
import AddEmployee from './modules/manager/AddEmployee';
import EmployeeList from './modules/manager/EmployeeList';
import AddProject from './modules/manager/AddProject';
import TaskManager from './modules/manager/TaskManager';
import EmployeesWithTasks from './modules/manager/EmployeesWithTasks';

import EmployeeLogin from './modules/employee/EmployeeLogin'; 
import EmployeeDashboard from './modules/employee/EmployeeDashboard';
import EmployeeTaskBoard from './modules/employee/EmployeeTaskBoard';

import HRLogin from './modules/hr/HRLogin';
import HRDashboard from './modules/hr/HRDashboard';


import ResetStep1Email from './modules/auth/ResetStep1Email';
import ResetStep2VerifyOtp from './modules/auth/ResetStep2VerifyOtp';
import ResetStep3NewPassword from './modules/auth/ResetStep3NewPassword';


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
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
