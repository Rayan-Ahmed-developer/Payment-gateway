import {Safepay} from "@sfpy/node-sdk";

console.log("SAFEPAY_API_KEY:", process.env.SAFEPAY_API_KEY);
console.log("SAFEPAY_ENV:", process.env.SAFEPAY_ENV);

export const safepay = new Safepay({
    environment: process.env.SAFEPAY_ENV,
    apiKey: process.env.SAFEPAY_API_KEY,
    v1Secret: process.env.SAFEPAY_V1_SECRET,
    webhookSecret: process.env.SAFEPAY_WEBHOOK_SECRET,
})