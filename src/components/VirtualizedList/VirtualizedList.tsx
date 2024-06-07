import React, {useState, useCallback, ReactNode} from 'react';

export interface VirtualizedListProps {
  render: (item: any, index: number) => ReactNode,
  list: any[],
}

function VirtualizedList({list, render}: VirtualizedListProps) {
  // Стани для визначення видимих елементів та поточної позиції прокрутки
  const [visibleItems, setVisibleItems] = useState<any[]>([]);
  const [scrollTop, setScrollTop] = useState(0);

  // Розмір контейнера зі списком та розмір одного елемента
  const containerHeight = 400;
  const itemHeight = 30;

  // Функція для визначення видимих елементів на основі поточної позиції прокрутки
  const calculateVisibleItems = useCallback(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + Math.ceil(containerHeight / itemHeight), list.length);
    setVisibleItems(list.slice(startIndex, endIndex));
  }, [scrollTop]);

  // Обробник події прокрутки
  const handleScroll = (e: any) => {
    setScrollTop(e.target.scrollTop);
  };

  // Рендеринг списку з видимими елементами
  const renderVisibleItems = () => {
    return visibleItems.map((item, index) => render(item, index));
  };

  return (
    <div
      style={{height: containerHeight, width: '100%', overflowY: 'scroll'}}
      onScroll={handleScroll}
    >
      {/* Пустий блок для визначення висоти прокрутки */}
      <div style={{height: list.length * itemHeight}}>
        {/* Рендеринг видимих елементів */}
        {renderVisibleItems()}
      </div>
    </div>
  );
}

export default VirtualizedList;
