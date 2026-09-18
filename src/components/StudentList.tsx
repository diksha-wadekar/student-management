import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStudents } from '../context/StudentContext';
import { COURSES, type SortDirection, type SortField } from '../types/student';
import ConfirmDialog from './ConfirmDialog';
import Avatar from './Avatar';

const PAGE_SIZE = 6;

export default function StudentList() {
  const { students, deleteStudent, resetToSample } = useStudents();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [page, setPage] = useState(1);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const admissionYears = useMemo(
    () => Array.from(new Set(students.map((s) => s.yearOfAdmission))).sort((a, b) => b - a),
    [students],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return students.filter((s) => {
      const matchesSearch = !term || s.name.toLowerCase().includes(term);
      const matchesCourse = !courseFilter || s.course === courseFilter;
      const matchesYear = !yearFilter || String(s.yearOfAdmission) === yearFilter;
      return matchesSearch && matchesCourse && matchesYear;
    });
  }, [students, search, courseFilter, yearFilter]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') comparison = a.name.localeCompare(b.name);
      else if (sortField === 'course') comparison = a.course.localeCompare(b.course);
      else comparison = a.yearOfAdmission - b.yearOfAdmission;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    return copy;
  }, [filtered, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function toggleSort(field: SortField) {
    if (field === sortField) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setPage(1);
  }

  function sortIndicator(field: SortField) {
    if (field !== sortField) return '';
    return sortDirection === 'asc' ? ' \u2191' : ' \u2193';
  }

  const pendingStudent = students.find((s) => s.id === pendingDeleteId);

  return (
    <div className="page">
      <div className="hero">
        <div className="hero-watermark" aria-hidden="true" />
        <div className="hero-top">
          <div>
            <p className="eyebrow">Register</p>
            <h1>Student records</h1>
            <p className="hero-tagline">Every admission, course and contact detail in one ledger.</p>
          </div>
          <div className="hero-actions">
            <button type="button" className="btn btn-ghost-light" onClick={() => setResetConfirmOpen(true)}>
              Reset sample data
            </button>
            <Link to="/students/new" className="btn btn-primary">
              Add student
            </Link>
          </div>
        </div>

        <div className="stat-strip">
          <div className="stat-tile">
            <span className="stat-figure">{students.length}</span>
            <span className="stat-label">Students on record</span>
          </div>
          <div className="stat-tile">
            <span className="stat-figure">{new Set(students.map((s) => s.course)).size}</span>
            <span className="stat-label">Courses represented</span>
          </div>
          <div className="stat-tile">
            <span className="stat-figure">{admissionYears[0] ?? '—'}</span>
            <span className="stat-label">Latest admission year</span>
          </div>
        </div>
      </div>

      <div className="toolbar">
        <input
          type="search"
          className="search-input"
          placeholder="Search by name&hellip;"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          aria-label="Search students by name"
        />

        <select
          value={courseFilter}
          onChange={(e) => {
            setCourseFilter(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by course"
        >
          <option value="">All courses</option>
          {COURSES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={yearFilter}
          onChange={(e) => {
            setYearFilter(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by year of admission"
        >
          <option value="">All years</option>
          {admissionYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">
          <h2>No records match</h2>
          <p>Try clearing the search or filters, or add a new student to the register.</p>
        </div>
      ) : (
        <>
          <div className="table-wrap">
            <table className="ledger-table">
              <thead>
                <tr>
                  <th>
                    <button type="button" className="sort-btn" onClick={() => toggleSort('name')}>
                      Name{sortIndicator('name')}
                    </button>
                  </th>
                  <th>
                    <button type="button" className="sort-btn" onClick={() => toggleSort('course')}>
                      Course{sortIndicator('course')}
                    </button>
                  </th>
                  <th>
                    <button
                      type="button"
                      className="sort-btn"
                      onClick={() => toggleSort('yearOfAdmission')}
                    >
                      Admitted{sortIndicator('yearOfAdmission')}
                    </button>
                  </th>
                  <th>Contact</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <Link to={`/students/${s.id}`} className="row-link row-link-avatar">
                        <Avatar name={s.name} />
                        {s.name}
                      </Link>
                    </td>
                    <td>{s.course}</td>
                    <td>{s.yearOfAdmission}</td>
                    <td className="muted">{s.contact.email}</td>
                    <td className="col-actions">
                      <button
                        type="button"
                        className="btn btn-small btn-ghost"
                        onClick={() => navigate(`/students/${s.id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-small btn-danger-ghost"
                        onClick={() => setPendingDeleteId(s.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <span className="pagination-count">
              {sorted.length} record{sorted.length === 1 ? '' : 's'} &middot; page {currentPage} of{' '}
              {totalPages}
            </span>
            <div className="pagination-controls">
              <button
                type="button"
                className="btn btn-small btn-ghost"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <button
                type="button"
                className="btn btn-small btn-ghost"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        title="Remove this student?"
        message={
          pendingStudent
            ? `This will permanently remove ${pendingStudent.name} from the register. This can't be undone.`
            : ''
        }
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) deleteStudent(pendingDeleteId);
          setPendingDeleteId(null);
        }}
      />

      <ConfirmDialog
        open={resetConfirmOpen}
        title="Reset to sample data?"
        message="This replaces every record currently in the register with a fresh set of 9 sample students. Any records you've added or edited will be lost."
        confirmLabel="Reset"
        onCancel={() => setResetConfirmOpen(false)}
        onConfirm={() => {
          resetToSample();
          setResetConfirmOpen(false);
          setPage(1);
        }}
      />
    </div>
  );
}
