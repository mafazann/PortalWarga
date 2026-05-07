import React, { useEffect, useState } from 'react';
import api from '../api';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { Wallet, TrendingUp, TrendingDown, Calendar, FileText, ChevronRight, X, ArrowUpRight } from 'lucide-react';

const Dashboard = () => {
    const [summaryData, setSummaryData] = useState(null);
    const [year, setYear] = useState(new Date().getFullYear());
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [detailData, setDetailData] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

    useEffect(() => {
        fetchSummary();
    }, [year]);

    const fetchSummary = async () => {
        try {
            const res = await api.get(`/reports/summary?year=${year}`);
            setSummaryData(res.data);
        } catch (error) {
            console.error('Error fetching summary:', error);
        }
    };

    const fetchMonthlyDetail = async (month) => {
        try {
            setSelectedMonth(month);
            const res = await api.get(`/reports/details?year=${year}&month=${month}`);
            setDetailData(res.data);
            setShowDetailModal(true);
        } catch (error) {
            alert('Gagal mengambil detail bulanan');
        }
    };

    if (!summaryData) return <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}><div className="loader"></div></div>;

    const chartData = (summaryData?.summary || []).map(item => ({
        name: new Date(year, item.month - 1).toLocaleString('default', { month: 'short' }),
        Pemasukan: item.income,
        Pengeluaran: item.expense,
        month: item.month
    }));

    const totalIncome = (summaryData?.summary || []).reduce((acc, curr) => acc + Number(curr.income || 0), 0);
    const totalExpense = (summaryData?.summary || []).reduce((acc, curr) => acc + Number(curr.expense || 0), 0);

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Dashboard Finansial {year}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Rekapitulasi tahunan iuran warga & pengeluaran RT</p>
                </div>
                <select className="form-control" style={{ width: '150px' }} value={year} onChange={e => setYear(e.target.value)}>
                    {[2023, 2024, 2025, 2026, 2027].map(y => (
                        <option key={y} value={y}>Tahun {y}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-3" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: 'white', border: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: '700', textTransform: 'uppercase' }}>Saldo Sisa Kas</p>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginTop: '0.25rem' }}>Rp {(summaryData?.current_total_balance || 0).toLocaleString()}</h3>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '12px' }}>
                            <Wallet size={24} />
                        </div>
                    </div>
                    <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                        <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '20px' }}>Aktif</span>
                        <span>Total akumulasi tahun ini</span>
                    </div>
                </div>
                
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Total Pemasukan</p>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginTop: '0.25rem', color: 'var(--success)' }}>Rp {totalIncome.toLocaleString()}</h3>
                        </div>
                        <div style={{ background: '#ecfdf5', color: 'var(--success)', padding: '10px', borderRadius: '12px' }}>
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Dari iuran satpam & kebersihan</p>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Total Pengeluaran</p>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginTop: '0.25rem', color: 'var(--danger)' }}>Rp {totalExpense.toLocaleString()}</h3>
                        </div>
                        <div style={{ background: '#fef2f2', color: 'var(--danger)', padding: '10px', borderRadius: '12px' }}>
                            <TrendingDown size={24} />
                        </div>
                    </div>
                    <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Operasional & perbaikan komplek</p>
                </div>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h4 style={{ fontWeight: '800' }}>Statistik Bulanan</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Klik batang grafik untuk detail</span>
                    </div>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `${v/1000}k`} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }} />
                                <Bar dataKey="Pemasukan" fill="var(--primary)" radius={[4, 4, 0, 0]} onClick={(data) => fetchMonthlyDetail(data.month)} style={{ cursor: 'pointer' }} />
                                <Bar dataKey="Pengeluaran" fill="#94a3b8" radius={[4, 4, 0, 0]} onClick={(data) => fetchMonthlyDetail(data.month)} style={{ cursor: 'pointer' }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ fontWeight: '800' }}>Tren Pemasukan Iuran</h4>
                    </div>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `${v/1000}k`} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }} />
                                <Area type="monotone" dataKey="Pemasukan" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Modal Detail Bulanan */}
            {showDetailModal && detailData && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '900px', padding: '0', overflow: 'hidden' }}>
                        <div style={{ background: 'var(--bg-main)', padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Laporan Detail: {new Date(year, selectedMonth - 1).toLocaleString('default', { month: 'long' })} {year}</h3>
                            </div>
                            <button className="btn-text" onClick={() => setShowDetailModal(false)}><X size={24} /></button>
                        </div>
                        <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxHeight: '70vh', overflowY: 'auto' }}>
                            {/* Pemasukan Section */}
                            <div>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--success)' }}>
                                    <TrendingUp size={18} /> Pemasukan (Iuran)
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {detailData.incomes?.length > 0 ? detailData.incomes.map((p, idx) => (
                                        <div key={idx} style={{ padding: '0.75rem 1rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                            <div>
                                                <p style={{ fontWeight: '700', fontSize: '0.85rem' }}>{p.resident?.full_name} ({p.house?.address})</p>
                                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Iuran {p.fee_type}</p>
                                            </div>
                                            <p style={{ fontWeight: '800', fontSize: '0.85rem' }}>Rp {Number(p.amount).toLocaleString()}</p>
                                        </div>
                                    )) : <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tidak ada pemasukan bulan ini.</p>}
                                </div>
                            </div>
                            {/* Pengeluaran Section */}
                            <div>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--danger)' }}>
                                    <TrendingDown size={18} /> Pengeluaran
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {detailData.expenses?.length > 0 ? detailData.expenses.map((e, idx) => (
                                        <div key={idx} style={{ padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                            <div>
                                                <p style={{ fontWeight: '700', fontSize: '0.85rem' }}>{e.description}</p>
                                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{e.expense_date}</p>
                                            </div>
                                            <p style={{ fontWeight: '800', fontSize: '0.85rem' }}>Rp {Number(e.amount).toLocaleString()}</p>
                                        </div>
                                    )) : <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tidak ada pengeluaran bulan ini.</p>}
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '1.5rem 2rem', background: '#f8fafc', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn btn-primary" onClick={() => setShowDetailModal(false)}>Tutup Laporan</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
