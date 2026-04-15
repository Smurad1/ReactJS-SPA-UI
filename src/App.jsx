import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:8080/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [avgGrade, setAvgGrade] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterAvg, setFilterAvg] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents(filters = {}) {
    try {
      setError(null);
      const params = new URLSearchParams();
      const gradeFilter = filters.gradeLevel ?? filterGrade;
      const avgFilter = filters.minAvgGrade ?? filterAvg;
      if (gradeFilter) params.append('gradeLevel', gradeFilter);
      if (avgFilter) params.append('minAvgGrade', avgFilter);
      const query = params.toString() ? `?${params.toString()}` : '';
      const response = await fetch(`${API_BASE}${query}`);
      if (!response.ok) {
        throw new Error(`Failed to load students: ${response.status}`);
      }
      const data = await response.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setStudents([]);
      setError(err.message || 'Unable to load student records.');
    }
  }

  function resetFilters() {
    setFilterGrade('');
    setFilterAvg('');
    loadStudents({ gradeLevel: '', minAvgGrade: '' });
  }

  function resetForm() {
    setStudentName('');
    setGradeLevel('');
    setAvgGrade('');
    setEditingId(null);
    setShowAddForm(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = {
      studentName,
      gradeLevel,
      avgGrade: parseFloat(avgGrade),
    };

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Failed to ${method === 'PUT' ? 'update' : 'create'} student: ${response.status}`);
      }
      resetForm();
      loadStudents();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`Failed to delete student: ${response.status}`);
      }
      loadStudents();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  function handleEdit(student) {
    setEditingId(student.studentId);
    setStudentName(student.studentName);
    setGradeLevel(student.gradeLevel);
    setAvgGrade(student.avgGrade ?? '');
    setShowAddForm(true);
  }

  async function handleExport() {
    try {
      const response = await fetch(`${API_BASE}/export`);
      if (!response.ok) {
        throw new Error(`Failed to export students: ${response.status}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'students.json';
      anchor.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  async function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${API_BASE}/import`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Failed to import students: ${response.status}`);
      }
      event.target.value = null;
      loadStudents();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  const actionLabel = editingId ? 'Update Student' : 'Add Student';

  return (
    <div className="app-container">
      <h1 style={{ textAlign: 'center' }}>Student Records Manager</h1>
      <section className="panel">
        <div className="toolbar">
          <h2>Student List</h2>
        </div>
        {error ? (
          <div className="error-panel">{error}</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Grade Level</th>
                <th>Avg Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(students) ? students : []).map((student) => (
                <tr key={student.studentId ?? Math.random()}>
                  <td>{student.studentName}</td>
                  <td>{student.gradeLevel}</td>
                  <td>{student.avgGrade}</td>
                  <td>
                    <button onClick={() => handleEdit(student)}>Edit</button>
                    <button className="danger" onClick={() => handleDelete(student.studentId)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      {!showAddForm && <button onClick={() => setShowAddForm(true)}>Add Student</button>}
      {showAddForm && (
        <section className="panel">
          <h2>{actionLabel}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Name
              <input value={studentName} onChange={(e) => setStudentName(e.target.value)} required />
            </label>
            <label>
              Grade Level
              <input value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} required />
            </label>
            <label>
              Average Grade
              <input
                type="number"
                step="0.1"
                value={avgGrade}
                onChange={(e) => setAvgGrade(e.target.value)}
                required
              />
            </label>
            <div className="buttons-row">
              <button type="submit">{actionLabel}</button>
              <button type="button" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </section>
      )}

      {!showFilters && <button onClick={() => setShowFilters(true)}>Filters</button>}
      {showFilters && (
        <section className="panel">
          <h2>Filters</h2>
          <label>
            Grade Level
            <input value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)} />
          </label>
          <label>
            Min Avg Grade
            <input
              type="number"
              step="0.1"
              value={filterAvg}
              onChange={(e) => setFilterAvg(e.target.value)}
            />
          </label>
          <div className="buttons-row">
            <button onClick={loadStudents}>Apply Filters</button>
            <button onClick={resetFilters}>Reset</button>
            <button onClick={() => setShowFilters(false)}>Cancel</button>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
