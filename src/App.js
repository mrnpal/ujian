import React, { useState } from 'react';
import BukuForm from './pages/bukuForm';
import BukuList from './pages/bukuList';
import './App.css';

function App() {
  const [refresh, setRefresh] = useState(false);
  // State untuk buku yang diedit
  const [currentBuku, setCurrentBuku] = useState(null); 

  return (
    <div className="App" style={appStyle}>
      <h1 style={headerStyle}>Aplikasi Kasir Buku</h1>
      <BukuForm setRefresh={setRefresh} currentBuku={currentBuku} setCurrentBuku={setCurrentBuku} />
      <BukuList setRefresh={setRefresh} setCurrentBuku={setCurrentBuku} />
    </div>
  );
}

const appStyle = {
  fontFamily: 'Arial, sans-serif',
  textAlign: 'center',
  padding: '20px',
  backgroundColor: '#f0f2f5',
  minHeight: '100vh',
};

const headerStyle = {
  color: '#333',
  marginBottom: '30px',
};

export default App;