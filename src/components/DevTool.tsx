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
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          password, 
          name: 'test', 
          description: 'test', 
          link: 'test', 
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
        className="dev-tool-trigger group"
        title="Developer Tools"
      >
        <Settings size={20} />
        <span>Dev Tools</span>
      </button>
    );
  }

  return (
    <div className="dev-tool-overlay">
      <div className="dev-tool-panel">
        <div className="dev-tool-header">
          <h2>Developer Tools</h2>
          <button onClick={() => setIsOpen(false)} className="close-btn">
            <X size={20} />
          </button>
        </div>

        {!isAuthenticated ? (
          <form onSubmit={handleAuth} className="auth-form">
            <div className="form-group">
              <label>Developer Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
                placeholder="Enter developer password"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Authenticating...' : 'Authenticate'}
            </button>
          </form>
        ) : (
          <div className="dev-content">
            <div className="dev-actions">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="btn-primary"
              >
                <Plus size={16} />
                Add New Card
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleAddCard} className="add-form">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="form-input"
                  >
                    <option value="software">Software</option>
                    <option value="plugin">Plugin</option>
                    <option value="script">Script</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Icon URL (optional)</label>
                  <input
                    type="url"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Link *</label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? 'Adding...' : 'Add Card'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="cards-list">
              <h3>Manage Cards ({cards.length})</h3>
              <div className="cards-grid">
                {cards.map(card => (
                  <div key={card.id} className="card-item">
                    <div className="card-info">
                      <h4>{card.name}</h4>
                      <span className="category">{card.category}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="delete-btn"
                      title="Delete card"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}