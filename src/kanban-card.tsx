import { useEffect, useRef, useState } from 'react';
import { GripVertical } from 'lucide-react';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { createPortal } from 'react-dom';
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import invariant from 'tiny-invariant';

import { DropIndicator } from './drop-indicator';
import { getCardData, isCardData, type KanbanCard } from './kanban-data';

type CardState =
  | { type: 'idle' }
  | { type: 'preview'; container: HTMLElement }
  | { type: 'is-dragging' }
  | { type: 'is-card-over'; closestEdge: Edge | null };

const idle: CardState = { type: 'idle' };

interface KanbanCardProps {
  card: KanbanCard;
}

export function KanbanCardComponent({ card }: KanbanCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CardState>(idle);

  useEffect(() => {
    const element = cardRef.current;
    invariant(element);

    return combine(
      // Make this card draggable
      draggable({
        element,
        // This function defines what data travels with the drag
        getInitialData() {
          return getCardData(card);
        },
        // Custom drag preview - what the user sees while dragging
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({
              x: '16px',
              y: '8px',
            }),
            render({ container }) {
              setState({ type: 'preview', container });
            },
          });
        },
        onDragStart() {
          setState({ type: 'is-dragging' });
        },
        onDrop() {
          setState(idle);
        },
      }),

      // Make this card a drop target (so cards can be dropped above/below it)
      dropTargetForElements({
        element,
        // Only allow cards to be dropped on this card (not on itself)
        canDrop({ source }) {
          return isCardData(source.data) && source.data.cardId !== card.id;
        },
        // When something is dropped on this card, provide position data
        getData({ input }) {
          return attachClosestEdge(getCardData(card), {
            element,
            input,
            allowedEdges: ['top', 'bottom'], // Cards can be dropped above or below
          });
        },
        onDragEnter({ self }) {
          const closestEdge = extractClosestEdge(self.data);
          setState({ type: 'is-card-over', closestEdge });
        },
        onDrag({ self }) {
          const closestEdge = extractClosestEdge(self.data);
          setState((current) => {
            if (current.type === 'is-card-over' && current.closestEdge === closestEdge) {
              return current;
            }
            return { type: 'is-card-over', closestEdge };
          });
        },
        onDragLeave() {
          setState(idle);
        },
        onDrop() {
          setState(idle);
        },
      }),
    );
  }, [card]);

  // Visual styling based on current state
  const getCardClassName = () => {
    const baseClass =
      'bg-white rounded-lg border border-gray-200 p-4 cursor-grab transition-all duration-200 hover:shadow-md';

    switch (state.type) {
      case 'is-dragging':
        return `${baseClass} opacity-50 rotate-2 scale-105`;
      default:
        return baseClass;
    }
  };

  return (
    <>
      <div className="relative">
        <div ref={cardRef} data-card-id={card.id} className={getCardClassName()}>
          <div className="flex items-start gap-3">
            <GripVertical size={16} className="text-gray-400 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-1">{card.title}</h3>
              <p className="text-sm text-gray-600">{card.description}</p>
            </div>
          </div>
        </div>

        {/* Drop indicator shows where the card will be placed */}
        {state.type === 'is-card-over' && state.closestEdge && (
          <DropIndicator edge={state.closestEdge} gap="8px" />
        )}
      </div>

      {/* Custom drag preview portal */}
      {state.type === 'preview' && createPortal(<CardDragPreview card={card} />, state.container)}
    </>
  );
}

// Simplified preview component shown while dragging
function CardDragPreview({ card }: { card: KanbanCard }) {
  return (
    <div className="bg-white rounded-lg border-2 border-blue-400 p-4 shadow-lg max-w-xs">
      <h3 className="font-semibold text-gray-800">{card.title}</h3>
    </div>
  );
}
