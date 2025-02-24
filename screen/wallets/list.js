import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, TouchableOpacity, Text, FlatList, InteractionManager, RefreshControl, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { NavigationEvents } from 'react-navigation';

import {
  BlueLoading,
  SafeBlueArea,
  WalletsCarousel,
  BlueList,
  BlueHeaderDefaultMain,
  BlueTransactionListItem,
  NavbarLogo,
} from '../../BlueComponents';

const BlueApp = require('../../BlueApp');
const BlueElectrum = require('../../BlueElectrum');
const EV = require('../../events');
/** @type {AppStorage} */
const loc = require('../../loc');

export default class WalletsList extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerStyle: {
      backgroundColor: BlueApp.settings.navbarColor,
      color: BlueApp.settings.white,
      borderBottomWidth: 0,
      elevation: 0,
    },
    headerTitleStyle: {
      fontWeight: '600',
      color: BlueApp.settings.inverseForegroundColor,
    },
    headerLeft: <NavbarLogo />,
    headerRight: (
      <TouchableOpacity
        style={{ marginHorizontal: 16, width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-end' }}
        onPress={() => navigation.navigate('Settings')}>
        <Icon size={22} name="kebab-horizontal" type="octicon" color={BlueApp.settings.inverseForegroundColor} />
      </TouchableOpacity>
    ),
    title: loc.wallets.overview_wallets,
  });

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isFlatListRefreshControlHidden: true,
      wallets: BlueApp.getWallets().concat(false),
      lastSnappedTo: 0,
    };
    EV(EV.enum.WALLETS_COUNT_CHANGED, this.redrawScreen.bind(this));

    // here, when we receive TRANSACTIONS_COUNT_CHANGED we do not query
    // remote server, we just redraw the screen
    EV(EV.enum.TRANSACTIONS_COUNT_CHANGED, this.redrawScreen.bind(this));
  }

  componentDidMount() {
    this.redrawScreen();
    // the idea is that upon wallet launch we will refresh
    // all balances and all transactions here:
    InteractionManager.runAfterInteractions(async () => {
      let noErr = true;
      try {
        await BlueElectrum.waitTillConnected();
        const balanceStart = +new Date();
        await BlueApp.fetchWalletBalances();
        const balanceEnd = +new Date();
        console.log('fetch all wallet balances took', (balanceEnd - balanceStart) / 1000, 'sec');
        const start = +new Date();
        await BlueApp.fetchWalletTransactions();
        const end = +new Date();
        console.log('fetch all wallet txs took', (end - start) / 1000, 'sec');
      } catch (_) {
        noErr = false;
      }
      if (noErr) this.redrawScreen();
    });
  }

  /**
   * Forcefully fetches TXs and balance for lastSnappedTo (i.e. current) wallet.
   * Triggered manually by user on pull-to-refresh.
   */
  refreshTransactions() {
    if (!(this.lastSnappedTo < BlueApp.getWallets().length) && this.lastSnappedTo !== undefined) {
      // last card, nop
      console.log('last card, nop');
      return;
    }
    this.setState(
      {
        isFlatListRefreshControlHidden: false,
      },
      () => {
        InteractionManager.runAfterInteractions(async () => {
          let noErr = true;
          try {
            await BlueElectrum.ping();
            await BlueElectrum.waitTillConnected();
            const balanceStart = +new Date();
            await BlueApp.fetchWalletBalances(this.lastSnappedTo || 0);
            const balanceEnd = +new Date();
            console.log('fetch balance took', (balanceEnd - balanceStart) / 1000, 'sec');
            const start = +new Date();
            await BlueApp.fetchWalletTransactions(this.lastSnappedTo || 0);
            const end = +new Date();
            console.log('fetch tx took', (end - start) / 1000, 'sec');
          } catch (err) {
            noErr = false;
            console.warn(err);
          }
          if (noErr) await BlueApp.saveToDisk(); // caching

          this.redrawScreen();
        });
      },
    );
  }

  redrawScreen() {
    console.log('wallets/list redrawScreen()');

    this.setState({
      isLoading: false,
      isFlatListRefreshControlHidden: true,
      dataSource: BlueApp.getTransactions(null, 10),
      wallets: BlueApp.getWallets().concat(false),
    });
  }

  txMemo(hash) {
    if (BlueApp.tx_metadata[hash] && BlueApp.tx_metadata[hash]['memo']) {
      return BlueApp.tx_metadata[hash]['memo'];
    }
    return '';
  }

  handleClick(index) {
    console.log('click', index);
    const wallet = BlueApp.wallets[index];
    if (wallet) {
      this.props.navigation.navigate('WalletTransactions', {
        wallet: wallet,
        key: `WalletTransactions-${wallet.getID()}`,
      });
    } else {
      // if its out of index - this must be last card with incentive to create wallet
      this.props.navigation.navigate('AddWallet');
    }
  }

  onSnapToItem(index) {
    console.log('onSnapToItem', index);
    this.lastSnappedTo = index;
    this.setState({ lastSnappedTo: index });

    if (index < BlueApp.getWallets().length) {
      // not the last
    }

    // now, lets try to fetch balance and txs for this wallet in case it has changed
    this.lazyRefreshWallet(index);
  }

  /**
   * Decides whether wallet with such index shoud be refreshed,
   * refreshes if yes and redraws the screen
   * @param index {Integer} Index of the wallet.
   * @return {Promise.<void>}
   */
  async lazyRefreshWallet(index) {
    /** @type {Array.<AbstractWallet>} wallets */
    const wallets = BlueApp.getWallets();
    if (!wallets[index]) {
      return;
    }

    const oldBalance = wallets[index].getBalance();
    let noErr = true;
    let didRefresh = false;

    try {
      if (wallets && wallets[index] && wallets[index].timeToRefreshBalance()) {
        console.log('snapped to, and now its time to refresh wallet #', index);
        await wallets[index].fetchBalance();
        if (oldBalance !== wallets[index].getBalance() || wallets[index].getUnconfirmedBalance() !== 0) {
          console.log('balance changed, thus txs too');
          // balance changed, thus txs too
          await wallets[index].fetchTransactions();
          this.redrawScreen();
          didRefresh = true;
        } else if (wallets[index].timeToRefreshTransaction()) {
          console.log(wallets[index].getLabel(), 'thinks its time to refresh TXs');
          await wallets[index].fetchTransactions();
          if (wallets[index].fetchPendingTransactions) {
            await wallets[index].fetchPendingTransactions();
          }
          if (wallets[index].fetchUserInvoices) {
            await wallets[index].fetchUserInvoices();
            await wallets[index].fetchBalance(); // chances are, paid ln invoice was processed during `fetchUserInvoices()` call and altered user's balance, so its worth fetching balance again
          }
          this.redrawScreen();
          didRefresh = true;
        } else {
          console.log('balance not changed');
        }
      }
    } catch (Err) {
      noErr = false;
      console.warn(Err);
    }

    if (noErr && didRefresh) {
      await BlueApp.saveToDisk(); // caching
    }
  }

  _keyExtractor = (_item, index) => index.toString();

  renderListHeaderComponent = () => {
    return (
      <View>
        <Text
          style={{
            paddingLeft: 15,
            fontWeight: 'bold',
            fontSize: 24,
            marginVertical: 8,
            color: BlueApp.settings.foregroundColor,
          }}>
          {loc.transactions.list.tabBarLabel}
        </Text>
      </View>
    );
  };

  handleLongPress = () => {
    if (BlueApp.getWallets().length > 1) {
      this.props.navigation.navigate('ReorderWallets');
    } else {
      ReactNativeHapticFeedback.trigger('notificationError', { ignoreAndroidSystemSettings: false });
    }
  };

  /* Outcomented but maybe will be used in future
   * <BlueHeaderDefaultMain leftText={loc.wallets.list.title} onNewWalletPress={() => this.props.navigation.navigate('AddWallet')} />
   */

  _renderItem = data => {
    return <BlueTransactionListItem item={data.item} itemPriceUnit={data.item.walletPreferredBalanceUnit} />;
  };
  render() {
    if (this.state.isLoading) {
      return <BlueLoading />;
    }
    return (
      <SafeBlueArea style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <NavigationEvents
          onWillFocus={() => {
            this.redrawScreen();
          }}
        />
        <ScrollView
          refreshControl={
            <RefreshControl
              onRefresh={() => this.refreshTransactions()}
              refreshing={!this.state.isFlatListRefreshControlHidden}
            />
          }>
          <WalletsCarousel
            removeClippedSubviews={false}
            data={this.state.wallets}
            handleClick={index => {
              this.handleClick(index);
            }}
            handleLongPress={this.handleLongPress}
            onSnapToItem={index => {
              this.onSnapToItem(index);
            }}
          />
          <BlueList>
            <FlatList
              ListHeaderComponent={this.renderListHeaderComponent}
              ListEmptyComponent={
                <View style={{ top: 50, height: 100 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: '#9aa0aa',
                      textAlign: 'center',
                    }}>
                    {loc.wallets.list.empty_txs1}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      color: '#9aa0aa',
                      textAlign: 'center',
                    }}>
                    {loc.wallets.list.empty_txs2}
                  </Text>
                </View>
              }
              data={this.state.dataSource}
              extraData={this.state.dataSource}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
            />
          </BlueList>
        </ScrollView>
      </SafeBlueArea>
    );
  }
}

WalletsList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};
