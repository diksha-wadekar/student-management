import { useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStudents } from '../context/StudentContext';
import { COURSES, GENDERS, type StudentDraft } from '../types/student';
import { validateStudent, hasErrors, type FormErrors } from '../utils/validation';

const emptyDraft: StudentDraft = {
  name: '',
  gender: 'Prefer not to say',
  dob: '',
  yearOfAdmission: new Date().getFullYear(),
  course: '',
  address: { street: '', city: '', state: '', postalCode: '' },
  contact: { phone: '', email: '' },
};

export default function StudentForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { getStudent, addStudent, updateStudent } = useStudents();

  const existing = isEdit && id ? getStudent(id) : undefined;
  const [draft, setDraft] = useState<StudentDraft>(existing ?? emptyDraft);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  if (isEdit && !existing) {
    return (
      <div className="empty-state">
        <h2>Record not found</h2>
        <p>This student record may have been deleted.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Back to register
        </button>
      </div>
    );
  }

  function handleChange<K extends keyof StudentDraft>(field: K, value: StudentDraft[K]) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const validationErrors = validateStudent(draft);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    if (isEdit && id) {
      updateStudent(id, draft);
      navigate(`/students/${id}`);
    } else {
      addStudent(draft);
      navigate('/');
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow-plain">{isEdit ? 'Edit record' : 'New admission'}</p>
          <h1>{isEdit ? draft.name : 'Add a student'}</h1>
        </div>
      </div>

      <form className="record-form" onSubmit={handleSubmit} noValidate>
        <fieldset>
          <legend>Personal details</legend>

          <div className="field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              value={draft.name}
              onChange={(e) => handleChange('name', e.target.value)}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                value={draft.gender}
                onChange={(e) => handleChange('gender', e.target.value as StudentDraft['gender'])}
                aria-invalid={Boolean(errors.gender)}
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              {errors.gender && <span className="field-error">{errors.gender}</span>}
            </div>

            <div className="field">
              <label htmlFor="dob">Date of birth</label>
              <input
                id="dob"
                type="date"
                value={draft.dob}
                onChange={(e) => handleChange('dob', e.target.value)}
                aria-invalid={Boolean(errors.dob)}
              />
              {errors.dob && <span className="field-error">{errors.dob}</span>}
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Academic details</legend>
          <div className="field-row">
            <div className="field">
              <label htmlFor="yearOfAdmission">Year of admission</label>
              <input
                id="yearOfAdmission"
                type="number"
                value={draft.yearOfAdmission}
                onChange={(e) => handleChange('yearOfAdmission', Number(e.target.value))}
                aria-invalid={Boolean(errors.yearOfAdmission)}
              />
              {errors.yearOfAdmission && <span className="field-error">{errors.yearOfAdmission}</span>}
            </div>

            <div className="field">
              <label htmlFor="course">Course</label>
              <select
                id="course"
                value={draft.course}
                onChange={(e) => handleChange('course', e.target.value)}
                aria-invalid={Boolean(errors.course)}
              >
                <option value="">Select a course&hellip;</option>
                {COURSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.course && <span className="field-error">{errors.course}</span>}
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Address</legend>
          <div className="field">
            <label htmlFor="street">Street</label>
            <input
              id="street"
              type="text"
              value={draft.address.street}
              onChange={(e) =>
                handleChange('address', { ...draft.address, street: e.target.value })
              }
              aria-invalid={Boolean(errors.street)}
            />
            {errors.street && <span className="field-error">{errors.street}</span>}
          </div>

          <div className="field-row field-row-3">
            <div className="field">
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                value={draft.address.city}
                onChange={(e) => handleChange('address', { ...draft.address, city: e.target.value })}
                aria-invalid={Boolean(errors.city)}
              />
              {errors.city && <span className="field-error">{errors.city}</span>}
            </div>

            <div className="field">
              <label htmlFor="state">State</label>
              <input
                id="state"
                type="text"
                value={draft.address.state}
                onChange={(e) => handleChange('address', { ...draft.address, state: e.target.value })}
                aria-invalid={Boolean(errors.state)}
              />
              {errors.state && <span className="field-error">{errors.state}</span>}
            </div>

            <div className="field">
              <label htmlFor="postalCode">Postal code</label>
              <input
                id="postalCode"
                type="text"
                value={draft.address.postalCode}
                onChange={(e) =>
                  handleChange('address', { ...draft.address, postalCode: e.target.value })
                }
                aria-invalid={Boolean(errors.postalCode)}
              />
              {errors.postalCode && <span className="field-error">{errors.postalCode}</span>}
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Contact information</legend>
          <div className="field-row">
            <div className="field">
              <label htmlFor="phone">Phone number</label>
              <input
                id="phone"
                type="tel"
                placeholder="10-digit number"
                value={draft.contact.phone}
                onChange={(e) => handleChange('contact', { ...draft.contact, phone: e.target.value })}
                aria-invalid={Boolean(errors.phone)}
              />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={draft.contact.email}
                onChange={(e) => handleChange('contact', { ...draft.contact, email: e.target.value })}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
          </div>
        </fieldset>

        {submitted && hasErrors(errors) && (
          <p className="form-summary-error" role="alert">
            Please fix the highlighted fields before saving.
          </p>
        )}

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEdit ? 'Save changes' : 'Add student'}
          </button>
        </div>
      </form>
    </div>
  );
}
