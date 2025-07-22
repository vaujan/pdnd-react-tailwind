type Edge = 'top' | 'bottom';

interface SimpleDropIndicatorProps {
  edge: Edge;
}

export function SimpleDropIndicator({ edge }: SimpleDropIndicatorProps) {
  const isTop = edge === 'top';

  return (
    <div
      className={`
        absolute left-0 right-0 h-0.5 bg-blue-500 rounded-full z-10 
        flex items-center justify-between px-2
        ${isTop ? '-top-1.5' : '-bottom-1.5'}
      `}
    ></div>
  );
}
