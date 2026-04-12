'use client';

export function FadeIn({
  delay = 0,
  className,
  children,
  as: Tag = 'div',
}: {
  delay?: number;
  className?: string;
  children: React.ReactNode;
  as?: 'div' | 'a' | 'button' | 'section' | 'li';
}) {
  return (
    <Tag
      className={`fade-in${className ? ` ${className}` : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
