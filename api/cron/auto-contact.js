import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const SUPABASE_URL = "https://zywvlznelzpoixnrzwqk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5d3Zsem5lbHpwb2l4bnJ6d3FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTE4NTgsImV4cCI6MjA2MzcyNzg1OH0.YiM6sMBADoUVw4hIQgEUP1KxJNnxPpPszd5JrtaZn8w";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Dummy data generator
const generateDummyData = () => {
  const dummyNames = [
    'CLOUD Dummy John Smith',
    'CLOUD Dummy Jane Doe',
    'CLOUD Dummy Mike Johnson',
    'CLOUD Dummy Sarah Wilson',
    'CLOUD Dummy David Brown',
    'CLOUD Dummy Lisa Davis',
    'CLOUD Dummy Robert Miller',
    'CLOUD Dummy Jennifer Garcia'
  ];

  const dummySubjects = [
    'CLOUD Dummy inquiry about services',
    'CLOUD Dummy question about treatments',
    'CLOUD Dummy request for information',
    'CLOUD Dummy consultation request',
    'CLOUD Dummy appointment inquiry',
    'CLOUD Dummy general question',
    'CLOUD Dummy service inquiry',
    'CLOUD Dummy treatment question'
  ];

  const dummyMessages = [
    'CLOUD: This is a dummy message to keep the database active. Please ignore this submission.',
    'CLOUD: Dummy message: This is an automated submission to maintain database activity.',
    'CLOUD: Dummy contact form submission for database maintenance purposes.',
    'CLOUD: This is a dummy inquiry to prevent database inactivity. Please disregard.',
    'CLOUD: Dummy message: Automated submission to keep Supabase active.',
    'CLOUD: Dummy contact form data for database maintenance.',
    'CLOUD: This is a dummy submission to maintain database connectivity.',
    'CLOUD: Dummy message: Automated contact form submission for activity maintenance.'
  ];

  const randomName = dummyNames[Math.floor(Math.random() * dummyNames.length)];
  const randomSubject = dummySubjects[Math.floor(Math.random() * dummySubjects.length)];
  const randomMessage = dummyMessages[Math.floor(Math.random() * dummyMessages.length)];
  
  // Generate dummy email with timestamp to ensure uniqueness
  const timestamp = new Date().getTime();
  const dummyEmail = `cloud.dummy.user.${timestamp}@example.com`;

  return {
    name: randomName,
    email: dummyEmail,
    subject: randomSubject,
    message: randomMessage
  };
};

// Submit dummy contact form data
const submitDummyContact = async () => {
  try {
    const dummyData = generateDummyData();
    
    console.log('☁️ CLOUD: Submitting dummy contact form data:', {
      name: dummyData.name,
      email: dummyData.email,
      subject: dummyData.subject,
      message: dummyData.message.substring(0, 50) + '...'
    });

    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([dummyData])
      .select();

    if (error) {
      throw error;
    }

    console.log('✅ CLOUD: Dummy contact form submitted successfully!');
    console.log('📅 Timestamp:', new Date().toISOString());
    console.log('🆔 Submission ID:', data[0].id);
    
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('❌ CLOUD: Error submitting dummy contact form:', error.message);
    return { success: false, error: error.message };
  }
};

// Check if today is Tuesday or Saturday
const isScheduledDay = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 2 = Tuesday, 6 = Saturday
  
  return dayOfWeek === 2 || dayOfWeek === 6; // Tuesday or Saturday
};

export default async function handler(req, res) {
  // Only allow POST requests (for cron jobs)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('🤖 CLOUD: Auto Contact Filler Cron Job Started');
  console.log('📅 Current date:', new Date().toISOString());
  
  if (!isScheduledDay()) {
    console.log('⏭️ CLOUD: Not a scheduled day (Tuesday/Saturday). Skipping...');
    return res.status(200).json({ 
      message: 'Not a scheduled day (Tuesday/Saturday). Skipping...',
      scheduled: false 
    });
  }
  
  console.log('✅ CLOUD: Today is a scheduled day. Proceeding with dummy submission...');
  
  const result = await submitDummyContact();
  
  if (result.success) {
    console.log('🎉 CLOUD: Script completed successfully!');
    return res.status(200).json({
      message: 'Dummy contact form submitted successfully',
      success: true,
      data: result.data,
      timestamp: new Date().toISOString()
    });
  } else {
    console.log('💥 CLOUD: Script failed!');
    return res.status(500).json({
      message: 'Failed to submit dummy contact form',
      success: false,
      error: result.error,
      timestamp: new Date().toISOString()
    });
  }
}
