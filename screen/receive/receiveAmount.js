import bip21 from 'bip21';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, Share, TextInput, KeyboardAvoidingView, Dimensions, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import {
  SafeBlueArea,
  BlueCard,
  BlueButton,
  BlueNavigationStyle,
  BlueBitcoinAmount,
  BlueText,
  BlueCopyTextToClipboard,
} from '../../BlueComponents';
import Privacy from '../../Privacy';

/** @type {AppStorage} */
const BlueApp = require('../../BlueApp');
const loc = require('../../loc');

const { width } = Dimensions.get('window');

export default class ReceiveAmount extends Component {
  static navigationOptions = ({ navigation }) => ({
    ...BlueNavigationStyle(navigation, true),
    title: loc.receive.header,
    headerLeft: null,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          address: PropTypes.string,
        }),
      }),
    }),
  };

  constructor(props) {
    super(props);
    const address = props.navigation.state.params.address;

    this.state = {
      address: address,
      addressText: address,
      amount: undefined,
      label: undefined,
      amountSet: false,
    };
  }

  async componentDidMount() {
    Privacy.enableBlur();
  }

  async componentWillUnmount() {
    Privacy.disableBlur();
  }

  determineSize = () => {
    if (width > 312) {
      return width - 48;
    }
    return 312;
  };

  renderDefault() {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            borderColor: BlueApp.settings.inputBorderColor,
            borderWidth: 1.0,
            borderBottomWidth: 0.5,
            backgroundColor: BlueApp.settings.inputBackgroundColor,
            minHeight: 44,
            height: 44,
            marginHorizontal: 20,
            alignItems: 'center',
            marginVertical: 8,
            borderRadius: 4,
          }}>
          <TextInput
            onChangeText={text => this.setState({ label: text })}
            placeholderTextColor={BlueApp.settings.alternativeTextColor}
            placeholder={loc.receive.details.label}
            value={this.state.label || ''}
            numberOfLines={1}
            style={{ flex: 1, color: BlueApp.settings.foregroundColor, marginHorizontal: 8, minHeight: 33 }}
            editable={!this.state.isLoading}
          />
        </View>
        <BlueCard>
          <BlueButton
            title={loc.receive.details.create}
            onPress={() => {
              this.setState({
                amountSet: true,
                bip21: bip21.encode(this.state.address, { amount: this.state.amount, label: this.state.label }),
              });
            }}
          />
        </BlueCard>
      </View>
    );
  }

  renderWithSetAmount() {
    return (
      <View style={{ justifyContent: 'space-between' }}>
        <BlueText
          style={{ color: '#9aa0aa', fontWeight: '600', textAlign: 'center', paddingBottom: 24 }}
          numberOfLines={1}>
          {this.state.label}
        </BlueText>
        <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
          <QRCode
            value={this.state.bip21}
            logo={require('../../img/qr-code.png')}
            size={this.determineSize()}
            logoSize={90}
            color={BlueApp.settings.qrCodeColor}
            logoBackgroundColor="transparent"
            ecl={'Q'}
          />
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <BlueCopyTextToClipboard text={this.state.bip21} />
        </View>
      </View>
    );
  }

  render() {
    return (
      <SafeBlueArea style={{ flex: 1 }}>
        <ScrollView>
          <View style={{ flex: 1, backgroundColor: BlueApp.settings.brandingColor, justifyContent: 'space-between' }}>
            <KeyboardAvoidingView behavior="position">
              <BlueBitcoinAmount
                amount={this.state.amount || ''}
                onChangeText={text => this.setState({ amount: text })}
                disabled={this.state.amountSet}
              />
              {this.state.amountSet ? this.renderWithSetAmount() : this.renderDefault()}
            </KeyboardAvoidingView>
            {this.state.amountSet && (
              <BlueCard>
                <BlueButton
                  icon={{
                    name: 'share-alternative',
                    type: 'entypo',
                    color: BlueApp.settings.buttonTextColor,
                  }}
                  onPress={async () => {
                    Share.share({
                      message: this.state.bip21,
                    });
                  }}
                  title={loc.receive.details.share}
                />
              </BlueCard>
            )}
          </View>
        </ScrollView>
      </SafeBlueArea>
    );
  }
}
