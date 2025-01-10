// pages/api/auth/signup.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Valid BioIDs from the specification
const validBioIds = [
  'K1YL8VA2HG', '7DMPYAZAP2', 'D05HPPQNJ4', '2WYIM3QCK9', 'DHKFIYHMAZ',
  'LZK7P0X0LQ', 'H5C98XCENC', '6X6I6TSUFG', 'QTLCWUS8NB', 'Y4FC3F9ZGS',
  // ... add all other valid BioIDs
];

interface SignUpBody {
  email: string;
  fullName: string;
  dob: string;
  password: string;
  bioId: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, fullName, dob, password, bioId }: SignUpBody = req.body;

    // Input validation
    if (!email || !fullName || !dob || !password || !bioId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate BioID
    if (!validBioIds.includes(bioId)) {
      return res.status(400).json({ error: 'Invalid Biometric ID' });
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Check if BioID is already used
    const { data: existingBioId } = await supabase
      .from('users')
      .select('bio_id')
      .eq('bio_id', bioId)
      .single();

    if (existingBioId) {
      return res.status(400).json({ error: 'Biometric ID already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          full_name: fullName,
          date_of_birth: dob,
          password: hashedPassword,
          bio_id: bioId,
          role: 'petitioner'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to create user' });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    
    return res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}