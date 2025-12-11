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
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <Link to="/" className="btn btn-outline mb-4">&larr; Volver al inicio</Link>
      
      <div className="card">
        {event.imagen && (
          <img 
            src={event.imagen} 
            alt={event.nombre} 
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} 
          />
        )}
        
        <div style={{ padding: '2rem' }}>
          <h1 className="mb-8">{event.nombre}</h1>
          
          <div className="grid-events" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h3 className="mb-4">Detalles</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p><strong>Lugar:</strong> {event.lugar}</p>
                <p><strong>Fecha:</strong> {new Date(event.timestamp).toLocaleString()}</p>
                <p><strong>Organizador:</strong> {event.organizador}</p>
                <p><strong>Coordenadas:</strong> {event.lat}, {event.lon}</p>
              </div>
            </div>
            
            <div style={{ height: '300px', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
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
