/**
 * File validation utilities for secure file uploads
 * Validates file types, sizes, and content to prevent security vulnerabilities
 */

export interface FileValidationResult {
  isValid: boolean
  error?: string
  validFiles?: File[]
}

/**
 * Allowed file types with their MIME types and extensions
 */
const ALLOWED_FILE_TYPES = {
  // Documents
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    '.docx'
  ],

  // Images
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif']
} as const

/**
 * Maximum file size in bytes (10MB)
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024

/**
 * Maximum number of files allowed
 */
const MAX_FILES = 5

/**
 * Validates uploaded files for security and size constraints
 * @param files - FileList from input element
 * @returns Validation result with valid files or error message
 */
export function validateFiles(files: FileList): FileValidationResult {
  const fileArray = Array.from(files)

  // Check file count
  if (fileArray.length > MAX_FILES) {
    return {
      isValid: false,
      error: `Too many files. Maximum ${MAX_FILES} files allowed.`
    }
  }

  const validFiles: File[] = []
  const errors: string[] = []

  for (const file of fileArray) {
    const validation = validateSingleFile(file)
    if (validation.isValid) {
      validFiles.push(file)
    } else {
      errors.push(`${file.name}: ${validation.error}`)
    }
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      error: errors.join('; ')
    }
  }

  return {
    isValid: true,
    validFiles
  }
}

/**
 * Validates a single file
 * @param file - File to validate
 * @returns Validation result
 */
function validateSingleFile(file: File): FileValidationResult {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
    }
  }

  // Check file type by MIME type
  const allowedMimeTypes = Object.keys(ALLOWED_FILE_TYPES)
  if (!allowedMimeTypes.includes(file.type)) {
    return {
      isValid: false,
      error:
        'File type not allowed. Only PDF, DOC, DOCX, JPG, PNG, and GIF files are permitted.'
    }
  }

  // Additional check: validate file extension matches MIME type
  const fileExtension = getFileExtension(file.name)
  const allowedExtensions =
    ALLOWED_FILE_TYPES[file.type as keyof typeof ALLOWED_FILE_TYPES]

  if (
    !allowedExtensions ||
    !(allowedExtensions as readonly string[]).includes(fileExtension)
  ) {
    return {
      isValid: false,
      error: 'File extension does not match file type.'
    }
  }

  // Check for potentially dangerous file names
  if (isDangerousFileName(file.name)) {
    return {
      isValid: false,
      error: 'File name contains potentially dangerous characters.'
    }
  }

  return { isValid: true }
}

/**
 * Gets file extension from filename
 * @param filename - Name of the file
 * @returns File extension including the dot
 */
function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.')
  if (lastDotIndex === -1) return ''
  return filename.substring(lastDotIndex).toLowerCase()
}

/**
 * Checks if filename contains potentially dangerous characters
 * @param filename - Name of the file
 * @returns True if filename is dangerous
 */
function isDangerousFileName(filename: string): boolean {
  // Check for path traversal attempts
  if (
    filename.includes('..') ||
    filename.includes('/') ||
    filename.includes('\\')
  ) {
    return true
  }

  // Check for executable extensions (even if not in allowed list)
  const dangerousExtensions = [
    '.exe',
    '.bat',
    '.cmd',
    '.com',
    '.scr',
    '.pif',
    '.vbs',
    '.js',
    '.jar',
    '.app',
    '.deb',
    '.pkg',
    '.dmg',
    '.rpm',
    '.msi',
    '.sh',
    '.ps1'
  ]

  const extension = getFileExtension(filename)
  return dangerousExtensions.includes(extension)
}

/**
 * Creates a safe filename by removing dangerous characters
 * @param filename - Original filename
 * @returns Sanitized filename
 */
export function sanitizeFileName(filename: string): string {
  // Remove path traversal and special characters
  return filename
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\.\./g, '_')
    .trim()
}
