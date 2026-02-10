import { ChangeEvent, FormEvent, useState } from 'react';

type Category = 'Plate' | 'Cup' | 'Vase' | 'Misc';

const categories: Category[] = ['Plate', 'Cup', 'Vase', 'Misc'];

const ItemRegister = () => {
  const [photos, setPhotos] = useState<File[]>([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('Plate');
  const [brandShop, setBrandShop] = useState('');
  const [notes, setNotes] = useState('');
  const [photoError, setPhotoError] = useState('');

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length > 3) {
      setPhotoError('You can upload up to 3 photos.');
      setPhotos(selectedFiles.slice(0, 3));
      return;
    }

    setPhotoError('');
    setPhotos(selectedFiles);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = {
      photos,
      name,
      category,
      brandShop,
      notes,
    };

    // Replace this with API integration when backend endpoint is ready.
    console.log('Item registration payload:', formData);
  };

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-semibold text-gray-900">Register Item</h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="photos">
              Photo Upload (max 3)
            </label>
            <input
              id="photos"
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-200"
            />
            <p className="mt-2 text-xs text-gray-500">{photos.length} / 3 selected</p>
            {photoError && <p className="mt-1 text-sm text-red-600">{photoError}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none ring-indigo-500 focus:ring-2"
              placeholder="Enter item name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(event) => setCategory(event.target.value as Category)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none ring-indigo-500 focus:ring-2"
            >
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="brandShop">
              Brand / Shop
            </label>
            <input
              id="brandShop"
              type="text"
              value={brandShop}
              onChange={(event) => setBrandShop(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none ring-indigo-500 focus:ring-2"
              placeholder="Enter brand or shop name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none ring-indigo-500 focus:ring-2"
              placeholder="Add any details about the item"
            />
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </form>
      </section>
    </main>
  );
};

export default ItemRegister;
