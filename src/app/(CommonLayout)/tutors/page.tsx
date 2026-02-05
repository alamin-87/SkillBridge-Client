import { getTutorsAction, getTutorsListAction } from "@/actions/tutor-action";
import { TutorsPageClient } from "@/components/modules/tutors/Tutors";


type SearchParams = {
  search?: string;
  sort?: string;
  page?: string;
};

export default async function TutorsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const search = sp.search ?? "";
  const sort = sp.sort ?? "rating_desc";
  const page = Number(sp.page ?? "1") || 1;

  const { tutors, meta } = await getTutorsListAction({
    search,
    sort,
    page,
    limit: 12,
  });

  return (
    <TutorsPageClient
      initialTutors={tutors}
      meta={meta}
      initialSearch={search}
      initialSort={sort}
      initialPage={page}
    />
  );
}
