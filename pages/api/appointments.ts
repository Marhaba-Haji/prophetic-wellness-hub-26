
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../src/integrations/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const appointmentData = req.body;

    const { error } = await supabase
      .from('appointments')
      .insert({
        ...appointmentData,
        status: 'pending',
      });

    if (error) throw error;

    res.status(200).json({ message: 'Appointment booked successfully' });
  } catch (error) {
    console.error('Appointment booking error:', error);
    res.status(500).json({ message: 'Failed to book appointment' });
  }
}
