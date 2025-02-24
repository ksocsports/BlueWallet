import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import Handoff from 'react-native-handoff';

import {
  BlueButton,
  SafeBlueArea,
  BlueTransactionOutgoingIcon,
  BlueTransactionPendingIcon,
  BlueTransactionIncomingIcon,
  BlueCard,
  BlueText,
  BlueLoading,
  BlueSpacing20,
  BlueNavigationStyle,
} from '../../BlueComponents';
import { HDSegwitBech32Transaction, HDSegwitBech32Wallet } from '../../class';
import { BitcoinUnit } from '../../models/bitcoinUnits';

/** @type {AppStorage} */
const BlueApp = require('../../BlueApp');
const loc = require('../../loc');

const buttonStatus = Object.freeze({
  possible: 1,
  unknown: 2,
  notPossible: 3,
});

export default class TransactionsStatus extends Component {
  static navigationOptions = () => ({
    ...BlueNavigationStyle(),
  });

  constructor(props) {
    super(props);
    const hash = props.navigation.state.params.hash;
    const label = props.navigation.state.params.walletLabel;
    let foundTx = {};
    let from = [];
    let to = [];
    for (const tx of BlueApp.getTransactions()) {
      if (tx.hash === hash && tx.walletLabel === label) {
        foundTx = tx;
        for (const input of foundTx.inputs) {
          from = from.concat(input.addresses);
        }
        for (const output of foundTx.outputs) {
          if (output.addresses) to = to.concat(output.addresses);
          if (output.scriptPubKey && output.scriptPubKey.addresses) to = to.concat(output.scriptPubKey.addresses);
        }
      }
    }

    let wallet = false;
    for (const w of BlueApp.getWallets()) {
      if (w.getLabel() === foundTx.walletLabel) wallet = w;
    }

    this.state = {
      isLoading: true,
      tx: foundTx,
      from,
      to,
      wallet,
      isCPFPpossible: buttonStatus.unknown,
      isRBFBumpFeePossible: buttonStatus.unknown,
      isRBFCancelPossible: buttonStatus.unknown,
    };
  }

  async componentDidMount() {
    console.log('transactions/details - componentDidMount');
    this.setState({
      isLoading: false,
    });

    try {
      await this.checkPossibilityOfCPFP();
      await this.checkPossibilityOfRBFBumpFee();
      await this.checkPossibilityOfRBFCancel();
    } catch (_) {
      this.setState({
        isCPFPpossible: buttonStatus.notPossible,
        isRBFBumpFeePossible: buttonStatus.notPossible,
        isRBFCancelPossible: buttonStatus.notPossible,
      });
    }
  }

  async checkPossibilityOfCPFP() {
    if (this.state.wallet.type !== HDSegwitBech32Wallet.type) {
      return this.setState({ isCPFPpossible: buttonStatus.notPossible });
    }

    const tx = new HDSegwitBech32Transaction(null, this.state.tx.hash, this.state.wallet);
    if ((await tx.isToUsTransaction()) && (await tx.getRemoteConfirmationsNum()) === 0) {
      return this.setState({ isCPFPpossible: buttonStatus.possible });
    } else {
      return this.setState({ isCPFPpossible: buttonStatus.notPossible });
    }
  }

  async checkPossibilityOfRBFBumpFee() {
    if (this.state.wallet.type !== HDSegwitBech32Wallet.type) {
      return this.setState({ isRBFBumpFeePossible: buttonStatus.notPossible });
    }

    const tx = new HDSegwitBech32Transaction(null, this.state.tx.hash, this.state.wallet);
    if (
      (await tx.isOurTransaction()) &&
      (await tx.getRemoteConfirmationsNum()) === 0 &&
      (await tx.isSequenceReplaceable())
    ) {
      return this.setState({ isRBFBumpFeePossible: buttonStatus.possible });
    } else {
      return this.setState({ isRBFBumpFeePossible: buttonStatus.notPossible });
    }
  }

  async checkPossibilityOfRBFCancel() {
    if (this.state.wallet.type !== HDSegwitBech32Wallet.type) {
      return this.setState({ isRBFCancelPossible: buttonStatus.notPossible });
    }

    const tx = new HDSegwitBech32Transaction(null, this.state.tx.hash, this.state.wallet);
    if (
      (await tx.isOurTransaction()) &&
      (await tx.getRemoteConfirmationsNum()) === 0 &&
      (await tx.isSequenceReplaceable()) &&
      (await tx.canCancelTx())
    ) {
      return this.setState({ isRBFCancelPossible: buttonStatus.possible });
    } else {
      return this.setState({ isRBFCancelPossible: buttonStatus.notPossible });
    }
  }

