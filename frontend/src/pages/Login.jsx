import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Mail, Lock, LogIn, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/login', { email, password });
            localStorage.setItem('token', res.data.access_token);
            navigate('/');
        } catch (error) {
            setError('Email atau password salah. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)',
            padding: '20px'
        }}>
            <div className="card animate-fade-in" style={{ 
                maxWidth: '450px', 
                width: '100%', 
                padding: '3rem', 
                borderRadius: '24px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.5)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ 
                        width: '64px', 
                        height: '64px', 
                        background: 'var(--primary)', 
                        color: 'white', 
                        borderRadius: '20px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        margin: '0 auto 1.5rem',
                        boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)'
                    }}>
                        <ShieldCheck size={32} />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>Portal Warga</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Selamat datang kembali di sistem manajemen RT</p>
                </div>

                {error && (
                    <div style={{ 
                        padding: '1rem', 
                        background: '#fef2f2', 
                        color: '#dc2626', 
                        borderRadius: '12px', 
                        fontSize: '0.85rem', 
                        marginBottom: '1.5rem',
                        border: '1px solid #fecaca',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <Info size={16} /> {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>ALAMAT EMAIL</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input 
                                type="email" 
                                required 
                                className="form-control" 
                                style={{ paddingLeft: '3rem', height: '54px', borderRadius: '14px', fontSize: '1rem' }}
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                placeholder="nama@email.com" 
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>PASSWORD</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input 
                                type="password" 
                                required 
                                className="form-control" 
                                style={{ paddingLeft: '3rem', height: '54px', borderRadius: '14px', fontSize: '1rem' }}
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                placeholder="••••••••" 
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={loading}
                        style={{ 
                            width: '100%', 
                            height: '56px', 
                            borderRadius: '14px', 
                            fontSize: '1rem', 
                            fontWeight: '800',
                            boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem'
                        }}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (
                            <>
                                MASUK SEKARANG <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '2.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Lupa password? Hubungi Admin RT</p>
                </div>
            </div>
        </div>
    );
};

// Internal info icon fallback
const Info = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
);

export default Login;
