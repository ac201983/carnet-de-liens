# Pose (ou remplace) le bloc « la goutte » dans la feuille de style de l'essai, juste après le bloc « la parole ».
p='/home/claude/pparts/p1-head.html'
s=open(p,encoding='utf-8').read()
bloc=open('/home/claude/build/goutte/goutte.css',encoding='utf-8').read().rstrip('\n')+'\n'
A='/* >>> la goutte (19 novembre 2026, le soir) */\n';B='/* <<< la goutte */\n'
if A in s:
    i=s.index(A);j=s.index(B)+len(B);s=s[:i]+A+bloc+B+s[j:]
else:
    C='/* <<< la parole */\n';k=s.index(C)+len(C);s=s[:k]+A+bloc+B+s[k:]
open(p,'w',encoding='utf-8').write(s)
print('bloc « la goutte » posé',len(bloc),'caractères')
