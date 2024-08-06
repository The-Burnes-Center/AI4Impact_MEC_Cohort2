from __future__ import division

import binascii
import base64
import warnings
from itertools import chain
from six import int2byte, text_type
from ._compat import compat26_str, str_idx_as_int


class UnexpectedDER(Exception):
    pass


def encode_constructed(tag, value):
    return int2byte(0xA0 + tag) + encode_length(len(value)) + value


def encode_integer(r):
    assert r >= 0  # can't support negative numbers yet
    h = ("%x" % r).encode()
    if len(h) % 2:
        h = b"0" + h
    s = binascii.unhexlify(h)
    num = str_idx_as_int(s, 0)
    if num <= 0x7F:
        return b"\x02" + encode_length(len(s)) + s
    else:
        # DER integers are two's complement, so if the first byte is
        # 0x80-0xff then we need an extra 0x00 byte to prevent it from
        # looking negative.
        return b"\x02" + encode_length(len(s) + 1) + b"\x00" + s


# sentry object to check if an argument was specified (used to detect
# deprecated calling convention)
_sentry = object()


def encode_bitstring(s, unused=_sentry):
    """
    Encode a binary string as a BIT STRING using :term:`DER` encoding.

    Note, because there is no native Python object that can encode an actual
    bit string, this function only accepts byte strings as the `s` argument.
    The byte string is the actual bit string that will be encoded, padded
    on the right (least significant bits, looking from big endian perspective)
    to the first full byte. If the bit string has a bit length that is multiple
    of 8, then the padding should not be included. For correct DER encoding
    the padding bits MUST be set to 0.

    Number of bits of padding need to be provided as the `unused` parameter.
    In case they are specified as None, it means the number of unused bits
    is already encoded in the string as the first byte.

    The deprecated call convention specifies just the `s` parameters and
    encodes the number of unused bits as first parameter (same convention
    as with None).

    Empty string must be encoded with `unused` specified as 0.

    Future version of python-ecdsa will make specifying the `unused` argument
    mandatory.

    :param s: bytes to encode
    :type s: bytes like object
    :param unused: number of bits at the end of `s` that are unused, must be
        between 0 and 7 (inclusive)
    :type unused: int or None

    :raises ValueError: when `unused` is too large or too small

    :return: `s` encoded using DER
    :rtype: bytes
    """
    encoded_unused = b""
    len_extra = 0
    if unused is _sentry:
        warnings.warn(
            "Legacy call convention used, unused= needs to be specified",
            DeprecationWarning,
        )
    elif unused is not None:
        if not 0 <= unused <= 7:
            raise ValueError("unused must be integer between 0 and 7")
        if unused:
            if not s:
                raise ValueError("unused is non-zero but s is empty")
            last = str_idx_as_int(s, -1)
            if last & (2**unused - 1):
                raise ValueError("unused bits must be zeros in DER")
        encoded_unused = int2byte(unused)
        len_extra = 1
    return b"\x03" + encode_length(len(s) + len_extra) + encoded_unused + s


def encode_octet_string(s):
    return b"\x04" + encode_length(len(s)) + s


def encode_oid(first, second, *pieces):
    assert 0 <= first < 2 and 0 <= second <= 39 or first == 2 and 0 <= second
    body = b"".join(
        chain(
            [encode_number(40 * first + second)],
            (encode_number(p) for p in pieces),
        )
    )
    return b"\x06" + encode_length(len(body)) + body


def encode_sequence(*encoded_pieces):
    total_len = sum([len(p) for p in encoded_pieces])
    return b"\x30" + encode_length(total_len) + b"".join(encoded_pieces)


def encode_number(n):
    b128_digits = []
    while n:
        b128_digits.insert(0, (n & 0x7F) | 0x80)
        n = n >> 7
    if not b128_digits:
        b128_digits.append(0)
    b128_digits[-1] &= 0x7F
    return b"".join([int2byte(d) for d in b128_digits])


def is_sequence(string):
    return string and string[:1] == b"\x30"


def remove_constructed(string):
    s0 = str_idx_as_int(string, 0)
    if (s0 & 0xE0) != 0xA0:
        raise UnexpectedDER(
            "wanted type 'constructed tag' (0xa0-0xbf), got 0x%02x" % s0
        )
    tag = s0 & 0x1F
    length, llen = read_length(string[1:])
    body = string[1 + llen : 1 + llen + length]
    rest = string[1 + llen + length :]
    return tag, body, rest


