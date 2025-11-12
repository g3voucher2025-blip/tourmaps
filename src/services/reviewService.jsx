import { doc, setDoc, query, where, collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

// Criar/atualizar avaliação
export const submitReview = async (placeId, userId, userProfile, rating, comment) => {
  try {
    const reviewId = `${placeId}_${userId}`;
    
    const reviewData = {
      placeId,
      userId,
      userDisplayName: userProfile.displayName,
      rating, // 1-5
      comment,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, "reviews", reviewId), reviewData);

    // Atualizar avaliação média do estabelecimento
    await updatePlaceRating(placeId);

    return { success: true, message: "Avaliação salva com sucesso!" };
  } catch (error) {
    console.error("Erro ao salvar avaliação:", error);
    throw error;
  }
};

// Obter avaliações de um lugar
export const getPlaceReviews = async (placeId) => {
  try {
    const q = query(collection(db, "reviews"), where("placeId", "==", placeId));
    const querySnapshot = await getDocs(q);
    
    const reviews = [];
    querySnapshot.forEach((doc) => {
      reviews.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return reviews.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error("Erro ao obter avaliações:", error);
    throw error;
  }
};

// Atualizar rating médio do lugar
export const updatePlaceRating = async (placeId) => {
  try {
    const reviews = await getPlaceReviews(placeId);
    
    if (reviews.length === 0) return;

    const averageRating = 
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    const placeRef = doc(db, "places", placeId);
    await updateDoc(placeRef, {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error("Erro ao atualizar rating:", error);
    throw error;
  }
};

// Obter avaliação do usuário para um lugar (se existe)
export const getUserReviewForPlace = async (placeId, userId) => {
  try {
    const reviewId = `${placeId}_${userId}`;
    const querySnapshot = await getDocs(query(collection(db, "reviews"), where("reviewId", "==", reviewId)));
    
    if (querySnapshot.empty) return null;
    
    return querySnapshot.docs[0].data();
  } catch (error) {
    console.error("Erro ao obter avaliação do usuário:", error);
    throw error;
  }
};