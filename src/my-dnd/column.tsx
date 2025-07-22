import React from 'react';
import {
  type Column as ColumnType,
  type Card as CardType,
  isColumnData,
  isCardData,
} from './card-data';
import Card from './card';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { getColumnData, type allowedEdges } from './card-data';
import {
  attachClosestEdge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';

interface ColumnProps {
  column: ColumnType;
}

export default function Column({ column }: ColumnProps) {
  const { title, cards } = column;
  const ref = React.useRef<HTMLDivElement | null>(null);

  const [isDragging, setIsDragging] = React.useState(false);
  const [isDropTarget, setIsDropTarget] = React.useState(false);
  const [closestEdge, setClosestEdge] = React.useState<allowedEdges | null>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const cleanup = combine(
      draggable({
        element,
        getInitialData: () => getColumnData(column),
        onDragStart() {
          setIsDragging(true);
        },
        onDrop() {
          setIsDragging(false);
        },
      }),

      dropTargetForElements({
        element,
        canDrop({ source }) {
          if (isCardData(source.data)) return true;
          if (isColumnData(source.data)) return source.data.id !== column.id;
          return false;
        },
        getData: ({ input, element }) => {
          const data = {
            type: 'column',
            id: column.id,
          };

          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['left', 'right'],
          });
        },
        getIsSticky: () => true,
        onDragStart({ self }) {
          setIsDropTarget(true);
          const edge = extractClosestEdge(self.data);
          setClosestEdge(edge);
        },

        onDrag({ self }) {
          setIsDropTarget(true);
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
  }, []);

  return (
    <div
      ref={ref}
      className={`${isDragging ? 'bg-blue-200' : 'bg-gray-200'} ${isDropTarget ? 'outline outline-offset-2 outline-blue-500' : ''} transition-all ease-out flex p-2 rounded-xl flex-col w-[350px]`}
    >
      <h3 className="mb-3 font-medium w-full text-center">{title}</h3>
      <div className="flex flex-col w-full gap-2">
        {cards.map((card: CardType) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
