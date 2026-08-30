import { Search } from 'lucide-react';

export function SearchInput({
  value,
  onChange,
  placeholder,
  testId,
  className = '',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  testId?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        size={15}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        data-testid={testId}
        className="h-9 w-full rounded-md border border-input bg-card px-3 pl-9 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}
