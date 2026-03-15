/**
 * parseApiError — extract a human-readable English message from any API error.
 *
 * Backend response shape:  { error: "...", code: "..." }   ← operational errors
 *                          { message: "..." }               ← some validation errors
 *
 * HTTP status fallback map covers the most common cases so we never show a
 * blank or cryptic message to the user.
 */

const STATUS_MESSAGES = {
  400: 'Invalid request. Please check your input and try again.',
  401: 'Incorrect credentials. Please check your email and password.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  409: 'This record already exists.',
  422: 'The data you submitted could not be processed.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: 'An unexpected server error occurred. Please try again later.',
}

// Map backend error codes to friendly messages
const CODE_MESSAGES = {
  UNAUTHORIZED:          'Incorrect credentials. Please check your email and password.',
  VALIDATION_ERROR:      'Please check your input — some fields are invalid.',
  CONFLICT:              'This record already exists.',
  DUPLICATE_ENTRY:       'This record already exists.',
  NOT_FOUND:             'The requested resource was not found.',
  FORBIDDEN:             'You do not have permission to perform this action.',
  RATE_LIMIT_EXCEEDED:   'Too many requests. Please wait a moment and try again.',
  ROUTE_NOT_FOUND:       'API route not found.',
}

export function parseApiError(err, fallback = 'Something went wrong. Please try again.') {
  if (!err) return fallback

  const status  = err.response?.status
  const data    = err.response?.data || {}

  // 1. Prefer server's own message (backend uses `error` key, some use `message`)
  const serverMsg = data.error || data.message || ''

  // 2. Map by error code
  const codeMsg = data.code ? CODE_MESSAGES[data.code] : null

  // 3. Map by HTTP status
  const statusMsg = status ? STATUS_MESSAGES[status] : null

  // Priority: serverMsg (if not generic) > codeMsg > statusMsg > fallback
  // Avoid generic backend phrases like "Unauthorized" alone — replace with friendly text
  const isGeneric = ['Unauthorized', 'Forbidden', 'Not Found', 'Internal Server Error']
    .includes(serverMsg)

  if (serverMsg && !isGeneric) return serverMsg
  if (codeMsg) return codeMsg
  if (statusMsg) return statusMsg
  return fallback
}