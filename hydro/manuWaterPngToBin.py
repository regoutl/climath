#!/bin/python3
#

from PIL import Image, ImageDraw, ImageFont
from struct import pack
from tqdm import tqdm

im = Image.open("flowmap.png")

pix = im.load()

counter = 0


outBytes = bytearray(im.width * im.height)

for x in tqdm(range(im.width)):
    for y in range(im.height):
        (r, g, b, a) = pix[x, y]
        outBytes[x+y*im.width] = a

im.close()

with open("flowmap.bin", "wb") as fout:
    fout.write(outBytes)

print('done')
