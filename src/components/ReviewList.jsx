import React, { useState, useEffect } from "react";
import { getPlaceReviews } from "../services/reviewService";

export default function ReviewsList({ placeId, refreshTrigger }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, [placeId, refreshTrigger]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await getPlaceReviews(placeId);
      setReviews(data);
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Carregando avaliações...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
        Nenhuma avaliação ainda. Seja o primeiro a avaliar!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">
        Avaliações ({reviews.length})
      </h3>

      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-gray-50 p-4 rounded-lg border border-gray-200"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-semibold text-gray-800">
                {review.userDisplayName}
              </p>
              <p className="text-yellow-400">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
            </div>
            <p className="text-xs text-gray-500">
              {new Date(review.createdAt?.toDate?.() || review.createdAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <p className="text-gray-700">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}