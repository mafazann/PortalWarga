import React, { useEffect, useState, useRef } from 'react';
import api from '../api';
import { Plus, Edit2, Trash2, Search, X, Check, Eye, Phone, Heart, Shield, Upload, FileText, Square, CheckSquare, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const Residents = () => {
    const [residents, setResidents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [selectedResident, setSelectedResident] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const [isBulkDelete, setIsBulkDelete] = useState(false);
    const [formData, setFormData] = useState({ full_name: '', status: 'Tetap', phone_number: '', is_married: false });
    const [ktpPhoto, setKtpPhoto] = useState(null);
    const [editId, setEditId] = useState(null);
    const [imgError, setImgError] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchResidents();
    }, []);

    const fetchResidents = async () => {
        try {
            const res = await api.get('/residents');
            if (res.data && Array.isArray(res.data)) {
                const sorted = [...res.data].sort((a, b) => b.id - a.id);
                setResidents(sorted);
            } else {
                setResidents([]);
            }
            setSelectedIds([]);
        } catch (error) {
            console.error('Error fetching residents:', error);
            setResidents([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('full_name', formData.full_name);
            data.append('status', formData.status.toLowerCase());
            data.append('phone_number', formData.phone_number);
            data.append('is_married', formData.is_married ? '1' : '0');

            if (ktpPhoto) {
                data.append('ktp_photo', ktpPhoto);
            }

            if (editId) {
                data.append('_method', 'PUT');
                await api.post(`/residents/${editId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/residents', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            setShowModal(false);
            resetForm();
            fetchResidents();
        } catch (error) {
            alert('Gagal menyimpan data.');
        }
    };

    const resetForm = () => {
        setFormData({ full_name: '', status: 'Tetap', phone_number: '', is_married: false });
        setKtpPhoto(null);
        setEditId(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleEdit = (resident) => {
        setFormData({
            full_name: resident.full_name || '',
            status: resident.status ? (resident.status.charAt(0).toUpperCase() + resident.status.slice(1).toLowerCase()) : 'Tetap',
            phone_number: resident.phone_number || '',
            is_married: resident.is_married == 1 || resident.is_married === true
        });
        setEditId(resident.id);
        setKtpPhoto(null);
        setShowModal(true);
    };

    const handleViewDetail = (resident) => {
        setSelectedResident(resident);
        setImgError(false);
        setShowDetail(true);
    };

    const handleDelete = async () => {
        try {
            if (isBulkDelete) {
                await Promise.all(selectedIds.map(id => api.delete(`/residents/${id}`)));
            } else {
                await api.delete(`/residents/${deleteId}`);
            }
            setShowConfirm(false);
            fetchResidents();
        } catch (error) {
            alert('Gagal menghapus data.');
        }
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        // Hardcoded backend URL to avoid potential undefined issues with api.defaults
        const baseUrl = 'http://localhost:8000';
        return `${baseUrl}${path}`;
    };

    const filteredResidents = residents.filter(r =>
        (r.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.phone_number || '').includes(searchTerm)
    );

    const totalPages = Math.ceil(filteredResidents.length / itemsPerPage);
    const currentResidents = filteredResidents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Reset to page 1 if search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleSelectOne = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleSelectAll = () => {
        if (selectedIds.length === filteredResidents.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredResidents.map(r => r.id));
        }
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Cari nama atau telepon..."
                        className="form-control"
                        style={{ paddingLeft: '2.5rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {selectedIds.length > 0 && (
                        <button className="btn btn-outline" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => { setIsBulkDelete(true); setShowConfirm(true); }}>
                            <Trash2 size={18} /> Hapus Terpilih ({selectedIds.length})
                        </button>
                    )}
                    <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
                        <Plus size={18} /> Tambah Penghuni
                    </button>
                </div>
            </div>

            <div className="card table-card">
                <div className="table-header">
                    <h2>Daftar Penghuni Komplek</h2>
                </div>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr style={{ background: '#f8fafc' }}>
                                <th style={{ width: '40px' }}>
                                    <button className="btn-text" onClick={handleSelectAll}>
                                        {selectedIds.length === filteredResidents.length && filteredResidents.length > 0 ? <CheckSquare size={20} color="var(--primary)" /> : <Square size={20} />}
                                    </button>
                                </th>
                                <th>PENGHUNI</th>
                                <th>STATUS</th>
                                <th>RUMAH SAAT INI</th>
                                <th>STATUS NIKAH</th>
                                <th>KTP</th>
                                <th>NO. TELEPON</th>
                                <th style={{ textAlign: 'right' }}>AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentResidents.map(r => {
                                const currentHouseHistory = r.house_histories && r.house_histories.length > 0 ? r.house_histories[0] : null;
                                const houseAddress = currentHouseHistory && currentHouseHistory.house ? currentHouseHistory.house.address : 'Belum Ada';
                                
                                return (
                                <tr key={r.id} style={{ background: selectedIds.includes(r.id) ? '#f0f7ff' : 'white' }}>
                                    <td>
                                        <button className="btn-text" onClick={() => handleSelectOne(r.id)}>
                                            {selectedIds.includes(r.id) ? <CheckSquare size={20} color="var(--primary)" /> : <Square size={20} />}
                                        </button>
                                    </td>
                                    <td>
                                        <div className="td-flex">
                                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                                                {(r.full_name || '?').charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '700' }}>{r.full_name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${r.status === 'tetap' ? 'badge-primary' : 'badge-secondary'}`}>
                                            {(r.status || 'Tetap').charAt(0).toUpperCase() + (r.status || 'tetap').slice(1).toLowerCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: houseAddress === 'Belum Ada' ? 'var(--text-muted)' : '#1e293b' }}>
                                            {houseAddress}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: r.is_married == 1 ? 'var(--primary)' : 'var(--text-muted)' }}>
                                            {r.is_married == 1 ? 'Sudah' : 'Belum'}
                                        </span>
                                    </td>
                                    <td>
                                        {r.ktp_photo ? (
                                            <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: '700' }}>
                                                <Check size={14} /> Tersedia
                                            </span>
                                        ) : (
                                            <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700' }}>Belum ada</span>
                                        )}
                                    </td>
                                    <td>{r.phone_number}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button className="btn-text" onClick={() => handleViewDetail(r)} title="Lihat Detail"><Eye size={16} /></button>
                                            <button className="btn-text" onClick={() => handleEdit(r)} title="Edit"><Edit2 size={16} /></button>
                                            <button className="btn-text danger" onClick={() => { setDeleteId(r.id); setIsBulkDelete(false); setShowConfirm(true); }} title="Hapus"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                    <button 
                        className="btn btn-outline" 
                        style={{ padding: '0.5rem', borderRadius: '8px' }}
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                        Halaman {currentPage} dari {totalPages}
                    </span>
                    <button 
                        className="btn btn-outline" 
                        style={{ padding: '0.5rem', borderRadius: '8px' }}
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}

            {/* Modal Detail */}
            {showDetail && selectedResident && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '600px', padding: '0', overflow: 'hidden' }}>
                        <div style={{ background: 'var(--primary)', padding: '2.5rem 2rem', color: 'white', position: 'relative' }}>
                            <button className="btn-text" style={{ color: 'white', position: 'absolute', top: '1.5rem', right: '1.5rem' }} onClick={() => setShowDetail(false)}>
                                <X size={24} />
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '800' }}>
                                    {(selectedResident.full_name || '?').charAt(0)}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{selectedResident.full_name}</h2>
                                    <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Warga {selectedResident.status ? (selectedResident.status.charAt(0).toUpperCase() + selectedResident.status.slice(1).toLowerCase()) : 'Tetap'}</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '2rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Informasi Kontak</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '700' }}>
                                            <Phone size={16} color="var(--primary)" /> {selectedResident.phone_number}
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Status Pernikahan</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '700' }}>
                                            <Heart size={16} color="var(--primary)" /> {selectedResident.is_married == 1 ? 'Sudah Menikah' : 'Belum Menikah'}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ minHeight: '150px' }}>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Dokumen KTP</p>
                                    {selectedResident.ktp_photo && !imgError ? (
                                        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', background: '#f8fafc', minHeight: '100px' }}>
                                            <img
                                                src={getImageUrl(selectedResident.ktp_photo)}
                                                alt="KTP"
                                                style={{ width: '100%', display: 'block', cursor: 'zoom-in' }}
                                                onClick={() => window.open(getImageUrl(selectedResident.ktp_photo), '_blank')}
                                                onError={() => setImgError(true)}
                                            />
                                        </div>
                                    ) : (
                                        <div style={{ padding: '1.5rem', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px dashed var(--border)', color: '#94a3b8' }}>
                                            <ImageIcon size={32} style={{ margin: '0 auto 0.5rem' }} />
                                            <p style={{ fontSize: '0.8rem' }}>{imgError ? 'Gagal memuat gambar' : 'Foto KTP belum tersedia'}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', height: '50px' }} onClick={() => setShowDetail(false)}>
                                Selesai
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Add/Edit */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{editId ? 'Edit Data Penghuni' : 'Tambah Penghuni'}</h2>
                            <button className="btn-text" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Nama Lengkap</label>
                                <input type="text" className="form-control" required value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status Penghuni</label>
                                <select className="form-control" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                    <option value="Tetap">Tetap</option>
                                    <option value="Kontrak">Kontrak</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Nomor Telepon</label>
                                <input type="text" className="form-control" required value={formData.phone_number} onChange={e => setFormData({ ...formData, phone_number: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status Pernikahan</label>
                                <select className="form-control" value={formData.is_married} onChange={e => setFormData({ ...formData, is_married: e.target.value === 'true' })}>
                                    <option value="false">Belum Menikah</option>
                                    <option value="true">Sudah Menikah</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Foto KTP (Opsional)</label>
                                <div className="upload-area" style={{
                                    border: '2px dashed var(--border)',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    background: '#f8fafc',
                                    transition: 'all 0.2s'
                                }} onClick={() => fileInputRef.current?.click()}>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        onChange={(e) => setKtpPhoto(e.target.files[0])}
                                        accept="image/*"
                                    />
                                    {ktpPhoto ? (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: '700' }}>
                                            <Check size={20} />
                                            <span>{ktpPhoto.name}</span>
                                        </div>
                                    ) : (
                                        <div style={{ color: 'var(--text-muted)' }}>
                                            <Upload size={24} style={{ margin: '0 auto 0.5rem' }} />
                                            <p style={{ fontSize: '0.85rem' }}>Klik untuk ganti/unggah KTP</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', height: '50px' }}>
                                {editId ? 'Simpan Perubahan' : 'Tambah Penghuni'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Modal */}
            {showConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <div style={{ width: '60px', height: '60px', background: '#fee2e2', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Trash2 size={30} />
                        </div>
                        <h3 style={{ marginBottom: '0.5rem' }}>{isBulkDelete ? 'Hapus Terpilih?' : 'Hapus Data?'}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>{isBulkDelete ? `Anda akan menghapus ${selectedIds.length} data warga sekaligus.` : 'Data warga akan dihapus secara permanen.'}</p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowConfirm(false)}>Batal</button>
                            <button className="btn btn-primary" style={{ flex: 1, background: '#ef4444' }} onClick={handleDelete}>Hapus</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Residents;
