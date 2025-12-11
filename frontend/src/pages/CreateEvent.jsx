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
      timestamp: new Date(),
      // Ensure lat/lon are numbers, default to 0 if empty to avoid validation error
      lat: formData.lat ? parseFloat(formData.lat) : 0,
      lon: formData.lon ? parseFloat(formData.lon) : 0
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
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="mb-8 text-center">Crear Nuevo Evento</h2>
      <div className="card" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre del Evento:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Lugar:</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="lugar"
                value={formData.lugar}
                onChange={handleChange}
                required
                className="form-input"
              />
              <button type="button" onClick={handleGeocode} className="btn btn-outline">
                Buscar Coordenadas
              </button>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="w-full">
              <label className="form-label">Latitud:</label>
              <input
                type="number"
                step="any"
                name="lat"
                value={formData.lat}
                readOnly
                required
                className="form-input"
                style={{ backgroundColor: '#f1f5f9' }}
              />
            </div>
            <div className="w-full">
              <label className="form-label">Longitud:</label>
              <input
                type="number"
                step="any"
                name="lon"
                value={formData.lon}
                readOnly
                required
                className="form-input"
                style={{ backgroundColor: '#f1f5f9' }}
              />
            </div>
          </div>

          <div className="mb-8">
            <ImageUpload onUpload={handleImageUpload} />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full"
            style={{ padding: '0.75rem' }}
          >
            Crear Evento
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
