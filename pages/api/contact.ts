import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/integrations/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    const { error } = await supabase
      .from('contact_submissions')
      .insert({
        name,
        email,
        subject,
        message,
      });

    if (error) throw error;

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
}