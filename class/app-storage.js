import AsyncStorage from '@react-native-community/async-storage';
import RNSecureKeyStore, { ACCESSIBLE } from 'react-native-secure-key-store';
const pSBC = require('shade-blend-color').default;
import WatchConnectivity from '../WatchConnectivity';
import {
  HDSegwitP2SHWallet,
  HDLegacyP2PKHWallet,
  WatchOnlyWallet,
  LegacyWallet,
  SegwitP2SHWallet,
  SegwitBech32Wallet,
  HDSegwitBech32Wallet,
} from './';
import DeviceQuickActions from './quickActions';

const encryption = require('../encryption');




export class AppStorage {
  static FLAG_ENCRYPTED = 'data_encrypted';
  static LANG = 'lang';
  static EXCHANGE_RATES = 'currency';
  static LNDHUB = 'lndhub';
  static ELECTRUM_HOST = 'electrum_host';
  static ELECTRUM_TCP_PORT = 'electrum_tcp_port';
  static PREFERRED_CURRENCY = 'preferredCurrency';
  static ADVANCED_MODE_ENABLED = 'advancedmodeenabled';

  constructor() {
    /** {Array.<AbstractWallet>} */
    this.wallets = [];
    this.tx_metadata = {};
    this.cachedPassword = false;
    this.settings = {
      brandingColor: '#fff',
      foregroundColor: "#212121",
      buttonBackgroundColor: "#fff",
      buttonTextColor: '#000000',
      buttonAlternativeTextColor: '#000000',
      buttonDisabledBackgroundColor: "#212121",
      buttonDisabledTextColor: '#9aa0aa',
      buttonLinkUrlColor:"#212121",
      inputBorderColor: "#212121",
      inputBackgroundColor: "#212121",
      alternativeTextColor: '#ffffff',
      alternativeTextColor2: "#212121",
      buttonBlueBackgroundColor: "#212121",
      incomingBackgroundColor: "#212121",
      incomingForegroundColor: '#000000',
      outgoingBackgroundColor: "#212121",
      outgoingForegroundColor: '#f43d00',
      successColor: '#313131',
      failedColor: '#505050',
      shadowColor: '#000000',
      inverseForegroundColor: '#ffffff',
      hdborderColor: pSBC( +0.5, "#f43d00", "#000000" ),
      hdbackgroundColor: '#ffffff',
      navbarColor: '#f43d00',
      qrCodeColor: '#000', 
      lnborderColor: '#22011f',
      lnbackgroundColor: '#ffffff',
      white: '#FFF'
    };
  }

