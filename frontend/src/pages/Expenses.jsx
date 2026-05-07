import React, { useEffect, useState } from 'react';
import api from '../api';
import { Plus, Receipt, Calendar, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [formData, setFormData] = useState({ description: '', amount: '', expense_date: new Date().toISOString().split('T')[0] });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const res = await api.get('/expenses');
            setExpenses(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error('Error fetching expenses:', error);
            setExpenses([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/expenses', formData);
            setShowModal(false);
            setFormData({ description: '', amount: '', expense_date: new Date().toISOString().split('T')[0] });
            fetchExpenses();
        } catch (error) {
            alert('Gagal menyimpan pengeluaran');
        }
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/expenses/${deleteId}`);
            setShowConfirm(false);
            fetchExpenses();
        } catch (error) {
            alert('Gagal menghapus data');
        }
    };

    const totalPages = Math.ceil(expenses.length / itemsPerPage);
    const currentExpenses = expenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
                <button className="btn btn-primary" style={{ borderRadius: '1rem', padding: '0.75rem 1.5rem' }} onClick={() => setShowModal(true)}>
                    <Plus size={18} /> Tambah Pengeluaran
                </button>
            </div>

            <div className="card table-card" style={{ border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                <div className="table-header" style={{ background: 'white', borderBottom: '1px solid #f1f5f9' }}>
                    <h2 style={{ color: '#1e293b' }}>Catatan Pengeluaran Operasional RT</h2>
                </div>
                <div className="table-responsive">
                    <table style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc' }}>
                                <th style={{ padding: '1rem', borderRadius: '8px 0 0 8px' }}>TANGGAL</th>
                                <th>DESKRIPSI PENGELUARAN</th>
                                <th>NOMINAL</th>
                                <th style={{ textAlign: 'right', padding: '1rem', borderRadius: '0 8px 8px 0' }}>AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentExpenses.map(e => (
                                <tr key={e.id}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                                            <Calendar size={14} />
                                            {e.expense_date}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Receipt size={18} />
                                            </div>
                                            <span style={{ color: '#1e293b', fontWeight: '600' }}>{e.description}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ fontWeight: '700', color: '#dc2626' }}>Rp {Number(e.amount).toLocaleString()}</span>
                                    </td>
                                    <td style={{ textAlign: 'right', padding: '1rem' }}>
                                        <button className="btn-text danger" onClick={() => confirmDelete(e.id)} style={{ background: '#fff1f2', padding: '8px', borderRadius: '8px' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {expenses.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '3rem 1rem' }}>Belum ada data pengeluaran.</td>
                                </tr>
                            )}
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
                    <div className="modal-content" style={{ maxWidth: '450px', borderRadius: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Catat Pengeluaran Baru</h2>
                            <button className="btn-text" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Tanggal Pengeluaran</label>
                                <input type="date" className="form-control" required value={formData.expense_date} onChange={e => setFormData({...formData, expense_date: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Deskripsi / Keterangan</label>
                                <input type="text" className="form-control" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Misal: Gaji Satpam, Perbaikan Selokan..." />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Jumlah Nominal (Rp)</label>
                                <input type="number" className="form-control" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                            </div>
                            <div style={{ marginTop: '2.5rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', borderRadius: '1rem', background: '#dc2626', borderColor: '#dc2626' }}>Simpan Pengeluaran</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '350px', textAlign: 'center', borderRadius: '1.5rem' }}>
                        <div style={{ width: '60px', height: '60px', background: '#fff1f2', color: '#e11d48', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Trash2 size={30} />
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem' }}>Hapus Catatan?</h3>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '2rem' }}>Catatan pengeluaran akan dihapus permanen.</p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-outline" style={{ flex: 1, borderRadius: '0.75rem' }} onClick={() => setShowConfirm(false)}>Batal</button>
                            <button className="btn btn-primary" style={{ flex: 1, background: '#e11d48', borderColor: '#e11d48', borderRadius: '0.75rem' }} onClick={handleDelete}>Hapus</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Expenses;
