# Pragmatic Drag and Drop Learning Guide

This repository contains two separate implementations to help you understand how **Pragmatic Drag and Drop (PdnD)** works:

1. **Single Column**: Simple reordering within one list
2. **Multi Column**: Complex Kanban board with cross-column movement

## 🎯 What You'll Learn

### Core Concepts

#### 1. **Draggable Elements**

Every draggable item needs:

- `draggable()` function from the adapter
- A `getInitialData()` function that defines what data travels with the drag
- Event handlers for drag lifecycle (`onDragStart`, `onDrop`, etc.)

```tsx
draggable({
  element: cardRef.current,
  getInitialData() {
    return getCardData(card); // This data follows the drag
  },
  onDragStart() {
    setState({ type: 'is-dragging' });
  },
});
```

#### 2. **Drop Targets**

Any element that can receive drops needs:

- `dropTargetForElements()` function
- A `canDrop()` function to determine what can be dropped
- A `getData()` function to provide context about the target

```tsx
dropTargetForElements({
  element: columnRef.current,
  canDrop({ source }) {
    return isCardData(source.data); // Only accept cards
  },
  getData() {
    return getColumnData(column); // Provide column context
  },
});
```

#### 3. **Global Monitoring**

One monitor per app section handles all drop events:

- `monitorForElements()` listens to all drag operations
- `canMonitor()` filters which drags to handle
- `onDrop()` contains your business logic for state updates

```tsx
monitorForElements({
  canMonitor({ source }) {
    return isCardData(source.data);
  },
  onDrop({ location, source }) {
    // Handle the drop and update state
  },
});
```

#### 4. **Data Type Safety**

PdnD uses Symbol-based keys for type safety:

```tsx
const cardDataKey = Symbol('kanban-card');

export type CardDragData = {
  [cardDataKey]: true;
  cardId: string;
  columnId: ColumnId;
};

export function isCardData(data: Record<string | symbol, unknown>): data is CardDragData {
  return data[cardDataKey] === true;
}
```

## 🏗️ Architecture Breakdown

### Single Column Implementation

**Files involved:**

- `src/task.tsx` - The draggable task component
- `src/list.tsx` - Container with monitoring logic
- `src/task-data.ts` - Data types and utilities

**How it works:**

1. Each task is both draggable AND a drop target
2. Drop targets use `attachClosestEdge()` to determine if dropping above or below
3. The monitor handles reordering using `reorderWithEdge()`

### Multi Column Implementation

**Files involved:**

- `src/kanban-card.tsx` - Draggable cards
- `src/kanban-column.tsx` - Drop target columns
- `src/kanban-board.tsx` - Main container with complex monitoring
- `src/kanban-data.ts` - Data types and utilities

**How it works:**

1. Cards are draggable and can also be drop targets (for positioning)
2. Columns are BOTH draggable AND drop targets (for card drops and column reordering)
3. The monitor handles three scenarios:
   - **Card-to-card**: Reordering within column or moving between columns
   - **Card-to-column**: Moving to the end of a column
   - **Column-to-column**: Reordering entire columns

## 🎨 Visual Feedback

### Drop Indicators

- Show where items will be placed
- Use `attachClosestEdge()` and `extractClosestEdge()`
- Custom styling based on drag state

### Drag Previews

- Custom preview using `setCustomNativeDragPreview()`
- Rendered in a portal for flexibility
- Positioned with `pointerOutsideOfPreview()`

### State Management

Each component tracks its drag state:

```tsx
type CardState =
  | { type: 'idle' }
  | { type: 'preview'; container: HTMLElement }
  | { type: 'is-dragging' }
  | { type: 'is-card-over'; closestEdge: Edge | null };
```

## 🚀 Key Features Demonstrated

### 1. **Reordering Within Same Container**

- Single column: Tasks reorder within the list
- Multi column: Cards reorder within the same column

### 2. **Moving Between Containers**

- Multi column: Cards move between different columns
- State updates handle both source and target columns

### 3. **Column Reordering**

- Multi column: Entire columns can be dragged to reorder board layout
- Uses horizontal edge detection (left/right) instead of vertical

### 4. **Position Detection**

- Uses `closest-edge` to determine drop position
- Supports both vertical (top/bottom) and horizontal (left/right) edges
- Different edge configurations for different drag types

### 5. **Performance Optimization**

- Minimal re-renders during drag operations
- State updates only when necessary
- `flushSync()` for immediate DOM updates when needed

### 6. **Accessibility**

- Built-in keyboard navigation support
- Screen reader announcements
- Focus management

## 🛠️ Running the Demo

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The demo page lets you switch between:

- **Single Column**: See basic reordering
- **Multi Column**: See complex cross-column movement

## 📚 Learning Path

1. **Start with Single Column**: Understand basic draggable/droppable concepts
2. **Examine the Data Flow**: See how `getInitialData()` and `getData()` work
3. **Study the Monitor**: Learn how `monitorForElements()` handles drops
4. **Move to Multi Column**: See complex scenarios with multiple drop targets
5. **Explore Edge Cases**: Try different drop combinations

## 🧪 Try These Experiments

1. **Modify Drop Logic**: Change `canDrop()` conditions
2. **Add New Card Types**: Create cards that behave differently
3. **Custom Animations**: Modify the visual feedback
4. **Add More Columns**: Extend the Kanban board
5. **Nested Containers**: Try containers within containers

## 🎓 Advanced Topics

### Custom Drag Previews

The multi-column demo shows how to create custom drag previews that look different from the original element.

### Multiple Drop Target Types

Cards can be dropped on other cards OR directly on columns, showing how to handle hierarchical drop targets.

### Cross-Container Data Flow

When moving between columns, the card's `columnId` is updated to maintain data consistency.

### Performance Considerations

- Using `useState` callbacks to avoid stale closure issues
- Debouncing visual state updates
- Efficient DOM queries for post-drop animations

---

This implementation demonstrates real-world patterns you'll use when building complex drag and drop interfaces. The separation between single and multi-column examples helps you understand how PdnD scales from simple to complex scenarios. [[memory:3781247]]
