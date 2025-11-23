export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  // Remove all special characters except @
  let sanitized = input.replace(/[^a-zA-Z0-9@ ]/g, '');

  // Remove restricted words like "remove" or "delete"
  const restrictedWords = ['remove', 'delete'];
  const regex = new RegExp(`\\b(${restrictedWords.join('|')})\\b`, 'gi');
  sanitized = sanitized.replace(regex, '');

  return sanitized.trim();
};
