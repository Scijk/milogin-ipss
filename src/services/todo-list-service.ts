import { api } from '../api/client';
import { TodoItem, TodoRequest, TodoResponse, TodoUpdateRequest } from '../types/TodoItem';
import { getToken } from './token.service';



const authHeader = async () => {
  const token = await getToken();
  return {
    Authorization: `Bearer ${token}`
  };
};

export const listTodos = async () => {
  try {
    const { data } = await api.get<TodoItem>('/todos', {
      headers: await authHeader()
    });
    return data.data;
  } catch (error) {
    console.log('Error listando todos:', error);
    throw error;
  }
};

export const getTodo = async (id: string) => {
  try {
    const { data } = await api.get<TodoResponse>(`/todos/${id}`, {
      headers: await authHeader()
    });
    return data.data;
  } catch (error) {
    console.log('Error obteniendo todo:', error);
    throw error;
  }
};

export const createTodo = async (request: TodoRequest) => {
  try {
    const { data } = await api.post<TodoResponse>('/todos',
      request,
      { headers: {
          ...(await authHeader())
      }
      }
    );
    return data;
  } catch (error) {
    console.log('Error creando todo:', error);
    throw error;
  }
};

export const deleteTodo = async (id: string) => {
  try {
    const { data } = await api.delete(`/todos/${id}`, {
      headers: await authHeader()
    });
    return data;
  } catch (error) {
    console.log('Error eliminando todo:', error);
    throw error;
  }
};

export const updateTodo = async (id: string, payload: TodoUpdateRequest) => {
  const { data } = await api.put<TodoResponse>(
    `/todos/${id}`,
    payload,
    {
      headers: {
        ...(await authHeader())
      }
    }
  );
  return data;
};

export const uploadImage = async (imageUri: string) => {
  const token = await getToken();

  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const formData = new FormData();

  formData.append('image', {
    uri: imageUri,
    name: 'photo.jpg',
    type: 'image/jpeg'
  } as any);

  const { data } = await api.post('/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  });

  return data;
};