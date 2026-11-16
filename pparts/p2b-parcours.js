
/* ---------- La dose de lumière intérieure (curated) ---------- */
const DOSES=[
  'Aujourd’hui, avant de penser à tout ce qu’il reste à faire, posez-vous une seule question. Qu’est-ce qui va bien en ce moment, même si c’est tout petit ? Vous pouvez commencer par là.',
  'Vous portez beaucoup de choses. Aujourd’hui, je vous propose d’en poser une seule, ne serait-ce qu’une heure. Vous pouvez reporter un rendez-vous, confier une tâche à quelqu’un ou dire non poliment. Vous verrez que tout continue de tenir.',
  'Votre enfant vous regarde comme personne d’autre ne vous regardera jamais. Ce qui compte le plus pour lui, c’est que vous soyez là, bien plus que ce que vous réussissez.',
  'La culpabilité frappe souvent à la porte, presque chaque jour à la même heure. Rien ne vous oblige à lui ouvrir. Vous pouvez lui dire « je t’ai entendue » et retourner à votre journée.',
  'Vous n’avez pas raté la journée d’hier. Elle est passée, et celle d’aujourd’hui vous laisse encore du temps pour faire une petite chose qui compte.',
  'Les progrès de votre enfant ne se comparent pas à ceux des autres enfants. Comparez-le plutôt à ce qu’il était il y a six mois, et prenez le temps de bien regarder.',
  'Si vous ressentez de la fatigue, c’est parce que vous faites le travail de trois personnes. Cela n’a rien à voir avec de la faiblesse. Votre fatigue vous donne une information, et elle mérite que vous l’écoutiez.',
  'Aujourd’hui, essayez de dire une phrase vraie à quelqu’un, par exemple « c’est dur en ce moment ». Vous n’avez rien besoin d’ajouter, et vous verrez ce qui vous revient.',
  'Ce que vous attendez de votre enfant peut l’aider à grandir ou le freiner. Aujourd’hui, attendez de lui une chose qui est à sa portée et dites-le-lui à voix haute.',
  'Il y a une chose que vous faites tous les jours sans que personne la remarque. Je sais qu’elle existe, et je peux vous dire qu’elle compte beaucoup.',
  'Un enfant différent apprend à ses parents une autre façon de voir le temps. Vous êtes en train de l’apprendre avec lui, et c’est quelque chose qu’on n’apprend nulle part ailleurs.',
  'Si vous lisez ces lignes à une heure où tout le monde dort, cela veut dire que vous avez tenu toute la journée. C’est déjà beaucoup, alors accordez-vous du repos maintenant.',
  'Aujourd’hui, cherchez un moment où votre enfant a essayé quelque chose, même s’il n’a pas réussi. Puis dites-le-lui simplement, par exemple « j’ai vu que tu as essayé ».',
  'Vous avez le droit de rire de tout cela de temps en temps. Rire n’enlève rien au sérieux de ce que vous vivez, et cela aide à le porter.',
  'Le regard des autres pèse, je le sais. Vous n’avez pas à leur expliquer quoi que ce soit aujourd’hui. Vous êtes là pour votre enfant et pour vous, et le reste peut attendre.',
  'Ce que vous craignez pour l’avenir n’est pas arrivé. Ce qui est là, c’est la journée d’aujourd’hui, et aujourd’hui vous êtes aux côtés de votre enfant.',
  'Imaginez qu’un ami très proche vive exactement ce que vous vivez. Dites-vous ce que vous lui diriez, et essayez d’y croire autant que lui vous croirait.',
  'Le dimanche, vous n’avez rien à réussir. Vous pouvez faire une promenade, boire un café tranquillement ou profiter d’un moment de silence. Les familles qui tiennent dans la durée sont souvent celles qui savent s’arrêter de temps en temps.'
];
/* ---------- Le parcours : six mois, vingt-quatre étapes ----------
   Le fil : moi aujourd'hui, ce que je ressens, mon regard, mon enfant et ses forces, autour de nous, la suite.
   Chaque étape a un nom stable (id). C'est lui qui range ce que le parent a fait et écrit,
   pour que l'ordre des étapes puisse changer sans rien perdre.
   idee : ce qu'on comprend (une chaîne, ou plusieurs paragraphes) ; sch : le schéma (voir SCHEMAS) ;
   vecu : ce qu'Antonio a vécu, avec ses mots à lui, jamais inventé (une chaîne, ou plusieurs paragraphes) ; ex : un exemple de tous les jours ;
   exo : ce qu'on essaie ; obs : ce qu'on observe ; ecr : ce qu'on écrit dans le carnet de route (ph : l'amorce) ;
   rap : l'étape dont on relit la note ; link : un ou plusieurs boutons (evo, photo, breath, advice, ou « sit_nom » pour une situation). */
