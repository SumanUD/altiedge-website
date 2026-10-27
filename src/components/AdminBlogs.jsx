'use client';
import { useState, useEffect } from 'react';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [editBlog, setEditBlog] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Fetch all blogs from backend
  const fetchBlogs = async () => {
    const res = await fetch('/api/blog');
    const data = await res.json();
    setBlogs(data);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Handle form submit for add and edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editBlog) {
      // Update blog
      await fetch('/api/blog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editBlog.id, title, content }),
      });
      setEditBlog(null);
    } else {
      // Add new blog
      await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
    }
    setTitle('');
    setContent('');
    fetchBlogs();
  };

  // Edit button handler - populate form fields
  const handleEdit = (blog) => {
    setEditBlog(blog);
    setTitle(blog.title);
    setContent(blog.content);
  };

  // Cancel edit and clear form
  const handleCancel = () => {
    setEditBlog(null);
    setTitle('');
    setContent('');
  };

  // Delete blog
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      await fetch('/api/blog', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchBlogs();
    }
  };

return (
  <div className="container" style={{ marginTop: 50 }}>
    <h2>{editBlog ? 'Edit Blog' : 'Add Blog'}</h2>
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label>Title:</label>
        <input 
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="input"
        />
      </div>
      <div className="form-group">
        <label>Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="textarea"
        />
      </div>
      <button type="submit" className="btn primary">{editBlog ? 'Update' : 'Add'}</button>
      {editBlog && 
        <button type="button" onClick={handleCancel} className="btn secondary">Cancel</button>
      }
    </form>

    <h2>Existing Blogs</h2>
    <table className="blogs-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Content</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {blogs.map((blog) => (
          <tr key={blog.id}>
            <td>{blog.title}</td>
            <td>{blog.content}</td>
            <td>
              <button onClick={() => handleEdit(blog)} className="btn primary small">Edit</button>
              <button onClick={() => handleDelete(blog.id)} className="btn secondary small">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <style jsx>{`
      .container {
        max-width: 800px;
        margin: 20px auto;
        font-family: Arial, sans-serif;
      }
      .form {
        background-color: #f7f7f7;
        padding: 20px;
        margin-bottom: 30px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
      }
      .form-group {
        margin-bottom: 15px;
      }
      label {
        display: block;
        font-weight: bold;
        margin-bottom: 5px;
      }
      .input, .textarea {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      .textarea {
        resize: vertical;
        min-height: 80px;
      }
      .btn {
        border: none;
        padding: 10px 18px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        margin-right: 8px;
        transition: background-color 0.3s ease;
      }
      .btn.primary {
        background-color: #0070f3;
        color: white;
      }
      .btn.primary:hover {
        background-color: #005bb5;
      }
      .btn.secondary {
        background-color: #888;
        color: white;
      }
      .btn.secondary:hover {
        background-color: #555;
      }
      .btn.small {
        padding: 6px 14px;
        font-size: 13px;
      }
      .blogs-table {
        width: 100%;
        border-collapse: collapse;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
      }
      .blogs-table th, 
      .blogs-table td {
        text-align: left;
        padding: 12px 15px;
        border-bottom: 1px solid #ddd;
      }
      .blogs-table th {
        background-color: #0070f3;
        color: white;
      }
      .blogs-table tr:hover {
        background-color: #f1f1f1;
      }
    `}</style>
  </div>
);

}
