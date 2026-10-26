
export type Task = {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
  };
  
  export type CreateTaskInput = {
    title: string;
    description?: string;
    completed?: boolean;
  };
  
  export type UpdateTaskInput = {
    title?: string;
    description?: string;
    completed?: boolean;
  };
  
  export type TaskFilters = {
    q?: string;
    completed?: boolean;
  };
  