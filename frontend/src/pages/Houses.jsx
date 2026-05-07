import React, { useEffect, useState } from 'react';
import api from '../api';
import { Plus, UserPlus, Home, X, Trash2, History, CreditCard, Calendar, User, ChevronRight, ChevronLeft } from 'lucide-react';

const Houses = () => {
    const [houses, setHouses] = useState([]);
    const [residents, setResidents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showResidentModal, setShowResidentModal] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [formData, setFormData] = useState({ address: '', status: 'Kosong' });
    const [residentData, setResidentData] = useState({ resident_id: '', start_date: new Date().toISOString().split('T')[0], end_date: '' });
    const [selectedHouse, setSelectedHouse] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        fetchHouses();
        fetchResidents();
    }, []);

    const fetchHouses = async () => {
        try {
            const res = await api.get('/houses');
            if (res.data && Array.isArray(res.data)) {
                const sorted = [...res.data].sort((a, b) => (a.address || '').localeCompare(b.address || '', undefined, {numeric: true}));
                setHouses(sorted);
            } else {
                setHouses([]);
            }
        } catch (error) {
            console.error('Error fetching houses:', error);
        }
    };

    const fetchResidents = async () => {
        try {
            const res = await api.get('/residents');
            setResidents(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error('Error fetching residents:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/houses', {
                ...formData,
                status: formData.status === 'Kosong' ? 'kosong' : 'dihuni'
            });
            setShowModal(false);
            setFormData({ address: '', status: 'Kosong' });
            fetchHouses();
        } catch (error) {
            alert('Gagal menambah rumah');
        }
    };

    const handleAddResident = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/houses/${selectedHouse.id}/residents`, residentData);
            setShowResidentModal(false);
            setResidentData({ resident_id: '', start_date: new Date().toISOString().split('T')[0], end_date: '' });
            fetchHouses();
        } catch (error) {
            alert('Gagal mengupdate penghuni');
        }
    };

    const handleViewDetail = async (house) => {
        try {
            const res = await api.get(`/houses/${house.id}`);
            setSelectedHouse(res.data);
            setShowDetail(true);
        } catch (error) {
            alert('Gagal mengambil detail rumah');
        }
    };

    const handleDeleteHouse = async () => {
        try {
            await api.delete(`/houses/${deleteId}`);
            setShowConfirm(false);
            fetchHouses();
        } catch (error) {
            alert('Gagal menghapus rumah.');
        }
    };

    const totalPages = Math.ceil(houses.length / itemsPerPage);
    const currentHouses = houses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Manajemen Unit Rumah</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Kelola penghuni dan status hunian komplek</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={18} /> Tambah Unit Baru
                </button>
            </div>

            <div className="grid grid-cols-4" style={{ gap: '2rem' }}>
                {currentHouses.map(h => {
                    const histories = h.house_histories || [];
                    const activeHistories = histories.filter(history => !history.end_date);
                    // Use the most recently added active history
                    const currentHistory = activeHistories.length > 0 ? activeHistories[activeHistories.length - 1] : null;
                    const currentResident = currentHistory ? currentHistory.resident : null;
                    const isOccupied = h.status === 'dihuni';

                    return (
                        <div key={h.id} className="card house-card" style={{ padding: '0', overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-md)', transition: 'all 0.3s ease' }}>
                            <div style={{ 
                                padding: '1.5rem', 
                                background: isOccupied ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : '#ffffff', 
                                color: isOccupied ? 'white' : 'var(--text-main)',
                                borderBottom: isOccupied ? 'none' : '1px solid var(--border)',
                                position: 'relative'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ background: isOccupied ? 'rgba(255,255,255,0.2)' : 'var(--primary-light)', padding: '10px', borderRadius: '12px', color: isOccupied ? 'white' : 'var(--primary)' }}>
                                        <Home size={24} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                                        <button className="btn-text" style={{ color: isOccupied ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)', padding: '5px' }} onClick={(e) => { e.stopPropagation(); setDeleteId(h.id); setShowConfirm(true); }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div style={{ marginTop: '1.5rem' }}>
                                    <h3 style={{ fontWeight: '800', fontSize: '1.25rem', marginBottom: '0.25rem' }}>{h.address}</h3>
                                    <span style={{ fontSize: '0.65rem', fontWeight: '800', padding: '2px 8px', borderRadius: '20px', background: isOccupied ? 'rgba(255,255,255,0.2)' : '#f1f5f9', letterSpacing: '0.5px' }}>
                                        {isOccupied ? 'TERISI' : 'KOSONG'}
                                    </span>
                                </div>
                            </div>
                            
                            <div style={{ padding: '1.5rem', background: 'white' }}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <p style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>PENGHUNI AKTIF</p>
                                    {currentResident ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '32px', height: '32px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '800' }}>
                                                {currentResident.full_name.charAt(0)}
                                            </div>
                                            <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1e293b' }}>{currentResident.full_name}</span>
                                        </div>
                                    ) : (
                                        <div style={{ fontSize: '0.85rem', color: '#cbd5e1', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <X size={14} /> Belum Berpenghuni
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button className="btn btn-outline" style={{ flex: 1, fontSize: '0.75rem', padding: '0.5rem', height: 'auto', borderRadius: '10px' }} onClick={(e) => { e.stopPropagation(); setSelectedHouse(h); setShowResidentModal(true); }}>
                                        <UserPlus size={14} /> Update
                                    </button>
                                    <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.75rem', padding: '0.5rem', height: 'auto', borderRadius: '10px' }} onClick={() => handleViewDetail(h)}>
                                        Detail <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2.5rem' }}>
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

            {/* Modals follow... */}
            {showDetail && selectedHouse && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '800px', padding: '0', overflow: 'hidden' }}>
                        <div style={{ background: 'var(--primary)', padding: '2rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Detail {selectedHouse.address}</h2>
                                <p style={{ opacity: 0.8, textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>Status: {selectedHouse.status}</p>
                            </div>
                            <button className="btn-text" style={{ color: 'white' }} onClick={() => setShowDetail(false)}><X size={24} /></button>
                        </div>
                        <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxHeight: '70vh', overflowY: 'auto' }}>
                            {/* History Section */}
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>
                                    <History size={20} color="var(--primary)" />
                                    <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>Riwayat Penghuni</h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {selectedHouse.house_histories?.length > 0 ? selectedHouse.house_histories.map((hist, idx) => (
                                        <div key={idx} style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                                <User size={16} color="var(--text-muted)" />
                                                <span style={{ fontWeight: '700' }}>{hist.resident?.full_name}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                <Calendar size={14} />
                                                <span>{hist.start_date} s/d {hist.end_date || 'Sekarang'}</span>
                                            </div>
                                        </div>
                                    )) : (
                                        <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>Belum ada riwayat penghuni.</p>
                                    )}
                                </div>
                            </div>

                            {/* Payments Section */}
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>
                                    <CreditCard size={20} color="var(--primary)" />
                                    <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>Riwayat Pembayaran</h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {selectedHouse.payments?.length > 0 ? selectedHouse.payments.map((p, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'white', borderRadius: '10px', border: '1px solid var(--border)' }}>
                                            <div>
                                                <p style={{ fontWeight: '700', fontSize: '0.85rem' }}>{p.fee_type.toUpperCase()}</p>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bulan {p.for_month}/{p.for_year}</p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ fontWeight: '800', fontSize: '0.85rem', color: 'var(--primary)' }}>Rp {Number(p.amount).toLocaleString()}</p>
                                                <span style={{ fontSize: '0.65rem', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', background: p.status === 'lunas' ? '#dcfce7' : '#fee2e2', color: p.status === 'lunas' ? '#16a34a' : '#dc2626' }}>{p.status.toUpperCase()}</span>
                                            </div>
                                        </div>
                                    )) : (
                                        <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>Belum ada riwayat pembayaran.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Tambah Unit Rumah</h2>
                            <button className="btn-text" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Nomor Rumah</label>
                                <input type="text" className="form-control" placeholder="Contoh: Rumah21" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status Awal</label>
                                <select className="form-control" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                    <option value="Kosong">Kosong</option>
                                    <option value="Dihuni">Dihuni</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', height: '45px' }}>Simpan Unit</button>
                        </form>
                    </div>
                </div>
            )}

            {showResidentModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '450px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Update Penghuni - {selectedHouse?.address}</h2>
                            <button className="btn-text" onClick={() => setShowResidentModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAddResident}>
                            <div className="form-group">
                                <label className="form-label">Pilih Warga</label>
                                <select className="form-control" required value={residentData.resident_id} onChange={e => setResidentData({...residentData, resident_id: e.target.value})}>
                                    <option value="">Pilih Warga</option>
                                    {residents.map(r => (
                                        <option key={r.id} value={r.id}>{r.full_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Tanggal Mulai</label>
                                <input type="date" className="form-control" required value={residentData.start_date} onChange={e => setResidentData({...residentData, start_date: e.target.value})} />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', height: '45px' }}>Simpan Penghuni</button>
                        </form>
                    </div>
                </div>
            )}

            {showConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '350px', textAlign: 'center' }}>
                        <h3 style={{ marginBottom: '0.5rem' }}>Hapus Rumah?</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>Unit rumah ini akan dihapus dari sistem.</p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowConfirm(false)}>Batal</button>
                            <button className="btn btn-primary" style={{ flex: 1, background: '#ef4444' }} onClick={handleDeleteHouse}>Hapus</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Houses;
