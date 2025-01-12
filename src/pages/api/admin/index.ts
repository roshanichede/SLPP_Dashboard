// pages/api/admin/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Verify admin credentials
    if (
      email !== 'admin@petition.parliament.sr' ||
      password !== '2025%shangrila'
    ) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // Return admin user data
    return res.status(200).json({
      user: {
        email,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// pages/api/admin/threshold.ts
export async function setThreshold(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { threshold } = req.body;

    // Update the threshold in the database
    const { data, error } = await supabase
      .from('settings')
      .upsert({ key: 'signature_threshold', value: threshold })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(200).json({ message: 'Threshold updated successfully', data });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// pages/api/admin/respond.ts
export async function respondToPetition(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { petitionId, response } = req.body;

    // Update the petition with response and close it
    const { data, error } = await supabase
      .from('petitions')
      .update({
        response,
        status: 'closed',
        closed_at: new Date().toISOString()
      })
      .eq('id', petitionId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(200).json({
      message: 'Response added and petition closed successfully',
      petition: data
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}