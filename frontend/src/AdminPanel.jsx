import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminPanel({ token }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', image: '' });

  const fetchProducts = () => {
    axios.get("http://localhost:5000/products").then((res) => setProducts(res.data));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const createProduct = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/admin/products", {
      ...form,
      price: parseFloat(form.price),
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setForm({ name: '', description: '', price: '', image: '' });
      fetchProducts();
    });
  };

  const deleteProduct = (id) => {
    axios.delete(`http://localhost:5000/admin/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => fetchProducts());
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      <form onSubmit={createProduct} className="grid gap-2 mb-6">
        <input className="border p-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="border p-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="border p-2" placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input className="border p-2" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Create Product</button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Existing Products</h2>
      <ul className="space-y-2">
        {products.map(p => (
          <li key={p._id} className="border p-3 rounded flex justify-between items-center">
            <div>
              <strong>{p.name}</strong> - ${p.price}
            </div>
            <button onClick={() => deleteProduct(p._id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
