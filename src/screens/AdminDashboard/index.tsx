import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePetitionStore, Petition } from '@/stores/usePetitionStore';
import styles from './CommitteeDashboard.module.css';
import { useRouter } from 'next/router';

export default function CommitteeDashboard() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const { petitions, fetchPetitions } = usePetitionStore();

  const [thresholdValue, setThresholdValue] = useState(1000);
  const [selectedPetition, setSelectedPetition] = useState(null);
  const [response, setResponse] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'responded'

  useEffect(() => {
    if (!user || user.email !== 'admin@petition.parliament.sr') {
      router.push('/login');
      return;
    }
    fetchPetitions();
  }, [user, router, fetchPetitions]);

  const handleUpdateThreshold = async () => {
    try {
      await fetch('/api/admin/threshold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threshold: thresholdValue })
      });
    } catch (error) {
      console.error('Failed to update threshold:', error);
    }
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!selectedPetition || !response) return;

    try {
      await fetch('/api/admin/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          petitionId: selectedPetition,
          response: response
        })
      });
      setSelectedPetition(null);
      setResponse('');
      fetchPetitions();
    } catch (error) {
      console.error('Failed to submit response:', error);
    }
  };

  const filteredPetitions = petitions.filter(petition => {
    switch (filter) {
      case 'pending':
        return petition.status === 'open' && petition.signature_count >= thresholdValue;
      case 'responded':
        return petition.status === 'closed';
      default:
        return true;
    }
  });

  if (!user || user.email !== 'admin@petition.parliament.sr') {
    return null;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Committee Dashboard</h1>
        <div className={styles.userSection}>
          <span className={styles.userEmail}>{user.email}</span>
          <button onClick={logout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <div className={styles.mainContent}>
        <section className={styles.thresholdSection}>
          <h2 className={styles.sectionTitle}>Signature Threshold Settings</h2>
          <div className={styles.thresholdForm}>
            <input
              type="number"
              value={thresholdValue}
              onChange={(e) => setThresholdValue(parseInt(e.target.value))}
              className={styles.thresholdInput}
              min="1"
            />
            <button 
              onClick={handleUpdateThreshold}
              className={styles.primaryButton}
            >
              Update Threshold
            </button>
          </div>
        </section>

        <section className={styles.petitionsSection}>
          <div className={styles.petitionsHeader}>
            <h2 className={styles.sectionTitle}>Manage Petitions</h2>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Petitions</option>
              <option value="pending">Pending Response</option>
              <option value="responded">Responded</option>
            </select>
          </div>

          <div className={styles.petitionsList}>
            {filteredPetitions.map((petition) => (
              <div key={petition.id} className={styles.petitionCard}>
                <h3 className={styles.petitionTitle}>{petition.title}</h3>
                <p className={styles.petitionText}>{petition.content}</p>
                <div className={styles.petitionMeta}>
                  <span className={styles.signatures}>
                    Signatures: {petition.signature_count}
                  </span>
                  <span className={`${styles.status} ${styles[petition.status]}`}>
                    Status: {petition.status}
                  </span>
                </div>
                
                {petition.status === 'open' && 
                 petition.signature_count >= thresholdValue && (
                  <button
                    onClick={() => setSelectedPetition(petition.id)}
                    className={styles.responseButton}
                  >
                    Add Response
                  </button>
                )}

                {petition.response && (
                  <div className={styles.responseBox}>
                    <strong>Official Response:</strong>
                    <p>{petition.response}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {selectedPetition && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Submit Official Response</h2>
            <form onSubmit={handleSubmitResponse}>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className={styles.responseInput}
                placeholder="Enter your official response..."
                required
              />
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setSelectedPetition(null)}
                  className={styles.secondaryButton}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.primaryButton}>
                  Submit Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}