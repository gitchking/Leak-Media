import { useEffect, useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../lib/firebase';
import { Plus } from 'lucide-react';

export default function SubmissionForm() {
  const [user] = useAuthState(auth);
  const [dbReady, setDbReady] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  // Ensure Firestore instance is usable (handles SSR and analytics-only envs)
  useEffect(() => {
    try {
      // Touch getFirestore(app) indirectly via imported db; if it throws, we'll catch.
      if (db) setDbReady(true);
    } catch (e) {
      setDbReady(false);
    }
  }, [db]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    link: '',
    category: 'software' as 'software' | 'plugin' | 'script'
  });
  // Removed file upload flow; we'll rely on a direct URL only.
  // Removed file upload state

  async function uploadToCatbox(file: File): Promise<string> {
    // Catbox requires multipart/form-data; ensure CORS-safe path from the browser.
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('fileToUpload', file);

    let res: Response;
    try {
      res = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: formData,
        // mode: 'cors' is default; no custom headers (let browser set boundary)
      });
    } catch (networkErr: any) {
      // Network/CORS level failure
      throw new Error('Network error while uploading to Catbox. This is often a CORS or connectivity issue.');
    }

    const text = await res.text();
    if (!res.ok || !text.startsWith('http')) {
      // Provide more descriptive diagnostics inline for easier debugging
      throw new Error(
        `Catbox upload failed${text ? `: ${text.substring(0, 120)}` : ''}`
      );
    }
    return text.trim();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg(null);
    if (!user) {
      setErrMsg('You must be signed in to submit.');
      return;
    }
    if (!dbReady || !db) {
      setErrMsg('Database is not ready. Please refresh and try again.');
      return;
    }
  
    // Basic client-side validation
    const { name, description, link, category, icon } = formData;
    if (!name.trim() || !description.trim() || !link.trim()) {
      setErrMsg('Please fill all required fields.');
      return;
    }
    const safeCategory = (['software','plugin','script'] as const).includes(category) ? category : 'software';

    // Only use provided icon URL (no uploads). Optional field.
    const finalIconUrl = (icon || '').trim();
  
    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        link: link.trim(),
        category: safeCategory,
        icon: finalIconUrl,
        approved: false,
        userId: user.uid,
        userEmail: user.email || '',
        userName: user.displayName || '',
        createdAt: serverTimestamp(),
      };
  
      await addDoc(collection(db, 'submissions'), payload);
  
      // Reset form
      setFormData({
        name: '',
        description: '',
        icon: '',
        link: '',
        category: 'software'
      });
      setIsOpen(false);
      alert('Submission sent for review!');
    } catch (error: any) {
      console.error('Error submitting:', error);
      const msg: string = typeof error?.message === 'string' ? error.message : 'Unknown error';
      if (msg.toLowerCase().includes('permission') || msg.includes('permission-denied')) {
        setErrMsg('Submission failed: permission denied. Check Firestore rules and that you are signed in.');
      } else if (msg.toLowerCase().includes('missing or insufficient permissions')) {
        setErrMsg('Missing or insufficient permissions. Verify Firestore security rules.');
      } else if (msg.toLowerCase().includes('failed-precondition') || msg.toLowerCase().includes('index')) {
        setErrMsg('Firestore index/precondition issue. Ensure createdAt is set and indexes are not required for this query.');
      } else {
        setErrMsg('Error submitting. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="submission-form-container">
        <div className="bg-dark-900/80 backdrop-blur-sm border border-dark-700/50 rounded-2xl p-6 shadow-xl text-center">
          <p className="text-white mb-4">You must be signed in to submit a resource.</p>
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-xl transition-all duration-300 hover:from-primary-500 hover:to-primary-600 hover:shadow-lg hover:shadow-primary-500/25 hover:scale-105"
          >
            Go to Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="submission-form-container">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="submit-trigger-btn group relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-xl transition-all duration-300 hover:from-primary-500 hover:to-primary-600 hover:shadow-lg hover:shadow-primary-500/25 hover:scale-105 overflow-hidden"
        >
          <Plus size={20} />
          <span className="relative z-10">Submit a Resource</span>
          <div className="btn-glow absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-dark-900/80 backdrop-blur-sm border border-dark-700/50 rounded-2xl p-6 shadow-xl">
          {errMsg && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              {errMsg}
            </div>
          )}
          {!dbReady && (
            <div className="text-sm text-yellow-300 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              Connecting to database… please wait or refresh.
            </div>
          )}
          <div className="form-group">
            <label className="block text-white mb-2 text-sm font-medium">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="form-input w-full bg-dark-700/50 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
              placeholder="Resource name"
            />
          </div>

          <div className="form-group">
            <label className="block text-white mb-2 text-sm font-medium">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="form-input w-full bg-dark-700/50 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
            >
              <option value="software">Software</option>
              <option value="plugin">Plugin</option>
              <option value="script">Script</option>
            </select>
          </div>

          <div className="form-group">
            <label className="block text-white mb-2 text-sm font-medium">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
              className="form-input w-full bg-dark-700/50 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 resize-none"
              placeholder="Brief description of the resource"
            />
          </div>

          <div className="form-group">
            <label className="block text-white mb-2 text-sm font-medium">Icon URL (optional)</label>
            <input
              type="url"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="form-input w-full bg-dark-700/50 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
              placeholder="https://files.catbox.moe/xxxxxx.png"
            />
            <p className="text-xs text-white/60 mt-1">
              Tip: Host your image on Catbox and paste the direct file URL (e.g. https://files.catbox.moe/...). No upload needed here.
            </p>
          </div>

          <div className="form-group">
            <label className="block text-white mb-2 text-sm font-medium">Resource Link *</label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              required
              className="form-input w-full bg-dark-700/50 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
              placeholder="https://example.com/resource"
            />
          </div>

          <div className="form-actions flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-5 py-2.5 bg-dark-700 text-dark-300 rounded-xl hover:bg-dark-600 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-xl transition-all duration-300 hover:from-primary-500 hover:to-primary-600 hover:shadow-lg hover:shadow-primary-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
