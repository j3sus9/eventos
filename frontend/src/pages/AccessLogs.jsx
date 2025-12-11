import { useState, useEffect } from 'react';
import axios from 'axios';

const AccessLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/logs`);
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
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2 className="mb-8">Historial de Accesos</h2>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Fecha/Hora</th>
              <th>Usuario</th>
              <th>Caducidad Token</th>
              <th>Token (Fragmento)</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.usuario}</td>
                <td>{new Date(log.caducidad).toLocaleString()}</td>
                <td style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>
                  {log.token ? `${log.token.substring(0, 20)}...` : 'N/A'}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center" style={{ padding: '2rem' }}>No hay registros de acceso</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccessLogs;
