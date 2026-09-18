import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import type { Student, StudentDraft } from '../types/student';

const STORAGE_KEY = 'student-management:students';

interface StudentState {
  students: Student[];
}

type StudentAction =
  | { type: 'ADD'; payload: Student }
  | { type: 'UPDATE'; payload: Student }
  | { type: 'DELETE'; payload: { id: string } }
  | { type: 'LOAD'; payload: Student[] }
  | { type: 'RESET' };

function studentReducer(state: StudentState, action: StudentAction): StudentState {
  switch (action.type) {
    case 'ADD':
      return { students: [...state.students, action.payload] };
    case 'UPDATE':
      return {
        students: state.students.map((s) => (s.id === action.payload.id ? action.payload : s)),
      };
    case 'DELETE':
      return { students: state.students.filter((s) => s.id !== action.payload.id) };
    case 'LOAD':
      return { students: action.payload };
    case 'RESET':
      return { students: createSeedStudents() };
    default:
      return state;
  }
}

function loadInitialStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Student[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore corrupt storage
  }
  return createSeedStudents();
}

function createSeedStudents(): Student[] {
  return seedStudentDrafts.map((draft) => ({ ...draft, id: crypto.randomUUID() }));
}

const seedStudentDrafts: StudentDraft[] = [
  {
    name: 'Ananya Kulkarni',
    gender: 'Female',
    dob: '2003-08-14',
    yearOfAdmission: 2021,
    course: 'Computer Engineering',
    address: { street: '12 Sadashiv Peth', city: 'Pune', state: 'Maharashtra', postalCode: '411030' },
    contact: { phone: '9876543210', email: 'ananya.k@example.com' },
  },
  {
    name: 'Rohan Deshmukh',
    gender: 'Male',
    dob: '2002-11-02',
    yearOfAdmission: 2020,
    course: 'Electronics & Computer Engineering',
    address: { street: '45 FC Road', city: 'Pune', state: 'Maharashtra', postalCode: '411004' },
    contact: { phone: '9123456780', email: 'rohan.d@example.com' },
  },
  {
    name: 'Sara Sheikh',
    gender: 'Female',
    dob: '2004-02-27',
    yearOfAdmission: 2022,
    course: 'Artificial Intelligence & Data Science',
    address: { street: '9 Baner Road', city: 'Pune', state: 'Maharashtra', postalCode: '411045' },
    contact: { phone: '9988776655', email: 'sara.sheikh@example.com' },
  },
  {
    name: 'Aanya Sharma',
    gender: 'Female',
    dob: '2004-05-19',
    yearOfAdmission: 2022,
    course: 'Information Technology',
    address: { street: '21 Kothrud Depot Road', city: 'Pune', state: 'Maharashtra', postalCode: '411038' },
    contact: { phone: '9812345670', email: 'aanyasharma@example.com' },
  },
  {
    name: 'Vivaan Joshi',
    gender: 'Male',
    dob: '2003-01-30',
    yearOfAdmission: 2021,
    course: 'Mechanical Engineering',
    address: { street: '78 Karve Nagar', city: 'Pune', state: 'Maharashtra', postalCode: '411052' },
    contact: { phone: '9765432109', email: 'vivaan.joshi@example.com' },
  },
  {
    name: 'Ishita Rao',
    gender: 'Female',
    dob: '2003-09-08',
    yearOfAdmission: 2021,
    course: 'Electronics & Telecommunication',
    address: { street: '5 Viman Nagar', city: 'Pune', state: 'Maharashtra', postalCode: '411014' },
    contact: { phone: '9654321098', email: 'ishita.rao@example.com' },
  },
  {
    name: 'Kabir Mehta',
    gender: 'Male',
    dob: '2002-12-16',
    yearOfAdmission: 2020,
    course: 'Civil Engineering',
    address: { street: '33 Hadapsar', city: 'Pune', state: 'Maharashtra', postalCode: '411028' },
    contact: { phone: '9543210987', email: 'kabir.mehta@example.com' },
  },
  {
    name: 'Myra Kapoor',
    gender: 'Female',
    dob: '2004-07-23',
    yearOfAdmission: 2022,
    course: 'Computer Engineering',
    address: { street: '61 Aundh', city: 'Pune', state: 'Maharashtra', postalCode: '411007' },
    contact: { phone: '9432109876', email: 'myra.kapoor@example.com' },
  },
  {
    name: 'Devansh Iyer',
    gender: 'Male',
    dob: '2003-04-11',
    yearOfAdmission: 2021,
    course: 'Electrical Engineering',
    address: { street: '14 Wakad', city: 'Pune', state: 'Maharashtra', postalCode: '411057' },
    contact: { phone: '9321098765', email: 'devansh.iyer@example.com' },
  },
];

interface StudentContextValue {
  students: Student[];
  addStudent: (draft: StudentDraft) => void;
  updateStudent: (id: string, draft: StudentDraft) => void;
  deleteStudent: (id: string) => void;
  getStudent: (id: string) => Student | undefined;
  resetToSample: () => void;
}

const StudentContext = createContext<StudentContextValue | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(studentReducer, undefined, () => ({
    students: loadInitialStudents(),
  }));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.students));
  }, [state.students]);

  const addStudent = (draft: StudentDraft) => {
    dispatch({ type: 'ADD', payload: { ...draft, id: crypto.randomUUID() } });
  };

  const updateStudent = (id: string, draft: StudentDraft) => {
    dispatch({ type: 'UPDATE', payload: { ...draft, id } });
  };

  const deleteStudent = (id: string) => {
    dispatch({ type: 'DELETE', payload: { id } });
  };

  const getStudent = (id: string) => state.students.find((s) => s.id === id);

  const resetToSample = () => {
    dispatch({ type: 'RESET' });
  };

  return (
    <StudentContext.Provider
      value={{
        students: state.students,
        addStudent,
        updateStudent,
        deleteStudent,
        getStudent,
        resetToSample,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudents(): StudentContextValue {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error('useStudents must be used within a StudentProvider');
  return ctx;
}
