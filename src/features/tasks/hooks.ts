
import {
    useMutation,
    useQuery,
    useQueryClient,
  } from "@tanstack/react-query";
  
  import {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
  } from "./api";
  
  import type {
    CreateTaskInput,
    TaskFilters,
    UpdateTaskInput,
  } from "./types";
  
  export const taskKeys = {
    all: ["tasks"] as const,
    lists: () => [...taskKeys.all, "list"] as const,
    list: (filters: TaskFilters) =>
      [...taskKeys.lists(), filters] as const,
    details: () => [...taskKeys.all, "detail"] as const,
    detail: (id: number) => [...taskKeys.details(), id] as const,
  };
  
  export function useTasks(filters: TaskFilters = {}) {
    return useQuery({
      queryKey: taskKeys.list(filters),
      queryFn: () => getTasks(filters),
    });
  }
  
  export function useTask(id: number) {
    return useQuery({
      queryKey: taskKeys.detail(id),
      queryFn: () => getTask(id),
      enabled: Number.isInteger(id) && id > 0,
    });
  }
  
  export function useCreateTask() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (input: CreateTaskInput) => createTask(input),
      onSuccess: () => {
        return queryClient.invalidateQueries({
          queryKey: taskKeys.all,
        });
      },
    });
  }
  
  export function useUpdateTask() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: ({
        id,
        input,
      }: {
        id: number;
        input: UpdateTaskInput;
      }) => updateTask(id, input),
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({
          queryKey: taskKeys.all,
        });
  
        return queryClient.invalidateQueries({
          queryKey: taskKeys.detail(variables.id),
        });
      },
    });
  }
  
  export function useDeleteTask() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (id: number) => deleteTask(id),
      onSuccess: () => {
        return queryClient.invalidateQueries({
          queryKey: taskKeys.all,
        });
      },
    });
  }
  