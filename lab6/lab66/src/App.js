import React, { useState, useEffect } from 'react';
import './App.css';
import ReservationForm from './components/ReservationForm';
import ReservationsList from './components/ReservationsList';
import DownloadButtons from './components/DownloadButtons';

function App() {
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({
    tableId: '',
    date: '',
    time: '',
    name: '',
    phone: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTables();
    fetchReservations();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await fetch('http://localhost:3001/tables');
      const data = await response.json();
      setTables(data);
    } catch (error) {
      setError('Failed to fetch tables');
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await fetch('http://localhost:3001/reservations');
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      setError('Failed to fetch reservations');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3001/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const updatedReservations = await response.json();
      setReservations(updatedReservations);
      setFormData({
        tableId: '',
        date: '',
        time: '',
        name: '',
        phone: ''
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/reservations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete reservation');
      }

      const updatedReservations = await response.json();
      setReservations(updatedReservations);
    } catch (error) {
      setError(error.message);
    }
  };

  const downloadReservations = async (format) => {
    try {
      const headers = {
        'application/xml': 'application/xml',
        'text/html': 'text/html',
        'application/json': 'application/json'
      };

      const response = await fetch('http://localhost:3001/reservations', {
        headers: {
          'Accept': headers[format]
        }
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reservations.${format.split('/')[1] || 'json'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setError('Failed to download reservations');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Table Reservation System</h1>
      </header>

      <main className="App-main">
        {error && <div className="error">{error}</div>}

        <ReservationForm
          tables={tables}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />

        <section className="reservations-list">
          <h2>Current Reservations</h2>
          <DownloadButtons downloadReservations={downloadReservations} />
          <ReservationsList
            reservations={reservations}
            handleDelete={handleDelete}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
