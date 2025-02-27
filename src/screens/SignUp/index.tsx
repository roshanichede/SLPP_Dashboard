import { useState, ChangeEvent } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import styles from './signup.module.css';

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    dob: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [QRCodePopup, setQRCodePopup] = useState(false);
  const [bioID, setBioID] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...formData, bioID}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      window.location.href = '/login';
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container} onClick={() => setQRCodePopup(false)}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Sign Up</h2>
        
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            className={styles.input}
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="fullName">
            Full Name
          </label>
          <input
            className={styles.input}
            id="fullName"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="dob">
            Date of Birth
          </label>
          <input
            className={styles.input}
            id="dob"
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <input
            className={styles.input}
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="bioId">
            Biometric ID
          </label>
          <input
            className={styles.input}
            id="bioId"
            type="text"
            name="bioId"
            value={bioID}
            onChange={(e) => setBioID(e.target.value)}
            required
          />
        </div>

        <button className={styles.button}>
          <span
            onClick={(e) => {
              e.stopPropagation()
              setQRCodePopup(true)
            }}>
              Scan Bio ID</span>
        </button>


        {
          QRCodePopup &&
            <div className={styles.modal}>
              {/* <span className={styles.closeIcon} onClick={() => setQRCodePopup(false)}>X</span> */}
              <div className={styles.modalContent}>
                <Scanner onScan={(result) => {
                  setBioID(result[0].rawValue);
                  setQRCodePopup(false);
                }} />
              </div>
            </div>
        }

        <button
          className={styles.button}
          type="submit"
          disabled={loading}
          style={{ marginTop: '1rem' }}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}