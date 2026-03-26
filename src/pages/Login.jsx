import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplet } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (
      (username.toLowerCase() === 'mayara' && password === 'giovanna') ||
      (username.toLowerCase() === 'alder' && password === 'alder123')
    ) {
      localStorage.setItem('glicotrack_auth', 'true');
      localStorage.setItem('glicotrack_user', username.charAt(0).toUpperCase() + username.slice(1));
      window.location.href = '/dashboard';
    } else {
      setError('Usuário ou senha incorretos.');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center', padding: '1rem', paddingTop: '10vh' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: 'var(--primary)', padding: '1rem', borderRadius: '1rem', marginBottom: '1rem' }}>
          <Droplet size={40} color="white" strokeWidth={2.5} />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
          Glico<span style={{ color: 'var(--primary)' }}>SIM</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '0.5rem', maxWidth: '350px', lineHeight: '1.5' }}>
          Controle sua glicemia todo dia de forma prática e rápida. SIMples assim!
        </p>
      </div>

      <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: '1rem', width: '100%', maxWidth: '420px', border: '1px solid var(--border-color)', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button style={{ flex: 1, backgroundColor: 'var(--bg-surface-elevated)', border: 'none', padding: '0.75rem', borderRadius: '8px', color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.875rem' }}>ENTRAR</button>
          <button style={{ flex: 1, backgroundColor: 'transparent', border: 'none', padding: '0.75rem', borderRadius: '8px', color: 'var(--text-secondary)', fontWeight: 'bold', fontSize: '0.875rem' }}>CRIAR CONTA</button>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Usuário</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Ex: mayara" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', height: '48px' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Senha</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Digite sua senha" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', height: '48px' }}
            />
          </div>

          {error && <div style={{ color: 'var(--danger)', fontSize: '0.875rem', textAlign: 'center', fontWeight: '500' }}>{error}</div>}

          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', fontWeight: '800', height: '54px', fontSize: '1rem', letterSpacing: '0.05em' }}>
            ACESSAR PAINEL
          </button>
        </form>
      </div>
      
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '3rem' }}>
        Leia nossos <span style={{ textDecoration: 'underline' }}>Termos de Uso</span> e <span style={{ textDecoration: 'underline' }}>Política de Privacidade</span> e <span style={{ textDecoration: 'underline' }}>LGPD</span>.
      </p>
    </div>
  );
};

export default Login;