def remove_sequence(string):
    if not string:
        raise UnexpectedDER("Empty string does not encode a sequence")
    if string[:1] != b"\x30":
        n = str_idx_as_int(string, 0)
        raise UnexpectedDER("wanted type 'sequence' (0x30), got 0x%02x" % n)
    length, lengthlength = read_length(string[1:])
    if length > len(string) - 1 - lengthlength:
        raise UnexpectedDER("Length longer than the provided buffer")
    endseq = 1 + lengthlength + length
    return string[1 + lengthlength : endseq], string[endseq:]


def remove_octet_string(string):
    if string[:1] != b"\x04":
        n = str_idx_as_int(string, 0)
        raise UnexpectedDER("wanted type 'octetstring' (0x04), got 0x%02x" % n)
    length, llen = read_length(string[1:])
    body = string[1 + llen : 1 + llen + length]
    rest = string[1 + llen + length :]
    return body, rest


def remove_object(string):
    if not string:
        raise UnexpectedDER(
            "Empty string does not encode an object identifier"
        )
    if string[:1] != b"\x06":
        n = str_idx_as_int(string, 0)
        raise UnexpectedDER("wanted type 'object' (0x06), got 0x%02x" % n)
    length, lengthlength = read_length(string[1:])
    body = string[1 + lengthlength : 1 + lengthlength + length]
    rest = string[1 + lengthlength + length :]
    if not body:
        raise UnexpectedDER("Empty object identifier")
    if len(body) != length:
        raise UnexpectedDER(
            "Length of object identifier longer than the provided buffer"
        )
    numbers = []
    while body:
        n, ll = read_number(body)
        numbers.append(n)
        body = body[ll:]
    n0 = numbers.pop(0)
    if n0 < 80:
        first = n0 // 40
    else:
        first = 2
    second = n0 - (40 * first)
    numbers.insert(0, first)
    numbers.insert(1, second)
    return tuple(numbers), rest


def remove_integer(string):
    if not string:
        raise UnexpectedDER(
            "Empty string is an invalid encoding of an integer"
        )
    if string[:1] != b"\x02":
        n = str_idx_as_int(string, 0)
        raise UnexpectedDER("wanted type 'integer' (0x02), got 0x%02x" % n)
    length, llen = read_length(string[1:])
    if length > len(string) - 1 - llen:
        raise UnexpectedDER("Length longer than provided buffer")
    if length == 0:
        raise UnexpectedDER("0-byte long encoding of integer")
    numberbytes = string[1 + llen : 1 + llen + length]
    rest = string[1 + llen + length :]
    msb = str_idx_as_int(numberbytes, 0)
    if not msb < 0x80:
        raise UnexpectedDER("Negative integers are not supported")
    # check if the encoding is the minimal one (DER requirement)
    if length > 1 and not msb:
        # leading zero byte is allowed if the integer would have been
        # considered a negative number otherwise
        smsb = str_idx_as_int(numberbytes, 1)
        if smsb < 0x80:
            raise UnexpectedDER(
                "Invalid encoding of integer, unnecessary "
                "zero padding bytes"
            )
    return int(binascii.hexlify(numberbytes), 16), rest


def read_number(string):
    number = 0
    llen = 0
    if str_idx_as_int(string, 0) == 0x80:
        raise UnexpectedDER("Non minimal encoding of OID subidentifier")
    # base-128 big endian, with most significant bit set in all but the last
    # byte
    while True:
        if llen >= len(string):
            raise UnexpectedDER("ran out of length bytes")
        number = number << 7
        d = str_idx_as_int(string, llen)
        number += d & 0x7F
        llen += 1
        if not d & 0x80:
            break
    return number, llen


def encode_length(l):
    assert l >= 0
    if l < 0x80:
        return int2byte(l)
    s = ("%x" % l).encode()
    if len(s) % 2:
        s = b"0" + s
    s = binascii.unhexlify(s)
    llen = len(s)
    return int2byte(0x80 | llen) + s


def read_length(string):
    if not string:
        raise UnexpectedDER("Empty string can't encode valid length value")
    num = str_idx_as_int(string, 0)
    if not (num & 0x80):
        # short form
        return (num & 0x7F), 1
    # else long-form: b0&0x7f is number of additional base256 length bytes,
    # big-endian
    llen = num & 0x7F
    if not llen:
        raise UnexpectedDER("Invalid length encoding, length of length is 0")
    if llen > len(string) - 1:
        raise UnexpectedDER("Length of length longer than provided buffer")
    # verify that the encoding is minimal possible (DER requirement)
    msb = str_idx_as_int(string, 1)
    if not msb or llen == 1 and msb < 0x80:
        raise UnexpectedDER("Not minimal encoding of length")
    return int(binascii.hexlify(string[1 : 1 + llen]), 16), 1 + llen


