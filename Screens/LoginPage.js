import { sanitizeInput } from '../utils/inputSanitizer'; // Import sanitization utility

const handleLogin = async () => {
  try {
    const sanitizedUsername = sanitizeInput(username); // Sanitize username
    const sanitizedPassword = sanitizeInput(password); // Sanitize password

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', sanitizedUsername) // Use parameterized query
      .eq('password', sanitizedPassword); // Use parameterized query

    if (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Invalid credentials');
      return;
    }

    if (data.length === 0) {
      Alert.alert('Error', 'Invalid username or password');
      return;
    }

    // ...existing code...
  } catch (err) {
    console.error('Unexpected error:', err);
    Alert.alert('Error', 'An unexpected error occurred');
  }
};
