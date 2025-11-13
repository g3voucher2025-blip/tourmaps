import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { AuthContext } from './AuthContextDef';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let userProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email,
          role: null
        };

        // 1. Tenta buscar na coleção 'empresas'
        const empresaDocRef = doc(db, 'empresas', user.uid);
        const empresaDoc = await getDoc(empresaDocRef);

        if (empresaDoc.exists()) {
          userProfile = {
            ...userProfile,
            ...empresaDoc.data(),
            role: 'empresa',
          };
        } else {
          // 2. Se não é empresa, checa na coleção 'users' (NOME CORRIGIDO)
          const userDocRef = doc(db, 'users', user.uid); // <<-- A MUDANÇA CRÍTICA ESTÁ AQUI
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            userProfile = {
              ...userProfile,
              ...userDoc.data(),
              role: 'turista', // Mesmo que a coleção seja 'users', a ROLE lógica é 'turista'
            };
          } else {
            console.warn(`Atenção: Usuário com UID ${user.uid} não tem perfil em 'empresas' ou 'users'.`);
          }
        }
        
        setCurrentUser(userProfile);

      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}