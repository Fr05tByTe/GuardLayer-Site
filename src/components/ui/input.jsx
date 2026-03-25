import { cn } from '../../lib/utils';

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-xl border border-border bg-bg/80 px-4 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-ring focus:ring-2 focus:ring-ring/30',
        className
      )}
      {...props}
    />
  );
}
