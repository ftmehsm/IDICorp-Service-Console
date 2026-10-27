
import { api } from "../../api/axios";
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilters,
} from "./types";

export async function getTasks(
  filters: TaskFilters = {},
): Promise<Task[]> {
  const response = await api.get<Task[]>("/api/tasks", {
    params: {
      ...(filters.q?.trim() ? { q: filters.q.trim() } : {}),
      ...(filters.completed !== undefined
        ? { completed: filters.completed }
        : {}),
    },
  });

  return response.data;
}

export async function getTask(id: number): Promise<Task> {
  const response = await api.get<Task>(`/api/tasks/${id}`);
  return response.data;
}

export async function createTask(
  input: CreateTaskInput,
): Promise<Task> {
  const response = await api.post<Task>("/api/tasks", input);
  return response.data;
}

export async function updateTask(
  id: number,
  input: UpdateTaskInput,
): Promise<Task> {
  const response = await api.patch<Task>(`/api/tasks/${id}`, input);
  return response.data;
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/api/tasks/${id}`);
}
