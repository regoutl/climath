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





from PIL import Image, ImageDraw, ImageFont
from struct import pack
from tqdm import tqdm


#load the legend
im = Image.open("meanWindPowerDensityLegend.png")
pix = im.load()

val = 25
dic = {}
dic[(255, 255, 255, 255)] = 0

for x in tqdm(range(im.width)):
    if(pix[x, 0] not in dic):
        dic[pix[x, 0]] = val / 8
        if(val < 400):
            val += 25
        elif(val < 900):
            val += 50
        else:
            val += 100


# #print the dic
# print 'dic = {'
# for col, index in dic.items():
#     print col, ':', index, ','




im = Image.open("meanWindPowerDensity50.png")

if(im.width != 1374 or im.height != 1183):
    print "\n\nBad img size\n\n"
    raise Exception()

pix = im.load()

outBytes = bytearray(im.width * im.height)

# dic = {
# (201, 64, 50) : 22 ,
# (253, 221, 105) : 3 ,
# (188, 198, 93) : 2 ,
# (88, 153, 147) : 6 ,
# (81, 150, 171) : 8 ,
# (146, 206, 236) : 13 ,
# (131, 178, 83) : 10 ,
# (92, 164, 209) : 17 ,
# (229, 104, 55) : 20 ,
# (245, 179, 86) : 14 ,
# (156, 68, 91) : 25 ,
# (94, 157, 125) : 5 ,
# (255, 255, 255) : 0 ,
# (249, 200, 95) : 15 ,
# (239, 140, 68) : 19 ,
# (179, 65, 69) : 24 ,
# (216, 83, 52) : 21 ,
# (222, 94, 54) : 23 ,
# (109, 177, 217) : 18 ,
# (167, 66, 79) : 26 ,
# (219, 209, 99) : 7 ,
# (98, 161, 102) : 12 ,
# (182, 227, 247) : 4 ,
# (200, 233, 249) : 1 ,
# (103, 167, 77) : 11 ,
# (160, 188, 88) : 9 ,
# (72, 149, 199) : 16 ,
# (189, 64, 58) : 27
# }


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
                print 'this.windPowDensAt50.appendPalette(0, 0, 0, 0);'
            elif(countExcept > 1):
                print 'for(let i =0; i<', countExcept,';i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);'

            countExcept = 0
            print 'this.windPowDensAt50.appendPalette(', r, ',', g, ', ', b, ');'
        except:
            countExcept += 1


#print the dic
# print 'dic = {'
# for col, index in dic.items():
#     print col, ':', index, ','

with open("../res/windPowDens50.bin", "wb") as fout:
    fout.write(outBytes)


print('\n\n../res/windPowDens50.bin updated ! \n Format : 1 octet per pix. Real val := 8 * pixVal\n\n')
print('done')
