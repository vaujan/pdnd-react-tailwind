import React from 'react';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { type Card as CardType, getCardData } from './card-data';
import {
  attachClosestEdge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
// import DropIndicator from './drop-indicator';
import { SimpleDropIndicator } from './simple-drop-indicator';

interface CardProps {
  card: CardType;
}

export default function Card({ card }: CardProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isDropTarget, setIsDropTarget] = React.useState(false);
  const [closestEdge, setClosestEdge] = React.useState<string | null>(null);
  const { description, title } = card;
  const ref = React.useRef<HTMLDivElement | null>(null);

  // TODO: dropping indicator
  React.useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const cleanup = combine(
      draggable({
        element,
        getInitialData: () => getCardData(card),
        onDragStart() {
          setIsDragging(true);
        },
        onDrop() {
          setIsDragging(false);
        },
      }),

      dropTargetForElements({
        element,
        getData: ({ input, element }) => {
          const data = {
            type: 'card',
            id: card.id,
          };

          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['top', 'bottom'],
          });
        },
        getIsSticky: () => true,
        onDragEnter({ self }) {
          setIsDropTarget(true);
          // Extract the page for visual feedback
          const edge = extractClosestEdge(self.data);
          setClosestEdge(edge);
        },
        onDrag({ self }) {
          // Updating the closest edge while dragging
          const edge = extractClosestEdge(self.data);
          setClosestEdge(edge);
        },
        onDragLeave() {
          setIsDropTarget(false);
          setClosestEdge(null);
        },
        onDrop() {
          setIsDropTarget(false);
          setClosestEdge(null);
        },
      }),
    );

    return cleanup;
  }, [card.id]);

  return (
    <div className=" relative">
      {/* Here goes the top droptarget */}
      {isDropTarget && closestEdge === 'top' && <SimpleDropIndicator edge={closestEdge} />}
      <div
        ref={ref}
        className={`${isDragging ? 'bg-blue-200' : 'bg-white'} ${isDropTarget ? 'ring-2 ring-blue-500' : ''} flex-col flex p-2 rounded-md border-gray-400`}
      >
        <span>{title}</span>
        <p className=" text-gray-500">{description}</p>
      </div>

      {/* Here goes the bottom droptarget */}
      {isDropTarget && closestEdge === 'bottom' && <SimpleDropIndicator edge={closestEdge} />}
    </div>
  );
}
