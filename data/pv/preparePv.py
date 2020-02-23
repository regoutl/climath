#!/bin/python3
# Should be something like this in Python 3
#

import struct, sys


with open("pvcapfactAll365.csv", "r") as txtin:
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




from PIL import Image, ImageDraw, ImageFont
from struct import pack
from tqdm import tqdm


#load the legend
im = Image.open("scale.png")
pix = im.load()

val = 625 #first value in the scale
dic = {}
dic[(255, 255, 255, 255)] = 0

for x in tqdm(range(im.width)):
    if(pix[x, 0] not in dic):
        dic[pix[x, 0]] = val / 16
        val += 75


# #print the dic
# print 'dic = {'
# for col, index in dic.items():
#     print col, ':', index, ','




im = Image.open("globalHorisontalIrradiance.png")

if(im.width != 1374 or im.height != 1183):
    print( "\n\nBad img size\n\n")
    raise Exception()

pix = im.load()

outBytes = bytearray(im.width * im.height)


for x in tqdm(range(im.width)):
    for y in range(im.height):
        if(pix[x, y] not in dic):
            print '\n\nColor', pix[x, y], 'not recognosed\n\n'
            raise Exeption()
        outBytes[x+y*im.width] = dic[pix[x, y]]

im.close()



dsg = str(raw_input('print code for palette (y/n)')).lower().strip()
if(dsg == 'y'):

    codeLines = [None]*256

    for col, index in dic.items():
        codeLines[index] = col

    countExcept = 0
    code = ''
    for c in codeLines:
        try:
            (r, g, b, a) = c
            if(countExcept == 1):
                print 'this.ghi.appendPalette(0, 0, 0, 0);'
            elif(countExcept > 1):
                print 'for(let i =0; i<', countExcept,';i++)this.ghi.appendPalette(0, 0, 0, 0);'

            countExcept = 0
            print 'this.ghi.appendPalette(', r, ',', g, ', ', b, ');'
        except:
            countExcept += 1


#print the dic
# print 'dic = {'
# for col, index in dic.items():
#     print col, ':', index, ','

with open("ghi.bin", "wb") as fout:
    fout.write(outBytes)


print('\n\n ghi.bin updated ! \n Format : 1 octet per pix. Real val := 16 * pixVal\n\n')
print('done')
