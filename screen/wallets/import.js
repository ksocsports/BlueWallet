/* global alert */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { KeyboardAvoidingView, Platform, Dimensions, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import {
  BlueFormMultiInput,
  BlueButtonLink,
  BlueButtonLinkUrl,
  BlueFormLabel,
  BlueLoading,
  BlueDoneAndDismissKeyboardInputAccessory,
  BlueButton,
  SafeBlueArea,
  BlueSpacing10,
  BlueSpacing20,
  BlueNavigationStyle,
} from '../../BlueComponents';
import Privacy from '../../Privacy';
import {
  SegwitP2SHWallet,
  LegacyWallet,
  WatchOnlyWallet,
  HDSegwitP2SHWallet,
  HDLegacyP2PKHWallet,
  HDSegwitBech32Wallet,
} from '../../class';

/** @type {AppStorage} */
const BlueApp = require('../../BlueApp');
const EV = require('../../events');
const loc = require('../../loc');

const { width } = Dimensions.get('window');

export default class WalletsImport extends Component {
  static navigationOptions = {
    ...BlueNavigationStyle(),
    title:
      loc.wallets.import.title.slice(0, 1).toUpperCase() +
      loc.wallets.import.title.slice(1, loc.wallets.import.title.length),
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isToolbarVisibleForAndroid: false,
    };
  }

  componentDidMount() {
    this.setState({
      isLoading: false,
      label: '',
    });
    Privacy.enableBlur();
  }

  componentWillUnmount() {
    Privacy.disableBlur();
  }

  async _saveWallet(w) {
    if (BlueApp.getWallets().some(wallet => wallet.getSecret() === w.secret)) {
      alert('This wallet has been previously imported.');
    } else {
      alert(loc.wallets.import.success);
      ReactNativeHapticFeedback.trigger('notificationSuccess', { ignoreAndroidSystemSettings: false });
      w.setLabel(loc.wallets.import.imported + ' ' + w.typeReadable);
      BlueApp.wallets.push(w);
      await BlueApp.saveToDisk();
      EV(EV.enum.WALLETS_COUNT_CHANGED);
      this.props.navigation.dismiss();
    }
  }

  async importMnemonic(text) {
    try {
      // trying other wallet types
      // segwitWallet = new SegwitP2SHWallet();
      //segwitWallet.setSecret(text);
      // if (segwitWallet.getAddress()) {
      //   // ok its a valid WIF

      //   const legacyWallet = new LegacyWallet();
      //   legacyWallet.setSecret(text);

      //   await legacyWallet.fetchBalance();
      //   if (legacyWallet.getBalance() > 0) {
      //     // yep, its legacy we're importing
      //     await legacyWallet.fetchTransactions();
      //     return this._saveWallet(legacyWallet);
      //   } else {
      //     // by default, we import wif as Segwit P2SH
      //     await segwitWallet.fetchBalance();
      //     await segwitWallet.fetchTransactions();
      //     return this._saveWallet(segwitWallet);
      //   }
      // }

      // case - WIF is valid, just has uncompressed pubkey

      // const legacyWallet = new LegacyWallet();
      // legacyWallet.setSecret(text);
      // if (legacyWallet.getAddress()) {
      //   await legacyWallet.fetchBalance();
      //   await legacyWallet.fetchTransactions();
      //   return this._saveWallet(legacyWallet);
      // }

      // if we're here - nope, its not a valid WIF

      // const hd4 = new HDSegwitBech32Wallet();
      // hd4.setSecret(text);
      // if (hd4.validateMnemonic()) {
      //   await hd4.fetchBalance();
      //   if (hd4.getBalance() > 0) {
      //     await hd4.fetchTransactions();
      //     return this._saveWallet(hd4);
      //   }
      // }

      // const hd2 = new HDSegwitP2SHWallet();
      // hd2.setSecret(text);
      // if (hd2.validateMnemonic()) {
      //   await hd2.fetchBalance();
      //   if (hd2.getBalance() > 0) {
      //     await hd2.fetchTransactions();
      //     return this._saveWallet(hd2);
      //   }
      // }

      const hd3 = new HDLegacyP2PKHWallet();
      hd3.setSecret(text);
      if (hd3.validateMnemonic()) {
        await hd3.fetchBalance();
        if (hd3.getBalance() > 0) {
          await hd3.fetchTransactions();
        }
        return this._saveWallet(hd3);
      }

      // no balances? how about transactions count?

      // if (hd1.validateMnemonic()) {
      //   await hd1.fetchTransactions();
      //   if (hd1.getTransactions().length !== 0) {
      //     return this._saveWallet(hd1);
      //   }
      // }
      // if (hd2.validateMnemonic()) {
      //   await hd2.fetchTransactions();
      //   if (hd2.getTransactions().length !== 0) {
      //     return this._saveWallet(hd2);
      //   }
      // }
      // if (hd3.validateMnemonic()) {
      //   await hd3.fetchTransactions();
      //   if (hd3.getTransactions().length !== 0) {
      //     return this._saveWallet(hd3);
      //   }
      // }
      // if (hd4.validateMnemonic()) {
      //   await hd4.fetchTransactions();
      //   if (hd4.getTransactions().length !== 0) {
      //     return this._saveWallet(hd4);
      //   }
      // }

      // // is it even valid? if yes we will import as:
      // if (hd4.validateMnemonic()) {
      //   return this._saveWallet(hd4);
      // }

      // not valid? maybe its a watch-only address?

      const watchOnly = new WatchOnlyWallet();
      watchOnly.setSecret(text);
      if (watchOnly.valid()) {
        await watchOnly.fetchTransactions();
        await watchOnly.fetchBalance();
        return this._saveWallet(watchOnly);
      }

      // nope?

      // TODO: try a raw private key
    } catch (Err) {
      console.warn(Err);
    }

    alert(loc.wallets.import.error);
    ReactNativeHapticFeedback.trigger('notificationError', { ignoreAndroidSystemSettings: false });
    // Plan:
    // 0. check if its HDSegwitBech32Wallet (BIP84)
    // 1. check if its HDSegwitP2SHWallet (BIP49)
    // 2. check if its HDLegacyP2PKHWallet (BIP44)
    // 3. check if its HDLegacyBreadwalletWallet (no BIP, just "m/0")
    // 4. check if its Segwit WIF (P2SH)
    // 5. check if its Legacy WIF
    // 6. check if its address (watch-only wallet)
    // 7. check if its private key (segwit address P2SH) TODO
    // 7. check if its private key (legacy address) TODO
  }

  setLabel(text) {
    this.setState({
      label: text,
    }); /* also, a hack to make screen update new typed text */
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, paddingTop: 20, backgroundColor: BlueApp.settings.brandingColor }}>
          <BlueLoading />
        </View>
      );
    }

    return (
      <SafeBlueArea forceInset={{ horizontal: 'always' }} style={{ flex: 1, paddingTop: 40 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView behavior="position" enabled>
            <BlueFormLabel>{loc.wallets.import.explanation}</BlueFormLabel>
            <BlueSpacing20 />
            <BlueFormMultiInput
              value={this.state.label}
              placeholder=""
              contextMenuHidden
              onChangeText={text => {
                this.setLabel(text);
              }}
              inputAccessoryViewID={BlueDoneAndDismissKeyboardInputAccessory.InputAccessoryViewID}
              onFocus={() => this.setState({ isToolbarVisibleForAndroid: true })}
              onBlur={() => this.setState({ isToolbarVisibleForAndroid: false })}
            />
            <View
              style={{
                alignItems: 'center',
              }}>
              {Platform.select({
                ios: (
                  <BlueDoneAndDismissKeyboardInputAccessory
                    onClearTapped={() => this.setState({ label: '' }, () => Keyboard.dismiss())}
                    onPasteTapped={text => this.setState({ label: text }, () => Keyboard.dismiss())}
                  />
                ),
                android: this.state.isToolbarVisibleForAndroid && (
                  <BlueDoneAndDismissKeyboardInputAccessory
                    onClearTapped={() => this.setState({ label: '' }, () => Keyboard.dismiss())}
                    onPasteTapped={text => this.setState({ label: text }, () => Keyboard.dismiss())}
                  />
                ),
              })}
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>

        <BlueSpacing20 />
        <View
          style={{
            alignItems: 'center',
          }}>
          <BlueButton
            disabled={!this.state.label}
            title={loc.wallets.import.do_import}
            buttonStyle={{
              width: width / 3,
            }}
            onPress={async () => {
              if (!this.state.label) {
                return;
              }
              this.setState({ isLoading: true }, async () => {
                await this.importMnemonic(this.state.label.trim());
                this.setState({ isLoading: false });
              });
            }}
          />
          <BlueSpacing10 />
          <BlueButtonLink
            title={loc.wallets.import.scan_qr}
            onPress={() => {
              this.props.navigation.navigate('ScanQrWif');
            }}
          />
        </View>
      </SafeBlueArea>
    );
  }
}

WalletsImport.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
    dismiss: PropTypes.func,
  }),
};
