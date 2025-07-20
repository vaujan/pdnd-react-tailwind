import Card from './card';
import { initialCards } from './card-data';

export default function MyDnd() {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dnd</h1>
        </div>

        {/* here */}
        <div className="flex p-2 bg-gray-200 rounded-xl flex-col w-[350px]">
          <h3 className="mb-3 font-medium">column title</h3>
          {initialCards.map((card) => (
            <Card
              key={card.id}
              columnId={card.columnId}
              description={card.description}
              id={card.id}
              title={card.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
