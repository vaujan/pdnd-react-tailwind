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

interface CardProps {
  card: CardType;
}

export default function Card({ card }: CardProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isDropTarget, setIsDropTarget] = React.useState(false);
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
        onDragEnter() {
          setIsDropTarget(true);
        },
        onDragLeave() {
          setIsDropTarget(false);
        },
        onDrop() {
          setIsDropTarget(false);
        },
      }),
    );

    return cleanup;
  }, []);

  if (isDropTarget) {
    return (
      <div className="relative">
        <div
          ref={ref}
          className={`bg-gray-400/50 text-gray-400/50 flex-col mb-2 flex p-2 rounded-md border-gray-400`}
        >
          <span className="invisible">{title}</span>
          <p className="invisible">{description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={ref}
        className={`${isDragging ? 'bg-blue-200' : 'bg-white'} flex-col mb-2 flex p-2 rounded-md border-gray-400`}
      >
        <span>{title}</span>
        <p className=" text-gray-500">{description}</p>
      </div>
    </div>
  );
}
