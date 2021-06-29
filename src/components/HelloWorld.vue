<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button id="gen" v-on:click = "genrnd">Generate Paper Wallet</button><br />
    <label v-bind:class="[isActive ? activeClass : inactiveClass]">Private Key</label>
    <div id="rnd" class="generated" v-bind:class="[isActive ? activeClass : inactiveClass]">{{ private_key }}</div>

    <label v-bind:class="[isActive ? activeClass : inactiveClass]">12-word Seed Mnemonic</label>
    <div id="mnemonic" class="generated" v-bind:class="[isActive ? activeClass : inactiveClass]">{{ mnemonic }}</div>

    <label v-bind:class="[isActive ? activeClass : inactiveClass]">Public Payment Address</label>
    <div id="public_address" class="generated"  v-bind:class="[isActive ? activeClass : inactiveClass]">{{ public_address }}</div>
  </div>
</template>

<script>
var bip32 = require('bip32')
var bip39 = require('bip39')
var ethUtil = require('ethereumjs-util')

export default {
  name: 'Safemoon Paper Wallet Generator',
  data () {
    return {
      msg: 'Safemoon Paper Wallet Generator',
      isActive: false,
      activeClass: 'active',
      inactiveClass: 'inactive',
      private_key: '',
      mnemonic: '',
      public_address: ''
    }
  },
  methods: {
    genrnd: function (event) {
      // Generate seed words, mnemonic, and public address
      var wordList = bip39.generateMnemonic(256)
      var privateSeed = bip39.mnemonicToSeedSync(wordList).toString('hex')
      var root = bip32.fromSeed(Buffer.from(privateSeed, 'hex'))
      var walletPrivateKey = root.derivePath("m/44'/60'/0'/0/0").privateKey
      var publicAddress =
        ethUtil.privateToAddress(walletPrivateKey).toString('hex')

      // Display generated keys, mnemonics, and addresses
      this.private_key = '0x' + walletPrivateKey.toString('hex')
      this.public_address = '0x' + publicAddress
      this.mnemonic = wordList

      this.isActive = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  .button {
    border: none;
    border-radius: 2px;
  }

  .inactive {
    display: none !important;
  }

  .active {
    display: block !important;
  }

  label {
    margin-top: 14px;
  }

  div.generated {
    font-family: Consolas, "Courier New", Courier, monospace;
    font-weight: bold;
  }

  div#rnd {
    text-align: center !important;
    border: none !important;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  div#mnemonic {
    width: 350px;
    text-align: left !important;
    font-family: Consolas, "Courier New", Courier, monospace;
    font-weight: bold;
    border: none !important;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  a {
    color: #42b983;
  }
</style>
