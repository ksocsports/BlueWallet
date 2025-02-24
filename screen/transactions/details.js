import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Linking } from 'react-native';

import {
  SafeBlueArea,
  BlueCard,
  BlueText,
  BlueHeaderDefaultSub,
  BlueLoading,
  BlueSpacing20,
  BlueCopyToClipboardButton,
  BlueNavigationStyle,
} from '../../BlueComponents';

/** @type {AppStorage} */
const dayjs = require('dayjs');

const BlueApp = require('../../BlueApp');
const loc = require('../../loc');

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function arrDiff(a1, a2) {
  const ret = [];
  for (const v of a2) {
    if (a1.indexOf(v) === -1) {
      ret.push(v);
    }
  }
  return ret;
}

export default class TransactionsDetails extends Component {
  static navigationOptions = () => ({
    ...BlueNavigationStyle(),
    title: loc.transactions.details.title,
  });

  constructor(props) {
    super(props);
    const hash = props.navigation.state.params.hash;
    let foundTx = {};
    let from = [];
    let to = [];
    for (const tx of BlueApp.getTransactions()) {
      if (tx.hash === hash) {
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
      for (const t of w.getTransactions()) {
        if (t.hash === hash) {
          console.log('tx', hash, 'belongs to', w.getLabel());
          wallet = w;
        }
      }
    }
    this.state = {
      isLoading: true,
      tx: foundTx,
      from,
      to,
      wallet,
    };
  }

  async componentDidMount() {
    console.log('transactions/details - componentDidMount');
    this.setState({
      isLoading: false,
    });
  }

  render() {
    if (this.state.isLoading || !this.state.hasOwnProperty('tx')) {
      return <BlueLoading />;
    }

    return (
      <SafeBlueArea forceInset={{ horizontal: 'always' }} style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <BlueCard>
            {(() => {
              if (BlueApp.tx_metadata[this.state.tx.hash]) {
                if (BlueApp.tx_metadata[this.state.tx.hash]['memo']) {
                  return (
                    <View>
                      <BlueText h4>{BlueApp.tx_metadata[this.state.tx.hash]['memo']}</BlueText>
                      <BlueSpacing20 />
                    </View>
                  );
                }
              }
            })()}

            {this.state.hasOwnProperty('from') && (
              <React.Fragment>
                <View style={{ flex: 1, flexDirection: 'row', marginBottom: 4, justifyContent: 'space-between' }}>
                  <BlueText
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      marginBottom: 4,
                      color: BlueApp.settings.foregroundColor,
                    }}>
                    {loc.transactions.details.from}
                  </BlueText>
                  <BlueCopyToClipboardButton stringToCopy={this.state.from.filter(onlyUnique).join(', ')} />
                </View>
                <BlueText style={{ marginBottom: 26, color: BlueApp.settings.alternativeTextColor }}>
                  {this.state.from.filter(onlyUnique).join(', ')}
                </BlueText>
              </React.Fragment>
            )}

            {this.state.hasOwnProperty('to') && (
              <React.Fragment>
                <View style={{ flex: 1, flexDirection: 'row', marginBottom: 4, justifyContent: 'space-between' }}>
                  <BlueText
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      marginBottom: 4,
                      color: BlueApp.settings.foregroundColor,
                    }}>
                    {loc.transactions.details.to}
                  </BlueText>
                  <BlueCopyToClipboardButton stringToCopy={this.state.to.filter(onlyUnique).join(', ')} />
                </View>
                <BlueText style={{ marginBottom: 26, color: BlueApp.settings.alternativeTextColor }}>
                  {arrDiff(this.state.from, this.state.to.filter(onlyUnique)).join(', ')}
                </BlueText>
              </React.Fragment>
            )}

            {this.state.tx.hasOwnProperty('fee') && (
              <React.Fragment>
                <BlueText
                  style={{ fontSize: 16, fontWeight: '500', marginBottom: 4, color: BlueApp.settings.foregroundColor }}>
                  {loc.send.create.fee}
                </BlueText>
                <BlueText style={{ marginBottom: 26, color: BlueApp.settings.alternativeTextColor }}>
                  {this.state.tx.fee + ' sats'}
                </BlueText>
              </React.Fragment>
            )}

            {this.state.tx.hasOwnProperty('txid') && (
              <React.Fragment>
                <View style={{ flex: 1, flexDirection: 'row', marginBottom: 4, justifyContent: 'space-between' }}>
                  <BlueText style={{ fontSize: 16, fontWeight: '500', color: BlueApp.settings.foregroundColor }}>
                    Transaction ID
                  </BlueText>
                  <BlueCopyToClipboardButton stringToCopy={this.state.tx.txid} />
                </View>
                <BlueText style={{ marginBottom: 8, color: BlueApp.settings.alternativeTextColor }}>
                  {this.state.tx.txid}
                </BlueText>
                <TouchableOpacity
                  onPress={() => {
                    const url = `http://explorer.ksoc.network/tx/${this.state.tx.txid}`;
                    Linking.canOpenURL(url).then(supported => {
                      if (supported) {
                        Linking.openURL(url);
                      }
                    });
                  }}>
                  <BlueText style={{ marginBottom: 26, color: BlueApp.settings.buttonLinkUrlColor }}>
                    {loc.transactions.details.show_in_block_explorer}
                  </BlueText>
                </TouchableOpacity>
              </React.Fragment>
            )}

            {this.state.tx.hasOwnProperty('received') && (
              <React.Fragment>
                <BlueText
                  style={{ fontSize: 16, fontWeight: '500', marginBottom: 4, color: BlueApp.settings.foregroundColor }}>
                  Date & time
                </BlueText>
                <BlueText style={{ marginBottom: 26, color: BlueApp.settings.alternativeTextColor }}>
                  {dayjs(this.state.tx.received).format('MM/DD/YYYY h:mm A')}
                </BlueText>
              </React.Fragment>
            )}

            {this.state.tx.hasOwnProperty('block_height') && this.state.tx.block_height > 0 && (
              <React.Fragment>
                <BlueText
                  style={{ fontSize: 16, fontWeight: '500', marginBottom: 4, color: BlueApp.settings.foregroundColor }}>
                  Block Height
                </BlueText>
                <BlueText style={{ marginBottom: 26, color: BlueApp.settings.alternativeTextColor }}>
                  {this.state.tx.block_height}
                </BlueText>
              </React.Fragment>
            )}

            {this.state.tx.hasOwnProperty('inputs') && (
              <React.Fragment>
                <BlueText
                  style={{ fontSize: 16, fontWeight: '500', marginBottom: 4, color: BlueApp.settings.foregroundColor }}>
                  Inputs
                </BlueText>
                <BlueText style={{ marginBottom: 26, color: BlueApp.settings.alternativeTextColor }}>
                  {this.state.tx.inputs.length}
                </BlueText>
              </React.Fragment>
            )}

            {this.state.tx.hasOwnProperty('outputs') && this.state.tx.outputs.length > 0 && (
              <React.Fragment>
                <BlueText
                  style={{ fontSize: 16, fontWeight: '500', marginBottom: 4, color: BlueApp.settings.foregroundColor }}>
                  Outputs
                </BlueText>
                <BlueText style={{ marginBottom: 26, color: BlueApp.settings.alternativeTextColor }}>
                  {this.state.tx.outputs.length}
                </BlueText>
              </React.Fragment>
            )}
          </BlueCard>
        </ScrollView>
      </SafeBlueArea>
    );
  }
}

TransactionsDetails.propTypes = {
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
