import React, { useEffect, useRef } from 'react';

/**
 * « كل الأنشطة » on the planet home (V2 Premium): everything the classic home offers — subjects,
 * exams, challenges and games, labs, Didou's corner, the parents' tools — as big 3D tiles grouped
 * by what the child wants to do. The planet stays the home; this sheet is its full catalogue.
 */
export interface PlanetShelfItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onOpen: () => void;
}
export interface PlanetShelfGroup {
  id: string;
  title: string;
  items: PlanetShelfItem[];
}

interface PlanetShelfProps {
  title: string;
  closeLabel: string;
  groups: PlanetShelfGroup[];
  onClose: () => void;
  onPick: () => void;
}

export function PlanetShelf({ title, closeLabel, groups, onClose, onPick }: PlanetShelfProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="j-shelf" role="dialog" aria-modal="true" aria-labelledby="j-shelf-title" data-planet-shelf="">
      <div className="j-shelf-head">
        <h2 id="j-shelf-title" className="journey-outline">{title}</h2>
        <button ref={closeRef} type="button" className="j-gloss j-round" data-tone="coral" onClick={onClose} aria-label={closeLabel}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="j-shelf-body">
        {groups.filter((g) => g.items.length > 0).map((group) => (
          <section key={group.id} className="j-shelf-group" aria-label={group.title}>
            <h3>{group.title}</h3>
            <div className="j-shelf-grid">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="j-shelf-tile"
                  data-shelf-item={item.id}
                  onClick={() => {
                    onPick();
                    item.onOpen();
                  }}
                >
                  <span className="j-shelf-icon" aria-hidden="true">{item.icon}</span>
                  <span className="j-shelf-label">{item.label}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

/** The button on the planet that opens the sheet: a 3D toy box. */
export function ShelfButtonArt() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M8 20 L24 13 L40 20 L24 27Z" fill="#ffe08a" />
      <path d="M8 20 V36 L24 43 V27Z" fill="#ffb020" />
      <path d="M40 20 V36 L24 43 V27Z" fill="#d97a00" />
      <path d="M8 20 L3 14 L19 7 L24 13Z" fill="#ffd04d" />
      <path d="M40 20 L45 14 L29 7 L24 13Z" fill="#ffc21a" />
      <circle cx="18" cy="15" r="4.5" fill="#ff4d8d" />
      <circle cx="29" cy="14" r="3.6" fill="#3fb6ff" />
      <path d="M23 9 l1.6 3.4 3.7.4 -2.8 2.4 .8 3.6 -3.3 -1.9 -3.3 1.9 .8 -3.6 -2.8 -2.4 3.7 -.4z" fill="#fff" />
    </svg>
  );
}
