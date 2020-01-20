#!/bin/python3
#

from PIL import Image, ImageDraw, ImageFont
import struct
from tqdm import tqdm






image = Image.open("pools.png")


logImage = image.copy() # Image.new('RGBA', (image.width , image.height))

pix = image.load()

d = ImageDraw.Draw(logImage)
dic = {}
counter = 0

outBytes = bytearray(image.width * image.height)

dic[(0, 0, 0, 0)] = 0
counter+=1

pools = []
pools.append({"data":"whatever", "color":(0, 0, 0, 0)})

for x in tqdm(range(image.width)):
    for y in range(image.height):
        (r, g, b, a ) =  pix[x, y]
        if(a != 255):
            outBytes[x+y*image.width] = 0
            continue

        if( pix[x, y] not in dic   ):
            dic[pix[x, y]]= counter
            pools.append({"data col":0, "output":False})
            d.text((x, y), str(counter-1), fill='black')
#            print(counter)
#            print(pix[x, y])
            counter += 1
        outBytes[x+y*image.width] = dic[pix[x, y]]

if(counter != 86):
    print("pas le bon nombre de pools () :/")
    print(counter)
    raise Exception()


pos = open('hydroFinalAll365.csv', 'r').read().split('\n')[0:5]
xs = pos[2].split(',')
ys = pos[3].split(',')
station = pos[1].split(',')
rivers = pos[4].split(',')
avg = pos[0].split(',')


for i in range(1, len(xs) - 1):
    if(avg[i] == 'I' ):
        continue

    x = int(xs[i])
    y = int(ys[i])

    index = outBytes[x+y*image.width]


    if(index == 0):
        print('\n\nstation ' + station[i] + ' (col ' + str(i) + ') is not in a pool\n\n' )
        logPix = logImage.load()

    	logPix[int(xs[i]), int(ys[i])] = (255, 0, 0, 255)
    	logPix[int(xs[i]) +1, int(ys[i])] = (255, 0, 0, 255)
    	logPix[int(xs[i]), int(ys[i])+1] = (255, 0, 0, 255)
    	logPix[int(xs[i]), int(ys[i])-1] = (255, 0, 0, 255)
    	logPix[int(xs[i])-1, int(ys[i])] = (255, 0, 0, 255)
    	d.text((int(xs[i]), int(ys[i])), station[i], fill="red")

        logImage.save('poolsLog.png')
        raise Exeption()



    if(avg[i] == 'o'):
        pools[index]["output"] = True
        logPix = logImage.load()

    	logPix[int(xs[i]), int(ys[i])] = (255, 0, 0, 255)
    	logPix[int(xs[i]) +1, int(ys[i])] = (255, 0, 0, 255)
    	logPix[int(xs[i]), int(ys[i])+1] = (255, 0, 0, 255)
    	logPix[int(xs[i]), int(ys[i])-1] = (255, 0, 0, 255)
    	logPix[int(xs[i])-1, int(ys[i])] = (255, 0, 0, 255)
    	d.text((int(xs[i]), int(ys[i])), "o", fill="black")
        continue


#    print ('found at ', index)
    # print(pools[index])
    if(pools[index]["data col"] != 0):
        prevColIndex = pools[index]["data col"]

        print('\n\n2 pts matching same pool : ' +
        'both station ' + station[i] + ' (col ' + str(i) + ') and ' + station[prevColIndex] + ' (col ' + str(prevColIndex) +
        ') match to pool ' + str(index)) + '\n\n'

        logPix = logImage.load()
    	d.text((int(xs[i]), int(ys[i])), station[i], fill="red")
    	d.text((int(xs[prevColIndex]), int(ys[prevColIndex])), station[prevColIndex], fill="green")
    	logPix[int(xs[prevColIndex]), int(ys[prevColIndex])] = (0, 255, 0, 255)
    	logPix[int(xs[i]), int(ys[i])] = (255, 0, 0, 255)
    	logPix[int(xs[i]) +1, int(ys[i])] = (255, 0, 0, 255)
    	logPix[int(xs[i]), int(ys[i])+1] = (255, 0, 0, 255)
    	logPix[int(xs[i]), int(ys[i])-1] = (255, 0, 0, 255)
    	logPix[int(xs[i])-1, int(ys[i])] = (255, 0, 0, 255)

    	logPix[int(xs[prevColIndex]) +1, int(ys[prevColIndex])] = (0, 255, 0, 255)
    	logPix[int(xs[prevColIndex]), int(ys[prevColIndex])+1] = (0, 255, 0, 255)
    	logPix[int(xs[prevColIndex]), int(ys[prevColIndex])-1] = (0, 255, 0, 255)
    	logPix[int(xs[prevColIndex])-1, int(ys[prevColIndex])] = (0, 255, 0, 255)

        logImage.save('poolsLog.png')


        raise Exeption()


    pools[index]["data col"] = i
