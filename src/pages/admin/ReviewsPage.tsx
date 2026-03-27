import { BadgeCheck, MessageSquareQuote, Sparkles, Star } from "lucide-react";
import { useState } from "react";
import { useClinic } from "../../context/ClinicContext";
import { Button } from "../../components/ui/Button";
import { AdminPageShell, Panel, StatCard, Toolbar } from "./shared";

function ReviewCard({
  review,
  onApprove,
  onFeature,
}: {
  review: {
    id: string;
    patientName: string;
    rating: number;
    comment: string;
    isApproved: boolean;
    isFeatured: boolean;
  };
  onApprove: () => void;
  onFeature: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.comment.length > 160;

  return (
    <div className={`rounded-xl border bg-white px-5 py-4 transition-all ${review.isApproved ? "border-slate-200" : "border-amber-200 bg-amber-50/30"}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-900">{review.patientName}</span>
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${review.isApproved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
              {review.isApproved ? "Approved" : "Pending"}
            </span>
            {review.isFeatured && (
              <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-white">Featured</span>
            )}
          </div>
          <div className="mt-1.5 flex items-center gap-1 text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`size-3.5 ${i < review.rating ? "fill-current" : "opacity-25"}`} />
            ))}
            <span className="ml-1 text-xs font-semibold text-slate-500">{review.rating}/5</span>
          </div>
          <p className={`mt-2 text-sm leading-6 text-slate-600 ${expanded ? "" : "line-clamp-2"}`}>
            {review.comment}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1 text-xs font-medium text-accent hover:underline"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button variant="secondary" className="py-2 text-xs" onClick={onApprove}>
            {review.isApproved ? "Hide" : "Approve"}
          </Button>
          <Button variant="secondary" className="py-2 text-xs" onClick={onFeature}>
            {review.isFeatured ? "Unfeature" : "Feature"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ReviewsPage() {
  const { reviews, toggleReviewApproval, toggleReviewFeatured } = useClinic();
  const approved = reviews.filter((r) => r.isApproved).length;
  const featured = reviews.filter((r) => r.isFeatured).length;

  return (
    <AdminPageShell
      eyebrow="Reviews"
      title="Review moderation"
      description="Approve, hide, and feature patient feedback before it appears publicly."
    >
      <section className="grid gap-3 md:grid-cols-3">
        <StatCard label="Total submissions" value={String(reviews.length)} detail="All stored entries" icon={MessageSquareQuote} tone="slate" />
        <StatCard label="Approved" value={String(approved)} detail="Visible on the public site" icon={BadgeCheck} />
        <StatCard label="Featured" value={String(featured)} detail="Promoted in testimonials" icon={Sparkles} tone="amber" />
      </section>

      <Panel title="Moderation queue" description="Review content before publishing.">
        <Toolbar searchPlaceholder="Search by name, rating, or comment" />
        <div className="mt-4 space-y-3">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onApprove={() => toggleReviewApproval(review.id)}
              onFeature={() => toggleReviewFeatured(review.id)}
            />
          ))}
        </div>
      </Panel>
    </AdminPageShell>
  );
}
