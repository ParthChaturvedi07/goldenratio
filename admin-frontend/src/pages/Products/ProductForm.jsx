import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import { Loader2, ArrowLeft, Image as ImageIcon, Trash2, Upload, CheckCircle2, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { resolveMediaUrl } from '../../utils/media';

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'];

const ProductForm = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // 0–100

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    discountPrice: '',
    currency: 'INR',
    sku: '',
    stock: 0,
    order: 0,
    isActive: true,
  });

  // Specifications: array of { label, value }
  const [specifications, setSpecifications] = useState([]);
  // Tags: comma-separated text, sent as-is (backend parses CSV or JSON)
  const [tagsInput, setTagsInput] = useState('');

  const [productImage, setProductImage] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [galleryCaptions, setGalleryCaptions] = useState([]);

  // Existing (already-saved) media
  const [existingImage, setExistingImage] = useState('');
  const [existingGallery, setExistingGallery] = useState([]);

  // Revoke object URLs on unmount to prevent memory leaks
  const objectUrlsRef = useRef([]);
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const createPreviewUrl = (file) => {
    const url = URL.createObjectURL(file);
    objectUrlsRef.current.push(url);
    return url;
  };

  useEffect(() => {
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/admin/products/${id}`);
      const p = res.data.data;
      setFormData({
        title: p.title,
        category: p.category,
        description: p.description,
        price: p.price ?? '',
        discountPrice: p.discountPrice ?? '',
        currency: p.currency || 'INR',
        sku: p.sku || '',
        stock: p.stock ?? 0,
        order: p.order || 0,
        isActive: p.isActive,
      });
      setSpecifications(p.specifications || []);
      setTagsInput((p.tags || []).join(', '));
      setExistingImage(p.image);
      setExistingGallery(p.gallery || []);
    } catch (err) {
      toast.error('Failed to load product');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProductImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProductImage(file);
    setProductImagePreview(createPreviewUrl(file));
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryImages(files);
    setGalleryPreviews(files.map((f) => createPreviewUrl(f)));
    setGalleryCaptions(files.map(() => ''));
  };

  const handleGalleryCaptionChange = (index, value) => {
    setGalleryCaptions(prev => prev.map((c, i) => (i === index ? value : c)));
  };

  // ── Specifications helpers ──
  const addSpecification = () => {
    setSpecifications(prev => [...prev, { label: '', value: '' }]);
  };
  const updateSpecification = (index, field, value) => {
    setSpecifications(prev => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };
  const removeSpecification = (index) => {
    setSpecifications(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditing && !productImage) {
      toast.error('Main product image is required');
      return;
    }

    setSubmitting(true);
    setUploadProgress(0);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      // Only send well-formed specification rows
      const cleanSpecs = specifications.filter(s => s.label?.trim() && s.value?.trim());
      data.append('specifications', JSON.stringify(cleanSpecs));

      // Tags sent as comma-separated string; backend falls back to CSV parsing
      data.append('tags', tagsInput);

      if (productImage) data.append('productImage', productImage);

      galleryImages.forEach((file, i) => {
        data.append('galleryImages', file);
        data.append(`galleryCaption_${i}`, galleryCaptions[i] || '');
      });

      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          if (evt.total) {
            setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
          }
        },
      };

      if (isEditing) {
        await api.put(`/admin/products/${id}`, data, config);
        toast.success('Product updated successfully');
      } else {
        await api.post('/admin/products', data, config);
        toast.success('Product created successfully');
      }
      navigate('/products');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save product');
      setUploadProgress(0);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteExistingGalleryItem = async (index) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await api.delete(`/admin/products/${id}/gallery/${index}`);
      setExistingGallery(prev => prev.filter((_, i) => i !== index));
      toast.success('Image removed');
    } catch (err) {
      toast.error('Failed to remove image');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 text-brand animate-spin" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 page-enter">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/products')} className="p-2 bg-light-card border border-light-border rounded-xl text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold tracking-tight text-text-primary">
          {isEditing ? `Edit Product: ${formData.title}` : 'Create New Product'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ── Basic Information ──────────────────────────────── */}
        <div className="card-glass p-8 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand border-b border-light-border pb-4">Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2">Product Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="input-field" required />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2">Category / Department *</label>
              <input type="text" name="category" value={formData.category} onChange={handleInputChange} className="input-field" required placeholder="e.g. Industrial Models" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2">Description *</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} className="input-field min-h-[100px]" required></textarea>
            </div>
          </div>
        </div>

        {/* ── Pricing & Inventory ─────────────────────────────── */}
        <div className="card-glass p-8 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand border-b border-light-border pb-4">Pricing & Inventory</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2">Price *</label>
              <input type="number" step="0.01" min="0" name="price" value={formData.price} onChange={handleInputChange} className="input-field" required />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2">Discount Price</label>
              <input type="number" step="0.01" min="0" name="discountPrice" value={formData.discountPrice} onChange={handleInputChange} className="input-field" placeholder="Optional" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2">Currency</label>
              <select name="currency" value={formData.currency} onChange={handleInputChange} className="input-field">
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2">SKU</label>
              <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} className="input-field" placeholder="Optional" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2">Stock Quantity</label>
              <input type="number" min="0" name="stock" value={formData.stock} onChange={handleInputChange} className="input-field" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2">Display Order</label>
              <input type="number" name="order" value={formData.order} onChange={handleInputChange} className="input-field" />
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer mt-6">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="w-5 h-5 accent-brand rounded" />
                <span className="text-sm font-semibold text-text-primary">Product is Active (Visible to public)</span>
              </label>
            </div>
          </div>
        </div>

        {/* ── Specifications ──────────────────────────────────── */}
        <div className="card-glass p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-light-border pb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand">Specifications</h3>
            <button type="button" onClick={addSpecification} className="btn-secondary flex items-center gap-2 py-2 px-4 text-xs">
              <Plus size={14} /> Add Row
            </button>
          </div>

          {specifications.length === 0 ? (
            <p className="text-sm text-text-muted">No specifications added yet. e.g. "Material" → "Resin", "Scale" → "1:100"</p>
          ) : (
            <div className="space-y-3">
              {specifications.map((spec, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Label (e.g. Material)"
                    value={spec.label}
                    onChange={(e) => updateSpecification(i, 'label', e.target.value)}
                    className="input-field flex-1"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. Resin)"
                    value={spec.value}
                    onChange={(e) => updateSpecification(i, 'value', e.target.value)}
                    className="input-field flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecification(i)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Tags ─────────────────────────────────────────────── */}
        <div className="card-glass p-8 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand border-b border-light-border pb-4">Tags</h3>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2">Comma-separated Tags</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="input-field"
              placeholder="e.g. architectural, custom, premium"
            />
          </div>
        </div>

        {/* ── Media Uploads ──────────────────────────────────── */}
        <div className="card-glass p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-light-border pb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand">Media Uploads</h3>
            <span className="text-[10px] text-text-muted bg-brand-dim text-brand px-2 py-0.5 rounded-full font-semibold">Cloudinary CDN</span>
          </div>

          <div className="space-y-6">
            {/* ── Main Image ── */}
            <div className="p-4 bg-light-bg border border-light-border rounded-xl space-y-4">
              <label className="flex items-center gap-2 text-sm font-bold text-text-primary">
                <ImageIcon size={18} className="text-brand" />
                Main Product Image {isEditing ? '' : '*'}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleProductImageChange}
                className="text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-brand-dim file:text-brand hover:file:bg-brand/20"
              />
              {/* New selection preview */}
              {productImagePreview && (
                <div className="mt-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">New Image Preview</p>
                  <div className="w-48 h-28 rounded-lg overflow-hidden border-2 border-brand/40">
                    <img src={productImagePreview} alt="New product preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
              {/* Existing image (only show when not replacing) */}
              {existingImage && !productImagePreview && (
                <div className="mt-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">Current Image (Cloudinary)</p>
                  <div className="w-48 h-28 rounded-lg overflow-hidden border border-light-border">
                    <img src={resolveMediaUrl(existingImage)} alt="Current product" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>

            {/* ── Gallery Images ── */}
            <div className="p-4 bg-light-bg border border-light-border rounded-xl space-y-4">
              <label className="flex items-center gap-2 text-sm font-bold text-text-primary">
                <ImageIcon size={18} className="text-brand" />
                Gallery Images (Multiple)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryChange}
                className="text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-brand-dim file:text-brand hover:file:bg-brand/20"
              />
              <p className="text-xs text-text-muted">Uploading new files will append them to the gallery.</p>

              {/* New gallery previews + captions */}
              {galleryPreviews.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">New Images to Upload ({galleryPreviews.length})</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryPreviews.map((url, i) => (
                      <div key={i} className="space-y-2">
                        <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-brand/40">
                          <img src={url} className="w-full h-full object-cover" alt={`New ${i}`} />
                        </div>
                        <input
                          type="text"
                          placeholder="Caption (optional)"
                          value={galleryCaptions[i] || ''}
                          onChange={(e) => handleGalleryCaptionChange(i, e.target.value)}
                          className="input-field text-xs py-1.5"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing gallery */}
              {existingGallery.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">Existing Gallery ({existingGallery.length} on Cloudinary)</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingGallery.map((img, i) => (
                      <div key={i} className="relative group rounded-lg overflow-hidden border border-light-border aspect-video">
                        <img src={resolveMediaUrl(img.src)} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                        {img.caption && (
                          <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-2 py-1 truncate">{img.caption}</span>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteExistingGalleryItem(i)}
                          className="absolute top-1 right-1 p-1.5 bg-red-50 text-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Upload Progress Bar ───────────────────────────── */}
        {submitting && (
          <div className="card-glass p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {uploadProgress < 100 ? (
                  <Upload size={16} className="text-brand animate-bounce" />
                ) : (
                  <CheckCircle2 size={16} className="text-green-500" />
                )}
                <span className="text-sm font-semibold text-text-primary">
                  {uploadProgress < 100 ? 'Uploading to Cloudinary…' : 'Processing on server…'}
                </span>
              </div>
              <span className="text-sm font-bold text-brand">{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 bg-light-bg rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand to-brand/60 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4 pb-10">
          <button type="button" onClick={() => navigate('/products')} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={submitting} className="btn-primary w-40 flex justify-center">
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;