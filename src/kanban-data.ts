export type ColumnId = 'todo' | 'in-progress' | 'done';

export type KanbanCard = {
  id: string;
  title: string;
  description: string;
  columnId: ColumnId;
};

export type KanbanColumn = {
  id: ColumnId;
  title: string;
  cards: KanbanCard[];
};

// Symbol keys for drag data identification - this is important for type safety
const cardDataKey = Symbol('kanban-card');
const columnDataKey = Symbol('kanban-column');

// Type definitions for drag data - this helps PdnD identify what's being dragged
export type CardDragData = {
  [cardDataKey]: true;
  cardId: string;
  columnId: ColumnId;
};

export type ColumnDragData = {
  [columnDataKey]: true;
  columnId: ColumnId;
};

// Helper functions to create and identify drag data
export function getCardData(card: KanbanCard): CardDragData {
  return { [cardDataKey]: true, cardId: card.id, columnId: card.columnId };
}

export function isCardData(data: Record<string | symbol, unknown>): data is CardDragData {
  return data[cardDataKey] === true;
}

export function getColumnData(column: KanbanColumn): ColumnDragData {
  return { [columnDataKey]: true, columnId: column.id };
}

export function isColumnData(data: Record<string | symbol, unknown>): data is ColumnDragData {
  return data[columnDataKey] === true;
}

// Sample data for the kanban board
const initialCards: KanbanCard[] = [
  {
    id: 'card-1',
    title: 'Design Homepage',
    description: 'Create wireframes and mockups',
    columnId: 'todo',
  },
  { id: 'card-2', title: 'Setup Database', description: 'Configure PostgreSQL', columnId: 'todo' },
  {
    id: 'card-3',
    title: 'User Authentication',
    description: 'Implement login system',
    columnId: 'in-progress',
  },
  {
    id: 'card-4',
    title: 'API Development',
    description: 'Build REST endpoints',
    columnId: 'in-progress',
  },
  { id: 'card-5', title: 'Testing Suite', description: 'Write unit tests', columnId: 'done' },
  { id: 'card-6', title: 'Documentation', description: 'Write API docs', columnId: 'done' },
];

export function getInitialKanbanData(): KanbanColumn[] {
  const columns: KanbanColumn[] = [
    { id: 'todo', title: '📋 To Do', cards: [] },
    { id: 'in-progress', title: '⚡ In Progress', cards: [] },
    { id: 'done', title: '✅ Done', cards: [] },
  ];

  // Distribute cards to their respective columns
  initialCards.forEach((card) => {
    const column = columns.find((col) => col.id === card.columnId);
    if (column) {
      column.cards.push(card);
    }
  });

  return columns;
}
