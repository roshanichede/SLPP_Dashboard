import { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';

export default function PetitionerDashboard() {
  const [petitions, setPetitions] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [signedPetitions, setSignedPetitions] = useState(new Set());

  useEffect(() => {
    fetchPetitions();
    fetchSignedPetitions();
  }, []);

  const fetchPetitions = async () => {
    try {
      const response = await fetch('/api/petitions');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch petitions');
      }
      
      setPetitions(data.petitions);
    } catch (err) {
      setError('Failed to load petitions');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSignedPetitions = async () => {
    try {
      const response = await fetch('/api/petitions/signed');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error);
      }
      
      setSignedPetitions(new Set(data.signedPetitions));
    } catch (err) {
      console.error('Error fetching signed petitions:', err);
    }
  };

  const handleCreatePetition = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/petitions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create petition');
      }

      // Reset form and refresh petitions
      setFormData({ title: '', content: '' });
      setShowCreateForm(false);
      fetchPetitions();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignPetition = async (petitionId) => {
    try {
      const response = await fetch(`/api/petitions/${petitionId}/sign`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign petition');
      }

      // Update signed petitions and refresh list
      setSignedPetitions(prev => new Set([...prev, petitionId]));
      fetchPetitions();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Petitioner Dashboard</h1>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className={styles.button}
        >
          {showCreateForm ? 'Cancel' : 'Create New Petition'}
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {showCreateForm && (
        <form onSubmit={handleCreatePetition} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Petition Title
            </label>
            <input
              className={styles.input}
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Petition Content
            </label>
            <textarea
              className={styles.textarea}
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              required
            />
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.button}>
              Submit Petition
            </button>
          </div>
        </form>
      )}

      <div className={styles.petitionsList}>
        {petitions.map((petition) => (
          <div key={petition.id} className={styles.petitionCard}>
            <h2 className={styles.petitionTitle}>{petition.title}</h2>
            <p className={styles.petitionContent}>{petition.content}</p>
            
            <div className={styles.metaInfo}>
              <span>Status: {petition.status}</span>
              <span>Signatures: {petition.signatures}</span>
            </div>

            {petition.status === 'open' && !signedPetitions.has(petition.id) && (
              <button
                onClick={() => handleSignPetition(petition.id)}
                className={styles.secondaryButton}
              >
                Sign Petition
              </button>
            )}

            {signedPetitions.has(petition.id) && (
              <span className={styles.signedBadge}>
                ✓ You've signed this petition
              </span>
            )}

            {petition.response && (
              <div className={styles.response}>
                <h3>Committee Response:</h3>
                <p>{petition.response}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}