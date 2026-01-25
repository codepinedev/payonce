export interface Submission {
  id?: string;
  name: string;
  url: string;
  category: string;
  platform: string;
  price: number;
  email?: string;
  status: "pending" | "approved" | "rejected";
  created_at?: string;
}

export type SubmissionInsert = Omit<Submission, "id" | "created_at" | "status">;
