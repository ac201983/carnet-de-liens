# Pose (ou remplace) le bloc « la parole » dans la feuille de style de l'essai, juste après le bloc « carnet et étang ».
p='/home/claude/pparts/p1-head.html'
s=open(p,encoding='utf-8').read()
bloc=open('/home/claude/build/parole/parole.css',encoding='utf-8').read().rstrip('\n')+'\n'
A='/* >>> la parole (19 novembre 2026) */\n';B='/* <<< la parole */\n'
if A in s:
    i=s.index(A);j=s.index(B)+len(B);s=s[:i]+A+bloc+B+s[j:]
else:
    C='/* <<< carnet et étang */\n';k=s.index(C)+len(C);s=s[:k]+A+bloc+B+s[k:]
open(p,'w',encoding='utf-8').write(s)
print('bloc « la parole » posé',len(bloc),'caractères')
