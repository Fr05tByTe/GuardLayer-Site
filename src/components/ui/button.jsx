import { cn } from '../../lib/utils';

const variants = {
  primary: 'bg-primary text-white border-primary/70 shadow-glow hover:brightness-110',
  secondary: 'bg-elevated text-text-primary border-border hover:border-secondary/60 hover:text-secondary',
  ghost: 'bg-transparent text-text-secondary border-transparent hover:border-border hover:text-text-primary'
};

const sizes = {
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base'
};

export function Button({ className, variant = 'primary', size = 'md', ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl border font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
