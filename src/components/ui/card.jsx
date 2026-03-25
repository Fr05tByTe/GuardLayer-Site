import { cn } from '../../lib/utils';

export function Card({ className, ...props }) {
  return <div className={cn('rounded-2xl border border-border bg-surface/80 backdrop-blur-sm', className)} {...props} />;
}
