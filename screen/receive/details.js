import bip21 from 'bip21';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, InteractionManager, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';

import {
  BlueLoading,
  SafeBlueArea,
  BlueCopyTextToClipboard,
  BlueButton,
  BlueButtonLink,
  BlueNavigationStyle,
  BlueSpacing10,
  is,
} from '../../BlueComponents';
import Privacy from '../../Privacy';
import { Chain } from '../../models/bitcoinUnits';

/** @type {AppStorage} */
const BlueApp = require('../../BlueApp');
const loc = require('../../loc');

export default class ReceiveDetails extends Component {
  static navigationOptions = ({ navigation }) => ({
    ...BlueNavigationStyle(navigation, true),
    title: loc.receive.header,
    headerLeft: null,
  });

  constructor(props) {
    super(props);
    const secret = props.navigation.state.params.secret || '';

    this.state = {
      secret: secret,
      addressText: '',
      bip21encoded: undefined,
    };
  }

  async componentDidMount() {
    Privacy.enableBlur();
    console.log('receive/details - componentDidMount');

    {
      let address;
      let wallet;
      for (const w of BlueApp.getWallets()) {
        if (w.getSecret() === this.state.secret) {
          // found our wallet
          wallet = w;
        }
      }
      if (wallet) {
        if (wallet.getAddressForTransaction) {
          if (wallet.chain === Chain.ONCHAIN) {
            try {
              address = await Promise.race([wallet.getAddressForTransaction(), BlueApp.sleep(1000)]);
            } catch (_) {}
            if (!address) {
              // either sleep expired or getAddressAsync threw an exception
              console.warn('either sleep expired or getAddressAsync threw an exception');
              address = wallet.getAddressForTransaction();
            } else {
              BlueApp.saveToDisk(); // caching whatever getAddressAsync() generated internally
            }
            this.setState({
              address: address,
              addressText: address,
            });
          } else if (wallet.chain === Chain.OFFCHAIN) {
            try {
              await Promise.race([wallet.getAddressForTransaction(), BlueApp.sleep(1000)]);
              address = wallet.getAddress();
            } catch (_) {}
            if (!address) {
              // either sleep expired or getAddressAsync threw an exception
              console.warn('either sleep expired or getAddressAsync threw an exception');
              address = wallet.getAddress();
            } else {
              BlueApp.saveToDisk(); // caching whatever getAddressAsync() generated internally
            }
          }
          this.setState({
            address: address,
            addressText: address,
          });
        } else if (wallet.getAddress) {
          this.setState({
            address: wallet.getAddress(),
            addressText: wallet.getAddress(),
          });
        }
      }
    }

    InteractionManager.runAfterInteractions(async () => {
      const bip21encoded = bip21.encode(this.state.address);
      this.setState({ bip21encoded });
    });
  }

  async componentWillUnmount() {
    Privacy.disableBlur();
  }

  render() {
    return (
      <SafeBlueArea style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ justifyContent: 'space-between' }}>
          <View style={{ marginTop: 32, alignItems: 'center', paddingHorizontal: 16 }}>
            {this.state.bip21encoded === undefined ? (
              <View style={{ alignItems: 'center', width: 300, height: 300 }}>
                <BlueLoading />
              </View>
            ) : (
              <QRCode
                value={this.state.bip21encoded}
                logo={require('../../img/qr-code.png')}
                size={(is.ipad() && 300) || 300}
                logoSize={90}
                color={BlueApp.settings.qrCodeColor}
                logoBackgroundColor="transparent"
                ecl={'H'}
                getRef={c => (this.qrCodeSVG = c)}
              />
            )}
            <BlueCopyTextToClipboard text={this.state.addressText} />
          </View>
          <View style={{ alignItems: 'center', alignContent: 'flex-end', marginBottom: 24 }}>
            <BlueButtonLink
              title={loc.receive.details.setAmount}
              onPress={() => {
                this.props.navigation.navigate('ReceiveAmount', {
                  address: this.state.address,
                });
              }}
            />
            <BlueSpacing10 />
            <View>
              <BlueButton
                icon={{
                  name: 'share-alternative',
                  type: 'entypo',
                  color: BlueApp.settings.buttonTextColor,
                }}
                onPress={async () => {
                  if (this.qrCodeSVG === undefined) {
                    Share.open({ message: `latino:${this.state.address}` }).catch(error => console.log(error));
                  } else {
                    InteractionManager.runAfterInteractions(async () => {
                      this.qrCodeSVG.toDataURL(data => {
                        const shareImageBase64 = {
                          message: `ksoc:${this.state.address}`,
                          url: `data:image/png;base64,${data}`,
                        };
                        Share.open(shareImageBase64).catch(error => console.log(error));
                      });
                    });
                  }
                }}
                title={loc.receive.details.share}
              />
            </View>
          </View>
        </ScrollView>
      </SafeBlueArea>
    );
  }
}

ReceiveDetails.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        secret: PropTypes.string,
      }),
    }),
  }),
};
