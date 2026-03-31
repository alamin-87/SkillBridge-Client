import { getAdminReviewsAction } from "@/actions/admin-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, ArrowLeft, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ReviewDeleteButton from "./review-delete-button";
import { ReviewCharts } from "./review-charts";

export default async function AdminReviewsPage() {
  const response = await getAdminReviewsAction();
  const reviews = response?.data;
  const allReviews = Array.isArray(reviews) ? reviews : [];

  const avgRating =
    allReviews.length > 0
      ? (
          allReviews.reduce((sum: number, r: any) => sum + (r.rating ?? 0), 0) /
          allReviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-yellow-500" />
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Review Analytics & Moderation
            </h2>
            <p className="text-sm text-muted-foreground">
              {allReviews.length} platform reviews · Avg Rating: {avgRating}/5
            </p>
          </div>
        </div>

        <Button asChild size="sm" variant="outline">
          <Link href="/admin">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Dashboard
          </Link>
        </Button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Reviews
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{allReviews.length}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{avgRating} / 5</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <ReviewCharts reviews={allReviews} />


      {/* Review List */}
      {allReviews.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No reviews to moderate.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {allReviews.map((review: any) => (
            <Card
              key={review.id}
              className="transition-colors hover:bg-muted/30"
            >
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < (review.rating ?? 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                      <Badge variant="outline">{review.rating}/5</Badge>
                    </div>

                    {review.comment && (
                      <p className="text-sm text-muted-foreground italic">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    )}

                    <div className="flex gap-4 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3 w-3" />
                        <strong>Student:</strong>{" "}
                        {review.student?.name ?? "Unknown"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3 w-3" />
                        <strong>Tutor:</strong>{" "}
                        {review.tutor?.name ?? "Unknown"}
                      </span>
                      {review.booking?.scheduledStart && (
                        <span className="flex items-center gap-1.5">
                          <TrendingUp className="h-3 w-3" />
                          <strong>Session:</strong>{" "}
                          {new Date(
                            review.booking.scheduledStart,
                          ).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Submitted{" "}
                      {new Date(review.createdAt).toLocaleDateString(
                        undefined,
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>

                  <ReviewDeleteButton reviewId={review.id} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
