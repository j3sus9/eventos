import { useState } from 'react';
import axios from 'axios';

const ImageUpload = ({ onUpload }) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    setPreview(URL.createObjectURL(file));
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'dolvo0vvq'); // Using provided preset

    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dolvo0vvq/image/upload', // Using provided cloud name
        formData
      );
      
      const imageUrl = res.data.secure_url;
      console.log('Image uploaded:', imageUrl);
      onUpload(imageUrl);
      setLoading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      setLoading(false);
      alert('Error al subir la imagen');
    }
  };

  return (
    <div style={{ margin: '1rem 0' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem' }}>Imagen del Evento:</label>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        disabled={loading}
      />
      {loading && <p>Subiendo imagen...</p>}
      {preview && (
        <div style={{ marginTop: '1rem' }}>
          <img 
            src={preview} 
            alt="Vista previa" 
            style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }} 
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
