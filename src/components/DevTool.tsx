import { useState } from 'react';
import { Settings, Plus, Trash2, X } from 'lucide-react';

interface Card {
  id: string;
  name: string;
  description: string;
  icon?: string;
  link: string;
  category: 'software' | 'plugin' | 'script';
}

export default function DevTool() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    link: '',
    category: 'software' as 'software' | 'plugin' | 'script'
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Test authentication with a dummy request
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          password, 
          name: 'test', 
          description: 'test', 
          link: 'https://test.com', 
          category: 'software' 
        })
      });
      
      if (response.status === 401) {
        alert('Invalid password');
        return;
      }
      
      setIsAuthenticated(true);
      await loadCards();
    } catch (error) {
      alert('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const loadCards = async () => {
    try {
      const response = await fetch('/api/cards');
      const data = await response.json();
      setCards(data);
    } catch (error) {
      console.error('Failed to load cards:', error);
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, ...formData })
      });

      if (response.ok) {
        setFormData({ name: '', description: '', icon: '', link: '', category: 'software' });
        setShowAddForm(false);
        await loadCards();
        // Refresh the page to show new card
        window.location.reload();
      } else {
        alert('Failed to add card');
      }
    } catch (error) {
      alert('Error adding card');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (!confirm('Are you sure you want to delete this card?')) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/cards', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, id })
      });

      if (response.ok) {
        await loadCards();
        // Refresh the page to update UI
        window.location.reload();
      } else {
        alert('Failed to delete card');
      }
    } catch (error) {
      alert('Error deleting card');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="dev-tool-trigger"
        title="Developer Tools"
      >
        <div className="dev-tool-icon">
          <Settings size={18} />
        </div>
        <span className="dev-tool-text">Dev Tools</span>
        <div className="dev-tool-glow"></div>
      </button>
    );
  }

  return (
    <div className="dev-tool-overlay">
      <div className="dev-tool-container">
        {!isAuthenticated ? (
          <div className="auth-container">
            <div className="auth-header">
              <div className="auth-icon">
                <Settings size={24} />
              </div>
              <h2 className="auth-title">Developer Access</h2>
              <button onClick={() => setIsOpen(false)} className="close-button">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAuth} className="auth-form">
              <div className="form-field">
                <label className="field-label">Developer Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="field-input"
                  placeholder="Enter developer password"
                />
              </div>
              <button type="submit" disabled={loading} className="auth-button">
                {loading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <>
                    <Settings size={16} />
                    <span>Authenticate</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="dev-panel">
            <div className="panel-header">
              <div className="panel-title">
                <Settings size={20} />
                <span>Developer Panel</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="close-button">
                <X size={20} />
              </button>
            </div>

            <div className="panel-content">
              <div className="action-section">
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="add-card-button"
                >
                  <Plus size={16} />
                  <span>Add New Card</span>
                </button>
              </div>

              {showAddForm && (
                <div className="add-form-container">
                  <form onSubmit={handleAddCard} className="add-card-form">
                    <div className="form-grid">
                      <div className="form-field">
                        <label className="field-label">Name *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="field-input"
                          placeholder="Enter card name"
                        />
                      </div>
                      
                      <div className="form-field">
                        <label className="field-label">Category *</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                          className="field-input"
                        >
                          <option value="software">Software</option>
                          <option value="plugin">Plugin</option>
                          <option value="script">Script</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-field">
                      <label className="field-label">Description *</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                        rows={3}
                        className="field-input field-textarea"
                        placeholder="Enter card description"
                      />
                    </div>

                    <div className="form-field">
                      <label className="field-label">Icon URL (optional)</label>
                      <input
                        type="url"
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        className="field-input"
                        placeholder="https://example.com/icon.png"
                      />
                    </div>

                    <div className="form-field">
                      <label className="field-label">Link *</label>
                      <input
                        type="url"
                        value={formData.link}
                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        required
                        className="field-input"
                        placeholder="https://example.com"
                      />
                    </div>

                    <div className="form-actions">
                      <button type="submit" disabled={loading} className="submit-button">
                        {loading ? (
                          <div className="loading-spinner"></div>
                        ) : (
                          <>
                            <Plus size={16} />
                            <span>Add Card</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="cancel-button"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="cards-management">
                <h3 className="section-title">Manage Cards ({cards.length})</h3>
                <div className="cards-list">
                  {cards.map(card => (
                    <div key={card.id} className="card-item">
                      <div className="card-info">
                        <div className="card-name">{card.name}</div>
                        <div className="card-meta">
                          <span className={`card-category ${card.category}`}>{card.category}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="delete-button"
                        title="Delete card"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}