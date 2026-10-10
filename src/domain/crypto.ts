// Web Crypto API PBKDF2 PIN hashing utility for device-level profiles

export async function hashPin(pin: string, saltHex?: string): Promise<{ pinHash: string; salt: string }> {
  const enc = new TextEncoder();
  const saltBytes = saltHex
    ? hexToBytes(saltHex)
    : crypto.getRandomValues(new Uint8Array(16));
  const effectiveSaltHex = saltHex || bytesToHex(saltBytes);

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(pin),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBytes as unknown as ArrayBuffer,
      iterations: 10000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'HMAC', hash: 'SHA-256', length: 256 },
    true,
    ['sign']
  );

  const exportedRaw = await crypto.subtle.exportKey('raw', derivedKey);
  const pinHash = bytesToHex(new Uint8Array(exportedRaw));

  return { pinHash, salt: effectiveSaltHex };
}

export async function verifyPin(pin: string, pinHash: string, salt: string): Promise<boolean> {
  try {
    const computed = await hashPin(pin, salt);
    return computed.pinHash === pinHash;
  } catch {
    return false;
  }
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}
