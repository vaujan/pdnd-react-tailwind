export interface Card {
  id: string;
  title: string;
  columnId: string;
  description: string;
}

export interface Column {
  id: string;
  title: string;
  cards: Card[];
}

// Helper function for drag and drop
export const getCardData = (card: Card) => {
  return {
    type: 'card',
    id: card.id,
    title: card.title,
    description: card.description,
    columnId: card.columnId,
  };
};

export const getColumnData = (column: Column) => {
  return {
    type: 'column',
    id: column.id,
    title: column.title,
    cards: column.cards,
  };
};

export const initialCards: Card[] = [
  {
    id: 'card-1',
    title: 'Design Homepage',
    description: 'Create wireframes and mockups',
    columnId: 'todo',
  },
  { id: 'card-2', title: 'Setup Database', description: 'Configure Postgre', columnId: 'todo' },
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

export const initialData: Column[] = [
  {
    id: 'column-1',
    title: 'To-do',
    cards: initialCards,
  },
  {
    id: 'column-2',
    title: 'In-progress',
    cards: [],
  },
];

export const isCardData = (data: Record<string, unknown>): data is { type: string; id: string } => {
  return data.type === 'card' && typeof data.id === 'string';
};

export const isColumnData = (
  data: Record<string, unknown>,
): data is { type: string; id: string } => {
  return data.type === 'column' && typeof data.id === 'string';
};

export type allowedEdges = 'top' | 'bottom' | 'left' | 'right';
