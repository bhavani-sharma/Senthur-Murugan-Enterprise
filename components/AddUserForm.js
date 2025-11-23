import { sanitizeInput } from '../utils/inputSanitizer';

// ...existing code...

const handleSubmit = (event) => {
  event.preventDefault();
  
  const sanitizedEmail = sanitizeInput(formData.email);
  const sanitizedName = sanitizeInput(formData.name);
  
  const sanitizedData = {
    ...formData,
    email: sanitizedEmail,
    name: sanitizedName,
  };

  // Pass sanitizedData to the API or further processing
  submitUser(sanitizedData);
};

// ...existing code...
