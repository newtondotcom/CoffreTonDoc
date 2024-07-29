/**
 * Reads a file and returns its content as a Uint8Array.
 * @param {File} file - The file to read.
 * @returns {Promise<Uint8Array>} A promise that resolves to the file content as a Uint8Array.
 */
export function readFile(file: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

/**
 * Encrypts a file using a symmetric encryption algorithm and a key.
 * @param {CryptoKey} key - The encryption key to use.
 * @param {Uint8Array} data - The file content to encrypt.
 * @returns {Promise<Uint8Array>} A promise that resolves to the encrypted file content as a Uint8Array.
 */
export async function encryptFile(key: CryptoKey, data: Uint8Array): Promise<Uint8Array> {
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
    const algorithm: AesGcmParams = {
        name: 'AES-GCM',
        iv: iv,
    };

    const encryptedData = await window.crypto.subtle.encrypt(algorithm, key, data);
    const encryptedArrayBuffer = new Uint8Array(encryptedData);

    // Combine the IV and the encrypted data for storage or transmission
    const encryptedFile = new Uint8Array(iv.length + encryptedArrayBuffer.length);
    encryptedFile.set(iv, 0);
    encryptedFile.set(encryptedArrayBuffer, iv.length);

    return encryptedFile;
}

/**
 * Decrypts a file using a symmetric encryption algorithm and a key.
 * @param {CryptoKey} key - The decryption key to use.
 * @param {Uint8Array} encryptedData - The encrypted file content to decrypt.
 * @returns {Promise<Uint8Array>} A promise that resolves to the decrypted file content as a Uint8Array.
 */
export async function decryptFile(key: CryptoKey, encryptedData: Uint8Array): Promise<Uint8Array> {
    const iv = encryptedData.slice(0, 12); // Extract the IV from the encrypted data
    const ciphertext = encryptedData.slice(12); // Extract the ciphertext from the encrypted data
    const algorithm: AesGcmParams = {
        name: 'AES-GCM',
        iv: iv,
    };

    const decryptedData = await window.crypto.subtle.decrypt(algorithm, key, ciphertext);
    return new Uint8Array(decryptedData);
}

/**
 * Derives a symmetric key from a hashed Ethereum address.
 * @param {string} hashedAddress - The hashed Ethereum address.
 * @returns {Promise<CryptoKey>} A promise that resolves to the derived key.
 */
export async function deriveKeyFromHashedAddress(hashedAddress: string): Promise<CryptoKey> {
    // Convert the hashed address (hex string) to a byte array
    const addressBytes = Uint8Array.from(Buffer.from(hashedAddress, 'hex'));

    // Import the hash as a CryptoKey for AES-GCM encryption/decryption
    const key = await crypto.subtle.importKey(
        'raw',
        addressBytes.buffer,
        { name: 'AES-GCM' },
        false, // Non-extractable
        ['encrypt', 'decrypt'],
    );

    return key;
}
