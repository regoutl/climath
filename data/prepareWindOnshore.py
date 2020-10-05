#!/bin/python3
# Should be something like this in Python 3
#


# ~ This file is part of Climath. Climath is free software: you can redistribute it and/or modify
 # ~ it under the terms of the GPL-3.0-only.

# ~ Copyright 2020, louis-amedee regout, charles edwin de brouwer



# This utility file does, for the given country
# 1) 
# 2) tranform a screenshot from globalwindatlas, containing the wind power density, 
#       into a raw array of coefs, ready for the game

import struct, sys
import os.path
from os import path

countryCode = ''

if(len(sys.argv) > 1):
    countryCode = sys.argv[1]
else:      
    print('usage : prepareWindOnshore.py countryCode')
    raise SystemExit

if(not path.exists(countryCode)):
    print('no such country')
    raise SystemExit


with open(countryCode + "/wind/wind_onshore_capaFactAll365NoBlank.csv", "r") as txtin:
    lines = txtin.read().split('\n')[1:-1]

if(len(lines) % (365*24) != 0):
    print('not 365 days each years (got ',len(lines) / (365.0*24), ' years )')
    raise SystemExit

outBytes = bytearray(len(lines))

i = 0
for l in lines:
    v= l.split(',')[1]
    if(len(v) == 0 or v == '?' or float(v) < 0):
        print('\n\nblank in the data ! at line ', lineId, 'col', col)
        raise Exception('wathever')

#    outBytes[i] = struct.pack("B", int(round(float(v) * 255.0)))
    outBytes[i] = int(round(float(v) * 255.0))
    i += 1



with open(countryCode + "/gameRdy/windOnshoreCapaFact.bin", "wb") as fout:
    fout.write(outBytes)





from PIL import Image, ImageDraw, ImageFont
from struct import pack
from tqdm import tqdm

#load the mapping color -> value
def loadLegend():
    #load the legend
    im = Image.open("meanWindPowerDensityLegend.png")
    pix = im.load()

    val = 25
    dic = {}
    dic[(255, 255, 255, 255)] = 0

    for x in tqdm(range(im.width)):
        if(pix[x, 0] not in dic):
            dic[pix[x, 0]] = val 
            if(val < 400):
                val += 25
            elif(val < 900):
                val += 50
            else:
                val += 100

    #print the dic
#    print 'dic = {'
    # ~ for col, index in dic.items():
         # ~ print( col, ':', index, ',')
    return dic



def prepareImage(imgName, legend, outName):
    im = Image.open(imgName)

    if(im.width != 1374 or im.height != 1183):
        print("\n\nBad img size\n\n")
        raise Exception()

    pix = im.load()

    outBytes = bytearray(im.width * im.height)

    # dic = {
# ~ (255, 255, 255, 255) : 0 ,
# ~ (197, 233, 250, 255) : 25 ,
# ~ (178, 226, 249, 255) : 50 ,
# ~ (141, 204, 238, 255) : 75 ,
# ~ (123, 187, 229, 255) : 100 ,
# ~ (106, 173, 220, 255) : 125 ,
# ~ (90, 158, 212, 255) : 150 ,
# ~ (72, 142, 202, 255) : 175 ,
# ~ (72, 150, 173, 255) : 200 ,
# ~ (72, 158, 148, 255) : 225 ,
# ~ (73, 165, 124, 255) : 250 ,
# ~ (73, 173, 99, 255) : 275 ,
# ~ (73, 181, 70, 255) : 300 ,
# ~ (111, 192, 75, 255) : 325 ,
# ~ (145, 202, 79, 255) : 350 ,
# ~ (178, 211, 83, 255) : 375 ,
# ~ (212, 221, 87, 255) : 400 ,
# ~ (250, 232, 92, 255) : 450 ,
# ~ (249, 208, 82, 255) : 500 ,
# ~ (248, 184, 73, 255) : 550 ,
# ~ (247, 160, 63, 255) : 600 ,
# ~ (246, 137, 53, 255) : 650 ,
# ~ (245, 106, 41, 255) : 700 ,
# ~ (238, 92, 41, 255) : 750 ,
# ~ (232, 78, 41, 255) : 800 ,
# ~ (226, 63, 40, 255) : 850 ,
# ~ (211, 31, 40, 255) : 900 ,
# ~ (199, 35, 52, 255) : 1000 ,
# ~ (188, 39, 65, 255) : 1100 ,
# ~ (176, 43, 77, 255) : 1200 ,
# ~ (165, 47, 90, 255) : 1300 ,

    for x in tqdm(range(im.width)):
        for y in range(im.height):
            r = pix[x, y][0]
            g = pix[x, y][1]
            b = pix[x, y][2]
            if((r, g, b, 255) not in legend):
                # ~ print('\n\nColor', pix[x, y], 'not recognosed\n\n')
                raise Exception('Color', pix[x, y], 'not recognosed. Did you discretised the image with the wind palette ?')
            outBytes[x+y*im.width] = legend[(r, g, b, 255)] // 8

    im.close()





    #print the legend
    # print 'legend = {'
    # for col, index in legend.items():
    #     print col, ':', index, ','

    with open(outName, "wb") as fout:
        fout.write(outBytes)


    print('\n\n', outName, ' updated ! \n  Format : 1 octet per pix. Row major, width ', im.width, ' \n  Real val := 8 * pixVal. Size\n\n')




legend = loadLegend()

prepareImage(countryCode + "/wind/meanWindPowerDensity50.png", legend, countryCode + "/gameRdy/windPowDens50.bin")

prepareImage(countryCode + "/wind/meanWPD100.png", legend, countryCode + "/gameRdy/windPowDens100.bin")

print('done')



dsg = str(input('print code for palette (y/n)')).lower().strip()
if(dsg == 'y'):

    codeLines = [None]*256

    for col, index in legend.items():
        codeLines[index] = col

    countExcept = 0
    code = ''
    for c in codeLines:
        try:
            (r, g, b, a) = c
            if(countExcept == 1):
                print('this.windPowDensAt50.appendPalette(0, 0, 0, 0);')
            elif(countExcept > 1):
                print('for(let i =0; i<', countExcept,';i++)this.windPowDensAt50.appendPalette(0, 0, 0, 0);')

            countExcept = 0
            print('this.windPowDensAt50.appendPalette(', r, ',', g, ', ', b, ');')
        except:
            countExcept += 1



#tmp, for plot
#f = open("colorPlot.csv", "w")

#f.write('Val, r, g, b\n')

#for c in legend:
#	(r, g, b, a) = c
#	f.write(str(legend[c]) + "," + str(r) + "," + str(g) + "," + str(b) + "\n")
#f.close()
