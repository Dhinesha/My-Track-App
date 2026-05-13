/**
 * Form validation utilities
 */

export const Validation = {
  /**
   * Validate Indian mobile number (10 digits, starts with 6-9)
   */
  isValidPhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length === 10 && /^[6-9]/.test(cleaned);
  },

  /**
   * Validate email address
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate non-empty string
   */
  isNotEmpty(value: string): boolean {
    return value.trim().length > 0;
  },

  /**
   * Validate minimum length
   */
  minLength(value: string, min: number): boolean {
    return value.length >= min;
  },

  /**
   * Validate maximum length
   */
  maxLength(value: string, max: number): boolean {
    return value.length <= max;
  },

  /**
   * Validate OTP (6 digits)
   */
  isValidOTP(otp: string): boolean {
    return /^\d{6}$/.test(otp);
  },

  /**
   * Get error message for validation
   */
  getErrorMessage(field: string, rule: string): string {
    const messages: Record<string, Record<string, string>> = {
      phone: {
        required: "Phone number is required",
        invalid: "Enter a valid 10-digit Indian mobile number",
        format: "Phone number must start with 6, 7, 8, or 9",
      },
      email: {
        required: "Email is required",
        invalid: "Enter a valid email address",
      },
      password: {
        required: "Password is required",
        minLength: "Password must be at least 8 characters",
      },
      name: {
        required: "Name is required",
        minLength: "Name must be at least 2 characters",
      },
      otp: {
        required: "OTP is required",
        invalid: "OTP must be 6 digits",
      },
      generic: {
        required: `${field} is required`,
        invalid: `${field} is invalid`,
        minLength: `${field} is too short`,
        maxLength: `${field} is too long`,
      },
    };

    return messages[field]?.[rule] || messages.generic[rule] || "Invalid input";
  },
};
