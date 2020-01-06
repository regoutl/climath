
from PIL import Image, ImageDraw, ImageFont

image = Image.open("landUse.png")


pix = image.load()


for x in range(0, image.width):
	for y in range(0, image.height):
		(r, g, b, a) = pix[x, y]
		
		
