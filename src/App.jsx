import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Importação dos Componentes e Páginas
import Layout from './components/Layout';
import Home from './pages/Home';
import Eventos from './pages/Eventos';
import Painel from './pages/Painel';
import Perfil from './pages/Perfil';
import Unauthorized from './pages/Unauthorized';

// --- INÍCIO DA CORREÇÃO ---
// Importando de 'pages'
import Login from './pages/Login';
import Register from './pages/Register';

// Importando de 'pages/auth'
import RegisterTurista from './pages/auth/RegisterTurista';
import RegisterEmpresa from './pages/auth/RegisterEmpresa';
// --- FIM DA CORREÇÃO ---

import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="eventos" element={<Eventos />} />
            
            {/* Rotas para os componentes em 'pages' */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            
            {/* Rotas para os componentes em 'pages/auth' */}
            <Route path="register/turista" element={<RegisterTurista />} />
            <Route path="register/empresa" element={<RegisterEmpresa />} />
            
            <Route path="unauthorized" element={<Unauthorized />} />
            
            <Route 
              path="perfil" 
              element={
                <ProtectedRoute>
                  <Perfil />
                </ProtectedRoute>
              } 
            />
          </Route>

          <Route 
            path="/painel" 
            element={
              <ProtectedRoute allowedRoles={['empresa']}>
                <Painel />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}