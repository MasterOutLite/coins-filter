import React, {ReactNode, useState} from 'react';
import style from './VirtualizedList.module.css'

export interface VirtualizedListProps {
  render: (item: any, index: number) => ReactNode,
  list: any[],
  maxHeight?: number,
}

function VirtualizedList({list, render, maxHeight}: VirtualizedListProps) {
  const [scrollTop, setScrollTop] = useState(0);

  const containerHeight = maxHeight || 400; // висота контейнера
  const itemHeight = 30; // висота одного елемента

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + Math.ceil(containerHeight / itemHeight), list.length);

  const visibleItems = list.slice(startIndex, endIndex);

  const handleScroll = (e: any) => {
    setScrollTop(e.target.scrollTop);
  };

  return (
    <div
      style={{height: containerHeight}}
      className={style.root}
      onScroll={handleScroll}
    >
      <div style={{height: list.length * itemHeight, position: 'relative'}}>
        {visibleItems.map((item, index) => (
          <div key={startIndex + index}
               style={{position: 'absolute', top: (startIndex + index) * itemHeight, width: '100%'}}>
            {render(item, startIndex + index)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VirtualizedList;
