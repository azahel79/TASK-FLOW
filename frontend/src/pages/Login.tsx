import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/');
    } catch {
      // error handled in store
    }
  };

  return (
    <div className="auth-shell min-h-screen flex items-center justify-center px-4 py-6 sm:p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <span className="material-symbols-outlined filled text-on-primary text-[30px] sm:text-[32px]">task_alt</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Bienvenido</h1>
          <p className="text-on-surface-variant mt-1">Inicia sesión en TaskFlow</p>
        </div>

        <div className="form-glass rounded-xl p-5 sm:p-6">
          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded-lg mb-4 text-sm flex items-center gap-2 animate-shake">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Correo electrónico"
              type="email"
              icon="mail"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError(); }}
              autoComplete="email"
              required
            />
            <Input
              label="Contraseña"
              type="password"
              icon="lock"
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearError(); }}
              autoComplete="current-password"
              required
            />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-on-surface-variant cursor-pointer">
                <input type="checkbox" className="h-4 w-4 rounded border-outline-variant accent-primary" />
                Recordarme
              </label>
              <button type="button" className="text-sm font-medium text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <Button type="submit" className="w-full" size="lg" loading={isLoading}>
              Iniciar sesión
              {!isLoading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
            </Button>
          </form>

          <p className="text-center text-sm text-on-surface-variant mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
