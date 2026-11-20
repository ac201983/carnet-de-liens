# Pose (ou remplace) le bloc « le film » dans la feuille de style, juste après le bloc « la goutte ».
p='/home/claude/pparts/p1-head.html'
s=open(p,encoding='utf-8').read()
bloc=open('/home/claude/build/film/site/film.css',encoding='utf-8').read().rstrip('\n')+'\n'
A='/* >>> le film (20 novembre 2026) */\n';B='/* <<< le film */\n'
if A in s:
    i=s.index(A);j=s.index(B)+len(B);s=s[:i]+A+bloc+B+s[j:]
else:
    C='/* <<< la goutte */\n';k=s.index(C)+len(C);s=s[:k]+A+bloc+B+s[k:]
open(p,'w',encoding='utf-8').write(s)
print('bloc « le film » posé',len(bloc),'caractères')
