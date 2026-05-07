import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Home, CreditCard, Receipt, LogOut, ChevronDown, User, Shield, X } from 'lucide-react';

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showProfileDetail, setShowProfileDetail] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/': return 'Dashboard Overview';
            case '/residents': return 'Manajemen Penghuni';
            case '/houses': return 'Data Rumah'
            case '/payments': return 'Keuangan - Iuran Warga';
            case '/expenses': return 'Keuangan - Pengeluaran';
            default: return 'Portal Warga';
        }
    };

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div style={{ background: '#2563eb', color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
                        <Home size={18} />
                    </div>
                    <span>PortalWarga</span>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
                    <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <LayoutDashboard size={18} />
                        Dashboard
                    </NavLink>
                    <NavLink to="/residents" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <Users size={18} />
                        Data Penghuni
                    </NavLink>
                    <NavLink to="/houses" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <Home size={18} />
                        Data Rumah
                    </NavLink>
                    <div style={{ margin: '1rem 0.5rem', borderBottom: '1px solid #f1f5f9' }}></div>
                    <NavLink to="/payments" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <CreditCard size={18} />
                        Pembayaran
                    </NavLink>
                    <NavLink to="/expenses" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <Receipt size={18} />
                        Pengeluaran
                    </NavLink>
                </nav>

            </aside>

            <main className="main-content">
                <div className="topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="breadcrumb">
                        <span className="breadcrumb-path">Admin / PortalWarga</span>
                        <h1 className="breadcrumb-title">{getPageTitle()}</h1>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <div
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '8px 12px', borderRadius: '12px', background: 'white', border: '1px solid #e2e8f0', transition: 'all 0.2s' }}
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                        >
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Shield size={20} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1e293b' }}>Pak RT</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Administrator</span>
                            </div>
                            <ChevronDown size={16} style={{ color: '#94a3b8', marginLeft: '4px' }} />
                        </div>

                        {showProfileMenu && (
                            <div style={{
                                position: 'absolute',
                                top: '110%',
                                right: '0',
                                background: 'white',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                width: '200px',
                                padding: '8px',
                                zIndex: 50
                            }}>
                                <button
                                    className="btn-text"
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', textAlign: 'left', color: '#1e293b', fontSize: '0.9rem' }}
                                    onClick={() => { setShowProfileMenu(false); setShowProfileDetail(true); }}
                                >
                                    <User size={16} /> Profil Detail
                                </button>
                                <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0' }}></div>
                                <button
                                    className="btn-text"
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', textAlign: 'left', color: '#ef4444', fontSize: '0.9rem' }}
                                    onClick={handleLogout}
                                >
                                    <LogOut size={16} /> Log Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="content-area">
                    <Outlet />
                </div>
            </main>

            {showProfileDetail && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px', padding: '0', overflow: 'hidden' }}>
                        <div style={{ background: 'var(--primary)', height: '100px', position: 'relative' }}>
                            <button className="btn-text" style={{ position: 'absolute', top: '15px', right: '15px', color: 'white' }} onClick={() => setShowProfileDetail(false)}><X size={24} /></button>
                        </div>
                        <div style={{ padding: '0 2rem 2rem 2rem', textAlign: 'center' }}>
                            <div style={{
                                position: 'relative',
                                zIndex: 10,
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'white',
                                border: '4px solid white',
                                margin: '-40px auto 1rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}>
                                <div style={{ width: '100%', height: '100%', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Shield size={36} />
                                </div>
                            </div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.25rem' }}>Bapak Ketua RT</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Administrator Sistem</p>

                            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', textAlign: 'left' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Email Admin</p>
                                    <p style={{ fontSize: '0.95rem', fontWeight: '600' }}>zan@mail.com</p>
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Peran</p>
                                    <p style={{ fontSize: '0.95rem', fontWeight: '600' }}>Ketua Rukun Tetangga</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Status Akses</p>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '800', padding: '4px 8px', background: '#dcfce7', color: '#16a34a', borderRadius: '6px' }}>FULL ACCESS</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Layout;