  changeWalletBalanceUnit() {
    let walletPreviousPreferredUnit = this.state.wallet.preferredBalanceUnit;
    const wallet = this.state.wallet;
    if (walletPreviousPreferredUnit === BitcoinUnit.BTC) {
      wallet.preferredBalanceUnit = BitcoinUnit.SATS;
      walletPreviousPreferredUnit = BitcoinUnit.BTC;
    } else if (walletPreviousPreferredUnit === BitcoinUnit.SATS) {
      wallet.preferredBalanceUnit = BitcoinUnit.BTC;
      walletPreviousPreferredUnit = BitcoinUnit.SATS;
    } else {
      wallet.preferredBalanceUnit = BitcoinUnit.BTC;
      walletPreviousPreferredUnit = BitcoinUnit.BTC;
    }
    // this.state.wallet.preferredBalanceUnit = wallet.preferredBalanceUnit;
    this.setState({ state: this.state });
  }

  render() {
    if (this.state.isLoading || !this.state.hasOwnProperty('tx')) {
      return <BlueLoading />;
    }

    return (
      <SafeBlueArea forceInset={{ horizontal: 'always' }} style={{ flex: 1 }}>
        <Handoff
          title={`Latino Transaction ${this.state.tx.txid}`}
          type="io.ksoc.wallet"
          
          url={`http://explorer.ksoc.io/tx/${this.state.tx.txid}`}
        />
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <BlueCard>
            <TouchableOpacity onPress={() => this.changeWalletBalanceUnit()}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: BlueApp.settings.alternativeTextColor2, fontSize: 36, fontWeight: '600' }}>
                  {loc.formatBalanceWithoutSuffix(this.state.tx.value, this.state.wallet.preferredBalanceUnit, true)}{' '}
                  {this.state.wallet.preferredBalanceUnit !== BitcoinUnit.LOCAL_CURRENCY && (
                    <Text style={{ color: BlueApp.settings.alternativeTextColor2, fontSize: 16, fontWeight: '600' }}>
                      {this.state.wallet.preferredBalanceUnit}
                    </Text>
                  )}
                </Text>
              </View>
            </TouchableOpacity>

            {(() => {
              if (BlueApp.tx_metadata[this.state.tx.hash]) {
                if (BlueApp.tx_metadata[this.state.tx.hash]['memo']) {
                  return (
                    <View style={{ alignItems: 'center', marginVertical: 8 }}>
                      <Text style={{ color: '#9aa0aa', fontSize: 14 }}>
                        {BlueApp.tx_metadata[this.state.tx.hash]['memo']}
                      </Text>
                      <BlueSpacing20 />
                    </View>
                  );
                }
              } else {
                return (
                  <View style={{ alignItems: 'center', marginVertical: 8 }}>
                    <Text style={{ color: '#9aa0aa', fontSize: 14 }}>{this.state.tx.walletLabel}</Text>
                    <BlueSpacing20 />
                  </View>
                );
              }
            })()}

            <View
              style={{
                backgroundColor: BlueApp.settings.buttonBackgroundColor,
                color: BlueApp.settings.foregroundColor,
                width: 120,
                height: 120,
                borderRadius: 60,
                alignSelf: 'center',
                justifyContent: 'center',
                marginTop: 43,
                marginBottom: 53,
              }}>
              <View>
                <Icon name="check" size={50} type="font-awesome" color="#e4b99c" />
              </View>
              <View
                style={{
                  marginBottom: -40,
                  minWidth: 30,
                  minHeight: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'flex-end',
                  borderRadius: 15,
                }}>
                {(() => {
                  if (!this.state.tx.confirmations) {
                    return (
                      <View style={{ width: 25 }}>
                        <BlueTransactionPendingIcon />
                      </View>
                    );
                  } else if (this.state.tx.value < 0) {
                    return (
                      <View style={{ width: 25 }}>
                        <BlueTransactionOutgoingIcon />
                      </View>
                    );
                  } else {
                    return (
                      <View style={{ width: 25 }}>
                        <BlueTransactionIncomingIcon />
                      </View>
                    );
                  }
                })()}
              </View>
            </View>

