// pages/api/petitions.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { title, content } = req.body;
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = JSON.parse(authHeader.replace('Bearer ', ''));

      // Insert the petition
      const { data, error } = await supabase
        .from('petitions')
        .insert({
          title,
          content,
          creator_id: user.id,
          status: 'open'
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: error.message });
      }

      // Fetch the creator details
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email, full_name')
        .eq('id', user.id)
        .single();

      if (userError) {
        console.error('User fetch error:', userError);
        return res.status(500).json({ error: userError.message });
      }

      // Combine petition and user data
      const petitionWithUser = {
        ...data,
        creator: userData
      };

      return res.status(201).json(petitionWithUser);
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Failed to create petition' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}