/* global alert */
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, TextInput } from 'react-native';

import {
  BlueLoading,
  BlueSpacing20,
  BlueButton,
  SafeBlueArea,
  BlueCard,
  BlueNavigationStyle,
  BlueText,
} from '../../BlueComponents';
import { AppStorage } from '../../class';

const BlueApp = require('../../BlueApp');
const BlueElectrum = require('../../BlueElectrum');
const loc = require('../../loc');

export default class ElectrumSettings extends Component {
  static navigationOptions = () => ({
    ...BlueNavigationStyle(),
    title: loc.settings.electrum_settings,
  });

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      config: {},
    };
  }

  async componentDidMount() {
    const host = await AsyncStorage.getItem(AppStorage.ELECTRUM_HOST);
    const port = await AsyncStorage.getItem(AppStorage.ELECTRUM_TCP_PORT);

    this.setState({
      isLoading: false,
      host,
      port,
    });

    await this.setState({
      config: await BlueElectrum.getConfig(),
    });
  }

  save = () => {
    this.setState({ isLoading: true }, async () => {
      this.state.host = this.state.host ? this.state.host : '';
      this.state.port = this.state.port ? this.state.port : '';
      try {
        if (!this.state.host && !this.state.port) {
          await AsyncStorage.setItem(AppStorage.ELECTRUM_HOST, '');
          await AsyncStorage.setItem(AppStorage.ELECTRUM_TCP_PORT, '');
          alert('Your changes have been saved successfully. Restart may be required for changes to take effect.');
        } else if (!(await BlueElectrum.testConnection(this.state.host, this.state.port))) {
          alert("Can't connect to provided Electrum server");
        } else {
          await AsyncStorage.setItem(AppStorage.ELECTRUM_HOST, this.state.host);
          await AsyncStorage.setItem(AppStorage.ELECTRUM_TCP_PORT, this.state.port);
          alert('Your changes have been saved successfully. Restart may be required for changes to take effect.');
        }
      } catch (_) {}
      this.setState({ isLoading: false });
    });
  };

  render() {
    return (
      <SafeBlueArea forceInset={{ horizontal: 'always' }} style={{ flex: 1 }}>
        <BlueCard>
          <BlueText>{loc.settings.electrum_settings_explain}</BlueText>
        </BlueCard>
        <BlueCard>
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
              placeholder={'host, for example 111.222.333.444'}
              placeholderTextColor={BlueApp.settings.alternativeTextColor}
              value={this.state.host}
              onChangeText={text => this.setState({ host: text })}
              numberOfLines={1}
              style={{
                flex: 1,
                marginHorizontal: 8,
                minHeight: 36,
                height: 36,
                color: BlueApp.settings.foregroundColor,
              }}
              editable={!this.state.isLoading}
              underlineColorAndroid="transparent"
            />
          </View>
          <BlueSpacing20 />
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
              placeholder={'TCP port, usually 50001'}
              placeholderTextColor={BlueApp.settings.alternativeTextColor}
              value={this.state.port}
              onChangeText={text => this.setState({ port: text })}
              numberOfLines={1}
              style={{
                flex: 1,
                marginHorizontal: 8,
                minHeight: 36,
                height: 36,
                color: BlueApp.settings.foregroundColor,
              }}
              editable={!this.state.isLoading}
              underlineColorAndroid="transparent"
            />
          </View>

          <BlueSpacing20 />
          {this.state.isLoading ? <BlueLoading /> : <BlueButton onPress={this.save} title={loc.settings.save} />}
        </BlueCard>

        <BlueCard>
          <BlueSpacing20 />
          <BlueText>Currently using:</BlueText>
          <BlueText>Host: {this.state.config.host}</BlueText>
          <BlueText>Port: {this.state.config.port}</BlueText>
          <BlueText>Connected: {(this.state.config.status === 1 && 'Yes') || 'No'}</BlueText>
        </BlueCard>
      </SafeBlueArea>
    );
  }
}

ElectrumSettings.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }),
};
