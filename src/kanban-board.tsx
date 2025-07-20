import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge';
import { triggerPostMoveFlash } from '@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash';

import { KanbanColumnComponent } from './kanban-column';
import {
  getInitialKanbanData,
  isCardData,
  isColumnData,
  type KanbanColumn,
  type ColumnId,
} from './kanban-data';

export function KanbanBoard() {
  const [columns, setColumns] = useState<KanbanColumn[]>(() => getInitialKanbanData());

  useEffect(() => {
    // This monitor listens to ALL drag and drop events on the page
    return monitorForElements({
      // Monitor both card and column drag operations
      canMonitor({ source }) {
        return isCardData(source.data) || isColumnData(source.data);
      },
      onDrop({ location, source }) {
        const target = location.current.dropTargets[0];
        if (!target) return;

        const sourceData = source.data;

        // Handle card drag operations
        if (isCardData(sourceData)) {
          // Case 1: Card dropped on another card (reordering within same column or moving between columns)
          if (isCardData(target.data)) {
            handleCardToCardDrop(sourceData, target.data);
          }
          // Case 2: Card dropped directly on a column (moving to end of column)
          else if (isColumnData(target.data)) {
            handleCardToColumnDrop(sourceData, target.data.columnId);
          }
        }
        // Handle column drag operations
        else if (isColumnData(sourceData) && isColumnData(target.data)) {
          handleColumnToColumnDrop(sourceData, target.data);
        }
      },
    });
  }, [columns]);

  // Handle dropping a card onto another card
  const handleCardToCardDrop = (sourceData: any, targetData: any) => {
    const sourceCardId = sourceData.cardId;
    const targetCardId = targetData.cardId;
    const closestEdge = extractClosestEdge(targetData);

    setColumns((currentColumns) => {
      // Find source and target information
      let sourceColumn: KanbanColumn | null = null;
      let targetColumn: KanbanColumn | null = null;
      let sourceCardIndex = -1;
      let targetCardIndex = -1;

      for (const column of currentColumns) {
        const sourceIndex = column.cards.findIndex((card) => card.id === sourceCardId);
        const targetIndex = column.cards.findIndex((card) => card.id === targetCardId);

        if (sourceIndex >= 0) {
          sourceColumn = column;
          sourceCardIndex = sourceIndex;
        }
        if (targetIndex >= 0) {
          targetColumn = column;
          targetCardIndex = targetIndex;
        }
      }

      if (!sourceColumn || !targetColumn || sourceCardIndex < 0 || targetCardIndex < 0) {
        return currentColumns;
      }

      const newColumns = [...currentColumns];

      // Case A: Moving within the same column (reordering)
      if (sourceColumn.id === targetColumn.id) {
        const columnIndex = newColumns.findIndex((col) => col.id === sourceColumn!.id);
        const newColumn = { ...newColumns[columnIndex] };

        newColumn.cards = reorderWithEdge({
          list: newColumn.cards,
          startIndex: sourceCardIndex,
          indexOfTarget: targetCardIndex,
          closestEdgeOfTarget: closestEdge,
          axis: 'vertical',
        });

        newColumns[columnIndex] = newColumn;
      }
      // Case B: Moving between different columns
      else {
        const sourceColumnIndex = newColumns.findIndex((col) => col.id === sourceColumn!.id);
        const targetColumnIndex = newColumns.findIndex((col) => col.id === targetColumn!.id);

        const newSourceColumn = { ...newColumns[sourceColumnIndex] };
        const newTargetColumn = { ...newColumns[targetColumnIndex] };

        // Remove card from source column
        const [movedCard] = newSourceColumn.cards.splice(sourceCardIndex, 1);
        // Update card's column reference
        movedCard.columnId = targetColumn.id;

        // Add card to target column at the correct position
        const insertIndex = closestEdge === 'bottom' ? targetCardIndex + 1 : targetCardIndex;
        newTargetColumn.cards.splice(insertIndex, 0, movedCard);

        newColumns[sourceColumnIndex] = newSourceColumn;
        newColumns[targetColumnIndex] = newTargetColumn;
      }

      return newColumns;
    });

    // Flash animation to show where the card moved
    setTimeout(() => {
      const element = document.querySelector(`[data-card-id="${sourceCardId}"]`);
      if (element instanceof HTMLElement) {
        triggerPostMoveFlash(element);
      }
    }, 0);
  };

  // Handle dropping a card directly onto a column
  const handleCardToColumnDrop = (sourceData: any, targetColumnId: ColumnId) => {
    const sourceCardId = sourceData.cardId;

    setColumns((currentColumns) => {
      // Find source card and column
      let sourceColumn: KanbanColumn | null = null;
      let sourceCardIndex = -1;

      for (const column of currentColumns) {
        const cardIndex = column.cards.findIndex((card) => card.id === sourceCardId);
        if (cardIndex >= 0) {
          sourceColumn = column;
          sourceCardIndex = cardIndex;
          break;
        }
      }

      if (!sourceColumn || sourceCardIndex < 0) {
        return currentColumns;
      }

      // Don't do anything if dropping on the same column
      if (sourceColumn.id === targetColumnId) {
        return currentColumns;
      }

      const newColumns = [...currentColumns];
      const sourceColumnIndex = newColumns.findIndex((col) => col.id === sourceColumn!.id);
      const targetColumnIndex = newColumns.findIndex((col) => col.id === targetColumnId);

      const newSourceColumn = { ...newColumns[sourceColumnIndex] };
      const newTargetColumn = { ...newColumns[targetColumnIndex] };

      // Remove card from source column
      const [movedCard] = newSourceColumn.cards.splice(sourceCardIndex, 1);
      // Update card's column reference
      movedCard.columnId = targetColumnId;
      // Add card to end of target column
      newTargetColumn.cards.push(movedCard);

      newColumns[sourceColumnIndex] = newSourceColumn;
      newColumns[targetColumnIndex] = newTargetColumn;

      return newColumns;
    });

    // Flash animation
    setTimeout(() => {
      const element = document.querySelector(`[data-card-id="${sourceCardId}"]`);
      if (element instanceof HTMLElement) {
        triggerPostMoveFlash(element);
      }
    }, 0);
  };

  // Handle dropping a column onto another column (reordering columns)
  const handleColumnToColumnDrop = (sourceData: any, targetData: any) => {
    const sourceColumnId = sourceData.columnId;
    const targetColumnId = targetData.columnId;
    const closestEdge = extractClosestEdge(targetData);

    if (sourceColumnId === targetColumnId) return;

    setColumns((currentColumns) => {
      const sourceIndex = currentColumns.findIndex((col) => col.id === sourceColumnId);
      const targetIndex = currentColumns.findIndex((col) => col.id === targetColumnId);

      if (sourceIndex < 0 || targetIndex < 0) return currentColumns;

      const newColumns = [...currentColumns];

      // Use reorderWithEdge for column reordering
      return reorderWithEdge({
        list: newColumns,
        startIndex: sourceIndex,
        indexOfTarget: targetIndex,
        closestEdgeOfTarget: closestEdge,
        axis: 'horizontal',
      });
    });

    // Flash animation for moved column
    setTimeout(() => {
      const element = document.querySelector(`[data-column-id="${sourceColumnId}"]`);
      if (element instanceof HTMLElement) {
        triggerPostMoveFlash(element);
      }
    }, 0);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Multi-Column Kanban Board</h1>
          <p className="text-gray-600">
            This demonstrates how Pragmatic Drag and Drop works with multiple columns. You can drag
            cards within columns (reordering) or between columns (moving). You can also drag the
            columns themselves to reorder them!
          </p>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4">
          {columns.map((column) => (
            <KanbanColumnComponent key={column.id} column={column} />
          ))}
        </div>
      </div>
    </div>
  );
}