#	d.text((int(xs[i]), int(ys[i])), avg[i]	, fill=(255 * (i % 3),255 * ((i+1) % 3),255 * ((i+2) % 3),255))


#col(i, j) == 1 iff cols i touch col j. 0 if i or j == 0
colAdj = []
for i in range(len(pools)):
    sublist = []
    for j in range(len(pools)):
        sublist.append(0)
    colAdj.append(sublist)


for x in tqdm(range(1, image.width-1)):
    for y in range(1, image.height-1):
        try:
            me = dic[pix[x, y]]
            left = dic[pix[x - 1, y]]
            colAdj[me][left] = 1
            colAdj[left][me] = 1

            left = dic[pix[x, y - 1]]
            colAdj[me][left] = 1
            colAdj[left][me] = 1
        except:
            pass

# for a in range(1, len(colAdj)):
#     for b in range(1, len(colAdj)):
#         if(colAdj[a][b] == 1 and a != b):
#             print('pool ' + str(a) + ' touches pool ' + str(b))


#openset init : all the outputs
for a in range(1, len(pools)):
    pools[a]["inOpen"] = pools[a]["output"]
    pools[a]["visited"] = pools[a]["output"]

for it in range(100):
    for a in range(1, len(pools)):
        if(not pools[a]["inOpen"]):
            continue

        pools[a]["inOpen"] = False

        for b in range(1, len(pools)):
            if(colAdj[a][b] == 1 and  not pools[b]["visited"] ):
                pools[b]["flowToward"] = a
                pools[b]["visited"] = True
                pools[b]["inOpen"] = True


logImage.save('poolsLog.png')

with open("poolMap.bin", "wb") as fout:
    fout.write(outBytes)

json = '['

for meIndex, p in enumerate(pools[1:]):
    json += '{'

    if(p["data col"] > 0):
        json += '"dataColIndex":' + str(p["data col"] - 1) + ','

    if("flowToward" in p):
        json += '"dstPool":' + str(p["flowToward"]-1) + ','

    srcs = []
    for bIndex, b in enumerate(pools[1:]):
        if("flowToward" in b and b["flowToward"] == meIndex + 1):
            srcs.append(bIndex)

    if(len(srcs) > 0):
        json += '"srcPool":[' + str(srcs[0])
        for s in srcs[1:]:
            json += ', ' + str(s)
        json += '],'


    json = json[:-1]
    json += '},\n'


json = json[:-2]
json += ']'

with open("pools.json", "w") as fout:
    fout.write(json)





realNbStation = 0
for v in avg:
    try:
        float(v)
        realNbStation += 1
    except:
        pass


data = open('hydroFinalAll365.csv', 'r').read().split('\n')[5:-1]

# print(realNbStation )
# print(realNbStation * len(data) * 4)
outStations = bytearray(realNbStation * len(data) * 4)

if(len(data) != 365 * 19):
    raise Exception('not 18 years at 365 days', len(data), 365*19)

i = 0
for l in tqdm(data):
    vals = l.split(',')[1:realNbStation+1]
    for v in vals:
        if(len(v) == 0 or v == '?'):
            v = -1.0
        struct.pack_into("f", outStations, i, float(v))

        i += 4

with open("poolStations.bin", "wb") as fout:
    fout.write(outStations)

print('\n\npoolsMap.bin updated ! \n' +
        ' Warning : in poolMap.bin, indices start at 1 (0 := out of pool). \n' +
        ' Format : row major, 1 octet per pix, ' + str(image.width) + ' x ' + str(image.height)+ '\n\n'
        )
print('pools.json updated ! ')

print('\n\npoolStations.bin updated ! \n' +
        ' Format : row major, float ' + str(realNbStation) + ' x ' + str(365 * 19) +
        '\n Unit : m3/sec, daily data, all year 365 days\n WARNING : -1 on missing data' +
        '\n\n'
        )
