/* global alert */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Switch,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import { BlueButton, SafeBlueArea, BlueCard, BlueSpacing20, BlueNavigationStyle, BlueText } from '../../BlueComponents';
import { HDSegwitBech32Wallet, WatchOnlyWallet } from '../../class';
import Biometric from '../../class/biometrics';
import { HDLegacyP2PKHWallet } from '../../class/hd-legacy-p2pkh-wallet';
import { HDSegwitP2SHWallet } from '../../class/hd-segwit-p2sh-wallet';

const BlueApp = require('../../BlueApp');
const EV = require('../../events');
const loc = require('../../loc');
const prompt = require('../../prompt');
/** @type {AppStorage} */

export default class WalletDetails extends Component {
  static navigationOptions = ({ navigation }) => ({
    ...BlueNavigationStyle(),
    title: loc.wallets.details.title,
    headerRight: (
      <TouchableOpacity
        disabled={navigation.getParam('isLoading') === true}
        style={{ marginHorizontal: 16, justifyContent: 'center', alignItems: 'center' }}
        onPress={() => {
          if (navigation.state.params.saveAction) {
            navigation.getParam('saveAction')();
          }
        }}>
        <Text style={{ color: '#ffffff' }}>{loc.wallets.details.save}</Text>
      </TouchableOpacity>
    ),
  });

  constructor(props) {
    super(props);

    const wallet = props.navigation.getParam('wallet');
    const isLoading = true;
    this.state = {
      isLoading,
      walletName: wallet.getLabel(),
      wallet,
      useWithHardwareWallet: !!wallet.use_with_hardware_wallet,
    };
    this.props.navigation.setParams({ isLoading, saveAction: () => this.setLabel() });
  }

  componentDidMount() {
    console.log('wallets/details componentDidMount');
    this.setState({
      isLoading: false,
    });
    this.props.navigation.setParams({ isLoading: false, saveAction: () => this.setLabel() });
  }

  setLabel() {
    this.props.navigation.setParams({ isLoading: true });
    this.setState({ isLoading: true }, async () => {
      this.state.wallet.setLabel(this.state.walletName);
      BlueApp.saveToDisk();
      alert('Wallet updated.');
      this.props.navigation.goBack(null);
    });
  }

  async presentWalletHasBalanceAlert() {
    ReactNativeHapticFeedback.trigger('notificationWarning', { ignoreAndroidSystemSettings: false });
    const walletBalanceConfirmation = await prompt(
      'Wallet Balance',
      `This wallet has a balance. Before proceeding, please be aware that you will not be able to recover the funds without this wallet's seed phrase. In order to avoid accidental removal this wallet, please enter your wallet's balance of ${this.state.wallet.getBalance()} satoshis.`,
      true,
      'plain-text',
    );
    if (Number(walletBalanceConfirmation) === this.state.wallet.getBalance()) {
      this.props.navigation.setParams({ isLoading: true });
      this.setState({ isLoading: true }, async () => {
        BlueApp.deleteWallet(this.state.wallet);
        ReactNativeHapticFeedback.trigger('notificationSuccess', { ignoreAndroidSystemSettings: false });
        await BlueApp.saveToDisk();
        EV(EV.enum.TRANSACTIONS_COUNT_CHANGED);
        EV(EV.enum.WALLETS_COUNT_CHANGED);
        this.props.navigation.navigate('Wallets');
      });
    } else {
      ReactNativeHapticFeedback.trigger('notificationError', { ignoreAndroidSystemSettings: false });
      this.setState({ isLoading: false }, async () => {
        alert("The provided balance amount does not match this wallet's balance. Please, try again");
      });
    }
  }

  async onUseWithHardwareWalletSwitch(value) {
    this.setState((state, props) => {
      const wallet = state.wallet;
      wallet.use_with_hardware_wallet = !!value;
      return { useWithHardwareWallet: !!value, wallet };
    });
  }