const PARCOURS=[
  {m:'Mon point de départ',steps:[
    {id:'depart',t:'D’où je pars',
     idee:['Avant d’avancer, je vous propose de regarder où vous en êtes. Le but n’est pas de vous juger. Il est d’avoir un point de comparaison pour plus tard, parce que la fatigue joue un mauvais tour à la mémoire. Les jours difficiles, elle nous fait croire que rien n’a changé, alors que nous avons parfois beaucoup avancé. Les parents qui tiennent dans la durée sont souvent ceux qui voient le chemin qu’ils ont parcouru.',
       'Aujourd’hui, vous faites donc votre premier point sur cinq choses qui pèsent dans la vie d’un parent, à savoir votre stress, votre sentiment de compétence, votre solitude, votre regard sur votre enfant et votre confiance dans l’avenir. Vous le referez au milieu du parcours, puis à la fin. Il n’y a pas de bonne réponse, il y a seulement la vôtre aujourd’hui.'],
     sch:'points',
     ex:'Prenons un parent qui met 8 sur 10 à son stress aujourd’hui. Au milieu du parcours, il met 6. Sans le premier chiffre, il aurait dit que rien n’avait changé. Avec lui, il voit que son stress a baissé de deux points, et il sait que ses efforts servent à quelque chose.',
     exo:'Faites votre point de départ dans « Mon évolution ». Il y a cinq échelles de 0 à 10 et cela prend trois minutes.',
     obs:'Cette semaine, remarquez à quel moment de la journée le poids est le plus lourd. Contentez-vous de le remarquer, sans rien changer pour l’instant.',
     ecr:'Terminez cette phrase avec vos mots. Je commence ce parcours parce que…',ph:'Je commence ce parcours parce que…',link:'evo'},
    {id:'croire',t:'Croire en lui, l’effet Pygmalion',
     idee:['Ce que nous attendons d’une personne finit souvent par arriver. Cela n’a rien de magique. Quand je crois qu’un enfant peut y arriver, je lui laisse plus de temps, je l’encourage davantage et je remarque ses essais. Lui le sent, et il ose essayer plus longtemps. Comme il essaie, il progresse, et je crois encore plus en lui.',
       'L’inverse est vrai aussi. Si je pense qu’il n’y arrivera pas, je fais à sa place pour aller plus vite, et il finit par ne plus essayer.',
       'On appelle cela l’effet Pygmalion, du nom d’un sculpteur de la mythologie grecque qui aimait tant sa statue qu’elle a fini par prendre vie. Dans les années 1960, le psychologue américain Robert Rosenthal a fait croire à des enseignants que certains de leurs élèves, en réalité tirés au sort, allaient beaucoup progresser. À la fin de l’année, ces élèves avaient en moyenne davantage progressé que les autres, surtout les plus jeunes. La seule chose qui avait changé, c’était le regard de leurs enseignants. Cette expérience a été beaucoup discutée depuis, et d’autres chercheurs ont mesuré un effet plus modeste. Il n’est pas nul pour autant, parce que ce que nous attendons d’un enfant change notre façon d’agir avec lui.'],
     sch:'boucle',
     vecu:['Je l’ai vécu moi-même. Enfant, je pensais ne pas être au niveau. J’étais très médiocre à l’école, je ne comprenais pas et mon langage était très limité. À dix ans, d’après les professionnels qui m’avaient rencontré, je ne parlais qu’avec cent cinquante mots.',
       'Mes parents d’accueil ont cru en moi. Ils m’ont dit que j’étais intelligent. Ils m’ont appris la discipline, avec cinq minutes de lecture et dix minutes d’instrument par jour, et on me félicitait à chaque réussite. Il m’a fallu du temps pour croire en moi, environ deux mois. Ensuite, je me suis dit que j’allais y arriver, et j’ai étudié davantage.',
       'Plus tard, ma femme a cru en moi à son tour, et cela m’a donné la force d’entreprendre plusieurs formations. Aujourd’hui, je forme à mon tour des apprentis. Imaginez le progrès entre mon enfance et aujourd’hui.'],
     ex:'Prenons le moment des chaussures. Si vous pensez qu’il n’y arrivera pas, vous les lui mettez pour partir plus vite, et il n’apprend pas. Si vous pensez qu’il peut y arriver, vous prévoyez cinq minutes de plus, vous le laissez chercher et vous lui dites ce que vous voyez, par exemple « tu as trouvé le bon pied ». Il n’y arrivera peut-être pas tout de suite, mais il aura essayé, et c’est par là que tout commence.',
     exo:'Choisissez une petite chose que votre enfant pourrait réussir cette semaine. Dites-lui une fois par jour que vous l’en croyez capable, et laissez-lui le temps d’essayer.',
     obs:'Notez ce qui change dans sa façon d’essayer, plutôt que dans le résultat.',
     ecr:'Pensez à une personne qui a cru en vous. Qu’est-ce que cela a changé pour vous ?'},
    {id:'croyances',t:'Les croyances qui freinent',
     idee:['Vous vous êtes peut-être déjà dit « il ne pourra jamais », « avec son handicap, c’est inutile » ou « je dois tout faire à sa place ». Ces phrases ne sont pas des faits. Ce sont des croyances, que nous avons souvent héritées ou qu’un professionnel pressé nous a dites il y a dix ans.',
       'Une croyance fonctionne comme une paire de lunettes. Elle choisit ce que nous remarquons. Si je pense qu’il est lent, je vois chaque retard et j’oublie les matins où il était prêt à l’heure.',
       'Une croyance qui aide n’a rien d’un mensonge optimiste. C’est une phrase tout aussi vraie, mais qui ouvre une porte au lieu de la fermer. « Il apprend à son rythme » est aussi vrai que « il est lent », et pourtant ces deux phrases ne vous emmènent pas au même endroit.'],
     sch:'chemins',
     vecu:'Un professeur m’a dit un jour « tu n’y arriveras jamais ». On m’a aussi traité d’idiot. Plus tard, c’est d’un de mes fils qu’un professionnel a dit qu’il avait peu de chances de progresser dans son langage. Il lui avait collé une étiquette, alors que d’autres spécialistes disaient le contraire. Nous avons choisi de croire en notre fils plutôt qu’en cette étiquette. Depuis qu’il est dans son école actuelle, il a fait un bond énorme.',
     ex:'Voici deux autres exemples. « Elle ne parle pas » peut devenir « elle se fait comprendre autrement ». « Il fait des crises » peut devenir « il n’a pas encore d’autre moyen de dire que c’est trop ».',
     exo:'Repérez trois phrases que vous vous dites sur votre enfant quand c’est difficile. Pour chacune, cherchez une phrase aussi vraie qui ouvre une porte.',
     obs:'Repérez la croyance qui revient le plus souvent dans votre tête.',
     ecr:'Écrivez la phrase qui revient le plus souvent dans votre tête. Puis écrivez une phrase aussi vraie, qui ouvre une porte.'},
    {id:'objectifs',t:'Mes objectifs à moi',
     idee:['Un parcours sans objectif ressemble à une promenade. C’est agréable, mais on ne sait pas vraiment si l’on avance. Les objectifs dont je parle ici ne concernent pas votre enfant, ils vous concernent vous. Cela peut être dormir, souffler, mieux comprendre, oser demander ou arrêter de vous excuser.',
       '« Me reposer » est un souhait, et un souhait reste flou. Il devient un objectif quand vous pouvez dire quoi exactement, quand, et avec l’aide de qui. Choisissez-le petit. Un objectif que vous pouvez tenir une semaine vaut mieux qu’un idéal pour toute l’année.'],
     sch:'marches',
     vecu:'Comme père, j’ai des objectifs et je veux les atteindre, comme évoluer dans mon métier et me former. Je le fais pour moi, pour montrer à mes enfants que tout est possible, et pour offrir à ma famille une sécurité, dans tous les sens du terme. Je crée aussi ce projet pour avoir plus de temps pour ma famille. Vous qui me lisez, je suis sûr que vous y arriverez aussi. Vous êtes de bons parents, j’en suis certain.',
     ex:'Voici un autre exemple. « Mieux comprendre mon fils » devient « samedi matin, je relis pendant une demi-heure le dernier rapport que j’ai reçu, et je note mes trois questions ».',
     exo:'Choisissez un seul objectif pour le mois et écrivez-le dans votre carnet, plus bas. Puis parlez-en à une personne.',
     obs:'Chaque soir, faites une croix si vous avez fait un pas vers cet objectif. Un soir sans croix n’est pas un échec, il vous renseigne simplement sur votre journée.',
     ecr:'Écrivez votre objectif pour ce mois, en commençant par « D’ici un mois, je… ».',ph:'D’ici un mois, je…'}
  ]},
  {m:'Ce que je ressens',steps:[
    {id:'emotions',t:'Mes émotions, mes signaux',
     idee:'La colère, la tristesse, la honte, la peur et l’épuisement sont des émotions très fortes chez les parents d’un enfant différent, et on se les interdit souvent. Pourtant, ce sont des signaux et non des fautes. La colère vous dit que quelque chose est injuste, la tristesse que vous avez perdu quelque chose, et la peur que vous tenez à votre enfant. Quand on nomme une émotion, elle baisse d’un cran. Quand on la nie, elle ressort ailleurs, et souvent sur la mauvaise personne.',
     exo:'Pour commencer, ouvrez le photolangage et choisissez l’image qui dit le mieux ce que vous ressentez ces jours-ci. Ensuite, trois fois cette semaine, quand l’émotion monte, nommez-la à voix basse. Dites par exemple « là, c’est de la colère », « là, c’est de la peur » ou « là, c’est de la tristesse », sans rien faire d’autre.',
     obs:'Repérez l’émotion que vous vous interdisez le plus.',
     ecr:'Quelle émotion vous interdisez-vous le plus ? Que vous dirait-elle si vous l’écoutiez ?',link:'photo'},
    {id:'culpa',t:'La culpabilité',
     idee:'La culpabilité est sans doute l’émotion la plus répandue chez les parents. Elle dit « j’aurais dû le voir plus tôt », « je n’en fais pas assez » ou « je me suis encore énervé ». Elle se présente comme de la lucidité, mais elle mélange deux choses très différentes. Il y a ce qui dépendait de vous, et que vous pouvez réparer par un mot ou par un geste. Et il y a tout ce qui ne dépendait pas de vous, comme la différence de votre enfant, la fatigue ou le manque de relais, et que vous portez quand même. La culpabilité utile dure le temps de réparer. Celle qui s’installe pendant des années ne répare rien, elle vous use. Si vous la ressentez, c’est d’abord parce que vous tenez à votre enfant.',
     vecu:'Comme papa, je me suis senti coupable de ne pas offrir assez de temps à mes enfants, pris par le quotidien, le travail et les obligations. Il faut agender du temps pour la famille et les enfants, et ce temps doit être non négociable. Ce n’est pas tant le temps que je passe avec ma famille qui compte, c’est la qualité de ma présence quand je suis là. Cela fait la différence. La famille, la santé et vous, c’est ce qu’il y a de plus important, et les trois sont liés.',
     exo:'Prenez une feuille et faites deux colonnes. À gauche, écrivez ce qui dépendait vraiment de vous. À droite, écrivez ce qui n’en dépendait pas. Pour la colonne de gauche, choisissez une seule réparation, comme un mot d’excuse ou un moment à deux. La colonne de droite, vous pouvez la déposer.',
     obs:'Remarquez à quel moment de la journée la culpabilité parle le plus fort, et ce qu’elle dit toujours en premier.',
     ecr:'Quelle phrase votre culpabilité répète-t-elle le plus souvent ? Que diriez-vous à un ami qui se dirait la même chose ?',link:'sit_culpa'},
    {id:'reguler',t:'Me calmer, puis lâcher prise',
     idee:'On ne choisit pas ce qu’on ressent, mais on peut choisir ce qu’on en fait. Respirer plus lentement que l’émotion, sortir trente secondes, poser les mains à plat ou dire une phrase apprise par cœur sont des gestes qui calment le corps avant la tête. Lâcher prise ne veut pas dire renoncer. Cela veut dire arrêter de porter ce qui ne dépend pas de vous.',
     exo:'Choisissez un seul geste pour vous calmer, comme la respiration 4-6, les mains à plat, sortir un instant ou une phrase. Utilisez-le chaque fois que l’émotion monte, pendant une semaine.',
     obs:'Parmi vos soucis de la semaine, repérez ce qui ne dépend pas de vous. Écrivez-le, puis laissez-le de côté.',
     ecr:'Quel geste vous calme le mieux ? Écrivez-le ici, pour le retrouver un jour de tempête.',link:'breath'},
    {id:'appuis',t:'Mes appuis pour tenir',
     idee:'On appelle résilience la capacité de tenir debout quand la vie secoue, et de se relever ensuite. Ce n’est pas une qualité qu’on a ou qu’on n’a pas. Elle se construit avec des appuis, comme une personne qui écoute, un lieu qui apaise, une activité qui vous fait du bien ou une phrase qui vous tient debout. Je vous invite à trouver vos appuis, à les nommer et à aller vers eux volontairement.',
     vecu:'J’ai été placé en famille d’accueil à dix ans. Ce qui m’a aidé à tenir, ce sont mes parents d’accueil, qui sont devenus mon pilier.',
     exo:'Trouvez vos quatre appuis, c’est-à-dire une personne, un lieu, une activité et une phrase, et notez-les dans votre carnet, plus bas. Prévoyez ensuite un rendez-vous avec chacun d’eux dans le mois.',
     obs:'Remarquez ce qui vous recharge vraiment, et ce qui vous aide seulement à ne plus rien sentir.',
     ecr:'Écrivez vos quatre appuis, une personne, un lieu, une activité et une phrase.'}
  ]},
  {m:'Mon regard',steps:[
    {id:'regard',t:'D’où vient notre regard sur le handicap',
     idee:'Le regard sur le handicap a beaucoup changé avec le temps. On l’a d’abord caché, puis on a voulu le soigner, le réparer et l’intégrer. Aujourd’hui, la Convention de l’ONU le décrit comme la rencontre entre une personne et un environnement plus ou moins accessible. Savoir cela change quelque chose, parce que ce que votre enfant ne peut pas faire dépend aussi de ce que le monde met ou ne met pas à sa portée. Ses limites ne reposent donc pas uniquement sur vos épaules, et vous pouvez agir sur ce qui l’entoure.',
     exo:'Repérez cette semaine une situation où la difficulté venait de l’environnement plutôt que de votre enfant, comme un lieu trop bruyant, une consigne trop longue ou un horaire trop serré. Demandez-vous ce qu’on pourrait y changer.',
     obs:'Écoutez comment on parle du handicap autour de vous, à la télévision, à l’école ou en famille.',
     ecr:'Racontez une situation où c’est l’environnement qui a mis votre enfant en difficulté. Qu’est-ce qui aurait pu l’aider ?'},
    {id:'enfant',t:'Voir mon enfant avant son diagnostic',
     idee:'Les idées que la société se fait du handicap s’invitent jusque dans notre cuisine. Elles nous font voir les difficultés avant la personne, et le diagnostic avant le prénom. Pourtant, chaque enfant est d’abord une personne unique, avec ses goûts, son humour, ses peurs et ses talents. Le handicap décrit une partie de son fonctionnement, mais il ne dit pas qui il est. Cette semaine, je vous propose d’inverser l’ordre et de regarder d’abord qui est votre enfant, puis ce dont il a besoin. Vous ne niez pas le handicap en faisant cela. Vous lui redonnez sa vraie place, celle d’une partie de sa vie et non de sa vie entière.',
     exo:'Dans votre carnet, plus bas, décrivez votre enfant en dix lignes sans utiliser un seul mot de son dossier. Faites aussi la liste de cinq choses qu’il fait mieux que la plupart des gens. Cherchez bien, parce qu’il y en a.',
     obs:'Quand vous présentez votre enfant à quelqu’un, remarquez si vous commencez par son prénom ou par son diagnostic.',
     ecr:'Décrivez votre enfant sans un seul mot de son dossier. Parlez de ses goûts, de son caractère, de son humour et de ses petites manières.'},
    {id:'avenir',t:'Une vision de l’avenir qui donne envie',
     idee:'L’avenir fait peur surtout parce qu’il est flou. Un avenir que l’on souhaite, même imparfait, peut se construire. Il ne s’agit pas de faire un plan de carrière, mais d’avoir une image en tête. Où vit-il, avec qui, que fait-il le matin et qu’est-ce qui le fait rire ? Les parents qui ont cette image avancent vers elle, alors que les autres subissent souvent celle que d’autres ont choisie pour leur enfant.',
     exo:'Cette semaine, l’exercice est d’écrire. Prenez un moment au calme et racontez cette journée dans votre carnet, plus bas.',
     obs:'Dans la semaine, remarquez un petit pas qui va déjà dans cette direction.',
     ecr:'Écrivez une journée de votre enfant dans dix ans, du réveil au coucher, la plus belle possible tout en restant réaliste.'},
    {id:'mi',t:'Le bilan de mi-parcours',
     idee:'Vous êtes à la moitié du parcours. C’est le moment de regarder le chemin que vous avez fait plutôt que la montagne qu’il reste à gravir. Refaites le point sur votre stress, votre sentiment de compétence, votre solitude, votre regard et votre confiance, puis comparez avec le départ sans vous juger. Ce qui a bougé vous appartient, et ce qui n’a pas bougé vous montre où porter vos efforts pendant la seconde moitié. Vous pouvez aussi ajuster votre objectif, parce qu’il a le droit d’avoir changé.',
     exo:'Refaites le point dans « Mon évolution », puis choisissez une nouvelle photo dans le photolangage. Relisez ensuite la phrase que vous aviez écrite en commençant le parcours. Elle est sur cette page.',
     obs:'Remarquez ce qui a bougé sans que vous l’ayez décidé.',
     ecr:'Qu’est-ce que vous faites aujourd’hui que vous ne faisiez pas en commençant ?',rap:'depart',link:['evo','photo']}
  ]},
  {m:'Mon enfant et ses forces',steps:[
    {id:'talents',t:'Ses talents, ses compétences',
     idee:'Un talent n’a pas besoin d’être spectaculaire. Remarquer les détails, bien mémoriser, persévérer, sentir l’humeur des autres, rire aux éclats ou être fidèle sont de vraies compétences, et elles se cultivent. Quand on nomme une compétence, elle se renforce. Quand on ne la remarque pas, elle finit par s’éteindre.',
     exo:'Choisissez une compétence de votre enfant et créez une occasion de l’exercer cette semaine. Dites-lui ce que vous avez vu.',
     obs:'Comptez les fois où vous nommez une compétence, et les fois où vous nommez une difficulté.',
     ecr:'Quelle compétence de votre enfant avez-vous choisie ? Qu’avez-vous vu quand il l’a exercée ?'},
    {id:'encourager',t:'Encourager juste',
     idee:'Encourager ne veut pas dire féliciter tout le temps. Il s’agit plutôt de trouver le bon dosage, parce que trop d’aide étouffe et que trop peu d’aide décourage. Un bon encouragement vise le pas suivant, celui que votre enfant peut atteindre avec un peu d’effort, et il parle de l’effort plutôt que du résultat. « Tu as essayé trois fois » porte plus loin que « bravo ».',
     exo:'Cette semaine, remplacez « bravo » par la description de ce que vous avez vu, par exemple « tu as attendu », « tu as demandé » ou « tu as réessayé ».',
     obs:'Repérez un moment où vous aidez par habitude alors que votre enfant pourrait essayer.',
     ecr:'Écrivez trois phrases qui décrivent ce que vous avez vu cette semaine, à la place de « bravo ».'},
    {id:'solutions',t:'Des solutions pour le quotidien',
     idee:'Les problèmes concrets ont souvent des solutions concrètes. On peut prévenir avant un changement d’activité, montrer en images, proposer deux choix, simplifier une consigne ou préparer une sortie. Les outils de l’application sont là pour cela. Choisissez une seule difficulté du quotidien et essayez de la résoudre avec une méthode, plutôt qu’en y mettant encore plus de volonté.',
     exo:'Dans la boîte à outils, choisissez la situation que vous vivez le plus souvent et essayez une seule des pistes pendant sept jours.',
     obs:'Notez chaque soir si c’était mieux, pareil ou moins bien. Au bout de sept jours, vous pourrez décider de continuer ou de changer.',
     ecr:'Quelle situation avez-vous choisie, quelle piste avez-vous essayée, et qu’est-ce que cela a donné au bout de sept jours ?',link:'advice'},
    {id:'place',t:'Sa place parmi les autres',
     idee:'On parle d’inclusion quand un enfant a sa place à table, à l’école, au club ou au magasin, avec les adaptations dont il a besoin. C’est donc quelque chose de très concret. Elle peut être scolaire, professionnelle, sociale ou liée au lieu de vie, et il existe beaucoup de possibilités entre la classe ordinaire et l’institution spécialisée. Celle qui convient à votre enfant peut d’ailleurs changer avec l’âge. L’inclusion réussit quand quelqu’un prépare le terrain, et beaucoup moins quand on jette l’enfant dans le grand bain. Ce quelqu’un, c’est souvent vous. Vous avez aussi le droit de choisir vos combats, parce que certains lieux méritent votre énergie et d’autres non.',
     exo:'Choisissez un lieu où vous aimeriez que votre enfant ait davantage sa place, et notez dans votre carnet ce qui rendrait cela possible. Parlez-en ensuite à une personne de ce lieu.',
     obs:'Observez un lieu où l’inclusion marche déjà. Qu’est-ce qui fait que ça marche ?',
     ecr:'Dans quel lieu aimeriez-vous que votre enfant ait davantage sa place ? Qu’est-ce qui rendrait cela possible, une personne, une adaptation ou une habitude ?'}
  ]},
  {m:'Autour de nous',steps:[
    {id:'couple',t:'À deux, ou seul',
     idee:'Un enfant différent bouscule aussi la vie à deux. Souvent, l’un des parents porte les rendez-vous et l’organisation pendant que l’autre porte l’inquiétude en silence, et chacun croit que l’autre ne voit pas ce qu’il fait. On ne vit pas non plus les choses au même rythme. L’un a besoin d’en parler, l’autre a besoin de ne pas y penser, et aucun des deux n’a tort. Ce qui protège un couple, c’est un moment régulier où l’on se parle d’autre chose que de l’organisation. Si vous élevez votre enfant seul ou seule, la question se pose autrement. Il vous faut une personne avec qui partager les décisions, pour ne pas tout porter dans votre tête.',
     exo:'Cette semaine, prenez vingt minutes avec l’autre parent, ou avec la personne qui compte pour vous, et posez-lui une seule question, « qu’est-ce qui est le plus lourd pour toi en ce moment ? ». Écoutez la réponse jusqu’au bout, sans chercher de solution.',
     obs:'Remarquez ce que l’autre fait déjà et que vous ne voyiez plus.',
     ecr:'Qu’avez-vous entendu que vous ne saviez pas ?',link:'sit_couple'},
    {id:'fratrie',t:'Les frères et sœurs',
     idee:'Quand un enfant demande beaucoup, ses frères et sœurs apprennent vite à ne pas en rajouter. Ils deviennent sages et serviables, parfois trop. Ils peuvent ressentir de la jalousie, de la honte devant les copains ou de l’inquiétude, et se sentir coupables de ressentir tout cela. Ils n’ont pas besoin que tout soit égal. Ils ont besoin de savoir ce qui se passe, avec des mots à leur hauteur, d’avoir le droit de se plaindre, et d’avoir de temps en temps un parent pour eux seuls. Si votre enfant n’a ni frère ni sœur, cette étape peut vous servir pour ses cousins ou pour ses amis proches.',
     exo:'Offrez à chaque frère ou sœur vingt minutes seul avec vous cette semaine, pour une activité qu’il choisit. Pendant ce moment, on ne parle pas de son frère ou de sa sœur, sauf s’il en a envie.',
     obs:'Écoutez comment ils parlent de leur frère ou de leur sœur devant leurs amis.',
     ecr:'Qu’a choisi de faire chaque enfant pendant son moment avec vous ? Qu’avez-vous remarqué ?',link:'sit_fratrie'},
    {id:'entourage',t:'Ma place dans mon entourage',
     idee:'Vous avez changé, et votre regard sur la différence aussi. Autour de vous, il y a des personnes qui n’ont pas fait ce chemin et qui disent parfois des choses maladroites. Si vous le souhaitez, et quand vous en avez la force, vous pouvez faire évoluer un regard à la fois. Vous n’avez pas besoin de militer pour cela, il suffit de montrer votre enfant tel qu’il est.',
     exo:'Choisissez une personne de votre entourage et racontez-lui une chose de votre enfant qu’elle ne connaît pas et qui le montre tel qu’il est.',
     obs:'Observez ce qui change dans la façon dont cette personne parle de lui ensuite.',
     ecr:'À qui avez-vous parlé de votre enfant ? Qu’est-ce qui a changé dans sa façon d’en parler ?',link:'sit_regard'},
    {id:'pros',t:'Collaborer avec les professionnels',
     idee:'Les professionnels savent des choses que vous ne savez pas, et vous savez des choses qu’ils ne sauront jamais. La collaboration commence quand chacun apporte sa part sans défendre son territoire. Si vous arrivez avec trois points écrits et des questions simples, et que vous repartez avec des décisions notées, vous devenez un vrai partenaire.',
     exo:'Préparez votre prochaine rencontre en écrivant trois points, à savoir ce qui va bien, ce qui vous inquiète et ce que vous demandez.',
     obs:'Pendant la rencontre, remarquez si l’on vous écoute vraiment. Si ce n’est pas le cas, redemandez calmement.',
     ecr:'Écrivez vos trois points pour la prochaine rencontre, ce qui va bien, ce qui vous inquiète et ce que vous demandez.',link:'sit_pros'}
  ]},
  {m:'La suite',steps:[
    {id:'tenir',t:'Tenir dans la durée',
     idee:'Accompagner un enfant différent demande de tenir longtemps, et personne ne tient longtemps sans se ravitailler. Demander un relais ne veut pas dire abandonner. C’est ce qui vous permettra d’être encore là dans dix ans. La suite peut très bien exister sans parcours. Ce dont elle a besoin, c’est d’un rythme, avec un moment pour vous chaque semaine, des rencontres préparées, un dépôt quand cela pèse et une dose de lumière quand vous en avez besoin. Choisissez ce que vous voulez garder et laissez le reste.',
     vecu:'Je cours régulièrement et j’aime comparer la vie de parent à un marathon. On ne peut pas le courir au sprint et on a besoin de ravitaillements pour tenir.',
     exo:'Choisissez vos trois rituels pour les six prochains mois et notez-les dans votre agenda. Choisissez aussi une personne ou un service à qui vous demanderez un relais, même pour deux heures.',
     obs:'Essayez vos rituels pendant une semaine et gardez ceux qui tiennent.',
     ecr:'Écrivez vos trois rituels pour les six prochains mois, et le relais que vous allez demander.',link:'sit_aide'},
    {id:'demain',t:'Préparer l’avenir, pas à pas',
     idee:'Reprenez la journée dans dix ans que vous aviez écrite et relisez-la. Qu’est-ce qui a déjà avancé, et qu’est-ce qui manque encore ? Les grandes questions, comme ce qui se passera quand vous ne serez plus là, le logement ou les proches qui prendront le relais, se préparent par petites décisions, une par saison. Vous vous entraînez depuis le début du parcours à faire des petits pas, alors continuez sur ce rythme.',
     exo:'Choisissez une seule décision à prendre dans les six prochains mois pour préparer l’avenir, et fixez-lui une date.',
     obs:'Nommez une personne à qui vous en parlerez.',
     ecr:'Quelle décision allez-vous prendre dans les six prochains mois pour préparer l’avenir ? À quelle date ?',rap:'avenir',link:'sit_grandir'},
    {id:'bilan',t:'Le bilan du parcours',
     idee:'Refaites le point une dernière fois et comparez vos trois moments, le départ, la mi-parcours et aujourd’hui. Ce qui a bougé est à vous. Ce qui n’a pas bougé n’est pas un échec, parce que certaines choses demandent plus de temps ou d’autres appuis. Prenez aussi un moment pour regarder ce que vous avez mis en place, ce qui tient tout seul maintenant et ce qui a encore un peu besoin de vous. Ce que vous avez gagné ne se résume pas à des chiffres. Vous avez aujourd’hui des réflexes que vous n’aviez pas en commençant.',
     exo:'Faites le point final dans « Mon évolution » et choisissez une dernière photo dans le photolangage. Relisez ensuite votre carnet de route.',
     obs:'Remarquez une situation que vous gérez aujourd’hui sans y penser.',
     ecr:'Écrivez trois choses qui ont changé, et une qui résiste encore.',rap:'mi',link:['evo','photo']},
    {id:'chemin',t:'Le chemin parcouru',
     idee:'Vous voilà au bout des vingt-quatre étapes, avec un enfant qui n’a pas attendu que vous ayez fini pour grandir. Vous avez regardé où vous en étiez, appris à nommer vos émotions et trouvé vos appuis. Vous avez changé une partie de votre regard, vu les forces de votre enfant, préparé vos rencontres et choisi vos rituels. Vous n’êtes pas pour autant un parent parfait, et personne ne l’est. Vous êtes un parent plus éclairé qu’au premier jour. C’est vous qui avez fait ce chemin, et vous pouvez en être fier ou fière.',
     exo:'Cette semaine, l’exercice est d’écrire une lettre à la personne que vous étiez en commençant ce parcours. Vous pouvez l’écrire dans votre carnet, plus bas.',
     obs:'Gardez cette lettre et relisez-la un jour où tout vous paraît gris.',
     ecr:'Écrivez à la personne que vous étiez en commençant ce parcours, et dites-lui ce que vous savez maintenant.',rap:'depart'}
  ]}
];
/* L'ordre d'avant le 16 novembre 2026 : à la place n se trouvait l'étape qui porte aujourd'hui ce nom.
   Sert une seule fois, à ranger sous leur nom les étapes déjà faites par un parent venu avant. */
