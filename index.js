import 'intl';
import 'intl/locale-data/jsonp/en';
import React from 'react';
import './shim.js';
import { AppRegistry } from 'react-native';

import App from './App';
import UnlockWith from './UnlockWith.js';
import { name as appName } from './app.json';
import WalletMigrate from './screen/wallets/walletMigrate';

import LottieView from 'lottie-react-native';

if (!Error.captureStackTrace) {
  // captureStackTrace is only available when debugging
  Error.captureStackTrace = () => {};
}

class BlueAppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isMigratingData: true, onAnimationFinished: false, successfullyAuthenticated: false };
  }

  componentDidMount() {
    const walletMigrate = new WalletMigrate(this.setIsMigratingData);
    walletMigrate.start();
  }

  setIsMigratingData = async () => {
    this.setState({ isMigratingData: false });
  };

  onAnimationFinish = () => {
    if (this.state.isMigratingData) {
      this.loadingSplash.play(0);
    } else {
      this.setState({ onAnimationFinished: true });
    }
  };

  onSuccessfullyAuthenticated = () => {
    this.setState({ successfullyAuthenticated: true });
  };

  render() {
    if (this.state.isMigratingData) {
      return (
        <LottieView
          ref={ref => (this.loadingSplash = ref)}
          onAnimationFinish={this.onAnimationFinish}
          source={require('./img/splash.json')}
          style={{ backgroundColor: '#f43d00' }}
          duration={3000}
          autoPlay
          loop={false}
        />
      );
    } else {
      if (this.state.onAnimationFinished) {
        return this.state.successfullyAuthenticated ? (
          <App />
        ) : (
          <UnlockWith onSuccessfullyAuthenticated={this.onSuccessfullyAuthenticated} />
        );
      } else {
        return (
          <LottieView
            ref={ref => (this.loadingSplash = ref)}
            onAnimationFinish={this.onAnimationFinish}
            source={require('./img/splash.json')}
            duration={3000}
            style={{ backgroundColor: '#f43d00' }}
            autoPlay
            loop={false}
          />
        );
      }
    }
  }
}

AppRegistry.registerComponent(appName, () => BlueAppComponent);
