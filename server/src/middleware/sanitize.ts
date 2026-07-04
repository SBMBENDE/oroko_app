import mongoSanitize from 'express-mongo-sanitize';

/**
 * Strips $ and . characters from user-supplied input in body, query, and params.
 * Prevents NoSQL injection attacks against MongoDB.
 */
export const sanitize = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(
      `⚠️  Potential NoSQL injection attempt — sanitized key "${key}" from IP: ${req.ip}`
    );
  },
});
