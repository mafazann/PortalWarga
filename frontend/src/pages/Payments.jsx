import React, { useEffect, useState } from 'react';
import api from '../api';
import { Plus, Search, Calendar, CreditCard, X, Info, ChevronLeft, ChevronRight } from 'lucide-react';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [houses, setHouses] = useState([]);
    const [residents, setResidents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isYearly, setIsYearly] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [formData, setFormData] = useState({
        house_id: '',
        resident_id: '',
        fee_type: 'Satpam',
        for_month: new Date().getMonth() + 1,
        for_year: new Date().getFullYear(),
        amount: 100000,
        status: 'Lunas',
        payment_date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchPayments();
        fetchHouses();
        fetchResidents();
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await api.get('/payments');
            if (res.data && Array.isArray(res.data)) {
                const sorted = [...res.data].sort((a, b) => b.id - a.id);
                setPayments(sorted);
            } else {
                setPayments([]);
            }
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
    };

    const fetchHouses = async () => {
        try {
            const res = await api.get('/houses');
            if (res.data && Array.isArray(res.data)) {
                setHouses(res.data.filter(h => h.status && h.status.toLowerCase() === 'dihuni'));
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
            if (isYearly) {
                // Logic for 12 months payment
                const requests = [];
                let currentMonth = parseInt(formData.for_month);
                let currentYear = parseInt(formData.for_year);

                for (let i = 0; i < 12; i++) {
                    requests.push(api.post('/payments', {
                        ...formData,
                        for_month: currentMonth,
                        for_year: currentYear,
                        fee_type: formData.fee_type.toLowerCase(),
                        status: formData.status.toLowerCase()
                    }));

                    currentMonth++;
                    if (currentMonth > 12) {
                        currentMonth = 1;
                        currentYear++;
                    }
                }
                await Promise.all(requests);
            } else {
                await api.post('/payments', {
                    ...formData,
                    fee_type: formData.fee_type.toLowerCase(),
                    status: formData.status.toLowerCase()
                });
            }
            setShowModal(false);
            setIsYearly(false);
            fetchPayments();
        } catch (error) {
            console.error(error.response?.data);
            alert('Gagal menyimpan pembayaran: ' + (error.response?.data?.message || 'Pastikan semua data benar'));
        }
    };

    const handleTypeChange = (e) => {
        const type = e.target.value;
        setFormData({
            ...formData,
            fee_type: type,
            amount: type === 'Satpam' ? 100000 : 15000
        });
    };

    const filteredPayments = payments.filter(p =>
        p.house?.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.resident?.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
    const currentPayments = filteredPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Cari rumah atau warga..."
                        className="form-control"
                        style={{ paddingLeft: '2.5rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={18} /> Input Pembayaran
                </button>
            </div>

            <div className="card table-card">
                <div className="table-header">
                    <h2>Riwayat Transaksi Iuran</h2>
                </div>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>TANGGAL</th>
                                <th>RUMAH</th>
                                <th>NAMA WARGA</th>
                                <th>JENIS</th>
                                <th>PERIODE</th>
                                <th>JUMLAH</th>
                                <th style={{ textAlign: 'right' }}>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPayments.map(p => (
                                <tr key={p.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            <Calendar size={14} />
                                            {p.payment_date || '-'}
                                        </div>
                                    </td>
                                    <td><span style={{ fontWeight: '800', color: 'var(--primary)' }}>{p.house?.address}</span></td>
                                    <td><span style={{ fontWeight: '700' }}>{p.resident?.full_name}</span></td>
                                    <td>
                                        <span style={{
                                            fontSize: '0.7rem',
                                            fontWeight: '800',
                                            textTransform: 'uppercase',
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            background: p.fee_type === 'satpam' ? '#f0f9ff' : '#f5f3ff',
                                            color: p.fee_type === 'satpam' ? '#0369a1' : '#7c3aed'
                                        }}>
                                            {p.fee_type}
                                        </span>
                                    </td>
                                    <td><span style={{ color: 'var(--text-muted)' }}>{p.for_month}/{p.for_year}</span></td>
                                    <td><span style={{ fontWeight: '800' }}>Rp {Number(p.amount).toLocaleString()}</span></td>
                                    <td style={{ textAlign: 'right' }}>
                                        <span className={`badge ${p.status === 'lunas' ? 'badge-success' : 'badge-danger'}`}>
                                            {p.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
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

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '550px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Input Iuran Baru</h2>
                            <button className="btn-text" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Pilih Unit Rumah</label>
                                    <select className="form-control" required value={formData.house_id} onChange={e => setFormData({ ...formData, house_id: e.target.value })}>
                                        <option value=""> Pilih Rumah Terdaftar </option>
                                        {houses.map(h => (
                                            <option key={h.id} value={h.id}>{h.address}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Nama Warga Pembayar</label>
                                    <select className="form-control" required value={formData.resident_id} onChange={e => setFormData({ ...formData, resident_id: e.target.value })}>
                                        <option value="">Pilih Warga</option>
                                        {residents.map(r => (
                                            <option key={r.id} value={r.id}>{r.full_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Jenis Iuran</label>
                                    <select className="form-control" value={formData.fee_type} onChange={handleTypeChange}>
                                        <option value="Satpam">Satpam (Rp 100.000)</option>
                                        <option value="Kebersihan">Kebersihan (Rp 15.000)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Jumlah (Rp)</label>
                                    <input type="number" className="form-control" required value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                                </div>
                            </div>

                            <div className="form-group" style={{ background: '#eff6ff', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem', color: 'var(--primary)' }}>
                                    <input type="checkbox" checked={isYearly} onChange={e => setIsYearly(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                                    Bayar  Untuk 1 Tahun (12 Bulan)
                                </label>
                                {isYearly && (
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Info size={14} />
                                        Sistem akan mencatat 12 transaksi untuk periode ke depan.
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Mulai Bulan</label>
                                    <select className="form-control" value={formData.for_month} onChange={e => setFormData({ ...formData, for_month: e.target.value })}>
                                        {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map((month, i) => (
                                            <option key={i + 1} value={i + 1}>{month}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Mulai Tahun</label>
                                    <input type="number" className="form-control" required value={formData.for_year} onChange={e => setFormData({ ...formData, for_year: e.target.value })} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Tanggal Transaksi</label>
                                <input type="date" className="form-control" required value={formData.payment_date} onChange={e => setFormData({ ...formData, payment_date: e.target.value })} />
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', height: '50px', fontSize: '1rem' }}>
                                <CreditCard size={20} /> {isYearly ? 'Simpan 12 Transaksi' : 'Simpan Transaksi'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payments;
