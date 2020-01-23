#!/bin/python3
# Should be something like this in Python 3
#

import struct, sys


with open("wind_onshore_capaFactAll365NoBlank.csv", "r") as txtin:
    lines = txtin.read().split('\n')[1:-1]

if(len(lines) % (365*24) != 0):
    print('not 365 days each years (got ',len(lines) / (365.0*24), ' years )')
    sys.exit(-1)

outBytes = bytearray(len(lines))

i = 0
for l in lines:
    v= l.split(',')[1]
    if(len(v) == 0 or v == '?' or v < 0):
        print '\n\nblank in the data ! at line ', lineId, 'col', col
        raise Exception('wathever')

    outBytes[i] = struct.pack("B", int(round(float(v) * 255.0)))
    i += 1



with open("windOnshoreCapaFact.bin", "wb") as fout:
    fout.write(outBytes)

print('done')
