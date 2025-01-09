'use client'

import { useState } from 'react'
import styles from './dashboard.module.css'

// Mock data for petitions
const mockPetitions = [
  { id: 1, title: "Improve Public Transportation", status: "open", signatures: 1500 },
  { id: 2, title: "Increase Funding for Education", status: "closed", signatures: 5000 },
  { id: 3, title: "Implement Green Energy Initiatives", status: "open", signatures: 3200 },
]

export default function DashboardPage() {
  const [newPetitionTitle, setNewPetitionTitle] = useState('')
  const [newPetitionContent, setNewPetitionContent] = useState('')

  const handleCreatePetition = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the new petition data to your backend
    console.log({ title: newPetitionTitle, content: newPetitionContent })
    // Reset form fields
    setNewPetitionTitle('')
    setNewPetitionContent('')
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>Shangri-La Petitions Platform</h1>
      </header>
      <main className={styles.main}>
        <div className={styles.dashboard}>
          <h2 className={styles.title}>Petitioner Dashboard</h2>
          
          <section className={styles.createPetition}>
            <h3>Create a New Petition</h3>
            <form onSubmit={handleCreatePetition}>
              <div className={styles.formGroup}>
                <label htmlFor="petitionTitle">Petition Title</label>
                <input
                  id="petitionTitle"
                  type="text"
                  value={newPetitionTitle}
                  onChange={(e) => setNewPetitionTitle(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="petitionContent">Petition Content</label>
                <textarea
                  id="petitionContent"
                  value={newPetitionContent}
                  onChange={(e) => setNewPetitionContent(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className={styles.button}>Create Petition</button>
            </form>
          </section>

          <section className={styles.petitionList}>
            <h3>All Petitions</h3>
            <ul>
              {mockPetitions.map(petition => (
                <li key={petition.id} className={styles.petitionItem}>
                  <h4>{petition.title}</h4>
                  <p>Status: {petition.status}</p>
                  <p>Signatures: {petition.signatures}</p>
                  {petition.status === "open" && (
                    <button className={styles.signButton}>Sign Petition</button>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2023 Shangri-La Parliament. All rights reserved.</p>
      </footer>
    </div>
  )
}

