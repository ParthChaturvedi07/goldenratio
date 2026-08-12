import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Loader2, Plus, Edit2, Trash2, Image as ImageIcon, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { resolveMediaUrl } from '../../utils/media';

const formatPrice = (price, currency) => {
  if (price === undefined || price === null) return '—';
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: currency || 'INR' }).format(price);
  } catch {
    return `${currency || 'INR'} ${price}`;
  }
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/admin/products');
      setProducts(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product? This cannot be undone.')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success('Product deleted');
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 text-brand animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 page-enter">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-bold uppercase tracking-widest text-text-primary">Manage Products</h2>
        <Link to="/products/new" className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <div className="col-span-full card-glass p-10 text-center text-text-muted">
            No products found. Create your first one!
          </div>
        ) : (
          products.map((product) => (
            <div key={product._id} className="card-glass overflow-hidden flex flex-col group">
              {/* Image Header */}
              <div className="relative h-48 bg-light-hover overflow-hidden">
                <img
                  src={resolveMediaUrl(product.image)}
                  alt={product.title}
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    if (!e.target.dataset.fallback) {
                      e.target.dataset.fallback = 'true';
                      e.target.src = 'https://placehold.co/600x400/161616/555555?text=No+Image';
                    }
                  }}
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${product.isActive ? 'bg-brand/80 text-white' : 'bg-red-500/80 text-white'}`}>
                    {product.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
                {product.stock === 0 && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md bg-yellow-500/80 text-white">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand mb-1">{product.category}</p>
                <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-1">{product.title}</h3>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base font-black text-text-primary">
                    {formatPrice(product.discountPrice ?? product.price, product.currency)}
                  </span>
                  {product.discountPrice != null && (
                    <span className="text-xs text-text-muted line-through">{formatPrice(product.price, product.currency)}</span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-text-muted mt-auto mb-5 flex-wrap">
                  <span className="flex items-center gap-1"><ImageIcon size={14} /> {product.gallery?.length || 0} Gallery</span>
                  <span className="flex items-center gap-1"><Package size={14} /> Stock: {product.stock ?? 0}</span>
                  <span className="flex items-center gap-1">Order: {product.order}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-light-border">
                  <Link to={`/products/${product._id}/edit`} className="flex-1 btn-secondary flex justify-center items-center gap-2 py-2 text-xs">
                    <Edit2 size={14} /> Edit
                  </Link>
                  <button onClick={() => handleDelete(product._id)} className="flex-1 btn-danger flex justify-center items-center gap-2 py-2 text-xs">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;