  render() {
    if (this.state.isLoading) {
      return ((
        <View style={{ flex: 1 }}>
          <ActivityIndicator />
        </View>
      ));
    }
    return ((
      <SafeBlueArea style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView behavior="position">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <BlueCard style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ color: '#ffffff', fontWeight: '500', fontSize: 14, marginVertical: 12 }}>
                  {loc.wallets.add.wallet_name.slice(0, 1).toUpperCase() +
                    loc.wallets.add.wallet_name.slice(1, loc.wallets.add.wallet_name.length)}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    borderColor: BlueApp.settings.inputBorderColor,
                    borderWidth: 1.0,
                    borderBottomWidth: 0.5,
                    backgroundColor: BlueApp.settings.inputBackgroundColor,
                    minHeight: 44,
                    height: 44,
                    alignItems: 'center',
                    borderRadius: 4,
                  }}>
                  <TextInput
                    placeholder={loc.send.details.note_placeholder}
                    placeholderTextColor={BlueApp.settings.alternativeTextColor}
                    value={this.state.walletName}
                    onChangeText={text => this.setState({ walletName: text })}
                    numberOfLines={1}
                    style={{ flex: 1, marginHorizontal: 8, minHeight: 33, color: BlueApp.settings.inverseForegroundColor }}
                    editable={!this.state.isLoading}
                    underlineColorAndroid="transparent"
                  />
                </View>

                <Text style={{ color: '#ffffff', fontWeight: '500', fontSize: 14, marginVertical: 12 }}>
                  {loc.wallets.details.type}
                </Text>
                <Text style={{ color: '#81868e', fontWeight: '500', fontSize: 14 }}>
                  {this.state.wallet.typeReadable}
                </Text>

                <BlueSpacing20 />

                {this.state.wallet.type === WatchOnlyWallet.type && this.state.wallet.getSecret().startsWith('zpub') && (
                  <React.Fragment>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <BlueText>{'Use with hardware wallet'}</BlueText>
                      <Switch
                        value={this.state.useWithHardwareWallet}
                        onValueChange={value => this.onUseWithHardwareWalletSwitch(value)}
                      />
                    </View>
                    <BlueSpacing20 />
                  </React.Fragment>
                )}

                <BlueButton
                  onPress={() =>
                    this.props.navigation.navigate('WalletExport', {
                      address: this.state.wallet.getAddress(),
                      secret: this.state.wallet.getSecret(),
                    })
                  }
                  title={loc.wallets.details.export_backup}
                />

                <BlueSpacing20 />

                {(this.state.wallet.type === HDLegacyP2PKHWallet.type ||
                  this.state.wallet.type === HDSegwitBech32Wallet.type ||
                  this.state.wallet.type === HDSegwitP2SHWallet.type) && (
                  <React.Fragment>
                    <BlueButton
                      onPress={() =>
                        this.props.navigation.navigate('WalletXpub', {
                          secret: this.state.wallet.getSecret(),
                        })
                      }
                      title={loc.wallets.details.show_xpub}
                    />

                    <BlueSpacing20 />
                  </React.Fragment>
                )}

                <BlueButton
                  onPress={() => {
                    ReactNativeHapticFeedback.trigger('notificationWarning', { ignoreAndroidSystemSettings: false });
                    Alert.alert(
                      loc.wallets.details.delete + ' ' + loc.wallets.details.title,
                      loc.wallets.details.are_you_sure,
                      [
                        {
                          text: loc.wallets.details.yes_delete,
                          onPress: async () => {
                            const isBiometricsEnabled = await Biometric.isBiometricUseCapableAndEnabled();

                            if (isBiometricsEnabled) {
                              if (!(await Biometric.unlockWithBiometrics())) {
                                return;
                              }
                            }
                            if (this.state.wallet.getBalance() > 0) {
                              this.presentWalletHasBalanceAlert();
                            } else {
                              this.props.navigation.setParams({ isLoading: true });
                              this.setState({ isLoading: true }, async () => {
                                BlueApp.deleteWallet(this.state.wallet);
                                ReactNativeHapticFeedback.trigger('notificationSuccess', {
                                  ignoreAndroidSystemSettings: false,
                                });
                                await BlueApp.saveToDisk();
                                EV(EV.enum.TRANSACTIONS_COUNT_CHANGED);
                                EV(EV.enum.WALLETS_COUNT_CHANGED);
                                this.props.navigation.navigate('Wallets');
                              });
                            }
                          },
                          style: 'destructive',
                        },
                        { text: loc.wallets.details.no_cancel, onPress: () => {}, style: 'cancel' },
                      ],
                      { cancelable: false },
                    );
                  }}
                  title={loc.wallets.details.delete}
                />
              </BlueCard>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeBlueArea>
    ));
  }
}

WalletDetails.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        secret: PropTypes.string,
      }),
    }),
    navigate: PropTypes.func,
    goBack: PropTypes.func,
    setParams: PropTypes.func,
  }),
};
