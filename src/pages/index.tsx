'use client'

import { useRouter } from 'next/router'
import styles from './Home.module.css'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Welcome to Shangri-La Petitions</h1>
        <p className={styles.subtitle}>Make your voice heard in our digital democracy</p>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h2>Create Change in Shangri-La</h2>
          <p>Join thousands of citizens who are actively shaping our nation's future through digital petitions.</p>
          
          <div className={styles.accountTypes}>
            <div className={styles.accountCard}>
              <h3>Petitioner Account</h3>
              <p>Create and sign petitions, track their progress</p>
              <div className={styles.cardButtons}>
                <button 
                  onClick={() => router.push('/signup')} 
                  className={styles.primaryButton}
                >
                  Sign Up as Petitioner
                </button>
                <button 
                  onClick={() => router.push('/login?type=petitioner')} 
                  className={styles.secondaryButton}
                >
                  Login as Petitioner
                </button>
              </div>
            </div>

            <div className={styles.accountCard}>
              <h3>Committee Account</h3>
              <p>Review and process submitted petitions</p>
              <div className={styles.cardButtons}>
                <button 
                  onClick={() => router.push('/login?type=committee')} 
                  className={styles.primaryButton}
                >
                  Login as Committee Member
                </button>
              </div>
            </div>
          </div>

          <button 
            onClick={() => router.push('/dashboard')} 
            className={styles.viewPetitionsButton}
          >
            View Public Petitions
          </button>
        </section>

        <section className={styles.features}>
          <div className={styles.feature}>
            <h3>Create Petitions</h3>
            <p>Start your own petition and gather support for causes you care about.</p>
          </div>
          <div className={styles.feature}>
            <h3>Sign & Support</h3>
            <p>Browse and sign petitions that align with your values.</p>
          </div>
          <div className={styles.feature}>
            <h3>Track Progress</h3>
            <p>Monitor the impact of your petitions in real-time.</p>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 Shangri-La Parliament. All rights reserved.</p>
      </footer>
    </div>
  )
}
