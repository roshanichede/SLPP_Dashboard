// pages/api/auth/sign.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {

    const authHeader = req.headers.authorization;
      
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = JSON.parse(authHeader.replace('Bearer ', ''));

    const { data, error } = await supabase
      .from('signatures')
      .insert({
        signer_id: user.id,
        petition_id: req.body.petitionId
      })
      .select()
      .single();


    if (error) throw error;

    return res.status(200).json({ petitions: data });
  } catch (error) {
    console.error('Error fetching petitions:', error);
    return res.status(500).json({ error: 'Failed to fetch petitions' });
  }
}