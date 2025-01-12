/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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


    const { data: signData, error: signError } = await supabase
      .from('signatures')
      .select('petition_id, signer_id')

    //group by petition_id and count the number of signers
    const signCountObj = signData ? signData?.reduce((acc: any, { petition_id }: { petition_id: string }) => {
      acc[petition_id] = acc[petition_id] ? acc[petition_id] + 1 : 1;
      return acc;
    }, {}) : {}

    //merge data and signCountObj to get the number of signers for each petition
    const petitions = data ? data.map((petition: any) => {
      signData?.map((sign: any) => {
        if (sign.petition_id === petition.id) {
          petition.signatures = petition.signatures || []
          petition.signatures.push(sign.signer_id || '')
        }
      })
      return {
        ...petition,
        signature_count: signCountObj[petition.id] || 0
      }
    }) : []


    if (error) throw error;

    return res.status(200).json({ petitions });
  } catch (error) {
    console.error('Error fetching petitions:', error);
    return res.status(500).json({ error: 'Failed to fetch petitions' });
  }
}