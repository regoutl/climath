#!/bin/python3
#

from PIL import Image, ImageDraw, ImageFont
from struct import pack
from tqdm import tqdm

im = Image.open("flowdisplayOriginalRes.png")

im = im.resize((1374, 1159), Image.BICUBIC);



pix = im.load()

counter = 0


outBytes = bytearray(1374 * 1183)

for x in tqdm(range(1374-8)):
    for y in range(1183-63):
        (r, g, b, a) = pix[x, y]
        outBytes[(x+8)+(y+63)*1374] = a

im.close()

with open("flowdisplay.bin", "wb") as fout:
    fout.write(outBytes)

print('done')
