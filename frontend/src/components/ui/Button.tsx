import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, icon, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer';

    const variants = {
      primary: 'bg-primary text-on-primary hover:bg-on-primary-fixed-variant shadow-sm hover:shadow',
      secondary:
        'bg-surface-container text-on-surface-variant hover:bg-surface-container-high border border-outline-variant',
      ghost: 'text-on-surface-variant hover:bg-surface-container-high',
      danger: 'bg-error text-on-error hover:opacity-90 shadow-sm',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
        ) : icon ? (
          <span className="text-[18px]">{icon}</span>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
