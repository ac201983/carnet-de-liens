# Pose (ou remplace) le bloc « la préversion » dans la feuille de style, juste après le bloc « le film ».
p='/home/claude/pparts/p1-head.html'
s=open(p,encoding='utf-8').read()
bloc=open('/home/claude/build/preversion/prev.css',encoding='utf-8').read().rstrip('\n')+'\n'
A='/* >>> la préversion (26 novembre 2026) */\n';B='/* <<< la préversion */\n'
if A in s:
    i=s.index(A);j=s.index(B)+len(B);s=s[:i]+A+bloc+B+s[j:]
else:
    C='/* <<< le film */\n';k=s.index(C)+len(C);s=s[:k]+A+bloc+B+s[k:]
open(p,'w',encoding='utf-8').write(s)
print('bloc « la préversion » posé',len(bloc),'caractères')
