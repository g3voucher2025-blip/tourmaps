import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { Navigate, useNavigate } from 'react-router-dom';
import { updateUserProfile, deleteEmpresaAccount } from '../services/authService';

export default function Perfil() {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false); // 1. Novo estado para a confirmação
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData(currentUser);
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormMessage({ type: '', text: '' });
    // Remove unused variables from destructuring
    const { ...dataToUpdate } = formData;

    try {
      await updateUserProfile(currentUser.uid, currentUser.role, dataToUpdate);
      setFormMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      setIsEditing(false);
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      // Log error for debugging, show generic message to user
      console.error('Profile update error:', error);
      setFormMessage({ type: 'error', text: 'Falha ao atualizar o perfil.' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setFormLoading(true);
    setFormMessage({ type: '', text: '' });
    try {
      await deleteEmpresaAccount();
      // O AuthContext vai detectar o logout e o ProtectedRoute fará o resto.
      navigate('/');
    } catch (error) {
      // 2. Mensagem de erro clara para o usuário sobre a necessidade de re-login
      setFormMessage({ type: 'error', text: error.message });
      setFormLoading(false);
      setIsConfirmingDelete(false); // Sai do modo de confirmação para mostrar o erro
    }
  };

  const handleCancel = () => {
    setFormData(currentUser);
    setIsEditing(false);
    setIsConfirmingDelete(false); // Também reseta o estado de confirmação
    setFormMessage({ type: '', text: '' });
  };

  if (loading) {
    return <div className="text-center p-10">Carregando perfil...</div>;
  }
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const isEmpresa = currentUser.role === 'empresa';

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Editar Perfil
          </button>
        )}
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campos (a lógica deles permanece a mesma) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={currentUser.email} disabled className="mt-1 w-full px-3 py-2 bg-gray-100 border rounded-md"/>
          </div>
          {isEmpresa && (
            <div>
              <label className="block text-sm font-medium text-gray-700">CNPJ</label>
              <input 
                type="text" 
                value={formData.cnpj || ''} 
                onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                disabled={!isEditing}
                className={`mt-1 w-full px-3 py-2 border rounded-md ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
              />
            </div>
          )}
          {isEmpresa && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome Empresa</label>
              <input 
                type="text" 
                value={formData.nomeEmpresa || ''} 
                onChange={(e) => setFormData({...formData, nomeEmpresa: e.target.value})}
                disabled={!isEditing}
                className={`mt-1 w-full px-3 py-2 border rounded-md ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
              />
            </div>
          )}
          {isEmpresa && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Descrição</label>
              <textarea 
                value={formData.descricao || ''} 
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                disabled={!isEditing}
                className={`mt-1 w-full px-3 py-2 border rounded-md ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
              />
            </div>
          )}
          {!isEmpresa && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input 
                  type="text" 
                  value={formData.nome || ''} 
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  disabled={!isEditing}
                  className={`mt-1 w-full px-3 py-2 border rounded-md ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sobrenome</label>
                <input 
                  type="text" 
                  value={formData.sobrenome || ''} 
                  onChange={(e) => setFormData({...formData, sobrenome: e.target.value})}
                  disabled={!isEditing}
                  className={`mt-1 w-full px-3 py-2 border rounded-md ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                <input 
                  type="date" 
                  value={formData.dataNascimento || ''} 
                  onChange={(e) => setFormData({...formData, dataNascimento: e.target.value})}
                  disabled={!isEditing}
                  className={`mt-1 w-full px-3 py-2 border rounded-md ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                />
              </div>
            </>
          )}
          {/* ... todos os outros campos do formulário ... */}

          {/* Mensagens de sucesso ou erro */}
          {formMessage.text && <div className={`p-3 rounded-md text-center ${formMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{formMessage.text}</div>}
          
          {/* 3. Lógica de botões atualizada */}
          {isEditing && (
            <div className="pt-4">
              {isConfirmingDelete ? (
                // --- MODO DE CONFIRMAÇÃO DE EXCLUSÃO ---
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                  <p className="font-bold text-red-800">Atenção! Ação Irreversível</p>
                  <p className="text-red-700 mt-1">Tem certeza que deseja excluir sua conta? Todos os seus dados serão perdidos permanentemente.</p>
                  <div className="flex gap-4 mt-4">
                    <button type="button" onClick={handleDelete} disabled={formLoading} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50">
                      {formLoading ? 'Excluindo...' : 'Sim, Excluir'}
                    </button>
                    <button type="button" onClick={() => setIsConfirmingDelete(false)} className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400">
                      Não, Voltar
                    </button>
                  </div>
                </div>
              ) : (
                // --- MODO DE EDIÇÃO PADRÃO ---
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <button type="submit" disabled={formLoading} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">Salvar</button>
                    <button type="button" onClick={handleCancel} className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600">Cancelar</button>
                  </div>
                  {isEmpresa && (
                    <button type="button" onClick={() => setIsConfirmingDelete(true)} disabled={formLoading} className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 mt-4">
                      Excluir Conta Permanentemente
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}