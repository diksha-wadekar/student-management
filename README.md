# Student Register

A React + TypeScript app for managing student records: create, read, update, and
delete students, with search, sorting, filtering, and pagination.

## Features

- **Student fields**: name, gender, date of birth, year of admission, course
  (dropdown), address (street/city/state/postal code), phone and email.
- **CRUD**: add a student, view a paginated & searchable list, edit a record,
  delete with a confirmation dialog.
- **List view**: search by name, filter by course or year of admission, sort by
  name / course / year of admission.
- **Detail view**: dedicated route (`/students/:id`) showing the full record.
- **Validation**: required fields, email format, 10-digit phone, postal code
  format — inline error messages, submit is blocked until valid.
- **State management**: React Context API + `useReducer`, persisted to
  `localStorage` so data survives a page refresh.
- **TypeScript** throughout, strict mode on.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically http://localhost:5173).

## Build

```bash
npm run build   # type-checks and produces a production build in dist/
npm run preview # serve the production build locally
```

## Project structure

```
src/
  types/student.ts        Student, Address, ContactInfo types + course/gender lists
  context/StudentContext.tsx   Context + reducer for global student state (localStorage-backed)
  utils/validation.ts     Form validation rules
  components/
    StudentList.tsx       Search, filter, sort, paginate, delete
    StudentForm.tsx        Add / edit form with validation
    StudentDetail.tsx      Full record view (route-based "detail modal")
    ConfirmDialog.tsx      Reusable delete confirmation dialog
  App.tsx                  Routes
  main.tsx                 Entry point (BrowserRouter + StudentProvider)
```

## Notes

- Sample data is seeded on first run; everything after that is stored in your
  browser's `localStorage` under the key `student-management:students`. Clear
  your browser storage (or edit the seed data in `StudentContext.tsx`) to reset.
- Swapping the Context/reducer for Redux Toolkit would mean replacing
  `StudentContext.tsx` with a slice + store, and swapping `useStudents()` for
  `useSelector`/`useDispatch` — the components themselves wouldn't need to change
  much since they only call `addStudent` / `updateStudent` / `deleteStudent`.
