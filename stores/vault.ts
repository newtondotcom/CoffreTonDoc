import { defineStore } from 'pinia';
import * as bip32 from 'bip32';
import {
  generateSeedPhrase,
  getMasterKeyFromSeed,
  getEncryptionKey
} from '~/utils/crypto';

export const useStore = defineStore('vault', {
  state: () => ({
    encryptionKey: '',
  }),
  mutations: {
    SET_ENCRYPTION_KEY(state, encryptionKey) {
      state.encryptionKey = encryptionKey;
    },
  },
  actions: {
    generateSeedPhrase(context) {
      const seedPhrase = generateSeedPhrase();
      const masterKey : bip32.BIP32Interface = getMasterKeyFromSeed(seedPhrase);
      const encryptionKey : string = getEncryptionKey(masterKey);
      context.commit('SET_ENCRYPTION_KEY', encryptionKey);
    },
    setSeedPhrase(context, seedPhrase) {
      const masterKey = getMasterKeyFromSeed(seedPhrase);
      const encryptionKey = getEncryptionKey(masterKey);
      context.commit('SET_ENCRYPTION_KEY', encryptionKey);
    },
  },
  getters: {
    getEncryptionKey: (state) => state.encryptionKey,
  },
});
