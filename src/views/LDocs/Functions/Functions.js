import firebase from "firebase/app";
import "firebase/messaging";
import axios from "axios";
import dateFormat from "dateformat";
import { firebaseConfig } from "../../../config/Firebase";
import jwt from "jsonwebtoken";
import { useHistory } from "react-router-dom";
import Swal from 'sweetalert2'
import moment from "moment";
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
const messaging = firebase.messaging();
var BOTS = [
  "\\+https:\\/\\/developers.google.com\\/\\+\\/web\\/snippet\\/",
  "googlebot",
  "baiduspider",
  "gurujibot",
  "yandexbot",
  "slurp",
  "msnbot",
  "bingbot",
  "facebookexternalhit",
  "linkedinbot",
  "twitterbot",
  "slackbot",
  "telegrambot",
  "applebot",
  "pingdom",
  "tumblr ",
  "Embedly",
  "spbot",
];
var IS_BOT_REGEXP = new RegExp("^.*(" + BOTS.join("|") + ").*$");

export const getToken = () => {
  return new Promise((res, rej) => {
    messaging
      .getToken({
        vapidKey:
          "BMJe3ulY2GQsme1JTdoUXn0BGOUwmzE5FoWHomcfeC98R73CUCvwpVOFYw1p3plWShjMcGLdyyG8KDpvVvA8m6o",
      })
      .then((currentToken) => {
        if (currentToken) {
          res(currentToken);
          // setTokenFound(true);
          // Track the token -> client mapping, by sending to backend server
          // show on the UI that permission is secured
        } else {
          rej(
            "No registration token available. Request permission to generate one."
          );
          // setTokenFound(false);
          // shows on the UI that permission is required
        }
      })
      .catch((err) => {
        rej("An error occurred while retrieving token. " + err);
        // catch error while creating client token
      });
  });
};

export function addZeroes(num) {
  num = typeof num == "string" ? num : num.toString();
  var value = Number(num);
  var res = num.toString().split(".");
  if (res.length == 1 || res[1].length < 1) {
    value = value.toFixed(2);
  }
  return value;
}

export const formatDateTime = (date) => {
  let Token = localStorage.getItem("cooljwt");
  let user = jwt.decode(Token);
  var offset;
  if (user.tenantConfigs) {
    let tenantConfig = user.tenantConfigs;
    let timeStamp = tenantConfig.timeZone;
    offset = timeStamp.offset * 60;
  } else {
    offset = moment().utcOffset();
  }
  var now = new Date(date);
  const someday = moment(now)
    .utcOffset(offset)
    .format("DD-MM-YYYY hh:mm A");
  return someday;
};

export const formatDate = (date) => {
  let Token = localStorage.getItem("cooljwt");
  let user = jwt.decode(Token);
  var offset;
  if (user.tenantConfigs) {
    let tenantConfig = user.tenantConfigs;
    let timeStamp = tenantConfig.timeZone;
    offset = timeStamp.offset * 60;
  } else {
    offset = moment().utcOffset();
  }
  var now = new Date(date);
  const someday = moment(now)
    .utcOffset(offset)
    .format("DD-MM-YYYY");
  return someday;
};

export const currentTracking = (trackingStatus) => {
  let currentStatus;
  let activeStep;
  switch (trackingStatus.current_status) {
    case "received":
      currentStatus = trackingStatus.received.status;
      activeStep = { val: 0, status: currentStatus };
      break;
    case "initialReview":
      currentStatus = trackingStatus.initialReview.status;
      if (currentStatus) {
        activeStep = { val: 1, status: currentStatus };
      } else {
        activeStep = { val: 0, status: currentStatus };
      }
      break;
    case "underReview":
      currentStatus = trackingStatus.underReview.status;
      if (currentStatus) {
        activeStep = { val: 2, status: currentStatus };
      } else {
        activeStep = { val: 1, status: currentStatus };
      }
      break;
    case "underApprove":
      currentStatus = trackingStatus.underApprove.status;
      if (currentStatus) {
        activeStep = { val: 3, status: currentStatus };
      } else {
        activeStep = { val: 2, status: currentStatus };
      }
      break;
    case "paymentInProcess":
      currentStatus = trackingStatus.paymentInProcess.status;
      if (currentStatus) {
        activeStep = { val: 4, status: currentStatus };
      } else {
        activeStep = { val: 3, status: currentStatus };
      }
      break;
    case "paid":
      currentStatus = trackingStatus.paid.status;
      if (currentStatus) {
        activeStep = { val: 4, status: currentStatus };
      } else {
        activeStep = { val: 3, status: currentStatus };
      }
      break;
  }
  return activeStep;
};


export const currentTrackingAr = (trackingStatus) => {
  let currentStatus;
  let activeStep;
  console.log(trackingStatus);
  switch (trackingStatus.current_status) {
    case "invoiceDraft":
      currentStatus = trackingStatus.invoiceDraft.status;
      activeStep = { val: 0, status: currentStatus };
      break;
    case "underReview":
      currentStatus = trackingStatus.underReview.status;
      if (currentStatus) {
        activeStep = { val: 1, status: currentStatus };
      } else {
        activeStep = { val: 0, status: currentStatus };
      }
      break;
    case "underApprove":
      currentStatus = trackingStatus.underApprove.status;
      if (currentStatus) {
        activeStep = { val: 2, status: currentStatus };
      } else {
        activeStep = { val: 1, status: currentStatus };
      }
      break;
    case "sentToClient":
      currentStatus = trackingStatus.sentToClient.status;
      if (currentStatus) {
        activeStep = { val: 3, status: currentStatus };
      } else {
        activeStep = { val: 2, status: currentStatus };
      }
      break;
    case "paid":
      currentStatus = trackingStatus.paid.status;
      if (currentStatus) {
        activeStep = { val: 4, status: currentStatus };
      } else {
        activeStep = { val: 3, status: currentStatus };
      }
      break;
  }
  console.log(activeStep);
  return activeStep;
};


export const successAlert = (msg) => {
  Swal.fire({
    title: "Success",
    text: msg,
    icon: "success",
    showCancelButton: false,
    confirmButtonColor: "#49b34e",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ok",
  });
};

