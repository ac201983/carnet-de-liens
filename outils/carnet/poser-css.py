# Pose (ou remplace) le bloc « carnet » dans la feuille de style de l'essai, juste avant les règles d'impression.
import re,sys
p='/home/claude/pparts/p1-head.html'
s=open(p,encoding='utf-8').read()
bloc=open('/home/claude/build/carnet/carnet.css',encoding='utf-8').read().rstrip('\n')+'\n'
A='/* >>> carnet et étang (19 novembre 2026) */\n';B='/* <<< carnet et étang */\n'
if A in s:
    i=s.index(A);j=s.index(B)+len(B);s=s[:i]+A+bloc+B+s[j:]
else:
    k=s.index('@media print{');s=s[:k]+A+bloc+B+s[k:]
open(p,'w',encoding='utf-8').write(s)
print('bloc posé',len(bloc),'caractères')
