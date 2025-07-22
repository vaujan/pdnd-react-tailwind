import { useState } from 'react';
import { List } from './list';
import { KanbanBoard } from './kanban-board';
import MyDnd from '../my-dnd/my-dnd';

type DemoMode = 'single-column' | 'multi-column' | 'my-dnd';

export function DemoPage() {
  const [mode, setMode] = useState<DemoMode>('my-dnd');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pragmatic Drag and Drop Demo</h1>
              <p className="text-gray-600 mt-1">
                Learn how PdnD works with different implementations
              </p>
            </div>

            {/* Mode Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setMode('single-column')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  mode === 'single-column'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Single Column
              </button>
              <button
                onClick={() => setMode('multi-column')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  mode === 'multi-column'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Multi Column
              </button>

              <button
                onClick={() => setMode('my-dnd')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  mode === 'my-dnd'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                My Dnd
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {mode === 'single-column' ? (
        <div>
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Single Column Implementation
              </h2>
              <p className="text-gray-600">
                This shows the original implementation where tasks can be reordered within a single
                list. It demonstrates basic draggable items and reordering within the same
                container.
              </p>
            </div>
          </div>
          <List />
        </div>
      ) : mode === 'multi-column' ? (
        <KanbanBoard />
      ) : (
        <MyDnd />
      )}

      {/* Educational Notes */}
      <div className="border-t border-gray-200 bg-white px-6 py-8 mt-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Key PdnD Concepts Demonstrated:
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {mode === 'single-column' ? (
              <div className="space-y-4">
                <div className="border-l-4 border-blue-400 pl-4">
                  <h4 className="font-semibold text-gray-900">Draggable Items</h4>
                  <p className="text-sm text-gray-600">
                    Each task is made draggable using the `draggable()` function
                  </p>
                </div>
                <div className="border-l-4 border-green-400 pl-4">
                  <h4 className="font-semibold text-gray-900">Drop Targets</h4>
                  <p className="text-sm text-gray-600">
                    Tasks can be dropped on other tasks with position detection (top/bottom)
                  </p>
                </div>
                <div className="border-l-4 border-purple-400 pl-4">
                  <h4 className="font-semibold text-gray-900">Global Monitoring</h4>
                  <p className="text-sm text-gray-600">
                    `monitorForElements()` handles all drop events and updates the state
                  </p>
                </div>
                <div className="border-l-4 border-orange-400 pl-4">
                  <h4 className="font-semibold text-gray-900">Visual Feedback</h4>
                  <p className="text-sm text-gray-600">
                    Drop indicators and drag previews provide user feedback
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-l-4 border-blue-400 pl-4">
                  <h4 className="font-semibold text-gray-900">Multiple Drop Zones</h4>
                  <p className="text-sm text-gray-600">
                    Cards can be dropped on other cards OR directly on columns
                  </p>
                </div>
                <div className="border-l-4 border-green-400 pl-4">
                  <h4 className="font-semibold text-gray-900">Cross-Column Movement</h4>
                  <p className="text-sm text-gray-600">
                    Cards can move between different columns, demonstrating complex drop logic
                  </p>
                </div>
                <div className="border-l-4 border-purple-400 pl-4">
                  <h4 className="font-semibold text-gray-900">Column Reordering</h4>
                  <p className="text-sm text-gray-600">
                    Drag columns by their header to reorder the entire board layout
                  </p>
                </div>
                <div className="border-l-4 border-orange-400 pl-4">
                  <h4 className="font-semibold text-gray-900">Hierarchical Targets</h4>
                  <p className="text-sm text-gray-600">
                    The drop system handles nested targets (cards within columns)
                  </p>
                </div>
                <div className="border-l-4 border-indigo-400 pl-4">
                  <h4 className="font-semibold text-gray-900">Data Type Safety</h4>
                  <p className="text-sm text-gray-600">
                    Symbol-based keys ensure type-safe drag data identification
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 mb-2">Why Pragmatic Drag and Drop?</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Framework agnostic - works with any UI library
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Excellent accessibility and screen reader support
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Built-in collision detection and edge-case handling
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Performant - minimal re-renders during drag operations
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Type-safe with excellent TypeScript support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
