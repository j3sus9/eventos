import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../components/ImageUpload';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    lugar: '',
    lat: '',
    lon: '',
    organizador: '', // Should be auto-filled from logged in user ideally
    imagen: ''
  });

  // Get user from local storage to set organizer
  const user = JSON.parse(localStorage.getItem('user'));

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (url) => {
    setFormData({
      ...formData,
      imagen: url
    });
  };

  const handleGeocode = async () => {
    if (!formData.lugar) return;
    
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.lugar)}`);
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setFormData(prev => ({
          ...prev,
          lat: parseFloat(lat),
          lon: parseFloat(lon)
        }));
        alert(`Coordenadas encontradas: ${lat}, ${lon}`);
      } else {
        alert('No se encontraron coordenadas para esta dirección');
      }
    } catch (error) {
      console.error('Error geocoding:', error);
      alert('Error al obtener coordenadas');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Debes iniciar sesión para crear un evento');
      return;
    }

    const eventData = {
      ...formData,
      organizador: user.email,
      timestamp: new Date()
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/events`, eventData);
      alert('Evento creado con éxito');
      navigate('/');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error al crear el evento');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
      <h2>Crear Nuevo Evento</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Nombre del Evento:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Lugar:</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              name="lugar"
              value={formData.lugar}
              onChange={handleChange}
              required
              style={{ flex: 1, padding: '0.5rem' }}
            />
            <button type="button" onClick={handleGeocode} style={{ padding: '0.5rem' }}>
              Buscar Coordenadas
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label>Latitud:</label>
            <input
              type="number"
              step="any"
              name="lat"
              value={formData.lat}
              readOnly
              required
              style={{ width: '100%', padding: '0.5rem', backgroundColor: '#f0f0f0' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Longitud:</label>
            <input
              type="number"
              step="any"
              name="lon"
              value={formData.lon}
              readOnly
              required
              style={{ width: '100%', padding: '0.5rem', backgroundColor: '#f0f0f0' }}
            />
          </div>
        </div>

        <ImageUpload onUpload={handleImageUpload} />

        <button 
          type="submit" 
          style={{ 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Crear Evento
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
