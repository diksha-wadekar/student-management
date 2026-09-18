import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStudents } from '../context/StudentContext';
import ConfirmDialog from './ConfirmDialog';
import Avatar from './Avatar';

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getStudent, deleteStudent } = useStudents();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const student = id ? getStudent(id) : undefined;

  if (!student) {
    return (
      <div className="empty-state">
        <h2>Record not found</h2>
        <p>This student record may have been deleted.</p>
        <Link to="/" className="btn btn-primary">
          Back to register
        </Link>
      </div>
    );
  }

  const dobFormatted = new Date(student.dob).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow-plain">Student record</p>
          <h1>{student.name}</h1>
        </div>
        <div className="header-actions">
          <Link to={`/students/${student.id}/edit`} className="btn btn-ghost">
            Edit
          </Link>
          <button type="button" className="btn btn-danger" onClick={() => setConfirmOpen(true)}>
            Delete
          </button>
        </div>
      </div>

      <div className="record-card">
        <div className="record-banner">
          <Avatar name={student.name} size="lg" />
          <div>
            <p className="record-banner-eyebrow">{student.course}</p>
            <p className="record-banner-name">{student.name}</p>
            <p className="record-banner-sub">
              Admitted {student.yearOfAdmission} &middot; Roll ref {student.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        <section className="record-section">
          <h2>Personal</h2>
          <dl>
            <div className="record-row">
              <dt>Gender</dt>
              <dd>{student.gender}</dd>
            </div>
            <div className="record-row">
              <dt>Date of birth</dt>
              <dd>{dobFormatted}</dd>
            </div>
          </dl>
        </section>

        <section className="record-section">
          <h2>Academic</h2>
          <dl>
            <div className="record-row">
              <dt>Course</dt>
              <dd>{student.course}</dd>
            </div>
            <div className="record-row">
              <dt>Year of admission</dt>
              <dd>{student.yearOfAdmission}</dd>
            </div>
          </dl>
        </section>

        <section className="record-section">
          <h2>Address</h2>
          <p className="address-block">
            {student.address.street}
            <br />
            {student.address.city}, {student.address.state} {student.address.postalCode}
          </p>
        </section>

        <section className="record-section">
          <h2>Contact</h2>
          <dl>
            <div className="record-row">
              <dt>Phone</dt>
              <dd>{student.contact.phone}</dd>
            </div>
            <div className="record-row">
              <dt>Email</dt>
              <dd>{student.contact.email}</dd>
            </div>
          </dl>
        </section>
      </div>

      <button type="button" className="back-link" onClick={() => navigate('/')}>
        &larr; Back to register
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title="Remove this student?"
        message={`This will permanently remove ${student.name} from the register. This can't be undone.`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          deleteStudent(student.id);
          navigate('/');
        }}
      />
    </div>
  );
}
