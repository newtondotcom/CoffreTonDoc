import crypto from 'crypto';
import * as bip32 from 'bip32';
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
 * @returns {bip32.BIP32Interface} The generated master key.
 */
export const getMasterKeyFromSeed = (
  seedPhrase: string,
): bip32.BIP32Interface => {
  const seed = bip39.mnemonicToSeedSync(seedPhrase);
  return bip32.fromSeed(seed);
};

/**
 * Generates an encryption key from a master key using the CryptoJS library.
 * @param {bip32.BIP32Interface} masterKey - The master key to generate the encryption key from.
 * @returns {string} The generated encryption key.
 */
export const getEncryptionKey = (masterKey: bip32.BIP32Interface): string => {
  return crypto
    .SHA256(masterKey.privateKey.toString(OUTPUT_ENCODING))
    .toString();
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
