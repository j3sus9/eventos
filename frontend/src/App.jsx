import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CreateEvent from './pages/CreateEvent';
import Home from './pages/Home';
import EditEvent from './pages/EditEvent';
import EventDetail from './pages/EventDetail';
import AccessLogs from './pages/AccessLogs';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/crear" element={<CreateEvent />} />
          <Route path="/editar/:id" element={<EditEvent />} />
          <Route path="/logs" element={<AccessLogs />} />
          <Route path="/detalle/:id" element={<EventDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
