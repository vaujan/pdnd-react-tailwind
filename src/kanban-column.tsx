import { useEffect, useRef, useState } from 'react';
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
import { GripHorizontal } from 'lucide-react';
import invariant from 'tiny-invariant';

import { KanbanCardComponent } from './kanban-card';
import { getColumnData, isCardData, isColumnData, type KanbanColumn } from './kanban-data';
import { DropIndicator } from './drop-indicator';

type ColumnState =
  | { type: 'idle' }
  | { type: 'is-card-over' }
  | { type: 'is-dragging' }
  | { type: 'preview'; container: HTMLElement }
  | { type: 'is-column-over'; closestEdge: Edge | null };

const idle: ColumnState = { type: 'idle' };

interface KanbanColumnProps {
  column: KanbanColumn;
}

export function KanbanColumnComponent({ column }: KanbanColumnProps) {
  const columnRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<ColumnState>(idle);

  useEffect(() => {
    const element = columnRef.current;
    invariant(element);

    return combine(
      // Make the column draggable
      draggable({
        element,
        getInitialData() {
          return getColumnData(column);
        },
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

      // Make the column a drop target for cards and other columns
      dropTargetForElements({
        element,
        canDrop({ source }) {
          // Accept cards or other columns (but not itself)
          if (isCardData(source.data)) return true;
          if (isColumnData(source.data)) return source.data.columnId !== column.id;
          return false;
        },
        getData({ input, source }) {
          const data = getColumnData(column);
          // For column-to-column drops, attach edge information
          if (source.data && isColumnData(source.data)) {
            return attachClosestEdge(data, {
              element,
              input,
              allowedEdges: ['left', 'right'],
            });
          }
          return data;
        },
        onDragEnter({ source, self }) {
          if (isCardData(source.data) && source.data.columnId !== column.id) {
            setState({ type: 'is-card-over' });
          } else if (isColumnData(source.data) && source.data.columnId !== column.id) {
            const closestEdge = extractClosestEdge(self.data);
            setState({ type: 'is-column-over', closestEdge });
          }
        },
        onDrag({ source, self }) {
          if (isColumnData(source.data) && source.data.columnId !== column.id) {
            const closestEdge = extractClosestEdge(self.data);
            setState((current) => {
              if (current.type === 'is-column-over' && current.closestEdge === closestEdge) {
                return current;
              }
              return { type: 'is-column-over', closestEdge };
            });
          }
        },
        onDragLeave() {
          setState(idle);
        },
        onDrop() {
          setState(idle);
        },
      }),
    );
  }, [column]);

  // Visual styling based on state
  const getColumnClassName = () => {
    const baseClass =
      'bg-gray-50 rounded-lg p-4 min-h-[500px] w-80 border-2 transition-all duration-200 cursor-grab';

    switch (state.type) {
      case 'is-card-over':
        return `${baseClass} border-blue-400 bg-blue-50`;
      case 'is-dragging':
        return `${baseClass} border-gray-200 opacity-50 rotate-1 scale-105`;
      default:
        return `${baseClass} border-gray-200`;
    }
  };

  return (
    <>
      <div className="flex flex-col relative">
        <div ref={columnRef} data-column-id={column.id} className={getColumnClassName()}>
          {/* Column Header with drag handle */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <GripHorizontal size={16} className="text-gray-400 cursor-grab" />
              <h2 className="font-bold text-lg text-gray-800">{column.title}</h2>
            </div>
            <div className="text-sm text-gray-500">
              {column.cards.length} {column.cards.length === 1 ? 'card' : 'cards'}
            </div>
          </div>

          {/* Cards Container */}
          <div className="flex-1 space-y-3">
            {column.cards.length > 0 ? (
              column.cards.map((card) => <KanbanCardComponent key={card.id} card={card} />)
            ) : (
              /* Empty state */
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm border-2 border-dashed border-gray-300 rounded-lg">
                Drop cards here
              </div>
            )}
          </div>
        </div>

        {/* Column drop indicator */}
        {state.type === 'is-column-over' && state.closestEdge && (
          <DropIndicator edge={state.closestEdge} gap="12px" />
        )}
      </div>

      {/* Custom column drag preview */}
      {state.type === 'preview' &&
        createPortal(<ColumnDragPreview column={column} />, state.container)}
    </>
  );
}

// Simplified preview component shown while dragging columns
function ColumnDragPreview({ column }: { column: KanbanColumn }) {
  return (
    <div className="bg-white rounded-lg border-2 border-blue-400 p-4 shadow-lg w-80">
      <div className="flex items-center gap-2 mb-2">
        <GripHorizontal size={16} className="text-gray-400" />
        <h3 className="font-bold text-gray-800">{column.title}</h3>
      </div>
      <div className="text-sm text-gray-500">
        {column.cards.length} {column.cards.length === 1 ? 'card' : 'cards'}
      </div>
    </div>
  );
}
