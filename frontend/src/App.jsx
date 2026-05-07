import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Residents from './pages/Residents';
import Houses from './pages/Houses';
import Payments from './pages/Payments';
import Expenses from './pages/Expenses';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="residents" element={<Residents />} />
                    <Route path="houses" element={<Houses />} />
                    <Route path="payments" element={<Payments />} />
                    <Route path="expenses" element={<Expenses />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
