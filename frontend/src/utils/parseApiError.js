/**
 * Parse API error response from backend
 * Backend returns: { error, code, details }
 * This function combines error message and validation details
 *
 * @param {Error} err - The error object from axios
 * @returns {string} - Formatted error message
 */
export function parseApiError(err) {
  if (!err || !err.response) {
    return 'An unexpected error occurred'
  }

  const { data, status } = err.response

  // Get main error message
  const backendError = data?.error || `Server error (HTTP ${status})`

  // Get validation details if available
  const details = data?.details
  if (details && Array.isArray(details) && details.length > 0) {
    // Handle both { field, message } and { message } formats
    const fieldErrors = details
      .map((d) => {
        if (d.field) {
          return `${d.field}: ${d.message}`
        } else if (d.message) {
          return d.message
        }
        return JSON.stringify(d)
      })
      .join(', ')
    return `${backendError} (${fieldErrors})`
  }

  return backendError
}

/**
 * Log detailed error information for debugging
 * @param {Error} err - The error object
 * @param {string} feature - Feature name (e.g., 'auth.login', 'customer.create')
 * @param {object} request - The request data (password should not be included)
 */
export function logApiError(err, feature, request) {
  const errorLog = {
    feature,
    httpStatus: err.response?.status,
    backendCode: err.response?.data?.code,
    backendError: err.response?.data?.error,
    backendDetails: err.response?.data?.details,
    request: request || {},
    timestamp: new Date().toISOString(),
  }

  console.error(`[${feature}]`, errorLog)
  return errorLog
}
