import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';

const BukuForm = ({ currentBuku, setRefresh, setCurrentBuku }) => {
  const [kodeBuku, setKodeBuku] = useState('');
  const [namaBuku, setNamaBuku] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [harga, setHarga] = useState('');

  // useEffect untuk mengisi form ketika sedang dalam mode edit
  useEffect(() => {
    if (currentBuku) {
      setKodeBuku(currentBuku.kodeBuku);
      setNamaBuku(currentBuku.namaBuku);
      setJumlah(currentBuku.jumlah);
      setHarga(currentBuku.harga);
    } else {
      // Reset form jika tidak dalam mode edit
      setKodeBuku('');
      setNamaBuku('');
      setJumlah('');
      setHarga('');
    }
  }, [currentBuku]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validasi nilai numerik agar tidak kosong atau bukan angka
    if (
      isNaN(parseInt(kodeBuku)) ||
      isNaN(parseInt(jumlah)) ||
      isNaN(parseInt(harga))
    ) {
      alert('Kode Buku, Jumlah, dan Harga harus berupa angka.');
      return;
    }

    const bukuData = {
      kodeBuku: parseInt(kodeBuku),
      namaBuku,
      jumlah: parseInt(jumlah),
      harga: parseInt(harga),
    };

    try {
      if (currentBuku) {
        // Mode Edit: Update dokumen di Firestore
        const bukuDocRef = doc(db, 'buku', currentBuku.id);
        await updateDoc(bukuDocRef, bukuData);
        alert('Data buku berhasil diperbarui!');
      } else {
        // Mode Tambah: Tambahkan dokumen baru ke koleksi 'buku'
        await addDoc(collection(db, 'buku'), bukuData);
        alert('Data buku berhasil ditambahkan!');
      }

      // Reset semua input form
      setKodeBuku('');
      setNamaBuku('');
      setJumlah('');
      setHarga('');
      
      // Trigger refresh data pada komponen induk
      setRefresh(prev => !prev);

      // Reset currentBuku agar keluar dari mode edit
      setCurrentBuku(null);
    } catch (error) {
      console.error("Error saving data: ", error);
      alert('Terjadi kesalahan saat menyimpan data.');
    }
  };

  return (
    <div style={formContainerStyle}>
      <h2>{currentBuku ? 'Edit Buku' : 'Tambah Buku Baru'}</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Kode Buku:</label>
          <input
            type="number"
            value={kodeBuku}
            onChange={(e) => setKodeBuku(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Nama Buku:</label>
          <input
            type="text"
            value={namaBuku}
            onChange={(e) => setNamaBuku(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Jumlah:</label>
          <input
            type="number"
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
            required
            min="1" 
            style={inputStyle}
          />
        </div>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Harga:</label>
          <input
            type="number"
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
            required
            min="0"
            style={inputStyle}
          />
        </div>

        {/* Tombol submit: teks berubah tergantung mode */}
        <button type="submit" style={buttonStyle}>
          {currentBuku ? 'Perbarui Buku' : 'Tambah Buku'}
        </button>

        {/* Tombol batal hanya muncul saat dalam mode edit */}
        {currentBuku && (
          <button
            type="button"
            onClick={() => setCurrentBuku(null)}
            style={{ ...buttonStyle, backgroundColor: '#6c757d' }}
          >
            Batal
          </button>
        )}
      </form>
    </div>
  );
};

// simpel styles untuk komponen BukuForm
const formContainerStyle = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  marginBottom: '20px',
  maxWidth: '500px',
  margin: '0 auto',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const inputGroupStyle = {
  marginBottom: '15px',
};

const labelStyle = {
  display: 'block',
  marginBottom: '5px',
  fontWeight: 'bold',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ced4da',
  borderRadius: '4px',
  boxSizing: 'border-box',
};

const buttonStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '10px 15px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  marginTop: '10px',
  marginRight: '10px',
};

export default BukuForm;