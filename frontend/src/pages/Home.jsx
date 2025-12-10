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
    <div style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
          <input
            type="text"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            placeholder="Buscar dirección..."
            style={{ padding: '0.5rem', width: '300px' }}
          />
          <button type="submit" style={{ padding: '0.5rem 1rem' }}>Buscar</button>
        </form>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
        {/* Map Section */}
        <div style={{ height: '400px', width: '100%', border: '1px solid #ccc' }}>
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
          <h2>Eventos Encontrados ({filteredEvents.length})</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {filteredEvents.map(event => (
              <div key={event._id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', textAlign: 'left' }}>
                {event.imagen && (
                  <img src={event.imagen} alt={event.nombre} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} />
                )}
                <h3>{event.nombre}</h3>
                <p><strong>Lugar:</strong> {event.lugar}</p>
                <p><strong>Fecha:</strong> {new Date(event.timestamp).toLocaleString()}</p>
                <p><strong>Organizador:</strong> {event.organizador}</p>
                
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <Link to={`/detalle/${event._id}`} style={{ textDecoration: 'none', color: 'blue' }}>Ver Detalle</Link>
                  
                  {user && user.email === event.organizador && (
                    <>
                      <Link to={`/editar/${event._id}`} style={{ textDecoration: 'none', color: 'green' }}>Editar</Link>
                      <button 
                        onClick={() => handleDelete(event._id)}
                        style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                      >
                        Borrar
                      </button>
                    </>
                  )}
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
