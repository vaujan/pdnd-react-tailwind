import React from 'react';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { type Card as CardType, getCardData } from './card-data';

interface CardProps extends CardType {
  onCardReorder?: (draggedCard: any, targetCard: any) => void;
}

export default function Card({ onCardReorder, ...card }: CardProps) {
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
        getData: () => {
          return {
            type: 'card-drop',
            cardId: card.id,
            columnId: card.columnId,
            title: card.title,
            description: card.description,
          };
        },
        onDragEnter() {
          setIsDropTarget(true);
        },
        onDragLeave() {
          setIsDropTarget(false);
        },
        onDrop({ source, self }) {
          setIsDropTarget(false);
          const draggedCard = source.data;
          const dropTarget = self.data;

          console.log(`Card "${draggedCard.title}" dropped on card "${dropTarget.title}"`);

          // Call the reorder function if provided
          if (onCardReorder) {
            onCardReorder(draggedCard, dropTarget);
          }
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
          <span>{title}</span>
          <p>{description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={ref}
        className={`${isDragging ? 'bg-white/50' : 'bg-white'} flex-col mb-2 flex p-2 rounded-md border-gray-400`}
      >
        <span>{title}</span>
        <p className=" text-gray-500">{description}</p>
      </div>
    </div>
  );
}
