export interface Business {
  id: string;
  name: string;
  userId: string;
  rubroId: string;
  status: 'in_progress' | 'completed' | 'cancelled';
  isSuccessful: boolean;
  createdAt: string;
  finalizedAt: string | null;
}