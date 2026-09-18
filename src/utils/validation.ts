import type { StudentDraft } from '../types/student';

export type FormErrors = Partial<Record<
  | 'name'
  | 'gender'
  | 'dob'
  | 'yearOfAdmission'
  | 'course'
  | 'street'
  | 'city'
  | 'state'
  | 'postalCode'
  | 'phone'
  | 'email',
  string
>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9]{10}$/;
const POSTAL_RE = /^[0-9]{4,6}$/;

export function validateStudent(draft: StudentDraft): FormErrors {
  const errors: FormErrors = {};
  const currentYear = new Date().getFullYear();

  if (!draft.name.trim()) {
    errors.name = 'Name is required.';
  } else if (draft.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!draft.gender) {
    errors.gender = 'Please select a gender.';
  }

  if (!draft.dob) {
    errors.dob = 'Date of birth is required.';
  } else {
    const dobDate = new Date(draft.dob);
    const age = currentYear - dobDate.getFullYear();
    if (dobDate.getTime() > Date.now()) {
      errors.dob = 'Date of birth cannot be in the future.';
    } else if (age > 100) {
      errors.dob = 'Please check the date of birth.';
    }
  }

  if (!draft.yearOfAdmission) {
    errors.yearOfAdmission = 'Year of admission is required.';
  } else if (draft.yearOfAdmission < 1990 || draft.yearOfAdmission > currentYear + 1) {
    errors.yearOfAdmission = `Enter a year between 1990 and ${currentYear + 1}.`;
  }

  if (!draft.course) {
    errors.course = 'Please select a course.';
  }

  if (!draft.address.street.trim()) errors.street = 'Street address is required.';
  if (!draft.address.city.trim()) errors.city = 'City is required.';
  if (!draft.address.state.trim()) errors.state = 'State is required.';
  if (!draft.address.postalCode.trim()) {
    errors.postalCode = 'Postal code is required.';
  } else if (!POSTAL_RE.test(draft.address.postalCode.trim())) {
    errors.postalCode = 'Enter a valid postal code (4-6 digits).';
  }

  if (!draft.contact.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!PHONE_RE.test(draft.contact.phone.trim())) {
    errors.phone = 'Enter a valid 10-digit phone number.';
  }

  if (!draft.contact.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_RE.test(draft.contact.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  return errors;
}

export function hasErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}