  /**
   * Wrapper for storage call. Secure store works only in RN environment. AsyncStorage is
   * used for cli/tests
   *
   * @param key
   * @param value
   * @returns {Promise<any>|Promise<any> | Promise<void> | * | Promise | void}
   */
  setItem(key, value) {
    if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
      return RNSecureKeyStore.set(key, value, { accessible: ACCESSIBLE.WHEN_UNLOCKED });
    } else {
      return AsyncStorage.setItem(key, value);
    }
  }

  /**
   * Wrapper for storage call. Secure store works only in RN environment. AsyncStorage is
   * used for cli/tests
   *
   * @param key
   * @returns {Promise<any>|*}
   */
  getItem(key) {
    if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
      return RNSecureKeyStore.get(key);
    } else {
      return AsyncStorage.getItem(key);
    }
  }

  async storageIsEncrypted() {
    let data;
    try {
      data = await this.getItem(AppStorage.FLAG_ENCRYPTED);
    } catch (error) {
      return false;
    }

    return !!data;
  }

  /**
   * Iterates through all values of `data` trying to
   * decrypt each one, and returns first one successfully decrypted
   *
   * @param data String (serialized array)
   * @param password
   */
  decryptData(data, password) {
    data = JSON.parse(data);
    let decrypted;
    for (const value of data) {
      try {
        decrypted = encryption.decrypt(value, password);
      } catch (e) {
        console.log(e.message);
      }

      if (decrypted) {
        return decrypted;
      }
    }

    return false;
  }

  async encryptStorage(password) {
    // assuming the storage is not yet encrypted
    await this.saveToDisk();
    let data = await this.getItem('data');
    // TODO: refactor ^^^ (should not save & load to fetch data)

    const encrypted = encryption.encrypt(data, password);
    data = [];
    data.push(encrypted); // putting in array as we might have many buckets with storages
    data = JSON.stringify(data);
    this.cachedPassword = password;
    await this.setItem('data', data);
    await this.setItem(AppStorage.FLAG_ENCRYPTED, '1');
    DeviceQuickActions.clearShortcutItems();
    DeviceQuickActions.removeAllWallets();
  }

  /**
   * Cleans up all current application data (wallets, tx metadata etc)
   * Encrypts the bucket and saves it storage
   *
   * @returns {Promise.<boolean>} Success or failure
   */
  async createFakeStorage(fakePassword) {
    this.wallets = [];
    this.tx_metadata = {};

    const data = {
      wallets: [],
      tx_metadata: {},
    };

    let buckets = await this.getItem('data');
    buckets = JSON.parse(buckets);
    buckets.push(encryption.encrypt(JSON.stringify(data), fakePassword));
    this.cachedPassword = fakePassword;
    const bucketsString = JSON.stringify(buckets);
    await this.setItem('data', bucketsString);
    return (await this.getItem('data')) === bucketsString;
  }

  /**
   * Loads from storage all wallets and
   * maps them to `this.wallets`
   *
   * @param password If present means storage must be decrypted before usage
   * @returns {Promise.<boolean>}
   */
  async loadFromDisk(password) {
    try {
      let data = await this.getItem('data');
      if (password) {
        data = this.decryptData(data, password);
        if (data) {
          // password is good, cache it
          this.cachedPassword = password;
        }
      }
      if (data !== null) {
        data = JSON.parse(data);
        if (!data.wallets) return false;
        const wallets = data.wallets;
        for (const key of wallets) {
          // deciding which type is wallet and instatiating correct object
          const tempObj = JSON.parse(key);
          let unserializedWallet;
          switch (tempObj.type) {
            case SegwitBech32Wallet.type:
              unserializedWallet = SegwitBech32Wallet.fromJson(key);
              break;
            case SegwitP2SHWallet.type:
              unserializedWallet = SegwitP2SHWallet.fromJson(key);
              break;
            case WatchOnlyWallet.type:
              unserializedWallet = WatchOnlyWallet.fromJson(key);
              unserializedWallet.init();
              break;
            case HDLegacyP2PKHWallet.type:
              unserializedWallet = HDLegacyP2PKHWallet.fromJson(key);
              break;
            case HDSegwitP2SHWallet.type:
              unserializedWallet = HDSegwitP2SHWallet.fromJson(key);
              break;
            case HDSegwitBech32Wallet.type:
              unserializedWallet = HDSegwitBech32Wallet.fromJson(key);
              break;
            case LegacyWallet.type:
            default:
              unserializedWallet = LegacyWallet.fromJson(key);
              break;
          }
          // done
          if (!this.wallets.some(wallet => wallet.getSecret() === unserializedWallet.secret)) {
            this.wallets.push(unserializedWallet);
            this.tx_metadata = data.tx_metadata;
          }
        }
        WatchConnectivity.shared.wallets = this.wallets;
        WatchConnectivity.shared.tx_metadata = this.tx_metadata;
        WatchConnectivity.shared.fetchTransactionsFunction = async () => {
          await this.fetchWalletTransactions();
          await this.saveToDisk();
        };
        await WatchConnectivity.shared.sendWalletsToWatch(this.wallets);
        DeviceQuickActions.setWallets(this.wallets);
        DeviceQuickActions.setQuickActions();
        return true;
      } else {
        return false; // failed loading data or loading/decryptin data
      }
    } catch (error) {
      console.warn(error.message);
      return false;
    }
  }

  /**
   * Lookup wallet in list by it's secret and
   * remove it from `this.wallets`
   *
   * @param wallet {AbstractWallet}
   */
  deleteWallet(wallet) {
    const secret = wallet.getSecret();
    const tempWallets = [];

    for (const value of this.wallets) {
      if (value.getSecret() === secret) {
        // the one we should delete
        // nop
      } else {
        // the one we must keep
        tempWallets.push(value);
      }
    }
    this.wallets = tempWallets;
  }

  /**
   * Serializes and saves to storage object data.
   * If cached password is saved - finds the correct bucket
   * to save to, encrypts and then saves.
   *
   * @returns {Promise} Result of storage save
   */
  async saveToDisk() {
    const walletsToSave = [];
    for (const key of this.wallets) {
      if (typeof key === 'boolean') continue;
      if (key.prepareForSerialization) key.prepareForSerialization();
      walletsToSave.push(JSON.stringify({ ...key, type: key.type }));
    }

    let data = {
      wallets: walletsToSave,
      tx_metadata: this.tx_metadata,
    };

    if (this.cachedPassword) {
      // should find the correct bucket, encrypt and then save
      let buckets = await this.getItem('data');
      buckets = JSON.parse(buckets);
      const newData = [];
      for (const bucket of buckets) {
        const decrypted = encryption.decrypt(bucket, this.cachedPassword);
        if (!decrypted) {
          // no luck decrypting, its not our bucket
          newData.push(bucket);
        } else {
          // decrypted ok, this is our bucket
          // we serialize our object's data, encrypt it, and add it to buckets
          newData.push(encryption.encrypt(JSON.stringify(data), this.cachedPassword));
          await this.setItem(AppStorage.FLAG_ENCRYPTED, '1');
        }
      }
      data = newData;
    } else {
      await this.setItem(AppStorage.FLAG_ENCRYPTED, ''); // drop the flag
    }
    WatchConnectivity.shared.wallets = this.wallets;
    WatchConnectivity.shared.tx_metadata = this.tx_metadata;
    WatchConnectivity.shared.sendWalletsToWatch();
    DeviceQuickActions.setWallets(this.wallets);
    DeviceQuickActions.setQuickActions();
    return this.setItem('data', JSON.stringify(data));
  }

  /**
   * For each wallet, fetches balance from remote endpoint.
   * Use getter for a specific wallet to get actual balance.
   * Returns void.
   * If index is present then fetch only from this specific wallet
   *
   * @return {Promise.<void>}
   */
  async fetchWalletBalances(index) {
    console.log('fetchWalletBalances for wallet#', index);
    if (index || index === 0) {
      let c = 0;
      for (const wallet of this.wallets) {
        if (c++ === index) {
          await wallet.fetchBalance();
        }
      }
    } else {
      for (const wallet of this.wallets) {
        await wallet.fetchBalance();
      }
    }
  }

  /**
   * Fetches from remote endpoint all transactions for each wallet.
   * Returns void.
   * To access transactions - get them from each respective wallet.
   * If index is present then fetch only from this specific wallet.
   *
   * @param index {Integer} Index of the wallet in this.wallets array,
   *                        blank to fetch from all wallets
   * @return {Promise.<void>}
   */
  async fetchWalletTransactions(index) {
    console.log('fetchWalletTransactions for wallet#', index);
    if (index || index === 0) {
      let c = 0;
      for (const wallet of this.wallets) {
        if (c++ === index) {
          await wallet.fetchTransactions();
          if (wallet.fetchPendingTransactions) {
            await wallet.fetchPendingTransactions();
          }
          if (wallet.fetchUserInvoices) {
            await wallet.fetchUserInvoices();
          }
        }
      }
    } else {
      for (const wallet of this.wallets) {
        await wallet.fetchTransactions();
        if (wallet.fetchPendingTransactions) {
          await wallet.fetchPendingTransactions();
        }
        if (wallet.fetchUserInvoices) {
          await wallet.fetchUserInvoices();
        }
      }
    }
  }

  /**
   *
   * @returns {Array.<AbstractWallet>}
   */
  getWallets() {
    return this.wallets;
  }

  /**
   * Getter for all transactions in all wallets.
   * But if index is provided - only for wallet with corresponding index
   *
   * @param index {Integer|null} Wallet index in this.wallets. Empty (or null) for all wallets.
   * @param limit {Integer} How many txs return, starting from the earliest. Default: all of them.
   * @return {Array}
   */
  getTransactions(index, limit = Infinity) {
    if (index || index === 0) {
      let txs = [];
      let c = 0;
      for (const wallet of this.wallets) {
        if (c++ === index) {
          txs = txs.concat(wallet.getTransactions());
        }
      }
      return txs;
    }

    let txs = [];
    for (const wallet of this.wallets) {
      const walletTransactions = wallet.getTransactions();
      for (const t of walletTransactions) {
        t.walletPreferredBalanceUnit = wallet.getPreferredBalanceUnit();
      }
      txs = txs.concat(walletTransactions);
    }

    for (const t of txs) {
      t.sort_ts = +new Date(t.received);
    }

    return txs
      .sort(function(a, b) {
        return b.sort_ts - a.sort_ts;
      })
      .slice(0, limit);
  }

  /**
   * Getter for a sum of all balances of all wallets
   *
   * @return {number}
   */
  getBalance() {
    let finalBalance = 0;
    for (const wal of this.wallets) {
      finalBalance += wal.getBalance();
    }
    return finalBalance;
  }

  /**
   * Simple async sleeper function
   *
   * @param ms {number} Milliseconds to sleep
   * @returns {Promise<Promise<*> | Promise<*>>}
   */
  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
