'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import styles from './signup.module.css'

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  dateOfBirth: z.date({
    required_error: 'Date of birth is required',
  }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  bioId: z.string().regex(/^\d{10}$/, { message: 'BioID must be a 10-digit number' }),
})

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
      bioId: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    // Here you would typically send the form data to your backend
    console.log(values)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    router.push('/signup-success') // Redirect to a success page
  }

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupForm}>
        <h2 className={styles.title}>Sign Up</h2>
        <p className={styles.subtitle}>Register to create or sign petitions</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={styles.input}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className={styles.errorMessage}>{errors.email.message}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="fullName" className={styles.label}>Full Name</label>
            <input
              id="fullName"
              {...register('fullName')}
              className={styles.input}
              placeholder="John Doe"
            />
            {errors.fullName && (
              <p className={styles.errorMessage}>{errors.fullName.message}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="dateOfBirth" className={styles.label}>Date of Birth</label>
            <input
              id="dateOfBirth"
              type="date"
              {...register('dateOfBirth', { 
                setValueAs: (v) => v ? new Date(v) : undefined 
              })}
              className={styles.input}
            />
            {errors.dateOfBirth && (
              <p className={styles.errorMessage}>{errors.dateOfBirth.message}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className={styles.input}
            />
            {errors.password && (
              <p className={styles.errorMessage}>{errors.password.message}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="bioId" className={styles.label}>Biometric ID (BioID)</label>
            <input
              id="bioId"
              {...register('bioId')}
              className={styles.input}
              placeholder="1234567890"
            />
            {errors.bioId && (
              <p className={styles.errorMessage}>{errors.bioId.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`${styles.button} ${isLoading ? styles.loading : ''}`}
          >
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <p className={styles.loginLink}>
          Already have an account?{' '}
          <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  )
}

