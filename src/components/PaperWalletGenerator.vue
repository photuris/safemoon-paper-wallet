<template>
  <div>
    <div class="row" id="header">
      <div class="col-xs-12 col-md-12">{{ msg }}</div>
    </div>

    <div id="content" class="row">
      <div class="col-xs-12 col-md-1"></div>
      <div class="col-xs-12 col-md-10">
        <button
          id="gen"
          v-on:click="gen_address"
          class="btn btn-primary"
          type="button"
        >
          <span
            id="spinner"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"></span>
          Generate Paper Wallet
        </button>

        <label v-bind:class="[isActive ? activeClass : inactiveClass]">
          Private Key
        </label>
        <div
          id="private_key"
          class="generated"
          v-bind:class="[isActive ? activeClass : inactiveClass]"
        >{{ private_key }}</div>

        <label v-bind:class="[isActive ? activeClass : inactiveClass]">
          24-word Seed Mnemonic
        </label>
        <div
          id="mnemonic"
          class="generated"
          v-bind:class="[isActive ? activeClass : inactiveClass]"
        >{{ mnemonic }}</div>

        <label v-bind:class="[isActive ? activeClass : inactiveClass]">
          Public Payment Address
        </label>
        <div
          id="public_address"
          class="generated"
          v-bind:class="[isActive ? activeClass : inactiveClass]"
        >{{ public_address }}</div>

        <label v-bind:class="[isActive ? activeClass : inactiveClass]">
          Printable Paper Wallet
        </label>

        <button
          type="button"
          class="btn btn-primary"
          v-on:click="print_wallet"
          v-bind:class="[isActive ? activeClass : inactiveClass]"
        >
          <b-icon icon="printer"></b-icon> Print
        </button>

        <div
          id="paper_wallet"
          v-bind:class="[isActive ? activeClass : inactiveClass]"
        >
          <img src="@/assets/paper.png" id="paper_img" />
          <img id="private_qr" :src="private_qr" alt="Private Key QR" />

          <svg class="seed_phrase" id="seed_phrase_1">
            <text x="0" y="50%" fill="red">{{ private_seed_1 }}</text>
          </svg>
          <svg class="seed_phrase" id="seed_phrase_2">
            <text x="0" y="50%" fill="red">{{ private_seed_2 }}</text>
          </svg>
          <svg class="seed_phrase" id="seed_phrase_3">
            <text x="0" y="50%" fill="red">{{ private_seed_3 }}</text>
          </svg>
          <svg class="seed_phrase" id="seed_phrase_4">
            <text x="0" y="50%" fill="red">{{ private_seed_4 }}</text>
          </svg>
          <svg class="seed_phrase" id="seed_phrase_5">
            <text x="0" y="50%" fill="red">{{ private_seed_5 }}</text>
          </svg>
          <svg class="seed_phrase" id="seed_phrase_6">
            <text x="0" y="50%" fill="red">{{ private_seed_6 }}</text>
          </svg>

          <svg id="svg_private_key">
            <text x="0" y="50%" fill="red">{{ private_key }}</text>
          </svg>

          <img id="public_qr" :src="public_qr" alt="Public Address QR" />

          <svg id="svg_public_address">
            <text x="0" y="15" fill="#004477">{{ public_address }}</text>
          </svg>
        </div>

        <br />
      </div>
      <div class="col-xs-12 col-md-1"></div>
    </div>
  </div>
</template>

<script>
var bip32 = require('bip32')
var bip39 = require('bip39')
var ethUtil = require('ethereumjs-util')
var QR = require('qrious')

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export default {
  name: 'PaperWalletGenerator',
  data () {
    return {
      msg: 'Safemoon Paper Wallet Generator',
      isActive: false,
      activeClass: 'active',
      inactiveClass: 'inactive',
      private_key: '',
      mnemonic: '',
      public_address: '',
      private_qr: '',
      public_qr: '',
      private_seed_1: '',
      private_seed_2: '',
      private_seed_3: '',
      private_seed_4: '',
      private_seed_5: '',
      private_seed_6: ''
    }
  },
  methods: {
    /**
     * Print generated paper wallet.
     */
    print_wallet: async function (event) {
      var divContents = document.getElementById('paper_wallet').innerHTML
      var a = window.open('', '', 'height=500, width=500')
      a.document.write(`
        <html>
        <link
          rel="stylesheet"
          href="./static/paper_wallet_generator_print.css"
        >
        <body>
          ${divContents}
        </body>
        </html>
      `)
      a.document.close()
      a.print()
    },
    /**
     * Generate Private key, Public Address, Seed words, and
     * draw paper wallet.
     */
    gen_address: function (event) {
      // Show spinner on button
      document.getElementById('spinner').style.display = 'inline-block'
      sleep(1000)

      // Generate seed words, mnemonic, and public address
      var wordList = bip39.generateMnemonic(256)
      var privateSeed = bip39.mnemonicToSeedSync(wordList).toString('hex')

      var privateSeedSplit = wordList.split(' ')

      // Split the word list up into 4-word chunks, for display
      var privateSeedDisplay1 = privateSeedSplit.slice(0, 4).join(' ')
      var privateSeedDisplay2 = privateSeedSplit.slice(4, 8).join(' ')
      var privateSeedDisplay3 = privateSeedSplit.slice(8, 12).join(' ')
      var privateSeedDisplay4 = privateSeedSplit.slice(12, 16).join(' ')
      var privateSeedDisplay5 = privateSeedSplit.slice(16, 20).join(' ')
      var privateSeedDisplay6 = privateSeedSplit.slice(20, 24).join(' ')

      var privateSeedDisplay =
        privateSeedDisplay1 + '\n' +
        privateSeedDisplay2 + '\n' +
        privateSeedDisplay3 + '\n' +
        privateSeedDisplay4 + '\n' +
        privateSeedDisplay5 + '\n' +
        privateSeedDisplay6

      var root = bip32.fromSeed(Buffer.from(privateSeed, 'hex'))
      var walletPrivateKey = root.derivePath("m/44'/60'/0'/0/0").privateKey
      var publicAddress =
        ethUtil.privateToAddress(walletPrivateKey).toString('hex')

      // Display generated keys, mnemonics, and addresses
      this.private_key = '0x' + walletPrivateKey.toString('hex')
      this.public_address = '0x' + publicAddress
      this.mnemonic = privateSeedDisplay

      // Generate QR codes
      var privateQR = new QR({size: 380, foreground: '#770000'})
      privateQR.value = this.private_key
      this.private_qr = privateQR.toDataURL()

      var publicQR = new QR({size: 380, foreground: '#005577'})
      publicQR.value = this.public_address
      this.public_qr = publicQR.toDataURL()

      this.private_seed_1 = privateSeedDisplay1
      this.private_seed_2 = privateSeedDisplay2
      this.private_seed_3 = privateSeedDisplay3
      this.private_seed_4 = privateSeedDisplay4
      this.private_seed_5 = privateSeedDisplay5
      this.private_seed_6 = privateSeedDisplay6

      // Display populated form elements
      this.isActive = true
      document.getElementById('spinner').style.display = 'none'
    }
  }
}
</script>

<style scoped>
  @import '../../static/paper_wallet_generator.css';
</style>
