import {
  WebPlugin,
  registerPlugin
} from "./chunk-ILLWETPA.js";
import {
  __async
} from "./chunk-EAE2VPRF.js";

// node_modules/capacitor-razorpay/dist/esm/web.js
var CheckoutWeb = class extends WebPlugin {
  constructor() {
    super();
  }
  echo(options) {
    return __async(this, null, function* () {
      console.log("ECHO", options);
      return options;
    });
  }
  open(options) {
    return __async(this, null, function* () {
      console.log(options);
      return new Promise((resolve, reject) => {
        var _a;
        var razorpay;
        var finalOps = options;
        finalOps["handler"] = function(res) {
          console.log(res.razorpay_payment_id);
          resolve({
            response: res
          });
        };
        finalOps["modal.ondismiss"] = function() {
          reject(JSON.stringify({ code: 2, description: "Payment Canceled by User" }));
        };
        var retryCount = 0;
        if (finalOps.hasOwnProperty("retry")) {
          if (finalOps.retry.enabled === true) {
            retryCount = finalOps.retry.max_count;
          }
        }
        var rjs = document.getElementsByTagName("script")[0];
        var rzpjs = document.createElement("script");
        rzpjs.id = "rzp-jssdk";
        rzpjs.setAttribute("src", "https://checkout.razorpay.com/v1/checkout.js");
        (_a = rjs.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(rzpjs);
        rzpjs.addEventListener("load", () => {
          try {
            razorpay = new window.Razorpay(finalOps);
            razorpay.open();
            razorpay.on("payment.failed", (res) => {
              var _a2;
              retryCount = retryCount - 1;
              if (retryCount < 0) {
                console.log(res);
                (_a2 = rjs.parentNode) === null || _a2 === void 0 ? void 0 : _a2.removeChild(rzpjs);
                reject(res.error);
              }
            });
          } catch (err) {
            reject({
              response: err
            });
          }
        });
      });
    });
  }
};
var Checkout = registerPlugin("Checkout", {
  web: () => Promise.resolve().then(() => require_web()).then((m) => new m.CheckoutWeb())
});

export {
  CheckoutWeb,
  Checkout
};
//# sourceMappingURL=chunk-MG2XFKWD.js.map
