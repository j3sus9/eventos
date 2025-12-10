import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/events/${id}`);
        setEvent(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event:', error);
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (!event) return <div>Evento no encontrado</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem', textAlign: 'left' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '1rem' }}>&larr; Volver al inicio</Link>
      
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
        {event.imagen && (
          <img 
            src={event.imagen} 
            alt={event.nombre} 
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} 
          />
        )}
        
        <div style={{ padding: '2rem' }}>
          <h1 style={{ marginTop: 0 }}>{event.nombre}</h1>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <h3>Detalles</h3>
              <p><strong>Lugar:</strong> {event.lugar}</p>
              <p><strong>Fecha:</strong> {new Date(event.timestamp).toLocaleString()}</p>
              <p><strong>Organizador:</strong> {event.organizador}</p>
              <p><strong>Coordenadas:</strong> {event.lat}, {event.lon}</p>
            </div>
            
            <div style={{ height: '300px', border: '1px solid #ccc' }}>
              <MapContainer center={[event.lat, event.lon]} zoom={15} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[event.lat, event.lon]}>
                  <Popup>{event.lugar}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
