// utils/types.ts
export interface Task {
  id: string;
  title: string;
  photoUri?: string; // Changed from imageUri to match API
  completed: boolean;
  location?: { latitude: number; longitude: number } | null;
  userId?: string; // Changed from userEmail to match API
  createdAt?: string;
  updatedAt?: string;
}
