// pages/api/petitions/list.ts
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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, error } = await supabase
    .from('petitions')
    .select(`
      *,
      creator:users(email, full_name)
    `);


    if (error) throw error;

    return res.status(200).json({ petitions: data });
  } catch (error) {
    console.error('Error fetching petitions:', error);
    return res.status(500).json({ error: 'Failed to fetch petitions' });
  }
}