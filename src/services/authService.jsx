import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";


// Registrar novo turista
export const registerTurista = async (email, password, turistaData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Salvar dados do turista no Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: turistaData.displayName,
      endereço: turistaData.endereço || "",
      role: "turista",
      createdAt: new Date(),
    });

    return user;
  } catch (error) {
    console.error("Erro ao registrar turista:", error);
    throw error;
  }
};

// NOVA FUNÇÃO PARA CADASTRAR EMPRESA
export const registerEmpresa = async (email, password, additionalData) => {
  try {
    // 1. Cria o usuário no Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Prepara os dados para salvar no Firestore
    const empresaData = {
      ...additionalData, // Todos os dados do formulário (nome, CNPJ, etc.)
      uid: user.uid,
      email: user.email,
      role: 'empresa', // Define o papel do usuário como 'empresa'
      ratingsCount: 0,
      ratingsSum: 0,
      avgRating: 0,
      createdAt: serverTimestamp()
    };

    // 3. Salva o perfil completo no Firestore, na coleção 'users'
    // Usando o UID do usuário como ID do documento para fácil acesso.
    await setDoc(doc(db, "users", user.uid), empresaData);

    return userCredential;
  } catch (error) {
    console.error("Erro ao registrar empresa: ", error);
    // Re-lança o erro para que o componente possa tratá-lo (e mostrar na tela)
    throw error;
  }
};

// Login
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    throw error;
  }
};

// Obter dados do usuário
export const getUserProfile = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Erro ao obter perfil:", error);
    throw error;
  }
};

// Monitorar autenticação
export const onAuthStateChangeListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};