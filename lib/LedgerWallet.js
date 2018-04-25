"use strict";

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _values = require("babel-runtime/core-js/object/values");

var _values2 = _interopRequireDefault(_values);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _ledgerco = require("ledgerco");

var _ledgerco2 = _interopRequireDefault(_ledgerco);

var _stripHexPrefix = require("strip-hex-prefix");

var _stripHexPrefix2 = _interopRequireDefault(_stripHexPrefix);

var _ethereumjsTx = require("ethereumjs-tx");

var _ethereumjsTx2 = _interopRequireDefault(_ethereumjsTx);

var _promiseTimeout = require("promise-timeout");

var _u2fApi = require("./u2f-api");

var _u2fApi2 = _interopRequireDefault(_u2fApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isNode = typeof window === "undefined";

if (!isNode && window.u2f === undefined) {
  window.u2f = _u2fApi2.default;
}

var NOT_SUPPORTED_ERROR_MSG = "LedgerWallet uses U2F which is not supported by your browser. " + "Use Chrome, Opera or Firefox with a U2F extension." + "Also make sure you're on an HTTPS connection";
/**
 *  @class LedgerWallet
 *
 *
 *  Paths:
 *  Minimum Nano Ledger S accepts are:
 *
 *   * 44'/60'
 *   * 44'/61'
 *
 *  MyEtherWallet.com by default uses the range which is not compatible with
 *  BIP44/EIP84
 *
 *   * 44'/60'/0'/n
 *
 *  Note: no hardened derivation on the `n`
 *
 *  @see https://github.com/MetaMask/provider-engine
 *  @see https://github.com/ethereum/wiki/wiki/JavaScript-API
 */
var allowedHdPaths = ["44'/60'", "44'/61'"];

var LedgerWallet = function () {
  function LedgerWallet(getNetworkId, path) {
    var askForOnDeviceConfirmation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    (0, _classCallCheck3.default)(this, LedgerWallet);

    this.askForOnDeviceConfirmation = askForOnDeviceConfirmation;
    this.getNetworkId = getNetworkId;
    this.isU2FSupported = null;
    this.connectionOpened = false;
    this.getAppConfig = this.getAppConfig.bind(this);
    this.getAccounts = this.getAccounts.bind(this);
    this.getMultipleAccounts = this.getMultipleAccounts.bind(this);
    this.signTransaction = this.signTransaction.bind(this);
    this.signMessage = this.signMessage.bind(this);
    this.getLedgerConnection = this.getLedgerConnection.bind(this);
    this.setDerivationPath = this.setDerivationPath.bind(this);
    this.setDerivationPath(path);
  }

  (0, _createClass3.default)(LedgerWallet, [{
    key: "init",
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return LedgerWallet.isSupported();

              case 2:
                this.isU2FSupported = _context.sent;

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function init() {
        return _ref.apply(this, arguments);
      }

      return init;
    }()

    /**
     * Checks if the browser supports u2f.
     * Currently there is no good way to do feature-detection,
     * so we call getApiVersion and wait for 100ms
     */

  }, {
    key: "getLedgerConnection",
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this.connectionOpened) {
                  _context2.next = 4;
                  break;
                }

                throw new Error("You can only have one ledger connection active at a time");

              case 4:
                this.connectionOpened = true;
                // eslint-disable-next-line new-cap
                _context2.t0 = _ledgerco2.default.eth;

                if (!isNode) {
                  _context2.next = 12;
                  break;
                }

                _context2.next = 9;
                return _ledgerco2.default.comm_node.create_async();

              case 9:
                _context2.t1 = _context2.sent;
                _context2.next = 15;
                break;

              case 12:
                _context2.next = 14;
                return _ledgerco2.default.comm_u2f.create_async();

              case 14:
                _context2.t1 = _context2.sent;

              case 15:
                _context2.t2 = _context2.t1;
                return _context2.abrupt("return", new _context2.t0(_context2.t2));

              case 17:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getLedgerConnection() {
        return _ref2.apply(this, arguments);
      }

      return getLedgerConnection;
    }()
  }, {
    key: "closeLedgerConnection",
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(eth) {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this.connectionOpened = false;
                _context3.next = 3;
                return eth.comm.close_async();

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function closeLedgerConnection(_x2) {
        return _ref3.apply(this, arguments);
      }

      return closeLedgerConnection;
    }()
  }, {
    key: "setDerivationPath",
    value: function setDerivationPath(path) {
      var newPath = path || "44'/60'/0'/0";
      if (!allowedHdPaths.some(function (hdPref) {
        return newPath.startsWith(hdPref);
      })) {
        throw new Error("hd derivation path for Nano Ledger S may only start [" + allowedHdPaths + "], " + newPath + " was provided");
      }
      this.path = newPath;
    }

    /**
     * @typedef {function} failableCallback
     * @param error
     * @param result
     * */

    /**
     * Gets the version of installed Ethereum app
     * Check the isSupported() before calling that function
     * otherwise it never returns
     * @param {failableCallback} callback
     * @param ttl - timeout
     */
    // TODO: order of parameters should be reversed so it follows pattern parameter callback and can be promisfied

  }, {
    key: "getAppConfig",
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(callback, ttl) {
        var _this = this;

        var eth, cleanupCallback;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (this.isU2FSupported) {
                  _context4.next = 3;
                  break;
                }

                callback(new Error(NOT_SUPPORTED_ERROR_MSG), null);
                return _context4.abrupt("return");

              case 3:
                _context4.next = 5;
                return this.getLedgerConnection();

              case 5:
                eth = _context4.sent;

                cleanupCallback = function cleanupCallback(error, data) {
                  _this.closeLedgerConnection(eth);
                  callback(error, data);
                };

                (0, _promiseTimeout.timeout)(eth.getAppConfiguration_async(), ttl).then(function (config) {
                  return cleanupCallback(null, config);
                }).catch(function (error) {
                  return cleanupCallback(error);
                });

              case 8:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getAppConfig(_x3, _x4) {
        return _ref4.apply(this, arguments);
      }

      return getAppConfig;
    }()
  }, {
    key: "getMultipleAccounts",
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(derivationPath, indexOffset, accountsNo) {
        var eth, pathComponents, chainCode, addresses, i, path, address;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                eth = null;

                if (this.isU2FSupported) {
                  _context5.next = 3;
                  break;
                }

                throw new Error(NOT_SUPPORTED_ERROR_MSG);

              case 3:
                _context5.prev = 3;
                pathComponents = LedgerWallet.obtainPathComponentsFromDerivationPath(derivationPath);
                chainCode = false; // Include the chain code

                _context5.next = 8;
                return this.getLedgerConnection();

              case 8:
                eth = _context5.sent;
                addresses = {};
                i = indexOffset;

              case 11:
                if (!(i < indexOffset + accountsNo)) {
                  _context5.next = 20;
                  break;
                }

                path = pathComponents.basePath + (pathComponents.index + i).toString();
                // eslint-disable-next-line no-await-in-loop

                _context5.next = 15;
                return eth.getAddress_async(path, this.askForOnDeviceConfirmation, chainCode);

              case 15:
                address = _context5.sent;

                addresses[path] = address.address;

              case 17:
                i += 1;
                _context5.next = 11;
                break;

              case 20:
                return _context5.abrupt("return", addresses);

              case 21:
                _context5.prev = 21;

                if (!(eth !== null)) {
                  _context5.next = 25;
                  break;
                }

                _context5.next = 25;
                return this.closeLedgerConnection(eth);

              case 25:
                return _context5.finish(21);

              case 26:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[3,, 21, 26]]);
      }));

      function getMultipleAccounts(_x5, _x6, _x7) {
        return _ref5.apply(this, arguments);
      }

      return getMultipleAccounts;
    }()

    /**
     * PathComponent contains derivation path divided into base path and index.
     * @typedef {Object} PathComponent
     * @property {string} basePath - Base path of derivation path.
     * @property {number} index - index of addresses.
     */

    /**
     * Returns derivation path components: base path (ex 44'/60'/0'/) and index
     * used by getMultipleAccounts.
     * @param derivationPath
     * @returns {PathComponent} PathComponent
     */

  }, {
    key: "signTransactionAsync",
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(txData) {
        var eth, tx, chainId, hex, result, signedChainId;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                eth = null;

                if (this.isU2FSupported) {
                  _context6.next = 3;
                  break;
                }

                throw new Error(NOT_SUPPORTED_ERROR_MSG);

              case 3:
                _context6.prev = 3;

                // Encode using ethereumjs-tx
                tx = new _ethereumjsTx2.default(txData);
                _context6.t0 = parseInt;
                _context6.next = 8;
                return this.getNetworkId();

              case 8:
                _context6.t1 = _context6.sent;
                chainId = (0, _context6.t0)(_context6.t1, 10);


                // Set the EIP155 bits
                tx.raw[6] = Buffer.from([chainId]); // v
                tx.raw[7] = Buffer.from([]); // r
                tx.raw[8] = Buffer.from([]); // s

                // Encode as hex-rlp for Ledger
                hex = tx.serialize().toString("hex");
                _context6.next = 16;
                return this.getLedgerConnection();

              case 16:
                eth = _context6.sent;
                _context6.next = 19;
                return eth.signTransaction_async(this.path, hex);

              case 19:
                result = _context6.sent;


                // Store signature in transaction
                tx.v = Buffer.from(result.v, "hex");
                tx.r = Buffer.from(result.r, "hex");
                tx.s = Buffer.from(result.s, "hex");

                // EIP155: v should be chain_id * 2 + {35, 36}
                signedChainId = Math.floor((tx.v[0] - 35) / 2);

                if (!(signedChainId !== chainId)) {
                  _context6.next = 26;
                  break;
                }

                throw new Error("Invalid signature received. Please update your Ledger Nano S.");

              case 26:
                return _context6.abrupt("return", "0x" + tx.serialize().toString("hex"));

              case 27:
                _context6.prev = 27;

                if (!(eth !== null)) {
                  _context6.next = 31;
                  break;
                }

                _context6.next = 31;
                return this.closeLedgerConnection(eth);

              case 31:
                return _context6.finish(27);

              case 32:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[3,, 27, 32]]);
      }));

      function signTransactionAsync(_x8) {
        return _ref6.apply(this, arguments);
      }

      return signTransactionAsync;
    }()
  }, {
    key: "signMessageAsync",
    value: function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(msgData) {
        var eth, result, v, vHex;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (this.isU2FSupported) {
                  _context7.next = 2;
                  break;
                }

                throw new Error(NOT_SUPPORTED_ERROR_MSG);

              case 2:
                eth = null;
                _context7.prev = 3;
                _context7.next = 6;
                return this.getLedgerConnection();

              case 6:
                eth = _context7.sent;
                _context7.next = 9;
                return eth.signPersonalMessage_async(this.path, (0, _stripHexPrefix2.default)(msgData.data));

              case 9:
                result = _context7.sent;

                // v should be tranmitted with chainCode (27) still added to be compatible with most signers like metamask, parity and geth
                v = parseInt(result.v, 10);
                vHex = v.toString(16);

                if (vHex.length < 2) {
                  vHex = "0" + v;
                }
                return _context7.abrupt("return", "0x" + result.r + result.s + vHex);

              case 14:
                _context7.prev = 14;

                if (!(eth !== null)) {
                  _context7.next = 18;
                  break;
                }

                _context7.next = 18;
                return this.closeLedgerConnection(eth);

              case 18:
                return _context7.finish(14);

              case 19:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this, [[3,, 14, 19]]);
      }));

      function signMessageAsync(_x9) {
        return _ref7.apply(this, arguments);
      }

      return signMessageAsync;
    }()

    /**
     * Gets a list of accounts from a device - currently it's returning just
     * first one according to derivation path
     * @param {failableCallback} callback
     */

  }, {
    key: "getAccounts",
    value: function getAccounts(callback) {
      this.getMultipleAccounts(this.path, 0, 1).then(function (res) {
        return callback(null, (0, _values2.default)(res));
      }).catch(function (err) {
        return callback(err, null);
      });
    }

    /**
     * Signs txData in a format that ethereumjs-tx accepts
     * @param {object} txData - transaction to sign
     * @param {failableCallback} callback - callback
     */

  }, {
    key: "signTransaction",
    value: function signTransaction(txData, callback) {
      this.signTransactionAsync(txData).then(function (res) {
        return callback(null, res);
      }).catch(function (err) {
        return callback(err, null);
      });
    }
  }, {
    key: "signMessage",
    value: function signMessage(txData, callback) {
      this.signMessageAsync(txData).then(function (res) {
        return callback(null, res);
      }).catch(function (err) {
        return callback(err, null);
      });
    }
  }], [{
    key: "isSupported",
    value: function isSupported() {
      return new _promise2.default(function (resolve) {
        if (isNode) {
          resolve(true);
        }
        if (window.u2f && !window.u2f.getApiVersion) {
          // u2f object is found (Firefox with extension)
          resolve(true);
        } else {
          // u2f object was not found. Using Google polyfill
          var intervalId = setTimeout(function () {
            resolve(false);
          }, 3000);
          _u2fApi2.default.getApiVersion(function () {
            clearTimeout(intervalId);
            resolve(true);
          });
        }
      });
    }
  }, {
    key: "obtainPathComponentsFromDerivationPath",
    value: function obtainPathComponentsFromDerivationPath(derivationPath) {
      // check if derivation path follows 44'/60'/x'/n pattern
      var regExp = /^(44'\/6[0|1]'\/\d+'?\/)(\d+)$/;
      var matchResult = regExp.exec(derivationPath);
      if (matchResult === null) {
        throw new Error("To get multiple accounts your derivation path must follow pattern 44'/60|61'/x'/n ");
      }

      return { basePath: matchResult[1], index: parseInt(matchResult[2], 10) };
    }
  }]);
  return LedgerWallet;
}();

module.exports = LedgerWallet;