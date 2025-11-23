import { sanitizeInput } from '../utils/inputSanitizer'; // Import sanitization utility

const handleAddUser = async () => {
  try {
    const sanitizedUsername = sanitizeInput(username); // Sanitize username
    const sanitizedPassword = sanitizeInput(password); // Sanitize password
    const sanitizedEmail = sanitizeInput(email); // Sanitize email
    console.log('Sanitized Inputs:', {
      sanitizedUsername,
      sanitizedPassword,
      sanitizedEmail,
    });
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          username: sanitizedUsername, // Use sanitized input
          password: sanitizedPassword, // Use sanitized input
          email: sanitizedEmail, // Use sanitized input
        },
      ]);

    if (error) {
      console.error('Add user error:', error);
      Alert.alert('Error', 'Failed to add user');
      return;
    }

    Alert.alert('Success', 'User added successfully');
  } catch (err) {
    console.error('Unexpected error:', err);
    Alert.alert('Error', 'An unexpected error occurred');
  }
};