def remove_bitstring(string, expect_unused=_sentry):
    """
    Remove a BIT STRING object from `string` following :term:`DER`.

    The `expect_unused` can be used to specify if the bit string should
    have the amount of unused bits decoded or not. If it's an integer, any
    read BIT STRING that has number of unused bits different from specified
    value will cause UnexpectedDER exception to be raised (this is especially
    useful when decoding BIT STRINGS that have DER encoded object in them;
    DER encoding is byte oriented, so the unused bits will always equal 0).

    If the `expect_unused` is specified as None, the first element returned
    will be a tuple, with the first value being the extracted bit string
    while the second value will be the decoded number of unused bits.

    If the `expect_unused` is unspecified, the decoding of byte with
    number of unused bits will not be attempted and the bit string will be
    returned as-is, the callee will be required to decode it and verify its
    correctness.

    Future version of python will require the `expected_unused` parameter
    to be specified.

    :param string: string of bytes to extract the BIT STRING from
    :type string: bytes like object
    :param expect_unused: number of bits that should be unused in the BIT
        STRING, or None, to return it to caller
    :type expect_unused: int or None

    :raises UnexpectedDER: when the encoding does not follow DER.

    :return: a tuple with first element being the extracted bit string and
        the second being the remaining bytes in the string (if any); if the
        `expect_unused` is specified as None, the first element of the returned
        tuple will be a tuple itself, with first element being the bit string
        as bytes and the second element being the number of unused bits at the
        end of the byte array as an integer
    :rtype: tuple
    """
    if not string:
        raise UnexpectedDER("Empty string does not encode a bitstring")
    if expect_unused is _sentry:
        warnings.warn(
            "Legacy call convention used, expect_unused= needs to be"
            " specified",
            DeprecationWarning,
        )
    num = str_idx_as_int(string, 0)
    if string[:1] != b"\x03":
        raise UnexpectedDER("wanted bitstring (0x03), got 0x%02x" % num)
    length, llen = read_length(string[1:])
    if not length:
        raise UnexpectedDER("Invalid length of bit string, can't be 0")
    body = string[1 + llen : 1 + llen + length]
    rest = string[1 + llen + length :]
    if expect_unused is not _sentry:
        unused = str_idx_as_int(body, 0)
        if not 0 <= unused <= 7:
            raise UnexpectedDER("Invalid encoding of unused bits")
        if expect_unused is not None and expect_unused != unused:
            raise UnexpectedDER("Unexpected number of unused bits")
        body = body[1:]
        if unused:
            if not body:
                raise UnexpectedDER("Invalid encoding of empty bit string")
            last = str_idx_as_int(body, -1)
            # verify that all the unused bits are set to zero (DER requirement)
            if last & (2**unused - 1):
                raise UnexpectedDER("Non zero padding bits in bit string")
        if expect_unused is None:
            body = (body, unused)
    return body, rest


# SEQUENCE([1, STRING(secexp), cont[0], OBJECT(curvename), cont[1], BINTSTRING)


# signatures: (from RFC3279)
#  ansi-X9-62  OBJECT IDENTIFIER ::= {
#       iso(1) member-body(2) us(840) 10045 }
#
#  id-ecSigType OBJECT IDENTIFIER  ::=  {
#       ansi-X9-62 signatures(4) }
#  ecdsa-with-SHA1  OBJECT IDENTIFIER ::= {
#       id-ecSigType 1 }
# so 1,2,840,10045,4,1
# so 0x42, .. ..

#  Ecdsa-Sig-Value  ::=  SEQUENCE  {
#       r     INTEGER,
#       s     INTEGER  }

# id-public-key-type OBJECT IDENTIFIER  ::= { ansi-X9.62 2 }
#
# id-ecPublicKey OBJECT IDENTIFIER ::= { id-publicKeyType 1 }

# I think the secp224r1 identifier is (t=06,l=05,v=2b81040021)
#  secp224r1 OBJECT IDENTIFIER ::= {
#  iso(1) identified-organization(3) certicom(132) curve(0) 33 }
# and the secp384r1 is (t=06,l=05,v=2b81040022)
#  secp384r1 OBJECT IDENTIFIER ::= {
#  iso(1) identified-organization(3) certicom(132) curve(0) 34 }


def unpem(pem):
    if isinstance(pem, text_type):  # pragma: no branch
        pem = pem.encode()

    d = b"".join(
        [
            l.strip()
            for l in pem.split(b"\n")
            if l and not l.startswith(b"-----")
        ]
    )
    return base64.b64decode(d)


def topem(der, name):
    b64 = base64.b64encode(compat26_str(der))
    lines = [("-----BEGIN %s-----\n" % name).encode()]
    lines.extend(
        [b64[start : start + 76] + b"\n" for start in range(0, len(b64), 76)]
    )
    lines.append(("-----END %s-----\n" % name).encode())
    return b"".join(lines)
