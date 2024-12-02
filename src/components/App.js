import React, { useState } from 'react';

const initialItems = [
  { id: 1, description: "Shirt", quantity: 5, packed: false, category: "Clothing" },
  { id: 2, description: "Pants", quantity: 2, packed: false, category: "Clothing" },
];

function addItem(newItem, items) {
  const newItems = [...items, newItem];
  return newItems;
}

function Logo() {
  return <h1>My Travel List</h1>;
}

function Form({ addItem }) {
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Clothing');
  const [selectedPriority, setSelectedPriority] = useState('Low');

  const handleSubmit = (e) => {
    e.preventDefault();

    if(!description) return;
    
    const newItem = {
      id: Date.now(),
      description,
      quantity: parseInt(quantity, 10),
      packed: false,
      category: selectedCategory,
    };

    addItem(newItem);

    setQuantity(1);
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <label htmlFor="numOfItems">Quantity:</label>
      <select
        name="numOfItems"
        id="numOfItems"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      >
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      <label htmlFor="category">Category:</label>
      <select
        name="category"
        id="category"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="Clothing">Clothing</option>
        <option value="Electronics">Electronics</option>
        <option value="Documents">Documents</option>
      </select>

      <input
        type="text"
        placeholder="Item Name"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">ADD TO LIST</button>
    </form>
  );
}

function PackingList({ items, onRemove, onCheck }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'All') {
      return true;
    } else {
      return item.category === selectedCategory;
    }
  });

  const handleCheck = (id) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, packed: !item.packed };
      }
      return item;
    });

    onCheck(updatedItems);
  };

  return (
    <div className="list">
      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="All">All</option>
        <option value="Clothing">Clothing</option>
        <option value="Electronics">Electronics</option>
        <option value="Documents">Documents</option>
      </select>
      <ul>
        {filteredItems.map((item) => (
          <li key={item.id} style={item.packed ? { textDecoration: 'line-through' } : {}}>
            <h2 class="description">{item.description}</h2>
            <h5>Category: {item.category}</h5>
            <p>Quantity: {item.quantity}</p>
            <p>
              <h6>Completed?</h6>
              <input
                type="checkbox"
                id={item.id}
                checked={item.packed}
                onChange={() => handleCheck(item.id)}
              />
            </p>

              <button class="removeBTN"type="button" onClick={() => onRemove(item.id)}>
                Remove X
              </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stats({ items }) {
  const packedCount = items.filter((item) => item.packed).length;
  const totalItems = items.length;
  const percentagePacked = Math.round((packedCount / totalItems) * 100);

  return (
    <footer className="stats">
      <em>
        You have {totalItems} items in the list. You already packed {packedCount} ({percentagePacked}%).
      </em>
    </footer>
  );
}

function App() {
  const [items, setItems] = useState(() => {
    const storedItems = localStorage.getItem('travelList');
    return storedItems ? JSON.parse(storedItems) : initialItems;
  });

  const handleAddItem = (newItem) => {
    setItems(addItem(newItem, items));
    localStorage.setItem('travelList', JSON.stringify(items));
  };

  const handleRemove = (id) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    localStorage.setItem('travelList', JSON.stringify(updatedItems));
  };

  const handleCheck = (updatedItems) => {
    setItems(updatedItems);
    localStorage.setItem('travelList', JSON.stringify(updatedItems));
  };

  return (
    <div className="app">
      <Logo />
      <Form addItem={handleAddItem} />
      <Stats items={items} />
      <PackingList items={items} onRemove={handleRemove} onCheck={handleCheck} />
    </div>
  );
}

export default App;