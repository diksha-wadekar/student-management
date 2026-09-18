import { colorFor, initialsFor } from '../utils/avatar';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'lg';
}

export default function Avatar({ name, size = 'sm' }: AvatarProps) {
  const { bg, fg } = colorFor(name);
  return (
    <span
      className={`avatar avatar-${size}`}
      style={{ background: bg, color: fg }}
      aria-hidden="true"
    >
      {initialsFor(name)}
    </span>
  );
}
