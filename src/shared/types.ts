export type Role = 'STUDENT' | 'CREATOR' | 'ADMIN';
export type Status = 'PENDING' | 'APPROVED' | 'REJECTED';
export type SubmissionType = 'QUESTION' | 'PERSONALITY';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
}

export interface QuestionOption {
  label: string;
  text: string;
  scores: Record<string, number>;
}

export interface Question {
  id: string;
  content: string;
  options: QuestionOption[];
  category?: string;
  status: Status;
  createdBy?: string;
  createdAt: string;
}

export interface PersonalityTrait {
  name: string;
  value: number;
}

export interface Personality {
  id: string;
  name: string;
  title: string;
  description: string;
  traits: PersonalityTrait[];
  icon: string;
  color: string;
  pixelArt?: string[];
  status: Status;
  createdAt: string;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  questionCount?: number;
  createdAt: string;
}

export interface TestResult {
  id: string;
  userId: string;
  templateId: string;
  personalityId: string;
  scores: Record<string, number>;
  answers: { questionId: string; optionIndex: number }[];
  personality?: Personality;
  template?: Template;
  createdAt: string;
}

export interface Submission {
  id: string;
  type: SubmissionType;
  content: unknown;
  status: Status;
  remark?: string;
  creatorId: string;
  reviewerId?: string;
  createdAt: string;
  reviewedAt?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role?: Role;
}

export interface TestAnswer {
  questionId: string;
  optionIndex: number;
}

export interface TestSubmitInput {
  templateId: string;
  answers: TestAnswer[];
}
