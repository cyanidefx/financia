import { useState } from 'react';
import api from '../../utils/api';
import Navbar from '../../components/Navbar';

export default function ExportImport() {
  const [file, setFile] = useState(null);

  const handleExport = async () => {
    const token = localStorage.getItem('token');
    const res = await api.get('/expenses/export', {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'expenses.csv');
    document.body.appendChild(link);
    link.click();
  };

  const handleImport = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    await api.post('/expenses/import', formData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert('Imported successfully');
  };

  return (
    <div>
      <Navbar />
      <h2>Export / Import</h2>
      <button onClick={handleExport}>Export to CSV</button>
      <form onSubmit={handleImport}>
        <input type="file" accept=".csv" onChange={e => setFile(e.target.files[0])} required/>
        <button type="submit">Import CSV</button>
      </form>
    </div>
  );
}