            {this.state.tx.hasOwnProperty('fee') && (
              <View style={{ marginTop: 15, marginBottom: 13 }}>
                <BlueText
                  style={{ fontSize: 11, fontWeight: '500', marginBottom: 4, color: '#00c49f', alignSelf: 'center' }}>
                  {loc.send.create.fee.toLowerCase()}{' '}
                  {loc.formatBalanceWithoutSuffix(this.state.tx.fee, this.state.wallet.preferredBalanceUnit, true)}{' '}
                  {this.state.wallet.preferredBalanceUnit !== BitcoinUnit.LOCAL_CURRENCY &&
                    this.state.wallet.preferredBalanceUnit}
                </BlueText>
              </View>
            )}

            <View
              style={{
                borderRadius: 4,
                backgroundColor: BlueApp.settings.buttonBackgroundColor,
                color: BlueApp.settings.foregroundColor,
                width: 120,
                height: 25,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ color: BlueApp.settings.foregroundColor, fontSize: 13 }}>
                {this.state.tx.confirmations} confirmations
              </Text>
            </View>
          </BlueCard>

          <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
            {(() => {
              if (this.state.tx.confirmations === 0 && this.state.wallet && this.state.wallet.allowRBF()) {
                return (
                  <React.Fragment>
                    <BlueButton
                      onPress={() =>
                        this.props.navigation.navigate('RBF', {
                          txid: this.state.tx.hash,
                        })
                      }
                      title="Replace-By-Fee (RBF)"
                    />
                    <BlueSpacing20 />
                  </React.Fragment>
                );
              }
            })()}

            {(() => {
              if (this.state.isCPFPpossible === buttonStatus.unknown) {
                return (
                  <React.Fragment>
                    <ActivityIndicator />
                    <BlueSpacing20 />
                  </React.Fragment>
                );
              } else if (this.state.isCPFPpossible === buttonStatus.possible) {
                return (
                  <React.Fragment>
                    <BlueButton
                      onPress={() =>
                        this.props.navigation.navigate('CPFP', {
                          txid: this.state.tx.hash,
                          wallet: this.state.wallet,
                        })
                      }
                      title="Bump Fee"
                    />
                    <BlueSpacing20 />
                  </React.Fragment>
                );
              }
            })()}

            {(() => {
              if (this.state.isRBFBumpFeePossible === buttonStatus.unknown) {
                return (
                  <React.Fragment>
                    <ActivityIndicator />
                    <BlueSpacing20 />
                  </React.Fragment>
                );
              } else if (this.state.isRBFBumpFeePossible === buttonStatus.possible) {
                return (
                  <React.Fragment>
                    <BlueButton
                      onPress={() =>
                        this.props.navigation.navigate('RBFBumpFee', {
                          txid: this.state.tx.hash,
                          wallet: this.state.wallet,
                        })
                      }
                      title="Bump Fee"
                    />
                  </React.Fragment>
                );
              }
            })()}
            {(() => {
              if (this.state.isRBFCancelPossible === buttonStatus.unknown) {
                return (
                  <React.Fragment>
                    <ActivityIndicator />
                  </React.Fragment>
                );
              } else if (this.state.isRBFCancelPossible === buttonStatus.possible) {
                return (
                  <React.Fragment>
                    <TouchableOpacity style={{ marginVertical: 16 }}>
                      <Text
                        onPress={() =>
                          this.props.navigation.navigate('RBFCancel', {
                            txid: this.state.tx.hash,
                            wallet: this.state.wallet,
                          })
                        }
                        style={{ color: '#d0021b', fontSize: 15, fontWeight: '500', textAlign: 'center' }}>
                        {'Cancel Transaction'}
                      </Text>
                    </TouchableOpacity>
                  </React.Fragment>
                );
              }
            })()}

            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}
              onPress={() => this.props.navigation.navigate('TransactionDetails', { hash: this.state.tx.hash })}>
              <Text style={{ color: '#9aa0aa', fontSize: 14, marginRight: 8 }}>
                {loc.send.create.details.toLowerCase()}
              </Text>
              <Icon name="angle-right" size={18} type="font-awesome" color="#9aa0aa" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeBlueArea>
    );
  }
}

TransactionsStatus.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        hash: PropTypes.string,
      }),
    }),
  }),
};
