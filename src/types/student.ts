export type Gender = 'Female' | 'Male' | 'Non-binary' | 'Prefer not to say';

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
}

export interface Student {
  id: string;
  name: string;
  gender: Gender;
  dob: string; // ISO date string, e.g. "2004-06-12"
  yearOfAdmission: number;
  course: string;
  address: Address;
  contact: ContactInfo;
}

export type StudentDraft = Omit<Student, 'id'>;

export const COURSES = [
  'Computer Engineering',
  'Electronics & Computer Engineering',
  'Information Technology',
  'Electronics & Telecommunication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Artificial Intelligence & Data Science',
] as const;

export type Course = (typeof COURSES)[number];

export const GENDERS: Gender[] = ['Female', 'Male', 'Non-binary', 'Prefer not to say'];

export type SortField = 'name' | 'course' | 'yearOfAdmission';
export type SortDirection = 'asc' | 'desc';
