export type Tutor = {
  id: string;
  name: string;
  title?: string;
  bio?: string;
  subjects?: string[];
  hourlyRate?: number;
  experienceYrs?: number;
  languages?: string[];
  avgRating?: number;
  totalReviews?: number;
  tutorAvailability?: string[];
  profileImage?: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    profileImage?: string | null;
  };
};
