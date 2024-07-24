import crypto from 'crypto';
import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';
import type { BIP32Interface } from 'bip32';
import * as bip39 from 'bip39';

const ALGORITHM = 'aes-256-cbc';
const INPUT_ENCODING = 'utf8';
const OUTPUT_ENCODING = 'hex';
const FORMAT = 'base64';

/**
 * Generates a new seed phrase using the bip39 library.
 * @returns {string} A new seed phrase.
 */
export const generateSeedPhrase = (): string => {
    return bip39.generateMnemonic();
};

/**
 * Generates a master key from a seed phrase using the bip32 library.
 * @param {string} seedPhrase - The seed phrase to generate the master key from.
 * @returns {BIP32Interface} The generated master key.
 */
export const getMasterKeyFromSeed = (seedPhrase: string): BIP32Interface => {
    const bip32 = BIP32Factory(ecc);
    const seed = bip39.mnemonicToSeedSync(seedPhrase);
    return bip32.fromSeed(seed);
};

/**
 * Generates an encryption key from a master key using the crypto library.
 * @param {BIP32Interface} masterKey - The master key to generate the encryption key from.
 * @returns {string} The generated encryption key.
 */
export const getEncryptionKey = (masterKey: BIP32Interface): string => {
    return crypto.createHash('sha256').update(masterKey.privateKey!).digest(OUTPUT_ENCODING);
};

/**
 * Encrypts a plaintext string using a symmetric encryption algorithm and a key.
 * @param {string} text - The plaintext string to encrypt.
 * @param {string} key - The encryption key to use.
 * @returns {string} The encrypted ciphertext.
 */
export const symmetricEncrypt = function (text: string, key: string): string {
    const keyBuffer = Buffer.from(key, OUTPUT_ENCODING);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);
    let encrypted = cipher.update(text, INPUT_ENCODING, FORMAT);
    encrypted += cipher.final(FORMAT);
    return iv.toString(OUTPUT_ENCODING) + ':' + encrypted;
};

/**
 * Decrypts a ciphertext string using a symmetric encryption algorithm and a key.
 * @param {string} text - The ciphertext string to decrypt.
 * @param {string} key - The decryption key to use.
 * @returns {string} The decrypted plaintext.
 */
export const symmetricDecrypt = function (text: string, key: string): string {
    try {
        const keyBuffer = Buffer.from(key, OUTPUT_ENCODING);
        const parts = text.split(':');
        const iv = Buffer.from(parts[0], OUTPUT_ENCODING);
        const encrypted = parts[1];
        const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);
        let decrypted = decipher.update(encrypted, FORMAT, INPUT_ENCODING);
        decrypted += decipher.final(INPUT_ENCODING);
        return decrypted;
    } catch (error) {
        console.error('Error decrypting value', error);
        return '';
    }
};


/**
 * Reads a file and returns its content as a Uint8Array.
 * @param {File} file - The file to read.
 * @returns {Promise<Uint8Array>} A promise that resolves to the file content as a Uint8Array.
 */
function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(new Uint8Array(reader.result));
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
async function encryptFile(key, data) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
    const algorithm = {
        name: "AES-GCM",
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
async function decryptFile(key, encryptedData) {
    const iv = encryptedData.slice(0, 12); // Extract the IV from the encrypted data
    const ciphertext = encryptedData.slice(12); // Extract the ciphertext from the encrypted data
    const algorithm = {
        name: "AES-GCM",
        iv: iv,
    };

    const decryptedData = await window.crypto.subtle.decrypt(algorithm, key, ciphertext);
    return new Uint8Array(decryptedData);
}
