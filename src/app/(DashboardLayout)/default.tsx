/**
 * Dashboard Layout - Default Fallback
 * 
 * Since this layout primarily relies on Parallel Routing (@admin, @tutor, @student), 
 * the implicit standard {children} slot is not used in layout.tsx.
 * 
 * Next.js requires a default.tsx fallback for the implied root children slot to 
 * prevent 404 errors during hard reloads on nested parallel routes.
 * 
 * Returning null is the architecturally correct behavior here.
 */
export default function DashboardDefault() {
  return null;
}
