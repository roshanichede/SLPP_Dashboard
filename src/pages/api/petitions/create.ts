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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get user session from cookie
  const session = req.cookies.session;
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { title, content } = req.body;

    // Validate input
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Create petition
    const { data, error } = await supabase
      .from('petitions')
      .insert([
        {
          title,
          content,
          status: 'open',
          signatures: 0,
          user_id: session
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json(data);
  } catch (error) {
    console.error('Error creating petition:', error);
    return res.status(500).json({ error: 'Failed to create petition' });
  }
}