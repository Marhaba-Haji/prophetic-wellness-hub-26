const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with hardcoded values from the project
const SUPABASE_URL = "https://zywvlznelzpoixnrzwqk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5d3Zsem5lbHpwb2l4bnJ6d3FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTE4NTgsImV4cCI6MjA2MzcyNzg1OH0.YiM6sMBADoUVw4hIQgEUP1KxJNnxPpPszd5JrtaZn8w";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Dummy data generator
const generateDummyData = () => {
  const dummyNames = [
    'Dummy John Smith',
    'Dummy Jane Doe',
    'Dummy Mike Johnson',
    'Dummy Sarah Wilson',
    'Dummy David Brown',
    'Dummy Lisa Davis',
    'Dummy Robert Miller',
    'Dummy Jennifer Garcia'
  ];

  const dummySubjects = [
    'Dummy inquiry about services',
    'Dummy question about treatments',
    'Dummy request for information',
    'Dummy consultation request',
    'Dummy appointment inquiry',
    'Dummy general question',
    'Dummy service inquiry',
    'Dummy treatment question'
  ];

  const dummyMessages = [
    'This is a dummy message to keep the database active. Please ignore this submission.',
    'Dummy message: This is an automated submission to maintain database activity.',
    'Dummy contact form submission for database maintenance purposes.',
    'This is a dummy inquiry to prevent database inactivity. Please disregard.',
    'Dummy message: Automated submission to keep Supabase active.',
    'Dummy contact form data for database maintenance.',
    'This is a dummy submission to maintain database connectivity.',
    'Dummy message: Automated contact form submission for activity maintenance.'
  ];

  const randomName = dummyNames[Math.floor(Math.random() * dummyNames.length)];
  const randomSubject = dummySubjects[Math.floor(Math.random() * dummySubjects.length)];
  const randomMessage = dummyMessages[Math.floor(Math.random() * dummyMessages.length)];
  
  // Generate dummy email with timestamp to ensure uniqueness
  const timestamp = new Date().getTime();
  const dummyEmail = `dummy.user.${timestamp}@example.com`;

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
    
    console.log('Submitting dummy contact form data:', {
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

    console.log('✅ Dummy contact form submitted successfully!');
    console.log('📅 Timestamp:', new Date().toISOString());
    console.log('🆔 Submission ID:', data[0].id);
    
    return true;
  } catch (error) {
    console.error('❌ Error submitting dummy contact form:', error.message);
    return false;
  }
};

// Check if today is Tuesday or Saturday
const isScheduledDay = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 2 = Tuesday, 6 = Saturday
  
  return dayOfWeek === 2 || dayOfWeek === 6; // Tuesday or Saturday
};

// Main execution function
const main = async () => {
  console.log('🤖 Auto Contact Filler Script Started');
  console.log('📅 Current date:', new Date().toISOString());
  
  if (!isScheduledDay()) {
    console.log('⏭️  Not a scheduled day (Tuesday/Saturday). Skipping...');
    return;
  }
  
  console.log('✅ Today is a scheduled day. Proceeding with dummy submission...');
  
  const success = await submitDummyContact();
  
  if (success) {
    console.log('🎉 Script completed successfully!');
  } else {
    console.log('💥 Script failed!');
    process.exit(1);
  }
};

// Run the script
main().catch(error => {
  console.error('💥 Script execution failed:', error);
  process.exit(1);
});
