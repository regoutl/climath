import struct


txtin = open("pvcapfactAll365.csv", "r").read()

fout = open("pvcapfactAll365.bin", "wb")

lines = txtin.split('\n')

lines = lines[0:-1]

if(len(lines) % 365*24 != 0):
	print 'not 365 days each years'
	exit

outBytes = bytearray(len(lines))

i = 0
for l in lines:
	outBytes[i] = struct.pack("B", int(round(float(l) * 255.0)))
	i += 1



fout.write(outBytes)

print 'done'
