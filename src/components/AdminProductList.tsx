'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminProductsPage({ 
  products, 
  onAdd, 
  onDelete, 
  onTogglePublish 
}: { 
  products: any[], 
  onAdd: (formData: FormData) => Promise<void>, 
  onDelete: (id: string) => Promise<void>,
  onTogglePublish: (id: string, current: boolean) => Promise<void>
}) {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const resp = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await resp.json();
      if (data.success) {
        setImageUrl(data.url);
      }
    } catch (err) {
      console.error('File upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "4rem 1.5rem", minHeight: "80vh" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ margin: 0 }}>Product Management</h1>
        <Link href="/admin" className="btn-outline">Back to Dashboard</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        {/* Product List */}
        <div style={{ backgroundColor: "var(--surface-color)", padding: "2rem", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
          <h2 style={{ marginBottom: "1.5rem", color: "var(--eco-green-dark)" }}>Current Products</h2>
          {products.length === 0 ? (
            <p style={{ color: "var(--eco-earth)" }}>No products added yet.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
                  <th style={{ padding: "1rem 0" }}>Status</th>
                  <th style={{ padding: "1rem 0" }}>Name</th>
                  <th style={{ padding: "1rem 0" }}>Price</th>
                  <th style={{ padding: "1rem 0" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} style={{ borderBottom: "1px solid var(--border-color)", opacity: product.isPublished ? 1 : 0.6 }}>
                    <td style={{ padding: "1rem 0" }}>
                      <button 
                        onClick={() => onTogglePublish(product.id, product.isPublished)}
                        style={{ 
                          padding: '0.3rem 0.6rem', 
                          fontSize: '0.8rem', 
                          borderRadius: '4px', 
                          border: 'none',
                          cursor: 'pointer',
                          backgroundColor: product.isPublished ? '#4CAF50' : '#888',
                          color: 'white'
                        }}
                      >
                        {product.isPublished ? 'Live' : 'Draft'}
                      </button>
                    </td>
                    <td style={{ padding: "1rem 0", fontWeight: "500" }}>{product.name}</td>
                    <td style={{ padding: "1rem 0" }}>${product.price.toFixed(2)}</td>
                    <td style={{ padding: "1rem 0" }}>
                      <button 
                        onClick={() => onDelete(product.id)}
                        style={{ color: '#ff4d4d', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Add Product Form */}
        <div style={{ backgroundColor: "var(--surface-color)", padding: "2rem", borderRadius: "12px", border: "1px solid var(--border-color)", height: 'fit-content' }}>
          <h2 style={{ marginBottom: "1.5rem", color: "var(--eco-green-dark)" }}>Add New Product</h2>
          <form action={async (fd) => {
            if (imageUrl) fd.set('image', imageUrl);
            await onAdd(fd);
            setImageUrl('');
          }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Product Name</label>
              <input name="name" required placeholder="Name" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Price ($)</label>
              <input name="price" type="number" step="0.01" required placeholder="0.00" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Product Image</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  name="image" 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="URL or Upload" 
                  style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)' }} 
                />
                <label className="btn-outline" style={{ cursor: 'pointer', padding: '0.8rem', display: 'flex', alignItems: 'center' }}>
                  {uploading ? '...' : 'Browse'}
                  <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
              <input type="checkbox" name="isPublished" id="isPublished" defaultChecked />
              <label htmlFor="isPublished" style={{ fontSize: '0.9rem' }}>Publish Immediately</label>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}>Publish Product</button>
          </form>
        </div>
      </div>
    </div>
  );
}
