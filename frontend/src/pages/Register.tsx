import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [localError, setLocalError] = useState('');
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const passwordStrength = useMemo(() => {
    let score = 0;
    if (password.length >= 6) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (password !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (!acceptedTerms) {
      setLocalError('Debes aceptar los términos y la política de privacidad');
      return;
    }

    try {
      await register({ name, email, password });
      navigate('/');
    } catch {
      // error handled in store
    }
  };

  const displayError = localError || error;
  const strengthColor = passwordStrength === 3 ? 'bg-tertiary' : passwordStrength === 2 ? 'bg-secondary' : 'bg-error';

  return (
    <div className="auth-shell min-h-screen flex items-center justify-center px-4 py-6 sm:p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <span className="material-symbols-outlined filled text-on-primary text-[30px] sm:text-[32px]">task_alt</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">TaskFlow</h1>
          <p className="text-on-surface-variant mt-1">Organiza tu trabajo con claridad</p>
        </div>

        <div className="form-glass rounded-xl p-5 sm:p-6">
          {displayError && (
            <div className="bg-error-container text-on-error-container p-3 rounded-lg mb-4 text-sm flex items-center gap-2 animate-shake">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre completo"
              icon="person"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
            <Input
              label="Correo electrónico"
              type="email"
              icon="mail"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <div className="space-y-2">
              <Input
                label="Contraseña"
                type="password"
                icon="lock"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                minLength={6}
              />
              {password && (
                <div className="grid grid-cols-3 gap-1">
                  {[1, 2, 3].map((level) => (
                    <span
                      key={level}
                      className={cn(
                        'h-1.5 rounded-full bg-surface-container-high transition-colors',
                        passwordStrength >= level && strengthColor
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
            <Input
              label="Confirmar contraseña"
              type="password"
              icon="lock_reset"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <label className="flex items-start gap-2 text-sm text-on-surface-variant cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-outline-variant accent-primary"
              />
              <span>
                Acepto los <button type="button" className="text-primary font-medium">Términos</button> y la{' '}
                <button type="button" className="text-primary font-medium">Política de privacidad</button>
              </span>
            </label>
            <Button type="submit" className="w-full" size="lg" loading={isLoading}>
              Crear cuenta
              {!isLoading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
            </Button>
          </form>

          <p className="text-center text-sm text-on-surface-variant mt-6">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>

        <div className="mt-5 sm:mt-6 text-center">
          <p className="text-xs font-medium uppercase text-outline mb-3">Empresas que confían en nosotros</p>
          <div className="flex items-center justify-center gap-3 text-on-surface-variant">
            {['apartment', 'hub', 'workspace_premium'].map((icon) => (
              <span key={icon} className="material-symbols-outlined text-[22px]">{icon}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
