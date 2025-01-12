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
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {

    if (req.body.userRole !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('petitions')
      .update({
        response: req.body.response,
        status: 'closed'
      })
      .eq('id', req.body.petitionId)
      .select()


    if (error) throw error;

    return res.status(200).json({ data });
  } catch (error) {
    console.error('Error fetching petitions:', error);
    return res.status(500).json({ error: 'Failed to fetch petitions' });
  }
}