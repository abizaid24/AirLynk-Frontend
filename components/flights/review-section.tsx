"use client";

import { useEffect, useState } from "react";
import { Star, Loader2, MessageSquare } from "lucide-react";
import { reviewsService } from "@/services/reviews.service";
import type { ReviewListResponse } from "@/types/review";
import { getApiErrorMessage } from "@/lib/api-client";
import { formatDate, cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function StarRating({
  value,
  onChange,
  readOnly = false,
  size = "size-4",
}: {
  value: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
  size?: string;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(n)}
          className={cn(!readOnly && "cursor-pointer", readOnly && "cursor-default")}
        >
          <Star
            className={cn(
              size,
              n <= value ? "fill-aurora text-aurora" : "fill-transparent text-chrome/30"
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function ReviewSection({ flightId }: { flightId: string }) {
  const { isAuthenticated } = useAuthStore();
  const [data, setData] = useState<ReviewListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function load() {
    reviewsService
      .listForFlight(flightId)
      .then(setData)
      .catch((err) => toast.error(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flightId]);

  async function handleSubmit() {
    if (rating === 0) {
      toast.error("Choose a star rating first");
      return;
    }
    setSubmitting(true);
    try {
      await reviewsService.submit({
        flight_id: flightId,
        rating,
        comment: comment.trim() || null,
      });
      setRating(0);
      setComment("");
      toast.success("Thanks for the review");
      setLoading(true);
      load();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl text-pearl">Ratings & reviews</h2>
        {data && data.total > 0 && (
          <div className="flex items-center gap-2">
            <StarRating value={Math.round(data.average_rating)} readOnly />
            <span className="text-sm text-chrome">
              {data.average_rating.toFixed(1)} · {data.total} review
              {data.total > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {isAuthenticated && (
        <div className="mt-5 rounded-2xl border border-border p-5">
          <p className="text-sm text-pearl">Leave a review</p>
          <div className="mt-2">
            <StarRating value={rating} onChange={setRating} size="size-6" />
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share how the flight went (optional)"
            rows={3}
            className="mt-3 w-full rounded-xl border border-input bg-navy-900/60 px-4 py-2.5 text-sm text-pearl placeholder:text-chrome-dim outline-none focus-visible:border-aurora focus-visible:ring-2 focus-visible:ring-aurora/30"
          />
          <Button size="sm" className="mt-3" onClick={handleSubmit} disabled={submitting}>
            {submitting ? <Loader2 className="size-4 animate-spin" /> : <MessageSquare className="size-4" />}
            Submit review
          </Button>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 className="size-5 animate-spin text-aurora" />
          </div>
        )}

        {!loading && data?.items.length === 0 && (
          <p className="text-sm text-chrome-dim">
            No reviews yet — be the first to share your experience.
          </p>
        )}

        {!loading &&
          data?.items.map((review) => (
            <div key={review.id} className="border-t border-border pt-4 first:border-t-0 first:pt-0">
              <div className="flex items-center justify-between">
                <p className="text-sm text-pearl">{review.user_name ?? "AirLynk traveller"}</p>
                <span className="text-xs text-chrome-dim">{formatDate(review.created_at)}</span>
              </div>
              <div className="mt-1">
                <StarRating value={review.rating} readOnly size="size-3.5" />
              </div>
              {review.comment && (
                <p className="mt-2 text-sm text-chrome">{review.comment}</p>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
