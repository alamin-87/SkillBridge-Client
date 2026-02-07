import { getStudentByIdAction } from "@/actions/student-action";
import { StudentProfileView } from "@/components/modules/student/student-profileView";

export default async function StudentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getStudentByIdAction(id);

  if (!result.success) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h2 className="font-semibold text-red-900">Error</h2>
          <p className="text-sm text-red-800">{result.message}</p>
          <p className="mt-2 text-xs text-red-700">User ID: {id}</p>
        </div>
      </div>
    );
  }

  const student = result.data;

  if (!student) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <h2 className="font-semibold text-yellow-900">No Data</h2>
          <p className="text-sm text-yellow-800">Student profile is empty</p>
        </div>
      </div>
    );
  }

   return <StudentProfileView student={student} />;
}