const PARCOURS_AVANT=['depart','croire','croyances','objectifs','regard','enfant','place','avenir','emotions','reguler','appuis','mi','enfant','talents','encourager','solutions','place','pros','entourage',null,'bilan','tenir','demain','chemin'];
/* Une étape s'ouvre sept jours après que la précédente a été ouverte : une semaine pour essayer, et jamais de retard qui s'accumule. */
const PAS_JOURS=7;

/* ---------- Les schémas du parcours ----------
   Un schéma se construit morceau par morceau, à la demande (« Voir la suite »). vb : le cadre du dessin ;
   alt : ce que le dessin montre, pour les lecteurs d'écran ; base : ce qui est toujours là ;
   l : les morceaux, dans l'ordre où ils sont dessinés, chacun avec le numéro du moment où il apparaît ;
   caps : une phrase par moment. Les mots du dessin restent très courts, la phrase complète est dessous. */
const sFleche=k=>'<defs><marker id="fl-'+k+'" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="s-tete" d="M2 1.5 L8 5 L2 8.5"/></marker><marker id="flr-'+k+'" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="s-tete rose" d="M2 1.5 L8 5 L2 8.5"/></marker></defs>';
const sBulle=(cx,cy,w,lignes,cls,num,haut)=>{const h=haut||(lignes.length>1?46:36),x=cx-w/2,y=cy-h/2,dx=num?11:0;
  return '<rect class="s-bulle'+(cls?' '+cls:'')+'" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(h>40?16:18)+'"/>'+
    (num?'<circle class="s-num" cx="'+(x+19)+'" cy="'+cy+'" r="10.5"/><text class="s-numt" x="'+(x+19)+'" y="'+(cy+4.6)+'" text-anchor="middle">'+num+'</text>':'')+
    lignes.map((l,i)=>'<text class="s-t" x="'+(cx+dx)+'" y="'+(cy+4.6+(i-(lignes.length-1)/2)*16)+'" text-anchor="middle">'+l+'</text>').join('');};
