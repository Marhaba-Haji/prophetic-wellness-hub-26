const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with hardcoded values from the project
const SUPABASE_URL = "https://zywvlznelzpoixnrzwqk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5d3Zsem5lbHpwb2l4bnJ6d3FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTE4NTgsImV4cCI6MjA2MzcyNzg1OH0.YiM6sMBADoUVw4hIQgEUP1KxJNnxPpPszd5JrtaZn8w";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Dummy data generator
const generateDummyData = () => {
  const dummyNames = [
    'TEST Dummy John Smith',
    'TEST Dummy Jane Doe',
    'TEST Dummy Mike Johnson',
    'TEST Dummy Sarah Wilson',
    'TEST Dummy David Brown',
    'TEST Dummy Lisa Davis',
    'TEST Dummy Robert Miller',
    'TEST Dummy Jennifer Garcia'
  ];

  const dummySubjects = [
    'TEST Dummy inquiry about services',
    'TEST Dummy question about treatments',
    'TEST Dummy request for information',
    'TEST Dummy consultation request',
    'TEST Dummy appointment inquiry',
    'TEST Dummy general question',
    'TEST Dummy service inquiry',
    'TEST Dummy treatment question'
  ];

  const dummyMessages = [
    'TEST: This is a dummy message to keep the database active. Please ignore this submission.',
    'TEST: Dummy message: This is an automated submission to maintain database activity.',
    'TEST: Dummy contact form submission for database maintenance purposes.',
    'TEST: This is a dummy inquiry to prevent database inactivity. Please disregard.',
    'TEST: Dummy message: Automated submission to keep Supabase active.',
    'TEST: Dummy contact form data for database maintenance.',
    'TEST: This is a dummy submission to maintain database connectivity.',
    'TEST: Dummy message: Automated contact form submission for activity maintenance.'
  ];

  const randomName = dummyNames[Math.floor(Math.random() * dummyNames.length)];
  const randomSubject = dummySubjects[Math.floor(Math.random() * dummySubjects.length)];
  const randomMessage = dummyMessages[Math.floor(Math.random() * dummyMessages.length)];
  
  // Generate dummy email with timestamp to ensure uniqueness
  const timestamp = new Date().getTime();
  const dummyEmail = `test.dummy.user.${timestamp}@example.com`;

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
    
    console.log('🧪 TEST: Submitting dummy contact form data:', {
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

    console.log('✅ TEST: Dummy contact form submitted successfully!');
    console.log('📅 Timestamp:', new Date().toISOString());
    console.log('🆔 Submission ID:', data[0].id);
    
    return true;
  } catch (error) {
    console.error('❌ TEST: Error submitting dummy contact form:', error.message);
    return false;
  }
};

// Main execution function
const main = async () => {
  console.log('🧪 TEST: Auto Contact Filler Test Script Started');
  console.log('📅 Current date:', new Date().toISOString());
  console.log('⚠️  This is a TEST run - bypassing day check');
  
  const success = await submitDummyContact();
  
  if (success) {
    console.log('🎉 TEST: Script completed successfully!');
  } else {
    console.log('💥 TEST: Script failed!');
    process.exit(1);
  }
};

// Run the script
main().catch(error => {
  console.error('💥 TEST: Script execution failed:', error);
  process.exit(1);
});
