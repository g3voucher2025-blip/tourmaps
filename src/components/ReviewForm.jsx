import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { submitReview, getUserReviewForPlace } from "../services/reviewService";

export default function ReviewForm({ placeId, onReviewSubmitted }) {
  const { currentUser, userProfile } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [existingReview, setExistingReview] = useState(null);

  const loadUserReview = useCallback(async () => {
    try {
      const review = await getUserReviewForPlace(placeId, currentUser.uid);
      if (review) {
        setExistingReview(review);
        setRating(review.rating);
        setComment(review.comment);
      }
    } catch (error) {
      console.error("Erro ao carregar avaliação:", error);
    }
  }, [placeId, currentUser]);

  useEffect(() => {
    if (currentUser && placeId) {
      loadUserReview();
    }
  }, [currentUser, placeId, loadUserReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!currentUser) {
      setError("Você precisa estar logado para avaliar");
      setLoading(false);
      return;
    }

    if (!comment.trim()) {
      setError("Por favor, escreva um comentário");
      setLoading(false);
      return;
    }

    try {
      await submitReview(placeId, currentUser.uid, userProfile, rating, comment);
      alert("Avaliação enviada com sucesso!");
      
      // Limpar formulário
      setComment("");
      setRating(5);
      
      // Notificar componente pai
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      setError(err.message || "Erro ao enviar avaliação");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-blue-800">
          <a href="/register/turista" className="font-semibold hover:underline">
            Cadastre-se como turista
          </a>{" "}
          para deixar uma avaliação
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">
        {existingReview ? "Atualizar Avaliação" : "Deixar uma Avaliação"}
      </h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Stars */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Avaliação: {rating} ⭐
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl cursor-pointer transition ${
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Comentário */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comentário *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Compartilhe sua experiência..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="4"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {comment.length}/500 caracteres
          </p>
        </div>

        {/* Botão */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Enviar Avaliação"}
        </button>
      </form>
    </div>
  );
}