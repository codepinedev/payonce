export interface Feedback {
  id?: string;
  tool_id: string;
  useful: boolean;
  comment?: string;
  created_at?: string;
}

export type FeedbackInsert = Omit<Feedback, "id" | "created_at">;
