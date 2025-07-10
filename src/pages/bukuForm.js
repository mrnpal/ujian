import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';

/**
 * Komponen BukuForm digunakan untuk menambah atau mengedit data buku.
 * Props:
 * - currentBuku: objek buku yang sedang diedit (jika ada)
 * - setRefresh: fungsi untuk me-refresh data di komponen induk
 * - setCurrentBuku: fungsi untuk mengatur buku yang sedang diedit
 */
const BukuForm = ({ currentBuku, setRefresh, setCurrentBuku }) => {
  const [kodeBuku, setKodeBuku] = useState('');
  const [namaBuku, setNamaBuku] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [harga, setHarga] = useState('');

  /**
   * useEffect ini akan mengisi form jika currentBuku ada (mode edit),
   * atau mengosongkan form jika currentBuku null (mode tambah).
   */
  useEffect(() => {
    if (currentBuku) {
      setKodeBuku(currentBuku.kodeBuku);
      setNamaBuku(currentBuku.namaBuku);
      setJumlah(currentBuku.jumlah);
      setHarga(currentBuku.harga);
    } else {
      setKodeBuku('');
      setNamaBuku('');
      setJumlah('');
      setHarga('');
    }
  }, [currentBuku]);

  /**
   * Fungsi handleSubmit akan menangani proses submit form.
   * Jika currentBuku ada, maka data buku akan diperbarui.
   * Jika tidak, maka data buku baru akan ditambahkan ke database.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const bukuData = { kodeBuku:parseInt(kodeBuku), namaBuku, jumlah: parseInt(jumlah), harga: parseInt(harga) };

    try {
      if (currentBuku) {
        // Update data buku yang sudah ada
        const bukuDocRef = doc(db, 'buku', currentBuku.id);
        await updateDoc(bukuDocRef, bukuData);
        alert('Data buku berhasil diperbarui!');
      } else {
        // Tambah data buku baru
        await addDoc(collection(db, 'buku'), bukuData);
        alert('Data buku berhasil ditambahkan!');
      }
      
      setKodeBuku('');
      setNamaBuku('');
      setJumlah('');
      setHarga('');
      setRefresh(prev => !prev); // Memicu refresh pada komponen induk
      setCurrentBuku(null); // Mengosongkan currentBuku setelah submit
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
            type="text" 
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
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>
          {currentBuku ? 'Perbarui Buku' : 'Tambah Buku'}
        </button>
        {currentBuku && (
          <button type="button" onClick={() => setCurrentBuku(null)} style={{ ...buttonStyle, backgroundColor: '#6c757d' }}>
            Batal
          </button>
        )}
      </form>
    </div>
  );
};

// Style inline sederhana untuk tampilan form
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