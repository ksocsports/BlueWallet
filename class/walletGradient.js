// import { LegacyWallet } from './legacy-wallet';
import { HDLegacyP2PKHWallet } from './hd-legacy-p2pkh-wallet';
import { HDSegwitBech32Wallet } from './hd-segwit-bech32-wallet';
import { HDSegwitP2SHWallet } from './hd-segwit-p2sh-wallet';
import { WatchOnlyWallet } from './watch-only-wallet';;
const pSBC = require('shade-blend-color').default;
let color2HdLegacyP2PKHWallet = pSBC( -0.5, "#f43d00", "#000000" );

export default class WalletGradient {
  static hdLegacyP2PKHWallet = ['#f43d00', color2HdLegacyP2PKHWallet];
  static hdSegwitBech32Wallet = ['#e36dfa', '#bd10e0'];
  static hdSegwitP2SHWallet = ['#f19b7e', '#f43d00'];
  static watchOnlyWallet = ['#7d7d7d', '#4a4a4a'];
  static legacyWallet = ['#ffffff', '#000000'];
  static defaultGradients = ['#f43d00', color2HdLegacyP2PKHWallet];
  static createWallet = [pSBC( -0.8, "#f43d00", "#000000" ), pSBC( -0.8, "#f43d00", "#000000" )];

  static gradientsFor(type) {
    let gradient;
    switch (type) {
      case WatchOnlyWallet.type:
        gradient = WalletGradient.watchOnlyWallet;
        break;
      case HDLegacyP2PKHWallet.type:
        gradient = WalletGradient.hdLegacyP2PKHWallet;
        break;
      case HDSegwitP2SHWallet.type:
        gradient = WalletGradient.hdSegwitP2SHWallet;
        break;
      case HDSegwitBech32Wallet.type:
        gradient = WalletGradient.hdSegwitBech32Wallet;
        break;
      case 'CreateWallet':
        gradient = WalletGradient.createWallet;
        break;
      default:
        gradient = WalletGradient.defaultGradients;
        break;
    }
    return gradient;
  }

  static headerColorFor(type) {
    let gradient;
    switch (type) {
      case WatchOnlyWallet.type:
        gradient = WalletGradient.watchOnlyWallet;
        break;
      //case LegacyWallet.type:
      //  gradient = WalletGradient.legacyWallet;
      //  break;
      case HDLegacyP2PKHWallet.type:
        gradient = WalletGradient.hdLegacyP2PKHWallet;
        break;
      case HDSegwitP2SHWallet.type:
        gradient = WalletGradient.hdSegwitP2SHWallet;
        break;
      case HDSegwitBech32Wallet.type:
        gradient = WalletGradient.hdSegwitBech32Wallet;
        break;
      case 'CreateWallet':
        gradient = WalletGradient.createWallet;
        break;
      default:
        gradient = WalletGradient.defaultGradients;
        break;
    }
    return gradient[0];
  }
}
