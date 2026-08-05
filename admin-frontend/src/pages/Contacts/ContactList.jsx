import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Loader2, Trash2, Edit2, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const fetchContacts = async () => {
    try {
      const res = await api.get('/admin/contacts');
      setContacts(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await api.delete(`/admin/contacts/${id}`);
      toast.success('Contact deleted');
      setContacts(contacts.filter(c => c._id !== id));
    } catch (err) {
      toast.error('Failed to delete contact');
    }
  };

  const startEdit = (contact) => {
    setEditingId(contact._id);
    setEditStatus(contact.status);
    setEditNotes(contact.adminNotes || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id) => {
    try {
      const res = await api.put(`/admin/contacts/${id}`, {
        status: editStatus,
        adminNotes: editNotes
      });
      toast.success('Contact updated');
      setContacts(contacts.map(c => c._id === id ? res.data.data : c));
      setEditingId(null);
    } catch (err) {
      toast.error('Failed to update contact');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 text-brand animate-spin" /></div>;
  }

  return (
    <div className="card-glass overflow-hidden page-enter">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-light-hover/50 border-b border-light-border">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Date</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Details</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Message</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Status & Notes</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-text-muted text-sm">No inquiries found.</td>
              </tr>
            ) : (
              contacts.map((contact) => (
                <tr key={contact._id} className="border-b border-light-border hover:bg-light-hover/30 transition-colors">
                  <td className="px-6 py-5 align-top">
                    <div className="flex items-center gap-2 text-text-secondary text-sm">
                      <Clock size={14} />
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-5 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-text-primary">{contact.fullName}</span>
                      <a href={`mailto:${contact.email}`} className="text-sm text-brand hover:underline">{contact.email}</a>
                      {contact.phone && <span className="text-sm text-text-secondary">{contact.phone}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-5 align-top max-w-xs">
                    <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">{contact.message}</p>
                    {contact.services?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {contact.services.map((s, i) => (
                          <span key={i} className="px-2 py-1 rounded bg-light-bg text-[10px] uppercase tracking-wider text-text-muted border border-light-border">{s}</span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5 align-top min-w-[250px]">
                    {editingId === contact._id ? (
                      <div className="flex flex-col gap-3">
                        <select 
                          className="input-field py-2 text-xs"
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </select>
                        <textarea
                          className="input-field text-xs min-h-[60px] py-2"
                          placeholder="Admin notes..."
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                        ></textarea>
                        <div className="flex gap-2">
                          <button onClick={() => saveEdit(contact._id)} className="btn-primary py-2 px-3 text-[10px]">Save</button>
                          <button onClick={cancelEdit} className="btn-secondary py-2 px-3 text-[10px]">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-start gap-2">
                        <span className={`badge badge-${contact.status}`}>{contact.status}</span>
                        {contact.adminNotes && (
                          <p className="text-xs text-text-secondary italic bg-light-bg p-2 rounded-md border border-light-border w-full">
                            {contact.adminNotes}
                          </p>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5 align-top text-right">
                    {editingId !== contact._id && (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => startEdit(contact)}
                          className="p-2 text-text-secondary hover:text-brand bg-light-bg rounded-lg border border-light-border transition-colors"
                          title="Edit Status"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(contact._id)}
                          className="p-2 text-text-secondary hover:text-red-500 bg-light-bg rounded-lg border border-light-border transition-colors"
                          title="Delete Inquiry"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactList;
