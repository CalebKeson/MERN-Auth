import { hashSync, compareSync } from "bcryptjs";
import crypto from "crypto";

export const doHash = (value, salt) => {
  const result = hashSync(value, salt);
  return result;
};

export const compareHash = (value, hashedValue) => {
  const result = compareSync(value, hashedValue);
  return result;
};

export const hmacProcess = (value, secret) => {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(value);
  return hmac.digest("hex");
};
