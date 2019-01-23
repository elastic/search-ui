function isTypeNumber(value) {
  return value && typeof value === "number";
}

function isTypeBoolean(value) {
  return value && typeof value === "boolean";
}

function toBoolean(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  throw "Invalid type parsed as Boolean value";
}

/* Encoder for qs library which preserve number types on the URL. Numbers
are padded with "n_{number}_n", and booleans with "b_{boolean}_b"*/

export default {
  encode(value, encode) {
    if (isTypeNumber(value)) {
      return `n_${value}_n`;
    }
    if (isTypeBoolean(value)) {
      return `b_${value}_b`;
    }
    return encode(value);
  },
  decode(value, decode) {
    //eslint-disable-next-line
    if (/n_[\d\.]*_n/.test(value)) {
      const numericValueString = value.substring(2, value.length - 2);
      return Number(numericValueString);
    }
    if (/^b_(true|false)*_b$/.test(value)) {
      const booleanValueString = value.substring(2, value.length - 2);
      return toBoolean(booleanValueString);
    }
    return decode(value);
  }
};
