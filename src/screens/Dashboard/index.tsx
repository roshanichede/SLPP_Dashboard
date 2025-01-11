import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { usePetitionStore, Petition } from '../../stores/usePetitionStore';
import styles from './Dashboard.module.css';
import { useRouter } from 'next/router';

interface NewPetition {
  title: string;
  content: string;
}

export default function Dashboard() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const { petitions, isLoading, error, fetchPetitions, createPetition, signPetition } = usePetitionStore();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPetition, setNewPetition] = useState<NewPetition>({ title: '', content: '' });

  useEffect(() => {
    // Check authentication on component mount
    if (!user) {
      router.push('/login');
    } else {
      fetchPetitions();
    }
  }, [user, router, fetchPetitions]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/petitions/list');
      const data = await response.json();
      console.log('API Response:', data);
    };
    fetchData();
  }, []);

  // If no user, render nothing while redirecting
  if (!user) {
    return null;
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPetition(newPetition.title, newPetition.content);
    setNewPetition({ title: '', content: '' });
    setShowCreateForm(false);
  };

  const handleSign = async (petitionId: string) => {
    await signPetition(petitionId);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Petitioner Dashboard</h1>
        <div>
          <span className={styles.userEmail}>{user.email}</span>
          <button 
            onClick={logout}
            className={styles.logoutButton}
          >
            Logout
          </button>
        </div>
      </header>

      {error && (
        <div className={styles.error}>{error}</div>
      )}

      <div className={styles.actions}>
        <button 
          onClick={() => setShowCreateForm(true)}
          className={styles.button}
        >
          Create New Petition
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateSubmit} className={styles.form}>
          <h2 className={styles.formTitle}>Create New Petition</h2>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Title
              <input
                type="text"
                value={newPetition.title}
                onChange={e => setNewPetition(prev => ({ ...prev, title: e.target.value }))}
                className={styles.input}
                required
              />
            </label>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Content
              <textarea
                value={newPetition.content}
                onChange={e => setNewPetition(prev => ({ ...prev, content: e.target.value }))}
                className={styles.textarea}
                required
              />
            </label>
          </div>

          <div className={styles.buttonGroup}>
            <button 
              type="button" 
              onClick={() => setShowCreateForm(false)}
              className={styles.secondaryButton}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className={styles.button}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Petition'}
            </button>
          </div>
        </form>
      )}

      <div className={styles.petitionsList}>
        {isLoading ? (
          <div>Loading petitions...</div>
        ) : (
          petitions.map((petition: Petition) => (
            <div key={petition.id} className={styles.petitionCard}>
              <h3 className={styles.petitionTitle}>{petition.title}</h3>
              <p className={styles.petitionContent}>{petition.content}</p>
              
              <div className={styles.metaInfo}>
                <span>Status: {petition.status}</span>
                <span>Signatures: {petition.signature_count}</span>
                <span>Created by: {petition.petitioner?.full_name || 'Unknown'}</span>
              </div>

              {petition.status === 'open' && petition.petitioner?.email !== user?.email && (
  <button
    onClick={() => handleSign(petition.id)}
    className={styles.button}
    disabled={isLoading}
  >
    Sign Petition
  </button>
)}

              {petition.response && (
                <div className={styles.response}>
                  <strong>Official Response:</strong>
                  <p>{petition.response}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}