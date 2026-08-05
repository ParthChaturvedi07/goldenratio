import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Loader2, Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { resolveMediaUrl } from '../../utils/media';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/admin/projects');
      setProjects(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project? This cannot be undone.')) return;
    try {
      await api.delete(`/admin/projects/${id}`);
      toast.success('Project deleted');
      setProjects(projects.filter(p => p._id !== id));
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 text-brand animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 page-enter">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-bold uppercase tracking-widest text-text-primary">Manage Projects</h2>
        <Link to="/projects/new" className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Project
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full card-glass p-10 text-center text-text-muted">
            No projects found. Create your first one!
          </div>
        ) : (
          projects.map((project) => (
            <div key={project._id} className="card-glass overflow-hidden flex flex-col group">
              {/* Image Header */}
              <div className="relative h-48 bg-light-hover overflow-hidden">
                <img 
                  src={resolveMediaUrl(project.image)} 
                  alt={project.title}
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
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${project.isActive ? 'bg-brand/80 text-white' : 'bg-red-500/80 text-white'}`}>
                    {project.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand mb-1">{project.category}</p>
                <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-1">{project.title}</h3>
                
                <div className="flex items-center gap-4 text-xs text-text-muted mt-auto mb-5">
                  <span className="flex items-center gap-1"><ImageIcon size={14} /> {project.gallery?.length || 0} Gallery</span>
                  <span className="flex items-center gap-1">Order: {project.order}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-light-border">
                  <Link to={`/projects/${project._id}/edit`} className="flex-1 btn-secondary flex justify-center items-center gap-2 py-2 text-xs">
                    <Edit2 size={14} /> Edit
                  </Link>
                  <button onClick={() => handleDelete(project._id)} className="flex-1 btn-danger flex justify-center items-center gap-2 py-2 text-xs">
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

export default ProjectList;
