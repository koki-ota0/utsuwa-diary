import { useState } from 'react';
import { loadItems, loadUsageLogs, saveUsageLogs, type StoredItem } from '../utils/storage';

const initialItems: StoredItem[] = [
  {
    id: 1,
    name: 'Indigo Dinner Plate',
    category: 'Plate',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Handmade Tea Cup',
    category: 'Cup',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Stoneware Bowl',
    category: 'Bowl',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Minimalist Flower Vase',
    category: 'Vase',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date().toISOString(),
  },
];

const MyShelf = () => {
  const [items] = useState<StoredItem[]>(() => {
    const storedItems = loadItems();
    return storedItems.length > 0 ? storedItems : initialItems;
  });

  const [usageLogCount, setUsageLogCount] = useState<number>(() => loadUsageLogs().length);

  const handleUsedToday = (item: StoredItem) => {
    const currentLogs = loadUsageLogs();

    const updatedLogs = [
      {
        itemId: item.id,
        itemName: item.name,
        category: item.category,
        usedAt: new Date().toISOString(),
      },
      ...currentLogs,
    ];

    saveUsageLogs(updatedLogs);
    setUsageLogCount(updatedLogs.length);
    console.log(`Used Today: ${item.name} (${item.category})`);
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">My Shelf</h1>
        <p className="mt-2 text-sm text-gray-600">Items you&apos;ve added to your collection.</p>
        <p className="mt-1 text-xs text-gray-500">Usage logs stored: {usageLogCount}</p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
          Your shelf is empty. Add an item to get started.
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              <img
                src={item.thumbnailUrl}
                alt={item.name}
                className="h-48 w-full object-cover"
                loading="lazy"
              />

              <div className="flex flex-1 flex-col p-4">
                <span className="mb-3 inline-flex w-fit items-center rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700">
                  {item.category}
                </span>

                <h2 className="text-base font-semibold text-gray-900">{item.name}</h2>

                <button
                  type="button"
                  onClick={() => handleUsedToday(item)}
                  className="mt-4 inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Used Today
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default MyShelf;
