#!/bin/python3
# Should be something like this in Python 3
#

import struct, sys


with open("pvcapfactAll365.csv", "r").read() as txtin:
    lines = txtin.read().split('\n')[0:-1]

if(len(lines) % 365*24 != 0):
    print('not 365 days each years')
    sys.exit(-1)

outBytes = bytearray(len(lines))

i = 0
for l in lines:
    outBytes[i] = struct.pack("B", int(round(float(l) * 255.0)))
    i += 1



with open("pvcapfactAll365.bin", "wb") as fout:
    fout.write(outBytes)

print('done')
