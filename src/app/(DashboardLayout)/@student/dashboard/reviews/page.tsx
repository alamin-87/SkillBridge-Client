import { getMyReviewsAction } from "@/actions/student-action";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare } from "lucide-react";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i <= rating
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

export default async function StudentReviewsPage() {
  const { success, data } = await getMyReviewsAction();

  const reviews = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-amber-500" />
          My Reviews
        </h2>
        <p className="text-sm text-muted-foreground">
          Reviews you&apos;ve given to tutors
        </p>
      </div>

      {!success || reviews.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            You haven&apos;t written any reviews yet. After completing a
            session, you can leave a review for your tutor.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {reviews.map((r: any) => (
            <Card key={r.id} className="transition-colors hover:bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold truncate">
                        {r.tutor?.user?.name ??
                          r.tutorProfile?.user?.name ??
                          "Tutor"}
                      </p>
                      <StarRating rating={r.rating} />
                    </div>
                    {r.comment && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {r.comment}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(r.createdAt).toLocaleDateString(
                        undefined,
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {r.rating}/5
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
