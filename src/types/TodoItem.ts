export type TodoRequest = {
    title: string;
    completed: boolean;
    location?: {
        latitude: number;
        longitude: number;
    };
    photoUri?: string;
};

export type TodoUpdateRequest = {
  title?: string;
  completed?: boolean;
  location?: {
    latitude: number;
    longitude: number;
  };
  photoUri?: string;
};

export type TodoListResponse = {
    id: string;
    userId: string;
    title: string;
    completed: boolean;
    location?: {
        latitude: number;
        longitude: number;
    };
    photoUri?: string;
    createdAt: string;
    updatedAt: string;
};

export type TodoResponse = {
    success: boolean;
    data: {
        id: string;
        userId: string;
        title: string;
        completed: boolean;
        location?: {
            latitude: number;
            longitude: number;
        };
        photoUri?: string;
        createdAt: string;
        updatedAt: string;
    };
};

export type TodoItem = { 
    count: number;
    success: boolean;
    data: TodoListResponse[];
}