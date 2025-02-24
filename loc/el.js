module.exports = {
  _: {
    storage_is_encrypted: 'Το αρχείο σου είναι κρυπτογραφημένο. Χρειάζεται ένας κωδικός για να αποκρυπτογραφηθεί.',
    enter_password: 'Εισήγαγε κωδικό',
    bad_password: 'Λάθος κωδικός, δοκίμασε ξανά',
    never: 'ποτέ',
    continue: 'Συνέχισε',
    ok: 'Εντάξει',
  },
  wallets: {
    select_wallet: 'Διάλεξε Πορτοφόλι',
    options: 'επιλογές',
    createBitcoinWallet:
      'Δεν έχεις πορτοφόλι Bitcoin. Για να βάλεις χρήματα στο πορτοφόλι Lightning, πρέπει πρώτα να δημιουργήσεις ή να εισάγεις ένα πορτοφόλι Bitcoin. Θα ήθελες να προχωρήσεις ούτως ή άλλως;',
    list: {
      app_name: 'Ksoc',
      title: 'πορτοφόλια',
      header:
        'Ένα πορτοφόλι αποτελείται από ένα μυστικό (το ιδιωτικό κλειδί) και μια διεύθυνση' +
        'την οποία μπορείς να δώσεις σε άλλους για να σε πληρώσουν σε αυτήν.',
      add: 'Πρόσθεσε Πορτοφόλι',
      create_a_wallet: 'Δημιούργησε ένα πορτοφόλι',
      create_a_wallet1: 'Είναι δωρεάν και μπορείς να',
      create_a_wallet2: 'δημιουργήσεις όσα θέλεις',
      latest_transaction: 'τελευταία συναλλαγή',
      empty_txs1: 'Οι συναλλαγές θα εμφανιστούν εδώ,',
      empty_txs2: 'καμία συναλλαγή',
      empty_txs1_lightning:
        'Lightning wallet should be used for your daily transactions. Fees are unfairly cheap and speed is blazing fast.',
      empty_txs2_lightning: '\nTo start using it tap on "manage funds" and topup your balance.',
      tap_here_to_buy: 'Πάτησε εδώ για να αγοράσεις Bitcoin',
    },
    reorder: {
      title: 'Άλλαξε την σειρά των Πορτοφολιών',
    },
    add: {
      title: 'Πρόσθεσε πορτοφόλι',
      description:
        'Μπορείς να σκανάρεις ένα χάρτινο πορτοφόλι (σε WIF - Wallet Import Format), ή να δημιουργήσεις ένα νέο πορτοφόλι. Υποστηρίζουμε πορτοφόλια τύπου Segwit.',
      scan: 'Σκάναρε',
      create: 'Δημιούργησε',
      label_new_segwit: 'Νεό πορτοφόλι τύπου SegWit',
      label_new_lightning: 'Νέο πορτοφόλι Lightning',
      wallet_name: 'όνομα',
      wallet_type: 'τύπος',
      or: 'ή',
      import_wallet: 'Εισήγαγε πορτοφόλι',
      imported: 'Εισήχθηκε',
      coming_soon: 'Σύντομα',
      lightning: 'Lightning',
      bitcoin: 'Bitcoin',
    },
    details: {
      title: 'Πορτοφόλι',
      address: 'Διεύθυνση',
      type: 'Τύπος',
      label: 'Ετικέτα',
      destination: 'προορισμός',
      description: 'περιγραφή',
      are_you_sure: 'Είσαι σίγουρος;',
      yes_delete: 'Ναι, διέγραψε',
      no_cancel: 'Όχι, ακύρωσε',
      delete: 'Διέγραψε',
      save: 'Σώσε',
      delete_this_wallet: 'Διέγραψε το πορτοφόλι',
      export_backup: 'Εξήγαγε / δημιούργησε αντίγραφο ασφαλείας',
      buy_bitcoin: 'Αγόρασε Bitcoin',
      show_xpub: 'Δείξε το XPUB του πορτοφολιού',
    },
    export: {
      title: 'Εξαγωγή πορτοφολιού',
    },
    xpub: {
      title: 'XPUB του πορτοφολιού',
      copiedToClipboard: 'Αντιγράφηκε στο clipboard.',
    },
    import: {
      title: 'Εισαγωγή',
      explanation:
        'Γράψε εδώ το μνημονικό (φράση), το ιδιωτικό κλειδί, το WIF, ή ό,τι άλλο έχεις. Το Ksoc θα προσπαθήσει να μαντέψει το σωστό format και να εισάγει το πορτοφόλι',
      imported: 'Εισήχθη',
      error: 'Η εισαγωγή απέτυχε. Παρακαλούμε σιγουρευτείτε ότι τα δεδομένα που εισάγετε είναι σωστά.',
      success: 'Επιτυχία',
      do_import: 'Εισήγαγε',
      scan_qr: 'ή θέλεις θα σκανάρεις ένα QR code;',
    },
    scanQrWif: {
      go_back: 'Πίσω',
      cancel: 'Ακύρωσε',
      decoding: 'Αποκωδικοποίηση',
      input_password: 'Βάλε τον κωδικό',
      password_explain: 'Αυτό είναι ένα κρυπτογραφημένο ιδιωτικό κλειδί τύπου BIP38',
      bad_password: 'Λάθος κωδικός',
      wallet_already_exists: 'Αυτό το πορτοφόλι υπάρχει ήδη',
      bad_wif: 'Λάθος WIF',
      imported_wif: 'Εισήχθη το WIF ',
      with_address: ' με διεύθυνση ',
      imported_segwit: 'Εισήχθη SegWit',
      imported_legacy: 'Εισήχθη πορτοφόλιο παλαιού τύπου (Legacy)',
      imported_watchonly: 'Εισήχθη πορτοφόλι παρακολούθησης (Watch-only)',
    },
  },
  transactions: {
    list: {
      tabBarLabel: 'Συναλλαγές',
      title: 'συναλλαγές',
      description: 'Λίστα των εισερχόμενων και εξερχόμενων συναλλαγών όλων των πορτοφολιών σου',
      conf: 'conf',
    },
    details: {
      title: 'Συναλλαγή',
      from: 'Εισερχόμενες διευθύνσεις',
      to: 'Εξερχόμενες διευθύνσεις',
      copy: 'Αντέγραψε',
      transaction_details: 'Λεπτομέρειες συναλλαγής',
      show_in_block_explorer: 'Δείξε στον block explorer',
    },
  },
  send: {
    header: 'Στείλε',
    details: {
      title: 'δημιούργησε συναλλαγή',
      amount_field_is_not_valid: 'Το ποσό δεν είναι σωστό',
      fee_field_is_not_valid: 'Τα έξοδα συναλλαγής δεν είναι σωστά',
      address_field_is_not_valid: 'Η διεύθυνση δεν είναι σωστή',
      total_exceeds_balance: 'Δεν έχετε αρκετό υπόλοιπο για να στείλετε αυτό το ποσό.',
      create_tx_error: 'Σφάλμα στην δημιουργία της συναλλαγής. Σιγουρευτείτε ότι η διεύθυνση είναι σωστή.',
      address: 'διεύθυνση',
      amount_placeholder: 'ποσό πληρωμής (σε KSOC)',
      fee_placeholder: 'συν έξοδα συναλλαγής (σε KSOC)',
      note_placeholder: 'Σημείωση',
      cancel: 'Ακύρωση',
      scan: 'Σκάναρε',
      send: 'Στείλε',
      create: 'Δημιούργησε',
      remaining_balance: 'Υπόλοιπο',
    },
    confirm: {
      header: 'Επικύρωση',
      sendNow: 'Στείλε τώρα',
    },
    success: {
      done: 'Ολοκληρώθηκε',
    },
    create: {
      details: 'Λεπτομέρειες',
      title: 'δημιούργησε συναλλαγή',
      error: 'Σφάλμα στη δημιουργία συναλλαγής. Λάθος διεύθυνση ή ποσό συναλλαγής;',
      go_back: 'Πίσω',
      this_is_hex: 'Αυτή είναι η υπογεγραμμένη συναλλαγή σε μορφή hex και είναι έτοιμη για αποστολή στο δίκτυο.',
      to: 'Προς',
      amount: 'Ποσό',
      fee: 'Έξοδα',
      tx_size: 'Μέγεθος συναλλαγής',
      satoshi_per_byte: 'Satoshi ανά byte',
      memo: 'Σημείωση',
      broadcast: 'Στείλε στο δίκτυο',
      not_enough_fee: 'Τα έξοδα συναλλαγής δεν είναι αρκετά. Αυξήστε τα.',
    },
  },
  receive: {
    header: 'Λήψη',
    details: {
      title: 'Δώσε αυτήν τη διεύθυνση στον πληρωτή',
      share: 'Δώσε',
      copiedToClipboard: 'Αντιγράφηκε στο clipboard.',
      label: 'Περιγραφή',
      create: 'Δημιούργησε',
      setAmount: 'Λάβε με ποσό',
    },
    scan_lnurl: 'Scan to receive',
  },
  buyBitcoin: {
    header: 'Αγόρασε Bitcoin',
    tap_your_address: 'Πάτησε στην διεύθυνσή σου για να αντιγραφεί στο clipboard:',
    copied: 'Αντιγράφηκε στο Clipboard!',
  },
  settings: {
    header: 'ρυθμίσεις',
    plausible_deniability: 'Εύλογη δυνατότητα άρνησης...',
    storage_not_encrypted: 'Το αρχείο δεν είναι κρυπτογραφημένο',
    storage_encrypted: 'Το αρχείο είναι κρυπτογραφημένο',
    password: 'Κωδικός',
    password_explain: 'Δώσε ένα κωδικό για την κρυπτογράφηση του αρχείου',
    retype_password: 'Ξαναδώσε τον κωδικό',
    passwords_do_not_match: 'Οι κωδικοί δεν είναι ίδιοι',
    encrypt_storage: 'Κρυπτογράφησε το αρχείο',
    lightning_settings: 'Ρυθμίσεις Lightning',
    lightning_settings_explain:
      'Για να συνδεθείτε στον δικό σας κόμβο LND παρακαλούμε εγκαταστήστε το LndHub' +
      ' και βάλτε το URL του εδώ. Αφήστε το κενό για να χρησιμοποιήσετε το LNDHub της Ksoc (lndhub.io). Αφού σώσετε τις ρυθμίσεις τυχόν νέα πορτοφόλια που θα δημιουργήσετε θα συνδεθούν στο LNDHub που επιλέξατε.',
    electrum_settings: 'Electrum Settings',
    electrum_settings_explain: 'Set to blank to use default',
    save: 'Σώσε',
    about: 'Σχετικά',
    language: 'Γλώσσα',
    currency: 'Νόμισμα',
    advanced_options: 'Advanced Options',
    enable_advanced_mode: 'Enable advanced mode',
  },
  plausibledeniability: {
    title: 'Εύλογη δυνατότητα άρνησης',
    help:
      'Μπορεί κάποια στιγμή να υποχρεωθείτε να αποκαλύψετε τον ' +
      'κωδικό σας. Για να προστατέψετε τα χρήματά σας, το Ksoc μπορεί να δημιουργήσει ένα εναλλακτικό ' +
      'κρυπτογραφημένο αρχείο με διαφορετικό κωδικό. Εάν σας υποχρεώσουν, ' +
      'μπορείτε να αποκαλύψετε αυτόν τον δεύτερο κωδικό. Κάποιος που θα τον ' +
      'βάλει στο Ksoc θα δει ένα μόνο ένα ψεύτικο αρχείο που μοιάζει ' +
      'κανονικό, προστατεύοντας έτσι το κανονικό σας αρχείο και ' +
      'τα χρήματά σας.',
    help2:
      'Το νέο αρχείο θα είναι πλήρως λειτουργικό, και μπορείτε να βάλετε εκεί ' +
      'κάποια ελάχιστα χρήματα για να μοιάζει αληθινό.',
    create_fake_storage: 'Δημιούργησε ένα ψεύτικο κρυπτογραφημένο αρχείο',
    go_back: 'Πίσω',
    create_password: 'Δώσε έναν κωδικό',
    create_password_explanation:
      'Ο κωδικός του ψεύτικου αρχείου δεν πρέπει να είναι ίδιος με τον κωδικό του πραγματικού αρχείου',
    password_should_not_match:
      'Ο κωδικός του ψεύτικου αρχείου δεν πρέπει να είναι ίδιος με τον κωδικό του πραγματικού αρχείου',
    retype_password: 'Ξαναδώσε τον κωδικό',
    passwords_do_not_match: 'Οι κωδικοί δεν είναι ίδιοι, δοκίμασε ξανά',
    success: 'Επιτυχία',
  },
  lnd: {
    title: 'Διαχείριση χρημάτων',
    choose_source_wallet: 'Διάλεξε ένα πορτοφόλι',
    refill_lnd_balance: 'Γέμισε το πορτοφόλι Lightning',
    refill: 'Γέμισμα πορτοφολιού',
    withdraw: 'Ανάληψη',
    expired: 'Έληξε',
    placeholder: 'Τιμολόγιο',
    sameWalletAsInvoiceError:
      'Δεν μπορείς να εξοφλήσεις ένα τιμολόγιο από το ίδιο πορτοφόλι με το οποίο δημιουργήθηκε.',
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
