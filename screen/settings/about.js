import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ScrollView, Linking, Dimensions } from 'react-native';
import { getApplicationName, getVersion, getBundleId, getBuildNumber } from 'react-native-device-info';
import Rate, { AndroidMarket } from 'react-native-rate';

import {
  BlueTextCentered,
  BlueLoading,
  BlueSpacing10,
  BlueSpacing20,
  BlueButton,
  SafeBlueArea,
  BlueCard,
  BlueText,
  BlueNavigationStyle,
} from '../../BlueComponents';

/** @type {AppStorage} */
const BlueApp = require('../../BlueApp');

const { width, height } = Dimensions.get('window');
const loc = require('../../loc/');

export default class About extends Component {
  static navigationOptions = () => ({
    ...BlueNavigationStyle(),
    title: loc.settings.about,
  });

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  async componentDidMount() {
    this.setState({
      isLoading: false,
    });
  }

  render() {
    if (this.state.isLoading) {
      return <BlueLoading />;
    }

    return (
      <SafeBlueArea forceInset={{ horizontal: 'always' }} style={{ flex: 1 }}>
        <ScrollView>
          <BlueCard>
            <BlueTextCentered h4>Ksoc is a free and open source wallet. Licensed MIT.</BlueTextCentered>
            <BlueSpacing20 />

            <BlueTextCentered h4>Always backup your keys !</BlueTextCentered>
            <BlueSpacing20 />

            <BlueButton
              icon={{
                name: 'github',
                type: 'font-awesome',
                color: BlueApp.settings.buttonTextColor,
              }}
              onPress={() => {
                Linking.openURL('https://github.com/Ksoc/Ksoc-android-wallet');
              }}
              title="github.com/Ksoc/Ksoc-android-wallet"
            />
            <BlueSpacing20 />

            <BlueButton
              icon={{
                name: 'thumbs-up',
                type: 'font-awesome',
                color: BlueApp.settings.buttonTextColor,
              }}
              onPress={() => {
                const options = {
                  AppleAppID: '1376878040',
                  GooglePackageName: 'io.ksoc.wallet',
                  preferredAndroidMarket: AndroidMarket.Google,
                  preferInApp: true,
                  openAppStoreIfInAppFails: true,
                  fallbackPlatformURL: 'https://www.ksocsports.com/',
                };
                Rate.rate(options, success => {
                  if (success) {
                    console.log('User Rated.');
                  }
                });
              }}
              title="Rate Ksoc"
            />

            <BlueSpacing20 />
            <BlueText h4>Built with awesome:</BlueText>
            <BlueSpacing10 />
            <BlueText h5>* React Native</BlueText>
            <BlueText h5>* Bitcoinjs-lib</BlueText>
            <BlueText h5>* blockcypher.com API</BlueText>
            <BlueText h5>* Nodejs</BlueText>
            <BlueText h5>* react-native-elements</BlueText>
            <BlueText h5>* rn-nodeify</BlueText>
            <BlueText h5>* bignumber.js</BlueText>
            <BlueText h5>* BlueWallet</BlueText>
            <BlueText h5>* CoinFactoryBot</BlueText>
            <BlueSpacing20 />

            <BlueTextCentered />
            <BlueTextCentered>
              {getApplicationName()} ver {getVersion()} (build {getBuildNumber()})
            </BlueTextCentered>
            <BlueTextCentered>{new Date(getBuildNumber() * 1000).toGMTString()}</BlueTextCentered>
            <BlueTextCentered>{getBundleId()}</BlueTextCentered>
            <BlueTextCentered>
              w, h = {width}, {height}
            </BlueTextCentered>
          </BlueCard>
        </ScrollView>
      </SafeBlueArea>
    );
  }
}

About.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }),
};
