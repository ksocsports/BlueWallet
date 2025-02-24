module.exports = {
  _: {
    storage_is_encrypted: 'Dein Speicher ist verschlüsselt. Zum Entschlüsseln wird ein Passwort benötigt.',
    enter_password: 'Gib das Passwort ein',
    bad_password: 'Fasches Passwort, nächster Versuch',
    never: 'nie',
    continue: 'Weiter',
    ok: 'OK',
  },
  wallets: {
    select_wallet: 'Wähle eine Wallet',
    options: 'Einstellungen',
    createBitcoinWallet:
      'Um eine Lightning wallet zu verwenden, muss erstmal eine Bitcoin Wallet eingerichtet werden. Bitte erstell oder importier eine Bitcoin Wallet.',
    list: {
      app_name: 'Ksoc',
      title: 'Wallets',
      header:
        'Eine Wallet spiegelt ein Paar kryptographische Schlüssel wider. Einen geheimen Schlüseel und eine Adresse als öffentlichen Schlüssel. Den öffentlichen Schlüssel kann man zum Empfang von Bitcoin teilen.',
      add: 'Wallet hinzufügen',
      create_a_wallet: 'Wallet erstellen',
      create_a_wallet1: 'Es ist kostenlos und du kannst',
      create_a_wallet2: 'so viele Wallets erstellen, wie du möchtest',
      latest_transaction: 'Lezte Transaktion',
      empty_txs1: 'Deine Transaktionen erscheinen hier',
      empty_txs2: 'Noch keine Transaktionen',
      empty_txs1_lightning:
        'Lightning wallet should be used for your daily transactions. Fees are unfairly cheap and speed is blazing fast.',
      empty_txs2_lightning: '\nTo start using it tap on "manage funds" and topup your balance.',
      tap_here_to_buy: 'Klicke hier, um Bitcoin zu kaufen',
    },
    reorder: {
      title: 'Wallets neu ordnen',
    },
    add: {
      title: 'Wallet hinzufügen',
      description:
        'Du kannst entweder ein Backup einer Paper-Wallet einscannen (im WIF - Wallet Import Format) oder eine neue Wallet erstellen. SegWit Wallets werden standardmäßig unterstützt.',
      scan: 'Scannen',
      create: 'Erstellen',
      label_new_segwit: 'Neue SegWit Wallet',
      label_new_lightning: 'Neue Lightning Wallet',
      wallet_name: 'Wallet Name',
      wallet_type: 'Typ',
      or: 'oder',
      import_wallet: 'Wallet importieren',
      imported: 'Importiert',
      coming_soon: 'Demnächst verfügbar',
      lightning: 'Lightning',
      bitcoin: 'Bitcoin',
    },
    details: {
      title: 'Wallet',
      address: 'Adresse',
      type: 'Typ',
      label: 'Bezeichnung',
      destination: 'Zieladresse',
      description: 'Beschreibung',
      are_you_sure: 'Bist du dir sicher??',
      yes_delete: 'Ja, löschen',
      no_cancel: 'Nein, abbrechnen',
      delete: 'Löschen',
      save: 'Sichern',
      delete_this_wallet: 'Lösche diese Wallet',
      export_backup: 'Exportieren / Backup',
      buy_bitcoin: 'Bitcoin kaufen',
      show_xpub: 'Wallet XPUB zeigen',
    },
    export: {
      title: 'Wallet exportieren',
    },
    xpub: {
      title: 'Wallet XPUB',
      copiedToClipboard: 'In die Zwischenablage kopiert.',
    },
    import: {
      title: 'Importieren',
      explanation:
        'Gib hier deine mnemonische Phrase, deinen privaten Schlüssel, WIF oder worüber du auch immer verfügst ein. Ksoc wird bestmöglich dein Format interpretieren und die Wallet importieren',
      imported: 'Importiert',
      error: 'Fehler beim Import. Ist die Eingabe korrekt?',
      success: 'Erfolg',
      do_import: 'Importieren',
      scan_qr: 'oder QR-Code scannen?',
    },
    scanQrWif: {
      go_back: 'Zurück',
      cancel: 'Abbrechen',
      decoding: 'Entschlüsseln',
      input_password: 'Passwort eingeben',
      password_explain: 'Das ist ein mit BIP38 verschlüsselter geheimer Schlüssel',
      bad_password: 'Falsches Passwort',
      wallet_already_exists: 'Diese Wallet existiert bereits',
      bad_wif: 'Falsches WIF',
      imported_wif: 'WIF importiert',
      with_address: ' mit Adresse ',
      imported_segwit: 'SegWit importiert',
      imported_legacy: 'Legacy importiert',
      imported_watchonly: 'Watch-Only importiert',
    },
  },
  transactions: {
    list: {
      tabBarLabel: 'Transaktionen',
      title: 'Transaktionen',
      description: 'Eine Liste eingehender oder ausgehender Transaktionen deiner Wallets',
      conf: 'conf',
    },
    details: {
      title: 'Transaktionen',
      from: 'Eingehend',
      to: 'Ausgehend',
      copy: 'Kopieren',
      transaction_details: 'Details',
      show_in_block_explorer: 'Im Block-Explorer zeigen',
    },
  },
  send: {
    header: 'Senden',
    details: {
      title: 'Transaktion erstellen',
      amount_field_is_not_valid: 'Betrageingabe ist nicht korrekt',
      fee_field_is_not_valid: 'Gebühreingabe ist nicht korrekt',
      address_field_is_not_valid: 'Adresseingabe ist nicht korrekt',
      total_exceeds_balance: 'Der zu sendende Betrag ist größer als der verfügbare Betrag.',
      create_tx_error: 'Fehler beim Erstellen der Transaktion. Bitte stelle sicher, dass die Adresse korrekt ist.',
      address: 'Adresse',
      amount_placeholder: 'Betrag (in KSOC)',
      fee_placeholder: 'plus Gebühr (in KSOC)',
      note_placeholder: 'Notiz',
      cancel: 'Abbrechen',
      scan: 'Scan',
      send: 'Senden',
      create: 'Erstellen',
      remaining_balance: 'Verfügbarer Betrag',
    },
    confirm: {
      header: 'Bestätigen',
      sendNow: 'Jetzt senden',
    },
    success: {
      done: 'Fertig',
    },
    create: {
      details: 'Details',
      title: 'Transaktion erstellen',
      error: 'Fehler beim Erstellen der Transaktion. Falsche Adresse oder Betrag?',
      go_back: 'Zurück',
      this_is_hex:
        'Das ist die hexadezimale Darstellung der signierten Transaktion und bereit zum Übertragen an das Netzwerk',
      to: 'An',
      amount: 'Betrag',
      fee: 'Gebühr',
      tx_size: 'Größe',
      satoshi_per_byte: 'Satoshi pro Byte',
      memo: 'Memo',
      broadcast: 'Übertragen',
      not_enough_fee: 'Gebühr zu gering. Erhöhe die Gebühr',
    },
  },
  receive: {
    header: 'Erhalten',
    details: {
      title: 'Teile diese Adresse mit dem Zahlenden',
      share: 'Teilen',
      copiedToClipboard: 'In die Zwischenablage kopiert.',
      label: 'Beschreibung',
      create: 'Create',
      setAmount: 'Zu erhaltender Betrag',
    },
    scan_lnurl: 'Scan to receive',
  },
  buyBitcoin: {
    header: 'Kaufe Bitcoin',
    tap_your_address: 'Adresse antippen, um sie in die Zwischenablage zu kopieren:',
    copied: 'In die Zwischenablage kopiert!',
  },
  settings: {
    header: 'Einstellungen',
    plausible_deniability: 'Glaubhafte Täuschung...',
    storage_not_encrypted: 'Speicher nicht verschlüsselt',
    storage_encrypted: 'Speicher verschlüsselt',
    password: 'Passwort',
    password_explain: 'Erstelle das Passwort zum Entschlüsseln des Speichers',
    retype_password: 'Passwort wiederholen',
    passwords_do_not_match: 'Passwörter stimmen nicht überein',
    encrypt_storage: 'Speicher verschlüsseln',
    lightning_settings: 'Lightning Einstellungen',
    lightning_settings_explain:
      'Bitte installier Lndhub, um mit deiner eigenen LND Node zu verbinden' +
      ' und setz seine URL hier in den Einstellungen. Lass das Feld leer, um Standard- ' +
      'LndHub\n (lndhub.io) zu verwenden',
    electrum_settings: 'Electrum Settings',
    electrum_settings_explain: 'Set to blank to use default',
    save: 'Speichern',
    about: 'Über',
    language: 'Sprache',
    currency: 'Währung',
    advanced_options: 'Advanced Options',
    enable_advanced_mode: 'Enable advanced mode',
  },
  plausibledeniability: {
    title: 'Glaubhafte Täuschung',
    help:
      'Unter bestimmten Umständen könntest du dazu gezwungen werden, ' +
      'dein Passwort preiszugeben. Um deine Bitcoins zu sichern, kann ' +
      'Ksoc einen weiteren verschlüsselten Speicher mit einem ' +
      'anderen Passwort erstellen. Unter Druck kannst du das ' +
      'zweite Passwort an Fremde weitergeben. Wenn eingegeben, öffnet ' +
      'Ksoc einen anderen Speicher zur Täuschung. Dies wirkt ' +
      'auf Fremde täuschend echt und dein Hauptspeicher bleibt geheim ' +
      'und sicher.',
    help2:
      'Der andere Speicher ist voll funktional und man kann einen Minimalbetrag für die Glaubhaftigkeit hinterlegen.',
    create_fake_storage: 'Erstelle verschlüsselten Speicher zur Täuschung',
    go_back: 'Zurück',
    create_password: 'Erstelle ein Passwort',
    create_password_explanation:
      'Das Passwort für den täuschenden Speicher darf nicht mit dem deines Hauptspeichers übereinstimmen',
    password_should_not_match:
      'Das Passwort für den täuschenden Speicher darf nicht mit dem deines Hauptspeichers übereinstimmen',
    retype_password: 'Passwort wiederholen',
    passwords_do_not_match: 'Passwörter stimmen nicht überein. Neuer Versuch',
    success: 'Erfolg!',
  },
  lnd: {
    title: 'Beträge verwalten',
    choose_source_wallet: 'Wähle eine Wallet als Zahlungsquelle',
    refill_lnd_balance: 'Lade deine Lightning Wallet auf',
    refill: 'Aufladen',
    withdraw: 'Abheben',
    placeholder: 'Invoice',
    sameWalletAsInvoiceError:
      'Du kannst nicht die Rechnung mit der Wallet begleichen, die du für die Erstellung dieser Rechnung verwendet hast.',
  },
  pleasebackup: {
    title: 'Your wallet is created...',
    text:
      "Please take a moment to write down this mnemonic phrase on a piece of paper. It's your backup you can use to restore the wallet on other device.",
    ok: 'OK, I wrote this down!',
  },
  lndViewInvoice: {
    wasnt_paid_and_expired: 'This invoice was not paid for and has expired',
    has_been_paid: 'This invoice has been paid for',
    please_pay: 'Please pay',
    sats: 'sats',
    for: 'For:',
    additional_info: 'Additional Information',
    open_direct_channel: 'Open direct channel with this node:',
  },
};
