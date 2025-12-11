import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ImageUpload from '../components/ImageUpload';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    lugar: '',
    lat: '',
    lon: '',
    organizador: '',
    imagen: ''
  });

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/events/${id}`);
        setFormData(res.data);
        setLoading(false);
        
        // Check permission
        if (!user || user.email !== res.data.organizador) {
          alert('No tienes permiso para editar este evento');
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        navigate('/');
      }
    };
    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

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
    
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/events/${id}`, formData);
      alert('Evento actualizado con éxito');
      navigate('/');
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Error al actualizar el evento');
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="mb-8 text-center">Editar Evento</h2>
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
            <label className="form-label">Imagen Actual:</label>
            {formData.imagen && (
              <div className="mb-4">
                <img src={formData.imagen} alt="Actual" style={{ maxWidth: '200px', borderRadius: 'var(--radius)' }} />
              </div>
            )}
            <ImageUpload onUpload={handleImageUpload} />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full"
            style={{ padding: '0.75rem' }}
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
