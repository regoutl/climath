#!/bin/python3
#

from PIL import Image, ImageDraw, ImageFont
from struct import pack
from tqdm import tqdm

im = Image.open("landUse.png")

pix = im.load()

dic = {}
counter = 0


outBytes = bytearray(im.width * im.height)

for x in tqdm(range(im.width)):
    for y in range(im.height):
        if( pix[x, y] not in dic):
            dic[pix[x, y]]= counter
            counter += 1

        outBytes[x+y*im.width] = dic[pix[x, y]]

im.close()

with open("landUse.bin", "wb") as fout:
    fout.write(outBytes)

print('done')

