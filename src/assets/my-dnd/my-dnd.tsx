import { Trash } from 'lucide-react';
import Card from './card';
import { initialCards } from './card-data';
import React from 'react';

export default function MyDnd() {
  const [cards, setCards] = React.useState(initialCards);

  const handleCardReorder = (draggedCard, targetCard) => {
    const newOrderedCards = [...cards];

    const draggedCardIndex = newOrderedCards.findIndex((card) => card.id === draggedCard.id);
    const targetCardIndex = newOrderedCards.findIndex((card) => card.id === targetCard.id);

    if (targetCardIndex === draggedCardIndex) return;

    // Remove the dragged card from its current position
    const [movedCard] = newOrderedCards.splice(draggedCardIndex, 1);

    // Insert the dragged card at the target position
    newOrderedCards.splice(targetCardIndex, 0, movedCard);

    setCards(newOrderedCards);
  };
  //
  // const handleCardRemove = (draggedCard) => {
  //   const newOrderedCards = [...cards];

  //   const draggedCardIndex = newOrderedCards.findIndex((card) => card.id === draggedCard.id);
  //   if (draggedCardIndex === -1) return cards;

  //   newOrderedCards.splice(draggedCardIndex, 1);

  //   setCards(newOrderedCards);
  // };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dnd</h1>
        </div>
        {/* here */}
        <div className="flex p-2 bg-gray-200 rounded-xl flex-col w-[350px]">
          <h3 className="mb-3 font-medium">column title</h3>
          {cards.map((card) => (
            <Card
              key={card.id}
              columnId={card.columnId}
              description={card.description}
              id={card.id}
              title={card.title}
              onCardReorder={handleCardReorder}
            />
          ))}
          <div className="bg-red-200 text-red-500 flex justify-center items-center p-3 rounded-lg w-full h-30">
            <Trash size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
