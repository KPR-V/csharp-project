export interface Task {
  id: string;
  title: string;
  dueDate?: string;
  isCompleted: boolean;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  dueDate?: string;
  isCompleted?: boolean;
}

export interface UpdateTaskDto {
  title?: string;
  dueDate?: string;
  isCompleted?: boolean;
}
