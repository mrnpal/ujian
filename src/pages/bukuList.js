// src/BukuList.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

const BukuList = ({ setRefresh, setCurrentBuku }) => {
  const [buku, setBuku] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'buku'), (snapshot) => {
      const bukuData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBuku(bukuData);
    }, (error) => {
      console.error("Error fetching data: ", error);
    });

    return () => unsub();
  }, [setRefresh]); // Re-run effect if setRefresh changes (though it shouldn't)

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
      try {
        await deleteDoc(doc(db, 'buku', id));
        alert('Buku berhasil dihapus!');
        setRefresh(prev => !prev); // Trigger refresh in parent
      } catch (error) {
        console.error("Error deleting document: ", error);
        alert('Terjadi kesalahan saat menghapus buku.');
      }
    }
  };

  const handleEdit = (bukuItem) => {
    setCurrentBuku(bukuItem);
  };

  return (
    <div style={listContainerStyle}>
      <h2>Daftar Buku</h2>
      {buku.length === 0 ? (
        <p>Tidak ada buku yang tersedia.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Kode Buku</th>
              <th style={thStyle}>Nama Buku</th>
              <th style={thStyle}>Jumlah</th>
              <th style={thStyle}>Harga</th>
              <th style={thStyle}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {buku.map((bukuItem) => (
              <tr key={bukuItem.id}>
                <td style={tdStyle}>{bukuItem.kodeBuku}</td>
                <td style={tdStyle}>{bukuItem.namaBuku}</td>
                <td style={tdStyle}>{bukuItem.jumlah}</td>
                <td style={tdStyle}>{bukuItem.harga}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleEdit(bukuItem)} style={{ ...actionButtonStyle, backgroundColor: '#ffc107' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(bukuItem.id)} style={{ ...actionButtonStyle, backgroundColor: '#dc3545' }}>
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Simple inline styles
const listContainerStyle = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  maxWidth: '800px',
  margin: '20px auto',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px',
};

const thStyle = {
  border: '1px solid #dee2e6',
  padding: '12px',
  textAlign: 'left',
  backgroundColor: '#e9ecef',
};

const tdStyle = {
  border: '1px solid #dee2e6',
  padding: '12px',
  textAlign: 'left',
};

const actionButtonStyle = {
  color: 'white',
  padding: '8px 12px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  marginRight: '5px',
};

export default BukuList;