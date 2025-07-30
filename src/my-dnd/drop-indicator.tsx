interface DropIndicatorProps {
  edge: 'top' | 'bottom';
}

export default function DropIndicator({ edge }: DropIndicatorProps) {
  return (
    <div
      className={`
        absolute left-0 right-0 h-1 bg-blue-500 rounded-full z-10
        ${edge === 'top' ? '-top-1.5' : '-bottom-1.5'}
      `}
    />
  );
}
