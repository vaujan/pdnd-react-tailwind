import { Trash } from 'lucide-react';
import Card from './card';
import { initialCards, isCardData } from './card-data';
import React from 'react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { flushSync } from 'react-dom';
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge';

export default function MyDnd() {
  const [cards, setCards] = React.useState(initialCards);

  React.useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return isCardData(source.data);
      },
      onDrop({ location, source }) {
        const target = location.current.dropTargets[0];
        if (!target) return;

        const sourceData = source.data;
        const targetData = target.data;

        if (!isCardData(sourceData) || !isCardData(targetData)) return;

        const indexOfSource = cards.findIndex((card) => card.id === sourceData.id);
        const indexOfTarget = cards.findIndex((card) => card.id === targetData.id);

        if (indexOfSource < 0 || indexOfTarget < 0) return;

        const closestEdgeOfTarget = extractClosestEdge(targetData);

        flushSync(() => {
          setCards(
            reorderWithEdge({
              list: cards,
              startIndex: indexOfSource,
              indexOfTarget,
              closestEdgeOfTarget,
              axis: 'vertical',
            }),
          );
        });
        source;
      },
    });
  }, [cards]);
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dnd</h1>
        </div>
        {/* map cards here */}
        <div className="flex p-2 bg-gray-200 rounded-xl flex-col w-[350px]">
          <h3 className="mb-3 font-medium">column title</h3>
          {cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
          <div className="bg-red-200 text-red-500 flex justify-center items-center p-3 rounded-lg w-full h-30">
            <Trash size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
