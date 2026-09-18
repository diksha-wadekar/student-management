import { Link, Route, Routes } from 'react-router-dom';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import StudentDetail from './components/StudentDetail';
import { StudentProvider } from './context/StudentContext';

export default function App() {
  return (
    <StudentProvider>
      <div className="app-shell">
        <header className="app-header">
          <Link to="/" className="brand">
            <span className="brand-mark">&#127891;</span>
            <span>
              D. Y. Patil University
              <span className="brand-sub">Student Register</span>
            </span>
          </Link>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<StudentList />} />
            <Route path="/students/new" element={<StudentForm />} />
            <Route path="/students/:id" element={<StudentDetail />} />
            <Route path="/students/:id/edit" element={<StudentForm />} />
          </Routes>
        </main>
      </div>
    </StudentProvider>
  );
}