const sTrait=(d,k,cls)=>'<path class="s-a'+(cls?' '+cls:'')+'" d="'+d+'" marker-end="url(#fl'+(cls==='rose'?'r':'')+'-'+k+')"/>';
const SCHEMAS={
  points:{vb:'0 0 340 200',
    alt:'Un chemin qui monte, avec trois points. Le premier est posé aujourd’hui, le deuxième au milieu du parcours et le troisième à la fin. Une ligne relie les trois points.',
    base:'<path class="s-route" d="M30 152 C 95 152, 105 98, 170 98 S 250 44, 310 44"/>',
    l:[[4,'<path class="s-trace" pathLength="1" d="M30 152 C 95 152, 105 98, 170 98 S 250 44, 310 44"/>'],
       [1,'<circle class="s-halo" cx="30" cy="152" r="16"/><circle class="s-point" cx="30" cy="152" r="9"/><text class="s-t" x="16" y="186" text-anchor="start">Aujourd’hui</text>'],
       [2,'<circle class="s-halo" cx="170" cy="98" r="16"/><circle class="s-point" cx="170" cy="98" r="9"/><text class="s-t" x="170" y="132" text-anchor="middle">Au milieu</text>'],
       [3,'<circle class="s-halo" cx="310" cy="44" r="16"/><circle class="s-point" cx="310" cy="44" r="9"/><text class="s-t" x="324" y="20" text-anchor="end">À la fin</text>']],
    caps:['Aujourd’hui, vous posez votre premier point.','Au milieu du parcours, vous en posez un deuxième.','À la fin, vous posez le troisième.','C’est en reliant ces trois points que vous verrez votre chemin.']},
  boucle:{vb:'0 0 340 300',
    alt:'Une boucle en quatre moments. Je crois en lui, alors je lui laisse du temps, alors il ose essayer, alors je vois ses essais, et j’y crois encore plus. Une flèche ramène du dernier moment au premier.',
    base:sFleche('boucle'),
    l:[[1,sBulle(160,36,214,['Je crois en lui'],'',1)],
       [2,sTrait('M160 57 L160 85','boucle')+sBulle(160,108,214,['Je lui laisse du temps'],'',2)],
       [3,sTrait('M160 129 L160 157','boucle')+sBulle(160,180,214,['Il ose essayer'],'',3)],
       [4,sTrait('M160 201 L160 229','boucle')+sBulle(160,252,214,['Je vois ses essais'],'',4)],
       [5,'<path class="s-a s-retour" pathLength="1" d="M267 252 C 330 252, 330 36, 271 36"/><path class="s-tete s-fin" d="M280 30 L271 36 L280 42"/>']],
    caps:['Je crois qu’il peut y arriver.','Alors je l’encourage et je lui laisse du temps.','Il le sent, et il ose essayer plus longtemps.','Je vois ses essais, et j’y crois encore plus.','La boucle est lancée. Elle tourne aussi dans l’autre sens, quand on cesse d’y croire.']},
  chemins:{vb:'0 0 340 300',
    alt:'Un même fait, il lui faut vingt minutes pour s’habiller, et deux chemins. À gauche, je me dis qu’il est lent, je fais à sa place et il ne s’exerce plus. À droite, je me dis qu’il apprend à son rythme, je commence plus tôt et il s’exerce chaque matin.',
    base:sFleche('chemins'),
    l:[[1,sBulle(170,28,250,['Vingt minutes pour s’habiller'],'fait')],
       [4,'<rect class="s-anneau" x="39" y="4" width="262" height="48" rx="24"/>'],
       [2,sTrait('M150 48 C 150 66, 88 62, 88 80','chemins','rose')+sBulle(88,108,156,['« Il est lent »'],'rose',0,46)+sTrait('M88 133 L88 147','chemins','rose')+sBulle(88,174,156,['Je fais','à sa place'],'rose')+sTrait('M88 199 L88 213','chemins','rose')+sBulle(88,240,156,['Il ne s’exerce','plus'],'rose')+'<path class="s-bout" d="M66 280 L110 280"/><path class="s-a rose nu" d="M88 265 L88 278"/>'],
       [3,sTrait('M190 48 C 190 66, 252 62, 252 80','chemins')+sBulle(252,108,156,['« Il apprend','à son rythme »'],'vert')+sTrait('M252 133 L252 147','chemins')+sBulle(252,174,156,['Je commence','plus tôt'],'vert')+sTrait('M252 199 L252 213','chemins')+sBulle(252,240,156,['Il s’exerce','chaque matin'],'vert')+sTrait('M252 265 L252 290','chemins')]],
    caps:['Voici un fait. Il lui faut vingt minutes pour s’habiller.','Si je me dis « il est lent », je fais à sa place, et il ne s’exerce plus.','Si je me dis « il apprend à son rythme », je commence plus tôt, et il s’exerce chaque matin.','Le fait est le même. C’est la phrase que je choisis qui décide du chemin.']},
  marches:{vb:'0 0 340 240',
    alt:'Un escalier de quatre marches qui mène à un drapeau. La première marche est un souhait. Les suivantes disent quoi exactement, quand, et avec l’aide de qui. En haut, le souhait est devenu un objectif.',
    base:'<path class="s-sol" d="M8 214 L332 214"/>',
    l:[[1,'<rect class="s-marche" x="14" y="178" width="78" height="36"/><text class="s-t" x="53" y="201" text-anchor="middle">un souhait</text>'],
       [2,'<rect class="s-marche" x="92" y="142" width="78" height="72"/><text class="s-t" x="131" y="165" text-anchor="middle">quoi ?</text>'],
       [3,'<rect class="s-marche" x="170" y="106" width="78" height="108"/><text class="s-t" x="209" y="129" text-anchor="middle">quand ?</text>'],
       [4,'<rect class="s-marche" x="248" y="70" width="78" height="144"/><text class="s-t" x="287" y="93" text-anchor="middle">avec qui ?</text>'],
       [5,'<path class="s-mat" d="M300 70 L300 18"/><path class="s-drapeau" d="M300 18 L270 29 L300 40 Z"/><text class="s-t fort" x="262" y="34" text-anchor="end">un objectif</text>']],
    caps:['Au départ, il y a un souhait. Je voudrais souffler.','Je dis quoi exactement. Je veux marcher vingt minutes.','Je dis quand. Ce sera jeudi soir.','Je dis avec l’aide de qui. Ma sœur gardera les enfants.','Mon souhait est devenu un objectif que je peux tenir.']}
};

