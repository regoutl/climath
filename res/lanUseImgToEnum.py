
from PIL import Image, ImageDraw, ImageFont
import struct

image = Image.open("landUse.png")

fout = open("landUse.bin", "wb")


pix = image.load()

dic = {}
counter = 0

outBytes = bytearray(image.width * image.height)


for x in range(0, image.width):
	for y in range(0, image.height):
		v = 0
		if( pix[x, y] not in dic):
			dic[pix[x, y]]= counter
			counter += 1

		v = dic[pix[x, y]]
		outBytes[x+y*image.width] = struct.pack("B", v)



fout.write(outBytes)

print 'done'
