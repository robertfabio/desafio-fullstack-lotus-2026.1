export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string;
  shared: boolean;
  deadline: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectPayload {
  name: string;
  description: string;
  deadline: string | null;
  shared: boolean;
}

export interface ProjectSummary {
  total: number;
  pending: number;
  in_progress: number;
  done: number;
}
