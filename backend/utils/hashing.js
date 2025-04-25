import { hashSync, compareSync } from "bcryptjs";

export const doHash = (value, salt) => {
  const result = hashSync(value, salt);
  return result;
};

export const compareHash = (value, hashedValue) => {
  const result = compareSync(value, hashedValue);
  return result;
};
