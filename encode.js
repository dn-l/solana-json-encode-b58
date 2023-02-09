const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

const base = ALPHABET.length;
const leader = ALPHABET.charAt(0);
const iFactor = Math.log(256) / Math.log(base);

function encode(input) {
  if (input.length === 0) {
    return "";
  }

  // Skip & count leading zeroes.
  let zeroes = 0;
  let length = 0;
  let pbegin = 0;
  let pend = input.length;
  while (pbegin !== pend && input[pbegin] === 0) {
    pbegin++;
    zeroes++;
  }

  // Allocate enough space in big-endian base58 representation.
  let size = ((pend - pbegin) * iFactor + 1) >>> 0;
  let b58 = new Uint8Array(size);

  // Process the bytes.
  while (pbegin !== pend) {
    let carry = input[pbegin];
    // Apply "b58 = b58 * 256 + ch".
    let i = 0;
    for (
      let it1 = size - 1;
      (carry !== 0 || i < length) && it1 !== -1;
      it1--, i++
    ) {
      carry += (256 * b58[it1]) >>> 0;
      b58[it1] = carry % base >>> 0;
      carry = (carry / base) >>> 0;
    }
    if (carry !== 0) {
      throw new Error("Non-zero carry");
    }
    length = i;
    pbegin++;
  }

  // Skip leading zeroes in base58 result.
  let it2 = size - length;
  while (it2 !== size && b58[it2] === 0) {
    it2++;
  }

  // Translate the result into a string.
  let str = leader.repeat(zeroes);
  for (; it2 < size; ++it2) {
    str += ALPHABET.charAt(b58[it2]);
  }
  return str;
}

module.exports = encode;
