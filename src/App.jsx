import React, { useState } from 'react';
import SignatureForm from './components/SignatureForm';
import SignaturePreview from './components/SignaturePreview';

function App() {
  const [data, setData] = useState({
    fullName: 'John Doe',
    title: 'Sales Representative',
    email: 'john.doe@medleadconvert.com',
    phone: '555-0123',
    website: 'www.medleadconvert.com',
    address: '123 Medical Plaza, Suite 100',
    logo: 'primary', // 'primary', 'secondary', or 'none'
    headshotUrl: '',
    headshotType: 'upload', // 'upload' or 'logo'
    showHeadshot: true,
    headshotContainerSize: 130, // Fixed circle/container size
    headshotImageScale: 100, // Scale of the image inside (%)
    headshotShape: 'circle', // 'circle', 'rounded', 'square'
    headshotX: 50,
    headshotY: 50
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (url) => {
    setData(prev => ({ ...prev, headshotUrl: url }));
  };

  return (
    <div className="container">
      <h1>MedLead Signature Generator</h1>
      <div className="grid-2">
        <div className="card">
          <SignatureForm
            data={data}
            onChange={handleChange}
            onImageUpload={handleImageUpload}
          />
        </div>
        <div className="card" style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
          <SignaturePreview data={data} />
        </div>
      </div>
    </div>
  );
}

export default App;
