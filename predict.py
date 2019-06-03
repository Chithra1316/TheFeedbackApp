import sys
from sklearn.externals import joblib



stp=sys.argv[1]
arr = stp.split(",")
X_test=arr
clf1 = joblib.load("model.pkl")
p=0
pos=0
neg=0
a = []
for i in range(0,len(arr)):   
    c = clf1.predict([X_test[i]])
    p += c
    if c==4:
        pos +=1
        a.append(1)
    else:
        neg +=1
        a.append(0)
p=p/4
l=len(arr)
l=float(l)
p=float(p)
p=p/l
print("Results")
print(p)
print(pos)
print(neg)
print(a)