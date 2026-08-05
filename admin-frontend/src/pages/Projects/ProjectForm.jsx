import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import { Loader2, ArrowLeft, Image as ImageIcon, Video, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { resolveMediaUrl } from '../../utils/media';

const ProjectForm = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    concept: '',
    role: '',
    industry: '',
    order: 0,
    isActive: true,
  });

  const [projectImage, setProjectImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [projectVideos, setProjectVideos] = useState([]);

  // For previewing existing items
  const [existingImage, setExistingImage] = useState('');
  const [existingGallery, setExistingGallery] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);

  useEffect(() => {
    if (isEditing) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await api.get(`/admin/projects/${id}`);
      const p = res.data.data;
      setFormData({
        title: p.title,
        category: p.category,
        description: p.description,
        concept: p.concept || '',
        role: p.role || '',
        industry: p.industry || '',
        order: p.order || 0,
        isActive: p.isActive,
      });
      setExistingImage(p.image);
      setExistingGallery(p.gallery || []);
      setExistingVideos(p.videos || []);
    } catch (err) {
      toast.error('Failed to load project');
      navigate('/projects');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      if (projectImage) data.append('projectImage', projectImage);
      
      galleryImages.forEach(file => {
        data.append('galleryImages', file);
      });
      
      projectVideos.forEach(file => {
        data.append('projectVideos', file);
      });

      if (isEditing) {
        await api.put(`/admin/projects/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Project updated successfully');
      } else {
        await api.post('/admin/projects', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Project created successfully');
      }
      navigate('/projects');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save project');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteExistingGalleryItem = async (index) => {
    if(!window.confirm('Delete this image?')) return;
    try {
      await api.delete(`/admin/projects/${id}/gallery/${index}`);
      setExistingGallery(prev => prev.filter((_, i) => i !== index));
      toast.success('Image removed');
    } catch(err) {
      toast.error('Failed to remove image');
    }
  }

  const deleteExistingVideo = async (index) => {
    if(!window.confirm('Delete this video?')) return;
    try {
      await api.delete(`/admin/projects/${id}/videos/${index}`);
      setExistingVideos(prev => prev.filter((_, i) => i !== index));
      toast.success('Video removed');
    } catch(err) {
      toast.error('Failed to remove video');
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 text-brand animate-spin" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 page-enter">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/projects')} className="p-2 bg-light-card border border-light-border rounded-xl text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold tracking-tight text-text-primary">
          {isEditing ? `Edit Project: ${formData.title}` : 'Create New Project'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="card-glass p-8 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand border-b border-light-border pb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2">Project Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="input-field" required />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2">Category / Department *</label>
              <input type="text" name="category" value={formData.category} onChange={handleInputChange} className="input-field" required placeholder="e.g. Architectural Models" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2">Description *</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} className="input-field min-h-[100px]" required></textarea>
            </div>
          </div>
        </div>

        <div className="card-glass p-8 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand border-b border-light-border pb-4">Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2">Concept & Objectives</label>
              <textarea name="concept" value={formData.concept} onChange={handleInputChange} className="input-field min-h-[80px]"></textarea>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2">My Role</label>
              <input type="text" name="role" value={formData.role} onChange={handleInputChange} className="input-field" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2">Industry</label>
              <input type="text" name="industry" value={formData.industry} onChange={handleInputChange} className="input-field" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2">Display Order</label>
              <input type="number" name="order" value={formData.order} onChange={handleInputChange} className="input-field" />
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer mt-6">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="w-5 h-5 accent-brand rounded" />
                <span className="text-sm font-semibold text-text-primary">Project is Active (Visible to public)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="card-glass p-8 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand border-b border-light-border pb-4">Media Uploads</h3>
          
          <div className="space-y-6">
            {/* Main Image */}
            <div className="p-4 bg-light-bg border border-light-border rounded-xl">
              <label className="flex items-center gap-2 text-sm font-bold text-text-primary mb-4"><ImageIcon size={18} className="text-brand" /> Main Cover Image {isEditing ? '' : '*'}</label>
              <input type="file" accept="image/*" onChange={(e) => setProjectImage(e.target.files[0])} className="text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-brand-dim file:text-brand hover:file:bg-brand/20" />
              {existingImage && !projectImage && (
                <div className="mt-4 w-40 h-24 rounded-lg overflow-hidden border border-light-border">
                  <img src={resolveMediaUrl(existingImage)} alt="Current cover" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Gallery Images */}
            <div className="p-4 bg-light-bg border border-light-border rounded-xl">
              <label className="flex items-center gap-2 text-sm font-bold text-text-primary mb-4"><ImageIcon size={18} className="text-brand" /> Gallery Images (Multiple)</label>
              <input type="file" accept="image/*" multiple onChange={(e) => setGalleryImages(Array.from(e.target.files))} className="text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-brand-dim file:text-brand hover:file:bg-brand/20" />
              <p className="text-xs text-text-muted mt-2">Uploading new files will append them to the gallery.</p>
              
              {existingGallery.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingGallery.map((img, i) => (
                    <div key={i} className="relative group rounded-lg overflow-hidden border border-light-border aspect-video">
                      <img src={resolveMediaUrl(img.src)} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => deleteExistingGalleryItem(i)} className="absolute top-1 right-1 p-1.5 bg-red-50 text-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Videos */}
            <div className="p-4 bg-light-bg border border-light-border rounded-xl">
              <label className="flex items-center gap-2 text-sm font-bold text-text-primary mb-4"><Video size={18} className="text-brand" /> Project Videos (Multiple)</label>
              <input type="file" accept="video/*" multiple onChange={(e) => setProjectVideos(Array.from(e.target.files))} className="text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-brand-dim file:text-brand hover:file:bg-brand/20" />
              <p className="text-xs text-text-muted mt-2">Video files only (.mp4, .webm).</p>

              {existingVideos.length > 0 && (
                <div className="mt-4 flex flex-col gap-3">
                  {existingVideos.map((vid, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-light-card border border-light-border rounded-lg">
                      <span className="text-xs font-mono text-text-secondary truncate max-w-xs">{vid.src.split('/').pop()}</span>
                      <button type="button" onClick={() => deleteExistingVideo(i)} className="p-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pb-10">
          <button type="button" onClick={() => navigate('/projects')} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={submitting} className="btn-primary w-40 flex justify-center">
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
