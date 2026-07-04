import * as LocalAuthentication from 'expo-local-authentication';

// check Biometric Availability
export async function isBiometricAvailable(): Promise<boolean> {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return compatible && enrolled;
}

// Biometric authenticate 
export async function authenticateWithBiometric(
  reason: string = 'Verify your identity'
): Promise<boolean> {
  const available = await isBiometricAvailable();
  if (!available) return true; //Biometric not available, fallback to PIN or password

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: reason,
    fallbackLabel: 'Use PIN',
    cancelLabel: 'Cancel',
    disableDeviceFallback: false,
  });

  return result.success;
}

// Biometric (fingerprint/face)
export async function getBiometricType(): Promise<string> {
  const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
  if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
    return 'Face ID';
  }
  if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
    return 'Fingerprint';
  }
  return 'Biometric';
}