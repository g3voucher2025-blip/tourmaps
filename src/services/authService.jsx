import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, deleteUser } from "firebase/auth";
import { doc, setDoc, serverTimestamp, updateDoc, deleteDoc, collection, query, where, getDocs, writeBatch } from "firebase/firestore";
import { auth, db } from "../config/firebase";

// --- Função de Login ---
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
};

// --- Função de Logout ---
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    throw error;
  }
};

// --- Função de Cadastro de Turista ---
export const registerTurista = async (email, password, additionalData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Criar displayName a partir de nome + sobrenome
    const displayName = `${additionalData.nome || ''} ${additionalData.sobrenome || ''}`.trim();

    await updateProfile(user, {
      displayName: displayName
    });

    await setDoc(doc(db, "users", user.uid), {
      ...additionalData,
      uid: user.uid,
      email: user.email,
      displayName,
      createdAt: serverTimestamp()
    });

    return userCredential;
  } catch (error) {
    console.error("Erro ao registrar turista: ", error);
    throw error;
  }
};

// --- Função de Cadastro de Empresa ---
export const registerEmpresa = async (email, password, additionalData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { 
      displayName: additionalData.nomeEmpresa 
    });

    const { nomeEmpresa, ...firestoreData } = additionalData;

    await setDoc(doc(db, "empresas", user.uid), {
      ...firestoreData,
      nomeEmpresa, // Include extracted nomeEmpresa
      uid: user.uid,
      email: user.email,
      ratingsCount: 0,
      ratingsSum: 0,
      avgRating: 0,
      createdAt: serverTimestamp()
    });
    return userCredential;
  } catch (error) {
    console.error("Erro ao registrar empresa: ", error);
    throw error;
  }
};

// --- FUNÇÃO DE ATUALIZAÇÃO DE PERFIL (NOVA) ---
export const updateUserProfile = async (uid, role, dataToUpdate) => {
  const collectionName = role === 'empresa' ? 'empresas' : 'users';
  const docRef = doc(db, collectionName, uid);

  try {
    // Atualiza o documento no Firestore
    await updateDoc(docRef, dataToUpdate);

    // Se o nome principal foi alterado, atualiza também no perfil de autenticação do Firebase
    const newDisplayName = role === 'empresa' ? dataToUpdate.nomeEmpresa : dataToUpdate.displayName;
    if (newDisplayName && auth.currentUser && auth.currentUser.displayName !== newDisplayName) {
      await updateProfile(auth.currentUser, {
        displayName: newDisplayName
      });
    }

  } catch (error) {
    console.error("Erro ao atualizar o perfil:", error);
    throw error;
  }
};
 // --- FUNÇÃO DE EXCLUSÃO DE CONTA (REESCRITA E MAIS SEGURA) ---
export const deleteEmpresaAccount = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Nenhum usuário autenticado para excluir.");
  }

  const uid = user.uid; // Salva o UID antes que o objeto 'user' se torne inválido

  try {
    // --- NOVA ORDEM DE OPERAÇÕES ---

    // 1. PRIMEIRO, tenta apagar o usuário da autenticação. Esta é a operação mais crítica.
    // Se falhar, a função para aqui e nada no banco de dados é alterado.
    await deleteUser(user);

    // 2. Se a etapa 1 funcionou, o usuário foi apagado da autenticação.
    // Agora, limpamos os dados do Firestore.

    // A. Encontra e apaga todos os eventos associados a esta empresa.
    const eventosRef = collection(db, 'eventos');
    const q = query(eventosRef, where("createdBy", "==", uid));
    const querySnapshot = await getDocs(q);
    
    // Usa um 'batch' para apagar todos os eventos de uma vez, o que é mais eficiente.
    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    // B. Apaga o documento principal da empresa na coleção 'empresas'.
    const docRef = doc(db, 'empresas', uid);
    await deleteDoc(docRef);

  } catch (error) {
    console.error("Erro ao excluir a conta da empresa:", error);
    if (error.code === 'auth/requires-recent-login') {
      // Esta é a mensagem de erro mais provável e importante para o usuário.
      throw new Error("Esta operação é sensível e requer login recente. Por favor, faça login novamente e tente excluir a conta.");
    }
    // Lança outros erros que possam ocorrer.
    throw error;
  }
};