export const errorAlert = (msg) => {
  Swal.fire({
    title: "Error",
    text: msg,
    icon: "error",
    showCancelButton: false,
    confirmButtonColor: "#49b34e",
    cancelButtonColor: "#d33",
    confirmButtonText: "OK",
  });
};


export const msgAlert = (msg) => {
  Swal.fire({
    title: "INFO",
    text: msg,
    icon: "warning",
    showCancelButton: false,
    confirmButtonColor: "#49b34e",
    cancelButtonColor: "#d33",
    confirmButtonText: "Success",
  });
};

export const validateInvoice = async (row, Token, isAr) => {
  return new Promise((res, rej) => {
    axios({
      method: "post", //you can set what request you want to be
      url:  isAr ? `${process.env.REACT_APP_LDOCS_API_URL}/invoice/getSingleInvoiceByVersion/ar`: `${process.env.REACT_APP_LDOCS_API_URL}/invoice/getSingleInvoiceByVersion/ap`,
      data: {
        invoiceId: row.invoiceId,
        version: row.version,
        vendorId:  isAr ?  null : row.vendorId,
        clientId:  isAr ? row.clientId: null,
      },
      headers: {
        cooljwt: Token,
      },
    })
      .then(async (invoiceRes) => {
        const invoice = invoiceRes.data;
        const  isAR = invoice.isAR;
        axios({
          method: "get",
          url: isAR ? `${process.env.REACT_APP_LDOCS_API_BOOKCHAIN_URL}/api/invoice/validate-invoice/${invoice.clientId}-${row.invoiceId}-${row.version}` : `${process.env.REACT_APP_LDOCS_API_BOOKCHAIN_URL}/api/invoice/validate-invoice/${invoice.vendorId}-${row.invoiceId}-${row.version}`,
        })
          .then(async (blockchainRes) => {
            const blockchain = blockchainRes.data.InvoiceData;
            if (invoice !== null || undefined) {
              let isInvoiceDateSame;
              let isVendorIDSame;
              let isItemCountSame;
              let isGrossAmtSame;
              let isOrganizationIDSame;
              let isDiscountPercentageSame;
              let isTaxAmtSame;
              let isNetAmtSame;
              let isTenantIDSame;
              let isCreatedDateSame;
              let isCreatedBySame;
              let isValidate;
              let BlockchainNames;
              let InvoiceNames;
              if (
                new Date(invoice.invoiceDate).getTime() ==
                new Date(blockchain.invoiceDate).getTime()
              ) {
                isInvoiceDateSame = true;
              } else {
                isInvoiceDateSame = false;
              }
              if (invoice.vendorId == blockchain.vendorID) {
                isVendorIDSame = true;
              } else {
                isVendorIDSame = false;
              }
              if (invoice.items.length == blockchain.itemCount) {
                isItemCountSame = true;
              } else {
                isItemCountSame = false;
              }
              if (invoice.grossAmt == blockchain.grossAmt) {
                isGrossAmtSame = true;
              } else {
                isGrossAmtSame = false;
              }
              if (invoice.organizationId == blockchain.organizationID) {
                isOrganizationIDSame = true;
              } else {
                isOrganizationIDSame = false;
              }
              if (invoice.taxAmt == blockchain.taxAmt) {
                isTaxAmtSame = true;
              } else {
                isTaxAmtSame = false;
              }
              if (invoice.discountPercent == blockchain.discountPercent) {
                isDiscountPercentageSame = true;
              } else {
                isDiscountPercentageSame = false;
              }
              if (invoice.netAmt == blockchain.netAmt) {
                isNetAmtSame = true;
              } else {
                isNetAmtSame = false;
              }
              if (invoice.tenantId == blockchain.tenantID) {
                isTenantIDSame = true;
              } else {
                isTenantIDSame = false;
              }
              if (
                new Date(invoice.createdDate).getTime() ==
                new Date(blockchain.createdDate).getTime()
              ) {
                isCreatedDateSame = true;
              } else {
                isCreatedDateSame = false;
              }
              if (invoice.createdBy == blockchain.createdBy) {
                isCreatedBySame = true;
              } else {
                isCreatedBySame = false;
              }
              if (
                !isInvoiceDateSame ||
                !isVendorIDSame ||
                !isItemCountSame ||
                !isGrossAmtSame ||
                !isOrganizationIDSame ||
                !isDiscountPercentageSame ||
                !isTaxAmtSame ||
                !isNetAmtSame ||
                !isTenantIDSame ||
                !isCreatedDateSame ||
                !isCreatedBySame
              ) {
                isValidate = false;
              } else {
                isValidate = true;
              }
              //Gettting Names
              await axios({
                method: "post", //you can set what request you want to be
                url: `${process.env.REACT_APP_LDOCS_API_URL}/invoice/getNameById`,
                data: {
                  organizationId: invoice.organizationId,
                  tenantId: invoice.tenantId,
                  vendorId: invoice.vendorId,
                  clientId: invoice.clientId,
                  userId: invoice.createdBy,
                  isVendor: invoice.createdByVendor,
                },
                headers: {
                  cooljwt: Token,
                },
              })
                .then((res) => {
                  InvoiceNames = res.data;
                })
                .catch((err) => {
                  console.log(err);
                });
              //Gettting Names BlockChain
              await axios({
                method: "post", //you can set what request you want to be
                url: `${process.env.REACT_APP_LDOCS_API_URL}/invoice/getNameById`,
                data: {
                  organizationId: blockchain.organizationID,
                  tenantId: blockchain.tenantID,
                  vendorId: blockchain.vendorID,
                  clientId: blockchain.clientID,
                  userId: blockchain.createdBy,
                  isVendor: invoice.createdByVendor,
                },
                headers: {
                  cooljwt: Token,
                },
              })
                .then((res) => {
                  BlockchainNames = res.data;
                })
                .catch((err) => {
                  console.log(err);
                });
              const ValidationData = {
                "Submit Date": {
                  onChain: dateFormat(blockchain.invoiceDate, "dd-mm-yyyy"),
                  offChain: dateFormat(invoice.invoiceDate, "dd-mm-yyyy"),
                  isSame: isInvoiceDateSame,
                },
                "Vendor ID": {
                  onChain: blockchain.VendorID,
                  offChain: invoice.vendorId,
                  isSame: isVendorIDSame,
                  onChainName: BlockchainNames.vendorName || null,
                  offChainName: InvoiceNames.vendorName || null,
                },
                "Item Count": {
                  onChain: blockchain.itemCount,
                  offChain: invoice.items.length,
                  isSame: isItemCountSame,
                },
                "Gross Amount": {
                  onChain:
                    invoice.FC_currency.Code + addZeroes(blockchain.grossAmt),
                  offChain:
                    invoice.FC_currency.Code + addZeroes(invoice.grossAmt),
                  isSame: isGrossAmtSame,
                },
                "Organization ID": {
                  onChain: blockchain.organizationID,
                  offChain: invoice.organizationId,
                  isSame: isOrganizationIDSame,
                  onChainName: BlockchainNames.organizationName || null,
                  offChainName: InvoiceNames.organizationName || null,
                },
                "Discount Percentage": {
                  onChain: `${blockchain.discountPercentage}%`,
                  offChain: `${invoice.discountPercent}%`,
                  isSame: isDiscountPercentageSame,
                },
                "Tax Amount": {
                  onChain:
                    invoice.FC_currency.Code + addZeroes(blockchain.taxAmt),
                  offChain:
                    invoice.FC_currency.Code + addZeroes(invoice.taxAmt),
                  isSame: isTaxAmtSame,
                },
                "Net Amount": {
                  onChain:
                    invoice.FC_currency.Code + addZeroes(blockchain.netAmt),
                  offChain:
                    invoice.FC_currency.Code + addZeroes(invoice.netAmt),
                  isSame: isNetAmtSame,
                },
                "Tenant ID": {
                  onChain: blockchain.tenantID,
                  offChain: invoice.tenantId,
                  isSame: isTenantIDSame,
                  onChainName: BlockchainNames.tenantName || null,
                  offChainName: InvoiceNames.tenantName || null,
                },
                "Created Date": {
                  onChain: formatDateTime(blockchain.createdDate),
                  offChain: formatDateTime(invoice.createdDate),
                  isSame: isCreatedDateSame,
                },
                "Created By": {
                  onChain: blockchain.createdBy,
                  offChain: invoice.createdBy,
                  isSame: isCreatedBySame,
                  onChainName: BlockchainNames.userName || null,
                  offChainName: InvoiceNames.userName || null,
                },
                Validate: {
                  isSame: isValidate,
                },
              };
              res(ValidationData);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  });
};


export const _IsAr = () => {
  let url = window.location.href;
  console.log(url);
  let is_Ar = url.substring(url.lastIndexOf("/") + 1) == "ar" ? true : url.substring(url.lastIndexOf("/") + 1) == "ar"  ? false : null;
  console.log(is_Ar);
  return is_Ar;
}

export const conversionRate = (
  fc,
  bc,
  currencies,
  amount,
  isNotSymbol,
  isEdit,
  rate
) => {
  const bC = currencies.find((c) => c._id == bc);
  const fC = currencies.find((c) => c._id == fc);
  const bcSymbol = bC ? bC.Code : "";
  const fcRate = isEdit ? rate : fC ? fC.conversionRate : "";
  if (isNotSymbol) {
    return parseFloat(fcRate * amount).toFixed(4);
  } else {
    return fc !== bc
      ? `(${bcSymbol} ${parseFloat(fcRate * amount).toFixed(4)})`
      : "";
  }
};

export const appendScript = (scriptToAppend) => {
  const script = document.createElement("script");
  script.src = scriptToAppend;
  // script.async = true;
  document.getElementsByTagName("head")[0].appendChild(script);
  // document.body.appendChild(script);
};

var DeviceUUID = function(options) {
  options = options ? options : {};
  var defOptions = {
    version: false,
    language: false,
    platform: true,
    os: true,
    pixelDepth: true,
    colorDepth: true,
    resolution: false,
    isAuthoritative: true,
    silkAccelerated: true,
    isKindleFire: true,
    isDesktop: true,
    isMobile: true,
    isTablet: true,
    isWindows: true,
    isLinux: true,
    isLinux64: true,
    isChromeOS: true,
    isMac: true,
    isiPad: true,
    isiPhone: true,
    isiPod: true,
    isAndroid: true,
    isSamsung: true,
    isSmartTV: true,
    isRaspberry: true,
    isBlackberry: true,
    isTouchScreen: true,
    isOpera: false,
    isIE: false,
    isEdge: false,
    isIECompatibilityMode: false,
    isSafari: false,
    isFirefox: false,
    isWebkit: false,
    isChrome: false,
    isKonqueror: false,
    isOmniWeb: false,
    isSeaMonkey: false,
    isFlock: false,
    isAmaya: false,
    isPhantomJS: false,
    isEpiphany: false,
    source: false,
    cpuCores: false,
  };
  for (var key in options) {
    if (options.hasOwnProperty(key) && typeof defOptions[key] !== "undefined") {
      defOptions[key] = options[key];
    }
  }
  this.options = defOptions;
  this.version = "1.0.0";
  this._Versions = {
    Edge: /Edge\/([\d\w\.\-]+)/i,
    Firefox: /firefox\/([\d\w\.\-]+)/i,
    IE: /msie\s([\d\.]+[\d])|trident\/\d+\.\d+;.*[rv:]+(\d+\.\d)/i,
    Chrome: /chrome\/([\d\w\.\-]+)/i,
    Chromium: /(?:chromium|crios)\/([\d\w\.\-]+)/i,
    Safari: /version\/([\d\w\.\-]+)/i,
    Opera: /version\/([\d\w\.\-]+)|OPR\/([\d\w\.\-]+)/i,
    Ps3: /([\d\w\.\-]+)\)\s*$/i,
    Psp: /([\d\w\.\-]+)\)?\s*$/i,
    Amaya: /amaya\/([\d\w\.\-]+)/i,
    SeaMonkey: /seamonkey\/([\d\w\.\-]+)/i,
    OmniWeb: /omniweb\/v([\d\w\.\-]+)/i,
    Flock: /flock\/([\d\w\.\-]+)/i,
    Epiphany: /epiphany\/([\d\w\.\-]+)/i,
    WinJs: /msapphost\/([\d\w\.\-]+)/i,
    PhantomJS: /phantomjs\/([\d\w\.\-]+)/i,
    UC: /UCBrowser\/([\d\w\.]+)/i,
  };
  this._Browsers = {
    Edge: /edge/i,
    Amaya: /amaya/i,
    Konqueror: /konqueror/i,
    Epiphany: /epiphany/i,
    SeaMonkey: /seamonkey/i,
    Flock: /flock/i,
    OmniWeb: /omniweb/i,
    Chromium: /chromium|crios/i,
    Chrome: /chrome/i,
    Safari: /safari/i,
    IE: /msie|trident/i,
    Opera: /opera|OPR/i,
    PS3: /playstation 3/i,
    PSP: /playstation portable/i,
    Firefox: /firefox/i,
    WinJs: /msapphost/i,
    PhantomJS: /phantomjs/i,
    UC: /UCBrowser/i,
  };
  this._OS = {
    Windows10: /windows nt 10\.0/i,
    Windows81: /windows nt 6\.3/i,
    Windows8: /windows nt 6\.2/i,
    Windows7: /windows nt 6\.1/i,
    UnknownWindows: /windows nt 6\.\d+/i,
    WindowsVista: /windows nt 6\.0/i,
    Windows2003: /windows nt 5\.2/i,
    WindowsXP: /windows nt 5\.1/i,
    Windows2000: /windows nt 5\.0/i,
    WindowsPhone8: /windows phone 8\./,
    OSXCheetah: /os x 10[._]0/i,
    OSXPuma: /os x 10[._]1(\D|$)/i,
    OSXJaguar: /os x 10[._]2/i,
    OSXPanther: /os x 10[._]3/i,
    OSXTiger: /os x 10[._]4/i,
    OSXLeopard: /os x 10[._]5/i,
    OSXSnowLeopard: /os x 10[._]6/i,
    OSXLion: /os x 10[._]7/i,
    OSXMountainLion: /os x 10[._]8/i,
    OSXMavericks: /os x 10[._]9/i,
    OSXYosemite: /os x 10[._]10/i,
    OSXElCapitan: /os x 10[._]11/i,
    OSXSierra: /os x 10[._]12/i,
    Mac: /os x/i,
    Linux: /linux/i,
    Linux64: /linux x86_64/i,
    ChromeOS: /cros/i,
    Wii: /wii/i,
    PS3: /playstation 3/i,
    PSP: /playstation portable/i,
    iPad: /\(iPad.*os (\d+)[._](\d+)/i,
    iPhone: /\(iPhone.*os (\d+)[._](\d+)/i,
    Bada: /Bada\/(\d+)\.(\d+)/i,
    Curl: /curl\/(\d+)\.(\d+)\.(\d+)/i,
  };
  this._Platform = {
    Windows: /windows nt/i,
    WindowsPhone: /windows phone/i,
    Mac: /macintosh/i,
    Linux: /linux/i,
    Wii: /wii/i,
    Playstation: /playstation/i,
    iPad: /ipad/i,
    iPod: /ipod/i,
    iPhone: /iphone/i,
    Android: /android/i,
    Blackberry: /blackberry/i,
    Samsung: /samsung/i,
    Curl: /curl/i,
  };

  this.DefaultAgent = {
    isAuthoritative: true,
    isMobile: false,
    isTablet: false,
    isiPad: false,
    isiPod: false,
    isiPhone: false,
    isAndroid: false,
    isBlackberry: false,
    isOpera: false,
    isIE: false,
    isEdge: false,
    isIECompatibilityMode: false,
    isSafari: false,
    isFirefox: false,
    isWebkit: false,
    isChrome: false,
    isKonqueror: false,
    isOmniWeb: false,
    isSeaMonkey: false,
    isFlock: false,
    isAmaya: false,
    isPhantomJS: false,
    isEpiphany: false,
    isDesktop: false,
    isWindows: false,
    isLinux: false,
    isLinux64: false,
    isMac: false,
    isChromeOS: false,
    isBada: false,
    isSamsung: false,
    isRaspberry: false,
    isBot: false,
    isCurl: false,
    isAndroidTablet: false,
    isWinJs: false,
    isKindleFire: false,
    isSilk: false,
    isCaptive: false,
    isSmartTV: false,
    isUC: false,
    isTouchScreen: false,
    silkAccelerated: false,
    colorDepth: -1,
    pixelDepth: -1,
    resolution: [],
    cpuCores: -1,
    language: "unknown",
    browser: "unknown",
    version: "unknown",
    os: "unknown",
    platform: "unknown",
    geoIp: {},
    source: "",
    hashInt: function(string) {
      var hash = 0,
        i,
        chr,
        len;
      if (string.length === 0) {
        return hash;
      }
      for (i = 0, len = string.length; i < len; i++) {
        chr = string.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
      }
      return hash;
    },
    hashMD5: function(string) {
      function rotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
      }

      function addUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = lX & 0x80000000;
        lY8 = lY & 0x80000000;
        lX4 = lX & 0x40000000;
        lY4 = lY & 0x40000000;
        lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);

        if (lX4 & lY4) {
          return lResult ^ 0x80000000 ^ lX8 ^ lY8;
        }
        if (lX4 | lY4) {
          if (lResult & 0x40000000) {
            return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
          } else {
            return lResult ^ 0x40000000 ^ lX8 ^ lY8;
          }
        } else {
          return lResult ^ lX8 ^ lY8;
        }
      }

      function gF(x, y, z) {
        return (x & y) | (~x & z);
      }

      function gG(x, y, z) {
        return (x & z) | (y & ~z);
      }

      function gH(x, y, z) {
        return x ^ y ^ z;
      }

      function gI(x, y, z) {
        return y ^ (x | ~z);
      }

      function gFF(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(gF(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
      }

      function gGG(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(gG(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
      }

      function gHH(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(gH(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
      }

      function gII(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(gI(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
      }

      function convertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWordsTemp1 = lMessageLength + 8;
        var lNumberOfWordsTemp2 =
          (lNumberOfWordsTemp1 - (lNumberOfWordsTemp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWordsTemp2 + 1) * 16;
        var lWordArray = new Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;

        while (lByteCount < lMessageLength) {
          lWordCount = (lByteCount - (lByteCount % 4)) / 4;
          lBytePosition = (lByteCount % 4) * 8;
          lWordArray[lWordCount] =
            lWordArray[lWordCount] |
            (string.charCodeAt(lByteCount) << lBytePosition);
          lByteCount++;
        }

        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] =
          lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
      }

      function wordToHex(lValue) {
        var wordToHexValue = "",
          wordToHexValueTemp = "",
          lByte,
          lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
          lByte = (lValue >>> (lCount * 8)) & 255;
          wordToHexValueTemp = "0" + lByte.toString(16);
          wordToHexValue =
            wordToHexValue +
            wordToHexValueTemp.substr(wordToHexValueTemp.length - 2, 2);
        }
        return wordToHexValue;
      }

      function utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {
          var c = string.charCodeAt(n);
          if (c < 128) {
            utftext += String.fromCharCode(c);
          } else if (c > 127 && c < 2048) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
          } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
          }
        }
        return utftext;
      }

      var x = [];
      var k, AA, BB, CC, DD, a, b, c, d;
      var S11 = 7,
        S12 = 12,
        S13 = 17,
        S14 = 22;
      var S21 = 5,
        S22 = 9,
        S23 = 14,
        S24 = 20;
      var S31 = 4,
        S32 = 11,
        S33 = 16,
        S34 = 23;
      var S41 = 6,
        S42 = 10,
        S43 = 15,
        S44 = 21;
      string = utf8Encode(string);
      x = convertToWordArray(string);
      a = 0x67452301;
      b = 0xefcdab89;
      c = 0x98badcfe;
      d = 0x10325476;

      for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = gFF(a, b, c, d, x[k + 0], S11, 0xd76aa478);
        d = gFF(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
        c = gFF(c, d, a, b, x[k + 2], S13, 0x242070db);
        b = gFF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
        a = gFF(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
        d = gFF(d, a, b, c, x[k + 5], S12, 0x4787c62a);
        c = gFF(c, d, a, b, x[k + 6], S13, 0xa8304613);
        b = gFF(b, c, d, a, x[k + 7], S14, 0xfd469501);
        a = gFF(a, b, c, d, x[k + 8], S11, 0x698098d8);
        d = gFF(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
        c = gFF(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
        b = gFF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
        a = gFF(a, b, c, d, x[k + 12], S11, 0x6b901122);
        d = gFF(d, a, b, c, x[k + 13], S12, 0xfd987193);
        c = gFF(c, d, a, b, x[k + 14], S13, 0xa679438e);
        b = gFF(b, c, d, a, x[k + 15], S14, 0x49b40821);
        a = gGG(a, b, c, d, x[k + 1], S21, 0xf61e2562);
        d = gGG(d, a, b, c, x[k + 6], S22, 0xc040b340);
        c = gGG(c, d, a, b, x[k + 11], S23, 0x265e5a51);
        b = gGG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
        a = gGG(a, b, c, d, x[k + 5], S21, 0xd62f105d);
        d = gGG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = gGG(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
        b = gGG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
        a = gGG(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
        d = gGG(d, a, b, c, x[k + 14], S22, 0xc33707d6);
        c = gGG(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
        b = gGG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
        a = gGG(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
        d = gGG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
        c = gGG(c, d, a, b, x[k + 7], S23, 0x676f02d9);
        b = gGG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
        a = gHH(a, b, c, d, x[k + 5], S31, 0xfffa3942);
        d = gHH(d, a, b, c, x[k + 8], S32, 0x8771f681);
        c = gHH(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
        b = gHH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
        a = gHH(a, b, c, d, x[k + 1], S31, 0xa4beea44);
        d = gHH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
        c = gHH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
        b = gHH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
        a = gHH(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
        d = gHH(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
        c = gHH(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
        b = gHH(b, c, d, a, x[k + 6], S34, 0x4881d05);
        a = gHH(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
        d = gHH(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
        c = gHH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
        b = gHH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
        a = gII(a, b, c, d, x[k + 0], S41, 0xf4292244);
        d = gII(d, a, b, c, x[k + 7], S42, 0x432aff97);
        c = gII(c, d, a, b, x[k + 14], S43, 0xab9423a7);
        b = gII(b, c, d, a, x[k + 5], S44, 0xfc93a039);
        a = gII(a, b, c, d, x[k + 12], S41, 0x655b59c3);
        d = gII(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
        c = gII(c, d, a, b, x[k + 10], S43, 0xffeff47d);
        b = gII(b, c, d, a, x[k + 1], S44, 0x85845dd1);
        a = gII(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
        d = gII(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
        c = gII(c, d, a, b, x[k + 6], S43, 0xa3014314);
        b = gII(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
        a = gII(a, b, c, d, x[k + 4], S41, 0xf7537e82);
        d = gII(d, a, b, c, x[k + 11], S42, 0xbd3af235);
        c = gII(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
        b = gII(b, c, d, a, x[k + 9], S44, 0xeb86d391);
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
      }
      var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
      return temp.toLowerCase();
    },
  };

  this.Agent = {};

  this.getBrowser = function(string) {
    switch (true) {
      case this._Browsers.Edge.test(string):
        this.Agent.isEdge = true;
        return "Edge";
      case this._Browsers.PhantomJS.test(string):
        this.Agent.isPhantomJS = true;
        return "PhantomJS";
      case this._Browsers.Konqueror.test(string):
        this.Agent.isKonqueror = true;
        return "Konqueror";
      case this._Browsers.Amaya.test(string):
        this.Agent.isAmaya = true;
        return "Amaya";
      case this._Browsers.Epiphany.test(string):
        this.Agent.isEpiphany = true;
        return "Epiphany";
      case this._Browsers.SeaMonkey.test(string):
        this.Agent.isSeaMonkey = true;
        return "SeaMonkey";
      case this._Browsers.Flock.test(string):
        this.Agent.isFlock = true;
        return "Flock";
      case this._Browsers.OmniWeb.test(string):
        this.Agent.isOmniWeb = true;
        return "OmniWeb";
      case this._Browsers.Opera.test(string):
        this.Agent.isOpera = true;
        return "Opera";
      case this._Browsers.Chromium.test(string):
        this.Agent.isChrome = true;
        return "Chromium";
      case this._Browsers.Chrome.test(string):
        this.Agent.isChrome = true;
        return "Chrome";
      case this._Browsers.Safari.test(string):
        this.Agent.isSafari = true;
        return "Safari";
      case this._Browsers.WinJs.test(string):
        this.Agent.isWinJs = true;
        return "WinJs";
      case this._Browsers.IE.test(string):
        this.Agent.isIE = true;
        return "IE";
      case this._Browsers.PS3.test(string):
        return "ps3";
      case this._Browsers.PSP.test(string):
        return "psp";
      case this._Browsers.Firefox.test(string):
        this.Agent.isFirefox = true;
        return "Firefox";
      case this._Browsers.UC.test(string):
        this.Agent.isUC = true;
        return "UCBrowser";
      default:
        // If the UA does not start with Mozilla guess the user agent.
        if (
          string.indexOf("Mozilla") !== 0 &&
          /^([\d\w\-\.]+)\/[\d\w\.\-]+/i.test(string)
        ) {
          this.Agent.isAuthoritative = false;
          return RegExp.$1;
        }
        return "unknown";
    }
  };

  this.getBrowserVersion = function(string) {
    var regex;
    switch (this.Agent.browser) {
      case "Edge":
        if (this._Versions.Edge.test(string)) {
          return RegExp.$1;
        }
        break;
      case "PhantomJS":
        if (this._Versions.PhantomJS.test(string)) {
          return RegExp.$1;
        }
        break;
      case "Chrome":
        if (this._Versions.Chrome.test(string)) {
          return RegExp.$1;
        }
        break;
      case "Chromium":
        if (this._Versions.Chromium.test(string)) {
          return RegExp.$1;
        }
        break;
      case "Safari":
        if (this._Versions.Safari.test(string)) {
          return RegExp.$1;
        }
        break;
      case "Opera":
        if (this._Versions.Opera.test(string)) {
          return RegExp.$1 ? RegExp.$1 : RegExp.$2;
        }
        break;
      case "Firefox":
        if (this._Versions.Firefox.test(string)) {
          return RegExp.$1;
        }
        break;
      case "WinJs":
        if (this._Versions.WinJs.test(string)) {
          return RegExp.$1;
        }
        break;
      case "IE":
        if (this._Versions.IE.test(string)) {
          return RegExp.$2 ? RegExp.$2 : RegExp.$1;
        }
        break;
      case "ps3":
        if (this._Versions.Ps3.test(string)) {
          return RegExp.$1;
        }
        break;
      case "psp":
        if (this._Versions.Psp.test(string)) {
          return RegExp.$1;
        }
        break;
      case "Amaya":
        if (this._Versions.Amaya.test(string)) {
          return RegExp.$1;
        }
        break;
      case "Epiphany":
        if (this._Versions.Epiphany.test(string)) {
          return RegExp.$1;
        }
        break;
      case "SeaMonkey":
        if (this._Versions.SeaMonkey.test(string)) {
          return RegExp.$1;
        }
        break;
      case "Flock":
        if (this._Versions.Flock.test(string)) {
          return RegExp.$1;
        }
        break;
      case "OmniWeb":
        if (this._Versions.OmniWeb.test(string)) {
          return RegExp.$1;
        }
        break;
      case "UCBrowser":
        if (this._Versions.UC.test(string)) {
          return RegExp.$1;
        }
        break;
      default:
        if (this.Agent.browser !== "unknown") {
          regex = new RegExp(
            this.Agent.browser + "[\\/ ]([\\d\\w\\.\\-]+)",
            "i"
          );
          if (regex.test(string)) {
            return RegExp.$1;
          }
        }
    }
  };

  this.getOS = function(string) {
    switch (true) {
      case this._OS.WindowsVista.test(string):
        this.Agent.isWindows = true;
        return "Windows Vista";
      case this._OS.Windows7.test(string):
        this.Agent.isWindows = true;
        return "Windows 7";
      case this._OS.Windows8.test(string):
        this.Agent.isWindows = true;
        return "Windows 8";
      case this._OS.Windows81.test(string):
        this.Agent.isWindows = true;
        return "Windows 8.1";
      case this._OS.Windows10.test(string):
        this.Agent.isWindows = true;
        return "Windows 10.0";
      case this._OS.Windows2003.test(string):
        this.Agent.isWindows = true;
        return "Windows 2003";
      case this._OS.WindowsXP.test(string):
        this.Agent.isWindows = true;
        return "Windows XP";
      case this._OS.Windows2000.test(string):
        this.Agent.isWindows = true;
        return "Windows 2000";
      case this._OS.WindowsPhone8.test(string):
        return "Windows Phone 8";
      case this._OS.Linux64.test(string):
        this.Agent.isLinux = true;
        this.Agent.isLinux64 = true;
        return "Linux 64";
      case this._OS.Linux.test(string):
        this.Agent.isLinux = true;
        return "Linux";
      case this._OS.ChromeOS.test(string):
        this.Agent.isChromeOS = true;
        return "Chrome OS";
      case this._OS.Wii.test(string):
        return "Wii";
      case this._OS.PS3.test(string):
        return "Playstation";
      case this._OS.PSP.test(string):
        return "Playstation";
      case this._OS.OSXCheetah.test(string):
        this.Agent.isMac = true;
        return "OS X Cheetah";
      case this._OS.OSXPuma.test(string):
        this.Agent.isMac = true;
        return "OS X Puma";
      case this._OS.OSXJaguar.test(string):
        this.Agent.isMac = true;
        return "OS X Jaguar";
      case this._OS.OSXPanther.test(string):
        this.Agent.isMac = true;
        return "OS X Panther";
      case this._OS.OSXTiger.test(string):
        this.Agent.isMac = true;
        return "OS X Tiger";
      case this._OS.OSXLeopard.test(string):
        this.Agent.isMac = true;
        return "OS X Leopard";
      case this._OS.OSXSnowLeopard.test(string):
        this.Agent.isMac = true;
        return "OS X Snow Leopard";
      case this._OS.OSXLion.test(string):
        this.Agent.isMac = true;
        return "OS X Lion";
      case this._OS.OSXMountainLion.test(string):
        this.Agent.isMac = true;
        return "OS X Mountain Lion";
      case this._OS.OSXMavericks.test(string):
        this.Agent.isMac = true;
        return "OS X Mavericks";
      case this._OS.OSXYosemite.test(string):
        this.Agent.isMac = true;
        return "OS X Yosemite";
      case this._OS.OSXElCapitan.test(string):
        this.Agent.isMac = true;
        return "OS X El Capitan";
      case this._OS.OSXSierra.test(string):
        this.Agent.isMac = true;
        return "macOS Sierra";
      case this._OS.Mac.test(string):
        this.Agent.isMac = true;
        return "OS X";
      case this._OS.iPad.test(string):
        this.Agent.isiPad = true;
        return string.match(this._OS.iPad)[0].replace("_", ".");
      case this._OS.iPhone.test(string):
        this.Agent.isiPhone = true;
        return string.match(this._OS.iPhone)[0].replace("_", ".");
      case this._OS.Bada.test(string):
        this.Agent.isBada = true;
        return "Bada";
      case this._OS.Curl.test(string):
        this.Agent.isCurl = true;
        return "Curl";
      default:
        return "unknown";
    }
  };

  this.getPlatform = function(string) {
    switch (true) {
      case this._Platform.Windows.test(string):
        return "Microsoft Windows";
      case this._Platform.WindowsPhone.test(string):
        this.Agent.isWindowsPhone = true;
        return "Microsoft Windows Phone";
      case this._Platform.Mac.test(string):
        return "Apple Mac";
      case this._Platform.Curl.test(string):
        return "Curl";
      case this._Platform.Android.test(string):
        this.Agent.isAndroid = true;
        return "Android";
      case this._Platform.Blackberry.test(string):
        this.Agent.isBlackberry = true;
        return "Blackberry";
      case this._Platform.Linux.test(string):
        return "Linux";
      case this._Platform.Wii.test(string):
        return "Wii";
      case this._Platform.Playstation.test(string):
        return "Playstation";
      case this._Platform.iPad.test(string):
        this.Agent.isiPad = true;
        return "iPad";
      case this._Platform.iPod.test(string):
        this.Agent.isiPod = true;
        return "iPod";
      case this._Platform.iPhone.test(string):
        this.Agent.isiPhone = true;
        return "iPhone";
      case this._Platform.Samsung.test(string):
        this.Agent.isiSamsung = true;
        return "Samsung";
      default:
        return "unknown";
    }
  };

  this.testCompatibilityMode = function() {
    var ua = this;
    if (this.Agent.isIE) {
      if (/Trident\/(\d)\.0/i.test(ua.Agent.source)) {
        var tridentVersion = parseInt(RegExp.$1, 10);
        var version = parseInt(ua.Agent.version, 10);
        if (version === 7 && tridentVersion === 7) {
          ua.Agent.isIECompatibilityMode = true;
          ua.Agent.version = 11.0;
        }

        if (version === 7 && tridentVersion === 6) {
          ua.Agent.isIECompatibilityMode = true;
          ua.Agent.version = 10.0;
        }

        if (version === 7 && tridentVersion === 5) {
          ua.Agent.isIECompatibilityMode = true;
          ua.Agent.version = 9.0;
        }

        if (version === 7 && tridentVersion === 4) {
          ua.Agent.isIECompatibilityMode = true;
          ua.Agent.version = 8.0;
        }
      }
    }
  };

  this.testSilk = function() {
    var ua = this;
    switch (true) {
      case new RegExp("silk", "gi").test(ua.Agent.source):
        this.Agent.isSilk = true;
        break;
      default:
    }

    if (/Silk-Accelerated=true/gi.test(ua.Agent.source)) {
      this.Agent.SilkAccelerated = true;
    }
    return this.Agent.isSilk ? "Silk" : false;
  };

  this.testKindleFire = function() {
    var ua = this;
    switch (true) {
      case /KFOT/gi.test(ua.Agent.source):
        this.Agent.isKindleFire = true;
        return "Kindle Fire";
      case /KFTT/gi.test(ua.Agent.source):
        this.Agent.isKindleFire = true;
        return "Kindle Fire HD";
      case /KFJWI/gi.test(ua.Agent.source):
        this.Agent.isKindleFire = true;
        return "Kindle Fire HD 8.9";
      case /KFJWA/gi.test(ua.Agent.source):
        this.Agent.isKindleFire = true;
        return "Kindle Fire HD 8.9 4G";
      case /KFSOWI/gi.test(ua.Agent.source):
        this.Agent.isKindleFire = true;
        return "Kindle Fire HD 7";
      case /KFTHWI/gi.test(ua.Agent.source):
        this.Agent.isKindleFire = true;
        return "Kindle Fire HDX 7";
      case /KFTHWA/gi.test(ua.Agent.source):
        this.Agent.isKindleFire = true;
        return "Kindle Fire HDX 7 4G";
      case /KFAPWI/gi.test(ua.Agent.source):
        this.Agent.isKindleFire = true;
        return "Kindle Fire HDX 8.9";
      case /KFAPWA/gi.test(ua.Agent.source):
        this.Agent.isKindleFire = true;
        return "Kindle Fire HDX 8.9 4G";
      default:
        return false;
    }
  };

  this.testCaptiveNetwork = function() {
    var ua = this;
    switch (true) {
      case /CaptiveNetwork/gi.test(ua.Agent.source):
        ua.Agent.isCaptive = true;
        ua.Agent.isMac = true;
        ua.Agent.platform = "Apple Mac";
        return "CaptiveNetwork";
      default:
        return false;
    }
  };

  this.testMobile = function testMobile() {
    var ua = this;
    switch (true) {
      case ua.Agent.isWindows:
      case ua.Agent.isLinux:
      case ua.Agent.isMac:
      case ua.Agent.isChromeOS:
        ua.Agent.isDesktop = true;
        break;
      case ua.Agent.isAndroid:
      case ua.Agent.isSamsung:
        ua.Agent.isMobile = true;
        ua.Agent.isDesktop = false;
        break;
      default:
    }
    switch (true) {
      case ua.Agent.isiPad:
      case ua.Agent.isiPod:
      case ua.Agent.isiPhone:
      case ua.Agent.isBada:
      case ua.Agent.isBlackberry:
      case ua.Agent.isAndroid:
      case ua.Agent.isWindowsPhone:
        ua.Agent.isMobile = true;
        ua.Agent.isDesktop = false;
        break;
      default:
    }
    if (/mobile/i.test(ua.Agent.source)) {
      ua.Agent.isMobile = true;
      ua.Agent.isDesktop = false;
    }
  };

  this.testTablet = function testTablet() {
    var ua = this;
    switch (true) {
      case ua.Agent.isiPad:
      case ua.Agent.isAndroidTablet:
      case ua.Agent.isKindleFire:
        ua.Agent.isTablet = true;
        break;
    }
    if (/tablet/i.test(ua.Agent.source)) {
      ua.Agent.isTablet = true;
    }
  };

  this.testNginxGeoIP = function testNginxGeoIP(headers) {
    var ua = this;
    Object.keys(headers).forEach(function(key) {
      if (/^GEOIP/i.test(key)) {
        ua.Agent.geoIp[key] = headers[key];
      }
    });
  };

  this.testBot = function testBot() {
    var ua = this;
    var isBot = IS_BOT_REGEXP.exec(ua.Agent.source.toLowerCase());
    if (isBot) {
      ua.Agent.isBot = isBot[1];
    } else if (!ua.Agent.isAuthoritative) {
      // Test unauthoritative parse for `bot` in UA to flag for bot
      ua.Agent.isBot = /bot/i.test(ua.Agent.source);
    }
  };

  this.testSmartTV = function testBot() {
    var ua = this;
    var isSmartTV = new RegExp(
      "smart-tv|smarttv|googletv|appletv|hbbtv|pov_tv|netcast.tv",
      "gi"
    ).exec(ua.Agent.source.toLowerCase());
    if (isSmartTV) {
      ua.Agent.isSmartTV = isSmartTV[1];
    }
  };

  this.testAndroidTablet = function testAndroidTablet() {
    var ua = this;
    if (ua.Agent.isAndroid && !/mobile/i.test(ua.Agent.source)) {
      ua.Agent.isAndroidTablet = true;
    }
  };

  this.testTouchSupport = function() {
    var ua = this;
    ua.Agent.isTouchScreen =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0;
  };

  this.getLaguage = function() {
    var ua = this;
    ua.Agent.language = (
      navigator.language ||
      navigator.userLanguage ||
      navigator.browserLanguage ||
      navigator.systemLanguage ||
      ""
    ).toLowerCase();
  };

  this.getColorDepth = function() {
    var ua = this;
    ua.Agent.colorDepth = window.screen.colorDepth || -1;
  };

  this.getScreenResolution = function() {
    var ua = this;
    ua.Agent.resolution = [window.screen.availWidth, window.screen.availHeight];
  };

  this.getPixelDepth = function() {
    var ua = this;
    ua.Agent.pixelDepth = window.screen.pixelDepth || -1;
  };

  this.getCPU = function() {
    var ua = this;
    ua.Agent.cpuCores = navigator.hardwareConcurrency || -1;
  };

  this.reset = function reset() {
    var ua = this;
    for (var key in ua.DefaultAgent) {
      if (ua.DefaultAgent.hasOwnProperty(key)) {
        ua.Agent[key] = ua.DefaultAgent[key];
      }
    }
    return ua;
  };

  this.parse = function get(source) {
    source = source || navigator.userAgent;
    var ua = new DeviceUUID();
    ua.Agent.source = source.replace(/^\s*/, "").replace(/\s*$/, "");
    ua.Agent.os = ua.getOS(ua.Agent.source);
    ua.Agent.platform = ua.getPlatform(ua.Agent.source);
    ua.Agent.browser = ua.getBrowser(ua.Agent.source);
    ua.Agent.version = ua.getBrowserVersion(ua.Agent.source);
    ua.testBot();
    ua.testSmartTV();
    ua.testMobile();
    ua.testAndroidTablet();
    ua.testTablet();
    ua.testCompatibilityMode();
    ua.testSilk();
    ua.testKindleFire();
    ua.testCaptiveNetwork();
    ua.testTouchSupport();
    ua.getLaguage();
    ua.getColorDepth();
    ua.getPixelDepth();
    ua.getScreenResolution();
    ua.getCPU();
    return ua.Agent;
  };

  this.get = function(customData) {
    var pref = "a",
      du = this.parse();
    var dua = [];
    for (var key in this.options) {
      if (this.options.hasOwnProperty(key) && this.options[key] === true) {
        dua.push(du[key]);
      }
    }
    if (customData) {
      dua.push(customData);
    }
    if (!this.options.resolution && du.isMobile) {
      dua.push(du.resolution);
    }
    // 8, 9, a, b
    pref = "b";
    var tmpUuid = du.hashMD5(dua.join(":"));
    var uuid = [
      tmpUuid.slice(0, 8),
      tmpUuid.slice(8, 12),
      "4" + tmpUuid.slice(12, 15),
      pref + tmpUuid.slice(15, 18),
      tmpUuid.slice(20),
    ];
    return uuid.join("-");
  };

  this.Agent = this.DefaultAgent;
  return this;
};

export default DeviceUUID;
