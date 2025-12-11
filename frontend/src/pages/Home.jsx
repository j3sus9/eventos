import { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link, useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to update map center
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

const Home = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchAddress, setSearchAddress] = useState('');
  const [searchCoords, setSearchCoords] = useState({ lat: 40.416775, lon: -3.703790 }); // Default Madrid
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/events`);
      setEvents(res.data);
      setFilteredEvents(res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchAddress) return;

    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}`);
      
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        const searchLat = parseFloat(lat);
        const searchLon = parseFloat(lon);
        
        setSearchCoords({ lat: searchLat, lon: searchLon });

        // Filter events
        const filtered = events.filter(event => {
          const dist = Math.sqrt(
            Math.pow(event.lat - searchLat, 2) + 
            Math.pow(event.lon - searchLon, 2)
          );
          return dist < 0.2;
        });

        // Sort by timestamp
        filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setFilteredEvents(filtered);
      } else {
        alert('Dirección no encontrada');
      }
    } catch (error) {
      console.error('Error searching:', error);
      alert('Error en la búsqueda');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este evento?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/events/${id}`);
      fetchEvents(); // Refresh list
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error al eliminar');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-2 justify-center mb-4">
          <input
            type="text"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            placeholder="Buscar dirección..."
            className="form-input"
            style={{ maxWidth: '400px' }}
          />
          <button type="submit" className="btn btn-primary">Buscar</button>
        </form>
      </div>

      <div className="flex" style={{ flexDirection: 'column', gap: '2rem' }}>
        {/* Map Section */}
        <div className="card" style={{ height: '400px', width: '100%', border: 'none' }}>
          <MapContainer center={[searchCoords.lat, searchCoords.lon]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <ChangeView center={[searchCoords.lat, searchCoords.lon]} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {filteredEvents.map(event => (
              <Marker key={event._id} position={[event.lat, event.lon]}>
                <Popup>
                  <strong>{event.nombre}</strong><br />
                  {event.lugar}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* List Section */}
        <div>
          <h2 className="mb-4">Eventos Encontrados ({filteredEvents.length})</h2>
          <div className="grid-events">
            {filteredEvents.map(event => (
              <div key={event._id} className="card">
                {event.imagen && (
                  <img src={event.imagen} alt={event.nombre} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                )}
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{event.nombre}</h3>
                  <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                    <strong>Lugar:</strong> {event.lugar}<br/>
                    <strong>Fecha:</strong> {new Date(event.timestamp).toLocaleString()}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <Link to={`/detalle/${event._id}`} className="btn btn-outline" style={{ fontSize: '0.875rem' }}>Ver Detalle</Link>
                    
                    {user && user.email === event.organizador && (
                      <div className="flex gap-2">
                        <Link to={`/editar/${event._id}`} className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}>Editar</Link>
                        <button 
                          onClick={() => handleDelete(event._id)}
                          className="btn btn-danger"
                          style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}
                        >
                          Borrar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
