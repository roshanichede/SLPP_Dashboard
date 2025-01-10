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

  try {
    const { id } = req.query;
    const userId = req.cookies.session;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user has already signed
    const { data: existingSignature } = await supabase
      .from('signatures')
      .select()
      .eq('petition_id', id)
      .eq('user_id', userId)
      .single();

    if (existingSignature) {
      return res.status(400).json({ error: 'You have already signed this petition' });
    }

    // Begin transaction
    const { data: signature, error: signatureError } = await supabase
      .from('signatures')
      .insert([
        {
          petition_id: id,
          user_id: userId
        }
      ]);

    if (signatureError) throw signatureError;

    // Update petition signature count
    const { error: updateError } = await supabase.rpc('increment_signatures', {
      petition_id: id
    });

    if (updateError) throw updateError;

    return res.status(200).json({ message: 'Petition signed successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to sign petition' });
  }
}