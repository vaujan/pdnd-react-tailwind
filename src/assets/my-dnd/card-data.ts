export interface Card {
  id: string;
  title: string;
  columnId: string;
  description: string;
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

export const initialCards: Card[] = [
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
