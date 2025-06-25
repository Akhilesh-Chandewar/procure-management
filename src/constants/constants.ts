export enum UserRole {
  ADMIN = 'admin',
  PROCUREMENT_MANAGER = 'procurement_manager',
  INSPECTION_MANAGER = 'inspection_manager',
  CLIENT = 'client'
}

export enum OrderStatus {
  CREATED = 'created',
  CHECKLIST_ASSIGNED = 'checklist_assigned',
  INSPECTION_IN_PROGRESS = 'inspection_in_progress',
  INSPECTION_COMPLETED = 'inspection_completed',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed'
}

export enum QuestionType {
  BOOLEAN = 'boolean', // Yes/No questions
  SINGLE_CHOICE = 'single_choice', // Dropdown/Radio
  MULTIPLE_CHOICE = 'multiple_choice', // Checkboxes
  TEXT = 'text', // Text input
  FILE_UPLOAD = 'file_upload', // Image/File upload
  SUMMARY = 'summary' // Long text summary
}
