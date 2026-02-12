/**
 * User validation utilities
 */

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidWeight(kg: number): boolean {
  return kg >= 30 && kg <= 250; // Reasonable weight range
}

export function isValidHeight(cm: number): boolean {
  return cm >= 100 && cm <= 250; // Reasonable height range
}

export function isValidAge(birthDate: Date): boolean {
  const age = new Date().getFullYear() - birthDate.getFullYear();
  return age >= 13 && age <= 120; // Reasonable age range
}
