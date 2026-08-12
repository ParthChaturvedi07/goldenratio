import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layout & Guards
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ContactList from './pages/Contacts/ContactList';
import ProjectList from './pages/Projects/ProjectList';
import ProjectForm from './pages/Projects/ProjectForm';
import ProductList from './pages/Products/ProductList';
import ProductForm from './pages/Products/ProductForm';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Global Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#f5f2ec',
              color: '#1a1a1a',
              border: '1px solid rgba(0,0,0,0.1)',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#2a7a6e', secondary: '#f5f2ec' },
            },
          }}
        />

        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />

            {/* Contacts */}
            <Route path="contacts" element={<ContactList />} />

            {/* Projects */}
            <Route path="projects" element={<ProjectList />} />
            <Route path="projects/new" element={<ProjectForm />} />
            <Route path="projects/:id/edit" element={<ProjectForm />} />

            {/* Products */}
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />

            {/* Settings */}
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch all 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
