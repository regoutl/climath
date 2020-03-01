#!/bin/python3
#

from PIL import Image, ImageDraw, ImageFont
from struct import pack
from tqdm import tqdm

im = Image.open("popDensity.png")

if(im.width!= 1374 || im.height != 1183):
    print('width / height invalid\n\n');
    raise Exception;

pix = im.load()

# PopDensitylegend = {
#     4278190191:{min:5001, max:44973},
#     4279314829:{min:2001, max:5000},
#     4279979441:{min:1001, max:2000},
#     4280710099:{min:501, max:1000},
#     4281639415:{min:201, max:500},
#     4282890747:{min:101, max:200},
#     4284009982:{min:51, max:100},
#     4285327102:{min:21, max:50},
#     4286709503:{min:0, max:20},
# }

dic = {
    0:0, #Out of Country
    1:1, #0-20 range
    2:2, #21-50
    3:3, #51-100
    4:4, #101-200
    6:5, #201-500
    5:6, #501-1000
    7:7, #1001-2000
    8:8, #2001-5000
    9:9  #5001-...
    }

color_to_pop = {1:0, 2:50, 3:100, 4:200, 5:1000, 6:500, 7:2000, 8:5000}

# tot_pix = 0
# sum_pop = 0
# for nbr, c in im.getcolors():
#     if c > 0:
#         tot_pix += nbr
#         sum_pop += nbr*color_to_pop[c]*1.06
# tot_pop = 11.4e6 #personnes
# tot_surface = 30688 #km**2
# print(tot_surface/tot_pix,'surface/pixel')
# print('ratio',tot_pop/(sum_pop*tot_surface/tot_pix))
# print(sum_pop*tot_surface/tot_pix)

# with open('palette_dens.txt', 'w') as f:
#     im.palette.save(f)
# Palette
# Mode: RGBA
# 0 33 0 0 255
# 1 255 128 252 233
# 2 106 250 209 85
# 3 247 190 67 207
# 4 122 31 242 167
# 5 46 173 83 19
# 6 138 46 10 0
# 7 0 0 0 0
# 8 0 0 0 0
# 9 0 0 0 0

outBytes = bytearray(im.width * im.height)

for x in tqdm(range(im.width)):
    for y in range(im.height):
        outBytes[x+y*im.width] = dic[pix[x, y]]

im.close()

with open("popDensity.bin", "wb") as fout:
    fout.write(outBytes)

print('done')


#     name            index   count pix
# total pixel         /       1625442
# out of country      0       54086
# 0-20 (r255)         1       223678
# 21-50 (r252)        2       171151
# 51-100 (r250)       3       141713
# 101-200 (r247)      4       100527
# 501-1000 (r207)     5       42552
# 201-500 (r242)      6       38765
# 1001-2000 (r173)    7       32710
# 2001-5000 (r138)    8       20260
# 5001-...  (r107)    /       0
