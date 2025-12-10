import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../utils/types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  console.error('EXPO_PUBLIC_API_URL is not defined');
}

const getToken = async () => {
  return await AsyncStorage.getItem('userToken');
};

export const api = {
  register: async (email: string, password: string): Promise<{ token: string; user: any }> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Registration failed');
      }
      return data.data;
    } catch (e: any) {
      console.error("Registration error response:", text);
      if (e instanceof SyntaxError) {
         throw new Error(`Server returned invalid JSON: ${text.substring(0, 100)}`);
      }
      throw e;
    }
  },

  login: async (email: string, password: string): Promise<{ token: string; user: any }> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Login failed');
      }
      return data.data;
    } catch (e: any) {
      console.error("Login error response:", text);
      // If it's a JSON parse error, throw a more helpful message with the raw text
      if (e instanceof SyntaxError) {
         throw new Error(`Server returned invalid JSON: ${text.substring(0, 100)}`);
      }
      throw e;
    }
  },

  getTasks: async (): Promise<Task[]> => {
    const token = await getToken();
    const response = await fetch(`${API_URL}/todos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch tasks');
    }
    return data.data;
  },

  createTask: async (task: { title: string; location?: { latitude: number; longitude: number } | null; photoUri?: string }) => {
    const token = await getToken();
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: task.title,
        completed: false,
        location: task.location || undefined,
        photoUri: task.photoUri || undefined,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to create task');
    }
    return data.data; // Returns the created task
  },

  updateTask: async (id: string, updates: Partial<Task>) => {
    const token = await getToken();
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to update task');
    }
    return data.data;
  },

  deleteTask: async (id: string) => {
    const token = await getToken();
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to delete task');
    }
    return data;
  },

  uploadImage: async (uri: string): Promise<string> => {
    const token = await getToken();
    const formData = new FormData();
    
    // Infer type from extension
    const match = /\.(\w+)$/.exec(uri);
    const type = match ? `image/${match[1]}` : `image`;
    const filename = uri.split('/').pop() || 'image.jpg';

    // @ts-ignore: React Native FormData expects { uri, name, type }
    formData.append('image', {
      uri,
      name: filename,
      type,
    });

    const response = await fetch(`${API_URL}/images`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to upload image');
    }
    return data.data.url; // Assuming the API returns the URL in data.url
  }
};
