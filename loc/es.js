module.exports = {
  _: {
    storage_is_encrypted: 'Su almacenamiento está cifrado. Se requiere contraseña para descifrarlo.',
    enter_password: 'Introduzca la contraseña',
    bad_password: 'Contraseña incorrecta. Intente nuevamente.',
    never: 'nunca',
    continue: 'Continuar',
    ok: 'OK',
  },
  wallets: {
    options: 'Seleccionar cartera',
    select_wallet: 'opciones',
    createBitcoinWallet:
      'En este momento no tiene ninguna cartera de bitcóin. Para financiar una cartera lightning, se debe crear o importar una cartera de bitcóin. ¿Quiere continuar de todos modos?',
    list: {
      app_name: 'Ksoc',
      title: 'carteras',
      header:
        'Un cartera representa un par de secretos (clave privada) y una dirección que puede compartir para recibir monedas.',
      add: 'Añadir cartera',
      create_a_wallet: 'Crear una cartera',
      create_a_wallet1: 'Es gratis y puede crear tantas',
      create_a_wallet2: 'como desee',
      latest_transaction: 'última transacción',
      empty_txs1: 'Sus transacciones aparecerán aquí,',
      empty_txs2: 'por el momento no hay ninguna',
      empty_txs1_lightning:
        'La cartera lightning se debe usar para sus transacciones diarias. Las tarifas son injustamente baratas y la velocidad es increíblemente rápida.',
      empty_txs2_lightning: '\nPara comenzar a usarla, toque en "gestionar fondos" y cargue su saldo.',
      tap_here_to_buy: 'Toque aquí para comprar bitcoines',
    },
    reorder: {
      title: 'Reorganizar cartera',
    },
    add: {
      title: 'Añadir cartera',
      description:
        'Puede escanear la cartera de papel de respaldo (en WIF, formato de importación de carteras) o crear una nueva cartera. Las carteras SegWit son compatibles por defecto.',
      scan: 'Escanear',
      create: 'Crear',
      label_new_segwit: 'Nuevo SegWit',
      label_new_lightning: 'Nuevo lightning',
      wallet_name: 'nombre',
      wallet_type: 'tipo',
      or: 'o',
      import_wallet: 'Importar cartera',
      imported: 'Importado',
      coming_soon: 'Viene pronto',
      lightning: 'Lightning',
      bitcoin: 'Ksoc',
    },
    details: {
      title: 'Cartera',
      address: 'Dirección',
      type: 'Tipo',
      label: 'Etiqueta',
      delete: 'Eliminar',
      save: 'Guardar',
      destination: 'destino',
      description: 'descripción',
      are_you_sure: '¿Está seguro?',
      yes_delete: 'Sí, eliminar',
      no_cancel: 'No, cancelar',
      delete_this_wallet: 'Eliminar esta cartera',
      export_backup: 'Exportar/guardar',
      buy_bitcoin: 'Comprar bitcóines',
      show_xpub: 'Mostrar cartera XPUB',
    },
    export: {
      title: 'exportación de cartera',
    },
    xpub: {
      title: 'cartera XPUB',
      copiedToClipboard: 'Copiado a portapapeles.',
    },
    import: {
      title: 'importar',
      explanation:
        'Escriba aquí su clave mnemotécnica, clave privada, WIF o cualquier cosa que tenga. Ksoc hará todo lo posible para adivinar el formato correcto e importar su cartera.',
      imported: 'Importado',
      error: 'No se ha podido importar. Asegúrese de que los datos que ha proporcionado son válidos.',
      success: 'Éxito',
      do_import: 'Importar',
      scan_qr: '¿o escanear codigo QR?',
    },
    scanQrWif: {
      go_back: 'Regresar',
      cancel: 'Cancelar',
      decoding: 'Descodificación',
      input_password: 'Introducir contraseña',
      password_explain: 'Esta es la clave privada encriptada BIP38',
      bad_password: 'Contraseña incorrecta',
      wallet_already_exists: 'Esa cartera ya existe',
      bad_wif: 'WIF incorrecto',
      imported_wif: 'WIF importado',
      with_address: 'con dirección',
      imported_segwit: 'SegWit importado',
      imported_legacy: 'Legado importado',
      imported_watchonly: 'Solo-lectura importado',
    },
  },
  transactions: {
    list: {
      tabBarLabel: 'Transacciones',
      title: 'transacciones',
      description: 'Una lista de las transacciones entrantes o salientes de sus carteras',
      conf: 'conf',
    },
    details: {
      title: 'Transaccion',
      from: 'De',
      to: 'A',
      copy: 'Copiar',
      transaction_details: 'Detalles de la transacción',
      show_in_block_explorer: 'Mostrar en explorador de bloques',
    },
  },
  send: {
    header: 'Enviar',
    success: {
      done: 'Hecho',
    },
    details: {
      title: 'crear transacción',
      amount_field_is_not_valid: 'La cantidad no es válida',
      fee_field_is_not_valid: 'La tasa no es válida',
      address_field_is_not_valid: 'La dirección no es válida',
      create_tx_error:
        'Se ha producido un error al crear la transacción. Por favor, asegúrese de que la dirección es válida.',
      address: 'dirección',
      amount_placeholder: 'cantidad a enviar (en KSOC)',
      fee_placeholder: 'más tasa de transaccion (en KSOC)',
      note_placeholder: 'nota personal',
      cancel: 'Cancelar',
      scan: 'Escanear',
      send: 'Enviar',
      create: 'Crear factura',
      remaining_balance: 'Saldo restante',
      total_exceeds_balance: 'El monto de envío excede el saldo disponible.',
    },
    confirm: {
      header: 'Confirmar',
      sendNow: 'Enviar ahora',
    },
    create: {
      title: 'Detalles',
      details: 'crear transacción',
      error: 'Error al crear la transacción. ¿La dirección o cantidad son invalidas?',
      go_back: 'Regresar',
      this_is_hex: 'Esta es una transacción hexadecimal, firmada y lista para ser transmitida a la red.',
      to: 'A',
      amount: 'Cantidad',
      fee: 'Tasa',
      tx_size: 'tamaño de la TX',
      satoshi_per_byte: 'Satoshi por byte',
      memo: 'Comentario',
      broadcast: 'Transmitir',
      not_enough_fee: 'Tasa no suficiente. Incremente la tasa',
    },
  },
  receive: {
    header: 'Recibir',
    details: {
      title: 'Compartir esta dirección con el pagador',
      share: 'compartir',
      copiedToClipboard: 'Copiado a portapapeles.',
      label: 'Descripción',
      create: 'Crear',
      setAmount: 'Recibir con cantidad',
    },
    scan_lnurl: 'Escanear para recibir',
  },
  buyBitcoin: {
    header: 'Comprar bitcoines',
    tap_your_address: 'Toque su dirección para copiarla al portapapeles',
    copied: '¡Copiada al portapapeles!',
  },
  settings: {
    header: 'ajustes',
    plausible_deniability: 'Negación plausible...',
    storage_not_encrypted: 'Almacenamiento no cifrado',
    storage_encrypted: 'Almacenamiento cifrado',
    password: 'Contraseña',
    password_explain: 'Cree la contraseña que usará para descifrar el almacenamiento',
    retype_password: 'Introduzca la contraseña nuevamente',
    passwords_do_not_match: 'Las contraseñas no coinciden',
    encrypt_storage: 'Cifrar almacenamiento',
    lightning_settings: 'Ajustes de Lightning',
    electrum_settings: 'Ajustes de Electrum',
    electrum_settings_explain: 'Establecer en blanco para usar predeterminado',
    save: 'Guardar',
    about: 'Acerca de',
    language: 'Idioma',
    currency: 'Moneda',
    advanced_options: 'Opciones avanzadas',
    enable_advanced_mode: 'Habilitar modo avanzado',
  },
  plausibledeniability: {
    title: 'Negación plausible',
    help:
      'En determinadas circunstancias, podría verse obligado a revelar su contraseña. Para mantener sus monedas seguras, Ksoc puede crear otro almacenamiento cifrado con una contraseña diferente. Bajo presión, podría revelar esta contraseña a un tercero. Si se ingresa en Ksoc, desbloqueará un nuevo almacenamiento falso. Esto parecerá legítimo para un tercero, pero mantendrá en secreto su almacenamiento principal con monedas.',
    help2:
      'El nuevo almacenamiento será completamente funcional, y puede almacenar cantidades mínimas para que sea mas creíble.',
    create_fake_storage: 'Crear un almacen cifrado falso',
    go_back: 'Regresar',
    create_password: 'Crear una contraseña',
    create_password_explanation:
      'La contraseña para el almacenamiento falso no puede ser la misma que para su almacen principal.',
    password_should_not_match:
      'La contraseña para el almacenamiento falso no puede ser la misma que para su almacen principal.',
    retype_password: 'Volver a escribir la contraseña',
    passwords_do_not_match: 'Las contraseñas no coinciden, intente nuevamente',
    success: 'Éxito',
  },
  lnd: {
    title: 'gestionar fondos',
    choose_source_wallet: 'Elija una cartera de origen',
    refill_lnd_balance: 'Rellenar el saldo de la cartera Lightning',
    refill: 'Rellenar',
    withdraw: 'Retirar',
    placeholder: 'Factura',
    expired: 'Expirado',
    sameWalletAsInvoiceError: 'No puede pagar una factura con la misma cartera utilizada para crearla.',
  },
  pleasebackup: {
    title: 'Se ha creado su cartera…',
    text:
      'Tómese un momento para escribir esta frase mnemónica en una hoja de papel. Es su copia de seguridad que puede usar para restaurar la cartera en otro dispositivo.',
    ok: '¡OK, la he apuntado!',
  },
  lndViewInvoice: {
    wasnt_paid_and_expired: 'Esfa factura no ha sido pagada y ha expirado',
    has_been_paid: 'Esta factura ha sido pagada',
    please_pay: 'Por favor, pagar',
    sats: 'sats',
    for: 'Para',
    additional_info: 'Información adicional',
    open_direct_channel: 'Abrir canal directo con este nodo',
  },
};