/* ---------- Mon évolution (questionnaire) ---------- */
const EVO_SCALES=[
  {id:'stress',t:'Mon niveau de stress',lo:'calme',hi:'à bout'},
  {id:'comp',t:'Mon sentiment de compétence comme parent',lo:'fragile',hi:'solide'},
  {id:'seul',t:'Ma solitude face à la situation',lo:'aucune',hi:'très grande'},
  {id:'regard',t:'Mon regard sur mon enfant',lo:'je vois d’abord ses difficultés',hi:'je vois d’abord qui il est'},
  {id:'confiance',t:'Ma confiance dans l’avenir',lo:'peur',hi:'confiance'}
];
const EVO_OPEN=[['avant','Que connaissiez-vous du handicap avant qu’il entre dans votre vie de famille ?'],['change','Votre regard a-t-il changé depuis ? Qu’est-ce qui a changé, et comment l’expliquez-vous ?']];
const EVO_TIMES=[['t1','Point de départ'],['t2','Mi-parcours (3 mois)'],['t3','Bilan (6 mois)']];
/* ---------- Photolangage ---------- */
/* Quarante-huit photos du domaine public (licence CC0). Elles viennent de la collection de fonds d'écran d'Ubuntu Budgie,
   qui indique l'auteur et la source de chacune (la liste est dans site-src/credits-photos.md).
   Chaque ligne : le nom du fichier, le libellé, la description lue par les lecteurs d'écran. */
