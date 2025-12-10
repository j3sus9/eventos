import { useState, useEffect } from 'react';
import axios from 'axios';

const AccessLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/logs');
        setLogs(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching logs:', error);
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <div>Cargando logs...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
      <h2>Historial de Accesos</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Fecha/Hora</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Usuario</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Caducidad Token</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Token (Fragmento)</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '12px' }}>{new Date(log.timestamp).toLocaleString()}</td>
                <td style={{ padding: '12px' }}>{log.usuario}</td>
                <td style={{ padding: '12px' }}>{new Date(log.caducidad).toLocaleString()}</td>
                <td style={{ padding: '12px', fontFamily: 'monospace' }}>
                  {log.token ? `${log.token.substring(0, 20)}...` : 'N/A'}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center' }}>No hay registros de acceso</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccessLogs;
