export interface CreateTodoDto {
  title: string;
  description?: string;
  isPinned?: boolean;
  isCompleted?: boolean;
  isArchived?: boolean;
  deadline?: Date;
}