const PHOTOS=[
  ['aube','Une aube','Les premiers rayons du soleil traversent une forêt.'],
  ['mer','Une mer agitée','Une mer grise et agitée, avec des vagues courtes.'],
  ['calme','Une mer calme','Une mer parfaitement calme sous un ciel pâle.'],
  ['ciel','Un ciel chargé','Des nuages sombres au-dessus de la mer, au coucher du soleil.'],
  ['bouteille','Une bouteille à la mer','Une bouteille fermée, avec un message dedans, posée sur le sable.'],
  ['barques','Deux barques','Deux barques posées au bord d’un lac, au coucher du soleil.'],
  ['amarre','Une barque amarrée','Une barque en bois attachée à un ponton par une chaîne.'],
  ['goutte','Une goutte','Une goutte rebondit sur une eau calme.'],
  ['eau','Une eau claire','Une eau verte et transparente au pied de rochers et de sapins.'],
  ['arcenciel','Un arc-en-ciel','Une personne, les bras ouverts, devant une cascade et un arc-en-ciel.'],
  ['cascade','Une cascade','Une personne de dos, toute petite, devant une grande cascade.'],
  ['crete','Une crête dans les nuages','Une crête rocheuse à moitié cachée par les nuages.'],
  ['col','Un col de montagne','Une vallée entre deux montagnes, avec un lac où elles se reflètent.'],
  ['cordee','Une cordée','Une file de marcheurs traverse une grande étendue de neige.'],
  ['echelle','Une échelle','Une échelle en bois posée contre une pente, qui monte vers la brume.'],
  ['chemin','Un chemin','Un chemin de terre qui tourne dans une forêt, sous un rayon de soleil.'],
  ['tunnel','Un tunnel','Une longue passerelle couverte, avec la lumière au bout.'],
  ['escalier','Un escalier','Un escalier en colimaçon qui monte vers la lumière.'],
  ['depart','Une ligne de départ','Les couloirs numérotés d’une piste de course.'],
  ['cloture','Une clôture','Un long grillage qui traverse une forêt.'],
  ['passants','Des passants','Des silhouettes de voyageurs marchent devant de grandes fenêtres.'],
  ['soleil','Le soleil qui perce','Le soleil apparaît entre deux montagnes et se reflète dans un lac.'],
  ['trouee','Une trouée de lumière','Le soleil passe entre les troncs d’une forêt sombre.'],
  ['etoiles','Une nuit étoilée','Un ciel de nuit rempli d’étoiles, avec la Voie lactée.'],
  ['lune','Un croissant de lune','Un fin croissant de lune dans un ciel noir.'],
  ['ampoule','Une lumière dans le noir','Une ampoule allumée dans l’obscurité.'],
  ['fenetre','Une fenêtre','Une fenêtre sans vitre dans un mur de bois, qui donne sur une prairie.'],
  ['volets','Des volets fermés','De vieux volets en bois fermés sur une façade claire.'],
  ['porte','Une porte','Une porte rouge avec un heurtoir ancien.'],
  ['banc','Un banc','Un banc blanc vide devant une maison.'],
  ['balancoire','Une balançoire','Un pneu suspendu à une corde, dans l’herbe haute.'],
  ['doudou','Un doudou','Un ours en peluche couché sur un lit.'],
  ['plume','Une plume','Une plume posée sur le rebord d’une vieille fenêtre.'],
  ['temps','Le temps','Les aiguilles d’une montre, vues de très près.'],
  ['livre','Un livre ouvert','Un livre ouvert avec une paire de lunettes posée dessus.'],
  ['pliage','Un pliage de papier','Un petit pliage en papier posé sur le sol.'],
  ['cadeau','Un cadeau','Un paquet cadeau bleu, fermé par un ruban.'],
  ['pause','Une pause','Une tasse de café posée sur un banc en bois.'],
  ['envol','Un envol','Une mouette en plein vol au-dessus de l’eau.'],
  ['herbes','Des herbes dans le vent','Des herbes sèches penchées par le vent.'],
  ['fleur','Une fleur','Une rose jaune qui s’ouvre dans l’ombre.'],
  ['repos','Le repos','Un jeune lion blanc endormi sur un rocher.'],
  ['duo','À deux','La silhouette d’une personne et de son chien, sur des rochers au bord de l’eau.'],
  ['saut','Un saut dans le vide','Trois parachutes ouverts au-dessus des montagnes.'],
  ['filet','Un filet lancé','Un pêcheur debout sur sa barque lance son filet, au coucher du soleil.'],
  ['ensemble','Marcher ensemble','Quatre personnes vues de haut marchent sur une plage claire.'],
  ['jumelles','Des jumelles','Des jumelles d’observation tournées vers une ville.'],
  ['koala','Un koala endormi','Un koala endormi, accroché à une branche.']
];
/* Les douze pictogrammes de la première version : un choix déjà enregistré retrouve la photo la plus proche. */
const PHOTOS_AVANT=['aube','mer','crete','trouee','porte','jumelles','ciel','ampoule','amarre','fleur','col','ensemble'];
/* ---------- Formules ---------- */
const PLANS=[
  {t:'Découverte',p:'0',per:'7 jours',best:false,items:['La dose de lumière chaque jour','Les conseils et les outils','Déposer, trois fois']},
  {t:'Le parcours',p:'14',per:'par mois',best:true,items:['Tout Découverte, sans limite','Le parcours de six mois en 24 étapes','Mon évolution au départ, à mi-parcours et au bilan','Déposer autant que nécessaire, avec la phrase-miroir']},
  {t:'Avec Antonio',p:'49',per:'par mois',best:false,items:['Tout Le parcours','Un retour personnel écrit d’Antonio chaque mois, à partir de vos dépôts','Une réponse prioritaire quand une situation déborde']}
];
