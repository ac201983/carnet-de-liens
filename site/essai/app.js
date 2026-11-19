(function(){
'use strict';
const SITE=true;
const MENTIONS=true;
const KEY="pepe-essai-v1";
const KEY_SITE="pepe-v1";
const RACINE="/essai/";
const PUBLIC="https://parent-ecoute.ch/essai/";
const ESSAI=true;
const TITRE_SITE="Parent écouté, parent éclairé, un espace d’écoute pour les parents";
const SON_V="ca276355";
const CONTACT_R="hc.etuoce-tnerap@ruojnob";
const AVEC_REPONSE="";
const AVEC_VOIX=false;
const I={
  back:'<svg class="i" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
  chev:'<svg class="i" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>',
  check:'<svg class="i" viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/></svg>',
  home:'<svg class="i" viewBox="0 0 24 24"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>',
  bulb:'<svg class="i" viewBox="0 0 24 24"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 3z"/></svg>',
  tools:'<svg class="i" viewBox="0 0 24 24"><path d="M14 7l3 3-8 8H6v-3z"/><path d="M12 5l1.5-1.5a2 2 0 0 1 3 0L18 5a2 2 0 0 1 0 3L16.5 9.5"/><path d="M4 20l2-2"/></svg>',
  heart:'<svg class="i" viewBox="0 0 24 24"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></svg>',
  chat:'<svg class="i" viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/></svg>',
  dots:'<svg class="i" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/></svg>',
  alert:'<svg class="i" viewBox="0 0 24 24"><path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/></svg>',
  timer:'<svg class="i" viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/></svg>',
  arrows:'<svg class="i" viewBox="0 0 24 24"><path d="M4 12h16M14 6l6 6-6 6"/></svg>',
  listc:'<svg class="i" viewBox="0 0 24 24"><path d="M9 6h12M9 12h12M9 18h12"/><path d="M3 6l1.5 1.5L7 5M3 12l1.5 1.5L7 11M3 18l1.5 1.5L7 17"/></svg>',
  note:'<svg class="i" viewBox="0 0 24 24"><path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
  quote:'<svg class="i" viewBox="0 0 24 24"><path d="M7 7h4v6H7a3 3 0 0 1-3-3V7zM15 7h4v6h-4a3 3 0 0 1-3-3V7z"/><path d="M4 13c0 3 2 4 4 4M12 13c0 3 2 4 4 4"/></svg>',
  wind:'<svg class="i" viewBox="0 0 24 24"><path d="M3 8h11a3 3 0 1 0-3-3"/><path d="M3 12h16a3 3 0 1 1-3 3"/><path d="M3 16h8a2 2 0 1 1-2 2"/></svg>',
  phone:'<svg class="i" viewBox="0 0 24 24"><path d="M6 3h4l2 5-2.5 1.5a11 11 0 0 0 5 5L16 12l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z"/></svg>',
  info:'<svg class="i" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>',
  trash:'<svg class="i" viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
  plus:'<svg class="i" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  send:'<svg class="i" viewBox="0 0 24 24"><path d="M3 11l18-8-8 18-2-8z"/></svg>',
  stop:'<svg class="i" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
  search:'<svg class="i" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/></svg>',
  swap:'<svg class="i" viewBox="0 0 24 24"><path d="M4 7h13l-3-3"/><path d="M20 17H7l3 3"/></svg>',
  download:'<svg class="i" viewBox="0 0 24 24"><path d="M12 4v11M7 10l5 5 5-5"/><path d="M4 20h16"/></svg>',
  star:'<svg class="i" viewBox="0 0 24 24"><path d="M12 3l2.7 5.8 6.3.8-4.6 4.4 1.2 6.3L12 17.3 6.4 20.3l1.2-6.3L3 9.6l6.3-.8z"/></svg>'
};
const LOGO='<svg class="logo" viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5C24 5 15.5 15.5 15.5 21.5a8.5 8.5 0 0 0 17 0C32.5 15.5 24 5 24 5z" style="fill:var(--cream)"/><path d="M21 19.5c0-2 .9-4.3 2.2-6.2" style="fill:none;stroke:var(--surface-2);stroke-width:1.6;stroke-linecap:round"/><ellipse cx="24" cy="37" rx="7.5" ry="2.6" style="fill:none;stroke:var(--green);stroke-width:2.2"/><ellipse cx="24" cy="37.5" rx="16" ry="5.5" style="fill:none;stroke:var(--green);stroke-width:1.8;opacity:.55"/></svg>';
const LOGO_LIGHT=LOGO;

/* ---------- comforting words, one a day ---------- */
const WORDS=[
  'Si c’est dur en ce moment, cela ne veut pas dire que vous êtes un mauvais parent. Cela veut simplement dire que ce que vous vivez est difficile.',
  'Tout ce que vous faites chaque jour sans que personne le voie, c’est justement ce qui aide votre enfant à tenir debout.',
  'Une crise n’efface pas une bonne journée, et une mauvaise journée n’efface pas toutes ces années d’amour.',
  'On peut aimer quelqu’un plus que tout et ressentir quand même de la fatigue à ses côtés. Vous en avez le droit.',
  'Personne ne vous demande d’avoir toutes les réponses. Ce qui compte, c’est d’être là, et vous l’êtes.',
  'Quand vous demandez de l’aide, vous n’abandonnez pas votre enfant. Vous vous donnez les moyens de tenir plus longtemps.',
  'Votre enfant ne vous compare à personne d’autre, parce que c’est vous qu’il préfère.',
  'Pour voir les progrès de votre enfant, regardez où il en était hier plutôt que ce que font les autres enfants.',
  'Si vous avez pleuré dans la voiture aujourd’hui, sachez que des milliers de parents l’ont fait aussi. Vous êtes en bonne compagnie.',
  'Vous n’avez pas à aimer chaque journée. Vous pouvez aimer votre enfant de tout votre cœur et détester la journée que vous venez de passer.',
  'Si vous ressentez de la culpabilité, c’est d’abord parce que vous tenez à votre enfant. Cela ne veut pas dire que vous avez mal fait.',
  'Il y aura un soir où tout se sera bien passé. Gardez-le précieusement en mémoire, il vous aidera les autres soirs.',
  'Le temps que vous prenez pour vous, vous ne le volez pas à votre enfant. Vous le lui rendez ensuite, avec plus de patience et d’énergie.',
  'Personne ne connaît votre enfant aussi bien que vous. Les professionnels le savent, et les meilleurs vous le disent.'
];
const PERMISSIONS=[
  ['Vous avez le droit','de ne pas aimer certaines journées.'],
  ['Vous avez le droit','de dire « je ne sais pas » à un professionnel.'],
  ['Vous avez le droit','de demander du répit sans vous justifier.'],
  ['Vous avez le droit','d’être en colère contre la situation, sans l’être contre votre enfant.'],
  ['Vous avez le droit','de ne pas être un parent-thérapeute 24 heures sur 24.'],
  ['Vous avez le droit','d’avoir des projets qui n’ont rien à voir avec les difficultés de votre enfant.'],
  ['Vous avez le droit','de pleurer devant votre enfant. Il apprend ainsi que les émotions passent.'],
  ['Vous avez le droit','de refuser un conseil, même bien intentionné.'],
  ['Vous avez le droit','de rire beaucoup, y compris de la situation.'],
  ['Vous avez le droit','d’être fier ou fière de choses que personne d’autre ne remarque.']
];
const MOODS=[['😩','À plat'],['😔','C’est lourd'],['😐','Ça va'],['🙂','Plutôt bien'],['😊','Bien']];
const MOOD_WORDS={
  0:'Alors aujourd’hui, on vise petit. Choisissez une seule chose à faire et laissez le reste pour demain. Si vous le pouvez, envoyez aussi un message à quelqu’un pour lui dire simplement que la journée est dure.',
  1:'Les journées lourdes finissent toujours par se terminer. Choisissez un moment qui sera rien qu’à vous, même cinq minutes, et notez-le dans votre tête comme un rendez-vous.',
  2:'« Ça va », c’est déjà une très bonne réponse. Profitez-en pour faire une chose qui vous attend depuis longtemps, ou alors pour ne rien faire du tout.',
  3:'Gardez ce « plutôt bien » en mémoire et notez ce qui l’a rendu possible. Cela vous servira de repère les jours plus gris.',
  4:'C’est une bonne journée, et j’en suis content pour vous. Profitez-en pour regarder votre enfant comme si vous ne saviez rien de son dossier, simplement pour ce qu’il est.'
};

/* ---------- situations: the advice library ---------- */
/* ages: e = enfant, a = ado, g = grand (adulte). themes: comp, comm, quot, ecole, fam, moi */
const SITS=[
  {id:'crise',e:'🌪️',t:'La crise',s:'Cris, pleurs, se jette au sol, casse',ages:['e','a','g'],th:'comp',
   comp:'Quand votre enfant fait une crise, il ne fait pas un caprice et il ne s’en prend pas à vous. Son cerveau n’arrive plus à traiter tout ce qui lui arrive, que ce soit le bruit, la fatigue, la frustration, un imprévu ou une douleur, et il déborde. À ce moment-là, personne ne peut rien apprendre, ni lui ni vous. Le but est donc simplement de laisser passer la vague en sécurité, et l’éducation attendra un moment plus calme.',
   ess:['Parlez le moins possible. Répétez calmement une seule phrase courte, par exemple « Je suis là, on attend ».','Baissez la voix et mettez-vous à sa hauteur. Vous pouvez vous accroupir à distance, sans le fixer du regard.','Sécurisez l’espace plutôt que la personne. Écartez ce qui peut blesser et laissez-lui de la place.','Attendez que cela passe. Une crise monte, atteint un sommet puis redescend, et la discussion ne la raccourcit pas.','Une fois la crise passée, proposez un verre d’eau et un geste doux s’il l’accepte, sans rien ajouter. Vous pourrez en reparler plus tard, ou ne pas en reparler du tout.'],
   ev:['Raisonner, menacer ou promettre pendant la crise, parce que rien de tout cela n’arrive jusqu’à son cerveau à ce moment-là.','Punir après coup pour quelque chose qu’il n’a pas choisi.','Vous en vouloir d’avoir crié vous aussi. Cela arrive à tous les parents, et vous pouvez simplement réparer ensuite.'],
   moi:'Pendant la crise, vous débordez vous aussi. Respirez trois fois par le ventre, les pieds bien au sol. Si votre enfant est en sécurité, vous avez le droit de sortir trente secondes.',
   aide:'Si les crises deviennent quotidiennes ou plus longues, ou si quelqu’un se blesse, demandez qu’on observe la situation avec vous. Vous pouvez vous adresser au pédiatre, à l’équipe de l’institution ou à un éducateur ou une éducatrice qui vient à la maison. En attendant, notez ce qui se passe dans l’outil « Journal avant, pendant, après ». Trois semaines de notes aident bien plus qu’un long récit.'},
  {id:'automut',e:'🩹',t:'Il ou elle se fait mal',s:'Se tape, se mord, se griffe',ages:['e','a','g'],th:'comp',
   comp:'Quand un enfant se fait mal, il essaie presque toujours de dire quelque chose. Cela peut être une douleur qu’il ne sait pas exprimer, aux dents, au ventre ou aux oreilles, une tension trop forte, le besoin d’une sensation, ou encore un moyen d’obtenir quelque chose qui a marché une fois. Il ne le fait pas pour vous embêter, et vous n’y êtes pour rien.',
   ess:['Commencez par la santé et faites vérifier qu’il n’y a pas une douleur cachée. C’est la cause qu’on oublie le plus souvent.','Protégez-le sans le retenir fort, avec un coussin, une main douce qui dévie le geste ou un vêtement épais.','Proposez-lui une autre sensation au bon moment, comme presser une balle, mordre un objet prévu pour cela ou sentir une pression ferme sur les épaules si elle l’apaise.','Repérez ce qui se passe juste avant, par exemple la fatigue, le bruit, un changement d’activité ou une attente. C’est à ce moment-là que vous pouvez agir.','Les jours où la tension monte, demandez-lui moins de choses. Vous ne cédez pas en faisant cela, vous tenez compte de son état du jour.'],
   ev:['Crier ou réagir fort, parce que s’il cherche de l’attention, cela l’encourage à recommencer.','Le culpabiliser avec des phrases comme « regarde ce que tu te fais ».','Garder cela pour vous pendant des mois sans en parler à personne.'],
   moi:'Voir son enfant se faire mal est l’une des choses les plus dures qui existent. Si vous tremblez après, c’est normal. Parlez-en à quelqu’un qui peut comprendre plutôt qu’à quelqu’un qui va s’affoler.',
   aide:'Parlez-en rapidement, d’abord au pédiatre ou au médecin traitant pour écarter une douleur, puis à un ou une spécialiste du comportement. En Suisse romande, Pro Infirmis et les associations comme autisme suisse romande, insieme ou Cerebral pourront vous orienter vers les bons services.'},
  {id:'refus',e:'🙅',t:'Le refus',s:'Ne veut pas s’habiller, sortir, manger, se laver',ages:['e','a','g'],th:'quot',
   comp:'Pour une personne qui est très accompagnée, refuser est souvent le seul pouvoir qui lui reste. Le refus la protège aussi d’un inconfort que nous ne voyons pas, comme une étiquette qui gratte, une douche trop chaude ou un changement trop brusque. Derrière un « non », il y a presque toujours un « pas comme ça » ou un « pas maintenant ».',
   ess:['Proposez un choix entre deux options qui vous conviennent toutes les deux. Demandez par exemple « le pull bleu ou le rouge ? » plutôt que « tu t’habilles ? ».','Prévenez à l’avance en disant « dans cinq minutes, on va… », et aidez-vous du minuteur visuel.','Dites-lui ce qui vient en premier et ce qui vient juste après, par exemple « d’abord les dents, ensuite la tablette ». Vous pouvez aussi le lui montrer en images avec l’outil « D’abord, ensuite ».','Réduisez votre demande au plus petit pas possible, et félicitez votre enfant pour ce pas.','Laissez-lui une porte de sortie en demandant « tu veux le faire toi ou je t’aide ? ».'],
   ev:['Le bras de fer, parce que personne n’y gagne et que tout le monde en sort fatigué.','Faire plusieurs demandes en même temps.','Négocier alors que la crise a déjà commencé.'],
   moi:'Un refus le matin, quand tout le monde est pressé, met vraiment les nerfs à l’épreuve. Préparez la veille tout ce qui peut l’être, et acceptez qu’un matin sur quatre se passe moins bien.',
   aide:'Si votre enfant refuse presque tout depuis plusieurs semaines, cherchez ce qui a changé du côté de sa santé, de son sommeil, d’un événement ou d’une nouvelle personne dans sa vie. Un ou une ergothérapeute peut aussi vous aider quand les refus sont liés aux sensations, comme les vêtements, la douche ou les textures.'},
  {id:'transitions',e:'🔁',t:'Les transitions',s:'Passer d’une activité à l’autre, quitter un lieu',ages:['e','a','g'],th:'quot',
   comp:'Arrêter quelque chose d’agréable pour aller vers quelque chose d’incertain, c’est difficile pour tout le monde. Pour une personne qui a besoin de savoir ce qui l’attend, c’est comme une petite chute dans le vide. Être plus ferme n’aide pas beaucoup. Ce qui aide, c’est de lui montrer la suite avant qu’elle arrive.',
   ess:['Prévenez deux fois, en disant « encore 5 minutes » puis « encore 1 minute », avec le minuteur visuel.','Gardez toujours le même signal de fin, que ce soit une chanson, un geste ou une phrase.','Montrez la suite avec un pictogramme, une photo du lieu ou l’objet qu’on emporte.','Donnez-lui un rôle pendant le changement, comme porter le sac, éteindre la lumière ou fermer la porte.','Gardez un objet qui l’accompagne d’un moment à l’autre et qui fait le lien entre les deux.'],
   ev:['Interrompre sans prévenir, surtout un jeu ou un écran.','Changer la règle au dernier moment parce qu’on est pressé.'],
   moi:'Quand une transition se passe mal, c’est souvent parce que vous étiez en train de courir. Et si l’une d’elles est difficile à chaque fois, c’est elle qu’il faut changer. Votre patience n’est pas en cause.',
   aide:'Un éducateur ou une logopédiste qui connaît la communication alternative, avec des pictogrammes ou du soutien gestuel, peut construire avec vous un emploi du temps en images. Si votre enfant est en institution, demandez à l’équipe comment elle s’y prend et reprenez à la maison ce qui marche là-bas.'},
  {id:'sommeil',e:'🌙',t:'Le coucher et la nuit',s:'Endormissement long, réveils, se lève',ages:['e','a'],th:'quot',
   comp:'Chez beaucoup d’enfants en situation de handicap, ou qui traversent une période difficile, le sommeil est fragile. Leur corps ne donne pas toujours les signaux au bon moment, l’angoisse de la séparation est plus forte et la journée laisse beaucoup de tension. Un coucher qui se passe mal ne veut donc pas dire que vous manquez d’autorité.',
   ess:['Gardez le même déroulé chaque soir, dans le même ordre et en images, avec le bain, le pyjama, les dents, l’histoire et le dodo. L’outil « Routine » est fait pour cela.','Baissez la lumière et le bruit une heure avant le coucher, et arrêtez les écrans encore plus tôt.','Donnez-lui un objet pour la nuit qui ne change jamais, et une veilleuse s’il en a besoin.','S’il se relève, raccompagnez-le sans discuter, autant de fois qu’il le faut, en répétant la même phrase douce.','Le matin, ouvrez les volets et accueillez-le avec des mots chaleureux, quelle qu’ait été la nuit.'],
   ev:['Changer de méthode tous les trois jours.','Faire du coucher une négociation.','Vous en vouloir de dormir avec votre enfant certains soirs, parce que c’est parfois la bonne décision pour que tout le monde dorme.'],
   moi:'Le manque de sommeil rend tout plus dur, et c’est vous qui le portez. Si vous êtes deux, alternez les nuits. Si vous élevez votre enfant sans l’autre parent, faites la sieste dès que vous le pouvez, parce que votre corps en a vraiment besoin.',
   aide:'Si votre enfant dort moins de huit heures la plupart des nuits, ou si l’épuisement dure depuis des semaines chez vous, parlez-en au pédiatre. Il existe des solutions, y compris médicales, et y recourir n’a rien d’un échec.'},
  {id:'repas',e:'🍽️',t:'Les repas',s:'Ne mange que trois choses, refuse les textures',ages:['e','a','g'],th:'quot',
   comp:'Quand un enfant ne mange que quelques aliments, cela vient souvent des sensations, comme les textures, les odeurs ou les couleurs, bien plus que de son caractère. Pour certaines personnes, un aliment nouveau dans l’assiette est aussi inquiétant qu’un insecte. L’important, c’est que le repas reste un moment où l’on est bien ensemble.',
   ess:['Mettez toujours dans l’assiette un aliment qu’il connaît, pour qu’il se sente en sécurité.','Posez le nouvel aliment à côté, en toute petite quantité, sans l’obliger à goûter. Le voir vingt fois dans son assiette, c’est déjà un progrès.','Gardez les mêmes couverts, la même place et la même heure.','Laissez-le toucher, sentir et même jouer avec la nourriture, parce que c’est une étape normale pour apprivoiser un aliment.','Félicitez-le pour ses efforts plutôt que pour la quantité mangée.'],
   ev:['Le forcer, faire du chantage au dessert ou dire « tu restes à table jusqu’à ce que… ».','Cacher un aliment dans un autre, parce que sa confiance est plus précieuse qu’une carotte avalée.'],
   moi:'Si vous cuisinez trois repas différents chaque soir, vous avez le droit d’arrêter. Un plat pour tout le monde et un aliment qu’il aime à côté, cela suffit.',
   aide:'Un suivi en ergothérapie ou en logopédie, avec une personne spécialisée dans l’alimentation, change souvent beaucoup de choses. Pensez aussi à faire vérifier son poids et son taux de fer une fois par an chez le médecin.'},
  {id:'parole',e:'💬',t:'Communiquer sans les mots',s:'Ne parle pas, peu, ou autrement',ages:['e','a','g'],th:'comm',
   comp:'Un enfant qui ne parle pas a quand même beaucoup de choses à dire. Votre enfant communique déjà avec son regard, son corps, ses gestes, ses cris et les objets qu’il vous apporte. La communication alternative, avec des pictogrammes, du soutien gestuel ou une tablette, ne prend pas la place de la parole. Elle l’aide à venir, et quand la parole ne vient pas, elle lui donne une voix. Les études le montrent, et l’utiliser ne veut pas dire que vous renoncez à ce qu’il parle.',
   ess:['Mettez des mots sur ce qu’il fait, ce qu’il veut ou ce qu’il regarde, par exemple « tu veux l’eau » en lui montrant l’eau. Faites-le souvent, sans attendre de réponse.','Laissez-lui du temps, en comptant jusqu’à dix dans votre tête après chaque question.','Proposez-lui des choix qu’il peut voir, avec deux objets ou deux images. Quand il choisit, il vous dit déjà quelque chose.','Apprenez trois gestes ou pictogrammes utiles, comme « encore », « fini » et « aide », et utilisez-les vous aussi.','Réjouissez-vous de chaque essai, même quand il est maladroit.'],
   ev:['Faire à sa place avant qu’il ait eu le temps d’essayer.','Attendre qu’il parle pour commencer à communiquer avec lui.','Poser des questions auxquelles il ne peut pas répondre.'],
   moi:'Ne pas entendre « maman » ou « papa », cela fait mal. Apprenez à lire ce qu’il vous donne à la place. C’est une langue rien qu’à vous deux, et elle est bien réelle.',
   aide:'Demandez un bilan en logopédie orienté vers la communication alternative et améliorée, qu’on appelle aussi la CAA. Les associations comme autisme suisse romande, insieme ou Cerebral connaissent les personnes formées près de chez vous. Si votre enfant est en institution, demandez quels moyens l’équipe utilise et servez-vous des mêmes à la maison.'},
  {id:'dehors',e:'🛒',t:'Les sorties',s:'Magasin, bus, fête de famille, restaurant',ages:['e','a'],th:'quot',
   comp:'Dehors, tout est plus fort, que ce soit la lumière, le bruit, les odeurs, l’attente ou les regards. Ce qui se passe bien à la maison ne tient pas toujours au supermarché, et cela ne veut pas dire que votre enfant régresse. Une sortie réussie se prépare un peu comme une expédition, et elle se termine avant que votre enfant n’arrive à sa limite.',
   ess:['Préparez la sortie en images, en montrant où on va, ce qu’on y fait, combien de temps cela dure et ce qu’on rapporte.','Donnez-lui un rôle, comme tenir la liste ou mettre les articles dans le chariot.','Emportez un casque ou des bouchons d’oreilles, un objet qui le rassure et une collation.','Visez une sortie courte et réussie. Dix minutes qui se passent bien valent mieux que quarante qui finissent en crise.','Prévoyez un endroit où aller si la tension monte, et partez sans discuter le moment venu.'],
   ev:['Commencer par une grande surface à l’heure de pointe.','Vouloir faire « encore un rayon » alors que les signes de fatigue sont là.'],
   moi:'Le regard des gens au magasin, nous l’avons tous senti. Cela aide d’avoir une phrase toute prête, par exemple « Il a besoin d’une minute, merci ». Vous n’avez rien d’autre à expliquer.',
   aide:'Beaucoup de magasins et de piscines proposent des heures calmes, n’hésitez pas à demander. Une carte de priorité ou un justificatif peut aussi vous éviter les files d’attente. Pro Infirmis ou l’association de votre région pourront vous renseigner.'},
  {id:'regard',e:'👀',t:'Le regard des autres',s:'Remarques, pitié, conseils non demandés',ages:['e','a','g'],th:'fam',
   comp:'Le regard des autres blesse parce qu’il touche ce qui est déjà sensible chez nous. La plupart des gens ne savent tout simplement pas. Certains sont maladroits et quelques-uns sont méchants. Vous ne leur devez aucune explication, et vous pouvez choisir à chaque fois de garder votre énergie pour vous.',
   ess:['Préparez deux phrases courtes. La première met fin à la discussion, comme « Merci, nous gérons ». La seconde ouvre la porte si vous en avez envie, comme « Il entend tout, vous pouvez lui dire bonjour ».','Décidez à l’avance à qui vous avez envie d’expliquer, et à qui vous n’expliquerez rien.','Dans votre famille, dites clairement ce dont vous avez besoin, par exemple « J’ai besoin de présence, pas de conseils ».','Rapprochez-vous de parents qui vivent la même chose. Un groupe de parents vous fera plus de bien que cent inconnus.'],
   ev:['Vous justifier auprès d’inconnus.','Couper tout lien avec les proches qui ne comprennent pas, parce que certains ont simplement besoin de temps pour apprendre.'],
   moi:'Rien ne vous oblige à expliquer votre enfant à tout le monde, tous les jours. Certains jours, vous avez le droit de fermer les yeux et de passer votre chemin.',
   aide:'Les groupes de parents existent justement pour pouvoir parler sans devoir tout expliquer. Vous en trouverez chez insieme, autisme suisse romande ou Cerebral, et il existe aussi beaucoup de groupes locaux.'},
  {id:'ecole',e:'🏫',t:'L’école',s:'Intégration, devoirs, réunions, enseignants',ages:['e','a'],th:'ecole',
   comp:'L’école est souvent le premier endroit où la différence se voit. Les enseignants sont en général de bonne volonté, mais ils sont peu formés. Les réunions sont nombreuses et vous vous y retrouvez parfois sans personne à vos côtés, face à plusieurs professionnels. Pourtant, c’est vous qui connaissez le mieux votre enfant, et cette connaissance a autant de valeur que la leur.',
   ess:['Demandez à avoir une seule personne de contact et un moyen simple de communiquer, comme un cahier ou un e-mail chaque semaine.','Avant chaque réunion, écrivez trois forces de votre enfant, deux difficultés et une demande.','Partagez ce qui marche à la maison, comme les gestes, les pictogrammes ou les routines, et reprenez chez vous ce qui marche à l’école.','Pour les devoirs, gardez des séances courtes, à la même heure et à la même place, avec le droit de s’arrêter après quinze minutes.','Demandez que les décisions soient mises par écrit, avec ce que chacun doit faire.'],
   ev:['Arriver en réunion sans avoir écrit vos points, parce qu’on en ressort souvent avec de la frustration.','Faire des devoirs un combat de tous les jours, parce que votre enfant a besoin d’une famille à la maison et non d’une deuxième école.'],
   moi:'Les réunions à l’école sont épuisantes. Préparez-les, venez à deux si c’est possible et offrez-vous ensuite un café tranquille, rien que pour vous.',
   aide:'Chaque canton a un service de pédagogie spécialisée. Demandez à l’école quel appui est possible, par exemple du soutien, de l’ergothérapie, de la logopédie ou une aide à l’intégration. Pro Infirmis et les associations de parents peuvent aussi vous aider à comprendre vos droits.'},
  {id:'fratrie',e:'👧👦',t:'Les frères et sœurs',s:'Jalousie, colère, trop sages, trop grands',ages:['e','a','g'],th:'fam',
   comp:'Les frères et sœurs vivent la situation de l’intérieur, sans l’avoir choisie. Certains deviennent très sages pour ne pas ajouter de poids, et d’autres explosent. Tous ont besoin qu’on les regarde pour eux-mêmes, et pas seulement comme l’enfant qui va bien.',
   ess:['Réservez-leur un moment rien qu’à eux, régulier même s’il est court, par exemple le mercredi à midi ou le samedi matin, et ne le sacrifiez pas.','Expliquez-leur les choses avec des mots vrais et adaptés à leur âge. Dites-leur ce qu’a leur frère ou leur sœur, pourquoi cela prend de la place, et que ce n’est la faute de personne.','Dites-leur à voix haute qu’ils ont le droit d’être en colère ou jaloux, sans leur faire la morale.','Ne leur confiez pas un rôle d’adulte. Ils peuvent aider, mais ils ne doivent pas se sentir responsables.','Demandez-leur ce qu’ils veulent que les autres sachent.'],
   ev:['Leur dire « tu as de la chance, toi ».','Décider qu’ils s’occuperont plus tard de leur frère ou de leur sœur sans jamais leur demander leur avis.'],
   moi:'La culpabilité envers vos autres enfants est l’une des plus lourdes à porter. Dites-leur simplement ce que vous ressentez, par exemple « j’aimerais avoir plus de temps pour toi, et je t’aime tout autant ». Ils l’entendent très bien.',
   aide:'Il existe en Suisse romande des groupes pour les frères et sœurs, chez insieme, chez Cerebral et dans certaines fondations. Ils y trouvent un espace où ils ne sont plus seulement « le frère de » ou « la sœur de ».'},
  {id:'ecrans',e:'📱',t:'Les écrans',s:'Tablette, jeux, vidéos en boucle',ages:['e','a'],th:'quot',
   comp:'L’écran apaise et occupe, et pour certains enfants c’est le seul endroit où tout est prévisible. C’est un outil puissant, qui peut rendre de vrais services à condition d’avoir un cadre clair que votre enfant peut voir et qui ne se négocie pas.',
   ess:['Prévoyez des moments fixes, affichés sur un planning en images, plutôt qu’une durée à négocier chaque jour.','Utilisez le minuteur visuel pour la fin et prévenez deux fois avant.','Prévoyez quelque chose d’agréable juste après. L’arrêt de l’écran passe mieux quand une autre activité commence tout de suite.','Servez-vous aussi de l’écran comme d’un outil, pour les pictogrammes, pour communiquer ou pour écouter une musique qui calme.','Évitez les écrans pendant la dernière heure avant le coucher.'],
   ev:['Retirer l’écran brusquement, parce que cela finit presque toujours en crise.','Vous en vouloir d’y avoir eu recours un jour difficile.'],
   moi:'Quand l’écran vous donne vingt minutes pour souffler, vous ne commettez aucune faute. Vous prenez une pause, alors profitez-en vraiment.',
   aide:'Si l’écran devient son seul intérêt et que tout le reste disparaît, parlez-en à l’équipe ou au pédiatre. Vous pourrez chercher ensemble ce que l’écran est venu remplacer.'},
  {id:'ado',e:'🌱',t:'L’adolescence et le corps',s:'Puberté, intimité, humeur, pudeur',ages:['a','g'],th:'comm',
   comp:'À l’adolescence, le corps change et les hormones aussi, mais la compréhension ne suit pas toujours. L’intimité, la pudeur et la sexualité concernent toutes les personnes, avec ou sans handicap. Des mots simples que l’on répète protègent mieux votre enfant que le silence.',
   ess:['Nommez les parties du corps avec les vrais mots et expliquez les règles de l’intimité, c’est-à-dire ce qu’on fait seul, dans sa chambre, la porte fermée.','Préparez l’arrivée des premières règles à l’avance, avec des images.','Apprenez-lui à dire « non » et « stop », et aussi à les entendre, pour qu’il sache se protéger.','Respectez sa nouvelle pudeur en frappant avant d’entrer et en demandant avant de l’aider.','Parlez-en avec l’équipe ou avec l’école, pour que tout le monde utilise les mêmes mots.'],
   ev:['Interdire ou punir les gestes intimes, au lieu de lui montrer le lieu où ils sont permis.','Penser que tout cela ne le concerne pas.'],
   moi:'Voir son enfant devenir un adulte différent de celui qu’on avait imaginé, cela mêle de la tristesse et de la fierté. Vous avez le droit de ressentir les deux en même temps.',
   aide:'Certaines associations proposent de l’éducation sexuelle adaptée, comme SEHP en Suisse romande. Le médecin et l’équipe sont aussi là pour vous aider, alors demandez-leur un moment pour en parler.'},
  {id:'annonce',e:'🌫️',t:'On vient d’apprendre',s:'Diagnostic, premiers mois, sidération',ages:['e'],th:'moi',
   comp:'Pendant les premiers mois après un diagnostic, on encaisse plus qu’on ne vit. On peut ressentir le choc, le déni, la colère, la tristesse, la culpabilité et parfois le soulagement d’avoir enfin un nom. Tout cela est normal, dans n’importe quel ordre, et cela peut revenir plusieurs fois. Pendant ce temps, votre enfant est exactement le même qu’hier. Le diagnostic a changé ce que vous savez de lui, mais lui n’a pas changé.',
   ess:['Ne prenez aucune grande décision le premier mois.','Limitez-vous à une seule source d’information fiable à la fois, et évitez les forums la nuit.','Notez vos questions pour le prochain rendez-vous, parce qu’elles viennent plus souvent à trois heures du matin que pendant la consultation.','Parlez-en d’abord à deux ou trois personnes que vous choisissez, plutôt qu’à tout le monde.','Prenez le temps de regarder longuement votre enfant jouer. Rien ne fait autant de bien quand le dossier prend toute la place.'],
   ev:['Chercher une cause ou un coupable, parce qu’il n’y en a pas.','Vous comparer aux parents qui ont l’air de bien s’en sortir, parce qu’eux aussi sont passés par ces premiers mois.'],
   moi:'Vous avez le droit de pleurer l’enfant que vous aviez imaginé. Vous ne trahissez pas celui qui est là en le faisant. Vous faites de la place pour l’aimer tel qu’il est.',
   aide:'Pro Infirmis vous reçoit gratuitement dès le diagnostic. Les associations spécialisées comme autisme suisse romande, insieme, Cerebral ou Procap ont des permanences pour les parents. Et si vous sentez le sol se dérober sous vos pieds, vous pouvez appeler La Main Tendue au 143, de jour comme de nuit.'},
  {id:'culpa',e:'🪞',t:'La culpabilité',s:'Pas assez, trop, mal, pas comme il faut',ages:['e','a','g'],th:'moi',
   comp:'Presque tous les parents d’un enfant différent ressentent de la culpabilité, et elle est presque toujours injuste. Elle vous répète « si j’avais su », en oubliant que vous avez décidé avec ce que vous saviez à ce moment-là, et pas avec ce que vous savez aujourd’hui. Au fond, elle montre surtout à quel point vous aimez votre enfant.',
   ess:['Quand elle arrive, nommez-la en vous disant « c’est ma culpabilité qui parle ». Cela suffit souvent à la faire reculer d’un pas.','Demandez-vous ce que vous diriez à un ami proche dans la même situation, puis dites-vous la même chose.','Écrivez sur une feuille la liste de tout ce que vous faites pour votre enfant. Vous verrez qu’elle est longue.','Acceptez qu’une bonne décision puisse quand même donner de mauvaises journées.','Réparez quand il le faut, en disant par exemple « j’ai crié, pardon », puis passez à autre chose.'],
   ev:['Croire que vous devez tout compenser, parce que cela mène à l’épuisement.','Vous comparer aux autres familles.'],
   moi:'Vous n’êtes pas en retard et vous n’avez rien raté. Vous êtes là, en train de chercher comment faire mieux, et c’est exactement ce que fait un bon parent.',
   aide:'Si la culpabilité vous empêche de dormir ou de vous réjouir depuis des semaines, un ou une psychologue qui connaît les familles dans votre situation peut vous aider. Pro Infirmis et les associations sauront vous orienter. Consulter n’a rien d’une faiblesse, c’est une façon de prendre soin de vous.'},
  {id:'epuise',e:'🔋',t:'Je n’en peux plus',s:'Épuisement, isolement, à bout',ages:['e','a','g'],th:'moi',
   comp:'L’épuisement des proches aidants n’a rien à voir avec de la faiblesse. Il arrive après des mois ou des années de vigilance sans pause, de nuits coupées, de rendez-vous et de démarches administratives. Votre corps finit par dire ce que vous n’osez pas dire vous-même. En l’écoutant, vous n’abandonnez pas votre enfant, vous faites ce qu’il faut pour rester debout pour lui.',
   ess:['Aujourd’hui, ne faites qu’une seule chose et laissez le reste attendre.','Dites-le à une personne en une seule phrase, par exemple « je suis à bout ». Vous n’avez pas besoin de donner de détails.','Demandez du répit, que ce soit un week-end, un après-midi ou une nuit. Vous en avez besoin pour votre santé.','Réservez une heure par semaine rien que pour vous et notez-la dans votre agenda comme un rendez-vous médical.','Dormez dès que vous le pouvez, même si c’est peu et même si vous dormez mal.'],
   ev:['Attendre d’aller vraiment mal pour demander de l’aide.','Refuser l’aide qu’on vous propose en pensant que personne ne fera aussi bien que vous. Les autres feront autrement, et c’est très bien ainsi.'],
   moi:'Si vous lisez ces lignes à deux heures du matin, posez votre téléphone juste après. Vous avez tenu toute la journée, et c’est assez pour aujourd’hui.',
   aide:'Des solutions existent et beaucoup sont financées. Vous pouvez vous adresser à Pro Infirmis pour un service de relève, à la Croix-Rouge pour une garde à domicile, à Cerebral pour du répit ou à votre commune pour l’aide aux proches aidants. Et si vous avez des idées noires, appelez La Main Tendue au 143 dès maintenant.'},
  {id:'couple',e:'💑',t:'Le couple',s:'Plus de temps à deux, désaccords, solitude',ages:['e','a','g'],th:'fam',
   comp:'Un enfant en situation de handicap, ou qui traverse une période difficile, met le couple à l’épreuve. Il y a la fatigue, les désaccords sur l’éducation, l’un des deux qui porte plus que l’autre, le désir qui s’éteint et les mots qui manquent. Cela ne veut pas dire que l’amour a disparu, mais que toute votre énergie part ailleurs. Votre couple a donc besoin que vous preniez soin de lui volontairement, parce que cela ne se fait plus tout seul.',
   ess:['Prévoyez un rendez-vous à deux, régulier même s’il est court, même à la maison après le coucher, et ne parlez pas des soucis de votre enfant pendant ce moment.','Dites à voix haute qui s’occupe de quoi, et refaites le point de temps en temps.','Parlez de ce que vous ressentez en commençant par « je ». Dire « j’ai besoin de toi en ce moment » passe mieux que « tu ne fais rien ».','Acceptez que l’autre ne vive pas la même chose au même moment.','Demandez de l’aide ensemble, plutôt que chacun de votre côté contre l’autre.'],
   ev:['Compter les points.','Attendre que tout aille mieux pour vous occuper de votre couple.'],
   moi:'Si vous élevez votre enfant sans l’autre parent, ces rendez-vous comptent tout autant. Prenez-les avec vous-même.',
   aide:'Il existe des consultations de couple dans chaque canton, dans les centres de consultation conjugale, souvent à un tarif adapté à vos moyens. En parler à deux devant une troisième personne permet parfois de commencer une tout autre conversation.'},
  {id:'aide',e:'🤝',t:'Demander de l’aide',s:'Répit, relève, droits, financement',ages:['e','a','g'],th:'moi',
   comp:'Demander de l’aide est à la fois ce qu’il y a de plus difficile et de plus efficace. C’est difficile parce qu’on a l’impression d’avouer qu’on n’y arrive pas, et c’est efficace parce que personne n’est fait pour porter tout cela sans soutien. Il existe des aides financées, et peu de familles les connaissent toutes.',
   ess:['Commencez par prendre rendez-vous chez Pro Infirmis. C’est gratuit, il y a un bureau dans votre canton et ils feront avec vous le tour de ce à quoi vous avez droit.','Si votre situation le permet, demandez l’allocation pour impotent, qu’on appelle aussi l’API, et le supplément pour soins intenses. Beaucoup de familles y ont droit et ne les demandent pas.','Pour le répit, il existe de la relève à domicile, des week-ends et des camps adaptés. L’association de votre région peut vous donner les listes.','Dites oui à l’aide de vos proches, que ce soit un repas, une heure de garde ou un trajet.','Faites la liste de ce que quelqu’un pourrait faire pour vous. Vous saurez quoi répondre le jour où on vous demandera « je peux faire quoi ? ».'],
   ev:['Attendre d’être à bout.','Penser que vous prenez la place de quelqu’un qui en aurait plus besoin.'],
   moi:'Vous n’êtes pas un dossier de plus. Vous êtes une famille qui a besoin d’un coup de main, comme toutes les familles, avec simplement des besoins plus grands.',
   aide:'Vous pouvez vous adresser à Pro Infirmis, insieme, Cerebral, Procap ou autisme suisse romande. La Croix-Rouge propose la garde d’enfants malades et de la relève, et votre commune a souvent un service pour les proches aidants. Vous pouvez aussi appeler les conseils aux parents de Pro Juventute au 058 261 61 61. C’est gratuit, de jour comme de nuit.'},
  {id:'grandir',e:'🎓',t:'Le passage à l’âge adulte',s:'Majorité, curatelle, AI, institution, avenir',ages:['a','g'],th:'ecole',
   comp:'Vers 18 ans, beaucoup de choses changent en même temps. L’assurance-invalidité passe au régime adulte, une mesure de protection comme la curatelle peut être examinée, l’école s’arrête et la question de la suite devient très concrète. Cela fait beaucoup à la fois. La bonne nouvelle, c’est que tout cela se prépare par petites décisions, et qu’il y a des personnes dont c’est le métier de vous guider.',
   ess:['Prenez rendez-vous chez Pro Infirmis un an avant ses 18 ans. Ils vous aideront à y voir clair dans toutes les démarches.','Déposez la demande de rente AI adulte dès que possible.','Réfléchissez à la mesure de protection la plus légère qui le protège suffisamment. Il en existe plusieurs.','Parlez-en avec votre enfant, avec ses mots à lui. Demandez-lui ce qu’il veut décider lui-même et ce pour quoi il aimerait de l’aide.','Visitez des ateliers, des foyers ou des centres de jour sans pression, simplement pour vous faire une idée.'],
   ev:['Tout décider sans votre enfant.','Croire que la curatelle vous enlève votre place, alors qu’elle la reconnaît officiellement.'],
   moi:'Ce passage réveille la question de ce qui se passera quand vous ne serez plus là. C’est normal qu’elle fasse peur. Elle fait moins peur quand il y a des noms, des papiers et des personnes autour de votre enfant.',
   aide:'Vous pouvez vous adresser à Pro Infirmis, à l’Office AI et à l’autorité de protection de l’adulte de votre canton, qui est souvent la Justice de paix. Insieme publie aussi des brochures sur la protection de l’adulte, dont certaines en langage simplifié.'},
  {id:'loin',e:'🏡',t:'Quand il ou elle vit ailleurs',s:'Institution, foyer, séjours en famille',ages:['g'],th:'fam',
   comp:'Confier son enfant adulte à une institution, c’est construire un projet de vie avec lui et pas l’abandonner. Pourtant, la culpabilité est souvent là. Pendant les premières semaines, l’équipe apprend à le connaître et vous apprenez de votre côté à partager. La relation avec l’équipe se construit comme toutes les relations, petit à petit et avec le temps.',
   ess:['Écrivez pour l’équipe qui il est, avec ses goûts, ce qui l’apaise et sa façon de communiquer. C’est ce qui manque le plus pendant les premiers jours.','Demandez qui est la personne de référence et comment vous allez communiquer au quotidien.','Préparez chaque rencontre de réseau ou de projet en notant ce qui va bien, ce qui vous inquiète et ce que vous demandez.','Gardez des rituels, comme l’appel du mercredi ou le gâteau du dimanche.','Dites à l’équipe ce qui marche à la maison, et reprenez chez vous ce qui marche chez eux.'],
   ev:['Vérifier et corriger l’équipe sur tout, parce que la confiance a besoin de temps pour se construire.','Vous excuser d’avoir une vie à vous.'],
   moi:'La maison vide le dimanche soir est l’un des moments les plus durs. Préparez-le à l’avance en prévoyant une sortie, un appel ou un film, pour ne pas rester dans le silence.',
   aide:'Les associations de parents, et surtout insieme, réunissent beaucoup de familles dont l’enfant vit en institution. Elles savent exactement ce que vous vivez.'},
  {id:'pros',e:'🗂️',t:'Parler aux professionnels',s:'Rendez-vous, réunions, se faire entendre',ages:['e','a','g'],th:'ecole',
   comp:'Face à plusieurs professionnels, un parent se sent souvent tout petit, avec l’impression de ne pas avoir les bons mots. Pourtant, vous apportez la seule chose qu’ils n’ont pas, parce que vous vivez avec votre enfant vingt-quatre heures sur vingt-quatre. Un bon professionnel vous écoute, et un très bon professionnel vous demande votre avis.',
   ess:['Avant chaque rendez-vous, écrivez trois points, à savoir ce qui va bien, ce qui vous inquiète et ce que vous demandez.','Quand vous n’avez pas compris, demandez qu’on vous l’explique autrement, par exemple avec « concrètement, ça veut dire quoi pour lui ? ».','Demandez qu’on vous écrive les décisions et qui fait quoi.','Venez à deux si vous le pouvez, pour que l’un parle pendant que l’autre note.','Quand vous n’êtes pas d’accord, dites-le calmement, par exemple avec « je ne le vois pas comme ça à la maison, voilà ce que je vois ».'],
   ev:['Sortir d’un rendez-vous sans avoir posé votre question.','Laisser passer des mots compliqués que vous ne comprenez pas.'],
   moi:'Vous n’avez pas besoin d’avoir le bon vocabulaire pour être dans le vrai. Ce que vous observez chez votre enfant suffit, et cela vaut de l’or.',
   aide:'Servez-vous du « Journal avant, pendant, après » de l’application. Quand vous apportez trois semaines d’observations à un rendez-vous, la discussion n’est plus la même.'},
  {id:'deuil',e:'🕊️',t:'L’enfant qu’on avait imaginé',s:'Accepter, sans renoncer',ages:['e','a','g'],th:'moi',
   comp:'Avant la naissance, on imagine toute une vie pour son enfant. Le handicap efface cette image, et on a besoin de la pleurer pour pouvoir regarder l’enfant qui est là. Ce chagrin revient par vagues à chaque étape, quand les autres enfants font leur rentrée, passent leur permis ou se marient. Il ne veut pas dire que vous n’aimez pas votre enfant. Il fait simplement partie de ce que vivent beaucoup de parents.',
   ess:['Laissez venir la vague sans vous juger, parce qu’elle finit toujours par passer.','Mettez des mots précis sur ce que vous perdez. Ce qu’on arrive à nommer pèse un peu moins lourd.','Cherchez ce que vous n’auriez jamais connu sans votre enfant, comme une autre idée du temps, de la réussite ou de la joie.','Entourez-vous de parents qui connaissent ce chagrin. Eux ne vous répondront pas « mais il est tellement mignon ».'],
   ev:['Vous interdire d’être triste sous prétexte qu’il y a pire ailleurs.','Vous forcer à sourire les jours où vous avez besoin de pleurer.'],
   moi:'Vous pouvez pleurer ce qui ne sera pas et aimer de tout votre cœur l’enfant qui est là. Les deux sont vrais en même temps, et vous n’avez pas à choisir.',
   aide:'Si la tristesse s’installe pendant des semaines sans vous laisser de répit, parlez-en à un ou une psychologue qui connaît le handicap, ou rejoignez un groupe de parents. Et pour les nuits trop longues, vous pouvez appeler La Main Tendue au 143.'},
  {id:'relais',e:'🤝',t:'Confier son enfant à un proche',s:'Un week-end, une soirée, une première nuit ailleurs',ages:['e','a','g'],th:'fam',
   comp:'Laisser votre enfant à quelqu’un d’autre, même pour une nuit, demande beaucoup. Vous savez mille choses que personne n’a jamais écrites, et vous craignez que l’autre ne les devine pas. Cette inquiétude est normale, elle dit que vous connaissez votre enfant. Un relais se passe mieux quand la personne qui le prend sait peu de choses, mais les bonnes. Et vous avez le droit de souffler pendant ce temps.',
   ess:['Choisissez 3 repères, pas davantage. Ce sont ceux que la personne doit connaître même si elle ne lit rien d’autre.','Écrivez-les sur une page, avec des mots simples, et relisez-la avec elle avant de partir.','Commencez court. Une après-midi, puis une soirée, puis une nuit, pour que chacun prenne confiance.','Demandez à votre enfant, quel que soit son âge, ce qu’il souhaite que cette personne sache. Notez-le avec ses mots ou ses gestes.','Au retour, posez-vous une seule question. Qu’est-ce qui a bien marché, et que garderez-vous la prochaine fois ?'],
   ev:['Tout expliquer en 20 minutes sur le pas de la porte. Presque rien n’est retenu.','Appeler toutes les heures. Convenez plutôt d’un message à un moment précis.','Attendre que tout se passe comme avec vous. Autrement ne veut pas dire moins bien.'],
   moi:'Confier votre enfant ne fait pas de vous un parent qui abandonne. Vous lui montrez que d’autres adultes peuvent prendre soin de lui, et vous vous donnez les moyens de durer.',
   aide:'Si vous n’avez personne à qui passer le relais, parlez-en à votre assistante sociale, à Pro Infirmis ou à une association de parents de votre canton. Il existe des services de relève à domicile et des accueils de courte durée. Demandez aussi ce qui peut être pris en charge.'}
];
const THEMES={all:'Tout',comp:'Comportement',comm:'Communication',quot:'Quotidien',ecole:'École, pros, avenir',fam:'Famille',moi:'Pour moi'};
const AGES={all:'Tous âges',e:'Enfant',a:'Ado',g:'Adulte'};

/* ---------- self-care exercises ---------- */
const EXOS=[
  {id:'breath',ico:'wind',t:'Respirer 4-6',s:'Deux minutes qui calment le corps',how:'Inspirez par le nez en comptant jusqu’à 4, puis expirez par la bouche en comptant jusqu’à 6. Suivez le cercle. Quand il grandit, vous inspirez, et quand il rétrécit, vous expirez. Faites-le dix fois.'},
  {id:'trois',ico:'star',t:'Trois choses',s:'Qui ont été bien aujourd’hui, même minuscules',how:'Écrivez trois choses qui ont été bien aujourd’hui. Un café chaud, un sourire ou le simple fait d’être encore debout, tout cela compte.'},
  {id:'deposer',ico:'wind',t:'Déposer',s:'Écrire ce qui pèse, puis l’effacer',how:'Écrivez tout ce qui tourne dans votre tête, sans vous relire. Rien n’est gardé. Une fois que c’est écrit, c’est déposé quelque part en dehors de vous.'},
  {id:'droit',ico:'heart',t:'Vous avez le droit',s:'Dix permissions à relire',how:''},
  {id:'minute',ico:'timer',t:'Une minute pour moi',s:'Soixante secondes, les yeux fermés',how:'Lancez la minute, fermez les yeux et écoutez les sons autour de vous. Quand vous rouvrez les yeux, regardez le cercle. S’il est vide, la minute est passée.'},
  {id:'appeler',ico:'phone',t:'Parler à quelqu’un',s:'Maintenant plutôt que plus tard',how:''}
];
const HELPLINES=[
  ['La Main Tendue','143','Jour et nuit, pour parler, quand ça ne va pas.'],
  ['Pro Juventute, conseils aux parents','058 261 61 61','Gratuit, 24h/24, pour toutes les questions de parents.'],
  ['Urgences','144','Danger immédiat pour la vie.'],
  ['Pro Infirmis','site proinfirmis.ch','Conseil social et juridique gratuit, dans votre canton.']
];
/* Les images de « D'abord, ensuite » et de la routine : des Mulberry Symbols de Steve Lee (licence CC BY-SA 4.0), rangées dans img/pictos/<identifiant>.svg.
   Chaque image : son identifiant, le mot écrit dessous, et ce qu'on dit après « D'abord » ou « ensuite ». La liste est tenue dans build/pictos/jeu.py. */
const PICTOS=[['reveil','Se réveiller','se réveiller'],['habiller','S’habiller','s’habiller'],['chaussettes','Chaussettes','les chaussettes'],['chaussures','Chaussures','les chaussures'],['manteau','Manteau','le manteau'],['bonnet','Bonnet','le bonnet'],['coiffer','Se coiffer','se coiffer'],['lunettes','Lunettes','les lunettes'],['petitdej','Petit-déjeuner','le petit-déjeuner'],['sac','Sac d’école','le sac d’école'],['manger','Manger','manger'],['boire','Boire','boire'],['repas','Repas','le repas'],['legumes','Légumes','les légumes'],['fruit','Fruit','le fruit'],['dessert','Dessert','le dessert'],['gouter','Goûter','le goûter'],['eau','Verre d’eau','le verre d’eau'],['table','Mettre la table','mettre la table'],['cuisiner','Cuisiner','cuisiner'],['dents','Dents','les dents'],['mains','Mains','se laver les mains'],['visage','Visage','se laver le visage'],['douche','Douche','la douche'],['bain','Bain','le bain'],['shampoing','Shampoing','le shampoing'],['secher','Sécher les cheveux','sécher les cheveux'],['toilettes','Toilettes','les toilettes'],['couche','Couche','changer la couche'],['ongles','Ongles','couper les ongles'],['moucher','Se moucher','se moucher'],['medicament','Médicament','le médicament'],['creme','Crème','la crème'],['ecole','École','l’école'],['bus','Bus','le bus'],['voiture','Voiture','la voiture'],['ceinture','Ceinture','la ceinture'],['train','Train','le train'],['magasin','Magasin','le magasin'],['docteur','Docteur','le docteur'],['dentiste','Dentiste','le dentiste'],['coiffeur','Coiffeur','le coiffeur'],['logo','Logopédie','la logopédie'],['physio','Physio','la physio'],['ergo','Ergo','l’ergo'],['piscine','Piscine','la piscine'],['visite','Visite','la visite'],['devoirs','Devoirs','les devoirs'],['attendre','Attendre','attendre'],['jouer','Jouer','jouer'],['puzzle','Puzzle','le puzzle'],['briques','Briques','les briques'],['pate','Pâte à modeler','la pâte à modeler'],['dessiner','Dessiner','dessiner'],['coloriage','Coloriage','le coloriage'],['peinture','Peinture','la peinture'],['ballon','Ballon','le ballon'],['bulles','Bulles','les bulles'],['poupee','Poupée','la poupée'],['voitures','Petites voitures','les petites voitures'],['chanter','Chanter','chanter'],['danser','Danser','danser'],['instrument','Instrument','l’instrument'],['dehors','Dehors','aller dehors'],['place','Place de jeux','la place de jeux'],['toboggan','Toboggan','le toboggan'],['balancoire','Balançoire','la balançoire'],['velo','Vélo','le vélo'],['trampoline','Trampoline','le trampoline'],['courir','Courir','courir'],['sauter','Sauter','sauter'],['sable','Bac à sable','le bac à sable'],['promenade','Promenade','la promenade'],['cheval','Cheval','le cheval'],['luge','Luge','la luge'],['piquenique','Pique-nique','le pique-nique'],['jardin','Jardin','le jardin'],['tablette','Tablette','la tablette'],['tele','Dessin animé','le dessin animé'],['jeuvideo','Jeu vidéo','le jeu vidéo'],['telephone','Téléphone','le téléphone'],['musique','Musique','la musique'],['histoire','Histoire','l’histoire'],['glace','Glace','la glace'],['gateau','Gâteau','le gâteau'],['chocolat','Chocolat','le chocolat'],['chien','Chien','le chien'],['chat','Chat','le chat'],['chatouilles','Chatouilles','les chatouilles'],['autocollants','Autocollants','les autocollants'],['surprise','Surprise','la surprise'],['calin','Câlin','le câlin'],['doudou','Doudou','le doudou'],['couverture','Couverture','la couverture'],['pause','Pause','la pause'],['coincalme','Coin calme','le coin calme'],['casque','Casque','le casque'],['silence','Silence','le silence'],['repos','Se reposer','se reposer'],['ranger','Ranger','ranger'],['pyjama','Pyjama','le pyjama'],['veilleuse','Veilleuse','la veilleuse'],['eteindre','Éteindre','éteindre la lumière'],['dodo','Dodo','le dodo']];
/* Les groupes donnent l'ordre des images à l'écran. Une image peut figurer dans plusieurs groupes. */
const PICTO_GROUPES=[['matin','Matin','reveil toilettes visage habiller chaussettes petitdej dents coiffer lunettes chaussures manteau bonnet sac ecole'],['repas','Repas','mains table manger boire repas legumes fruit dessert gouter eau petitdej cuisiner'],['toilette','Toilette','dents mains visage douche bain shampoing secher toilettes couche ongles moucher medicament creme'],['sorties','Sorties','ecole sac devoirs bus voiture ceinture train magasin docteur dentiste coiffeur logo physio ergo piscine visite attendre'],['jouer','Jeux','jouer puzzle briques pate dessiner coloriage peinture poupee voitures ballon bulles chanter danser instrument ranger'],['dehors','Dehors','dehors promenade place toboggan balancoire sable velo trampoline ballon courir sauter cheval piscine luge piquenique jardin'],['plaisirs','Plaisirs','histoire musique tablette tele jeuvideo telephone bulles chatouilles calin chien chat glace gateau chocolat autocollants surprise'],['calme','Calme','pause coincalme casque silence repos couverture doudou calin musique histoire attendre'],['soir','Soir','ranger bain douche pyjama dents toilettes histoire calin doudou veilleuse eteindre dodo']];
const ROUTINE_DEF=['bain','pyjama','dents','histoire','calin','dodo'];

/* ---------- La dose de lumière intérieure (curated) ---------- */
const DOSES=[
  'Aujourd’hui, avant de penser à tout ce qu’il reste à faire, posez-vous une seule question. Qu’est-ce qui va bien en ce moment, même si c’est tout petit ? Vous pouvez commencer par là.',
  'Vous portez beaucoup de choses. Aujourd’hui, je vous propose d’en poser une seule, ne serait-ce qu’une heure. Vous pouvez reporter un rendez-vous, confier une tâche à quelqu’un ou dire non poliment. Vous verrez que tout continue de tenir.',
  'Votre enfant vous regarde comme personne d’autre ne vous regardera jamais. Ce qui compte le plus pour lui, c’est que vous soyez là, bien plus que ce que vous réussissez.',
  'La culpabilité frappe souvent à la porte, presque chaque jour à la même heure. Rien ne vous oblige à lui ouvrir. Vous pouvez lui dire « je t’ai entendue » et retourner à votre journée.',
  'Vous n’avez pas raté la journée d’hier. Elle est passée, et celle d’aujourd’hui vous laisse encore du temps pour faire une petite chose qui compte.',
  'Les progrès de votre enfant ne se comparent pas à ceux des autres enfants. Comparez-le plutôt à ce qu’il était il y a six mois, et prenez le temps de bien regarder.',
  'Si vous ressentez de la fatigue, c’est parce que vous faites le travail de trois personnes. Cela n’a rien à voir avec de la faiblesse. Votre fatigue vous donne une information, et elle mérite que vous l’écoutiez.',
  'Aujourd’hui, essayez de dire une phrase vraie à quelqu’un, par exemple « c’est dur en ce moment ». Vous n’avez rien besoin d’ajouter, et vous verrez ce qui vous revient.',
  'Ce que vous attendez de votre enfant peut l’aider à grandir ou le freiner. Aujourd’hui, attendez de lui une chose qui est à sa portée et dites-le-lui à voix haute.',
  'Il y a une chose que vous faites tous les jours sans que personne la remarque. Je sais qu’elle existe, et je peux vous dire qu’elle compte beaucoup.',
  'Un enfant différent apprend à ses parents une autre façon de voir le temps. Vous êtes en train de l’apprendre avec lui, et c’est quelque chose qu’on n’apprend nulle part ailleurs.',
  'Si vous lisez ces lignes à une heure où tout le monde dort, cela veut dire que vous avez tenu toute la journée. C’est déjà beaucoup, alors accordez-vous du repos maintenant.',
  'Aujourd’hui, cherchez un moment où votre enfant a essayé quelque chose, même s’il n’a pas réussi. Puis dites-le-lui simplement, par exemple « j’ai vu que tu as essayé ».',
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
   rap : l'étape dont on relit la note ; link : un ou plusieurs boutons (evo, photo, breath, advice, ou « sit_nom » pour une situation). */
const PARCOURS=[
  {m:'Mon point de départ',steps:[
    {id:'depart',t:'D’où je pars',acc:'Vous poserez votre point de départ en 3 minutes, et vous écrirez pourquoi vous commencez ce parcours.',
     idee:['Avant d’avancer, je vous propose de regarder où vous en êtes. Le but n’est pas de vous juger. Il est d’avoir un point de comparaison pour plus tard, parce que la fatigue joue un mauvais tour à la mémoire. Les jours difficiles, elle nous fait croire que rien n’a changé, alors que nous avons parfois beaucoup avancé. Les parents qui tiennent dans la durée sont souvent ceux qui voient le chemin qu’ils ont parcouru.',
       'Aujourd’hui, vous faites donc votre premier point sur 5 choses qui pèsent dans la vie d’un parent, à savoir votre stress, votre sentiment de compétence, votre solitude, votre regard sur votre enfant et votre confiance dans l’avenir. Vous le referez au milieu du parcours, puis à la fin. Il n’y a pas de bonne réponse, il y a seulement la vôtre aujourd’hui.'],
     sch:'points',
     ex:'Prenons un parent qui met 8 sur 10 à son stress aujourd’hui. Au milieu du parcours, il met 6. Sans le premier chiffre, il aurait dit que rien n’avait changé. Avec lui, il voit que son stress a baissé de 2 points, et il sait que ses efforts servent à quelque chose.',
     exo:'Faites votre point de départ dans « Mon évolution ». Il y a 5 échelles de 0 à 10 et cela prend 3 minutes.',
     obs:'Cette semaine, remarquez à quel moment de la journée le poids est le plus lourd. Contentez-vous de le remarquer, sans rien changer pour l’instant.',
     ecr:'Terminez cette phrase avec vos mots. Je commence ce parcours parce que…',ph:'Je commence ce parcours parce que…',link:'evo'},
    {id:'croire',t:'Croire en lui, l’effet Pygmalion',acc:'Vous verrez comment ce que vous attendez de votre enfant change ce qu’il ose essayer.',
     idee:['Ce que nous attendons d’une personne finit souvent par arriver. Cela n’a rien de magique. Quand je crois qu’un enfant peut y arriver, je lui laisse plus de temps, je l’encourage davantage et je remarque ses essais. Lui le sent, et il ose essayer plus longtemps. Comme il essaie, il progresse, et je crois encore plus en lui.',
       'L’inverse est vrai aussi. Si je pense qu’il n’y arrivera pas, je fais à sa place pour aller plus vite, et il finit par ne plus essayer.',
       'On appelle cela l’effet Pygmalion, du nom d’un sculpteur de la mythologie grecque qui aimait tant sa statue qu’elle a fini par prendre vie. Dans les années 1960, le psychologue américain Robert Rosenthal a fait croire à des enseignants que certains de leurs élèves, en réalité tirés au sort, allaient beaucoup progresser. À la fin de l’année, ces élèves avaient en moyenne davantage progressé que les autres, surtout les plus jeunes. La seule chose qui avait changé, c’était le regard de leurs enseignants. Cette expérience a été beaucoup discutée depuis, et d’autres chercheurs ont mesuré un effet plus modeste. Il n’est pas nul pour autant, parce que ce que nous attendons d’un enfant change notre façon d’agir avec lui.'],
     sch:'boucle',
     vecu:['Je l’ai vécu moi-même. À 10 ans, d’après les professionnels qui m’avaient rencontré, je ne parlais qu’avec 150 mots. J’étais très médiocre à l’école. Je ne comprenais pas, je n’y arrivais pas, et je pensais ne pas être au niveau.',
       'Puis mes parents d’accueil ont cru en moi. Ils m’ont dit que j’étais intelligent. Ils m’ont appris la discipline, avec 5 minutes de lecture et 10 minutes d’instrument par jour. Je jouais de la flûte et de l’accordéon. À chaque réussite, on me félicitait.',
       'Il m’a fallu 2 ans pour croire en moi. Ensuite, je me suis dit que j’allais y arriver, et j’ai étudié davantage. J’ai commencé l’école secondaire au niveau le plus bas. Dans certaines branches, je suis monté jusqu’au niveau le plus haut.',
       'Plus tard, ma femme a cru en moi à son tour, et cela m’a donné la force d’entreprendre plusieurs formations. Aujourd’hui, je forme à mon tour des apprentis. Imaginez le chemin entre cet enfant aux 150 mots et l’homme qui vous écrit.',
       'Alors oui, tout est possible. Il faut y croire. Pour moi, la vie est un chemin où la foi compte. Je dis foi pour dire croire. Croire en soi, croire en l’autre, et croire en plus grand que soi, que vous l’appeliez le ciel, Dieu ou autrement. Chacun y met ce qui lui parle. Moi, me confier à plus grand que moi m’aide.'],
     ex:'Prenons le moment des chaussures. Si vous pensez qu’il n’y arrivera pas, vous les lui mettez pour partir plus vite, et il n’apprend pas. Si vous pensez qu’il peut y arriver, vous prévoyez 5 minutes de plus, vous le laissez chercher et vous lui dites ce que vous voyez, par exemple « tu as trouvé le bon pied ». Il n’y arrivera peut-être pas tout de suite, mais il aura essayé, et c’est par là que tout commence.',
     exo:'Choisissez une petite chose que votre enfant pourrait réussir cette semaine. Dites-lui une fois par jour que vous l’en croyez capable, et laissez-lui le temps d’essayer.',
     obs:'Notez ce qui change dans sa façon d’essayer, plutôt que dans le résultat.',
     ecr:'Pensez à une personne qui a cru en vous. Qu’est-ce que cela a changé pour vous ?'},
    {id:'croyances',t:'Les croyances qui freinent',acc:'Vous apprendrez à repérer les phrases qui ferment des portes, et à en trouver d’aussi vraies qui en ouvrent.',
     idee:['Vous vous êtes peut-être déjà dit « il ne pourra jamais », « avec ses difficultés, c’est inutile » ou « je dois tout faire à sa place ». Ces phrases ne sont pas des faits. Ce sont des croyances, que nous avons souvent héritées ou qu’un professionnel pressé nous a dites il y a 10 ans.',
       'Une croyance fonctionne comme une paire de lunettes. Elle choisit ce que nous remarquons. Si je pense qu’il est lent, je vois chaque retard et j’oublie les matins où il était prêt à l’heure.',
       'Une croyance qui aide n’a rien d’un mensonge optimiste. C’est une phrase tout aussi vraie, mais qui ouvre une porte au lieu de la fermer. « Il apprend à son rythme » est aussi vrai que « il est lent », et pourtant ces 2 phrases ne vous emmènent pas au même endroit.'],
     sch:'chemins',
     vecu:'Un professeur m’a dit un jour « tu n’y arriveras jamais ». On m’a aussi traité d’idiot. Plus tard, c’est d’un de mes fils qu’un professionnel a dit qu’il avait peu de chances de progresser dans son langage. Il lui avait collé une étiquette, alors que d’autres spécialistes disaient le contraire. Nous avons choisi de croire en notre fils plutôt qu’en cette étiquette. Depuis qu’il est dans son école actuelle, il a fait un bond énorme.',
     ex:'Voici 2 autres exemples. « Elle ne parle pas » peut devenir « elle se fait comprendre autrement ». « Il fait des crises » peut devenir « il n’a pas encore d’autre moyen de dire que c’est trop ».',
     exo:'Repérez 3 phrases que vous vous dites sur votre enfant quand c’est difficile. Pour chacune, cherchez une phrase aussi vraie qui ouvre une porte.',
     obs:'Repérez la croyance qui revient le plus souvent dans votre tête.',
     ecr:'Écrivez la phrase qui revient le plus souvent dans votre tête. Puis écrivez une phrase aussi vraie, qui ouvre une porte.'},
    {id:'objectifs',t:'Mes objectifs à moi',acc:'Vous transformerez un souhait flou en un objectif que vous pouvez tenir, et il ne concernera que vous.',
     idee:['Un parcours sans objectif ressemble à une promenade. C’est agréable, mais on ne sait pas vraiment si l’on avance. Les objectifs dont je parle ici ne concernent pas votre enfant, ils vous concernent vous. Cela peut être dormir, souffler, mieux comprendre, oser demander ou arrêter de vous excuser.',
       '« Me reposer » est un souhait, et un souhait reste flou. Il devient un objectif quand vous pouvez dire quoi exactement, quand, et avec l’aide de qui. Choisissez-le petit. Un objectif que vous pouvez tenir une semaine vaut mieux qu’un idéal pour toute l’année.'],
     sch:'marches',
     vecu:'Comme père, j’ai des objectifs et je veux les atteindre, comme évoluer dans mon métier et me former. Je le fais pour moi, pour montrer à mes enfants que tout est possible, et pour offrir à ma famille une sécurité, dans tous les sens du terme. Je crée aussi ce projet pour avoir plus de temps pour ma famille. Vous qui me lisez, je suis sûr que vous y arriverez aussi. Vous êtes de bons parents, j’en suis certain.',
     ex:'Voici un autre exemple. « Mieux comprendre mon fils » devient « samedi matin, je relis pendant 30 minutes le dernier rapport que j’ai reçu, et je note mes 3 questions ».',
     exo:'Choisissez un seul objectif pour le mois et écrivez-le dans votre carnet, plus bas. Puis parlez-en à une personne.',
     obs:'Chaque soir, faites une croix si vous avez fait un pas vers cet objectif. Un soir sans croix n’est pas un échec, il vous renseigne simplement sur votre journée.',
     ecr:'Écrivez votre objectif pour ce mois, en commençant par « D’ici un mois, je… ».',ph:'D’ici un mois, je…'}
  ]},
  {m:'Ce que je ressens',steps:[
    {id:'emotions',t:'Mes émotions, mes signaux',acc:'Vous verrez que la colère, la peur et la tristesse sont des voyants, et vous apprendrez à lire ce qu’ils signalent.',
     idee:['La colère, la tristesse, la peur, la honte et l’épuisement prennent beaucoup de place dans la vie d’un parent, et plus encore quand la famille vit une situation de handicap ou traverse une période difficile. On se les interdit souvent, parce qu’on pense qu’un bon parent ne devrait pas ressentir cela.',
       'Je vous propose de les regarder autrement. Une émotion ressemble au voyant qui s’allume sur le tableau de bord d’une voiture. Le voyant n’est pas la panne. Il vous prévient que quelque chose demande votre attention. Si vous le cachez avec un autocollant, la voiture roule encore un moment, puis elle s’arrête au pire endroit. Une émotion que l’on nie fait la même chose. Elle ressort plus tard, et souvent sur la mauvaise personne.',
       'À l’inverse, une émotion que l’on nomme perd un peu de sa force. En 2007, des chercheurs de l’université de Californie à Los Angeles ont montré à des volontaires des visages en colère ou effrayés. Quand ces personnes choisissaient un mot pour dire l’émotion qu’elles voyaient, la zone du cerveau qui donne l’alerte réagissait moins. Les chercheurs précisent que l’effet est modeste. Il suffit pourtant souvent à reprendre la main, et il ne coûte qu’un mot.'],
     sch:'voyants',
     vecu:'Comme père, l’émotion que je m’interdis le plus, c’est la colère, parce qu’elle est souvent peu constructive. Pourtant, elle permet aussi de faire comprendre à l’enfant qu’une limite a été dépassée. La colère n’est donc pas à bannir, elle est à canaliser.',
     ex:'Prenons un soir où votre enfant renverse son verre pour la 3e fois, et où vous criez. Si vous vous dites « je suis un mauvais parent », vous cachez le voyant. Si vous vous dites « là, c’est de la colère, et dessous il y a surtout de la fatigue », vous l’avez lu. Vous savez alors que le verre n’y est pas pour grand-chose, et que vous avez besoin de souffler avant le prochain repas.',
     exo:'Pour commencer, ouvrez le photolangage et choisissez l’image qui dit le mieux ce que vous ressentez ces jours-ci. Ensuite, 3 fois cette semaine, quand une émotion monte, nommez-la à voix basse. Dites par exemple « là, c’est de la colère », « là, c’est de la peur » ou « là, c’est de la tristesse », puis demandez-vous ce qu’elle vous signale.',
     obs:'Repérez l’émotion que vous vous interdisez le plus.',
     ecr:'Quelle émotion vous interdisez-vous le plus ? Que vous dirait-elle si vous l’écoutiez ?',link:'photo'},
    {id:'culpa',t:'La culpabilité',acc:'Vous trierez ce qui dépendait de vous et ce qui n’en dépendait pas, et vous saurez quoi faire de chaque colonne.',
     idee:['La culpabilité est sans doute l’émotion la plus répandue chez les parents. Elle parle avec des phrases comme « j’aurais dû le voir plus tôt », « je n’en fais pas assez » ou « je me suis encore énervé ». Si vous l’entendez souvent, c’est d’abord parce que vous tenez à votre enfant. Un parent qui s’en moque ne se sent pas coupable.',
       'Son défaut est de tout mettre dans le même sac. Il y a ce qui dépendait vraiment de vous, comme un mot trop dur ou une promesse oubliée. Et il y a tout ce qui ne dépendait pas de vous, comme la situation de handicap de votre enfant, la période qu’il traverse, votre fatigue ou le manque de relais. La culpabilité vous fait porter les 2 de la même façon.',
       'Je vous propose donc de trier. Ce qui dépendait de vous peut se réparer, souvent par un mot ou par un geste, et la culpabilité s’en va quand c’est fait. Ce qui n’en dépendait pas ne se répare pas, parce que vous n’avez rien cassé. Cela se dépose. Une culpabilité qui dure le temps de réparer vous aide. Celle qui s’installe pendant des années ne répare rien, et elle vous use.'],
     sch:'colonnes',
     vecu:'Comme papa, je me suis senti coupable de ne pas offrir assez de temps à mes enfants, pris par le quotidien, le travail et les obligations. Il faut agender du temps pour la famille et les enfants, et ce temps doit être non négociable. Ce n’est pas tant le temps que je passe avec ma famille qui compte, c’est la qualité de ma présence quand je suis là. Cela fait la différence. La famille, la santé et vous, c’est ce qu’il y a de plus important, et les 3 sont liés.',
     ex:'Prenons un matin où vous avez crié parce que vous étiez en retard. Dans la colonne de gauche, il y a une seule ligne, « j’ai crié ». Dans celle de droite, il y a la nuit hachée, le rendez-vous de 8 heures et personne pour vous relayer. Le soir, vous dites à votre enfant « ce matin j’ai crié, je te demande pardon, j’étais fatigué et tu n’y étais pour rien ». Cela prend 10 secondes, et la colonne de gauche est vide.',
     exo:'Prenez une feuille et tracez 2 colonnes. À gauche, écrivez ce qui dépendait vraiment de vous. À droite, écrivez ce qui n’en dépendait pas. Pour la colonne de gauche, choisissez une seule réparation, comme un mot d’excuse ou un moment à deux. La colonne de droite, vous pouvez la déposer.',
     obs:'Remarquez à quel moment de la journée la culpabilité parle le plus fort, et ce qu’elle dit toujours en premier.',
     ecr:'Quelle phrase votre culpabilité répète-t-elle le plus souvent ? Que diriez-vous à un ami qui se dirait la même chose ?',link:'sit_culpa'},
    {id:'reguler',t:'Me calmer, puis lâcher prise',acc:'Vous choisirez le geste qui vous calme quand la vague monte, et je vous dirai ce qui marche pour moi.',
     idee:['On ne choisit pas ce que l’on ressent, mais on peut choisir ce que l’on en fait. Une émotion forte monte comme une vague. Le cœur bat plus vite, la mâchoire se serre et la voix se durcit. Au sommet de la vague, la tête réfléchit mal. Les phrases que l’on regrette sortent presque toujours à ce moment-là.',
       'La bonne nouvelle est qu’une vague ne reste jamais en haut. Si vous ne la nourrissez pas, elle redescend d’elle-même. Vous n’avez donc pas à la retenir. Il suffit de traverser le sommet sans rien casser, et pour cela le corps passe avant la tête. Expirez plus longtemps que vous n’inspirez, et vous sentirez votre cœur ralentir. Vous pouvez aussi sortir 30 secondes, poser les mains à plat, marcher ou dire une phrase apprise par cœur. Parler et décider viendront après, une fois en bas.',
       'Lâcher prise vient ensuite, et ce mot est souvent mal compris. Lâcher prise, c’est poser ce qui ne dépend pas de vous, comme vous l’avez fait avec la colonne de droite la semaine dernière. Vous gardez ainsi vos forces pour ce que vous pouvez changer. Cela n’a rien d’un renoncement.'],
     sch:'vague',
     vecu:'Quand la colère ou la fatigue monte, ce qui me calme, c’est de marcher en forêt et de me connecter à la nature. Le fait de bouger, de faire une activité, fait descendre la pression. Cela permet de se détourner et de prendre du recul.',
     ex:'Prenons le moment des devoirs, quand le ton monte des 2 côtés. Vous sentez votre mâchoire se serrer. Vous dites « je reviens dans 2 minutes », vous allez à la fenêtre et vous expirez lentement 5 fois. Quand vous revenez, l’exercice de maths est toujours là, mais vous n’êtes plus au sommet de la vague. Vous pouvez alors dire calmement « on reprend à la ligne 3 ».',
     exo:'Choisissez un seul geste pour vous calmer, comme expirer lentement, sortir un instant, marcher 5 minutes, poser les mains à plat ou dire une phrase apprise par cœur. Utilisez-le chaque fois que la vague monte, pendant une semaine.',
     obs:'Parmi vos soucis de la semaine, repérez ce qui ne dépend pas de vous. Écrivez-le, puis laissez-le de côté.',
     ecr:'Quel geste vous calme le mieux ? Écrivez-le ici, pour le retrouver un jour de tempête.',rap:'emotions',link:'breath'},
    {id:'appuis',t:'Mes appuis pour tenir',acc:'Vous trouverez vos 4 appuis, et je vous raconterai ce qui m’a fait tenir quand j’étais enfant.',
     idee:['On appelle résilience la capacité de tenir debout quand la vie secoue, et de se relever ensuite. On croit souvent que c’est une qualité que l’on a ou que l’on n’a pas. Elle se construit pourtant, et rarement seul. Le neuropsychiatre Boris Cyrulnik, qui a fait connaître ce mot, parle de « tuteur de résilience » pour désigner la personne sur laquelle on s’appuie pour se relever, comme une jeune plante s’appuie sur son tuteur.',
       'Un appui peut être une personne qui vous écoute sans vous juger, un lieu qui vous apaise, une activité qui vous recharge ou une phrase qui vous tient debout. Avec un seul appui, on tient mal, comme une table sur un seul pied. Avec 4, on peut encaisser un coup.',
       'Les appuis ont un défaut. Ils ne viennent pas tout seuls quand on est fatigué. Quand on va mal, on annule le café avec l’amie et on reporte la marche. Il faut donc les nommer un jour où l’on va à peu près bien, et prendre rendez-vous avec eux comme on le fait avec le médecin.'],
     sch:'appuis',
     vecu:['Jusqu’à mes 10 ans, j’ai vécu des choses très dures. Il y a eu la violence des gestes, celle des mots, et d’autres choses qu’aucun enfant ne devrait vivre. Pourtant, je m’accrochais à ce qu’il y avait de bon, et c’est aussi ce qui m’a sauvé.',
       'J’ai été placé en famille d’accueil à 10 ans. Ce qui m’a aidé à tenir, ce sont mes parents d’accueil, qui sont devenus mon pilier.'],
     ex:'Voici les 4 appuis d’une maman. Sa personne est sa sœur, qu’elle appelle le dimanche soir. Son lieu est un banc au bord du lac, où elle s’assoit 10 minutes après le travail. Son activité est la chorale du jeudi. Sa phrase est « un jour à la fois ». Aucun de ces appuis ne règle ses problèmes, mais ensemble ils l’empêchent de tomber.',
     exo:'Trouvez vos 4 appuis, c’est-à-dire une personne, un lieu, une activité et une phrase, et notez-les dans votre carnet, plus bas. Prenez ensuite rendez-vous avec chacun d’eux dans le mois.',
     obs:'Remarquez ce qui vous recharge vraiment, et ce qui vous aide seulement à ne plus rien sentir.',
     ecr:'Écrivez vos 4 appuis, une personne, un lieu, une activité et une phrase.'}
  ]},
  {m:'Mon regard',steps:[
    {id:'regard',t:'Ce qui met un enfant en difficulté, le MDH-PPH',acc:'Vous découvrirez le modèle que des professionnels utilisent pour comprendre ce qui met un enfant en difficulté, et je vous raconterai ce qui a changé pour mon fils quand il a changé d’école.',
     idee:['Pendant longtemps, on a pensé que le handicap était dans la personne, comme une panne à réparer. Au Québec, l’anthropologue Patrick Fougeyrollas a proposé avec son équipe une autre façon de voir, que des institutions de Suisse romande utilisent aujourd’hui. Avant de vous donner son nom, je commence par un exemple.',
       'Un enfant myope qui a perdu ses lunettes ne peut pas lire au tableau. On lui rend ses lunettes, et il lit. Ses yeux sont restés les mêmes, et seule la situation a changé. Une situation de handicap apparaît de cette façon, quand ce qu’est un enfant rencontre un environnement qui ne lui convient pas, et qu’il ne peut alors pas faire ce que fait d’habitude un enfant de son âge.',
       'Ce modèle s’appelle le MDH-PPH, pour Modèle de développement humain et Processus de production du handicap. Il regarde 3 choses. Il y a ce qu’est votre enfant, avec son corps, ses capacités, son caractère et son histoire. Il y a ce qui l’entoure, c’est-à-dire les personnes, les lieux, le matériel et les règles. Et il y a ce qu’il fait chaque jour, comme manger, se déplacer, apprendre ou jouer avec d’autres. Dans ce qui l’entoure, ce qui l’aide s’appelle un facilitateur, et ce qui le gêne s’appelle un obstacle.',
       'Ce modèle a été construit pour le handicap, mais il part du développement de tout être humain. On peut donc s’en servir aussi pour regarder un enfant qui traverse une séparation, un deuil ou des moqueries à l’école. Lui aussi est mis en difficulté par la rencontre entre ce qu’il vit et ce qui l’entoure. Je trouve ce modèle intéressant pour un parent, parce qu’il déplace la question. On ne peut pas toujours changer ce qu’est un enfant, mais on peut presque toujours changer quelque chose autour de lui.'],
     sch:'mdh',
     vecu:['À l’étape 3, je vous ai dit qu’un de mes fils avait fait un bond énorme depuis qu’il est dans son école actuelle. Je vous raconte ici ce qui a changé pour lui. Dans son ancienne école, il n’arrivait pas à se concentrer. Quand la maîtresse parlait à toute la classe, il ne comprenait pas ce qu’elle disait, et il ne se sentait pas concerné.',
       'La façon d’enseigner était clairement le point à améliorer. Peut-être aurait-il fallu aussi d’autres outils, adaptés à sa façon d’apprendre, qui passent par les yeux, par les oreilles ou par le mouvement. Il avait en plus une enseignante spécialisée pour lui. Mais elle croyait savoir ce qu’il avait, et ce regard posé sur lui faussait tout.',
       'Son école actuelle utilise d’autres stratégies. Les groupes sont plus petits. L’échec y est vu comme une façon d’apprendre et de grandir. L’erreur n’y est pas pointée, mais la réussite l’est. Les enfants utilisent des matériaux variés, et ils bougent en classe au lieu de rester assis sur un banc. On respecte le besoin de l’enfant, et cela fait toute la différence.',
       'Depuis, mon fils se sent plus compétent et il valorise ses réussites. Il dit qu’il sent qu’il avance et qu’il apprend. Il dit aussi qu’il se sent bien. Il aime étudier, et il aime davantage aller à l’école.',
       'J’ai appris qu’un parent doit réfléchir, et parfois suivre son instinct. L’école traditionnelle n’est pas toujours la solution. Quand on permet à un enfant de suivre sa scolarité ailleurs, dans un autre contexte, tout peut changer. L’environnement imprègne un enfant, et la pédagogie aussi. Il faut donc réfléchir en termes d’environnement. Est-il adapté à votre enfant ? Peut-on l’adapter dans sa classe, en collaboration avec les professionnels ? Faut-il changer d’école, ou de type d’école ?'],
     ex:'Prenons un repas de famille. Votre enfant supporte mal le bruit. Dans une salle pleine, il crie, et quelqu’un dit qu’il est difficile. À une petite table un peu à l’écart, avec son casque sur les oreilles, il mange avec tout le monde. C’est le même enfant dans les 2 cas. Le bruit était l’obstacle, et la petite table et le casque sont des facilitateurs.',
     exo:'Choisissez un moment de la journée qui se passe souvent mal. Cherchez un obstacle dans ce qui entoure votre enfant à ce moment-là, comme le bruit, une consigne trop longue, un horaire trop serré ou un regard. Changez une seule chose pendant une semaine.',
     obs:'Écoutez comment on parle de votre enfant autour de vous. Parle-t-on de ce qu’il est, ou de la situation dans laquelle il se trouve ?',
     ecr:'Racontez une situation où c’est l’environnement qui a mis votre enfant en difficulté. Qu’est-ce qui aurait pu l’aider ?'},
    {id:'enfant',t:'Voir mon enfant avant ses difficultés',acc:'Vous décrirez votre enfant sans un seul mot de son dossier, et je ferai l’exercice avant vous avec un des miens.',
     idee:['Les idées toutes faites sur le handicap, ou sur les enfants que l’on dit difficiles, s’invitent jusque dans notre cuisine. Elles nous font voir les difficultés avant la personne, et le diagnostic ou l’étiquette avant le prénom. Cela arrive même aux parents les plus aimants, et je vous explique pourquoi.',
       'Imaginez une scène de théâtre dans le noir, avec un seul projecteur. Ce qu’il éclaire prend toute la place, et le reste disparaît. Un diagnostic ou une étiquette fait la même chose. En 1982, le chercheur Steven Reiss et 2 collègues l’ont observé chez des psychologues. Quand la description d’une personne mentionnait une déficience intellectuelle, ils mettaient souvent ses autres difficultés sur le compte de ce diagnostic, et ils passaient à côté de ce qu’elle vivait par ailleurs. Ces chercheurs ont donné à cela un nom, que l’on peut traduire par l’ombre du diagnostic.',
       'Ce que font ces professionnels, nous le faisons aussi à la maison. Un diagnostic y suffit, et une simple étiquette aussi, comme « le timide », « le difficile » ou « celui qui ne tient pas en place ». Pourtant, chaque enfant est d’abord une personne unique, avec ses goûts, son humour, ses peurs et ses talents. Une situation de handicap ou une période difficile décrit une partie de sa vie, mais elle ne dit pas qui il est.',
       'Cette semaine, je vous propose d’élargir la lumière du projecteur, et de regarder d’abord qui est votre enfant, puis ce dont il a besoin. Vous ne niez pas ses difficultés en faisant cela. Vous leur redonnez leur vraie place, celle d’une partie de sa vie et non de sa vie entière.'],
     sch:'projecteur',
     vecu:['Je fais l’exercice de cette semaine avant vous, avec un de mes enfants, sans un mot sur ses difficultés.',
       'Il a beaucoup d’humour. Il aime rire, et il voit la vie de façon amusante et drôle. Dans chaque situation, il trouve le moyen de la tourner en positif et en humour.'],
     ex:'Prenons un premier rendez-vous avec une nouvelle enseignante. Un parent commence par « il a un trouble de l’attention, il ne tient pas en place ». L’enseignante cherchera l’enfant agité, et elle le trouvera. Un autre parent commence par « il adore les insectes, il pose des questions sur tout, et il a besoin de bouger pour apprendre ». C’est le même enfant. L’enseignante a maintenant une porte d’entrée, et le besoin est dit quand même.',
     exo:'Dans votre carnet, plus bas, décrivez votre enfant en 10 lignes sans utiliser un seul mot de son dossier ni de ses bulletins. Faites aussi la liste de 5 choses qu’il fait mieux que la plupart des gens. Cherchez bien, parce qu’il y en a.',
     obs:'Quand vous présentez votre enfant à quelqu’un, remarquez si vous commencez par son prénom ou par ses difficultés.',
     ecr:'Décrivez votre enfant sans un seul mot de son dossier. Parlez de ses goûts, de son caractère, de son humour et de ses petites manières.'},
    {id:'avenir',t:'Une vision de l’avenir qui donne envie',acc:'Vous écrirez une journée de votre enfant dans 10 ans, et je vous dirai ce qui me fait peur, à moi, pour les miens.',
     idee:['L’avenir fait peur surtout parce qu’il est flou. Quand on ne voit rien devant soi, la peur remplit le vide, et elle imagine souvent le pire. Un avenir que l’on souhaite, même imparfait, donne au contraire une direction. Il ne s’agit pas de faire un plan de carrière pour votre enfant, mais d’avoir une image en tête. Où vit-il, avec qui, que fait-il le matin et qu’est-ce qui le fait rire ? Quand un parent n’a pas cette image, ce sont souvent les autres qui en choisissent une pour son enfant.',
       'Une belle image ne suffit pourtant pas. La psychologue Gabriele Oettingen a étudié pendant des années la façon dont nous pensons à l’avenir. Les personnes qui se contentaient de rêver à un bel avenir faisaient ensuite moins d’efforts, et elles y arrivaient moins bien. Celles qui imaginaient ce bel avenir, puis regardaient en face ce qui se dressait sur leur chemin, trouvaient la direction et l’énergie pour avancer.',
       'Elle appelle cette façon de faire le contraste mental, et elle tient en 3 temps. Vous imaginez la belle image. Vous nommez ce qui vous fait peur entre aujourd’hui et cette image. Puis vous choisissez un petit pas. La peur ne disparaît pas, mais elle cesse d’occuper toute la route, parce qu’elle a maintenant un nom et une place.'],
     sch:'cap',
     vecu:['Moi aussi, j’ai peur pour l’avenir de mes enfants. Ils ont été élevés dans un cocon familial, dans un monde protecteur, drôle et beau. Dehors, la vie est dure et elle ne fait pas de cadeau. Cela me fait peur de les voir confrontés à cela.',
       'Voici l’image qui me donne envie d’avancer. Dans 10 ans, je vois des enfants qui savent rebondir à chaque difficulté. Pour eux, une difficulté est une opportunité de grandir et d’apprendre, une chance à saisir. Quand ils échouent, ils le prennent comme un apprentissage. Je souhaite que leurs rêves se réalisent. Je souhaite aussi que nous soyons unis, et toujours là pour eux.'],
     ex:'Une maman imagine son fils à 20 ans. Il prend le bus seul le matin pour aller travailler, et il lui envoie un message en arrivant. Ce qui lui fait peur, c’est qu’il se perde ou qu’on se moque de lui. Son petit pas de la semaine est de faire avec lui le trajet jusqu’à la boulangerie, et de le laisser marcher devant. L’image est restée la même, mais elle a maintenant un chemin.',
     exo:'Cette semaine, l’exercice est d’écrire. Prenez un moment au calme et racontez dans votre carnet, plus bas, une journée de votre enfant dans 10 ans. Écrivez ensuite en une phrase ce qui vous fait le plus peur entre aujourd’hui et cette journée. Puis choisissez un petit pas à faire dans les 7 jours.',
     obs:'Dans la semaine, remarquez un petit pas qui va déjà dans cette direction.',
     ecr:'Écrivez une journée de votre enfant dans 10 ans, du réveil au coucher, la plus belle possible tout en restant réaliste.'},
    {id:'mi',t:'Le bilan de mi-parcours',acc:'Vous comparerez vos 5 échelles avec celles du départ, et je vous raconterai le moment où j’aurais pu tout lâcher.',
     idee:['Vous êtes à la moitié du parcours. C’est souvent le moment le plus difficile d’un long chemin. Le départ est déjà loin, l’arrivée n’est pas encore en vue, et l’on a l’impression de ne plus avancer.',
       'En 2011, 3 chercheurs ont étudié ce moment où l’on reste comme coincé au milieu. Dans leurs expériences avec des étudiants, l’envie de continuer était forte au début, forte à l’approche du but, et plus faible vers la moitié. Leur explication est simple. Au début, chaque pas se voit, parce qu’on le compare au peu de chemin déjà fait. À la fin, chaque pas se voit aussi, parce qu’on le compare au peu de chemin qui reste. Au milieu, un pas de plus semble ne rien changer. On peut appeler cela le creux du milieu.',
       'Si vous sentez ce creux aujourd’hui, vous n’avez donc rien raté. Ce qui aide, c’est de se retourner pour mesurer le chemin fait. Refaites le point sur votre stress, votre sentiment de compétence, votre solitude, votre regard et votre confiance, puis comparez avec le départ sans vous juger. Ce qui a bougé vous appartient, et ce qui n’a pas bougé vous montre où porter vos efforts pendant la seconde moitié.',
       'Donnez-vous ensuite un but tout proche, pour les 4 prochaines semaines seulement. Vous pouvez aussi ajuster votre objectif, parce qu’il a le droit d’avoir changé.'],
     sch:'creux',
     vecu:['J’ai connu ce creux pendant une formation tertiaire de 3 ans, qui a eu ses hauts et ses bas. Pendant ces années, un de mes fils, né avec une cataracte congénitale, a été opéré puis hospitalisé. Un autre avait un retard de langage.',
       'J’aurais pu lâcher, et trouver des prétextes pour arrêter. J’ai continué, pour offrir à mes enfants une vie plus confortable, avec un meilleur salaire. Malgré ces épreuves, j’ai terminé cette formation avec la mention excellente.'],
     ex:'Une maman refait ses 5 échelles. Son stress est passé de 8 à 6, et sa solitude est restée à 7. Elle pourrait ne voir que ce 7. Elle note d’abord ce qui a bougé, et ce qu’elle a fait pour cela. Puis elle se donne un seul but pour les 4 prochaines semaines, qui est d’appeler une autre maman de l’école.',
     exo:'Refaites le point dans « Mon évolution », puis choisissez une nouvelle photo dans le photolangage. Relisez ensuite la phrase que vous aviez écrite en commençant le parcours. Elle est sur cette page. Choisissez enfin votre but pour les 4 prochaines semaines.',
     obs:'Remarquez ce qui a bougé sans que vous l’ayez décidé.',
     ecr:'Qu’est-ce que vous faites aujourd’hui que vous ne faisiez pas en commençant ?',rap:'depart',link:['evo','photo']}
  ]},
  {m:'Mon enfant et ses forces',steps:[
    {id:'talents',t:'Ses talents, ses compétences',acc:'Vous chercherez les talents de votre enfant qui ne se voient pas au premier regard, et je vous dirai celui que j’ai découvert chez un des miens.',
     idee:['Quand on parle des talents d’un enfant, on pense d’abord à ce qui se voit, comme les notes, le dessin, le sport ou la musique. Un talent n’a pourtant pas besoin d’être spectaculaire. Remarquer les détails, bien mémoriser, persévérer, sentir l’humeur des autres, rire aux éclats ou être fidèle sont de vraies compétences, et elles se cultivent.',
       'Pensez à un iceberg. La partie qui dépasse de l’eau est petite, et la plus grande partie se trouve en dessous. En 2004, les psychologues Christopher Peterson et Martin Seligman ont classé ces qualités dans un grand ouvrage. Ils en ont décrit 24, parmi lesquelles la persévérance, la gentillesse, la curiosité, l’espoir et l’humour. Ils les appellent les forces de caractère.',
       'Ces forces ont une particularité. Un enfant ne sait pas toujours qu’il les possède, parce que personne ne les note dans un bulletin. Quand vous nommez une force que vous avez vue, avec un exemple précis, votre enfant apprend qu’elle existe et qu’elle est à lui. Cette semaine, je vous propose de regarder sous l’eau.'],
     sch:'iceberg',
     vecu:['Chez un de mes enfants, le talent qui ne se voit pas tout de suite, c’est sa patience et sa persévérance. Il ne lâche rien tant qu’il n’a pas la solution.',
       'Je l’ai remarqué en le regardant chercher la solution d’un problème. Il fait tout pour y arriver. Il peut reprendre la tâche le lendemain et continuer pendant des heures. Tant qu’il n’a pas trouvé, il ne lâche rien.'],
     ex:'Un soir, un papa dit à sa fille « tu es restée 20 minutes sur ce puzzle sans te décourager, cela s’appelle de la persévérance ». Il ne lui dit pas qu’elle est la meilleure. Il lui montre une force qu’elle a, avec la preuve. Elle sait maintenant quoi refaire, et elle a un mot pour le dire.',
     exo:'Choisissez une compétence de votre enfant et créez une occasion de l’exercer cette semaine. Dites-lui ce que vous avez vu.',
     obs:'Comptez les fois où vous nommez une compétence, et les fois où vous nommez une difficulté.',
     ecr:'Quelle compétence de votre enfant avez-vous choisie ? Qu’avez-vous vu quand il l’a exercée ?'},
    {id:'encourager',t:'Encourager juste',acc:'Vous verrez pourquoi « tu as essayé 3 fois » porte plus loin que « bravo », et ce que je fais quand un de mes enfants n’y arrive pas.',
     idee:['Encourager ne veut pas dire féliciter tout le temps. Il s’agit plutôt de trouver le bon dosage, parce que trop d’aide étouffe et que trop peu d’aide décourage.',
       'Imaginez 3 zones autour de votre enfant. Au centre, il y a ce qu’il fait déjà seul. Tout au bord, il y a ce qu’il ne peut pas encore faire, même avec vous. Entre les 2 se trouve ce qu’il réussit avec un coup de pouce, et c’est là qu’il apprend. Le psychologue Lev Vygotski a décrit cette zone il y a près d’un siècle. On l’appelle la zone proximale de développement.',
       'Votre aide ressemble alors à un échafaudage. Vous donnez un indice, vous montrez autrement, vous proposez un outil, puis vous retirez l’aide dès que votre enfant tient debout. Souvenez-vous des 5 minutes de lecture par jour dont je vous ai parlé à l’étape 2. On me demandait 5 minutes, et non une heure. Un bon encouragement vise le pas suivant, celui que votre enfant peut atteindre avec un peu d’effort.',
       'Quant aux mots, parlez de l’effort plutôt que du résultat. « Tu as essayé 3 fois » porte plus loin que « bravo », parce que votre enfant sait alors ce qu’il a bien fait, et qu’il peut le refaire.'],
     sch:'zones',
     vecu:['Quand un de mes enfants n’y arrive pas, je le rassure et je lui dis de respirer. Puis j’essaie d’autres méthodes, comme le dessin, le jeu, un schéma, des objets ou une mise en situation.',
       'Je lui dis que la solution, il l’a, mais qu’il faut tester, chercher, et parfois persévérer. Parfois je lui donne des indices. Parfois je lui suggère un outil, comme internet, une IA ou un dictionnaire.'],
     ex:'Votre fille n’arrive pas à fermer sa veste. Si vous la fermez à sa place, elle n’apprend rien de nouveau. Si vous lui dites de se débrouiller, elle abandonne. Vous engagez alors le bas de la fermeture, et elle tire la languette jusqu’en haut. Dans quelques jours, vous ne tiendrez plus que le tissu. Vous lui direz « tu as tiré jusqu’en haut toute seule », plutôt que « bravo ».',
     exo:'Cette semaine, remplacez « bravo » par la description de ce que vous avez vu, par exemple « tu as attendu », « tu as demandé » ou « tu as réessayé ».',
     obs:'Repérez un moment où vous aidez par habitude alors que votre enfant pourrait essayer.',
     ecr:'Écrivez 3 phrases qui décrivent ce que vous avez vu cette semaine, à la place de « bravo ».'},
    {id:'solutions',t:'Des solutions pour le quotidien',acc:'Vous choisirez une seule difficulté du quotidien, et je vous raconterai comment le brossage des dents est devenu un jeu chez nous.',
     idee:['Les problèmes concrets ont souvent des solutions concrètes. On peut prévenir avant un changement d’activité, montrer en images, proposer 2 choix, simplifier une consigne, préparer une sortie ou transformer une corvée en jeu. Les outils de l’application sont là pour cela.',
       'Quand une difficulté revient tous les jours, on est tenté d’y mettre encore plus de volonté. On répète plus fort, et on s’énerve plus vite. Une méthode marche mieux. Les usines utilisent depuis longtemps une roue en 4 temps, où l’on prépare, on essaie, on vérifie, puis on ajuste, avant de recommencer. On l’appelle la roue de Deming, du nom du statisticien qui l’a fait connaître au Japon dans les années 1950, à partir des travaux de Walter Shewhart.',
       'À la maison, cette roue tourne très bien. Vous choisissez une seule difficulté et une seule piste. Vous l’essayez pendant 7 jours, sans rien changer d’autre. Chaque soir, vous notez si c’était mieux, pareil ou moins bien. Au bout des 7 jours, vous gardez la piste ou vous en changez. Si la première piste ne marche pas, vous n’avez pas échoué. Vous avez appris quelque chose, et la roue repart.'],
     sch:'roue',
     vecu:['Chez nous, c’était difficile pour les enfants d’aller se brosser les dents. Alors nous avons créé un jeu. Les brosses à dents sont devenues des personnages de Mario, et les dents sont des briques. Elles doivent être propres pour que Mario ou Luigi les voient bien et puissent taper dedans.',
       'Pendant le brossage, on imagine Mario, Luigi, Peach ou les Toad sur un parcours. Il faut passer sur toutes les dents pour éviter les dégâts de Bowser, le monstre. Le passage de la brosse crée une protection, à condition de rester 30 secondes sur chacune des 4 zones de la bouche.'],
     ex:'Chaque matin, mettre les chaussures prend 20 minutes et finit en cris. Une maman choisit une seule piste, qui est de préparer les chaussures la veille avec son fils et de lui laisser choisir la paire. Pendant 7 jours, elle note. C’est mieux 4 matins sur 7. Elle garde la piste. La semaine suivante, la roue repart, et elle essaie un minuteur pour les 3 autres matins.',
     exo:'Dans la boîte à outils, choisissez la situation que vous vivez le plus souvent et essayez une seule des pistes pendant 7 jours.',
     obs:'Notez chaque soir si c’était mieux, pareil ou moins bien. Au bout de 7 jours, vous pourrez décider de continuer ou de changer.',
     ecr:'Quelle situation avez-vous choisie, quelle piste avez-vous essayée, et qu’est-ce que cela a donné au bout de 7 jours ?',link:'advice'},
    {id:'place',t:'Sa place parmi les autres',acc:'Vous regarderez la place de votre enfant parmi les autres, et je vous dirai où j’ai trouvé la mienne quand j’étais enfant.',
     idee:['Avoir sa place parmi les autres, ce n’est pas seulement être présent. Un enfant peut être assis dans la classe, invité à l’anniversaire ou inscrit au club, et rester seul au milieu des autres.',
       'Pour y voir clair, on distingue 4 situations. Dans l’exclusion, l’enfant reste dehors. Dans la ségrégation, il est accueilli, mais à part, avec ceux qui lui ressemblent. Dans l’intégration, il est avec les autres, à condition de s’adapter tout seul. Dans l’inclusion, c’est le groupe qui s’organise pour que chacun y ait sa place. Ces 4 mots viennent d’un texte de 2016 du Comité des droits des personnes handicapées des Nations Unies, écrit pour l’école. Ils éclairent aussi la place d’un enfant timide, moqué, ou arrivé en cours d’année.',
       'L’inclusion ne tombe pas du ciel. Elle réussit quand quelqu’un prépare le terrain, et beaucoup moins quand on jette l’enfant dans le grand bain. Ce quelqu’un, c’est souvent vous. Il existe d’ailleurs beaucoup de possibilités entre la classe ordinaire et l’institution spécialisée, et celle qui convient à votre enfant peut changer avec l’âge. Vous avez aussi le droit de choisir vos combats, parce que certains lieux méritent votre énergie et d’autres non.',
       'Bien souvent, la porte d’entrée est une activité que l’on partage. On trouve plus facilement sa place autour de ce que l’on fait ensemble.'],
     sch:'inclusion',
     vecu:'Enfant, j’ai trouvé ma place grâce à un instrument de musique, l’accordéon. Je faisais partie du club des accordéonistes. Je me sentais dans un groupe, et j’avais un sentiment d’appartenance.',
     ex:'Un garçon qui parle peu arrive dans un club de football. Si l’entraîneur le laisse sur le banc, il est présent, et rien de plus. Sa maman va voir l’entraîneur avant le premier entraînement. Elle lui explique que son fils comprend mieux quand on lui montre, et qu’il adore être gardien. L’entraîneur montre alors les exercices au lieu de les expliquer, pour toute l’équipe. Personne ne remarque l’adaptation, et le garçon a sa place dans les buts.',
     exo:'Choisissez un lieu où vous aimeriez que votre enfant ait davantage sa place, et notez dans votre carnet ce qui rendrait cela possible. Parlez-en ensuite à une personne de ce lieu.',
     obs:'Observez un lieu où l’inclusion marche déjà. Qu’est-ce qui fait que ça marche ?',
     ecr:'Dans quel lieu aimeriez-vous que votre enfant ait davantage sa place ? Qu’est-ce qui rendrait cela possible, une personne, une adaptation ou une habitude ?'}
  ]},
  {m:'Autour de nous',steps:[
    {id:'couple',t:'À deux, ou seul',acc:'Vous poserez une seule question à la personne qui partage votre quotidien, et je vous dirai la règle que nous tenons, ma femme et moi.',
     idee:['Un enfant qui demande beaucoup bouscule aussi la vie à deux. Souvent, l’un des parents porte les rendez-vous et l’organisation pendant que l’autre porte l’inquiétude en silence, et chacun croit que l’autre ne voit pas ce qu’il fait. On ne vit pas non plus les choses au même rythme. L’un a besoin d’en parler, l’autre a besoin de ne pas y penser, et aucun des deux n’a tort.',
       'Il existe 2 liens entre vous. Il y a le couple, et il y a l’équipe que vous formez autour de votre enfant. En 2003, le chercheur Mark Feinberg a décrit cette équipe, que l’on appelle la coparentalité. Elle tient sur 4 choses. Vous êtes d’accord sur l’essentiel de l’éducation. Vous vous répartissez les tâches. Vous vous soutenez devant l’enfant au lieu de vous contredire. Et vous réglez ensemble la vie de la famille.',
       'Ces 2 liens ne vont pas toujours au même pas. Une équipe de parents peut rester solide pendant que le couple traverse une période difficile, et même après une séparation. Ce qui la protège, c’est un moment régulier où l’on se parle, et où l’on se parle aussi d’autre chose que de l’organisation.',
       'Si vous élevez votre enfant seul ou seule, la question se pose autrement. Il vous faut une personne avec qui partager les décisions, pour ne pas tout porter dans votre tête. Cette personne peut être un grand-parent, une amie ou un professionnel.'],
     sch:'equipe',
     vecu:['Entre ma femme et moi, la clé, c’est la communication. Nous parlons des sujets, nous échangeons, nous cherchons des solutions ensemble et nous construisons une stratégie.',
       'Nous avons aussi une règle. Nous ne nous contredisons pas devant les enfants, parce qu’il faut aller dans la même direction. Nous en parlons après, entre nous, et nous adaptons ensuite.'],
     ex:'Un soir, un papa refuse la tablette à sa fille, et la maman pense qu’il est trop sévère. Si elle le dit devant leur fille, celle-ci apprend à demander à l’autre parent. La maman ne dit rien sur le moment. Plus tard, quand leur fille dort, ils en parlent. Ils décident ensemble que la tablette sera permise 20 minutes le mercredi. Le lendemain, c’est le papa qui l’annonce.',
     exo:'Cette semaine, prenez 20 minutes avec l’autre parent, ou avec la personne qui compte pour vous, et posez-lui une seule question, « qu’est-ce qui est le plus lourd pour toi en ce moment ? ». Écoutez la réponse jusqu’au bout, sans chercher de solution.',
     obs:'Remarquez ce que l’autre fait déjà et que vous ne voyiez plus.',
     ecr:'Qu’avez-vous entendu que vous ne saviez pas ?',link:'sit_couple'},
    {id:'fratrie',t:'Les frères et sœurs',acc:'Vous verrez ce dont les frères et sœurs ont vraiment besoin, et je vous dirai comment nous partageons notre temps entre nos enfants.',
     idee:['Quand un enfant demande beaucoup, ses frères et sœurs apprennent vite à ne pas en rajouter. Ils deviennent sages et serviables, parfois trop. Ils peuvent ressentir de la jalousie, de la honte devant les copains ou de l’inquiétude, et se sentir coupables de ressentir tout cela.',
       'On croit souvent qu’il faudrait donner exactement la même chose à chacun. Imaginez 3 verres de tailles différentes. Si vous versez la même quantité dans chacun, le petit déborde et le grand reste à moitié vide. Être juste, c’est remplir chaque verre. En 1997, les chercheuses Amanda Kowal et Laurie Kramer ont interrogé 61 enfants de 11 à 13 ans et leurs frères et sœurs. Quand un parent ne les traitait pas de la même façon, les enfants trouvaient cela juste 3 fois sur 4. Ils l’acceptaient quand ils en voyaient la raison, par exemple un besoin de leur frère ou de leur sœur.',
       'Vos enfants n’ont donc pas besoin que tout soit égal. Ils ont besoin de savoir ce qui se passe, avec des mots à leur hauteur, d’avoir le droit de se plaindre, et d’avoir de temps en temps un parent pour eux seuls. Si votre enfant n’a ni frère ni sœur, cette étape peut vous servir pour ses cousins ou pour ses amis proches.'],
     sch:'verres',
     vecu:['Nous passons très souvent du temps tous ensemble, parce que c’est le souhait de nos enfants. Il m’arrive aussi de passer un moment avec l’un à faire des Lego, et avec l’autre à jouer aux jeux vidéo.',
       'Nous essayons d’être équitables. Nous restons surtout à l’écoute, pour savoir si l’un d’eux se sent à part ou manque d’attention, en sachant qu’ils n’ont pas tous le même besoin. Nous leur rappelons que nous les aimons, et nous le leur montrons avec des mots doux et sincères.'],
     ex:'Une maman passe 3 soirs par semaine aux séances de logopédie de son fils cadet. Sa fille aînée lui dit un jour « tu t’occupes toujours de lui ». La maman ne se défend pas. Elle lui explique pourquoi son frère a besoin de ces séances, et elle lui demande ce qui lui manque, à elle. La réponse est simple. Sa fille voudrait qu’elle vienne la chercher à la danse le jeudi. Depuis, le jeudi est à elles 2.',
     exo:'Offrez à chaque frère ou sœur 20 minutes seul avec vous cette semaine, pour une activité qu’il choisit. Pendant ce moment, on ne parle pas de son frère ou de sa sœur, sauf s’il en a envie.',
     obs:'Écoutez comment ils parlent de leur frère ou de leur sœur devant leurs amis.',
     ecr:'Qu’a choisi de faire chaque enfant pendant son moment avec vous ? Qu’avez-vous remarqué ?',link:'sit_fratrie'},
    {id:'entourage',t:'Ma place dans mon entourage',acc:'Vous ferez évoluer un regard autour de vous, sans avoir à militer, et je vous dirai ce que l’on nous a reproché comme parents.',
     idee:['Vous avez changé, et votre regard sur la différence aussi. Autour de vous, il y a des personnes qui n’ont pas fait ce chemin et qui disent parfois des choses maladroites. Une remarque sur votre façon d’éduquer, un conseil que vous n’avez pas demandé ou un silence gêné peuvent faire très mal.',
       'Faire la leçon change rarement un regard. Ce qui le change, c’est la rencontre. En 1954, le psychologue Gordon Allport a proposé cette idée, que l’on appelle l’hypothèse du contact. Les préjugés reculent quand les gens se rencontrent vraiment, et encore mieux quand ils font quelque chose ensemble. En 2006, 2 chercheurs ont rassemblé 515 études sur le sujet. Le plus souvent, elles vont dans ce sens.',
       'Vous n’avez donc pas besoin de militer. Il suffit souvent de montrer votre enfant tel qu’il est, et de laisser l’autre passer un moment avec lui. Vous n’avez pas non plus à convaincre tout le monde. Vos proches méritent une explication. Une connaissance peut se contenter d’une phrase courte. Un inconnu dans la rue n’a droit à rien. Si vous le souhaitez, et quand vous en avez la force, vous pouvez faire évoluer un regard à la fois.'],
     sch:'cercles',
     vecu:['On nous a déjà dit, comme parents, que nous laissions trop de choix à nos enfants, qu’il fallait imposer et être sévères. On nous a dit aussi que nous les écoutions trop.',
       'J’aurais voulu répondre que l’écoute est la base pour construire avec un enfant, et pour qu’il se sente reconnu comme enfant et comme personne. On peut lui faire goûter un plat, mais on n’est pas obligé de le lui faire finir. Il a le droit de ne pas aimer.',
       'Une remarque ne fait pas le même effet à tout le monde. Un jour, un de mes professeurs m’a dit que j’étais au ras des pâquerettes dans une branche, alors que je m’étais donné. J’ai voulu lui démontrer le contraire. J’ai redoublé d’efforts, et ma note est montée très fortement. Cette remarque m’a donné un coup de boost. Elle n’aurait pas eu cet effet sur tout le monde.'],
     ex:'Une grand-mère répète que son petit-fils « finira bien par parler comme tout le monde ». Sa fille a essayé de lui expliquer, sans succès. Un samedi, elle lui confie le garçon pour faire un gâteau. Elle lui montre seulement les 3 images qu’il utilise pour demander quelque chose. Le soir, la grand-mère raconte qu’il lui a demandé du chocolat avec une image, et qu’elle a compris du premier coup. Elle ne dit plus tout à fait la même phrase.',
     exo:'Choisissez une personne de votre entourage et racontez-lui une chose de votre enfant qu’elle ne connaît pas et qui le montre tel qu’il est.',
     obs:'Observez ce qui change dans la façon dont cette personne parle de lui ensuite.',
     ecr:'À qui avez-vous parlé de votre enfant ? Qu’est-ce qui a changé dans sa façon d’en parler ?',link:'sit_regard'},
    {id:'pros',t:'Collaborer avec les professionnels',acc:'Vous préparerez votre prochaine rencontre avec les professionnels en 3 points, et je vous dirai ce qui m’aide, moi, des 2 côtés de la table.',
     idee:['Les professionnels savent des choses que vous ne savez pas, et vous savez des choses qu’ils ne sauront jamais. Ils connaissent des méthodes, et ils ont vu beaucoup d’enfants. Vous, vous connaissez un seul enfant, mais vous le connaissez la nuit, le dimanche et en vacances.',
       'Ce que vous savez porte un nom. En 1976, la sociologue Thomasina Borkman l’a appelé le savoir d’expérience. C’est ce que l’on apprend en vivant une situation de l’intérieur. Vous savez par exemple que votre enfant se calme quand on lui parle doucement, ou qu’il faut le prévenir 2 fois avant de partir. Aucun bilan ne le dit. Cette sociologue a comparé ce savoir au savoir professionnel, comme 2 savoirs de nature différente, qui ont besoin l’un de l’autre.',
       'La collaboration commence quand chacun apporte sa part sans défendre son territoire. Si vous arrivez avec 3 points écrits et des questions simples, et que vous repartez avec des décisions notées, vous devenez un vrai partenaire. Vous n’êtes ni un élève qui écoute, ni un client qui réclame.'],
     sch:'savoirs',
     vecu:['Je suis des 2 côtés de la table. Comme professionnel, ce qui m’aide vraiment, c’est un parent qui apporte ce qu’il connaît le mieux, c’est-à-dire l’histoire de son enfant, son vécu, sa scolarité et ce qui a déjà été essayé. Il décrit aussi son contexte, son éducation et ses croyances.',
       'Comme papa, je demande aux professionnels leur expertise, des pistes et des axes d’intervention. Je leur demande aussi ce qu’ils ont besoin de savoir, et ce qui peut les aider. Pour moi, il s’agit de construire ensemble et d’être partenaires. On se complète pour agir au mieux avec l’enfant, en respectant ses propres besoins.'],
     ex:'Avant un bilan à l’école, un papa écrit ses 3 points. Sa fille lit maintenant seule le soir, et c’est ce qui va bien. Elle pleure le dimanche soir, et c’est ce qui l’inquiète. Il demande qu’on lui dise comment se passent les récréations. Pendant la rencontre, l’enseignante découvre la lecture du soir, et le papa apprend que sa fille reste seule dans la cour. Ils décident ensemble d’un jeu à proposer à 2 camarades. Le papa note la décision, et la date du prochain point.',
     exo:'Préparez votre prochaine rencontre en écrivant 3 points, à savoir ce qui va bien, ce qui vous inquiète et ce que vous demandez.',
     obs:'Pendant la rencontre, remarquez si l’on vous écoute vraiment. Si ce n’est pas le cas, redemandez calmement.',
     ecr:'Écrivez vos 3 points pour la prochaine rencontre, ce qui va bien, ce qui vous inquiète et ce que vous demandez.',link:'sit_pros'}
  ]},
  {m:'La suite',steps:[
    {id:'tenir',t:'Tenir dans la durée',acc:'Vous choisirez vos rituels pour tenir longtemps, comme un coureur prépare ses ravitaillements, et je vous dirai quels sont les miens.',
     idee:['Être parent demande de tenir longtemps, et plus encore quand un enfant a besoin de vous plus que les autres. Or personne ne tient longtemps sans se ravitailler. Un coureur de marathon prévoit ses ravitaillements avant le départ. Il n’attend pas d’être à bout pour s’arrêter à un poste.',
       'À l’Université catholique de Louvain, en Belgique, les psychologues Moïra Mikolajczak et Isabelle Roskam étudient l’épuisement des parents. Dans une étude publiée en 2018, elles ont interrogé 923 parents à 2 reprises. Elles décrivent une balance, avec d’un côté ce qui pèse et de l’autre ce qui recharge. Dans ce qui pèse, vous pouvez mettre les nuits courtes, les rendez-vous, les inquiétudes ou l’envie de tout faire parfaitement. Dans ce qui recharge, vous pouvez mettre un moment à vous, un couple qui se relaie ou un proche qui écoute. D’après leurs résultats, l’épuisement arrive quand la balance penche trop longtemps du côté de ce qui pèse.',
       'Une mauvaise semaine ne suffit donc pas à épuiser un parent. Ce qui compte, c’est le côté où penche votre balance pendant des mois. Vous avez 2 façons d’agir sur elle. Vous pouvez ajouter une recharge, et vous pouvez enlever un poids. Un rituel ajoute une recharge. Un relais enlève un poids pendant quelques heures.',
       'Demander un relais ne veut pas dire abandonner. C’est ce qui vous permettra d’être encore là dans 10 ans. Ce relais peut venir de l’autre parent, d’un proche, d’un voisin ou d’un service. La suite peut très bien exister sans parcours. Ce dont elle a besoin, c’est d’un rythme, avec un moment pour vous chaque semaine, des rencontres préparées, un dépôt quand cela pèse et une dose de lumière quand vous en avez besoin. Choisissez ce que vous voulez garder et laissez le reste.'],
     sch:'ravito',
     vecu:['Je cours régulièrement et j’aime comparer la vie de parent à un marathon. On ne peut pas le courir au sprint et on a besoin de ravitaillements pour tenir.',
       'Mon ravitaillement, c’est la marche. C’est un temps pour moi seul, souvent dans la nature, en forêt. Mais marcher seul peut largement suffire. Le sport est aussi un de mes moyens, la course à pied par exemple.',
       'Chez nous, le relais se fait entre ma femme et moi. Notre organisation est comme cela.'],
     ex:'Une maman fait la liste de ce qui lui pèse et de ce qui la recharge. La première liste a 9 lignes, et la seconde en a 2. Elle choisit alors 3 rituels. Elle marchera 20 minutes le mardi et le jeudi, elle prendra un café avec une amie le samedi matin, et elle gardera une soirée par mois pour lire. Puis elle demande à sa sœur de garder les enfants un dimanche après-midi sur 2. Au bout de 3 semaines, la marche du jeudi a sauté 2 fois. Elle la déplace au mercredi à midi, et les 2 autres rituels tiennent.',
     exo:'Choisissez vos 3 rituels pour les 6 prochains mois et notez-les dans votre agenda. Choisissez aussi une personne ou un service à qui vous demanderez un relais, même pour 2 heures.',
     obs:'Essayez vos rituels pendant une semaine et gardez ceux qui tiennent.',
     ecr:'Écrivez vos 3 rituels pour les 6 prochains mois, et le relais que vous allez demander.',link:'sit_aide'},
    {id:'demain',t:'Préparer l’avenir, pas à pas',acc:'Vous reprendrez la journée dans 10 ans que vous aviez écrite, vous choisirez une première décision, et je vous dirai celle que j’ai prise pour mes enfants.',
     idee:['Reprenez la journée dans 10 ans que vous aviez écrite, et relisez-la. Qu’est-ce qui a déjà avancé, et qu’est-ce qui manque encore ? Entre aujourd’hui et cette journée, il y a de grandes questions. Pour certains parents, ce sont les études, un métier ou le départ de la maison. Pour d’autres, ce sont le logement, les proches qui prendront le relais, ou ce qui se passera quand ils ne seront plus là. Aucune de ces questions ne se règle en une fois. Elles se préparent par petites décisions, une par saison.',
       'Une décision tient mieux quand vous dites à l’avance à quel moment vous ferez le premier geste. « Je vais me renseigner sur les aides » reste une intention. « Jeudi, quand les enfants seront couchés, alors j’écrirai au service social » est déjà un rendez-vous que vous prenez avec vous-même.',
       'Le psychologue Peter Gollwitzer étudie ces phrases depuis les années 1990. Il les appelle des plans « si, alors ». En 2006, avec son collègue Paschal Sheeran, il a réuni les résultats de 94 études. Les personnes qui avaient décidé à l’avance quand, où et comment elles agiraient tenaient nettement mieux leur décision que celles qui avaient seulement une bonne intention.',
       'C’est pour cela que l’exercice de cette semaine est petit. Vous choisissez une seule décision, vous lui donnez une date, et vous dites à quelqu’un que vous l’avez prise. Vous vous entraînez depuis le début du parcours à faire des petits pas, alors continuez sur ce rythme.'],
     sch:'gue',
     vecu:['J’ai pris la décision d’être un père qui écoute, quoi qu’il en soit. J’ai décidé d’essayer de comprendre, et de croire aux rêves de mes enfants, car je pense que tout est possible.',
       'J’ai décidé de rester toujours là pour eux, disponible, et de leur offrir des temps de qualité et de présence. J’ai décidé aussi de leur donner de l’amour, et de faire les choses avec amour, sans rien attendre en retour.'],
     ex:'Un papa relit sa journée dans 10 ans. Il y avait écrit que sa fille prenait le bus toute seule pour aller travailler. Aujourd’hui, elle a 13 ans, et il la conduit partout. Il choisit une seule décision, celle de lui apprendre un premier trajet. Il fixe la date au samedi 14, et il écrit sa phrase. « Samedi, quand nous irons à la bibliothèque, alors nous prendrons le bus ensemble, et c’est elle qui tiendra le plan. » Le soir même, il en parle à sa compagne.',
     exo:'Choisissez une seule décision à prendre dans les 6 prochains mois pour préparer l’avenir, et fixez-lui une date.',
     obs:'Nommez une personne à qui vous en parlerez.',
     ecr:'Quelle décision allez-vous prendre dans les 6 prochains mois pour préparer l’avenir ? À quelle date ?',rap:'avenir',link:'sit_grandir'},
    {id:'bilan',t:'Le bilan du parcours',acc:'Vous poserez votre troisième point, vous verrez votre chemin d’un seul regard, et je vous dirai ce que j’ai compris en devenant père.',
     idee:['Refaites le point une dernière fois et comparez vos 3 moments, le départ, la mi-parcours et aujourd’hui. Ce qui a bougé est à vous. Ce qui n’a pas bougé n’est pas un échec, parce que certaines choses demandent plus de temps ou d’autres appuis. Prenez aussi un moment pour regarder ce que vous avez mis en place, ce qui tient tout seul maintenant et ce qui a encore un peu besoin de vous.',
       'Une partie de vos progrès ne se voit plus, et il y a une raison à cela. Pensez au jour où vous avez appris à rouler à vélo. Vous deviez penser à tout, à l’équilibre, aux pédales et au guidon. Aujourd’hui, vous roulez en regardant le paysage. Vous avez si bien appris que vous ne le remarquez plus.',
       'Les formateurs dessinent cet apprentissage en 4 étapes, que l’on trouve déjà dans un manuel américain de formation publié en 1960. D’abord, vous ne savez pas faire, et vous ne le voyez même pas. Ensuite, vous voyez ce que vous ne savez pas faire, et c’est souvent le moment le plus inconfortable. Puis vous savez faire, à condition d’y penser. Un jour enfin, vous faites sans y penser.',
       'Beaucoup de parents se jugent sévèrement à la deuxième étape, parce qu’ils voient enfin leurs erreurs. Voir ses erreurs est pourtant le signe que l’on avance. Et à la quatrième étape, ils oublient qu’ils ont appris. Le bilan sert à s’en souvenir. Vous avez aujourd’hui des réflexes que vous n’aviez pas en commençant, et ce que vous avez gagné ne se résume pas à des chiffres.'],
     sch:'arche',
     vecu:['Je suis devenu un père qui a évolué. J’ai compris que je n’avais pas toujours agi comme il fallait. Mais c’est à travers ces échecs que j’ai appris à être un meilleur père.',
       'Au début de mon rôle de père, par exemple, je pensais que je devais tout maîtriser. En fait, on ne maîtrise pas grand-chose.'],
     ex:'Une maman relit son carnet de route. Au début du parcours, elle avait écrit qu’elle criait chaque matin au moment de partir à l’école. Elle remarque qu’elle ne crie presque plus, et qu’elle n’y pensait même plus. Elle prépare les habits la veille et elle prévient son fils 2 fois avant de partir, sans avoir besoin de s’en souvenir. Elle écrit ses 3 changements. Une chose résiste encore, ce sont les devoirs du dimanche soir. Elle la note sans se juger, comme son prochain apprentissage.',
     exo:'Faites le point final dans « Mon évolution » et choisissez une dernière photo dans le photolangage. Relisez ensuite votre carnet de route.',
     obs:'Remarquez une situation que vous gérez aujourd’hui sans y penser.',
     ecr:'Écrivez 3 choses qui ont changé, et une qui résiste encore.',rap:'mi',link:['evo','photo']},
    {id:'chemin',t:'Le chemin parcouru',acc:'Vous écrirez une lettre à la personne que vous étiez en commençant, et je vous dirai ce que je vois quand je repense à l’enfant que j’étais.',
     idee:['Vous voilà au bout des 24 étapes, avec un enfant qui n’a pas attendu que vous ayez fini pour grandir. Vous avez regardé où vous en étiez, appris à nommer vos émotions et trouvé vos appuis. Vous avez changé une partie de votre regard, vu les forces de votre enfant, préparé vos rencontres et choisi vos rituels.',
       'Vous n’êtes pas pour autant un parent parfait, et personne ne l’est. Donald Winnicott était pédiatre et psychanalyste à Londres. En 1953, il a parlé pour la première fois de la mère « suffisamment bonne ». Elle répond aux besoins de son enfant la plupart du temps, et elle se trompe parfois. Pour lui, un enfant n’a pas besoin d’une mère parfaite. Ces petits ratés l’aident même à grandir, parce qu’ils lui apprennent peu à peu que le monde ne répond pas toujours tout de suite. On le dit aujourd’hui de tous les parents.',
       'Vous êtes un parent plus éclairé qu’au premier jour. C’est vous qui avez fait ce chemin, et vous pouvez en être fier ou fière. Pour le voir en entier, il vous reste un geste, celui d’écrire. À partir de 1986, le psychologue James Pennebaker a étudié ce qui se passe quand une personne écrit ce qu’elle a traversé. En 2006, la chercheuse Joanne Frattaroli a réuni 146 études sur ce sujet. L’effet qu’elle a mesuré est petit, mais il est réel, et écrire ne coûte rien.',
       'La lettre de cette semaine s’adresse à la personne que vous étiez en commençant. Elle ne savait pas encore ce que vous savez. Dites-lui ce que vous auriez aimé entendre ce jour-là.'],
     sch:'sentier',
     vecu:['À l’étape 8, je vous ai dit que j’avais vécu des choses très dures jusqu’à mes 10 ans. Quand je repense à l’enfant que j’étais, je vois un enfant meurtri. Mais j’avais l’espérance, et la croyance que je pouvais m’en sortir.',
       'Je voyais le bien là où il y avait le mal, et c’est difficile à expliquer. Je croyais à l’impossible, même avec mes doutes et mes souffrances. Je voyais la sortie du tunnel.'],
     ex:'Un papa écrit sa lettre un dimanche soir. « Tu crois que tu fais tout de travers. Tu ne dors plus, et tu n’oses le dire à personne. Dans 6 mois, tu sauras demander de l’aide, et ton fils te racontera sa journée dans la voiture. Tu ne seras pas devenu parfait. Tu seras là, et c’est ce dont il a besoin. » Il plie la lettre et il la range dans son portefeuille.',
     exo:'Cette semaine, l’exercice est d’écrire une lettre à la personne que vous étiez en commençant ce parcours. Vous pouvez l’écrire dans votre carnet, plus bas.',
     obs:'Gardez cette lettre et relisez-la un jour où tout vous paraît gris.',
     ecr:'Écrivez à la personne que vous étiez en commençant ce parcours, et dites-lui ce que vous savez maintenant.',rap:'depart',
     mot:'Malgré tout, je voyais la vie belle. La vie est un cadeau.'}
  ]}
];
/* L'ordre d'avant le 16 novembre 2026 : à la place n se trouvait l'étape qui porte aujourd'hui ce nom.
   Sert une seule fois, à ranger sous leur nom les étapes déjà faites par un parent venu avant. */
const PARCOURS_AVANT=['depart','croire','croyances','objectifs','regard','enfant','place','avenir','emotions','reguler','appuis','mi','enfant','talents','encourager','solutions','place','pros','entourage',null,'bilan','tenir','demain','chemin'];
/* Une étape s'ouvre sept jours après que la précédente a été ouverte : une semaine pour essayer, et jamais de retard qui s'accumule. */
const PAS_JOURS=7;

/* ---------- Les schémas du parcours ----------
   Un schéma se construit morceau par morceau, à la demande (« Voir la suite »). vb : le cadre du dessin ;
   alt : ce que le dessin montre, pour les lecteurs d'écran ; base : ce qui est toujours là ;
   l : les morceaux, dans l'ordre où ils sont dessinés, chacun avec le numéro du moment où il apparaît ;
   caps : une phrase par moment. Les mots du dessin restent très courts, la phrase complète est dessous.
   rep : le repère, pour les schémas qui ont une courbe. C'est un petit point clair qui suit la courbe d'un moment au suivant,
   chaque fois que le parent appuie sur « Voir la suite ». d : la courbe suivie ; f : la place du repère à chaque moment, de 0 (le début
   de la courbe) à 1 (la fin) ; p : le même endroit en coordonnées, pour le dessin immobile ; tr : jusqu'où le trait plein est dessiné
   à chaque moment (sans tr, le trait suit le repère). Un morceau marqué « tot » apparaît dès l'appui, sans attendre l'arrivée du repère.
   Les places ont été calculées par le navigateur (build/goutte/fractions.js), et tests/parcours.js vérifie que p et f disent la même chose. */
const sFleche=k=>'<defs><marker id="fl-'+k+'" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="s-tete" d="M2 1.5 L8 5 L2 8.5"/></marker><marker id="flr-'+k+'" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="s-tete rose" d="M2 1.5 L8 5 L2 8.5"/></marker></defs>';
const sBulle=(cx,cy,w,lignes,cls,num,haut)=>{const h=haut||(lignes.length>1?46:36),x=cx-w/2,y=cy-h/2,dx=num?11:0;
  return '<rect class="s-bulle'+(cls?' '+cls:'')+'" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(h>40?16:18)+'"/>'+
    (num?'<circle class="s-num" cx="'+(x+19)+'" cy="'+cy+'" r="10.5"/><text class="s-numt" x="'+(x+19)+'" y="'+(cy+4.6)+'" text-anchor="middle">'+num+'</text>':'')+
    lignes.map((l,i)=>'<text class="s-t" x="'+(cx+dx)+'" y="'+(cy+4.6+(i-(lignes.length-1)/2)*16)+'" text-anchor="middle">'+l+'</text>').join('');};
const sTrait=(d,k,cls)=>'<path class="s-a'+(cls?' '+cls:'')+'" d="'+d+'" marker-end="url(#fl'+(cls==='rose'?'r':'')+'-'+k+')"/>';
/* Un repère numéroté posé sur une courbe : le même chiffre que la phrase qui l'explique. */
const sPoint=(cx,cy,n)=>'<circle class="s-halo" cx="'+cx+'" cy="'+cy+'" r="17"/><circle class="s-num" cx="'+cx+'" cy="'+cy+'" r="11"/><text class="s-numt" x="'+cx+'" y="'+(cy+4.4)+'" text-anchor="middle">'+n+'</text>';
const sPied=(x,a,b)=>'<rect class="s-marche" x="'+x+'" y="58" width="72" height="118"/><text class="s-t" x="'+(x+36)+'" y="113" text-anchor="middle">'+a+'</text><text class="s-t" x="'+(x+36)+'" y="129" text-anchor="middle">'+b+'</text>';
/* Un chiffre seul, sans halo, pour numéroter une zone ou une case. */
const sNum=(cx,cy,n)=>'<circle class="s-num" cx="'+cx+'" cy="'+cy+'" r="10.5"/><text class="s-numt" x="'+cx+'" y="'+(cy+4.4)+'" text-anchor="middle">'+n+'</text>';
/* Un groupe (un rond) et ses membres (des points). Le point « lui » est l'enfant dont on parle. */
const sRond=(cx,cy,r,cls)=>'<circle class="s-groupe'+(cls?' '+cls:'')+'" cx="'+cx+'" cy="'+cy+'" r="'+r+'"/>';
const sPts=(L,cls)=>L.map(p=>'<circle class="s-pt'+(cls?' '+cls:'')+'" cx="'+p[0]+'" cy="'+p[1]+'" r="5"/>').join('');
/* Les mêmes points, posés sur la courbe que suit le repère : chacun attend que le repère soit passé (p[2] est sa place sur la courbe, de 0 à 1). */
const sPtsF=(L,cls)=>L.map(p=>'<circle class="s-pt s-f'+(cls?' '+cls:'')+'" data-f="'+p[2]+'" cx="'+p[0]+'" cy="'+p[1]+'" r="5"/>').join('');
const SCHEMAS={
  points:{vb:'0 0 340 200',
    alt:'Un chemin qui monte, avec 3 points. Le premier est posé aujourd’hui, le deuxième au milieu du parcours et le troisième à la fin. Une ligne relie les 3 points.',
    rep:{d:'M30 152 C 95 152, 105 98, 170 98 S 250 44, 310 44',f:[0,.5003,1,1],p:[[30,152],[170,98],[310,44],[310,44]],tr:[0,0,0,0]},
    base:'<path class="s-route" d="M30 152 C 95 152, 105 98, 170 98 S 250 44, 310 44"/>',
    l:[[4,'<path class="s-trace" pathLength="1" d="M30 152 C 95 152, 105 98, 170 98 S 250 44, 310 44"/>'],
       [1,'<circle class="s-halo" cx="30" cy="152" r="16"/><circle class="s-point" cx="30" cy="152" r="9"/><text class="s-t" x="16" y="186" text-anchor="start">Aujourd’hui</text>'],
       [2,'<circle class="s-halo" cx="170" cy="98" r="16"/><circle class="s-point" cx="170" cy="98" r="9"/><text class="s-t" x="170" y="132" text-anchor="middle">Au milieu</text>'],
       [3,'<circle class="s-halo" cx="310" cy="44" r="16"/><circle class="s-point" cx="310" cy="44" r="9"/><text class="s-t" x="324" y="20" text-anchor="end">À la fin</text>']],
    caps:['Aujourd’hui, vous posez votre premier point.','Au milieu du parcours, vous en posez un deuxième.','À la fin, vous posez le troisième.','C’est en reliant ces 3 points que vous verrez votre chemin.']},
  boucle:{vb:'0 0 340 300',
    alt:'Une boucle en 4 moments. Je crois en lui, alors je lui laisse du temps, alors il ose essayer, alors je vois ses essais, et j’y crois encore plus. Une flèche ramène du dernier moment au premier.',
    base:sFleche('boucle'),
    l:[[1,sBulle(160,36,214,['Je crois en lui'],'',1)],
       [2,sTrait('M160 57 L160 85','boucle')+sBulle(160,108,214,['Je lui laisse du temps'],'',2)],
       [3,sTrait('M160 129 L160 157','boucle')+sBulle(160,180,214,['Il ose essayer'],'',3)],
       [4,sTrait('M160 201 L160 229','boucle')+sBulle(160,252,214,['Je vois ses essais'],'',4)],
       [5,'<path class="s-a s-retour" pathLength="1" d="M267 252 C 330 252, 330 36, 271 36"/><path class="s-tete s-fin" d="M280 30 L271 36 L280 42"/>']],
    caps:['Je crois qu’il peut y arriver.','Alors je l’encourage et je lui laisse du temps.','Il le sent, et il ose essayer plus longtemps.','Je vois ses essais, et j’y crois encore plus.','La boucle est lancée. Elle tourne aussi dans l’autre sens, quand on cesse d’y croire.']},
  chemins:{vb:'0 0 340 300',
    alt:'Un même fait, il lui faut 20 minutes pour s’habiller, et 2 chemins. À gauche, je me dis qu’il est lent, je fais à sa place et il ne s’exerce plus. À droite, je me dis qu’il apprend à son rythme, je commence plus tôt et il s’exerce chaque matin.',
    base:sFleche('chemins'),
    l:[[1,sBulle(170,28,250,['20 minutes pour s’habiller'],'fait')],
       [4,'<rect class="s-anneau" x="39" y="4" width="262" height="48" rx="24"/>'],
       [2,sTrait('M150 48 C 150 66, 88 62, 88 80','chemins','rose')+sBulle(88,108,156,['« Il est lent »'],'rose',0,46)+sTrait('M88 133 L88 147','chemins','rose')+sBulle(88,174,156,['Je fais','à sa place'],'rose')+sTrait('M88 199 L88 213','chemins','rose')+sBulle(88,240,156,['Il ne s’exerce','plus'],'rose')+'<path class="s-bout" d="M66 280 L110 280"/><path class="s-a rose nu" d="M88 265 L88 278"/>'],
       [3,sTrait('M190 48 C 190 66, 252 62, 252 80','chemins')+sBulle(252,108,156,['« Il apprend','à son rythme »'],'vert')+sTrait('M252 133 L252 147','chemins')+sBulle(252,174,156,['Je commence','plus tôt'],'vert')+sTrait('M252 199 L252 213','chemins')+sBulle(252,240,156,['Il s’exerce','chaque matin'],'vert')+sTrait('M252 265 L252 290','chemins')]],
    caps:['Voici un fait. Il lui faut 20 minutes pour s’habiller.','Si je me dis « il est lent », je fais à sa place, et il ne s’exerce plus.','Si je me dis « il apprend à son rythme », je commence plus tôt, et il s’exerce chaque matin.','Le fait est le même. C’est la phrase que je choisis qui décide du chemin.']},
  marches:{vb:'0 0 340 240',
    alt:'Un escalier de 4 marches qui mène à un drapeau. La première marche est un souhait. Les suivantes disent quoi exactement, quand, et avec l’aide de qui. En haut, le souhait est devenu un objectif.',
    base:'<path class="s-sol" d="M8 214 L332 214"/>',
    l:[[1,'<rect class="s-marche" x="14" y="178" width="78" height="36"/><text class="s-t" x="53" y="201" text-anchor="middle">un souhait</text>'],
       [2,'<rect class="s-marche" x="92" y="142" width="78" height="72"/><text class="s-t" x="131" y="165" text-anchor="middle">quoi ?</text>'],
       [3,'<rect class="s-marche" x="170" y="106" width="78" height="108"/><text class="s-t" x="209" y="129" text-anchor="middle">quand ?</text>'],
       [4,'<rect class="s-marche" x="248" y="70" width="78" height="144"/><text class="s-t" x="287" y="93" text-anchor="middle">avec qui ?</text>'],
       [5,'<path class="s-mat" d="M300 70 L300 18"/><path class="s-drapeau" d="M300 18 L270 29 L300 40 Z"/><text class="s-t fort" x="262" y="34" text-anchor="end">un objectif</text>']],
    caps:['Au départ, il y a un souhait. Je voudrais souffler.','Je dis quoi exactement. Je veux marcher 20 minutes.','Je dis quand. Ce sera jeudi soir.','Je dis avec l’aide de qui. Ma sœur gardera les enfants.','Mon souhait est devenu un objectif que je peux tenir.']}
  ,voyants:{vb:'0 0 340 290',
    alt:'4 voyants et leur message. La colère signale qu’une limite est dépassée, la tristesse que l’on a perdu quelque chose, la peur que l’on tient à quelqu’un, et l’épuisement que l’on donne sans recharger.',
    base:sFleche('voyants'),
    l:[[1,sBulle(84,36,148,['Colère'],'',1)+sTrait('M160 36 L173 36','voyants')+sBulle(254,36,152,['une limite','est dépassée'],'vert')],
       [2,sBulle(84,108,148,['Tristesse'],'',2)+sTrait('M160 108 L173 108','voyants')+sBulle(254,108,152,['j’ai perdu','quelque chose'],'vert')],
       [3,sBulle(84,180,148,['Peur'],'',3)+sTrait('M160 180 L173 180','voyants')+sBulle(254,180,152,['je tiens','à quelqu’un'],'vert')],
       [4,sBulle(84,252,148,['Épuisement'],'',4)+sTrait('M160 252 L173 252','voyants')+sBulle(254,252,152,['je donne','sans recharger'],'vert')],
       [5,'<rect class="s-anneau" x="172" y="6" width="164" height="276" rx="26"/>']],
    caps:['La colère vous dit qu’une limite a été dépassée, ou que quelque chose est injuste.','La tristesse vous dit que vous avez perdu quelque chose qui comptait.','La peur vous dit que vous tenez à quelqu’un.','L’épuisement vous dit que vous donnez plus que vous ne rechargez.','Aucun de ces voyants n’est une faute. Lisez le message, puis occupez-vous de ce qu’il signale.']},
  colonnes:{vb:'0 0 340 292',
    alt:'Une feuille partagée en 2 colonnes. À gauche, ce qui dépendait de moi, avec une ligne, j’ai crié ce matin, qui mène à je répare. À droite, ce qui ne dépendait pas de moi, avec sa nuit agitée et ma fatigue, qui mène à je dépose.',
    base:sFleche('colonnes'),
    l:[[1,sBulle(170,24,190,['« Je m’en veux »'],'fait')],
       [2,'<rect class="s-feuille" x="12" y="56" width="316" height="170" rx="14"/><path class="s-pli" d="M170 64 L170 218"/><text class="s-t fort" x="91" y="80" text-anchor="middle">Cela dépendait</text><text class="s-t fort" x="91" y="96" text-anchor="middle">de moi</text><text class="s-t fort" x="249" y="80" text-anchor="middle">Cela ne dépendait</text><text class="s-t fort" x="249" y="96" text-anchor="middle">pas de moi</text>'],
       [3,sBulle(91,150,134,['J’ai crié','ce matin'])],
       [4,sBulle(249,134,134,['Sa nuit agitée'])+sBulle(249,178,134,['Ma fatigue'])],
       [5,sTrait('M91 228 L91 244','colonnes')+sBulle(91,266,134,['Je répare'],'vert')],
       [6,sTrait('M249 228 L249 244','colonnes')+sBulle(249,266,134,['Je dépose'],'vert')]],
    caps:['Au départ, tout est mélangé dans une seule phrase, « je m’en veux ».','Je prends une feuille et je trace 2 colonnes.','À gauche, j’écris ce qui dépendait de moi. J’ai crié ce matin.','À droite, j’écris ce qui n’en dépendait pas, comme sa nuit agitée et ma fatigue.','La colonne de gauche se répare, par un mot ou par un geste.','La colonne de droite se dépose. Je n’ai rien cassé, je n’ai donc rien à réparer.']},
  vague:{vb:'0 0 340 214',
    alt:'Une vague qui monte puis redescend, avec 5 repères. L’émotion monte, elle atteint son sommet, je fais mon geste, elle redescend, et je parle une fois en bas.',
    rep:{d:'M20 176 C 90 176, 110 44, 170 44 S 250 176, 320 176',f:[.2577,.5,.6438,.7422,1],p:[[98.8,109.9],[170,44],[218.2,75.8],[241.2,109.9],[320,176]]},
    base:sFleche('vague')+'<path class="s-sol" d="M12 186 L328 186"/><path class="s-route" d="M20 176 C 90 176, 110 44, 170 44 S 250 176, 320 176"/>',
    l:[[1,sPoint(99,110,1)],
       [2,sPoint(170,44,2)+'<text class="s-t" x="170" y="19" text-anchor="middle">Le sommet</text>'],
       [3,sTrait('M244 68 L230 77','vague')+sBulle(276,48,118,['Mon geste'],'vert',3)],
       [4,sPoint(241,110,4)],
       [5,sPoint(320,176,5)+'<text class="s-t" x="330" y="207" text-anchor="end">Je parle</text>']],
    caps:['Une émotion forte monte comme une vague. Le cœur bat plus vite et la voix se durcit.','Au sommet, la tête réfléchit mal. Ce n’est le moment ni de parler ni de décider.','C’est le moment de faire mon geste. J’expire lentement, je sors un instant ou je marche.','La vague redescend d’elle-même, parce que je ne l’ai pas nourrie.','Une fois en bas, je peux parler et décider calmement.']},
  appuis:{vb:'0 0 340 190',
    alt:'Une table posée sur 4 pieds. Le plateau, c’est moi. Les 4 pieds sont une personne, un lieu, une activité et une phrase.',
    base:'<path class="s-sol" d="M8 176 L332 176"/>'+sBulle(170,40,320,['Moi'],'fait',0,36),
    l:[[1,sPied(14,'une','personne')],
       [2,sPied(94,'un','lieu')],
       [3,sPied(174,'une','activité')],
       [4,sPied(254,'une','phrase')],
       [5,'<rect class="s-anneau" x="5" y="17" width="330" height="46" rx="23"/>']],
    caps:['Le premier appui est une personne qui vous écoute sans vous juger.','Le deuxième est un lieu qui vous apaise, même tout près de chez vous.','Le troisième est une activité qui vous recharge.','Le quatrième est une phrase qui vous tient debout.','Posé sur ces 4 appuis, vous tenez quand la vie secoue.']},
  mdh:{vb:'0 0 340 282',
    alt:'Le schéma du MDH-PPH. Qui est l’enfant et ce qui l’entoure se rencontrent, et cette rencontre décide de ce qu’il fait chaque jour. Avec un obstacle, il est en situation de handicap. Avec une aide, il participe.',
    base:sFleche('mdh'),
    l:[[1,sBulle(88,28,156,['Qui il est'],'',1)],
       [2,sBulle(252,28,156,['Ce qui l’entoure'],'',2)],
       [3,sTrait('M88 48 C 88 68, 140 62, 140 82','mdh')+sTrait('M252 48 C 252 68, 200 62, 200 82','mdh')+sBulle(170,104,232,['Ce qu’il fait chaque jour'],'fait',3)],
       [4,sTrait('M140 124 C 140 142, 88 138, 88 156','mdh','rose')+sBulle(88,178,156,['Un obstacle'],'rose')+sTrait('M88 198 L88 220','mdh','rose')+sBulle(88,248,156,['Situation','de handicap'],'rose')],
       [5,sTrait('M200 124 C 200 142, 252 138, 252 156','mdh')+sBulle(252,178,156,['Une aide'],'vert')+sTrait('M252 198 L252 220','mdh')+sBulle(252,248,156,['Il participe'],'vert',0,46)]],
    caps:['Il y a d’abord votre enfant, avec son corps, ses capacités, son caractère et son histoire. Le modèle appelle cela les facteurs personnels.','Il y a ensuite ce qui l’entoure, c’est-à-dire les personnes, les lieux, le matériel et les règles. Ce sont les facteurs environnementaux.','La rencontre des 2 décide de ce qu’il arrive à faire chaque jour, comme manger, apprendre ou jouer. Le modèle parle des habitudes de vie.','Quand ce qui l’entoure lui fait obstacle, il ne peut pas faire ce que fait d’habitude un enfant de son âge. Il est alors en situation de handicap.','Quand ce qui l’entoure l’aide, il y arrive. Le modèle appelle cette aide un facilitateur, et il parle alors de participation sociale.']}
  ,projecteur:{vb:'0 0 340 250',
    alt:'Un projecteur éclaire d’abord seulement les difficultés d’un enfant. Son humour, ses goûts, ses talents et ses peurs restent dans l’ombre. Puis la lumière s’élargit, et l’on voit l’enfant en entier.',
    base:'',
    l:[[4,'<rect class="s-lueur" x="6" y="64" width="328" height="176" rx="28"/>'],
       [2,'<path class="s-cone" d="M170 44 L130 136 L210 136 Z"/>'],
       [1,sBulle(170,26,190,['Mon enfant'],'fait',1,36)],
       [2,sBulle(170,152,164,['Ses difficultés'],'rose',2)],
       [3,[[76,92],[264,92],[76,212],[264,212]].map(c=>'<rect class="s-bulle ombre" x="'+(c[0]-62)+'" y="'+(c[1]-18)+'" width="124" height="36" rx="18"/>').join('')],
       [4,[[76,92],[264,92],[76,212],[264,212]].map(c=>'<rect class="s-bulle vert" x="'+(c[0]-62)+'" y="'+(c[1]-18)+'" width="124" height="36" rx="18"/>').join('')],
       [3,[[76,92,'Son humour'],[264,92,'Ses goûts'],[76,212,'Ses talents'],[264,212,'Ses peurs']].map(c=>'<text class="s-t" x="'+c[0]+'" y="'+(c[1]+4.6)+'" text-anchor="middle">'+c[2]+'</text>').join('')],
       [5,'<rect class="s-anneau" x="6" y="64" width="328" height="176" rx="28"/>']],
    caps:['Votre enfant est une personne entière, avec bien plus de facettes que l’on n’en voit au premier regard.','Un diagnostic ou une étiquette agit comme un projecteur. Il éclaire les difficultés, et elles prennent toute la place.','Le reste n’a pas disparu pour autant. Son humour, ses goûts, ses talents et ses peurs sont toujours là, dans l’ombre.','Regarder d’abord qui il est, c’est élargir la lumière. Tout ce qui était dans l’ombre réapparaît.','Ses difficultés sont toujours là, à leur vraie place. Elles sont une partie de lui, parmi beaucoup d’autres.']}
  ,cap:{vb:'0 0 340 214',
    alt:'Une route part d’aujourd’hui et monte vers une image posée au loin. Au milieu, un nuage de flou cache la route. On y nomme sa peur, puis on fait un premier petit pas.',
    rep:{d:'M30 156 C 120 156, 160 84, 304 84',f:[0,0,0,0,.159],p:[[30,156],[30,156],[30,156],[30,156],[74.9,149.8]]},
    base:'<path class="s-route" d="M30 156 C 120 156, 160 84, 304 84"/>',
    l:[[2,'<path class="s-brume" d="M118 158 C 90 158, 88 128, 112 124 C 110 100, 144 88, 162 104 C 176 82, 220 86, 224 112 C 252 110, 260 150, 234 158 Z"/><text class="s-t" x="172" y="76" text-anchor="middle">Le flou</text>'],
       [1,sPoint(30,156,1)+'<text class="s-t" x="12" y="128" text-anchor="start">Aujourd’hui</text>'],
       [3,sPoint(304,84,3)+sBulle(258,40,140,['Mon image'],'vert')],
       [4,sBulle(172,131,120,['Ma peur'],'rose',4)],
       [5,sPoint(75,150,5)+sBulle(139,190,130,['Un petit pas'],'vert')]],
    caps:['Vous êtes ici, aujourd’hui, avec votre enfant tel qu’il est.','Devant vous, l’avenir est flou. Dans le flou, la peur imagine souvent le pire.','Vous posez une image au loin. C’est une journée de votre enfant dans 10 ans, belle et possible.','Vous nommez ce qui vous fait peur entre aujourd’hui et cette image. Une peur qui a un nom prend moins de place.','Vous choisissez un petit pas pour cette semaine. La route se fait un pas après l’autre.']}
  ,creux:{vb:'0 0 340 222',
    alt:'Une courbe en forme de vallée. L’élan est haut au départ, il baisse vers la moitié du chemin, et il remonte à l’approche du but. Dans le creux, on se retourne pour mesurer le chemin fait, puis on se donne un but tout proche.',
    rep:{d:'M20 56 C 90 56, 110 160, 170 160 S 250 56, 320 56',f:[0,.5,.5,.5,.6622],p:[[20,56],[170,160],[170,160],[170,160],[221.9,130.9]]},
    base:sFleche('creux')+'<path class="s-sol" d="M12 198 L328 198"/><path class="s-route" d="M20 56 C 90 56, 110 160, 170 160 S 250 56, 320 56"/>',
    l:[[1,sPoint(20,56,1)+'<text class="s-t" x="4" y="28" text-anchor="start">Le départ</text>'],
       [2,sPoint(170,160,2)+'<text class="s-t" x="170" y="132" text-anchor="middle">Le creux</text>'],
       [3,sPoint(320,56,3)+'<text class="s-t" x="336" y="28" text-anchor="end">Le but</text>'],
       [4,sTrait('M90 51 L46 55','creux')+sBulle(170,50,152,['Je me retourne'],'vert',4)],
       [5,sPoint(222,131,5)+sBulle(266,174,136,['Un but tout proche'],'vert')]],
    caps:['Au départ, l’élan est là. Chaque pas se voit, parce que tout est nouveau.','Vers la moitié arrive souvent un creux. Le départ est loin, l’arrivée aussi, et l’on croit ne plus avancer.','À l’approche du but, l’élan revient.','Dans le creux, ce qui aide est de se retourner et de mesurer le chemin déjà fait.','Puis on se donne un but tout proche, et chaque pas recommence à compter.']}
  ,iceberg:{vb:'0 0 340 262',
    alt:'Un iceberg. La petite partie au-dessus de l’eau est ce qui se voit. La grande partie sous l’eau contient la persévérance, l’humour, la gentillesse et la curiosité. Une bulle, je nomme ce que je vois, pointe vers la persévérance, qui est alors entourée.',
    base:sFleche('iceberg')+'<path class="s-sol" d="M8 76 L332 76"/>',
    l:[[2,'<path class="s-glace bas" d="M44 76 L300 76 L264 232 L152 250 L74 214 Z"/>'],
       [1,'<path class="s-glace" d="M142 76 L170 24 L198 76 Z"/><text class="s-t" x="208" y="50" text-anchor="start">Ce qui se voit</text>'],
       [2,'<text class="s-t" x="172" y="102" text-anchor="middle">Ce qui ne se voit pas</text><text class="s-t" x="172" y="118" text-anchor="middle">tout de suite</text>'],
       [3,[[126,160,'la persévérance'],[238,160,'l’humour'],[128,198,'la gentillesse'],[226,198,'la curiosité']].map(c=>'<text class="s-t fort" x="'+c[0]+'" y="'+c[1]+'" text-anchor="middle">'+c[2]+'</text>').join('')],
       [4,sTrait('M70 62 C 70 100, 78 124, 90 140','iceberg')+sBulle(68,38,124,['Je nomme','ce que je vois'],'vert')],
       [5,'<rect class="s-anneau" x="62" y="141" width="128" height="30" rx="15"/>']],
    caps:['Au-dessus de l’eau, il y a ce que tout le monde voit, comme les notes, le dessin ou le sport.','Sous l’eau se trouve la plus grande partie, celle que l’on ne voit pas tout de suite.','On y trouve la persévérance, l’humour, la gentillesse ou la curiosité. Ce sont des forces de caractère.','Votre regard peut aller les chercher. Vous nommez ce que vous avez vu, avec un exemple précis.','Une force que l’on a nommée ne reste plus cachée. Votre enfant sait maintenant qu’elle est à lui.']}
  ,zones:{vb:'0 0 340 236',
    alt:'3 zones emboîtées. Au centre, ce que l’enfant fait seul. Tout au bord, ce qu’il ne peut pas encore faire. Entre les 2, ce qu’il réussit avec un coup de pouce, comme un indice ou un outil. Cette zone du milieu est entourée, parce que c’est là qu’il apprend.',
    base:'',
    l:[[2,'<rect class="s-zone" x="6" y="8" width="328" height="220" rx="26"/>'+sNum(118,30,2)+'<text class="s-t" x="176" y="34.6" text-anchor="middle">Pas encore</text>'],
       [3,'<rect class="s-zone proche" x="34" y="48" width="272" height="156" rx="24"/>'+sNum(80,70,3)+'<text class="s-t" x="180" y="74.6" text-anchor="middle">Avec un coup de pouce</text>'],
       [5,'<rect class="s-anneau" x="30" y="44" width="280" height="164" rx="27"/>'],
       [1,sBulle(170,166,184,['Il y arrive seul'],'fait',1)],
       [4,sBulle(170,116,216,['Un indice, un outil'],'vert',4)]],
    caps:['Au centre, il y a ce que votre enfant fait déjà seul. Il n’a plus besoin de vous pour cela.','Tout au bord, il y a ce qu’il ne peut pas encore faire, même avec de l’aide. Le lui demander maintenant le découragerait.','Entre les 2 se trouve ce qu’il réussit avec un coup de pouce. C’est dans cette zone qu’il apprend.','Votre aide est un échafaudage. Vous donnez un indice, vous montrez autrement ou vous proposez un outil.','Puis vous retirez l’aide. Ce qu’il fait avec vous aujourd’hui, il le fera seul demain.']}
  ,roue:{vb:'0 0 340 250',
    alt:'Une roue en 4 temps, reliés par des flèches. Je choisis, j’essaie pendant 7 jours, je note, je décide. Une dernière flèche ramène au début, et la roue repart.',
    base:sFleche('roue'),
    l:[[1,sBulle(170,30,144,['Je choisis'],'',1)],
       [2,sTrait('M244 36 C 268 44, 278 72, 274 102','roue')+sBulle(266,125,132,['J’essaie'],'',2)+'<text class="s-t fort" x="170" y="129.6" text-anchor="middle">7 jours</text>'],
       [3,sTrait('M274 148 C 278 180, 268 206, 246 214','roue')+sBulle(170,220,144,['Je note'],'',3)],
       [4,sTrait('M96 214 C 72 206, 62 180, 66 148','roue')+sBulle(74,125,132,['Je décide'],'',4)],
       [5,sTrait('M66 102 C 62 72, 72 44, 96 36','roue')]],
    caps:['Je choisis une seule difficulté du quotidien, et une seule piste pour l’améliorer.','J’essaie cette piste pendant 7 jours, sans rien changer d’autre.','Chaque soir, je note si c’était mieux, pareil ou moins bien.','Au bout de 7 jours, je décide. Je garde la piste, ou j’en change.','Puis la roue repart. Si la première piste n’a pas marché, j’ai appris quelque chose et j’essaie la suivante.']}
  ,inclusion:{vb:'0 0 340 262',
    alt:'4 dessins. Dans le premier, un point reste en dehors du groupe. Dans le deuxième, il est dans un petit groupe à part. Dans le troisième, il est dans le groupe, mais enfermé dans son propre cercle. Dans le quatrième, il est mêlé aux autres, et ce dessin est entouré.',
    base:'',
    l:[[1,sNum(20,18,1)+sRond(74,58,34)+sPts([[60,46],[84,42],[56,66],[76,60],[92,64],[72,80]])+sPts([[134,58]],'lui')+'<text class="s-t" x="88" y="118" text-anchor="middle">Exclusion</text>'],
       [2,sNum(184,18,2)+sRond(232,58,32)+sPts([[218,46],[242,42],[214,66],[234,60],[250,64],[230,80]])+sRond(297,58,18,'part')+sPts([[291,54],[303,63]],'lui')+'<text class="s-t" x="252" y="118" text-anchor="middle">Ségrégation</text>'],
       [3,sNum(20,144,3)+sRond(88,184,34)+sPts([[72,170],[96,166],[66,190],[84,206],[108,176]])+sRond(100,192,11,'part')+sPts([[100,192]],'lui')+'<text class="s-t" x="88" y="244" text-anchor="middle">Intégration</text>'],
       [5,'<rect class="s-anneau" x="202" y="136" width="112" height="120" rx="22"/>'],
       [4,sNum(184,144,4)+sRond(252,184,34)+sPts([[236,170],[260,166],[230,190],[248,206],[272,176],[268,198]])+sPts([[252,186]],'lui')+'<text class="s-t" x="252" y="244" text-anchor="middle">Inclusion</text>']],
    caps:['Dans l’exclusion, l’enfant reste dehors. Le groupe se fait sans lui.','Dans la ségrégation, il a une place, mais à part, avec ceux qui lui ressemblent.','Dans l’intégration, il est parmi les autres, mais c’est à lui seul de s’adapter.','Dans l’inclusion, le groupe s’organise pour que chacun y ait sa place, lui compris.','C’est cette place que l’on prépare, un lieu à la fois, avec une personne, une adaptation ou une habitude.']}
  ,equipe:{vb:'0 0 340 232',
    alt:'Un schéma en 3 étages. En bas, moi et l’autre parent. Au milieu, notre équipe, vers laquelle montent 2 flèches. En haut, notre enfant, vers qui monte une seule flèche qui part de l’équipe.',
    base:sFleche('equipe'),
    l:[[1,sBulle(64,198,112,['Moi'],'',1)],
       [2,sBulle(258,198,148,['L’autre parent'],'',2)],
       [3,sBulle(170,30,164,['Notre enfant'],'vert',3)],
       [4,sTrait('M64 178 C 64 150, 96 140, 112 134','equipe')+sTrait('M258 178 C 258 150, 244 140, 228 134','equipe')+sBulle(170,118,164,['Notre équipe'],'fait',4)],
       [5,'<rect class="s-anneau" x="84" y="96" width="172" height="44" rx="22"/>'+sTrait('M170 94 L170 54','equipe')]],
    caps:['Il y a vous, avec votre façon de voir et votre fatigue.','Il y a l’autre parent, ou la personne avec qui vous partagez les décisions. Elle a sa façon de voir, elle aussi.','Il y a votre enfant, qui vous regarde tous les 2.','Entre vous, il y a l’équipe. C’est là que vous vous parlez, que vous cherchez des solutions et que vous décidez.','Devant votre enfant, l’équipe parle d’une seule voix. Si vous n’êtes pas d’accord, vous en reparlez après, entre vous.']}
  ,verres:{vb:'0 0 340 240',
    alt:'3 verres de tailles différentes. La même quantité d’eau dans chacun fait déborder le petit et laisse le grand à moitié vide. On complète alors chaque verre jusqu’en haut. Une bulle, je dis pourquoi, pointe vers l’eau ajoutée. Le plus petit verre est entouré, avec les mots un moment rien qu’à lui.',
    base:sFleche('verres')+'<path class="s-sol" d="M12 204 L328 204"/>',
    l:[[2,'<rect class="s-eau" x="42" y="142" width="56" height="58"/><rect class="s-eau" x="142" y="142" width="56" height="58"/><rect class="s-eau" x="242" y="142" width="56" height="58"/><circle class="s-eau" cx="108" cy="150" r="4"/><circle class="s-eau" cx="114" cy="164" r="3"/><text class="s-t" x="150" y="22" text-anchor="middle">La même part</text>'],
       [3,'<rect class="s-eau plus" x="142" y="102" width="56" height="40"/><rect class="s-eau plus" x="242" y="62" width="56" height="80"/><text class="s-t fort" x="150" y="40" text-anchor="middle">puis ce qu’il faut à chacun</text>'],
       [1,'<path class="s-verre" d="M40 140 L40 202 L100 202 L100 140"/><path class="s-verre" d="M140 100 L140 202 L200 202 L200 100"/><path class="s-verre" d="M240 60 L240 202 L300 202 L300 60"/>'],
       [4,sTrait('M100 92 C 150 70, 200 76, 236 92','verres')+sBulle(62,104,112,['Je dis','pourquoi'],'vert',4)],
       [5,'<rect class="s-anneau" x="28" y="130" width="92" height="82" rx="16"/><text class="s-t" x="74" y="230" text-anchor="middle">Un moment à lui</text>']],
    caps:['Vos enfants sont comme 3 verres de tailles différentes. Ils n’ont pas tous le même besoin.','Si vous versez la même part dans chacun, le petit déborde, et le grand reste à moitié vide.','Être juste, c’est donner à chacun ce qu’il lui faut pour être rempli.','La différence passe bien quand vous dites pourquoi, avec des mots à leur hauteur.','Et celui qui demande le moins a besoin, lui aussi, d’un moment rien qu’à lui.']}
  ,cercles:{vb:'0 0 340 250',
    alt:'3 cercles un peu aplatis autour de vous et de votre enfant. Le premier contient les proches, le deuxième les connaissances, et au-delà se trouvent les inconnus. Un repère est posé dans le cercle des proches.',
    base:'',
    l:[[3,'<ellipse class="s-zone" cx="170" cy="134" rx="162" ry="108"/>'+sNum(104,43,3)+'<text class="s-t" x="182" y="47.6" text-anchor="middle">Les connaissances</text>'],
       [2,'<ellipse class="s-zone proche" cx="170" cy="134" rx="114" ry="74"/>'+sNum(124,78,2)+'<text class="s-t" x="182" y="82.6" text-anchor="middle">Les proches</text>'],
       [1,'<ellipse class="s-groupe" cx="170" cy="134" rx="60" ry="38"/>'+sNum(152,134,1)+'<text class="s-t" x="182" y="138.6" text-anchor="middle">Nous</text>'],
       [4,sNum(18,16,4)+'<text class="s-t" x="34" y="20.6" text-anchor="start">Les inconnus</text>'],
       [5,sPoint(244,150,5)]],
    caps:['Au centre, il y a votre enfant et vous.','Autour, il y a vos proches. Ils méritent une explication, et un moment avec votre enfant.','Plus loin, il y a les connaissances, comme les voisins ou les autres parents. Une phrase courte leur suffit.','Au-delà, il y a les inconnus. Vous ne leur devez rien, pas même une réponse.','Cette semaine, vous choisissez une seule personne parmi vos proches, et vous faites évoluer un regard à la fois.']}
  ,savoirs:{vb:'0 0 340 236',
    alt:'2 cercles qui se recouvrent en partie. À gauche, le savoir des professionnels. À droite, le vôtre. Au milieu, la zone où l’on décide ensemble. On y entre avec 3 points écrits, et on en ressort avec des décisions notées.',
    base:sFleche('savoirs'),
    l:[[1,'<circle class="s-groupe" cx="124" cy="100" r="84"/>'+sNum(56,78,1)+'<text class="s-t" x="82" y="104.6" text-anchor="middle">Leur savoir</text>'],
       [2,'<circle class="s-groupe" cx="216" cy="100" r="84"/>'+sNum(284,78,2)+'<text class="s-t" x="258" y="104.6" text-anchor="middle">Votre savoir</text>'],
       [3,'<path class="s-lentille" d="M170 29.7 A84 84 0 0 1 170 170.3 A84 84 0 0 1 170 29.7 Z"/><text class="s-t fort" x="170" y="104.6" text-anchor="middle">Ensemble</text>'],
       [4,sTrait('M112 196 C 130 180, 146 160, 158 142','savoirs')+sBulle(84,214,156,['3 points écrits'],'vert',4)],
       [5,sTrait('M182 142 C 194 160, 210 180, 228 196','savoirs')+sBulle(254,214,164,['Des décisions notées'],'fait')]],
    caps:['Les professionnels ont leur savoir. Ils connaissent des méthodes, et ils ont accompagné beaucoup d’enfants.','Vous avez le vôtre. Vous connaissez l’histoire de votre enfant, ses goûts, et tout ce qui a déjà été essayé.','Les bonnes décisions se prennent là où les 2 savoirs se rencontrent.','Vous y entrez avec 3 points écrits, à savoir ce qui va bien, ce qui vous inquiète et ce que vous demandez.','Vous en ressortez avec des décisions notées, et la date du prochain point.']}
  ,ravito:{vb:'0 0 340 232',
    alt:'Un graphique de vos forces pendant 6 mois. Sans recharge, la ligne descend un peu chaque jour et touche le sol avant la fin. Avec un rituel régulier, elle remonte à chaque fois, et un relais la fait remonter plus haut. Au bout des 6 mois, elle est toujours en haut.',
    rep:{d:'M30 62 L90 101 L90 66 L150 105 L150 70 L210 109 L210 58 L270 97 L270 62 L312 90 L312 60',f:[0,0,.5446,.7791,1],p:[[30,62],[30,62],[210,109],[270,97],[312,60]]},
    base:sFleche('ravito')+'<path class="s-sol" d="M14 200 L326 200"/><path class="s-sol" d="M14 200 L14 46"/>',
    l:[[2,'<path class="s-pente" d="M30 62 L240 200"/><path class="s-bout" d="M228 200 L252 200"/>'+sBulle(82,168,124,['Sans recharge'],'rose')],
       [3,sPtsF([[90,66,.2039],[150,70,.4077]],'lui')+sTrait('M140 40 C 126 50, 108 54, 97 61','ravito')+sBulle(160,22,118,['Un rituel'],'vert',3),'tot'],
       [4,sPtsF([[210,58,.6422]],'lui')+sTrait('M262 40 C 250 46, 232 48, 217 54','ravito')+sBulle(274,22,108,['Un relais'],'vert',4),'tot'],
       [5,sPtsF([[270,62,.846]],'lui'),'tot'],
       [5,sPoint(312,60,5)],
       [1,sPoint(30,62,1)+'<text class="s-t" x="8" y="30" text-anchor="start">Mes forces</text><text class="s-t" x="14" y="222" text-anchor="start">Aujourd’hui</text><text class="s-t" x="326" y="222" text-anchor="end">Dans 6 mois</text>']],
    caps:['Au départ, vos forces sont là.','Ce qui pèse les fait descendre un peu chaque jour. Sans recharge, la ligne touche le sol bien avant la fin.','Chaque rituel la fait remonter. Vous le posez à l’avance, comme un poste de ravitaillement sur le parcours.','Un relais la fait remonter plus haut, parce qu’il vous enlève un poids pendant quelques heures.','Avec vos rituels et un relais, vous êtes encore debout dans 6 mois, et la course continue.']}
  ,gue:{vb:'0 0 340 236',
    alt:'Une rivière entre 2 rives. À gauche, aujourd’hui. À droite, un drapeau, dans 10 ans. Une première pierre est posée dans l’eau, près de la rive de départ. Elle porte une décision, une date et une phrase avec les mots quand et alors. 3 autres pierres, en pointillé, mènent à l’autre rive, une par saison.',
    base:sFleche('gue')+'<path class="s-marche" d="M4 128 L46 128 Q58 128 58 140 L58 204 L4 204 Z"/><path class="s-marche" d="M336 128 L294 128 Q282 128 282 140 L282 204 L336 204 Z"/><path class="s-sol" d="M58 204 L282 204"/><path class="s-onde" d="M70 178 q 9 -7 18 0 t 18 0 t 18 0 t 18 0 t 18 0 t 18 0 t 18 0 t 18 0 t 18 0 t 18 0 t 18 0"/><path class="s-onde" d="M79 194 q 9 -7 18 0 t 18 0 t 18 0 t 18 0 t 18 0 t 18 0 t 18 0 t 18 0 t 18 0 t 18 0"/>',
    l:[[1,sPoint(30,110,1)+'<path class="s-mat" d="M312 128 L312 84"/><path class="s-drapeau" d="M312 84 L286 95 L312 106 Z"/><text class="s-t" x="6" y="226" text-anchor="start">Aujourd’hui</text><text class="s-t" x="334" y="226" text-anchor="end">Dans 10 ans</text>'],
       [5,'<ellipse class="s-pierre apres" cx="160" cy="152" rx="20" ry="9"/><ellipse class="s-pierre apres" cx="210" cy="152" rx="20" ry="9"/><ellipse class="s-pierre apres" cx="256" cy="152" rx="20" ry="9"/><text class="s-t fort" x="170" y="226" text-anchor="middle">Une par saison</text>'],
       [2,'<ellipse class="s-pierre" cx="104" cy="152" rx="24" ry="10"/>'+sTrait('M160 42 C 146 72, 126 104, 116 138','gue')+sBulle(216,24,160,['Une décision'],'',2)],
       [3,sTrait('M152 110 C 144 118, 138 130, 131 142','gue')+sBulle(214,104,124,['Une date'],'',3)],
       [4,sTrait('M48 104 C 62 98, 82 110, 92 138','gue')+sBulle(56,62,104,['Quand…','alors…'],'vert',4)]],
    caps:['Entre aujourd’hui et la journée que vous avez imaginée dans 10 ans, il y a une rivière. Personne ne la traverse d’un seul saut.','Vous posez une première pierre. C’est une seule décision, assez petite pour être prise dans les 6 prochains mois.','Vous lui donnez une date, et vous l’écrivez dans votre agenda.','Vous décidez du moment où vous ferez le premier geste, avec les mots « quand » et « alors ».','Les autres pierres viendront ensuite, une par saison. Vous n’avez pas besoin de les voir toutes pour poser la première.']}
  ,arche:{vb:'0 0 340 236',
    alt:'Une arche avec 4 repères. En bas à gauche, je ne sais pas faire et je ne le vois pas. En haut à gauche, je le vois. En haut à droite, je sais faire en y pensant. En bas à droite, je fais sans y penser. Une bulle, le bilan, pointe vers ce dernier repère.',
    rep:{d:'M44 184 C 70 18, 270 18, 296 184',f:[0,.294,.706,1,1],p:[[44,184],[96.3,85.8],[243.7,85.8],[296,184],[296,184]]},
    base:sFleche('arche')+'<path class="s-sol" d="M12 204 L328 204"/><path class="s-route" d="M44 184 C 70 18, 270 18, 296 184"/>',
    l:[[1,'<path class="s-pli" d="M170 30 L170 132"/><text class="s-t" x="88" y="22" text-anchor="middle">Je ne sais pas encore</text><text class="s-t" x="252" y="22" text-anchor="middle">Je sais faire</text>'],
       [1,sPoint(44,184,1)+'<text class="s-t" x="52" y="226" text-anchor="middle">Sans le voir</text>'],
       [2,sPoint(96,86,2)+'<text class="s-t" x="74" y="90.6" text-anchor="end">Je le vois</text>'],
       [3,sPoint(244,86,3)+'<text class="s-t" x="266" y="90.6" text-anchor="start">J’y pense</text>'],
       [4,sPoint(296,184,4)+'<text class="s-t" x="288" y="226" text-anchor="middle">Sans y penser</text>'],
       [5,'<circle class="s-anneau" cx="296" cy="184" r="22"/>'+sTrait('M226 168 C 242 172, 256 176, 268 180','arche')+sBulle(170,162,112,['Le bilan'],'vert',5)]],
    caps:['Au début, il y a des choses que vous ne savez pas faire, et vous ne le voyez pas.','Un jour, vous le voyez. C’est souvent le moment le plus inconfortable, et c’est pourtant le signe que vous avancez.','Puis vous savez faire, à condition d’y penser. Cela demande de l’attention.','Un jour enfin, vous faites sans y penser. C’est devenu un réflexe.','Ce que vous faites sans y penser ne se voit plus. Le bilan sert à le retrouver.']}
  ,sentier:{vb:'0 0 340 250',
    alt:'Un sentier en lacets qui monte. En bas, le départ. 5 petits repères marquent les mois, et le sixième, plus haut, est aujourd’hui. Encore plus haut, une bulle en pointillé porte les mots le parent parfait, et personne ne s’y trouve. Une flèche part d’une bulle, ma lettre, et redescend vers le départ.',
    rep:{d:'M30 214 C 110 214, 196 216, 204 194 C 212 170, 100 186, 92 160 C 84 132, 190 128, 224 104',f:[0,1,1,1,1],p:[[30,214],[224,104],[224,104],[224,104],[224,104]]},
    base:sFleche('sentier')+'<path class="s-route" d="M30 214 C 110 214, 196 216, 204 194 C 212 170, 100 186, 92 160 C 84 132, 190 128, 224 104"/>',
    l:[[2,sPtsF([[105.3,213.8,.1664],[180.4,207.5,.3332],[163.9,178.6,.5001],[92.5,161.3,.6669],[152.7,127.9,.833]],'lui')+'<text class="s-t" x="12" y="136" text-anchor="start">6 mois</text>','tot'],
       [1,sPoint(30,214,1)+'<text class="s-t" x="12" y="186" text-anchor="start">Le départ</text>'],
       [3,sPoint(224,104,3)+'<text class="s-t" x="246" y="108.6" text-anchor="start">Aujourd’hui</text>'],
       [4,'<path class="s-route" d="M228 86 C 232 70, 240 58, 250 50"/>'+sBulle(250,30,164,['Le parent parfait'],'ombre')],
       [5,sTrait('M236 198 C 200 242, 96 246, 50 230','sentier')+sBulle(274,178,116,['Ma lettre'],'vert',5)]],
    caps:['Voici la personne que vous étiez en commençant ce parcours.','Vous avez marché 6 mois, une étape après l’autre.','Vous voici aujourd’hui, plus haut sur le sentier. D’ici, vous voyez d’où vous venez.','Plus haut encore, il y a le parent parfait. Personne n’habite là-haut, et votre enfant n’en a pas besoin.','De là où vous êtes, vous écrivez à la personne restée au départ.']}
};

/* ---------- Mon évolution (questionnaire) ---------- */
const EVO_SCALES=[
  {id:'stress',t:'Mon niveau de stress',lo:'calme',hi:'à bout'},
  {id:'comp',t:'Mon sentiment de compétence comme parent',lo:'fragile',hi:'solide'},
  {id:'seul',t:'Ma solitude face à la situation',lo:'aucune',hi:'très grande'},
  {id:'regard',t:'Mon regard sur mon enfant',lo:'je vois d’abord ses difficultés',hi:'je vois d’abord qui il est'},
  {id:'confiance',t:'Ma confiance dans l’avenir',lo:'peur',hi:'confiance'}
];
/* La première question dépend de la situation choisie à l'inscription (handicap, période difficile, ou parent simplement). */
const EVO_OPEN=[['avant',{hand:'Que connaissiez-vous du handicap avant qu’il entre dans votre vie de famille ?',diff:'Que saviez-vous de ce que vous traversez aujourd’hui, avant que cela entre dans votre vie de famille ?',parent:'Quelle idée vous faisiez-vous de la vie de parent, avant de le devenir ?'}],['change','Votre regard a-t-il changé depuis ? Qu’est-ce qui a changé, et comment l’expliquez-vous ?']];
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

const MEDAL=RACINE+'img/medaillon.webp';
const HERO=RACINE+'img/hero.webp';

Object.assign(I,{
  pause:'<svg class="i" viewBox="0 0 24 24"><path d="M9 5v14M15 5v14"/></svg>',
  drop:'<svg class="i" viewBox="0 0 24 24"><path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/></svg>',
  path:'<svg class="i" viewBox="0 0 24 24"><path d="M4 19c4-1 5-5 8-6s5 1 8-2"/><circle cx="4" cy="19" r="1.6" fill="currentColor"/><circle cx="20" cy="11" r="1.6" fill="currentColor"/><path d="M12 13v-3"/></svg>',
  sun2:'<svg class="i" viewBox="0 0 24 24"><path d="M4 16h16M6 16a6 6 0 0 1 12 0"/><path d="M12 4v2M5.6 7.6l1.4 1.4M18.4 7.6L17 9M2 13h2M20 13h2"/></svg>',
  chart:'<svg class="i" viewBox="0 0 24 24"><path d="M4 20V4M4 20h16"/><path d="M8 16v-5M12 16V8M16 16v-3"/></svg>',
  image:'<svg class="i" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/></svg>',
  tag:'<svg class="i" viewBox="0 0 24 24"><path d="M3 12V4h8l9 9-8 8z"/><circle cx="7.5" cy="8.5" r="1.2" fill="currentColor"/></svg>',
  lock:'<svg class="i" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  user:'<svg class="i" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
  mail:'<svg class="i" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
  question:'<svg class="i" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7"/><circle cx="12" cy="17" r=".9" fill="currentColor"/></svg>',
  kit:'<svg class="i" viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M9 8V6a3 3 0 0 1 6 0v2M3 13h18"/></svg>',
  shield:'<svg class="i" viewBox="0 0 24 24"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9.5 12l2 2 3.5-4"/></svg>',
  ext:'<svg class="i" viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h5"/></svg>',
  eye:'<svg class="i" viewBox="0 0 24 24"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  pen:'<svg class="i" viewBox="0 0 24 24"><path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/></svg>',
  hand:'<svg class="i" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/><circle cx="12" cy="12" r="9.5"/></svg>',
  share:'<svg class="i" viewBox="0 0 24 24"><path d="M12 15V3"/><path d="M8 7l4-4 4 4"/><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/></svg>'
});
Object.keys(I).forEach(k=>{I[k]=I[k].replace('<svg class="i"','<svg class="i" aria-hidden="true" focusable="false"');});

/* ---------- formules ---------- */
const TIERS={free:{t:'Découverte',p:'0',per:'gratuit',cls:''},parcours:{t:'Le parcours',p:'84',per:'en tout',cls:'parcours'}};
/* Les 2 produits payants. Chacun s'achète une fois, et l'un n'oblige pas à prendre l'autre. */
const PRODUITS={parcours:{t:'Le parcours',p:84},relais:{t:'Passer le relais',p:49}};
const MENSU=14,NB_ECH=6;
const FREE_DEPOTS=3, Q_PER_MONTH=2;
const FEATURES=[
  ['La dose du jour',true,true,true],
  ['Boîte à outils et SOS',true,true,true],
  ['Déposer avec la phrase-miroir','3 dépôts','Illimité','Illimité'],
  ['« Et concrètement ? »','3 fois','Illimité','Illimité'],
  ['Dose personnalisée',false,true,true],
  ['Les 24 étapes','Étape 1',true,true],
  ['Mon évolution','Départ',true,true],
  ['Photolangage',false,true,true],
];
const UP={
  depots:{t:'Déposer sans limite',s:'Vous avez utilisé vos trois dépôts Découverte. Avec Le parcours, vous déposez autant que nécessaire, avec la phrase-miroir à chaque fois.'},
  dose:{t:'Votre dose, à vous',s:'Avec Le parcours, la dose du jour est écrite d’après ce que vous avez déposé ces derniers jours.'},
  parcours:{t:'Les 24 étapes',s:'La première étape est offerte. Les vingt-trois suivantes, une par semaine pendant six mois, font partie du Parcours.'},
  evo:{t:'Voir le chemin',s:'Le point de départ est offert. Le point à trois mois et le bilan à six mois font partie du Parcours.'},
  photo:{t:'Le photolangage',s:'Choisir une image pour dire votre vécu, au départ puis au bilan, fait partie du Parcours.'}
};
const LETTER_EXAMPLE='J’ai lu ce que vous avez déposé ce mois-ci. Ce que j’entends d’abord, c’est la fatigue des soirs, et aussi le fait que vous êtes là, malgré tout. Vous savez, les enfants retiennent moins nos cris que le fait qu’on soit revenu vers eux.\nJ’ai aussi vu quelque chose bouger. Vous avez commencé à mettre des mots sur ce qui se passe juste avant les crises, et c’est souvent par là qu’une porte s’ouvre.\nPour le mois qui vient, je vous propose une seule piste. Au moment du coucher, dites-lui à chaque fois ce qui vient en premier et ce qui vient juste après, par exemple « d’abord le pyjama, ensuite l’histoire ». Essayez dix soirs de suite, sans chercher à ce que ce soit parfait. On en reparle dans mon prochain mot.';
const QA_EXAMPLE={q:'Mon fils de 9 ans refuse d’aller à l’école le matin, ça finit en cris. Je fais quoi ?',a:'Je commencerais par la veille plutôt que par le matin. Préparez sa tenue, fermez son sac et dites-lui au coucher, en une phrase courte, ce qui se passera demain. Le matin, parlez peu, proposez-lui un seul choix, par exemple « chaussures ou veste d’abord ? », et gardez le même ordre chaque jour. Si le refus dure plus de deux semaines, demandez un rendez-vous à son enseignant ou à son enseignante, parce qu’il se passe peut-être quelque chose à l’école que vous ne pouvez pas voir depuis la maison. Et gardez en tête que ce refus n’est pas dirigé contre vous.'};
const WEIGHTS=[['solitude','La solitude'],['fatigue','La fatigue'],['culpa','La culpabilité'],['doutes','Les doutes'],['regard','Le regard des autres'],['pros','Les professionnels'],['charge','La charge mentale'],['couple','Le couple']];
/* Tant que le serveur n'existe pas, les échanges avec Antonio sont une démonstration : rien n'est transmis. */
const DEMO=true;
const LIM={me:30,draft:4000,q:1500,line:240,phrase:140,three:120,photo:2000,evo:1500,note:2000,search:60};
const tel=(n,label)=>'<a class="tel" href="tel:'+String(n).replace(/[^0-9+]/g,'')+'">'+(label||n)+'</a>';
const HELP=[
  {t:'La Main Tendue',tel:'143',d:'Pour parler quand ça ne va pas, de jour comme de nuit.'},
  {t:'Pro Juventute, conseils aux parents',tel:'058 261 61 61',d:'Gratuit et confidentiel, 24 heures sur 24, pour toutes les questions de parents.'},
  {t:'Urgences',tel:'144',d:'En cas de danger immédiat pour la vie.'},
  {t:'Pro Infirmis',url:'https://www.proinfirmis.ch/fr/a-propos/prestations.html',label:'proinfirmis.ch',d:'Consultation sociale gratuite et confidentielle, dans votre canton.'}
];

/* ---------- état ---------- */
/* « age » et « situation » sont vides tant que le parent n'a rien choisi : rien n'est coché à sa place.
   « perso » : il a rempli (ou enregistré) « Personnaliser mon espace ». « recents » : les dernières fiches et les derniers outils ouverts. */
const PRE=typeof globalThis!=='undefined'&&typeof globalThis.__PEPE_PRERENDER__==='function';
const DEF={fxOff:false,tier:'free',achats:{},vu:'',me:'',age:'',situation:'',perso:false,persoTard:false,recents:[],via:'',weights:[],start:'',moods:{},depots:[],shared:{},steps:{},notes:{},seen:{},pv:0,atelier:false,tout:false,evo:{},photo:null,photos:[],abc:[],phrases:[],routineDone:{},ft:{first:null,then:null},three:[],letters:[],questions:[],onboarded:false,doseDate:'',doseText:''};
const state={ap:{k:0,g:'',mot:''},cmd:{f:'',m:'une',k:'recap',de:''},rl:{e:'accueil',ex:'g',id:null,p:0,sec:'',r:null,lu:null,h:'',mots:false,attente:null,foc:''},photoPick:false,photoOrder:null,pdraft:null,evoDraft:null,data:null,view:'today',prev:null,lastKey:null,lastSheet:null,sit:null,q:'',theme:'all',age:'all',sheet:null,upFeat:null,toast:'',exo:null,kit:'sits',tool:'timer',timer:{total:300,left:300,running:false,h:null},ft:{pick:'first',g:null},confirmReset:false,sample:null,inClaude:false,busy:false,ctl:null,draft:'',qdraft:'',step:null,evoTime:'t1',depotMode:'listen',doseBusy:false,letter:null,souffle:{k:'pret',t0:0,raf:0,ph:'',cyc:-1,hid:0,ix:-1,tr:-1,seq:[],fin:0,cle:-1,choix:false,foc:''},lien:'',piste:false,confirmEssai:false,dire:null};
let toastTimer=null;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function load(){try{const d=JSON.parse(localStorage.getItem(KEY)||'null');if(d&&typeof d==='object')return migre(Object.assign(JSON.parse(JSON.stringify(DEF)),d));}catch(e){}return migre(JSON.parse(JSON.stringify(DEF)));}
/* Avant le 16 novembre 2026, les étapes faites étaient rangées par leur numéro. Elles le sont maintenant par leur nom.
   Un parent venu avant garde ouvertes autant d'étapes que de semaines écoulées depuis son arrivée, et celles qu'il avait faites. */
function migre(d){
  /* L'historique des photos commence avec celle qui était déjà gardée. */
  if(!Array.isArray(d.photos))d.photos=[];
  if(!d.photos.length&&d.photo&&d.photo.date){const pid=d.photo.id||(typeof d.photo.i==='number'?PHOTOS_AVANT[d.photo.i]:null);if(pid)d.photos.push({id:pid,text:d.photo.text||'',date:d.photo.date});}
  if(!(d.pv>=2)){
  const faits={},vus=(d.seen&&typeof d.seen==='object')?d.seen:{};
  const jour=(iso,n)=>{const p=String(iso).split('-').map(Number);const x=new Date(p[0],p[1]-1,p[2]+n);return x.getFullYear()+'-'+pad(x.getMonth()+1)+'-'+pad(x.getDate());};
  Object.keys(d.steps||{}).forEach(k=>{if(!d.steps[k])return;const id=/^\d+$/.test(k)?PARCOURS_AVANT[Number(k)]:k;if(id)faits[id]=true;});
  if(d.onboarded&&d.start){
    const ids=[];PARCOURS.forEach(m=>m.steps.forEach(s=>ids.push(s.id)));
    const p=String(d.start).split('-').map(Number);const sem=Math.max(0,Math.floor((Date.now()-new Date(p[0],p[1]-1,p[2]).getTime())/(7*86400000)));
    const n=d.tier&&d.tier!=='free'?Math.min(ids.length-1,sem):0;
    for(let i=0;i<=n;i++)if(!vus[ids[i]])vus[ids[i]]=jour(d.start,7*i);
    Object.keys(faits).forEach(id=>{if(!vus[id])vus[id]=d.start;});
  }
  d.steps=faits;d.seen=vus;if(!d.notes||typeof d.notes!=='object')d.notes={};d.pv=2;
  }
  /* Depuis le 18 novembre 2026, on entre dans l'espace d'un seul geste et la personnalisation est facultative.
     Un parent venu avant a déjà répondu à « Faisons connaissance » : ses réponses, ses dépôts, son carnet et sa progression restent tels quels. */
  if(d.pv<3){if(d.onboarded)d.perso=true;else{d.age='';d.situation='';}d.pv=3;}
  if(!Array.isArray(d.recents))d.recents=[];
  if(!Array.isArray(d.weights))d.weights=[];
  if(['e','a','g'].indexOf(d.age)<0)d.age='';
  if(['hand','diff','parent'].indexOf(d.situation)<0)d.situation='';
  return d;
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state.data));}catch(e){}}
function toast(m){state.toast=m;state.toastView=state.view;state.toastAt=Date.now();renderToast();clearTimeout(toastTimer);toastTimer=setTimeout(()=>{
  /* avec les effets, il s'efface en douceur avant d'être retiré */
  const el=document.querySelector('.toast');
  if(el&&fxOn()){el.style.animationDelay='0s';el.classList.add('out');toastTimer=setTimeout(()=>{state.toast='';renderToast();},420);}
  else{state.toast='';renderToast();}
},3000);}
function renderToast(){const old=document.querySelector('.toast');if(old)old.remove();if(state.toast){const el=document.createElement('div');el.className='toast';el.setAttribute('role','status');el.textContent=state.toast;
  /* Si l'écran est redessiné pendant que le message est là, son apparition reprend où elle en était au lieu de rejouer. */
  if(el.style)el.style.animationDelay='-'+Math.min(2000,Math.max(0,Date.now()-(state.toastAt||0)))+'ms';
  document.getElementById('app').appendChild(el);}}
const D=()=>state.data;
const pad=n=>String(n).padStart(2,'0');
const todayIso=()=>{const d=new Date();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());};
const fmtDate=iso=>{const p=iso.split('-');return p[2]+'.'+p[1]+'.'+p[0];};
const MONTHS_FR=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
const hm=t=>String(t||'').replace(':','h');
function deMois(iso){const m=MONTHS_FR[Number(iso.slice(5,7))-1];return (/^[aeiouyàâéèêîôû]/i.test(m)?'d’':'de ')+m;}
function liste(a){return a.length>1?a.slice(0,-1).join(', ')+' et '+a[a.length-1]:(a[0]||'');}
/* La voix d'Antonio n'emploie ni deux-points, ni point-virgule, ni tiret long : filet de sécurité pour les textes écrits par le modèle. */
function voix(t){return String(t||'').split('\n').map(l=>{l=l.replace(/^(\s*)[—–]\s+/,'$1- ').replace(/\s*[—–]\s*/g,', ').replace(/\s*;\s*(\S)/g,(m,c)=>'. '+c.toUpperCase()).replace(/\s*;\s*$/,'.').replace(/\s*:\s*(«)/g,' $1').replace(/([^\d\s])\s*:\s+(\S)/g,'$1, $2');return (/^\s*#/.test(l)?l.replace(/\s*:\s*$/,''):l.replace(/\s*:\s*$/,'.')).replace(/·[a-zàâéèêîôûç]+/gi,'').replace(/·/g,'').replace(/«[ ]/g,'«\u00a0').replace(/[ ]»/g,'\u00a0»');}).join('\n');}
/* Quand un texte laisse penser à une détresse : une aide qui reste affichée, avec des numéros cliquables (le message bref, lui, disparaît). */
function riskHtml(cls){return '<p class="'+cls+'">Si ce que vous vivez devient trop lourd, ne restez pas sans aide. Vous pouvez appeler La Main Tendue au '+tel('143')+', de jour comme de nuit, ou le '+tel('144')+' en cas d’urgence.</p>';}
function monthKey(iso){return iso.slice(0,7);}
function nextLetterDate(){const d=new Date();const n=new Date(d.getFullYear(),d.getMonth()+1,1);return '1er '+MONTHS_FR[n.getMonth()];}
function dayIdx(n){const d=new Date();return Math.floor((d.getTime()-d.getTimezoneOffset()*60000)/86400000)%n;}
function greeting(){const h=new Date().getHours();return h<5?'Il est tard':h<12?'Bonjour':h<18?'Bon après-midi':'Bonsoir';}
/* Le moment de la journée : la photo de l'étang prend la lumière de l'heure qu'il est (matin, jour, soir, nuit). */
function moment(){if(PRE)return 'jour';const h=new Date().getHours();return (h<5||h>=22)?'nuit':h<11?'matin':h<18?'jour':'soir';}
/* La page du carnet grandit avec le texte : on voit toujours tout ce qu'on a écrit, et les lignes restent sous les mots. */
function carnetHaut(t){
  t=t||document.getElementById('note');if(!t||!t.style||!t.closest||!t.closest('.etape'))return;
  t.style.height='auto';const h=t.scrollHeight;if(h>0)t.style.height=Math.max(194,Math.ceil((h-2)/32)*32+2)+'px';
}
function weekNo(){const s=D().start||todayIso();const p=s.split('-').map(Number);const d0=new Date(p[0],p[1]-1,p[2]);return Math.max(0,Math.floor((Date.now()-d0.getTime())/(7*86400000)));}
function allSteps(){const out=[];PARCOURS.forEach((m,mi)=>m.steps.forEach((s,si)=>out.push(Object.assign({mi,si,idx:out.length},s))));return out;}
/* L'étape du moment : la dernière qui est ouverte. Dans l'aperçu d'Antonio, où tout est ouvert, la première qui n'est pas faite. */
function currentStepIdx(){const S=allSteps();if(D().tout){const f=S.findIndex(s=>!D().steps[s.id]);return f<0?S.length-1:f;}let c=0;for(let i=1;i<S.length;i++){if(stepEtat(i).k==='open')c=i;else break;}return c;}
function doneCount(){return allSteps().filter(s=>D().steps[s.id]).length;}
/* Le parcours est commencé dès qu'une étape a été ouverte ou cochée sur cet appareil. */
function parcoursCommence(){const d=D();return allSteps().some(s=>d.seen[s.id]||d.steps[s.id]);}
/* Nombre de jours du calendrier entre une date et aujourd'hui. */
function joursDepuis(iso){const p=String(iso).split('-').map(Number);const n=new Date();return Math.round((new Date(n.getFullYear(),n.getMonth(),n.getDate()).getTime()-new Date(p[0],p[1]-1,p[2]).getTime())/86400000);}
/* Où en est une étape : ouverte, bientôt (dans n jours), plus tard, ou réservée à la formule Le parcours.
   Une étape s'ouvre sept jours après l'ouverture de la précédente. Une étape déjà ouverte le reste. Rien ne s'accumule en cas d'absence. */
function stepEtat(i){
  const S=allSteps(),s=S[i];if(!s)return {k:'tard'};
  if(D().tout)return {k:'open'};
  if(i>0&&!can('parcours'))return {k:'formule'};
  if(i===0||D().seen[s.id])return {k:'open'};
  const d0=D().seen[S[i-1].id];if(!d0)return {k:'tard'};
  const n=PAS_JOURS-joursDepuis(d0);
  return n<=0?{k:'open'}:{k:'bientot',n:n};
}
function stepLocked(i){return stepEtat(i).k!=='open';}
const dansJours=n=>n<=1?'demain':'dans '+n+' jours';
function noteDe(id){const n=D().notes[id];return n&&n.t&&String(n.t).trim()?n:null;}
function nbNotes(){return allSteps().filter(s=>noteDe(s.id)).length;}
function curatedDose(){const n=DOSES.length-1;return new Date().getDay()===0?DOSES[n]:DOSES[dayIdx(n)];}
function doseText(){const d=D();return d.doseDate===todayIso()&&d.doseText?d.doseText:curatedDose();}
function lastDepot(){const l=D().depots;return l.length?l[l.length-1]:null;}
function recentDepot(){const ld=lastDepot();return ld&&(Date.now()-new Date(ld.date).getTime())<4*86400000?ld:null;}
/* ---------- formules : droits ---------- */
/* Ce que le parent a acheté. L'ancienne formule « Avec Antonio » n'existe plus : celui qui l'avait essayée garde Le parcours. */
function achats(){const d=D();if(!d.achats||typeof d.achats!=='object'||Array.isArray(d.achats))d.achats={};if(d.tier==='antonio')d.tier='parcours';if(d.tier==='parcours'&&!d.achats.parcours)d.achats.parcours={m:'une',le:d.start||todayIso(),n:1};if(d.tier!=='parcours'&&d.achats.parcours)delete d.achats.parcours;return d.achats;}
const tier=()=>{achats();return D().tier==='parcours'?'parcours':'free';};
function can(f){if(f==='parcours')return tier()!=='free';if(f==='relais')return !!achats().relais;if(f==='antonio')return false;return true;}
/* Sur le site, aucune intelligence artificielle ne répond : les questions sont écrites à l'avance. Écrire ici reste donc gratuit, sans compteur ni limite. */
function depotsLeft(){return (can('parcours')||state.sample===false)?Infinity:Math.max(0,FREE_DEPOTS-D().depots.length);}
function questionsLeft(){const mk=monthKey(todayIso());return Math.max(0,Q_PER_MONTH-D().questions.filter(q=>monthKey(q.date)===mk).length);}
function sharedThisMonth(){const mk=monthKey(todayIso());return D().depots.filter(x=>D().shared[x.id]&&monthKey(x.date)===mk).length;}
function openUpgrade(f){state.upFeat=f;state.sheet='upgrade';}
function badge(){const t=TIERS[tier()];return '<span class="tierbadge '+t.cls+'">'+(tier()==='free'?I.star:tier()==='parcours'?I.path:I.user)+esc(t.t)+'</span>';}
function lockline(txt,f){return '<button type="button" class="lockline" data-act="upgrade" data-f="'+f+'">'+I.lock+'<span>'+esc(txt)+'</span></button>';}

/* ---------- effets visuels : l'eau calme ---------- */
/* Tout est lent et doux, et rien n'est dessiné par-dessus la photo.
   Les écrans se fondent l'un dans l'autre, les blocs viennent se poser sans à-coup, la lumière se lève une fois sur la photo,
   et l'eau de la photo bouge pour de bon, à l'arrivée et sous le doigt. Le texte n'est jamais estompé.
   Rien ne joue si le téléphone demande moins d'animations ou si le parent coupe les effets dans « Moi ». */
const FX_OK=!!(typeof window!=='undefined'&&window.requestAnimationFrame&&document.documentElement&&document.body);
const FX_RM=FX_OK&&window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):null;
/* Grand écran (ordinateur, tablette couchée) : le menu passe dans une colonne à gauche. La page est alors écrite dans l'ordre où on la voit,
   la colonne d'abord (nom de l'espace, onglets, SOS), puis le contenu. Sur téléphone, l'ordre reste barre du haut, contenu, onglets. */
const MQ_LARGE=FX_OK&&window.matchMedia?window.matchMedia('(min-width:1024px)'):null;
const large=()=>!!(MQ_LARGE&&MQ_LARGE.matches);
/* À partir de 1280 px de large, les thèmes de la boîte à outils tiennent sur 3 colonnes. */
const MQ_TROIS=FX_OK&&window.matchMedia?window.matchMedia('(min-width:1280px)'):null;
/* Les blocs qui se posent suivent le défilement quand le navigateur sait le faire sans risque ; sinon ils se posent une fois, à leur arrivée. */
const FX_SD=!!(FX_OK&&window.CSS&&CSS.supports&&CSS.supports('animation-timeline','view(block 0px 86px)')&&CSS.supports('animation-range','entry 0% entry min(100%, 260px)'));
const FX_SEL='main.fiche>.couv,main.fiche>.grp,.sits.groupes>.grp,main.etape>.couv,main.etape>.chap,main.etape>.mission,.final>.fin-couv,.final>.fin-bloc>*,.intro .acc-h,.intro .acc-c>*:not(.acc-perms),.intro .acc-perms>li,.intro>.voice,.intro>.acc-fin,.duo-a>*,.duo-b>*,main.view:not(.sosview)>.card,main.view:not(.sosview)>.dose,main.view>.comfort,main.view>.exo,main.view>.mirror,main.view>.qa,main.view>.letter,main.view>.demo-note,main.view>.step,main.view:not(.sosview)>.hint,.months .month>h2,.months .step,.ex>.sit,.depots>.mirror,.plans>.plan,.log>.logi,.perm>div,main.view>.menu-list,.story>p,.story>h2,.story .places>li,.story>.sign,.pillars>.pillar,.voice,.cta-stack';
let fxIO=null,fxSeq=0,fxSkip=0,fxVT=null;
function fxOn(){return FX_OK&&!(FX_RM&&FX_RM.matches)&&!(state.data&&state.data.fxOff);}
function fxSync(){if(!FX_OK)return;const c=document.documentElement.classList;const on=fxOn();c.toggle('fx',on);c.toggle('fxsd',on&&FX_SD);if(!on)eauStop();}
/* Changer d'écran : une onde de lumière part de l'endroit touché et traverse l'écran. Le nouvel écran apparaît dans son sillage,
   et l'ancien s'enfonce doucement dans l'ombre devant elle. Quand l'onde atteint la photo, la goutte saute (voir eauArrive).
   « fade » : un simple fondu, pour une feuille qui se referme. Le SOS s'affiche tout de suite, sans effet.
   Sans l'API du navigateur (View Transitions), le nouvel écran apparaît simplement en douceur. */
const fxPt={x:0,y:0,t:0,id:null,vt:false,synth:0,el:null};
const FX_TOUCHE='button,a[href],input,textarea,select,label,summary,[data-act]';
function fxTap(e){
  fxPt.x=e.clientX;fxPt.y=e.clientY;fxPt.t=Date.now();fxPt.id=e.pointerId;
  /* Pendant qu'un écran en remplace un autre, le navigateur ne dit plus ce qu'il y a sous le doigt : il répond « la page entière ».
     On s'en souvient, pour retrouver le bon bouton au moment où le doigt se lève (voir fxLeve). */
  const t=e.target;fxPt.vt=!!fxVT&&!(e.button>0)&&(!t||t===document||t===document.documentElement||t===document.body);
}
/* Le doigt se lève alors qu'une onde traverse encore l'écran : l'application doit répondre quand même.
   S'il y a un bouton à cet endroit, l'onde s'arrête là, l'écran est entier tout de suite, et le toucher est transmis au bouton.
   S'il n'y a rien à toucher, l'onde continue. Sur la photo, l'eau répond comme d'habitude. */
function fxLeve(e){
  if(!fxPt.vt||e.pointerId!==fxPt.id)return;fxPt.vt=false;
  const x=e.clientX,y=e.clientY;
  if(Date.now()-fxPt.t>700||Math.hypot(x-fxPt.x,y-fxPt.y)>12)return;   /* un appui long ou un glissement : ce n'est pas un toucher */
  const dedans=n=>{const r=n.getBoundingClientRect();return r.width>0&&r.height>0&&x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;};
  if(![].some.call(document.querySelectorAll(FX_TOUCHE),dedans)){
    const ph=[].find.call(document.querySelectorAll(EAU_TOUT),dedans);if(ph)eauTouch({clientX:x,clientY:y,button:0,target:ph});
    return;
  }
  try{if(fxVT&&fxVT.skipTransition)fxVT.skipTransition();}catch(err){}
  let el=document.elementFromPoint(x,y);el=el&&el.closest?el.closest(FX_TOUCHE):null;
  if(!el||el.disabled)return;
  fxPt.synth=Date.now();fxPt.el=el;
  if(el.matches('input,textarea,select')&&el.focus)el.focus();
  el.click();
}
/* Un toucher déjà transmis à la main pendant une onde ne doit pas compter deux fois, si le navigateur finit par l'envoyer lui aussi au même bouton. */
function fxDouble(e){if(e.isTrusted&&fxPt.el&&Date.now()-fxPt.synth<350&&e.target&&(e.target===fxPt.el||fxPt.el.contains(e.target))){e.stopPropagation();e.preventDefault();}}
function fxAnneau(){let o=document.getElementById('onde');if(!o){o=document.createElement('div');o.id='onde';o.setAttribute('aria-hidden','true');o.appendChild(document.createElement('i'));document.body.appendChild(o);}return o;}
function fxGo(update,kind,vtOnly){
  /* Pas d'effet non plus quand le téléphone anime déjà lui-même le retour en arrière (geste de balayage). */
  if(!fxOn()||state.view==='sos'||Date.now()-fxSkip<500){update();return;}
  const de=document.documentElement;const id=++fxSeq;
  if(typeof document.startViewTransition!=='function'){if(vtOnly){update();return;}de.classList.add('fx-nav');update();setTimeout(()=>{if(id===fxSeq)de.classList.remove('fx-nav');},620);return;}
  let done=false;
  if(kind==='fade'){
    de.classList.remove('fx-onde','fx-ring');de.style.setProperty('--fx-dur','.5s');
    const run=()=>{if(done)return;done=true;update();};
    try{const vt=document.startViewTransition(run);fxVT=vt||null;const fin=()=>{if(fxVT===vt)fxVT=null;};if(vt){if(vt.ready)vt.ready.catch(()=>{});if(vt.finished)vt.finished.then(fin,fin);else fin();}}catch(e){fxVT=null;run();}
    return;
  }
  const w=window.innerWidth,h=window.innerHeight;const fresh=Date.now()-fxPt.t<1500;
  const x=fresh?fxPt.x:w/2,y=fresh?fxPt.y:h-40;
  /* le rayon qu'il faut pour que l'ovale de l'onde (un peu plus large que haut) recouvre tout l'écran */
  const R=Math.ceil(Math.max(Math.hypot(x/1.25,y),Math.hypot((w-x)/1.25,y),Math.hypot(x/1.25,h-y),Math.hypot((w-x)/1.25,h-y))*1.34)+30;
  const dur=kind==='tab'?1.3:1.2;
  de.style.setProperty('--fx-x',Math.round(x)+'px');de.style.setProperty('--fx-y',Math.round(y)+'px');de.style.setProperty('--fx-r',R+'px');de.style.setProperty('--fx-s',(R/120).toFixed(3));de.style.setProperty('--fx-dur',dur+'s');
  state.onde={t:Date.now(),dur:dur,x:x,y:y,r:R};
  /* Si une onde précédente court encore (deux onglets touchés coup sur coup), son anneau est retiré d'abord : celui de la nouvelle onde repart de zéro. */
  de.classList.remove('fx-ring');fxAnneau();de.classList.add('fx-onde');
  /* Le dessin de l'anneau n'arrive qu'avec le nouvel écran : on ne le voit donc jamais posé tel quel, seulement grandir avec l'onde. */
  const run=()=>{if(done)return;done=true;update();de.classList.add('fx-ring');};
  let vt=null;
  const end=()=>{if(fxVT===vt)fxVT=null;if(id===fxSeq)de.classList.remove('fx-onde','fx-ring');};
  try{vt=document.startViewTransition(run);fxVT=vt||null;if(vt&&vt.finished)vt.finished.then(end,end);else end();if(vt&&vt.ready)vt.ready.catch(()=>{});}catch(e){run();end();}
}
/* Après chaque rendu : les blocs déjà à l'écran remontent à la surface l'un après l'autre (classe fxe), et ceux qui sont plus bas
   viendront se poser en arrivant à l'écran (classe fxr). Si l'écran est redessiné pendant l'arrivée, elle reprend où elle en était. */
function fxMark(){
  if(!fxOn()||!document.querySelectorAll)return;const vh=window.innerHeight;
  if(!FX_SD&&!fxIO&&'IntersectionObserver' in window)fxIO=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('fxs');fxIO.unobserve(e.target);}});},{rootMargin:'0px 0px -20px 0px'});
  const age=state.enterAt?Date.now()-state.enterAt:1e9;let k=0;
  const onde=!!(state.onde&&Date.now()-state.onde.t<1800);   /* l'onde dévoile l'écran entier : les blocs n'ont pas à arriver un par un */
  document.querySelectorAll(FX_SEL).forEach(el=>{
    const below=el.getBoundingClientRect().top>vh-100;
    /* À la toute première ouverture du site, l'accueil est déjà écrit dans la page et joue sa propre arrivée : on n'y touche pas. */
    if(el.classList.contains('reveal')){if(!below&&!state.enterAt)return;el.classList.remove('reveal','d1','d2','d3','d4');}
    if(!below){
      if(!onde&&age<1800&&!(el.parentElement&&el.parentElement.closest&&el.parentElement.closest('.reveal,.fxe'))){el.classList.add('fxe');if(el.style)el.style.animationDelay=(Math.min(k,6)*85-age)+'ms';k++;}
      return;
    }
    el.classList.add('fxr');
    if(!FX_SD&&fxIO){el.classList.add('fxw');fxIO.observe(el);}
  });
}
/* Déposer : une seule goutte tombe dans l'eau, à côté des mots du parent. Le cadre qui garde ses mots est l'étang :
   la goutte du logo tombe sur son bord, 2 ondes s'y élargissent, puis l'eau redevient calme et il ne reste que les mots.
   Les mots, eux, ne bougent pas, et la suite est là tout de suite : rien n'attend la fin du mouvement.
   La goutte ne tombe qu'une fois, au moment du dépôt. Si l'écran est redessiné pendant sa chute, elle continue là où elle en était
   (--dg-d). Avec « Réduire les animations », rien ne tombe : les mots sont simplement là. */
const DEPOSE_G='<ellipse class="dg-o1" cx="24" cy="37" rx="12" ry="3.8"/><ellipse class="dg-o2" cx="24" cy="37" rx="24" ry="7.6"/><path class="dg-g" d="M24 5C24 5 15.5 15.5 15.5 21.5a8.5 8.5 0 0 0 17 0C32.5 15.5 24 5 24 5z"/>';
function goutteDepot(id){
  if(!id||id!==state.fresh||!fxOn())return '';
  const dt=state.freshT?Math.max(0,(performance.now()-state.freshT)/1000):0;if(dt>3.8)return '';
  return '<svg class="depose-g" viewBox="0 0 48 48" aria-hidden="true"'+(dt>.05?' style="--dg-d:-'+dt.toFixed(2)+'s"':'')+'>'+DEPOSE_G+'</svg>';
}
/* Les mots du parent dans leur cadre, avec la goutte quand ils viennent d'être déposés. */
function motsCadre(x,lab){return '<div class="em-eau">'+goutteDepot(x.id)+motsHtml(x.text,lab)+'</div>';}
/* ---------- La dose de lumière : un reflet de soleil effleure une fois le bord de la carte ----------
   Quand la carte devient visible, un petit trait doré glisse le long de son bord, du haut à gauche jusqu'au coin de droite,
   puis il s'efface. Cela dure moins de 3 secondes et ne se joue qu'une fois par arrivée sur l'écran.
   Le reflet reste sur le bord : il ne passe jamais sur la phrase, qui ne bouge pas. Avec « Réduire les animations », il n'y a rien.
   Le dessin (3 traits posés l'un sur l'autre, pour un bord doux) n'existe que pendant le mouvement, puis il est retiré. */
const REFLET={io:null,vu:-1,t0:0,raf:0,att:0};
const REFLET_DUR=2600;
function refletJoue(carte){
  if(!carte||!carte.isConnected||!fxOn())return;
  const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('class','dose-reflet');svg.setAttribute('aria-hidden','true');
  const cs=getComputedStyle(carte),ray=Math.max(4,(parseFloat(cs.borderTopRightRadius)||26)-1);
  /* une lueur chaude suit le trait, à l'intérieur du bord : elle reste dans la marge de la carte, au-dessus et à côté de la phrase */
  svg.innerHTML='<defs><radialGradient id="dose-rg"><stop offset="0" stop-color="#FFD466" stop-opacity=".62"/><stop offset=".55" stop-color="#FFDF8A" stop-opacity=".2"/><stop offset="1" stop-color="#FFE9A8" stop-opacity="0"/></radialGradient></defs><circle r="21" fill="url(#dose-rg)" fill-opacity="0"/>';
  const lueur=svg.querySelector('circle');
  const T=[[.34,.3,2,'#FFF1C2'],[.16,.56,2.2,'#FFE08A'],[.06,1,2.8,'#FFCB47']].map(c=>{const r=document.createElementNS(ns,'rect');r.setAttribute('x','0');r.setAttribute('y','0');r.setAttribute('width','100%');r.setAttribute('height','100%');r.setAttribute('rx',String(ray));r.setAttribute('fill','none');r.setAttribute('stroke',c[3]);r.setAttribute('stroke-width',String(c[2]));r.setAttribute('stroke-linecap','round');r.setAttribute('stroke-opacity','0');svg.appendChild(r);return {r:r,k:c[0],o:c[1]};});
  carte.insertBefore(svg,carte.firstChild);
  let W=0,H=0,L=0;try{const b=svg.getBoundingClientRect();W=b.width;H=b.height;L=T[0].r.getTotalLength();}catch(e){}
  if(!(W>40&&H>40&&L>0)){svg.remove();return;}
  /* le chemin d'un rectangle part du début du bord du haut, suit ce bord, tourne le coin de droite, puis descend */
  const s0=W*.03,s1=(W-2*ray)+Math.PI*ray/2+Math.min(H*.36,150);
  const pas=()=>{
    REFLET.raf=0;if(!svg.isConnected)return;
    const x=Math.max(0,Math.min(1,(performance.now()-REFLET.t0)/REFLET_DUR));
    if(x>=1||!fxOn()){svg.remove();return;}
    const e=.5-.5*Math.cos(Math.PI*x),s=s0+(s1-s0)*e,env=Math.min(1,x/.2,(1-x)/.32);
    T.forEach(c=>{const len=W*c.k;c.r.setAttribute('stroke-dasharray',len.toFixed(1)+' '+(L+len).toFixed(1));c.r.setAttribute('stroke-dashoffset',(-(s-len/2)).toFixed(1));c.r.setAttribute('stroke-opacity',(c.o*env).toFixed(3));});
    try{const q=T[0].r.getPointAtLength(s);lueur.setAttribute('cx',q.x.toFixed(1));lueur.setAttribute('cy',q.y.toFixed(1));lueur.setAttribute('fill-opacity',env.toFixed(3));}catch(e){}
    REFLET.raf=requestAnimationFrame(pas);
  };
  if(REFLET.raf)(window.cancelAnimationFrame||clearTimeout)(REFLET.raf);
  REFLET.raf=requestAnimationFrame(pas);
}
/* Après chaque dessin de l'écran : si un reflet est en cours, il continue sur la carte redessinée ; sinon on guette le moment où la carte devient visible. */
function refletGuette(){
  if(REFLET.io){try{REFLET.io.disconnect();}catch(e){}REFLET.io=null;}
  clearTimeout(REFLET.att);
  if(!fxOn())return;
  const carte=document.querySelector('#app .dose');if(!carte)return;
  const arrivee=state.enterAt||0;
  if(REFLET.vu===arrivee){if(REFLET.t0&&performance.now()-REFLET.t0<REFLET_DUR-80)refletJoue(carte);return;}
  const part=()=>{if(REFLET.vu===arrivee||(state.enterAt||0)!==arrivee)return;REFLET.vu=arrivee;
    /* un court instant d'abord : la carte et l'écran ont fini d'arriver, et la phrase est déjà lisible */
    REFLET.t0=0;REFLET.att=setTimeout(()=>{const c=document.querySelector('#app .dose');if(!c||!fxOn())return;REFLET.t0=performance.now();refletJoue(c);},900);};
  if(!('IntersectionObserver' in window)){const r=carte.getBoundingClientRect();if(r.top<window.innerHeight*.7&&r.bottom>0)part();return;}
  REFLET.io=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting&&en.intersectionRatio>=.6){try{REFLET.io&&REFLET.io.disconnect();}catch(e){}REFLET.io=null;part();}});},{threshold:[.6]});
  REFLET.io.observe(carte);
}
/* ---------- l'eau de la photo : de vraies ondes, calculées dans l'image ---------- */
/* La photo est redessinée par la carte graphique du téléphone, et chaque onde déplace vraiment les reflets de l'étang,
   en suivant sa perspective (les cercles s'aplatissent au loin). Rien n'est dessiné par-dessus la photo.
   Là où l'eau est calme, ce calque est transparent, et il s'enlève tout seul quand la dernière onde s'est éteinte.
   Sans carte graphique utilisable, la photo reste simplement immobile. */
const EAU={ok:null,cv:null,gl:null,u:null,tex:false,host:null,geo:null,rips:[],wait:[],raf:0,t0:0,fix:null,n:0,last:0,slow:0,weak:0,seq:0,lost:0,drop:null,resp:null,pz:0};
const EAU_LIFE=3.2;
const EAU_TC=1.2;   /* le moment où la goutte touche la pointe de la colonne, en secondes depuis le début de son rebond */
const EAU_ICI='.herofull,.band';   /* toutes les photos : l'accueil, les quatre onglets et « Mon histoire » */
const EAU_TOUT=EAU_ICI+',.etang';   /* et l'étang de « Souffler » et de « Prendre un instant », où l'eau répond au doigt mais où la goutte ne rebondit pas toute seule */
const EAU_VS='attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
/* Les réglages de l'onde, à un seul endroit. Les longueurs sont en points de la photo, à la profondeur de la goutte. */
const EAU_P={c:120,lam:130,front:26,tail:170,tau:4.5,ax:13,ay:16,sh:.8,gl:.35,li:.6,pw:2};
const EAU_FS=[
'precision highp float;',
'uniform sampler2D uTex;uniform vec2 uRes;uniform vec4 uMap;uniform float uT;uniform float uA;uniform vec4 uD;uniform vec4 uS;uniform vec4 uR[8];',
'void main(){',
' vec2 p=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y);',
' vec2 q=uMap.xy+p*uMap.zw;',                                  /* le point de la photo (866 x 470) */
' float s=(q.y+26.)/285.;',                                    /* la perspective : 1 à la profondeur de la goutte, plus petit au loin */
' vec2 w=vec2((q.x-434.)/s,1500./s);',                         /* le même point, posé à plat sur l'étang */
' vec2 g=vec2(0.);float h=0.;float li=0.;',
' for(int i=0;i<8;i++){',
'  vec4 r=uR[i];float age=uT-r.z;',
'  vec2 dv=w-r.xy;float d=length(dv)+.0001;',
'  float x=@c@*max(age,0.)-d;',                                /* distance derrière le front de l onde, qui avance lentement */
'  float e=x<0.?exp(-x*x/(@front@*@front@)):exp(-x/@tail@);',  /* un front doux, puis des rides de plus en plus faibles derrière lui */
'  e*=r.w*step(0.,age)*smoothstep(0.,.7,age)*exp(-age/@tau@)*(1.-smoothstep(2.,3.2,age))*smoothstep(8.,60.,d)/sqrt(1.+d/400.);',
'  float c=e*cos(x*6.2832/@lam@);',
'  float cr=cos(x*6.2832/@lam@);',
'  g+=dv/d*c;h+=c;li+=e*pow(max(cr,0.),@pw@)*(.55+.45*abs(dv.y)/d);',
' }',
' float m=smoothstep(104.,150.,q.y)*mix(smoothstep(150.,250.,q.x),1.,smoothstep(140.,178.,q.y));',   /* seulement sur l eau : ni la rive, ni la fougère */
' vec2 pa=q-vec2(434.,160.);float hh=clamp(pa.y/90.,0.,1.);',
' m*=smoothstep(14.,30.,length(pa-vec2(0.,90.)*hh));',                                              /* ni la goutte et sa colonne, qui sont devant l eau */
' vec2 o=vec2(g.x*@ax@*s,-g.y*@ay@*s*s)*m*uA;',
' float tilt=(h*.45-g.y*.55)*m*uA;',                                                                   /* la pente de la vague, vue d ici */
' vec3 col=texture2D(uTex,(q+o)/vec2(866.,470.)).rgb;',
' col*=1.+tilt*@sh@;',
' float sx=(q.x-480.)/130.;float sun=exp(-sx*sx);',                                                       /* la lumière vient d en haut, un peu à droite de la goutte */
' float lum=dot(col,vec3(.3,.6,.1));',
' col+=vec3(.9,1.,.84)*li*m*uA*(@li@*(.35+lum)+@gl@*sun);',                                          /* une crête fine qui accroche la lumière, plus vive sous le soleil */
' float a=clamp(length(o)*.8+abs(tilt)*2.5+li*m*uA*3.,0.,1.);',
/* la goutte suspendue : uD = (descente en points de la photo, étirement en largeur, étirement en hauteur, présence de l effet) */
' vec2 I=vec2(866.,470.);vec2 c0=vec2(434.8,167.5);vec2 ax=vec2(15.8,16.8);vec2 dq=q-c0;',
' float hole=0.;float dr=0.;float ec=0.;float sp=0.;',
' if(uD.w>.001&&abs(dq.x)<50.&&dq.y>-66.&&dq.y<50.){',                                              /* tout ceci ne se calcule qu autour de la goutte, et seulement pendant son rebond */
'  hole=(1.-smoothstep(.72,1.,length(dq/(ax+vec2(9.,dq.y>0.?4.6:9.)))))*uD.w;',                     /* là où elle était : on rebouche le fond */
'  vec2 lo=c0-ax-12.;vec2 hi=c0+ax+vec2(12.,5.);vec2 uv=clamp((q-lo)/(hi-lo),0.,1.);',              /* il se prolonge depuis les quatre côtés du cadre qui entoure la goutte */
'  vec3 fx=mix(texture2D(uTex,vec2(lo.x,q.y)/I).rgb,texture2D(uTex,vec2(hi.x,q.y)/I).rgb,uv.x);',
'  vec3 fy=mix(texture2D(uTex,vec2(q.x,lo.y)/I).rgb,texture2D(uTex,vec2(q.x,hi.y)/I).rgb,uv.y);',
'  vec3 fc=mix(mix(texture2D(uTex,lo/I).rgb,texture2D(uTex,vec2(hi.x,lo.y)/I).rgb,uv.x),mix(texture2D(uTex,vec2(lo.x,hi.y)/I).rgb,texture2D(uTex,hi/I).rgb,uv.x),uv.y);',
'  col=mix(col,fx+fy-fc,hole);',
'  vec2 u=(dq-vec2(0.,uD.x))/uD.yz;',
'  dr=(1.-smoothstep(.93,1.06,length(u/ax)))*uD.w;',                                                /* là où elle est maintenant : la goutte de la photo, telle quelle */
'  col=mix(col,texture2D(uTex,(c0+u)/I).rgb,dr);',
' }',
/* au contact : uS = (secondes depuis le contact, force de l éclat, rayon de l éclat, présence des gouttelettes) */
' vec2 tip=vec2(434.8,201.);vec2 dt=q-tip;',
' if((uS.y>.001||uS.w>.001)&&dot(dt,dt)<8100.){',
'  ec=uS.y*exp(-dot(dt,dt)/(uS.z*uS.z));',
'  float tc=max(uS.x,0.);',
'  for(int i=0;i<5;i++){float fi=float(i);float an=(fi-2.)*.42;float v=64.+fi*7.;vec2 pp=tip+vec2(sin(an)*v*tc*.9,-cos(an)*v*tc+85.*tc*tc);float rr=(1.5+.3*fi)*uA;vec2 e2=q-pp;sp+=exp(-dot(e2,e2)/(rr*rr));}',
'  sp*=uS.w;',
'  col+=vec3(1.,.98,.86)*(ec+sp*.85);',
' }',
' a=max(a,clamp(max(hole,dr)+ec*2.5+sp*2.,0.,1.));',
' gl_FragColor=vec4(col*a,a);',
'}'].join('\n').replace(/@(\w+)@/g,(m,k)=>(+EAU_P[k]).toFixed(4));
function eauNow(){return EAU.fix!=null?EAU.fix:(performance.now()-EAU.t0)/1000;}
function eauInit(){
  if(EAU.ok!==null)return EAU.ok;
  EAU.ok=false;
  try{
    const cv=document.createElement('canvas');cv.className='eau';cv.setAttribute('aria-hidden','true');
    /* failIfMajorPerformanceCaveat : pas de calque si la carte graphique est émulée par le processeur, car l'eau serait saccadée. (__eauSansGarde : seulement pour les tests.) */
    const gl=cv.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:false,powerPreference:'low-power',failIfMajorPerformanceCaveat:!window.__eauSansGarde});
    if(!gl)return false;
    const hp=gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER,gl.HIGH_FLOAT);if(!hp||!hp.precision)return false;
    /* Certains navigateurs émulent la carte graphique sans le dire : on le lit dans son nom, et là non plus on ne dessine pas l'eau. */
    try{const di=gl.getExtension('WEBGL_debug_renderer_info');const nom=di?String(gl.getParameter(di.UNMASKED_RENDERER_WEBGL)):'';if(!window.__eauSansGarde&&/swiftshader|llvmpipe|software|basic render/i.test(nom))return false;}catch(e){}
    const sh=(t,src)=>{const o=gl.createShader(t);gl.shaderSource(o,src);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw new Error('eau');return o;};
    const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,EAU_VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,EAU_FS));gl.linkProgram(pr);
    if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return false;
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    const a=gl.getAttribLocation(pr,'a');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
    EAU.u={res:gl.getUniformLocation(pr,'uRes'),map:gl.getUniformLocation(pr,'uMap'),t:gl.getUniformLocation(pr,'uT'),a:gl.getUniformLocation(pr,'uA'),d:gl.getUniformLocation(pr,'uD'),s:gl.getUniformLocation(pr,'uS'),r:gl.getUniformLocation(pr,'uR')};
    gl.uniform1i(gl.getUniformLocation(pr,'uTex'),0);gl.clearColor(0,0,0,0);
    cv.addEventListener('webglcontextlost',e=>{e.preventDefault();if(EAU.cv!==cv)return;eauStop();EAU.cv=null;EAU.gl=null;EAU.tex=false;EAU.ok=(++EAU.lost<4)?null:false;});
    const im=new Image();im.decoding='async';
    im.onload=()=>{
      if(EAU.gl!==gl)return;
      try{
        gl.bindTexture(gl.TEXTURE_2D,gl.createTexture());
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);
        EAU.tex=true;const q=EAU.wait;EAU.wait=[];q.forEach(f=>{try{f();}catch(e){}});
      }catch(e){EAU.ok=false;}
    };
    /* si la photo ne se charge pas, l'eau ne sera jamais dessinée : les cercles et les mots prennent le relais */
    im.onerror=()=>{if(EAU.gl===gl)EAU.ok=false;};
    im.src=HERO;
    EAU.cv=cv;EAU.gl=gl;EAU.ok=true;
  }catch(e){EAU.ok=false;}
  return EAU.ok;
}
/* Où la photo est-elle affichée, et quel morceau en voit-on ? (elle remplit sa boîte en étant rognée, comme « cover ») */
function eauGeo(host){
  const hero=host.classList.contains('herofull')||host.classList.contains('etang');const box=hero?host.querySelector('.herobg,.etang-photo'):host;if(!box)return null;
  const r=box.getBoundingClientRect();if(r.width<40||r.height<40)return null;
  let px=.5,py=.5;
  try{const cs=getComputedStyle(box);const m=String(hero?cs.objectPosition:cs.backgroundPosition).match(/(-?[\d.]+)%\s+(-?[\d.]+)%/);if(m){px=m[1]/100;py=m[2]/100;}}catch(e){}
  const k=Math.max(r.width/866,r.height/470);
  return {el:box,w:r.width,h:r.height,k:k,ox:-(r.width-866*k)*px/k,oy:-(r.height-470*k)*py/k};
}
function eauHost(host){
  if(!EAU.ok||!host)return false;
  if(EAU.host!==host||EAU.cv.parentNode!==host){
    if(host.classList.contains('herofull')||host.classList.contains('etang')){const im=host.querySelector('.herobg,.etang-photo');if(!im)return false;host.insertBefore(EAU.cv,im.nextSibling);}
    else host.insertBefore(EAU.cv,host.firstChild);
    EAU.host=host;EAU.geo=null;
  }
  if(!EAU.geo)EAU.geo=eauGeo(host);
  return !!EAU.geo;
}
function eauStop(){
  if(EAU.raf){cancelAnimationFrame(EAU.raf);EAU.raf=0;}
  EAU.rips=[];EAU.wait=[];EAU.n=0;EAU.slow=0;EAU.host=null;EAU.geo=null;EAU.drop=null;EAU.resp=null;EAU.pz=0;
  try{const L=document.querySelectorAll('.eau-vive');for(let i=0;i<L.length;i++)L[i].classList.remove('eau-vive');}catch(e){}
  if(EAU.cv){try{EAU.gl.clear(EAU.gl.COLOR_BUFFER_BIT);}catch(e){}if(EAU.cv.parentNode)EAU.cv.parentNode.removeChild(EAU.cv);}
}
/* Une onde naît à cet endroit de la photo. */
function eauAdd(ix,iy,force,delay){
  if(!EAU.rips.length&&!EAU.raf)EAU.t0=performance.now();
  const s=(iy+26)/285;
  EAU.rips.push({x:(ix-434)/s,z:1500/s,t:eauNow()+(delay||0),s:force});
  if(EAU.rips.length>8)EAU.rips.shift();
  if(!EAU.raf&&EAU.fix==null)EAU.raf=requestAnimationFrame(eauFrame);
}
/* Le rebond de la goutte, en ralenti : elle monte encore un peu, retombe sur la pointe de la colonne, s'y écrase à peine, puis rebondit et revient à sa place.
   Rend ce qu'il faut au dessin : sa descente, ses étirements, et l'éclat et les gouttelettes du contact. */
function eauGoutte(t){
  const seg=(a,b)=>Math.min(1,Math.max(0,(t-a)/(b-a))),eo=p=>1-(1-p)*(1-p),eio=p=>p<.5?2*p*p:1-2*(1-p)*(1-p);
  const T=EAU_TC;let dy=0,sx=1,sy=1;
  if(t<.12){}
  else if(t<.62)dy=-22*eo(seg(.12,.62));
  else if(t<T){const p=seg(.62,T);dy=-22+40*p*p;sy=1+.07*p;sx=1-.045*p;}
  else if(t<T+.3){const p=seg(T,T+.3),k=Math.sin(Math.PI*p);sy=1+.07*(1-p)*(1-k)-.16*k;sx=1-.045*(1-p)*(1-k)+.1*k;dy=18+(1-sy)*16.8;}
  else if(t<T+.95)dy=18-23*eo(seg(T+.3,T+.95));
  else dy=-5*(1-eio(seg(T+.95,T+1.75)));
  const tc=t-T;const pres=Math.min(1,t/.08)*(1-seg(T+1.67,T+1.75));
  const eclat=tc<0?0:(tc<.09?tc/.09:Math.exp(-(tc-.09)/.3))*.5;
  const gouttes=tc<0?0:Math.min(1,tc/.05)*(1-Math.min(1,Math.max(0,(tc-.55)/.4)));
  return {d:[dy,sx,sy,pres],s:[tc,eclat,12,gouttes]};
}
const EAU_GFIN=EAU_TC+1.75;
/* La goutte rebondit, et l'onde part au moment où elle touche l'eau. */
function eauBond(){
  if(EAU.drop!=null)return;
  eauAdd(434,259,1,EAU_TC);eauAdd(434,259,.55,EAU_TC+.3);
  EAU.drop=eauNow();
}
function eauFrame(){
  EAU.raf=0;const gl=EAU.gl,cv=EAU.cv;
  if(!EAU.ok||!EAU.tex||!EAU.host||!cv.isConnected||!fxOn()){eauStop();return;}
  const now=eauNow();
  EAU.rips=EAU.rips.filter(r=>now-r.t<EAU_LIFE);
  if(EAU.drop!=null&&now-EAU.drop>=EAU_GFIN)EAU.drop=null;
  /* L'exercice s'arrête ou se termine : la goutte redescend à sa place en un peu moins d'une seconde, sans à-coup, puis le calque s'efface. */
  if(EAU.resp&&EAU.resp.ret){const p=Math.min(1,Math.max(0,(now-EAU.resp.ret.t)/.9));EAU.resp.dy=EAU.resp.ret.de*(1-p)*(1-p);if(p>=1)EAU.resp=null;}
  if(!EAU.rips.length&&EAU.drop==null&&!EAU.resp){eauStop();return;}
  /* En pause, l'image reste telle qu'elle est : la goutte attend en l'air, et les ondes aussi. */
  if(EAU.pz)return;
  if(!EAU.geo||EAU.n%30===29)EAU.geo=eauGeo(EAU.host);
  const g=EAU.geo;if(!g){eauStop();return;}
  /* Un téléphone qui peine vraiment (quatre images de suite trop lentes) : on arrête cette onde. La deuxième fois, la photo reste immobile pour toute la visite. */
  const ms=performance.now();
  if(EAU.fix==null&&!window.__eauSansGarde&&EAU.n>1){EAU.slow=ms-EAU.last>60?EAU.slow+1:0;if(EAU.slow>3){if(++EAU.weak>1)EAU.ok=false;eauStop();return;}}
  EAU.last=ms;EAU.n++;
  /* Sur un grand écran la photo est grande : on plafonne le nombre de points dessinés, pour que l'eau reste fluide même sur un ordinateur modeste. */
  const dpr=Math.min(window.devicePixelRatio||1,2,Math.max(1,Math.sqrt(1.8e6/(g.w*g.h))));
  const W=Math.max(2,Math.round(g.w*dpr)),H=Math.max(2,Math.round(g.h*dpr));
  if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H;}
  gl.viewport(0,0,W,H);
  gl.uniform2f(EAU.u.res,W,H);gl.uniform4f(EAU.u.map,g.ox,g.oy,g.w/(W*g.k),g.h/(H*g.k));gl.uniform1f(EAU.u.t,now);
  gl.uniform1f(EAU.u.a,Math.max(1,Math.min(1.7,.8/g.k)));
  /* Pendant « Souffler », la goutte suit le souffle : « resp.dy » est sa hauteur du moment, en points de la photo (négatif : elle s'élève). */
  const G=EAU.resp?{d:[EAU.resp.dy,1,1,1],s:[-1,0,12,0]}:EAU.drop!=null?eauGoutte(now-EAU.drop):{d:[0,1,1,0],s:[-1,0,12,0]};
  gl.uniform4f(EAU.u.d,G.d[0],G.d[1],G.d[2],G.d[3]);gl.uniform4f(EAU.u.s,G.s[0],G.s[1],G.s[2],G.s[3]);   /* photo affichée en petit (le bandeau) : l'onde est un peu plus marquée, pour rester visible */
  const a=EAU.buf||(EAU.buf=new Float32Array(32));a.fill(0);EAU.rips.forEach((r,i)=>{a[i*4]=r.x;a[i*4+1]=r.z;a[i*4+2]=r.t;a[i*4+3]=r.s;});
  gl.uniform4fv(EAU.u.r,a);
  gl.drawArrays(gl.TRIANGLES,0,3);
  if(EAU.fix==null)EAU.raf=requestAnimationFrame(eauFrame);
}
/* « Souffler » : la goutte de la photo suit le souffle. « dy » est sa hauteur, en points de la photo (0 : à sa place, négatif : plus haut).
   Rend vrai si l'eau est dessinée. Sinon (pas de carte graphique, téléphone qui peine, effets coupés), l'écran garde ses 2 cercles et ses mots. */
function eauRespire(host,dy){
  if(!fxOn()||!host)return false;
  if(EAU.ok===null)eauInit();
  if(!EAU.ok||!EAU.tex||!eauHost(host))return false;
  if(!EAU.raf&&!EAU.rips.length&&!EAU.resp)EAU.t0=performance.now();
  EAU.resp={dy:dy};
  if(host.classList&&!host.classList.contains('eau-vive'))host.classList.add('eau-vive');
  if(!EAU.raf&&EAU.fix==null&&!EAU.pz)EAU.raf=requestAnimationFrame(eauFrame);
  return true;
}
/* La pause de « Souffler » : l'eau s'arrête là où elle en est, puis repart du même point. */
function eauPause(oui){
  if(oui){if(!EAU.pz)EAU.pz=performance.now();}
  else if(EAU.pz){EAU.t0+=performance.now()-EAU.pz;EAU.pz=0;if(!EAU.raf&&EAU.fix==null&&(EAU.resp||EAU.rips.length))EAU.raf=requestAnimationFrame(eauFrame);}
}
/* Dès que la photo est prête pour la carte graphique. */
function eauReady(f){if(!eauInit())return;if(EAU.tex)f();else EAU.wait.push(f);}
/* À l'arrivée sur un écran qui montre la photo : la goutte rebondit, et l'onde part quand elle touche l'eau.
   Avec la lumière qui se lève en même temps, tout ce qui bouge tout seul est redevenu calme en cinq secondes.
   « first » : la toute première ouverture du site, où l'écran est déjà écrit dans la page. La lumière y attend l'eau, pour qu'elles partent ensemble. */
function eauArrive(first){
  const id=++EAU.seq;if(!fxOn())return;
  /* Si une onde de lumière traverse l'écran, la goutte attend qu'elle arrive jusqu'à la photo : c'est l'onde qui la fait sauter. */
  let attente=100;const o=state.onde;
  if(o&&Date.now()-o.t<300){const ph=document.querySelector(EAU_ICI);if(ph){const r=ph.getBoundingClientRect();attente=Math.round(o.dur*1000*Math.min(1,.06+Math.hypot((r.left+r.width/2-o.x)/1.25,r.top+r.height*.5-o.y)/o.r)*.85);}}
  const go=()=>setTimeout(()=>{
    if(id!==EAU.seq||!fxOn())return;
    if(first){const ap=document.getElementById('app');if(ap&&ap.classList){state.enterAt=Date.now();ap.classList.add('lum');}}
    const ici=state.view==='instant'?EAU_TOUT:EAU_ICI;
    if(!document.querySelector(ici))return;
    eauReady(()=>{if(id!==EAU.seq)return;const host=document.querySelector(ici);if(!host||!eauHost(host))return;eauBond();if(host.classList.contains('etang'))host.classList.add('eau-vive');});
  },attente);
  /* On attend que la page ait fini de se charger : la première onde ne doit pas être saccadée. */
  if(document.readyState==='complete')go();else window.addEventListener('load',go,{once:true});
}
/* Sous le doigt : on ne fait bouger l'eau que là où il y a de l'eau. */
function eauTouch(e){
  if(!fxOn()||e.button>0)return;const t=e.target&&e.target.closest?e.target:null;
  if(!t||t.closest('button,a,input,textarea,select,label'))return;
  const host=t.closest(EAU_TOUT);if(!host)return;
  const x=e.clientX,y=e.clientY;
  /* Sans carte graphique, l'étang de « Prendre un instant » répond quand même : un cercle fin naît sous le doigt et s'efface. */
  if(!eauInit()){if(host.classList.contains('etang')&&host.closest('.instant'))ondeDoigt(host,x,y);return;}
  eauReady(()=>{
    if(!host.isConnected)return;const g=eauGeo(host);if(!g)return;const r=g.el.getBoundingClientRect();
    const ix=g.ox+(x-r.left)/g.k,iy=g.oy+(y-r.top)/g.k;
    if(Math.abs(ix-435)<30&&iy>140&&iy<262){if(!EAU.resp&&eauHost(host))eauBond();return;}      /* la goutte ou sa colonne : elle rebondit (sauf pendant « Souffler », où elle suit le souffle) */
    if(iy<118||iy>470||ix<0||ix>866)return;      /* la rive, la forêt, ou plus bas que la photo : rien ne bouge */
    if(eauHost(host)){eauAdd(ix,iy,host.classList.contains('etang')?.78:.8,0);host.classList.add('eau-vive');}
  });
}
function ondeDoigt(host,x,y){
  try{
    const g=eauGeo(host);if(!g)return;const r=g.el.getBoundingClientRect(),h=host.getBoundingClientRect();
    const iy=g.oy+(y-r.top)/g.k;if(iy<118||iy>470)return;      /* seulement sur l'eau */
    const o=document.createElement('i');o.className='onde-doigt';o.setAttribute('aria-hidden','true');
    /* plus loin sur l'étang, le cercle est plus petit, comme sur la photo */
    const s=Math.max(.45,Math.min(1.5,(iy+26)/285));
    o.style.left=Math.round(x-h.left)+'px';o.style.top=Math.round(y-h.top)+'px';o.style.setProperty('--k',s.toFixed(2));
    host.appendChild(o);const fin=()=>{try{o.remove();}catch(e){}};o.addEventListener('animationend',fin,{once:true});setTimeout(fin,3200);
  }catch(e){}
}
/* Après chaque rendu : en changeant d'écran l'eau redevient calme, et sur le même écran le calque retrouve sa photo. */
function eauSync(entering){
  if(!EAU.cv)return;
  if(entering||(!EAU.rips.length&&!EAU.resp)){eauStop();return;}
  if(!EAU.cv.isConnected){const host=document.querySelector(EAU_TOUT);if(!host||!eauHost(host))eauStop();else if(!EAU.raf&&EAU.fix==null)EAU.raf=requestAnimationFrame(eauFrame);}
}
/* ---------- rendu ---------- */
const TAB_VIEWS=['today','parcours','kit','me'];
const BACK_VIEWS=['sit','exo','step','carnet','final','photo','data','about','plans','evo','depots','antonio','letter','deposer','apercu','commande','relais','transmettre','instant'];
/* Retrouver, après un nouveau rendu, le bouton qui avait le focus (clavier, lecteurs d'écran). Jamais un champ de texte : sur téléphone cela rouvrirait le clavier. */
function focusKey(el){
  if(!el||!el.matches||!el.closest||!el.closest('#app'))return null;
  if(el.matches('input[type=text],input[type=search],textarea'))return null;
  if(el.id)return '#'+el.id;
  const d=el.dataset||{};if(!d.act)return null;
  let s='[data-act="'+d.act+'"]';
  ['view','v','k','i','id','f','m'].forEach(a=>{if(d[a]!==undefined)s+='[data-'+a+'="'+String(d[a]).replace(/["\\]/g,'')+'"]';});
  return s;
}
function render(){
  const app=document.getElementById('app');let html='';let base='app';let key;
  try{document.documentElement.classList.remove('rl-attend');}catch(e){}
  const fkey=focusKey(document.activeElement);
  const oldSheet=app.querySelector('.sheet');const sheetTop=oldSheet?oldSheet.scrollTop:0;
  const visiteur=!D().onboarded;
  /* Le SOS s'ouvre pour tout le monde, même pour un visiteur qui n'est pas encore entré dans l'espace. */
  if(state.view==='sos'){base='app nobar';key='sos';html=viewSOS();}
  else if(state.view==='souffle'&&!visiteur){base='app nobar';key='souffle';html=viewSouffle();}
  else if(state.view==='instant'&&!visiteur){base='app nobar v-souffle';key='instant';html=viewInstant();}
  else if(visiteur&&['plans','about','apercu','commande','relais'].includes(state.view)){base='app nobar';key='peek-'+state.view;
    /* Le proche qui ouvre une fiche reçue lit la fiche, et rien d'autre ne la concurrence. Le logo mène à l'accueil. Le SOS du parent n'a pas sa place ici. */
    const recue=state.view==='relais'&&state.rl.e==='lu';
    html=(recue?'<header class="bar pubbar"><a class="wordmark" href="'+RACINE+'" data-act="accueil" aria-label="Parent écouté, parent éclairé. Revenir à l’accueil">'+LOGO+'<span>Parent écouté,<small>parent éclairé</small></span></a></header>':'<header class="bar"><button type="button" class="back" data-act="back">'+I.back+'Retour</button><button type="button" class="sos" data-act="go" data-view="sos">'+I.alert+'SOS</button></header>')+(state.view==='about'?viewAbout():state.view==='apercu'?viewApercu():state.view==='relais'?viewRelais():state.view==='commande'?viewCommande():viewPlans());}
  /* Un visiteur arrivé par le lien d'une fiche la lit tout de suite, sans rien avoir à créer. */
  else if(visiteur&&SITE&&state.view==='sit'&&SITS.some(x=>x.id===state.sit)){base='app nobar pub';key='pub-sit';html=barPub()+viewSit()+piedPub();}
  else if(visiteur&&SITE&&state.view==='kit'){state.kit='sits';base='app nobar pub';key='pub-kit';html=barPub()+viewKit()+piedPub();}
  /* La page à transmettre : un visiteur y arrive par le lien d'une association ou d'un professionnel. */
  else if(visiteur&&SITE&&state.view==='transmettre'){base='app nobar pub';key='pub-transmettre';html=barPub()+viewTransmettre()+'<footer class="foot"><a href="'+RACINE+'" data-act="accueil">Accueil</a><a href="'+RACINE+'fiches/" data-act="fiches">Les situations</a><a href="'+RACINE+'confidentialite.html">Confidentialité</a></footer>';}
  /* La vitrine. Un visiteur y arrive, et un parent déjà entré la retrouve par « Accueil » : c'est un écran comme les autres, on y revient avec « Retour ». */
  else if(visiteur||state.view==='intro'){base='app nobar';key='intro';html=viewIntro();}
  else{
    key=state.view;html+=(large()?tabs():'')+bar();
    switch(state.view){
      case 'today':html+=viewToday();break;
      case 'parcours':html+=viewParcours();break;
      case 'step':html+=viewStep();break;
      case 'carnet':html+=viewCarnet();break;
      case 'final':html+=viewFinal();break;
      case 'evo':html+=viewEvo();break;
      case 'photo':html+=viewPhoto();break;
      case 'kit':html+=viewKit();break;
      case 'sit':html+=viewSit();break;
      case 'exo':html+=viewExo();break;
      case 'me':html+=viewMe();break;
      case 'plans':html+=viewPlans();break;
      case 'apercu':html+=viewApercu();break;
      case 'relais':html+=viewRelais();break;
      case 'transmettre':html+=viewTransmettre();break;
      case 'commande':html+=viewCommande();break;
      case 'depots':html+=viewDepots();break;
      /* L'ancienne formule « Avec Antonio » n'existe plus : un écran gardé en mémoire par un ancien passage mène aux 3 offres. */
      case 'antonio':case 'letter':case 'avec':state.view='plans';html+=viewPlans();break;
      case 'data':html+=viewData();break;
      case 'about':html+=viewAbout();break;
      case 'deposer':html+=viewDeposer();break;
      default:html+=viewToday();
    }
    if(!large())html+=tabs();
  }
  /* Les animations d'apparition ne jouent qu'en entrant sur un écran ou en ouvrant une feuille, pas à chaque appui. */
  const entering=key!==state.lastKey;state.lastKey=key;
  if(entering)state.enterAt=Date.now();
  const age=(Date.now()-(state.enterAt||0))/1000;
  const sheetIn=!!state.sheet&&state.sheet!==state.lastSheet;state.lastSheet=state.sheet;
  if(state.sheet==='onboard')html+=sheetOnboard(sheetIn);
  if(state.sheet==='upgrade')html+=sheetUpgrade(sheetIn);
  if(state.sheet==='voix')html+=sheetVoix(sheetIn);
  /* « lum » : la lumière qui se lève une fois sur la photo. Si l'écran est redessiné entre-temps, elle reprend là où elle en était (--fx-age). */
  /* « v-… » dit quel écran est affiché, et « wide » marque les quatre onglets : la mise en page pour grand écran s'appuie dessus. */
  base+=' v-'+key+(TAB_VIEWS.includes(key)?' wide':'')+' h-'+moment();
  heureClasse();vueClasse(key);
  app.className=base+(entering?' enter':'')+(FX_OK&&age<4.8?' lum':'');
  if(FX_OK&&age<4.8&&app.style&&app.style.setProperty)app.style.setProperty('--fx-age',age.toFixed(2)+'s');
  app.removeAttribute('data-prerender');
  app.innerHTML=html;
  /* Un message bref survit au rendu suivant du même écran (sinon l'aide en cas de détresse disparaissait aussitôt), mais ne suit pas le parent sur un autre écran. */
  if(state.toast){if(state.toastView===state.view)renderToast();else state.toast='';}
  const sh=state.sheet?app.querySelector('.sheet'):null;
  if(sh&&sheetIn){try{sh.focus({preventScroll:true});}catch(e){}}
  else{
    if(sh)sh.scrollTop=sheetTop;
    if(fkey){
      let el=null;try{el=app.querySelector(fkey);}catch(e){}
      if(el){try{el.focus({preventScroll:true});}catch(e){}}
      else if(entering){const m=document.getElementById('main');if(m){try{m.focus({preventScroll:true});}catch(e){}}}
    }
  }
  if((state.view==='kit'&&state.kit==='tools'&&state.tool==='timer')||(state.view==='exo'&&state.exo==='minute'))drawTimer();
  syncStory(entering);
  titreSync();
  if(key==='intro')introLive();
  if(key==='step'){carnetHaut();lectureSync();}
  if(key==='souffle')souffleApres();
  fxMark();
  eauSync(entering);if(entering)eauArrive();
  refletGuette();
  sonGarde();
}
/* ---------- « Mon histoire » : adresse partageable (#histoire, sur le site) et un seul moment d'animation ---------- */
const STORY_HASH='#histoire';const TITLE0=SITE?TITRE_SITE:document.title;
/* Le moment de la journée est aussi posé sur la page entière : c'est là que le script du haut de page l'écrit avant le premier affichage. */
function heureClasse(){try{const c=document.documentElement.classList,m=moment();MOMENTS.forEach(k=>{c.toggle('h-'+k,k===m);});c.toggle('clair',m==='matin'||m==='jour');}catch(e){}}
/* L'écran affiché est dit à la page entière, pour que le fond de la page suive : le papier du carnet sur la vitrine, la brume de l'étang
   pendant la respiration. La couleur du haut du téléphone (barre d'état) suit aussi. */
const VUES_FOND=['intro','souffle'];
function vueClasse(key){
  try{
    /* « Prendre un instant » se passe au bord du même étang que « Souffler » : même fond de page, même couleur en haut du téléphone. */
    if(key==='instant')key='souffle';
    const de=document.documentElement,c=de.classList;VUES_FOND.forEach(k=>{c.toggle('vue-'+k,k===key);});
    const jour=c.contains('clair'),t=document.querySelector('meta[name="theme-color"]');
    if(t)t.setAttribute('content',key==='intro'?(jour?'#F2ECDB':'#07240F'):key==='souffle'?(jour?'#0E2A1B':'#061A0D'):'#07240F');
  }catch(e){}
}
function syncStory(entering){
  const on=state.view==='about';
  if(!on||!entering)return;
  const el=document.querySelector('.avec');
  if(!el||!('IntersectionObserver' in window)||!fxOn())return;
  el.classList.add('arm');
  const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){el.classList.add('seen');io.disconnect();}},{threshold:.35});
  io.observe(el);
}
function bar(){
  const back=BACK_VIEWS.includes(state.view)?'<button type="button" class="back" data-act="back">'+I.back+'Retour</button>':'';
  /* Sur grand écran, le nom de l'espace et le SOS sont dans la colonne de gauche : il ne reste ici que le bouton Retour, quand il y en a un. */
  /* Dans une étape, 3 traits sous la barre se remplissent pendant la lecture : comprendre, essayer, écrire. */
  const lect=state.view==='step'?'<span class="lecture" aria-hidden="true"><i><b></b></i><i><b></b></i><i><b></b></i></span>':'';
  if(large())return back?'<header class="bar sub">'+back+lect+'</header>':'';
  /* Le nom de l'espace mène à l'accueil, et un lien « Accueil » reste à côté du SOS sur tous les écrans de l'espace : la vitrine se retrouve en un geste. */
  const wm=back?'':'<a class="wordmark" href="'+RACINE+'#accueil" data-act="accueil" aria-label="Parent écouté, parent éclairé. Revenir à l’accueil">'+LOGO+'<span>Parent écouté,<small>parent éclairé</small></span></a>';
  return '<header class="bar'+(back?' sub':'')+'">'+back+wm+'<span class="bar-d"><a class="va-accueil" href="'+RACINE+'#accueil" data-act="accueil">'+I.home+'<span>Accueil</span></a><button type="button" class="sos" data-act="go" data-view="sos">'+I.alert+'SOS</button></span>'+lect+'</header>';
}
/* Les 3 temps d'une étape, dans l'ordre où on les vit. */
const TEMPS=[['comprendre','Comprendre'],['essayer','Essayer'],['ecrire','Écrire']];
/* Le temps de lecture d'une étape, compté sur ses mots, à un rythme tranquille. */
function minutesLecture(s){const n=[].concat(s.idee||[],s.vecu||[],s.ex||'',s.exo||'',s.obs||'').join(' ').split(/\s+/).filter(Boolean).length;return Math.max(2,Math.round(n/170));}
/* Où en est la lecture : la ligne de lecture descend du haut de l'écran (page en haut) au bas de l'écran (page en bas), et chaque trait dit quelle part de son temps elle a traversée. */
function lectureSync(){
  const r=document.querySelector('.bar .lecture');if(!r)return;
  const hs=TEMPS.map(t=>document.getElementById('t-'+t[0]));if(hs.some(h=>!h))return;
  const fin=document.querySelector('.etape>.quick');
  const sy=window.scrollY||window.pageYOffset||0,vh=window.innerHeight,max=Math.max(1,document.documentElement.scrollHeight-vh);
  const y=sy+vh*Math.min(1,sy/max);
  const top=e=>e.getBoundingClientRect().top+sy;
  const b=[top(hs[0]),top(hs[1]),top(hs[2]),fin?top(fin)+fin.offsetHeight:document.documentElement.scrollHeight];
  for(let i=0;i<3;i++){const q=Math.max(0,Math.min(1,(y-b[i])/Math.max(1,b[i+1]-b[i])));const f=r.children[i]&&r.children[i].firstChild;if(f&&f.style)f.style.transform='scaleX('+q.toFixed(3)+')';}
}
let lectTick=0;
function lectureScroll(e){if(lectTick)return;lectTick=1;const large=!!(e&&e.type==='resize');(window.requestAnimationFrame||setTimeout)(()=>{lectTick=0;if(large)carnetHaut();lectureSync();});}
/* ---------- erreurs de saisie : affichées sous le champ, sans rien effacer ---------- */
function fieldErr(id,msg){
  const el=document.getElementById(id);if(!el)return;
  let e=document.getElementById('err-'+id);
  if(!e){e=document.createElement('p');e.id='err-'+id;e.className='err';e.setAttribute('role','alert');el.insertAdjacentElement('afterend',e);}
  e.textContent=msg;el.setAttribute('aria-invalid','true');el.setAttribute('aria-describedby','err-'+id);
  try{el.focus();}catch(x){}
}
function clearErr(el){
  if(!el||!el.id||!el.hasAttribute('aria-invalid'))return;
  const e=document.getElementById('err-'+el.id);if(e)e.remove();
  el.removeAttribute('aria-invalid');el.removeAttribute('aria-describedby');
}
function clean(v,max){return String(v==null?'':v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,'').trim().slice(0,max);}
function updCount(t){
  const c=document.getElementById('draft-count');if(!c)return;const n=t.value.length;
  if(n>=LIM.draft*0.875){c.textContent=n+' / '+LIM.draft;c.className='count'+(n>=LIM.draft?' warn':'');}else c.textContent='';
}
/* ---------- accueil plein écran ---------- */
/* ---------- l'accueil : la page que voit un parent qui arrive pour la première fois ----------
   Une page longue, en chapitres. Chaque chapitre montre un vrai morceau de l'espace, pris dans ses contenus :
   des permissions, la dose du jour, une réponse à un dépôt, un schéma du parcours, un extrait de « Ce que j'ai vécu »,
   des cartes-images, les formules. Rien n'y est inventé au nom d'Antonio. */
/* Le sac de week-end, dessiné au trait. Il prend l'encre du moment (vert forêt le jour, vert pâle le soir), et ses pattes ont la couleur du fond. */
const SAC='<svg class="sac" viewBox="0 0 460 300" aria-hidden="true">'+
  '<ellipse class="sac-o" cx="208" cy="271" rx="178" ry="9"/><ellipse class="sac-o" cx="413" cy="291" rx="46" ry="5"/>'+
  '<path d="M170 98C172 48 286 44 290 100" stroke-opacity=".5"/>'+
  '<path class="sac-v" d="M52 150C52 118 70 104 100 100C160 92 240 92 300 100C330 104 348 118 348 150L352 232C353 254 340 266 318 266L82 266C60 266 47 254 48 232Z"/>'+
  '<path d="M92 121C160 111 240 111 308 121" stroke-dasharray="2 8"/>'+
  '<path d="M96 101C84 150 84 214 98 266"/><path d="M304 101C316 150 316 214 302 266"/>'+
  '<path d="M134 150L134 98C134 34 266 34 266 98L266 150"/><path d="M152 150L152 100C152 56 248 56 248 100L248 150"/>'+
  '<rect class="sac-p" x="125" y="140" width="36" height="42" rx="5"/><rect class="sac-p" x="239" y="140" width="36" height="42" rx="5"/>'+
  '<path d="M134 150L152 172M152 150L134 172M248 150L266 172M266 150L248 172" stroke-width="1.8"/>'+
  '<rect x="166" y="194" width="68" height="54" rx="6"/><path d="M166 211L234 211"/>'+
  '<path d="M346 152C378 176 380 236 350 268"/><path d="M340 164C364 186 366 230 342 258" stroke-opacity=".6"/>'+
  '<path d="M384 270C380 204 446 204 442 270"/><path d="M395 268C393 220 433 220 431 268" stroke-opacity=".6"/>'+
  '<rect class="sac-p" x="372" y="250" width="23" height="40" rx="10"/><rect class="sac-p" x="431" y="250" width="23" height="40" rx="10"/></svg>';
/* La table : le sac, et devant lui le début de la fiche d'exemple de Bastien (35 ans). Toute la feuille est un seul grand bouton :
   le bouton du bas s'étend sur elle (voir .fb-voir::after), et il ouvre la fiche entière. En dessous, la fiche pratique qui va avec. */
function tableHtml(){
  const f=RL_EX.g,s=SITS.find(x=>x.id==='relais');
  return '<div class="haut-table"><div class="nature">'+SAC+
    '<article class="fiche-b" aria-label="Le début d’une fiche d’exemple"><span class="fb-ex">Exemple</span>'+
    '<div class="fb-tete">'+LOGO+'<div><h2>'+esc(rlTitre(f))+'</h2><p>'+esc(rlSousTitre(f))+'</p></div></div>'+
    '<h3>Si tu ne lis que trois choses</h3><ol>'+f.trois.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol>'+
    '<button type="button" class="fb-voir" data-act="rl" data-k="exemple" data-v="g">Voir la fiche '+esc(rlDe(f.qui))+' en entier</button></article></div>'+
    (SITE&&s?'<a class="haut-sit" href="'+ficheUrl('relais')+'" data-act="sit" data-id="relais"><span class="tx"><b>'+esc(s.t)+'</b><span>'+esc(s.s)+'</span></span>'+I.chev+'</a>':'')+'</div>';
}
function introDoseLabel(){if(new Date().getDay()===0)return 'Dose spéciale du dimanche';let j='';try{j=new Date().toLocaleDateString('fr-CH',{weekday:'long',day:'numeric',month:'long'});}catch(e){}return 'La dose du '+(j||fmtDate(todayIso()));}
/* Ce que le nom de l'espace veut dire, en 2 phrases, puis le mot d'Antonio, signé, tel qu'il l'a écrit le 19 novembre 2026.
   « Écouté » : le parent a la parole, et l'espace l'aide à être entendu par quelqu'un s'il le souhaite. « Éclairé » : il repart avec quelque chose.
   Personne ne lit ses mots ici : la phrase ne promet donc pas une écoute par quelqu'un, elle dit ce que le parent peut faire. */
const NOM_SENS=[['Écouté','Ici, vous avez la parole. Vous écrivez ce que vous vivez avec vos mots, puis vous préparez, si vous le souhaitez, ce que vous aimeriez dire à un proche ou lors d’une réunion.'],
  ['Éclairé','Vous repartez avec une question qui aide à y voir clair, ou avec une idée à essayer chez vous.']];
const MOT_ANTONIO='Mon expérience d’éducateur social m’a guidé dans le choix des questions et des outils que vous trouverez ici. Aujourd’hui, vous avez peut-être besoin de souffler, d’écrire ce que vous gardez pour vous ou de trouver les mots pour en parler à quelqu’un. C’est vous qui choisissez.';
const ROLE_A='Éducateur social, responsable d’une équipe socio-éducative';
function nomSensHtml(){
  return '<section class="nom-sens" aria-labelledby="nom-sens-t"><h2 id="nom-sens-t">Parent écouté, parent éclairé</h2>'+
    NOM_SENS.map(x=>'<p class="ns-l"><b>'+x[0]+'.</b> '+x[1]+'</p>').join('')+
    '<figure class="mot-a"><blockquote><p>'+MOT_ANTONIO+'</p></blockquote><figcaption><b>Antonio Company</b><span>'+ROLE_A+'</span></figcaption></figure></section>';
}
function viewIntro(){
  const m=moment();
  /* Un parent déjà entré retrouve la même vitrine. Les boutons disent alors ce qui l'attend : son espace, et son parcours s'il l'a commencé. */
  const membre=!!D().onboarded,repr=membre&&parcoursCommence(),cur=currentStepIdx();
  const cta=wide=>'<button type="button" class="btn primary'+(wide?' wide':'')+'" data-act="entrer" data-v="today">'+I.sun2+(membre?'Ouvrir mon espace':'Commencer gratuitement')+'</button>';
  const priv=SITE?'Cette version de test est gratuite, et tout ce que vous écrivez reste sur votre appareil. Chaque dépôt reçoit une question et une lumière, choisies parmi des textes écrits à l’avance.':'Vos notes restent sur votre appareil. Quand vous déposez, votre texte part sans votre nom et une intelligence artificielle écrit la réponse, avec la méthode d’Antonio.';
  const sec=(k,t,l,c)=>'<section class="acc acc-'+k+'" aria-labelledby="acc-'+k+'-t"><div class="acc-h"><h2 id="acc-'+k+'-t" class="acc-t">'+t+'</h2>'+(l?'<p class="acc-l">'+l+'</p>':'')+'</div><div class="acc-c">'+c+'</div></section>';
  const steps=allSteps();const etape=id=>steps.find(x=>x.id===id)||{};
  /* La dose du jour, la vraie. Sur le site, la page est écrite à l'avance : introLive() remet la dose d'aujourd'hui. */
  const dose='<div class="dose"><span class="label">'+esc(introDoseLabel())+'</span><p>'+esc(curatedDose())+'</p><span class="sig">Antonio</span></div>';
  /* Les situations : des scènes précises, rangées par âge, pour que le parent d'un jeune enfant, d'un ado ou d'un adulte se reconnaisse.
     Sur le site, chaque nom est un lien vers la fiche, qui se lit tout de suite et s'envoie telle quelle. */
  const SC=[['Avec un enfant',['sommeil','crise','repas']],['Avec un ado',['ado','ecrans','ecole']],['Avec un adulte',['grandir','loin','pros']],['Et pour vous',['epuise','culpa','regard']]];
  const lien=id=>{const s=SITS.find(x=>x.id===id);if(!s)return '';const tx='<span aria-hidden="true">'+s.e+'</span> '+esc(s.t);return '<li>'+(SITE?'<a href="'+ficheUrl(id)+'" data-act="sit" data-id="'+id+'">'+tx+'</a>':'<span>'+tx+'</span>')+'</li>';};
  const scenes='<div class="acc-scenes">'+SC.map(g=>'<div class="sc"><h3>'+g[0]+'</h3><ul class="acc-chips">'+g[1].map(lien).join('')+'</ul></div>').join('')+'</div>'+
    (SITE?'<a class="btn" href="'+RACINE+'fiches/" data-act="fiches">Voir les '+SITS.length+' situations</a>':'');
  const pictos='<p class="acc-st">La routine du soir, en '+ROUTINE_DEF.length+' images</p><ul class="acc-pictos">'+ROUTINE_DEF.map(id=>{const p=PICTOS.find(x=>x[0]===id);return p?'<li class="pc">'+pictoImg(id,72,true)+'<b>'+esc(p[1])+'</b></li>':'';}).join('')+'</ul>'+
    '<p class="acc-l acc-outils-l">Vous y trouvez aussi '+PICTOS.length+' images pour montrer à votre enfant ce qui vient d’abord et ce qui vient ensuite, un minuteur, des exercices pour souffler et un bouton SOS.</p>';
  /* Déposer : un exemple, avec une question et une lumière prises dans celles de l'espace. */
  const depot='<div class="mirror"><span class="lbl">Un exemple</span><p class="depot you">« Ce soir, j’ai crié pour une histoire de chaussettes. Il a pleuré, et moi aussi après. Je m’en veux. »</p><p class="q">'+esc(LOCAL_Q[1])+'</p><p class="l">'+esc(WORDS[10])+'</p>'+
    (()=>{const c=SITS.find(x=>x.id==='culpa');return c?'<p class="piste-ex">L’application propose aussi une piste, d’après vos mots. Ici, ce serait '+(SITE?'<a href="'+ficheUrl('culpa')+'" data-act="sit" data-id="culpa">'+esc(c.t)+'</a>':'« '+esc(c.t)+' »')+'.</p>':'';})()+'</div>'+
    '<p class="hint">'+(SITE?'Ce que vous écrivez reste sur votre appareil. Personne d’autre ne le lit.':'Votre texte part sans votre nom, et une intelligence artificielle écrit la réponse.')+'</p>'+
    '<button type="button" class="btn" data-act="porte" data-v="deposer">'+I.drop+'Déposer ce qui pèse</button>';
  /* Les permissions : 4 des 10 que l'espace propose. Le titre commence la phrase, chaque ligne la finit. */
  const perms='<ul class="acc-perms">'+[0,2,3,9].map(i=>PERMISSIONS[i]).filter(Boolean).map(p=>'<li>'+esc(p[1])+'</li>').join('')+'</ul><p class="acc-l">Ici, vous n’avez rien à prouver à personne.</p>';
  /* Le parcours : un schéma à dérouler, les 6 mois et leurs 24 étapes, puis un extrait de ce qu'Antonio raconte à l'étape 2. */
  const sch=schHtml('vague').replace('<span class="label">Le schéma</span>','<span class="label">Un schéma de l’étape 7, à dérouler</span>');
  const mois='<p class="acc-st">Les 6 mois, étape par étape</p><div class="acc-mois">'+PARCOURS.map((mm,mi)=>'<details class="mois"'+(mi===0?' open':'')+'><summary><span class="n">'+(mi+1)+'</span><span class="tx"><b>'+esc(mm.m)+'</b><span>Mois '+(mi+1)+'</span></span>'+I.chev+'</summary><ol start="'+(mi*4+1)+'">'+mm.steps.map(s=>'<li>'+esc(s.t)+'</li>').join('')+'</ol></details>').join('')+'</div>';
  const cr=etape('croire');const vec=Array.isArray(cr.vecu)?cr.vecu.slice(0,2):[];
  const vecu=!vec.length?'':'<div class="card vecu"><div class="from"><span class="av" aria-hidden="true">A</span><div><b>Ce que j’ai vécu</b><small>Antonio, à l’étape 2</small></div></div>'+vec.map(p=>'<p class="lesson">'+esc(p)+'</p>').join('')+'<div class="vecu-lien"><button type="button" class="linkbtn" data-act="peek-about">Lire mon histoire</button></div></div>';
  const allerParcours=repr?'<button type="button" class="btn" data-act="step" data-i="'+cur+'">'+I.path+'Reprendre mon parcours</button>':'<button type="button" class="btn" data-act="entrer" data-v="parcours">'+I.path+'Commencer le parcours de 6 mois</button>';
  /* Les formules, avec les prix affichés dans l'espace. */
  const plans='<ul class="acc-plans">'+[['free','Découverte','0 CHF','',F_TXT.free.c[0],'<button type="button" class="linkbtn" data-act="apercu">Essayer une étape, en 3 minutes</button>'],['parcours','Le parcours','84 CHF','en tout','En une fois, ou en 6 fois 14 CHF. '+TOTAL_84,'<button type="button" class="linkbtn" data-act="apercu">Essayer une étape avant de choisir</button>'],['relais','Passer le relais','49 CHF','une seule fois',F_TXT.relais.c[0],'<button type="button" class="linkbtn" data-act="rl" data-k="exemple">Voir un exemple de fiche terminée</button>']].map(x=>'<li><div class="h"><b>'+x[1]+'</b><span class="prix">'+x[2]+(x[3]?' <small>'+x[3]+'</small>':'')+'</span></div><p class="acc-benef">'+F_TXT[x[0]].b+'</p><p>'+x[4]+'</p>'+x[5]+'</li>').join('')+'</ul>'+'<button type="button" class="btn" data-act="peek-plans">Voir les 3 offres en détail</button><button type="button" class="linkbtn acc-offrir" data-act="cadeau">Offrir à un parent</button>';
  /* Les questions qu'un parent se pose avant de commencer. */
  const Q=[
    ['Faut-il créer un compte ?','Non. Il n’y a ni compte ni mot de passe. Votre espace se crée sur votre appareil dès votre premier geste, et vous pouvez ensuite le personnaliser si vous le souhaitez.'],
    ['Est-ce pour moi si mon enfant n’a pas de diagnostic ?','Oui. Cet espace est pensé d’abord pour la mère ou le père d’une personne en situation de handicap, avec ou sans diagnostic, quel que soit son âge, tout-petit ou adulte depuis longtemps. Si vous êtes parent et que vous traversez une période difficile, vous y êtes aussi le bienvenu.'],
    ['Faut-il prendre un abonnement ?','Non. Tout ce qui est gratuit le reste, sans limite de durée. Le parcours et Passer le relais se paient une fois, et rien n’est prélevé ensuite. Le parcours peut aussi se payer en 6 fois, pour le même total.'],
    ['Qui lit ce que j’écris ?',SITE?'Personne. Dans cette version, tout ce que vous écrivez reste sur votre appareil, et rien n’est envoyé.':'Vos notes restent sur votre appareil. Quand vous déposez, votre texte part sans votre nom, et une intelligence artificielle écrit la réponse.'],
    ['Qui me répond ?',SITE?'Les textes de l’espace sont écrits à l’avance, sous la responsabilité d’Antonio Company. Chaque dépôt reçoit une question et une lumière, que l’application choisit parmi ces textes. Aucune intelligence artificielle n’écrit de réponse, et personne ne lit ce que vous écrivez.':'Quand vous déposez, une intelligence artificielle écrit la réponse, avec la méthode d’Antonio, et l’espace vous le dit. Les autres textes sont écrits à l’avance, sous la responsabilité d’Antonio Company.'],
    ['Combien de temps cela demande-t-il ?','Vous pouvez venir 30 secondes pour lire la dose du jour, ou 2 minutes pour souffler. Si vous suivez le parcours, comptez 5 à 10 minutes par semaine pour lire une étape, puis un essai chez vous et quelques mots dans votre carnet. Si vous vous absentez, rien ne s’accumule, et votre étape vous attend.'],
    ['Est-ce que cela remplace un professionnel ?','Non. Cet espace vous soutient entre deux rendez-vous, et il ne remplace ni un médecin ni un thérapeute. En cas d’urgence, le bouton SOS vous donne les numéros à appeler.']
  ];
  /* Une espace insécable garde le point d'interrogation avec le dernier mot de la question. */
  const faq='<div class="acc-faq-l">'+Q.map(q=>'<details class="faq"><summary><span>'+q[0].replace(/ \?$/,'\u00a0?')+'</span>'+I.chev+'</summary><p>'+q[1]+'</p></details>').join('')+'</div>';
  /* La fin : la phrase qu'Antonio adresse aux parents à l'étape 4, puis le bouton. */
  const ob=etape('objectifs');const cit=((typeof ob.vecu==='string'?ob.vecu:'').match(/Vous qui me lisez.*$/)||[''])[0];
  /* Le premier écran, « le carnet sur la table » : la phrase d'accueil en grand, une question, et 3 réponses qui tiennent chacune en un geste.
     À côté, un sac de week-end et une fiche de relais d'exemple, que l'on ouvre d'un toucher. Le nom de l'espace et le SOS restent en haut de l'écran. */
  return '<main id="main" tabindex="-1" class="view intro" style="padding-top:0">'+
    '<div class="hbar bleed"><span class="wordmark">'+LOGO+'<span>Parent écouté,<small>parent éclairé</small></span></span><button type="button" class="sos" data-act="go" data-view="sos">'+I.alert+'SOS</button></div>'+
    '<div class="seuil" id="accueil"><div class="haut-texte">'+
    '<p class="pour">Pour la mère ou le père d’une personne en situation de handicap</p>'+
    '<h1>On vous demande souvent comment va votre enfant. <span class="ici">Ici, on commence par vous.</span></h1>'+
    '<p class="besoin-l"><span class="besoin">'+DEP_Q.replace(/ (\S+) \?$/,' <span class="nb">$1 ?</span>')+'</span></p>'+
    portes(true)+'</div>'+
    nomSensHtml()+
    tableHtml()+
    '<div class="haut-suite">'+
    (repr?'<button type="button" class="voie" data-act="step" data-i="'+cur+'">'+I.path+'<span>Reprendre mon parcours</span></button>':'<button type="button" class="voie" data-act="entrer" data-v="parcours">'+I.path+'<span>Commencer le parcours de 6 mois</span></button>')+
    (membre?'<button type="button" class="voie" data-act="entrer" data-v="today">'+I.sun2+'<span>Ouvrir mon espace</span></button>':'')+
    '<p class="rassure">'+(SITE?'Version de test, gratuite et sans compte. Ce que vous écrivez reste sur votre appareil.':'Gratuit et sans compte. Vos notes restent sur votre appareil.')+'</p></div></div>'+
    sec('dose','Chaque matin, une dose de lumière','Voici celle d’aujourd’hui. Demain, une autre vous attendra.',dose)+
    sec('outils','Des pistes pour les jours difficiles','Vous y trouvez '+SITS.length+' situations de la vraie vie, avec des pistes à essayer dès ce soir. Chaque fiche se lit en 2 minutes'+(SITE?' et s’envoie à quelqu’un qui compte pour vous.':'.'),scenes+pictos)+
    sec('depot','Un endroit pour déposer ce qui pèse',SITE?'Vous écrivez ce que vous avez sur le cœur, sans donner de prénom. Vous gardez vos mots pour vous, ou vous préparez comment les dire à quelqu’un. En retour, vous recevez une question qui ouvre et une lumière.':'Vous écrivez ce que vous avez sur le cœur, sans donner de prénom. En retour, vous recevez une question qui ouvre et une lumière.',depot)+
    sec('perm','Ici, vous avez le droit','',perms)+
    sec('parcours','6 mois pour comprendre, essayer et avancer','Le parcours compte 24 étapes, une par semaine. À chaque étape, un schéma vous fait comprendre une idée, Antonio vous raconte ce qu’il a vécu, vous essayez chez vous et vous écrivez quelques mots dans votre carnet de route.',sch+'<button type="button" class="btn acc-essai" data-act="apercu">'+I.path+'Essayer cette étape, en 3 minutes</button>'+mois+vecu+allerParcours)+
    sec('relais','Passer le relais, l’esprit plus léger','Un week-end chez un proche, une soirée, une première nuit ailleurs. Vous préparez une page pour la personne qui garde votre enfant, avec vos mots. Elle sait l’essentiel en 1 minute.',rlVitrineHtml())+
    '<section class="voice" aria-labelledby="voice-t"><h2 id="voice-t" class="sr">Qui est derrière cet espace</h2><p class="say">Avant d’accompagner des familles, j’ai moi-même été accueilli dans une famille.</p><p>J’ai été placé en famille d’accueil à 10 ans, je suis travailleur social depuis mes 19 ans et je suis père de 3 enfants. Moi aussi, j’ai connu ces périodes où la santé d’un enfant prend beaucoup de place.</p><p>Avec le temps, j’ai appris à composer, à apprendre et à évoluer avec la différence, et c’est ce que j’ai voulu mettre dans cet espace.</p><div class="who"><span class="av" aria-hidden="true">A</span><span class="who-tx"><b>Antonio Company</b><small>'+ROLE_A+'</small></span><button type="button" class="btn small" data-act="peek-about">Lire mon histoire</button></div></section>'+
    sec('formules','Vous commencez gratuitement','Ensuite, vous payez une fois ce qui vous sert, sans abonnement. Voici les 3 offres, avec les prix prévus pour la Suisse. Dans cette version d’essai, aucun montant réel n’est débité.',plans)+
    sec('faq','Vos questions','',faq)+
    '<section class="acc-fin" aria-label="Pour commencer"><img class="finbg" src="'+PHOTO_DIR+'eau-g.webp" alt="" width="1120" height="840" loading="lazy" decoding="async">'+(cit?'<blockquote><p>'+esc(cit)+'</p><footer>Antonio</footer></blockquote>':'')+cta(true)+'</section>'+
    '<p class="hint" style="text-align:center">'+priv+'</p>'+
    (ESSAI?'<p class="hint essai-l" style="text-align:center">Vous êtes sur une version d’essai, à une adresse à part. Le site habituel ne change pas.</p>':'')+
    '<div class="cta-flot">'+cta(false)+'</div></main>'+
    '<footer class="foot"><button type="button" class="linkbtn" data-act="peek-plans">Les 3 offres</button>'+(SITE?'<a href="'+RACINE+'fiches/" data-act="fiches">Les situations</a><a href="'+RACINE+'transmettre/" data-act="transmettre">Une page à transmettre</a><a href="'+RACINE+'confidentialite.html">Confidentialité</a><a href="'+RACINE+'conditions.html">Conditions générales</a>'+(MENTIONS?'<a href="'+RACINE+'mentions-legales.html">Mentions légales</a>':''):'')+'</footer>';
}
/* Les mots et la lumière de l'heure, sur un écran écrit à l'avance dans la page : le moment de la journée, « Bonsoir », « ce soir ». */
function heureLive(){
  const app=document.getElementById('app');if(!app||!app.querySelectorAll)return;const m=moment();
  heureClasse();
  try{if(app.classList)MOMENTS.forEach(k=>{app.classList.toggle('h-'+k,k===m);});}catch(e){}
  try{app.querySelectorAll('[data-'+m+']').forEach(el=>{const t=el.getAttribute('data-'+m);if(el.textContent!==t)el.textContent=t;});}catch(e){}
}
/* Ce qui vit sur l'accueil une fois la page à l'écran : la dose du jour (la page a pu être écrite un autre jour),
   et le bouton flottant, qui apparaît quand le bouton du haut est sorti de l'écran et s'efface quand celui du bas arrive. */
let introIO=null;
function introLive(){
  if(introIO){try{introIO.disconnect();}catch(e){}introIO=null;}
  const app=document.getElementById('app');if(!app||!app.querySelector)return;const m=app.querySelector('main.intro');if(!m)return;
  heureLive();
  const dp=m.querySelector('.acc-dose .dose p'),dl=m.querySelector('.acc-dose .dose .label');
  if(dp){const tx=curatedDose();if(dp.textContent!==tx)dp.textContent=tx;}
  if(dl){const lb=introDoseLabel();if(dl.textContent!==lb)dl.textContent=lb;}
  const fl=m.querySelector('.cta-flot'),haut=m.querySelector('.seuil'),bas=m.querySelector('.acc-fin');
  if(!fl||!haut||!bas||!('IntersectionObserver' in window))return;
  const vu=new Map();
  introIO=new IntersectionObserver(es=>{es.forEach(e=>vu.set(e.target,e.isIntersecting));if(vu.has(haut)&&vu.has(bas))fl.classList.toggle('on',!vu.get(haut)&&!vu.get(bas));},{threshold:0});
  introIO.observe(haut);introIO.observe(bas);
}
/* ---------- aujourd’hui ---------- */
/* La date du jour en toutes lettres, pour le haut de « Aujourd'hui ». */
function jourLong(){try{const s=new Date().toLocaleDateString('fr-CH',{weekday:'long',day:'numeric',month:'long'});return s.charAt(0).toUpperCase()+s.slice(1);}catch(e){return fmtDate(todayIso());}}
/* Le fil du parcours : 24 points groupés par mois. Un point plein est une étape faite, le point cerclé est l'étape du moment. Il mène au parcours. */
function filHtml(){
  const d=D(),S=allSteps(),cur=currentStepIdx(),done=doneCount();
  const pts=S.map((s,i)=>'<i class="'+(d.steps[s.id]?'f':(i===cur?'c':''))+(i&&i%4===0?' m':'')+'"></i>').join('');
  const txt=done>=24?'Parcours terminé':'Étape '+(cur+1)+' sur 24';
  return '<button type="button" class="fil" data-act="go" data-view="parcours" aria-label="'+txt+'. '+done+' étape'+(done>1?'s':'')+' faite'+(done>1?'s':'')+'. Voir le parcours."><span class="pts" aria-hidden="true">'+pts+'</span><span class="ou">'+txt+'</span></button>';
}
/* Un morceau du sentier, dessiné derrière chaque étape du parcours : il arrive du haut jusqu'au rond, puis repart vers le bas.
   Le rond est à gauche ou à droite une fois sur deux, d'où les lacets. Le dessin s'étire avec la hauteur de la ligne. */
function sentierSvg(droite,hautFait,basFait,sansBas){
  const x=droite?68:28;
  return '<svg class="trace" viewBox="0 0 96 100" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path'+(hautFait?' class="fait"':'')+' d="M48 0 C48 28,'+x+' 22,'+x+' 50"/>'+(sansBas?'':'<path'+(basFait?' class="fait"':'')+' d="M'+x+' 50 C'+x+' 78,48 72,48 100"/>')+'</svg>';
}
/* « Personnaliser mon espace » : proposé une fois, après la première expérience, et jamais exigé. */
function persoCarte(){
  const d=D();if(d.perso||d.persoTard)return '';
  return '<div class="card perso reveal d4"><span class="label">Facultatif</span><p class="lesson" style="font-size:20px">Personnaliser mon espace</p><p class="hint">Vous pouvez donner votre prénom, l’âge de votre enfant et ce qui pèse en ce moment. L’espace vous proposera d’abord les situations qui vous concernent.</p><div class="row"><button type="button" class="btn small" data-act="onboard">'+I.user+'Personnaliser</button><button type="button" class="btn small ghost" data-act="perso-tard">Plus tard</button></div></div>';
}
function viewToday(){
  state.vuAuj=true;   /* le parent a vu « Aujourd'hui » pendant cette visite */
  const d=D();const t=todayIso();const m=d.moods[t];const st=allSteps()[currentStepIdx()];const rd=recentDepot();const mo=moment();
  const td=d.depots.filter(x=>x.date===t).slice(-1)[0];
  let html='<main id="main" tabindex="-1" class="view" style="padding-top:0"><div class="band bleed" style="background-image:url('+HERO+')"><span class="label">'+esc(jourLong())+'</span><h1 class="t1">'+esc(greeting())+(d.me?', '+esc(d.me):'')+'.</h1><p class="besoin">'+besoinHtml(mo,false)+'</p></div>';
  /* Pour celui qui a 30 secondes : les 3 portes, puis la dose du jour. */
  /* À la visite qui suit l'essai du parcours, le parent voit d'abord son propre geste et « Reprendre ici ». Une fois repris, la carte se range sous la dose.
     Le retour d'un relais, s'il est attendu, se montre aussi tout de suite. */
  const repr=repriseHtml(),reprHaut=!!repr&&!com().rp;
  html+=revoila()+portes(false)+(reprHaut?repr:'')+rlRappelHtml();
  html+='<div class="duo"><div class="duo-a">';
  html+='<div class="dose reveal d1"><span class="label">'+(new Date().getDay()===0?'Dose spéciale du dimanche':'La dose de lumière intérieure')+'</span><p>'+esc(doseText())+'</p>'+(d.doseDate===t&&d.doseText?'<span class="sig">Écrite pour vous par une intelligence artificielle, dans l’esprit d’Antonio</span>':'<div class="sigrow"><span class="sig">Antonio<button type="button" class="qui-b" data-act="voix" aria-label="Qui écrit cette dose ?">'+I.info+'</button></span><button type="button" class="linkbtn" data-act="go" data-view="about">Lire mon histoire</button></div>')+
    (rd&&state.sample?(can('parcours')?'<div class="row"><button type="button" class="btn small" data-act="dose-perso"'+(state.doseBusy?' disabled':'')+'>'+I.sun2+(state.doseBusy?'Un instant…':(d.doseDate===t?'Une autre dose pour moi':'Ma dose, d’après ce que j’ai déposé'))+'</button></div>':'<div class="row"><button type="button" class="btn small" data-act="upgrade" data-f="dose">'+I.lock+'Ma dose personnalisée</button></div>'):'')+
    /* Après la lecture, et seulement si le parent le choisit : l'étang, pour rester un moment avec ces mots. Il s'ouvre en silence. */
    (SON_OK?'<button type="button" class="instant-b" data-act="go" data-view="instant">'+I.drop+'<span class="tx"><b>Prendre un instant</b> <small>L’étang, à regarder ou à toucher</small></span></button>':'')+'</div>';
  /* Une raison simple de revenir : la dose change chaque jour, et l'espace le dit sans rien exiger. */
  html+='<p class="hint demain">Une nouvelle dose vous attend ici chaque matin.</p>';
  /* Le geste gardé pendant l'essai du parcours, une fois qu'il a été repris. */
  html+=(reprHaut?'':repr);
  /* Pour celui qui suit le parcours : le fil des 24 étapes, puis l'étape de la semaine, en grand, avec un seul geste. */
  const stFait=!!d.steps[st.id];const stAp=st.idx<23?stepEtat(st.idx+1):null;const stSuiv=st.idx<23?allSteps()[st.idx+1]:null;
  const neuf=st.idx===0&&!stFait&&!d.seen[st.id];const stAv=st.idx>0?allSteps()[st.idx-1]:null;
  const stLab=neuf?'Le parcours de 6 mois commence ici':(!stFait?'L’étape de la semaine':(stAp&&stAp.k==='bientot'?'Étape faite. La suivante s’ouvre '+dansJours(stAp.n)+'.':'Étape faite'));
  html+='<div class="reprendre reveal d2">'+filHtml()+'<button type="button" class="step now semaine'+(stFait?' done':'')+'" data-act="step" data-i="'+st.idx+'"><span class="haut"><span class="n" style="--p:'+Math.round(doneCount()/24*100)+'">'+(stFait?I.check:(st.idx+1))+'</span><span class="tx"><span class="label">'+stLab+'</span><b>'+esc(st.t)+'</b><span class="ou">Étape '+(st.idx+1)+' sur 24, '+esc(PARCOURS[st.mi].m)+'</span></span></span>'+
    (!stFait&&st.acc?'<span class="promesse">'+esc(st.acc)+'</span>':'')+
    (stFait&&stSuiv&&stSuiv.acc?'<span class="promesse"><b>Ensuite, '+esc(stSuiv.t)+'.</b> '+esc(stSuiv.acc)+'</span>':'')+
    '<span class="btn primary small aller">'+I.path+(stFait?'Relire l’étape':(d.seen[st.id]?'Reprendre l’étape':'Ouvrir l’étape'))+'</span></button>'+
    /* Une étape s'est ouverte pendant l'absence du parent, alors qu'il n'avait pas terminé la précédente : il sait où la retrouver, avec ses notes.
       La ligne disparaît dès qu'il a ouvert la nouvelle étape. */
    (stAv&&!d.seen[st.id]&&d.seen[stAv.id]&&!d.steps[stAv.id]?'<button type="button" class="lien-f etape-avant" data-act="step" data-i="'+stAv.idx+'">'+I.path+'<span>L’étape d’avant, « '+esc(stAv.t)+' », reste ouverte, avec '+(noteDe(stAv.id)?'vos notes':'son carnet')+'.</span></button>':'')+'</div>';
  /* Ce que le parent a ouvert dernièrement, pour le rouvrir sans chercher. */
  html+=recentsHtml();
  html+='</div><div class="duo-b">';
  if(td)html+='<div class="card depot-jour reveal d3"><span class="label">Votre dépôt d’aujourd’hui</span>'+depotHtml(td,true)+pistesDepotHtml(td)+'</div>';
  html+='<div class="card reveal d4"><span class="label">Comment ça va, là, maintenant ?</span><div class="moodrow">'+MOODS.map((x,i)=>'<button type="button" data-act="mood" data-i="'+i+'" aria-pressed="'+(m===i)+'" aria-label="'+esc(x[1])+'">'+x[0]+'</button>').join('')+'</div>'+(m!==undefined?'<p style="font-family:var(--font-display);font-size:17px;line-height:1.4">'+esc(MOOD_WORDS[m])+'</p>':'')+'</div>';
  html+=persoCarte();
  return html+'</div></div></main>';
}
function letterCard(){
  const L=D().letters;const l=L.length?L[L.length-1]:null;
  const txt=l?l.text:LETTER_EXAMPLE;
  return '<button type="button" class="letter reveal d1" data-act="letter" data-i="'+(l?L.length-1:-1)+'"><div class="from"><span class="av" aria-hidden="true">A</span><div><b>'+(l?'Le mot d’Antonio '+esc(deMois(l.date)):'Le mot d’Antonio, un exemple')+'</b><span>'+(l?esc(fmtDate(l.date)):'Démonstration de ce qu’il sera')+'</span></div></div><p>'+esc(txt.split('\n')[0])+'</p><span class="hint">'+(l?'Lire ':'Lire l’exemple ')+I.chev+'</span></button>';
}
/* ---------- déposer, sur le site : écouté d'abord, éclairé ensuite ----------
   L'espace fonctionne seul. Avant d'écrire, le parent lit en une phrase qui peut lire son texte et où il reste.
   Il écrit librement, puis il choisit : garder ses mots pour lui, ou préparer comment les dire à quelqu'un.
   Ses mots ne sont jamais reformulés. Rien n'est vendu ici, et il termine quand il le décide. */
const DEP_Q='Qu’aimeriez-vous qu’on comprenne de votre journée ?';
/* Avant d'écrire : qui peut lire le texte et où il reste, en une phrase. Puis comment l'espace fonctionne vraiment : il n'y a personne derrière l'écran. */
const DEP_QUI='Votre texte reste sur cet appareil, il n’est envoyé ni à Antonio ni à une intelligence artificielle, et seule une personne qui utilise cet appareil peut le lire.';
const DEP_SEUL='Cet espace fonctionne seul. Vous écrivez, puis vous recevez une question écrite à l’avance.';
function depotBoxSite(){
  const today=todayIso();const td=D().depots.filter(x=>x.date===today).slice(-1)[0];
  return '<div class="card depot-c reveal d2">'+
    '<p class="hint qui-lit" id="qui-lit">'+I.lock+DEP_QUI+'</p>'+
    '<textarea id="draft" maxlength="'+LIM.draft+'" aria-describedby="qui-lit" placeholder="Écrivez comme ça vient, sans donner de prénom.">'+esc(state.draft)+'</textarea>'+
    '<div class="dep-choix"><button type="button" class="btn primary" data-act="dsend">'+I.drop+'Garder ces mots pour moi</button>'+
    '<button type="button" class="btn" data-act="ddire">'+I.user+'J’aimerais le dire à quelqu’un</button></div>'+
    '<span class="count" id="draft-count" aria-hidden="true"></span>'+
    '<button type="button" class="linkbtn dep-silence" data-act="porte" data-v="souffle">'+I.wind+'<span>Je préfère le silence, souffler 2 minutes</span></button>'+
    '<p class="hint dep-comment"><button type="button" class="linkbtn" data-act="voix">Comment fonctionne cet espace ?</button></p>'+
    '</div>'+(td?emporteHtml(td):'');
}
/* Ce que le parent emporte après avoir écrit : ses mots, tels qu'il les a écrits, une question et une lumière écrites à l'avance,
   une fiche si ses mots en appellent une, et la suite qu'il choisit. « J'ai fini pour aujourd'hui » referme simplement. */
/* Les mots du parent, entiers et inchangés. Un long texte défile dans son cadre, que l'on atteint aussi au clavier. */
function motsHtml(t,lab){const long=t.length>420||(t.match(/\n/g)||[]).length>7;return '<p class="em-texte'+(long?' long" tabindex="0" role="group" aria-labelledby="'+lab:'')+'">'+esc(t)+'</p>';}
function emporteHtml(x){
  return '<section class="emporte" aria-labelledby="emporte-t"><h2 id="emporte-t">Ce que vous emportez</h2>'+
    (x.risk?depotHtml(x,true):depotHtml(x,true).replace(/<span class="lbl">.*?<\/span>/,'<span class="lbl">Une question pour y voir clair</span>'))+
    '<div class="em-mots"><span class="label" id="em-mots-l">Vos mots, tels que vous les avez écrits</span>'+motsCadre(x,'em-mots-l')+'</div>'+
    pistesDepotHtml(x)+
    '<div class="em-suite"><button type="button" class="btn" data-act="dire" data-k="ouvre" data-id="'+x.id+'">'+I.user+(x.dire?'Reprendre ce que j’aimerais dire':'J’aimerais le dire à quelqu’un')+'</button>'+
    '<button type="button" class="btn primary" data-act="dfin">'+I.check+'J’ai fini pour aujourd’hui</button></div>'+
    '<p class="hint">Vos mots sont gardés sur cet appareil, dans « Mes dépôts ». C’est vous qui décidez de les montrer à quelqu’un.</p></section>';
}
function depotBox(){
  if(state.sample===false)return depotBoxSite();
  const left=depotsLeft();const today=todayIso();const td=D().depots.filter(x=>x.date===today).slice(-1)[0];
  const head=lab=>'<div class="row" style="justify-content:space-between;align-items:center">'+lab+(left!==Infinity&&left>0?'<span class="pill">'+left+' dépôt'+(left>1?'s':'')+' offert'+(left>1?'s':'')+'</span>':'')+'</div>';
  let html='<div class="card depot-c reveal d2">';
  /* Après les 3 dépôts offerts, l'écran reste le même : le parent peut toujours écrire et garder ses mots. Seule la réponse manque.
     Ici, on vient poser ce qui pèse : l'écran ne propose rien à acheter. */
  if(left===0){
    html+='<label class="label" for="draft">Qu’est-ce qui pèse, là, maintenant ?</label>'+
      '<textarea id="draft" maxlength="'+LIM.draft+'" placeholder="Écrivez comme ça vient, sans prénom." style="min-height:150px">'+esc(state.draft)+'</textarea>'+
      '<div class="row" style="align-items:center"><button type="button" class="btn primary" data-act="dsend">'+I.drop+'Déposer</button><span class="count" id="draft-count" aria-hidden="true"></span></div>'+
      '<p class="hint">Vos 3 dépôts avec réponse sont utilisés. Vous pouvez toujours déposer ici, et vos mots sont gardés pour vous, sur votre appareil.</p>';
  }else{
    /* Les 2 intentions (« Écoutez-moi », « Et concrètement ? ») n'existent que là où une intelligence artificielle répond vraiment de 2 façons.
       Sur le site, l'écoute est ici, et les pistes concrètes sont dans les fiches : chaque bouton fait ce que dit son libellé. */
    html+='<label class="label" for="draft">Qu’est-ce qui pèse, là, maintenant ?</label>'+
      (state.sample?'<div class="chips attente" role="group" aria-label="Ce que vous attendez"><button type="button" class="chip" data-act="dmode" data-v="listen" aria-pressed="'+(state.depotMode==='listen')+'">Écoutez-moi</button><button type="button" class="chip" data-act="dmode" data-v="advice" aria-pressed="'+(state.depotMode==='advice')+'">Et concrètement, je fais quoi ?</button></div>':'')+
      '<textarea id="draft" maxlength="'+LIM.draft+'" placeholder="Écrivez comme ça vient, sans prénom." style="min-height:150px">'+esc(state.draft)+'</textarea>'+
      '<div class="row" style="align-items:center">'+(state.busy?'<button type="button" class="btn" data-act="dstop">'+I.stop+'Arrêter</button>':'<button type="button" class="btn primary" data-act="dsend">'+I.drop+'Déposer</button>')+'<span class="count" id="draft-count" aria-hidden="true"></span>'+(left!==Infinity&&left>0?'<span class="pill reste">'+left+' dépôt'+(left>1?'s':'')+' offert'+(left>1?'s':'')+'</span>':'')+'</div>'+
      (state.sample?'<p class="hint">La réponse est écrite par une intelligence artificielle, avec la méthode d’Antonio. Ce n’est pas Antonio qui vous répond ici.</p>':'')+
      (state.sample===false?'<p class="hint">Dans cette version de test, votre texte ne quitte pas votre appareil. Vous recevez une question et une lumière choisies par l’application parmi des textes écrits à l’avance. <button type="button" class="linkbtn" data-act="voix">Qui me répond ?</button></p>':'');
  }
  if(state.busy)html+='<div class="mirror"><div class="think" role="status"><span class="dotp"></span>Je vous lis…</div></div>';
  if(td&&!state.busy)html+=depotHtml(td,true)+pistesDepotHtml(td);
  html+='</div>';return html;
}
function depotHtml(x,compact){
  let out='<div class="mirror'+(x.id===state.fresh?' surface':'')+'"><span class="lbl">Le '+esc(dateLongue(x.date)||fmtDate(x.date))+(x.time?' à '+esc(hm(x.time).replace(/^0/,'')):'')+'</span>'+(compact?'':'<p class="depot you">« '+esc(x.text.length>220?x.text.slice(0,220)+'…':x.text)+' »</p>');
  if(x.risk)out+=riskHtml('q');
  if(x.miroir)out+='<p class="m">'+esc(x.miroir)+'</p>';
  if(x.question)out+='<p class="q">'+esc(x.question)+'</p>';
  if(x.lumiere)out+='<p class="l">'+esc(x.lumiere)+'</p>';
  if(x.conseil)out+='<div class="q">'+mdLite(x.conseil)+'</div>';
  /* Une réponse écrite par le modèle le dit, partout où elle s'affiche. En mode local, il n'y a ni phrase-miroir ni conseil. */
  if(x.miroir||x.conseil)out+='<p class="hint ia">Cette réponse a été écrite par une intelligence artificielle.</p>';
  const row=[];
  if(!x.conseil&&state.sample)row.push('<button type="button" class="btn small" data-act="dconcret" data-id="'+x.id+'">'+I.bulb+'Et concrètement ?</button>');
  if(can('antonio'))row.push('<label class="share"><input type="checkbox" data-act="share" data-id="'+x.id+'"'+(D().shared[x.id]?' checked':'')+'> Partager ce dépôt avec Antonio'+(DEMO?' (démonstration)':'')+'</label>');
  if(!compact&&state.sample===false)row.push('<button type="button" class="btn small" data-act="dire" data-k="ouvre" data-id="'+x.id+'">'+I.user+(x.dire?'Reprendre ce que j’aimerais dire':'J’aimerais le dire à quelqu’un')+'</button>');
  if(row.length)out+='<div class="row" style="align-items:center">'+row.join('')+'</div>';
  return out+'</div>';
}
/* ---------- écoute ---------- */
const LOCAL_Q=['Qu’est-ce qui, dans tout ça, dépend vraiment de vous ?','Si une amie vivait exactement cela, que lui diriez-vous ?','Qu’est-ce qui vous a tenu debout aujourd’hui, même un peu ?','De quoi auriez-vous besoin ce soir, en une phrase ?','Qu’est-ce que votre enfant a fait aujourd’hui que vous n’avez pas eu le temps de voir ?'];
function ctx(){return 'enfant '+(D().age?AGES[D().age].toLowerCase():'d’âge non précisé')+' ; ce qui pèse le plus pour ce parent : '+(D().weights.length?D().weights.map(w=>(WEIGHTS.find(x=>x[0]===w)||['',w])[1].toLowerCase()).join(', '):'non précisé');}
function listenPrompt(text){
  return 'Tu es la voix de « Parent Écouté, Parent Éclairé », un espace d’écoute créé par Antonio Company, travailleur social depuis ses 19 ans (responsable d’une équipe socio-éducative, auprès de personnes en situation de handicap ou en difficulté et de leurs familles ; père de trois enfants ; il a lui-même connu la famille d’accueil dans son enfance). Un parent vient de déposer ce qui pèse. Ta tâche : l’écouter, pas le conseiller. Réponds UNIQUEMENT avec un objet JSON : {"miroir":"...","question":"...","lumiere":"..."}.\n'+
  '« miroir » : une ou deux phrases qui reformulent ce que le parent vit, avec ses mots, en nommant l’émotion probable sans l’imposer (« on dirait que… »), sans aucun conseil, sans jugement, sans minimiser. « question » : une seule question ouverte, courte, qui aide le parent à voir plus clair ou à se reconnecter à ses ressources ; jamais « pourquoi ». « lumiere » : une phrase chaleureuse et vraie, jamais mièvre, qui reconnaît ce que le parent fait déjà, ou lui donne une permission (droit à la fatigue, à la colère, au repos). Français de Suisse romande, vouvoiement, aucun prénom, aucun diagnostic. Écris comme Antonio parle, avec des phrases simples et complètes, reliées par « et », « mais » ou « parce que ». N’utilise ni deux-points, ni point-virgule, ni tiret long, ni point médian, ni phrase sans verbe, ni formule du type « pas ceci, pas cela ». Si le message évoque un danger immédiat (idées suicidaires, violence grave), « lumiere » commence par inviter doucement à appeler le 143 (La Main Tendue) ou le 144.\n\nContexte : '+ctx()+'.\n\nDÉPÔT :\n"""\n'+text.slice(0,6000)+'\n"""';
}
function advicePrompt(){
  return 'Tu es la voix de « Parent Écouté, Parent Éclairé », celle d’un travailleur social expérimenté (dans le métier depuis ses 19 ans, auprès d’enfants, d’adolescents et d’adultes en situation de handicap ou en difficulté, responsable d’une équipe socio-éducative, père). Tu parles à un parent, en français de Suisse romande, vouvoiement, chaleur, zéro jargon, zéro jugement. Aucun diagnostic, aucun trouble nommé, aucun médicament, aucun prénom. Contexte : '+ctx()+'.\n'+
  'Structure en quatre parties courtes avec ces titres exacts précédés de « ## » : « Ce que j’entends » (deux phrases, sans juger, qui reconnaissent l’effort), « Ce que vous pouvez essayer » (trois pistes concrètes en liste à puces, réalistes ce soir ou cette semaine : prévisibilité, moins de mots, choix entre deux options, d’abord/ensuite, routines visuelles, sécurité d’abord, observer ce qui précède), « Pour vous » (une ou deux phrases pour le parent lui-même), « Si ça continue » (une phrase : quand et à qui demander de l’aide, sans dramatiser ; pédiatre ou médecin, l’équipe de l’institution ou de l’école, Pro Infirmis, associations de parents ; La Main Tendue 143 si le parent va très mal). Écris comme Antonio parle, avec des phrases simples et complètes, reliées par « et », « mais » ou « parce que ». N’utilise ni deux-points, ni point-virgule, ni tiret long, ni point médian, ni phrase sans verbe, ni formule du type « pas ceci, pas cela ». Maximum 200 mots. Pas de gras. Termine par une phrase simple et vraie.';
}
const RISK=/(suicid|me tuer|en finir|plus envie de vivre|le tuer|la tuer|je vais le frapper|je vais la frapper)/i;
async function sendDepot(suite){
  if(state.busy)return;
  const text=clean(state.draft,LIM.draft);if(text.length<5){fieldErr('draft','Écrivez quelques mots, comme ça vient (cinq caractères au moins).');return;}
  const sansReponse=depotsLeft()===0;
  const d=D();const n=new Date();const dep={id:'d'+Date.now(),date:todayIso(),time:pad(n.getHours())+':'+pad(n.getMinutes()),text,mode:state.depotMode};
  if(RISK.test(text)){dep.risk=true;toast('Si c’est urgent, appelez le 143 (La Main Tendue) ou le 144, de jour comme de nuit.');}
  else{const ps=pistesDepot(text);if(ps.length)dep.pistes=ps;}
  state.draft='';brouillonOte();state.busy=true;render();
  if(sansReponse){
    dep.sans=true;dep.lumiere='C’est déposé. Même sans réponse, ce que vous avez écrit est maintenant en dehors de vous.';
    d.depots.push(dep);state.busy=false;state.fresh=dep.id;state.freshT=performance.now();save();render();montreReponse();setTimeout(()=>{state.fresh=null;},1900);if(!dep.risk)toast('C’est déposé et gardé pour vous.');return;
  }
  if(!state.sample){
    dep.question=LOCAL_Q[dayIdx(LOCAL_Q.length)];dep.lumiere=WORDS[(dayIdx(WORDS.length)+3)%WORDS.length];
    d.depots.push(dep);state.busy=false;state.fresh=dep.id;state.freshT=performance.now();save();
    /* « J'aimerais le dire à quelqu'un » : les mots sont gardés d'abord, tels quels, puis l'étape suivante s'ouvre.
       Si le texte laisse penser à une détresse, l'aide s'affiche d'abord, et le parent choisit la suite lui-même. */
    if(suite==='dire'&&!dep.risk){setTimeout(()=>{state.fresh=null;},1900);handle('dire',{k:'ouvre',id:dep.id},null);return;}
    render();montreReponse();setTimeout(()=>{state.fresh=null;},1900);if(!dep.risk)toast('C’est déposé et gardé pour vous.');return;
  }
  state.ctl=new AbortController();
  try{
    if(state.depotMode==='advice'){
      const res=await state.sample([{role:'user',content:advicePrompt()},{role:'user',content:text}],{signal:state.ctl.signal,cache:false});
      dep.conseil=voix(res.text);
    }else{
      const r=await state.sample.json(listenPrompt(text),{signal:state.ctl.signal,cache:false});
      dep.miroir=voix(String((r&&r.miroir)||'').trim());dep.question=voix(String((r&&r.question)||'').trim());dep.lumiere=voix(String((r&&r.lumiere)||'').trim());
      if(!dep.miroir&&!dep.question)dep.question=LOCAL_Q[0];
    }
  }catch(e){
    if(e&&e.code==='not_granted')state.sample=false;
    dep.question=dep.question||LOCAL_Q[dayIdx(LOCAL_Q.length)];dep.lumiere=dep.lumiere||'C’est déposé. Même sans réponse, ce que vous avez écrit est maintenant en dehors de vous.';
    if(e&&e.code!=='cancelled'&&e.code!=='not_granted')toast('La réponse n’est pas venue cette fois. Votre dépôt est gardé.');
  }
  d.depots.push(dep);state.busy=false;state.ctl=null;state.fresh=dep.id;state.freshT=performance.now();save();render();montreReponse();setTimeout(()=>{state.fresh=null;},1900);
}
async function concret(id){
  const d=D();const dep=d.depots.find(x=>x.id===id);if(!dep||!state.sample)return;
  if(!can('parcours')&&d.depots.filter(x=>x.conseil).length>=FREE_DEPOTS){openUpgrade('depots');render();return;}
  state.busy=true;render();state.ctl=new AbortController();
  try{const res=await state.sample([{role:'user',content:advicePrompt()},{role:'user',content:dep.text}],{signal:state.ctl.signal,cache:false});dep.conseil=voix(res.text);}
  catch(e){if(e&&e.code!=='cancelled')toast('Pas de réponse cette fois. Réessayez dans un instant.');}
  state.busy=false;state.ctl=null;save();render();
}
async function dosePerso(){
  const ld=recentDepot();if(!ld||!state.sample)return;
  if(!can('parcours')){openUpgrade('dose');render();return;}
  state.doseBusy=true;render();
  try{
    const r=await state.sample('Tu écris « la dose de lumière intérieure » de « Parent Écouté, Parent Éclairé », créé par Antonio Company, travailleur social. Un parent a déposé ceci il y a peu : """'+ld.text.slice(0,1500)+'""" (le '+fmtDate(ld.date)+'). Écris pour lui, pour aujourd’hui '+fmtDate(todayIso())+', une dose de 45 à 70 mots : une phrase qui montre que tu as entendu ce qu’il a déposé (sans le répéter mot à mot), une phrase qui éclaire ou donne une permission, et une petite chose à faire ou à regarder aujourd’hui. Français de Suisse romande, vouvoiement, aucun prénom, aucun conseil médical, aucune mièvrerie, pas de titre, pas de guillemets, pas de signature. Écris comme Antonio parle, avec des phrases simples et complètes, reliées par « et », « mais » ou « parce que ». N’utilise ni deux-points, ni point-virgule, ni tiret long, ni point médian, ni phrase sans verbe, ni formule du type « pas ceci, pas cela ». Réponds avec le texte seul.',{cache:false,modelTier:'quick'});
    D().doseDate=todayIso();D().doseText=voix(r.text.trim());save();
  }catch(e){if(e&&e.code==='not_granted')state.sample=false;toast('La dose personnalisée n’est pas venue. Celle du jour reste là.');}
  state.doseBusy=false;render();
}
/* ---------- parcours ---------- */
const NOTE_OUI='Gardé dans votre carnet, sur cet appareil.',NOTE_NON='Ce que vous écrivez ici reste sur votre appareil.';
const nl2=t=>esc(t).replace(/\n/g,'<br>');
function viewParcours(){
  const d=D();const cur=currentStepIdx();const steps=allSteps();const done=doneCount();const pct=Math.round(done/24*100);const nn=nbNotes();
  const ici=steps[cur]||steps[0];
  /* Au bout du sentier, l'arrivée : la page qui garde tout le chemin. Elle s'ouvre quand les 24 étapes sont faites. */
  const arrivee=done>=24?'<button type="button" class="arrivee ouverte" data-act="go" data-view="final"><span class="n">'+I.sun2+'</span><span class="tx"><b>Mon chemin</b><span>Tout votre parcours tient sur une page, avec vos mots.</span></span><span class="chev">'+I.chev+'</span></button>':'<div class="arrivee"><span class="n">'+I.sun2+'</span><span class="tx"><b>L’arrivée</b><span>Au bout du chemin, tout votre parcours tiendra sur une page, avec vos mots.</span></span></div>';
  const sous=(st,e,dn)=>dn?'Faite':(st.idx===cur&&e.k==='open')?'Cette semaine':e.k==='open'?'Ouverte':e.k==='bientot'?'S’ouvre '+dansJours(e.n):e.k==='tard'?'Plus tard':'Étape '+(st.idx+1);
  return '<main id="main" tabindex="-1" class="view" style="padding-top:0"><div class="band thin bleed" style="background-image:url('+HERO+');background-position:center 6%"><h1 class="t1">Le parcours</h1></div><p class="sub">Le parcours compte 24 étapes, sur 6 mois. Chaque semaine, vous comprenez une idée, vous l’essayez chez vous et vous écrivez quelques mots dans votre carnet de route.</p>'+
    (d.tout?'<span class="pill sun apercu">Aperçu d’Antonio, tout est ouvert</span>':'')+
    '<div class="card prog"><div class="ou"><span class="anneau" style="--p:'+pct+'"><b>'+done+'</b><small>sur 24</small></span><div class="txt"><span class="label">Votre parcours</span><p class="lesson">'+(done>=24?'Parcours terminé':'Mois '+(ici.mi+1)+', '+esc(PARCOURS[ici.mi].m))+'</p><span class="hint">'+done+' étape'+(done>1?'s':'')+' faite'+(done>1?'s':'')+(nn?' et '+nn+' page'+(nn>1?'s':'')+' écrite'+(nn>1?'s':''):'')+'</span></div></div>'+
    '<div class="quick"><button type="button" class="btn" data-act="go" data-view="carnet">'+I.note+'Mon carnet'+(nn?' ('+nn+')':'')+'</button><button type="button" class="btn" data-act="go" data-view="evo">'+I.chart+'Mon évolution</button><button type="button" class="btn" data-act="go" data-view="photo">'+(can('parcours')?I.image:I.lock)+'Photolangage</button></div></div>'+
    (done>=24?'<button type="button" class="card fin-appel" data-act="go" data-view="final"><span class="label">Vous êtes au bout des 24 étapes</span><p class="lesson">Votre chemin tient maintenant sur une page, avec vos mots.</p><span class="btn primary small" style="align-self:flex-start">'+I.path+'Voir mon chemin</span></button>':'')+
    '<div class="months">'+PARCOURS.map((m,mi)=>{const nf=m.steps.filter(s=>d.steps[s.id]).length;return '<div class="month"><h2><span class="n">'+(mi+1)+'</span><span class="nom">'+esc(m.m)+'</span><span class="mfait">'+(nf===m.steps.length?'Fait':nf+' sur '+m.steps.length)+'</span></h2><div class="sentier">'+m.steps.map((s,si)=>{const st=steps.find(x=>x.mi===mi&&x.si===si);const dn=!!d.steps[st.id];const e=stepEtat(st.idx);const lk=e.k!=='open';const av=st.idx>0?!!d.steps[steps[st.idx-1].id]:true;return '<button type="button" class="step'+(si%2?' d':' g')+(st.idx===cur&&!lk?' now':'')+(dn?' done':'')+(lk?' locked':'')+(e.k==='bientot'?' soon':'')+'" data-act="step" data-i="'+st.idx+'">'+sentierSvg(si%2===1,av,dn,false)+'<span class="n">'+(lk?I.lock:dn?I.check:(st.idx+1))+'</span><span class="tx"><b>'+esc(s.t)+'</b><span>'+sous(st,e,dn)+'</span></span><span class="chev">'+I.chev+'</span></button>';}).join('')+(mi===5?arrivee:'')+'</div></div>';}).join('')+'</div>'+
    (can('parcours')||d.tout?'<p class="hint">Une étape s’ouvre 7 jours après la précédente, pour vous laisser le temps d’essayer. Si vous vous absentez, rien ne s’accumule, et votre étape vous attend.</p>':lockline('Les 23 étapes suivantes font partie du Parcours, à 14 CHF par mois','parcours')+'<button type="button" class="btn" data-act="apercu" style="align-self:flex-start">'+I.path+'Essayer une étape, en 3 minutes</button>')+'</main>';
}
/* Les boutons d'une étape vers un autre écran : « Mon évolution », le photolangage, la respiration, les situations, ou une situation précise (« sit_nom »). */
function stepLiens(s){
  const L={evo:['go','evo',I.chart,'Faire le point dans Mon évolution'],photo:['go','photo',I.image,'Ouvrir le photolangage'],breath:['exo','breath',I.wind,'Respirer 4-6 maintenant'],advice:['kit','sits',I.bulb,'Ouvrir les situations']};
  const ks=!s.link?[]:(Array.isArray(s.link)?s.link:[s.link]);
  return ks.map(k=>{
    if(k.indexOf('sit_')===0){const id=k.slice(4);const x=SITS.find(y=>y.id===id);return x?'<button type="button" class="btn wide" data-act="sit" data-id="'+id+'">'+I.bulb+'<span>« '+esc(x.t)+' », dans la boîte à outils</span></button>':'';}
    const l=L[k];return l?'<button type="button" class="btn wide" data-act="'+l[0]+'" data-view="'+l[1]+'" data-id="'+l[1]+'" data-v="'+l[1]+'">'+l[2]+l[3]+'</button>':'';
  }).join('');
}
/* Une étape : comprendre (l'idée et son schéma), ce qu'Antonio a vécu, un exemple, essayer, observer, puis écrire dans le carnet de route. */
function viewStep(){
  const steps=allSteps();const s=steps[state.step];if(!s){state.view='parcours';return viewParcours();}
  const d=D();const dn=!!d.steps[s.id];const nt=d.notes[s.id];const txt=nt&&nt.t?nt.t:'';
  const paras=(Array.isArray(s.idee)?s.idee:[s.idee]).map(p=>'<p class="lesson">'+esc(p)+'</p>').join('');
  let rap='';
  if(s.rap){const r=steps.find(x=>x.id===s.rap);const rn=r?noteDe(r.id):null;
    if(r)rap='<div class="card rap"><span class="label">Ce que vous aviez écrit à l’étape '+(r.idx+1)+'</span>'+(rn?'<p class="lesson">'+nl2(rn.t)+'</p><span class="hint">Écrit le '+esc(fmtDate(rn.d))+'</span>':'<p class="hint">Vous n’aviez rien écrit à cette étape, qui s’appelle « '+esc(r.t)+' ». Vous pouvez encore le faire.</p><button type="button" class="btn small" data-act="step" data-i="'+r.idx+'" style="align-self:flex-start">Ouvrir cette étape</button>')+'</div>';}
  const sv=s.idx<steps.length-1?steps[s.idx+1]:null;const ap=sv?stepEtat(sv.idx):null;
  /* La prochaine étape : son titre, une phrase qui dit ce qu'on y trouvera, puis le jour où elle s'ouvre ou le bouton pour y aller. */
  const fin=!sv?'<button type="button" class="btn'+(dn?' primary':'')+'" data-act="go" data-view="final">'+I.path+'Voir mon chemin en entier</button>':'';
  /* Le mot de la fin : les derniers mots d'Antonio, après le carnet. Seule la dernière étape en a un. */
  const mot=!s.mot?'':'<div class="card vecu mot"><div class="from"><span class="av" aria-hidden="true">A</span><div><b>Le mot de la fin</b><small>Antonio</small></div></div>'+(Array.isArray(s.mot)?s.mot:[s.mot]).map(p=>'<p class="lesson">'+esc(p)+'</p>').join('')+'</div>';
  const suite=!sv?'':'<div class="card suite"><span class="label">La prochaine étape</span><h2>'+esc(sv.t)+'</h2>'+(sv.acc?'<p>'+esc(sv.acc)+'</p>':'')+
    ((ap.k==='open'||ap.k==='formule')?'<button type="button" class="btn" data-act="step" data-i="'+sv.idx+'">Ouvrir cette étape '+I.chev+'</button>':
     ap.k==='bientot'?'<p class="hint">Elle s’ouvrira '+dansJours(ap.n)+'. D’ici là, vous avez le temps d’essayer.</p>':'')+'</div>';
  const mn=minutesLecture(s);
  /* Une fois l'étape faite, le fil des 24 étapes montre le chemin parcouru. */
  const nf=doneCount();
  const neuf=!!(state.bravoAt&&Date.now()-state.bravoAt<1500);
  const bravo=!dn?'':'<div class="bravo'+(neuf?' neuf':'')+'"><span class="pts" aria-hidden="true">'+steps.map((x,i)=>'<i class="'+(d.steps[x.id]?'f':'')+(i&&i%4===0?' m':'')+'" style="--k:'+i+'"></i>').join('')+'</span><p>'+(nf>=24?'Vous avez fait les 24 étapes du parcours.':'Vous avez fait '+nf+' étape'+(nf>1?'s':'')+' sur 24.')+'</p></div>';
  const chap=i=>'<h2 class="chap" id="t-'+TEMPS[i][0]+'" tabindex="-1"><span class="n" aria-hidden="true">'+(i+1)+'</span><span class="nom">'+TEMPS[i][1]+'</span></h2>';
  /* La couverture : le numéro en grand derrière le titre, ce que l'étape promet, puis ses 3 temps et le temps de lecture. */
  return '<main id="main" tabindex="-1" class="view etape"><div class="couv" data-n="'+(s.idx+1)+'"><span class="label">Étape '+(s.idx+1)+' sur 24, mois '+(s.mi+1)+'</span><h1 class="t1">'+esc(s.t)+'</h1><p class="sub">'+esc(PARCOURS[s.mi].m)+'</p>'+
      (s.acc?'<p class="promesse">'+esc(s.acc)+'</p>':'')+
      '<nav class="temps" aria-label="Les 3 temps de l’étape">'+TEMPS.map((t,i)=>'<button type="button" data-act="temps" data-k="'+t[0]+'"><i aria-hidden="true">'+(i+1)+'</i><span>'+t[1]+'</span></button>').join('')+'</nav>'+
      '<p class="hint duree">Environ '+mn+' minutes de lecture, puis votre essai de la semaine.</p></div>'+
    chap(0)+
    '<div class="card idee">'+paras+(s.vecu?'':'<p class="hint" style="text-align:right">Antonio</p>')+'</div>'+
    (s.sch?schHtml(s.sch):'')+
    (s.vecu?'<div class="card vecu"><div class="from"><span class="av" aria-hidden="true">A</span><div><b>Ce que j’ai vécu</b><small>Antonio</small></div></div>'+(Array.isArray(s.vecu)?s.vecu:[s.vecu]).map(p=>'<p class="lesson">'+esc(p)+'</p>').join('')+'<div class="vecu-lien"><button type="button" class="linkbtn" data-act="go" data-view="about">Lire mon histoire</button></div></div>':'')+
    (s.ex?'<div class="card exemple"><span class="label">Un exemple</span><p>'+esc(s.ex)+'</p></div>':'')+
    chap(1)+
    rap+
    '<div class="mission"><div class="exo"><span class="label">'+I.check+'Cette semaine, j’essaie</span><p>'+esc(s.exo)+'</p></div>'+
    '<div class="card green"><span class="label">'+I.eye+'À observer</span><p>'+esc(s.obs)+'</p></div></div>'+
    stepLiens(s)+
    chap(2)+
    '<div class="card carnet"><span class="label">Mon carnet de route</span><label class="lesson" for="note">'+esc(s.ecr)+'</label><textarea id="note" data-note="'+s.id+'" maxlength="'+LIM.note+'" placeholder="'+esc(s.ph||'Écrivez ici, avec vos mots.')+'">'+esc(txt)+'</textarea><p class="hint" id="note-etat" aria-live="polite">'+(txt?NOTE_OUI:NOTE_NON)+'</p></div>'+mot+
    '<div class="quick"><button type="button" class="btn'+(dn?'':' primary')+'" data-act="stepdone" data-id="'+s.id+'">'+I.check+(dn?'Étape faite':'Marquer comme faite')+'</button>'+fin+'</div>'+bravo+suite+'</main>';
}
/* Le carnet de route : ce que le parent a écrit à chaque étape, mois par mois. Tout reste sur son appareil. */
function viewCarnet(){
  const S=allSteps();const n=nbNotes();
  let h='<main id="main" tabindex="-1" class="view"><div><h1 class="t1">Mon carnet de route</h1><p class="sub">Vous retrouvez ici ce que vous avez écrit à chaque étape du parcours. Tout reste sur votre appareil.</p></div>';
  if(!n)return h+'<div class="card vide"><p>Votre carnet est encore vide. Il se remplira avec ce que vous écrirez à la fin de chaque étape.</p><button type="button" class="btn primary" data-act="step" data-i="'+currentStepIdx()+'" style="align-self:flex-start">'+I.path+'Ouvrir mon étape</button></div></main>';
  h+='<button type="button" class="btn" data-act="go" data-view="final" style="align-self:flex-start">'+I.path+'Mon chemin, la page à garder</button>';
  PARCOURS.forEach((m,mi)=>{
    const L=S.filter(s=>s.mi===mi&&noteDe(s.id));if(!L.length)return;
    h+='<section class="carnet-mois"><h2><span class="n">'+(mi+1)+'</span>'+esc(m.m)+'</h2>'+L.map(s=>{const nt=noteDe(s.id);
      return '<article class="card page"><span class="label">Étape '+(s.idx+1)+', '+esc(s.t)+'</span><p class="q">'+esc(s.ecr)+'</p><p class="lesson">'+nl2(nt.t)+'</p><div class="row" style="align-items:center;justify-content:space-between"><span class="hint">Écrit le '+esc(fmtDate(nt.d))+'</span><button type="button" class="btn small" data-act="step" data-i="'+s.idx+'">Rouvrir l’étape</button></div></article>';}).join('')+'</section>';
  });
  return h+'</main>';
}
/* ---------- Le final : « Mon chemin », tout le parcours du parent sur une page, à garder ou à imprimer ----------
   La page rassemble ce que le parent a fait et écrit : ses points de « Mon évolution », les photos qu'il a choisies,
   ses pages de carnet, sa lettre. Les seuls mots qui ne sont pas les siens sont le mot de la fin d'Antonio. Tout reste sur l'appareil. */
function dateLongue(iso){
  const p=String(iso||'').split('-').map(Number);if(p.length<3||!p[0]||!p[1]||!p[2])return '';
  try{return new Date(p[0],p[1]-1,p[2]).toLocaleDateString('fr-CH',{day:'numeric',month:'long',year:'numeric'});}catch(e){return fmtDate(iso);}
}
/* Le graphique de « Mon évolution » : une ligne par échelle, une barre par point fait. Il sert dans « Mon évolution » et dans le final. */
function evoBars(){
  const e=D().evo||{};const have=EVO_TIMES.filter(x=>e[x[0]]);if(!have.length)return '';
  return '<div class="bars">'+EVO_SCALES.map(s=>'<div class="barrow"><span>'+esc(s.t.replace('Mon ','').replace('Ma ',''))+'</span><div class="bartrack">'+EVO_TIMES.map((x,i)=>e[x[0]]?'<i class="t'+(i+1)+'"><b style="width:'+(Number(e[x[0]][s.id]||0)*10)+'%"></b><em>'+Number(e[x[0]][s.id]||0)+'</em></i>':'').join('')+'</div></div>').join('')+'</div><div class="legend">'+have.map(x=>'<span class="t'+(EVO_TIMES.indexOf(x)+1)+'">'+esc(x[1])+(e[x[0]].date?', '+esc(fmtDate(e[x[0]].date)):'')+'</span>').join('')+'</div>';
}
/* Les photos choisies, dans l'ordre. Une photo retirée depuis du jeu n'est pas montrée. */
function photosChoisies(){
  const L=Array.isArray(D().photos)?D().photos:[];
  return L.map(p=>{const x=p&&p.id?PHOTOS.find(y=>y[0]===p.id):null;return x?{x:x,text:p.text||'',date:p.date||''}:null;}).filter(Boolean);
}
function viewFinal(){
  const d=D();const S=allSteps();const e=d.evo||{};
  const dep=noteDe('depart'),lettre=noteDe('chemin');const der=S[S.length-1]||{};
  const faites=doneCount(),pages=nbNotes(),photos=photosChoisies(),pts=EVO_TIMES.filter(x=>e[x[0]]);
  const peutImprimer=typeof window.print==='function';
  const du=dateLongue(d.start),au=dateLongue(todayIso());
  let h='<main id="main" tabindex="-1" class="view final"><div class="fin-couv"><span class="label">Parent écouté, parent éclairé</span><h1 class="t1">'+(d.me?'Le chemin de '+esc(d.me):'Mon chemin')+'</h1>'+
    '<p class="sub">'+(du&&du!==au?'Du '+esc(du)+' au '+esc(au)+'. ':'')+faites+' étape'+(faites>1?'s':'')+' faite'+(faites>1?'s':'')+' sur 24, et '+pages+' page'+(pages>1?'s':'')+' écrite'+(pages>1?'s':'')+'.</p></div>'+
    '<div class="card fin-mode sansimp"><p>Voici votre parcours rassemblé sur une seule page, avec vos mots. Vous pouvez la garder, ou l’imprimer.</p>'+(peutImprimer?'<button type="button" class="btn primary" data-act="imprimer" style="align-self:flex-start">'+I.note+'Imprimer ou enregistrer en PDF</button>':'')+'</div>';
  if(!pages&&!pts.length&&!photos.length)return h+'<div class="card"><p>Votre chemin est encore vide. Il se remplira avec ce que vous écrirez à chaque étape, vos points dans « Mon évolution » et les photos que vous choisirez.</p><button type="button" class="btn" data-act="step" data-i="'+currentStepIdx()+'" style="align-self:flex-start">'+I.path+'Ouvrir mon étape</button></div></main>';
  if(dep)h+='<section class="fin-bloc" aria-labelledby="fin-dep"><h2 id="fin-dep" class="t2">Mon point de départ</h2><div class="card page"><p class="q">'+esc(S[0].ecr)+'</p><p class="lesson">'+nl2(dep.t)+'</p><span class="hint">Écrit le '+esc(fmtDate(dep.d))+'</span></div></section>';
  if(pts.length){
    const ouv=pts.map(x=>{const r=e[x[0]];const L=EVO_OPEN.filter(o=>r[o[0]]&&String(r[o[0]]).trim());return L.length?'<div class="card page"><span class="label">'+esc(x[1])+(r.date?', le '+esc(fmtDate(r.date)):'')+'</span>'+L.map(o=>'<p class="q">'+esc(evoQ(o))+'</p><p class="lesson">'+nl2(r[o[0]])+'</p>').join('')+'</div>':'';}).join('');
    h+='<section class="fin-bloc" aria-labelledby="fin-evo"><h2 id="fin-evo" class="t2">'+(pts.length>1?'Mes '+pts.length+' points':'Mon premier point')+'</h2><div class="card">'+evoBars()+'<p class="hint">Chaque barre va de 0 à 10.</p></div>'+ouv+'</section>';
  }
  if(photos.length)h+='<section class="fin-bloc" aria-labelledby="fin-pho"><h2 id="fin-pho" class="t2">'+(photos.length>1?'Les photos que j’ai choisies':'La photo que j’ai choisie')+'</h2><div class="fin-photos">'+photos.map(p=>'<figure class="card fin-photo"><img src="'+PHOTO_DIR+p.x[0]+'.webp" alt="'+esc(p.x[2])+'" width="400" height="300" loading="lazy" decoding="async"><figcaption><b>'+esc(p.x[1])+'</b>'+(p.date?'<span class="hint">Choisie le '+esc(fmtDate(p.date))+'</span>':'')+(p.text?'<p class="lesson">'+nl2(p.text)+'</p>':'')+'</figcaption></figure>').join('')+'</div></section>';
  const ecrits=PARCOURS.map((m,mi)=>{const L=S.filter(s=>s.mi===mi&&noteDe(s.id)&&s.id!=='depart'&&s.id!=='chemin');if(!L.length)return '';
    return '<div class="carnet-mois"><h3><span class="n">'+(mi+1)+'</span>'+esc(m.m)+'</h3>'+L.map(s=>{const nt=noteDe(s.id);return '<article class="card page"><span class="label">Étape '+(s.idx+1)+', '+esc(s.t)+'</span><p class="q">'+esc(s.ecr)+'</p><p class="lesson">'+nl2(nt.t)+'</p><span class="hint">Écrit le '+esc(fmtDate(nt.d))+'</span></article>';}).join('')+'</div>';}).join('');
  if(ecrits)h+='<section class="fin-bloc" aria-labelledby="fin-ecr"><h2 id="fin-ecr" class="t2">Ce que j’ai écrit</h2>'+ecrits+'</section>';
  h+='<section class="fin-bloc" aria-labelledby="fin-let"><h2 id="fin-let" class="t2">Ma lettre</h2>'+(lettre?'<div class="card page fin-lettre"><p class="q">'+esc(der.ecr||'')+'</p><p class="lesson">'+nl2(lettre.t)+'</p><span class="hint">Écrite le '+esc(fmtDate(lettre.d))+'</span></div>':'<div class="card sansimp"><p>Votre lettre vous attend à la dernière étape du parcours.</p></div>')+'</section>';
  if(der.mot)h+='<div class="card vecu mot"><div class="from"><span class="av" aria-hidden="true">A</span><div><b>Le mot de la fin</b><small>Antonio</small></div></div>'+(Array.isArray(der.mot)?der.mot:[der.mot]).map(p=>'<p class="lesson">'+esc(p)+'</p>').join('')+'</div>';
  return h+'<p class="hint fin-pied">Tout ce qui est écrit ici reste sur votre appareil. Cette page se complète à mesure que vous avancez.</p></main>';
}
/* ---------- Les schémas du parcours ----------
   Le dessin avance d'un moment à chaque « Voir la suite ». Rien ne démarre tout seul, et le dessin n'est pas redessiné
   quand l'écran l'est : seul le morceau qui vient d'apparaître est animé (classe « neuf »). */
function schK(S){return Math.max(1,Math.min(S.caps.length,state.sch||1));}
/* ---------- Le repère d'un schéma ----------
   Sur les schémas qui ont une courbe, un petit point clair suit la courbe d'un moment au suivant, et le trait plein se dessine
   derrière lui. Il n'avance que lorsque le parent appuie sur « Voir la suite ». Sa course a la douceur de la goutte de « Souffler »
   (la même demi-onde : il part lentement et il arrive lentement), et ce qui l'attend au bout n'apparaît qu'à son arrivée.
   Avec « Réduire les animations », le repère est simplement posé au bon endroit. */
const REP={raf:0,box:null,f:null,tr:null};
function repTr(S,k){const R=S.rep;return (R.tr||R.f)[k-1];}
function repHtml(S,k){
  const R=S.rep;if(!R)return '';
  const tr=repTr(S,k),p=R.p[k-1];
  return '<path class="s-sillage" pathLength="1" d="'+R.d+'" stroke-dasharray="1 1" stroke-dashoffset="'+(1-tr).toFixed(4)+'"'+(tr>0?'':' visibility="hidden"')+'/>'+
    '<g class="s-rep" transform="translate('+p[0]+' '+p[1]+')"><circle class="s-rep-h" r="8.5"/><circle class="s-rep-c" r="4.5"/></g>';
}
/* Pose le repère à une place de la courbe, tire le trait jusque-là, et montre les points déjà dépassés. */
function repMet(box,f,tr){
  const si=box.querySelector('.s-sillage'),g=box.querySelector('.s-rep');if(!si||!g)return;
  let q;try{q=si.getPointAtLength(si.getTotalLength()*f);}catch(e){return;}
  g.setAttribute('transform','translate('+q.x.toFixed(2)+' '+q.y.toFixed(2)+')');
  si.setAttribute('stroke-dashoffset',(1-tr).toFixed(4));
  if(tr>0)si.removeAttribute('visibility');else si.setAttribute('visibility','hidden');
  [].forEach.call(box.querySelectorAll('.s-f'),el=>{
    const vu=Number(el.dataset.f)<=tr+.002;
    if(vu&&REP.raf&&!el.classList.contains('vu'))el.classList.add('pop');
    if(!vu)el.classList.remove('pop');
    el.classList.toggle('vu',vu);});
  REP.f=f;REP.tr=tr;
}
function repStop(){if(REP.raf){(window.cancelAnimationFrame||clearTimeout)(REP.raf);REP.raf=0;}}
/* Du moment k0 au moment k. Rend la durée de la course en secondes, ou 0 quand le repère ne bouge pas. Si le parent appuie
   pendant une course, le repère repart de là où il se trouve, sans saut. */
function repVa(box,S,k0,k,anime){
  const R=S.rep;if(!R)return 0;
  const si=box.querySelector('.s-sillage');if(!si)return 0;
  const b=R.f[k-1],tb=repTr(S,k),ici=REP.box===box&&REP.f!=null;
  const a=ici?REP.f:R.f[k0-1],ta=ici?REP.tr:repTr(S,k0);
  repStop();REP.box=box;
  if(!anime||!fxOn()||(a===b&&ta===tb)){repMet(box,b,tb);return 0;}
  let L=0;try{L=si.getTotalLength();}catch(e){}
  const dist=Math.max(Math.abs(b-a),Math.abs(tb-ta))*L;
  if(!(dist>.5)){repMet(box,b,tb);return 0;}
  const dur=Math.max(.9,Math.min(3.2,.7+dist/150)),t0=performance.now();
  const pas=()=>{
    if(!box.isConnected){REP.raf=0;return;}
    const x=Math.max(0,Math.min(1,(performance.now()-t0)/(dur*1000))),e=.5-.5*Math.cos(Math.PI*x);
    repMet(box,a+(b-a)*e,ta+(tb-ta)*e);
    REP.raf=x<1?requestAnimationFrame(pas):0;
  };
  REP.raf=requestAnimationFrame(pas);
  return dur;
}
function schHtml(key){
  const S=SCHEMAS[key];if(!S)return '';
  const n=S.caps.length,k=schK(S),tr=S.rep?repTr(S,k):0;
  /* Les points posés sur la courbe ne se montrent que si le trait les a déjà atteints. */
  const morceau=x=>S.rep?x.replace(/class="([^"]*\bs-f\b[^"]*)" data-f="([\d.]+)"/g,(m,c,f)=>'class="'+c+(Number(f)<=tr+.002?' vu':'')+'" data-f="'+f+'"'):x;
  return '<div class="card sch" data-sch="'+key+'"><span class="label">Le schéma</span>'+
    '<svg class="sch-svg" viewBox="'+S.vb+'" role="img" aria-label="'+esc(S.alt)+'">'+S.base+repHtml(S,k)+S.l.map(x=>'<g class="sp'+(x[2]?' '+x[2]:'')+(x[0]<=k?' on':'')+'" data-p="'+x[0]+'">'+morceau(x[1])+'</g>').join('')+'</svg>'+
    '<ol class="sch-caps" aria-live="polite">'+S.caps.map((c,i)=>'<li class="'+(i<k?'on':'')+(i===k-1?' cur':'')+'">'+esc(c)+'</li>').join('')+'</ol>'+
    '<div class="sch-nav"><span class="sch-pos">'+k+' sur '+n+'</span><button type="button" class="btn small'+(k<n?' primary':'')+'" data-act="'+(k<n?'schnext':'schagain')+'">'+(k<n?'Voir la suite'+I.chev:'Revoir depuis le début')+'</button></div></div>';
}
function schSync(neuf){
  const box=document.querySelector('.sch');if(!box)return;const S=SCHEMAS[box.dataset.sch];if(!S)return;
  const n=S.caps.length,k=schK(S);
  /* Le repère part, et ce qui l'attend au bout patiente jusqu'à son arrivée (--rep-d), mais jamais plus de 1 seconde :
     après des appuis rapprochés ou sur une longue courbe, le dessin est complet moins de 2 secondes après le dernier appui. */
  const course=repVa(box,S,neuf?Math.max(1,k-1):k,k,!!neuf);
  const attente=course?Math.min(1,Math.max(0,course-.3)):0;
  box.style.setProperty('--rep-d',attente.toFixed(2)+'s');box.classList.toggle('rep-attend',attente>0);
  [].forEach.call(box.querySelectorAll('.sp'),g=>{const p=Number(g.dataset.p);g.classList.toggle('on',p<=k);g.classList.toggle('neuf',!!neuf&&p===k);});
  [].forEach.call(box.querySelectorAll('.sch-caps li'),(li,i)=>{li.classList.toggle('on',i<k);li.classList.toggle('cur',i===k-1);li.classList.toggle('neuf',!!neuf&&i===k-1);});
  const pos=box.querySelector('.sch-pos');if(pos)pos.textContent=k+' sur '+n;
  const b=box.querySelector('.sch-nav button');
  if(b){b.dataset.act=k<n?'schnext':'schagain';b.className='btn small'+(k<n?' primary':'');b.innerHTML=k<n?'Voir la suite'+I.chev:'Revoir depuis le début';}
}
/* ---------- évolution ---------- */
/* Une échelle numérotée de 0 à 10 : le rond se glisse, les chiffres se touchent, et le rond porte le chiffre choisi.
   Ce qui est réglé mais pas encore enregistré est gardé de côté (state.evoDraft), pour ne pas le perdre si l'écran est redessiné. */
/* Une question ouverte peut avoir une formulation par situation (handicap, période difficile, parent simplement). */
function evoQ(o){const q=o[1];return typeof q==='string'?q:(q[D().situation]||q.parent);}
function evoSync(r){
  const v=Number(r.value),b=r.closest('.scale');if(!b)return;
  b.style.setProperty('--p',String(v/10));
  const th=b.querySelector('.scale-thumb');if(th)th.textContent=String(v);
  const o=b.querySelector('.scale-val b');if(o)o.textContent=String(v);
  r.setAttribute('aria-valuetext',v+' sur 10');
  [].forEach.call(b.querySelectorAll('.scale-nums button'),x=>{const n=Number(x.dataset.v);x.classList.toggle('on',n<=v);x.classList.toggle('cur',n===v);});
  const t=state.evoTime;state.evoDraft=state.evoDraft||{};state.evoDraft[t]=state.evoDraft[t]||{};state.evoDraft[t][r.dataset.evo]=v;
  if(th&&fxOn()){th.classList.remove('pop');void th.offsetWidth;th.classList.add('pop');}
}
function viewEvo(){
  const e=D().evo;const t=state.evoTime;const cur=e[t]||{};const dr=(state.evoDraft||{})[t]||{};
  const chips='<div class="chips points3" role="group" aria-label="Les 3 points du parcours">'+EVO_TIMES.map((x,i)=>{const lk=i>0&&!can('parcours');return '<button type="button" class="chip'+(e[x[0]]?' fait':'')+'" data-act="evotime" data-v="'+x[0]+'" aria-pressed="'+(t===x[0])+'">'+(lk?I.lock+' ':'')+x[1]+(e[x[0]]?' ✓':'')+'</button>';}).join('')+'</div>';
  const NUMS=[0,1,2,3,4,5,6,7,8,9,10];
  const scales=EVO_SCALES.map(s=>{
    const v=dr[s.id]!==undefined?dr[s.id]:(cur[s.id]!==undefined?cur[s.id]:5);
    return '<div class="scale" style="--p:'+(v/10)+'">'+
      '<div class="scale-top"><b id="sc-'+s.id+'">'+esc(s.t)+'</b><span class="scale-val" aria-hidden="true"><b>'+v+'</b> sur 10</span></div>'+
      '<div class="scale-track"><input type="range" id="evo-r-'+s.id+'" min="0" max="10" step="1" value="'+v+'" data-evo="'+s.id+'" aria-labelledby="sc-'+s.id+'" aria-describedby="sd-'+s.id+'" aria-valuetext="'+v+' sur 10"><span class="scale-thumb" aria-hidden="true">'+v+'</span></div>'+
      '<div class="scale-nums" aria-hidden="true">'+NUMS.map(n=>'<button type="button" tabindex="-1" data-act="evoset" data-k="'+s.id+'" data-v="'+n+'" class="'+(n<=v?'on':'')+(n===v?' cur':'')+'"><span>'+n+'</span></button>').join('')+'</div>'+
      '<div class="row" id="sd-'+s.id+'"><span><b>0</b> '+esc(s.lo)+'</span><span><b>10</b> '+esc(s.hi)+'</span></div></div>';
  }).join('');
  const opens=EVO_OPEN.map(o=>'<div class="field"><label for="evo-'+o[0]+'">'+esc(evoQ(o))+'</label><textarea id="evo-'+o[0]+'" data-evoopen="'+o[0]+'" maxlength="'+LIM.evo+'" style="min-height:80px">'+esc(dr[o[0]]!==undefined?dr[o[0]]:(cur[o[0]]||''))+'</textarea></div>').join('');
  const have=EVO_TIMES.filter(x=>e[x[0]]);
  let bars='';
  if(have.length){bars='<div class="card"><span class="label">Le chemin</span>'+evoBars()+'<p class="hint">Chaque barre va de 0 à 10. Avec le temps, le stress et la solitude devraient baisser, alors que la compétence, le regard et la confiance devraient monter. Tout ce qui bouge, c’est grâce à vous.</p></div>';}
  return '<main id="main" tabindex="-1" class="view"><div><span class="label">'+(t==='t1'?'Le questionnaire de départ':t==='t2'?'Le point à trois mois':'Le bilan à six mois')+'</span><h1 class="t1">Mon évolution</h1><p class="sub">Vous faites le point trois fois en six mois, au départ, à mi-parcours et au bilan. Il y a cinq échelles de 0 à 10 et deux questions à chaque fois. Il n’y a pas de bonne réponse, seulement la vôtre aujourd’hui.</p></div>'+chips+bars+
    '<div class="card"><p class="hint">Pour chaque ligne, faites glisser le rond ou touchez un chiffre.</p>'+scales+opens+'<button type="button" class="btn primary" data-act="evosave" style="align-self:flex-start">'+I.check+'Enregistrer ce point</button></div></main>';
}
/* ---------- photolangage ---------- */
/* De vraies photos. On choisit d'abord (toutes les photos, à la même taille), puis la photo choisie s'affiche en grand, avec le champ pour écrire.
   Le choix est enregistré par le nom de la photo. Un ancien choix (le numéro d'un pictogramme) retrouve la photo la plus proche. */
const PHOTO_DIR=SITE?RACINE+'img/photos/':'https://parent-ecoute.ch/img/photos/';
function photoRec(){
  const p=D().photo||{};let id=p.id;
  if(!id&&typeof p.i==='number')id=PHOTOS_AVANT[p.i];
  const x=id?PHOTOS.find(y=>y[0]===id):null;
  return {id:x?x[0]:null,x:x,text:p.text||'',date:p.date||''};
}
/* L'ordre des photos change à chaque visite, pour que les premières ne soient pas toujours les plus choisies.
   Il reste le même tant qu'on ne quitte pas l'écran (choisir une photo, puis revenir en choisir une autre). */
function photoOrdre(){
  if(!state.photoOrder||state.photoOrder.length!==PHOTOS.length){const a=PHOTOS.map((x,i)=>i);for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=a[i];a[i]=a[j];a[j]=t;}state.photoOrder=a;}
  return state.photoOrder.map(i=>PHOTOS[i]);
}
function viewPhoto(){
  const p=photoRec();const grand=!!p.id&&!state.photoPick;
  if(grand){
    const txt=state.pdraft!==null&&state.pdraft!==undefined?state.pdraft:p.text;
    return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">Photolangage</h1><p class="sub">Prenez le temps de la regarder. Puis écrivez ce qu’elle évoque, et pourquoi vous l’avez choisie. Une image dit souvent ce que les mots n’osent pas.</p></div>'+
      '<figure class="pstage"><img src="'+PHOTO_DIR+p.id+'-g.webp" alt="'+esc(p.x[2])+'" width="1120" height="840" decoding="async" style="background-image:url('+PHOTO_DIR+p.id+'.webp)"><figcaption>'+esc(p.x[1])+'</figcaption></figure>'+
      '<div class="card"><div class="field"><label for="ptext">Ce qu’elle évoque pour moi</label><textarea id="ptext" maxlength="'+LIM.photo+'" style="min-height:120px">'+esc(txt)+'</textarea></div><div class="quick"><button type="button" class="btn primary" data-act="photosave">'+I.check+'Garder</button><button type="button" class="btn" data-act="photoback">'+I.image+'Choisir une autre photo</button></div>'+(p.date?'<p class="hint">Choisie le '+esc(fmtDate(p.date))+'. Vous pourrez refaire l’exercice au bilan et comparer.</p>':'')+'</div></main>';
  }
  return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">Photolangage</h1><p class="sub">Voici quarante-huit photos. Choisissez celle qui dit le mieux votre vécu aujourd’hui, sans trop réfléchir. Vous écrirez ensuite ce qu’elle évoque pour vous. Leur ordre change à chaque visite.</p></div>'+
    '<div class="photos" role="group" aria-label="Photos du photolangage">'+photoOrdre().map(x=>'<button type="button" data-act="photopick" data-id="'+x[0]+'" aria-pressed="'+(p.id===x[0])+'"><span>'+esc(x[1])+'</span><img src="'+PHOTO_DIR+x[0]+'.webp" alt="'+esc(x[2])+'" width="400" height="300" loading="lazy" decoding="async"></button>').join('')+'</div></main>';
}
/* ====================================================================
   Le premier geste, les adresses, le partage et la deuxième visite (18 novembre 2026).
   La scène qui guide ce fichier : il est 21 h 40, un parent ouvre le site sur son téléphone après une journée difficile.
   Il a 2 minutes et peu d'énergie. Le premier écran lui demande de quoi il a besoin, et chaque réponse tient en un geste.
   ==================================================================== */

/* ---------- le moment de la journée, en mots ---------- */
const MOMENTS=['matin','jour','soir','nuit'];
const SALUT={matin:'Bonjour.',jour:'Bonjour.',soir:'Bonsoir.',nuit:'Il est tard.'};
const BESOIN={matin:'De quoi auriez-vous besoin ce matin ?',jour:'De quoi auriez-vous besoin aujourd’hui ?',soir:'De quoi auriez-vous besoin ce soir ?',nuit:'De quoi auriez-vous besoin, là, maintenant ?'};
/* La question, écrite pour l'écran : « auriez-vous » ne se coupe pas au trait d'union, et seule la fin dépend de l'heure. */
const BESOIN_FIN={matin:' ce matin ?',jour:' aujourd’hui ?',soir:' ce soir ?',nuit:', là, maintenant ?'};
function besoinHtml(m,variantes){return 'De quoi <span class="nb">auriez-vous</span> besoin<span'+(variantes?heureAttr(BESOIN_FIN):'')+'>'+esc(BESOIN_FIN[m])+'</span>';}
/* Une espace insécable garde « ce soir » ou « cette nuit » sur la même ligne. */
const PISTE_T={matin:'Trouver une idée pour ce\u00a0matin',jour:'Trouver une idée pour aujourd’hui',soir:'Trouver une idée pour ce\u00a0soir',nuit:'Trouver une idée pour cette\u00a0nuit'};
/* L'accueil est écrit à l'avance dans la page, à une heure qui n'est pas celle du visiteur : chaque mot qui dépend de l'heure
   porte ses 4 variantes, et un petit script de la page choisit la bonne avant le premier affichage (voir INLINE_HEURE dans build_site.py). */
function heureAttr(o){return MOMENTS.map(m=>' data-'+m+'="'+esc(o[m])+'"').join('');}

/* ---------- les pistes du moment : quelles situations proposer d'abord ---------- */
/* Sans âge choisi, les 4 propositions parlent à tous : une situation avec un enfant (e), une avec un ado (a), une avec un adulte (g),
   et une pour le parent lui-même (v). Si le parent a dit l'âge de son enfant en personnalisant son espace, celle de cet âge passe devant. */
const PISTE_MIXTE={
  matin:{e:'refus',a:'ado',g:'grandir',v:'epuise'},
  jour:{e:'crise',a:'ado',g:'grandir',v:'regard'},
  soir:{e:'sommeil',a:'ado',g:'loin',v:'epuise'},
  nuit:{e:'sommeil',a:'ado',g:'loin',v:'epuise'}
};
/* Avec un âge choisi, 4 situations de cet âge. Pour un ado ou un adulte, la fiche propre à cet âge vient toujours en premier. */
const PISTE_PAR_AGE={
  e:{matin:['refus','transitions','ecole','repas'],jour:['crise','transitions','repas','dehors'],soir:['sommeil','crise','refus','ecrans'],nuit:['sommeil','crise','epuise','culpa']},
  a:{matin:['ado','ecole','refus','transitions'],jour:['ado','ecrans','ecole','crise'],soir:['ado','ecrans','sommeil','crise'],nuit:['ado','sommeil','epuise','culpa']},
  g:{matin:['grandir','pros','refus','transitions'],jour:['grandir','pros','loin','regard'],soir:['loin','grandir','crise','epuise'],nuit:['loin','epuise','culpa','deuil']}
};
function pistesDuMoment(m,age,devant){
  let ids=(PISTE_PAR_AGE[age]||{})[m];
  if(!ids){const M=PISTE_MIXTE[m]||PISTE_MIXTE.jour;ids=(M[devant]?[M[devant]]:[]).concat([M.e,M.a,M.g,M.v]);}
  return ids.filter((id,i)=>SITS.some(x=>x.id===id)&&ids.indexOf(id)===i).slice(0,4);
}

/* ---------- les 3 portes : souffler, déposer, trouver une piste ---------- */
/* « grand » : sur l'accueil, chaque porte dit ce qu'on y trouve. Dans « Aujourd'hui », les 3 portes tiennent sur une ligne. */
function portes(grand){
  const m=moment();
  const P=[
    ['souffle',I.wind,'Souffler 2 minutes','Souffler','L’étang respire avec vous.',null],
    ['deposer',I.drop,'Déposer ce qui pèse','Déposer','Vous écrivez, et vous recevez une question et une lumière.',null],
    /* La troisième porte : le parent y trouve une idée qui part de ce qu'il vit, que son enfant soit petit, ado ou adulte. */
    ['piste',I.bulb,PISTE_T[m],'Une idée','Vous choisissez ce que vous vivez, avec un enfant, un ado ou un adulte.',PISTE_T]
  ];
  /* Sur l'accueil, la question invite à écrire : « Déposer ce qui pèse » vient donc en premier. « Souffler 2 minutes » reste à un geste,
     pour la personne qui préfère le silence. Dans « Aujourd'hui », l'ordre des 3 portes ne change pas. */
  if(grand){P[0][4]='En silence, l’étang respire avec vous.';P[1][4]='Vous l’écrivez avec vos mots, pour vous ou pour le dire à quelqu’un.';P.unshift(P.splice(1,1)[0]);}
  return '<div class="portes'+(grand?'':' mini')+'" role="group" aria-label="Ce dont vous avez besoin">'+P.map((p,i)=>
    '<button type="button" class="porte'+(i===0?' un':'')+'" data-act="porte" data-v="'+p[0]+'"'+(grand?'':' aria-label="'+esc(p[2])+'"')+'><span class="ic" aria-hidden="true">'+p[1]+'</span>'+
    (grand?'<span class="tx"><b'+(p[5]?heureAttr(p[5]):'')+'>'+esc(p[2])+'</b><span>'+esc(p[4])+'</span></span><span class="chev" aria-hidden="true">'+I.chev+'</span>':'<b>'+esc(p[3])+'</b>')+'</button>').join('')+'</div>';
}
/* Entrer dans l'espace : il n'y a ni compte ni formulaire. Le premier geste suffit, et la personnalisation vient après, si le parent le souhaite. */
function entrer(via){
  const d=D();if(d.onboarded)return false;
  d.onboarded=true;if(!d.start)d.start=todayIso();d.via=via||'';save();
  try{document.documentElement.classList.add('returning');}catch(e){}
  return true;
}

/* ---------- les adresses : chaque fiche a la sienne, que l'on peut envoyer telle quelle ---------- */
/* Les adresses sont écrites une fois pour toutes : un titre peut changer plus tard sans casser un lien déjà envoyé. */
const FICHE_SLUG={crise:'la-crise',automut:'il-ou-elle-se-fait-mal',refus:'le-refus',transitions:'les-transitions',sommeil:'le-coucher-et-la-nuit',repas:'les-repas',parole:'communiquer-sans-les-mots',dehors:'les-sorties',regard:'le-regard-des-autres',ecole:'l-ecole',fratrie:'les-freres-et-soeurs',ecrans:'les-ecrans',ado:'l-adolescence-et-le-corps',annonce:'on-vient-d-apprendre',culpa:'la-culpabilite',epuise:'je-n-en-peux-plus',couple:'le-couple',aide:'demander-de-l-aide',grandir:'le-passage-a-l-age-adulte',loin:'quand-il-ou-elle-vit-ailleurs',pros:'parler-aux-professionnels',deuil:'l-enfant-qu-on-avait-imagine',relais:'confier-son-enfant-a-un-proche'};
const SLUG_FICHE={};Object.keys(FICHE_SLUG).forEach(k=>{SLUG_FICHE[FICHE_SLUG[k]]=k;});
function ficheUrl(id,complet){return (complet?PUBLIC:RACINE)+'fiches/'+FICHE_SLUG[id]+'/';}
/* La phrase d'aperçu d'une fiche, celle qui s'affiche quand on envoie le lien : le début de « Ce qui se passe ». */
function ficheDesc(s){
  const ph=String(s.comp).match(/[^.!?]+[.!?]+/g)||[String(s.comp)];let out='';
  for(const p of ph){const t=p.trim();if(out&&(out.length>=110||(out+' '+t).length>190))break;out=out?out+' '+t:t;}
  return out;
}
const LISTE_DESC='Le coucher, les crises, l’école, les écrans, le passage à l’âge adulte ou la vie en institution. '+SITS.length+' situations de la vraie vie, avec des pistes venues du terrain et toujours un mot pour vous.';
if(PRE){try{globalThis.__PEPE_PRERENDER__({fiches:SITS.map(s=>({id:s.id,slug:FICHE_SLUG[s.id],t:s.t,s:s.s,ages:liste(s.ages.map((a,i)=>i?AGES[a].toLowerCase():AGES[a])),desc:ficheDesc(s)})),listeDesc:LISTE_DESC});}catch(e){}}
/* Lire l'adresse : quelle fiche, ou quel écran public, demande-t-elle ? */
const VUES_HASH={'#formules':'plans','#offres':'plans','#apercu':'apercu','#avec-antonio':'plans','#relais':'relais'};
function routeDe(){
  if(!SITE)return null;
  let p='';try{p=decodeURIComponent(location.pathname||'');}catch(e){p=location.pathname||'';}
  if(RACINE&&p.indexOf(RACINE)===0)p=p.slice(RACINE.length);else return location.hash===STORY_HASH?{v:'about'}:(VUES_HASH[location.hash]?{v:VUES_HASH[location.hash]}:null);
  p=p.replace(/index\.html$/,'');
  const m=p.match(/^fiches\/([a-z0-9-]+)\/?$/);
  if(m&&SLUG_FICHE[m[1]])return {v:'sit',sit:SLUG_FICHE[m[1]]};
  if(/^fiches\/?$/.test(p))return {v:'kit',kit:'sits'};
  /* L'outil « Passer le relais » a son adresse. Avec #f=…, elle porte une fiche que quelqu'un a envoyée. */
  if(/^relais\/?$/.test(p))return {v:'relais',re:/^#f=/.test(location.hash)?'lu':'accueil'};
  if(/^transmettre\/?$/.test(p))return {v:'transmettre'};
  {const cad=/^#cadeau-(parcours|relais)$/.exec(location.hash||'');if(cad)return {v:'commande',cf:cad[1],ck:'activer'};}
  if(location.hash==='#offrir')return {v:'commande',cf:'parcours',ck:'cadeau'};
  if(location.hash===STORY_HASH)return {v:'about'};
  if(location.hash==='#accueil')return {v:'intro'};
  if(VUES_HASH[location.hash])return {v:VUES_HASH[location.hash]};
  return null;
}
/* L'adresse de l'écran affiché. Seuls les écrans publics ont la leur : une fiche, la liste des situations et « Mon histoire ».
   Tout le reste, qui appartient au parent, garde l'adresse de l'espace. */
function urlDe(){
  if(state.view==='sit'&&FICHE_SLUG[state.sit])return ficheUrl(state.sit);
  if(state.view==='kit'&&state.kit==='sits')return RACINE+'fiches/';
  if(state.view==='about')return RACINE+STORY_HASH;
  if(state.view==='plans')return RACINE+'#formules';
  if(state.view==='apercu')return RACINE+'#apercu';
  if(state.view==='relais')return RACINE+'relais/'+(state.rl.e==='lu'&&state.rl.h?'#f='+state.rl.h:'');
  if(state.view==='transmettre')return RACINE+'transmettre/';
  /* La vitrine d'un parent déjà entré a son adresse. Sans elle, l'adresse du site ouvre son espace, et c'est ce qu'il attend. */
  if(state.view==='intro'&&D().onboarded)return RACINE+'#accueil';
  return RACINE;
}
function titreDe(){
  if(state.view==='about')return 'Mon histoire, par Antonio Company, créateur de Parent écouté, parent éclairé';
  if(state.view==='plans')return 'Les 3 offres de Parent écouté, parent éclairé';
  if(state.view==='apercu')return 'Essayer une étape du parcours, en 3 minutes';
  if(state.view==='relais')return state.rl.e==='lu'?'Une fiche de relais, écrite par une famille':'Passer le relais, une page pour la personne qui garde votre enfant';
  if(state.view==='transmettre')return 'Une page à transmettre à une famille, Parent écouté, parent éclairé';
  if(state.view==='sit'){const s=SITS.find(x=>x.id===state.sit);if(s)return s.t+', une fiche de Parent écouté, parent éclairé';}
  if(state.view==='kit'&&state.kit==='sits'&&!D().onboarded)return SITS.length+' situations de la vraie vie, avec des pistes pour les parents';
  return TITLE0;
}
/* ---------- le bouton Retour du téléphone : chaque écran est une page de l'historique ---------- */
const HIST={ok:false,i:0};
function navSnap(){return {v:state.view,sit:state.sit,exo:state.exo,step:state.step,kit:state.kit,tool:state.tool,letter:state.letter,et:state.evoTime,p:state.piste?1:0,ap:state.ap.k,cf:state.cmd.f,ck:state.cmd.k,cm:state.cmd.m,re:state.rl.e,rp:state.rl.p,ri:state.rl.id,rr:state.rl.r,rx:state.rl.ex,rh:state.rl.e==='lu'?state.rl.h:'',dd:state.view==='deposer'&&state.dire?state.dire.id:''};}
function navApply(s){
  state.view=s.v||'today';state.sit=s.sit||null;state.exo=s.exo||null;state.step=(typeof s.step==='number')?s.step:null;state.kit=s.kit||'sits';state.tool=s.tool||'timer';
  state.letter=(typeof s.letter==='number')?s.letter:null;state.evoTime=s.et||'t1';state.piste=!!s.p&&state.view==='kit';
  state.sheet=null;state.confirmReset=false;state.photoPick=false;state.photoOrder=null;state.pdraft=null;state.prev=null;state.lien='';
  state.ap.k=Math.max(0,Math.min(3,Number(s.ap)||0));state.cmd={f:s.cf||'',m:s.cm==='six'?'six':'une',k:s.ck||'recap',de:''};
  if(state.view==='commande'&&!PRODUITS[state.cmd.f]&&state.cmd.k!=='retrouver')state.view='plans';
  /* « Passer le relais » : l'écran, le pas, la fiche et la réunion en cours. Une fiche reçue se relit dans l'adresse. */
  {const r=state.rl;r.e=s.re||'accueil';r.p=Number(s.rp)||0;r.id=s.ri||null;r.r=s.rr||null;if(s.rx&&RL_EX[s.rx])r.ex=s.rx;r.sec='';r.mots=false;r.attente=null;r.foc='';
    if(r.e==='lu'){if(!rlDuHash()){r.h=s.rh||'';r.lu=r.h?rlDecode(r.h):null;r.e='lu';}}
    if(['prep','apercu','envoi','retour'].includes(r.e)&&!rlFiche(r.id))r.e='accueil';
    if(['reunion','feuille'].includes(r.e)&&!rlReu(r.r))r.e='accueil';}
  if(state.view==='apercu'&&state.ap.k>=2&&!noteDe('reguler'))state.ap.k=1;
  /* Un écran qui n'a plus de sens (une étape pas encore ouverte, une fiche inconnue) ramène à « Aujourd'hui ». */
  if(state.view==='step'&&(state.step===null||!D().onboarded||stepLocked(state.step)))state.view='parcours';
  if(state.view==='sit'&&!SITS.some(x=>x.id===state.sit))state.view='kit';
  if(state.view==='exo'&&!EXOS.some(x=>x.id===state.exo))state.view='kit';
  if(state.view==='souffle')state.souffle.k=state.souffle.k==='fini'?'fini':'pret';
  /* « J'aimerais le dire à quelqu'un » se retrouve avec le dépôt auquel il se rapporte. Sans lui, on revient à l'écran pour écrire. */
  state.dire=(state.view==='deposer'&&s.dd)?direOuvre(s.dd):null;
}
function histEtat(){return {pepe:1,i:HIST.i,s:navSnap(),y:0,t:Date.now()};}
/* L'endroit où l'on était, gardé le temps de la visite dans cet onglet : l'écran, et jusqu'où l'on avait fait défiler. */
const PLACE=KEY+'-place';
function histQuitte(){
  if(!SITE)return;
  try{sessionStorage.setItem(PLACE,JSON.stringify({s:navSnap(),y:Math.round(window.scrollY||window.pageYOffset||0),t:Date.now()}));}catch(e){}
}
function placeOte(){try{sessionStorage.removeItem(PLACE);}catch(e){}}
/* Le texte d'un dépôt en cours d'écriture est gardé le temps de la visite, dans cet onglet seulement : si le téléphone recharge la page, il est toujours là. */
const BROUILLON=KEY+'-brouillon';let brouillonT=null;
function brouillonGarde(){clearTimeout(brouillonT);brouillonT=setTimeout(()=>{try{if(state.draft)sessionStorage.setItem(BROUILLON,state.draft);else sessionStorage.removeItem(BROUILLON);}catch(e){}},300);}
function brouillonLit(){try{const b=sessionStorage.getItem(BROUILLON);if(b&&!state.draft)state.draft=String(b).slice(0,LIM.draft);}catch(e){}}
function brouillonOte(){clearTimeout(brouillonT);try{sessionStorage.removeItem(BROUILLON);}catch(e){}}
function histInit(){
  HIST.ok=!!(SITE&&window.history&&history.pushState&&history.replaceState);if(!HIST.ok)return;
  try{history.scrollRestoration='manual';}catch(e){}
  try{const st=history.state;HIST.i=(st&&st.pepe&&typeof st.i==='number')?st.i:0;history.replaceState(histEtat(),'',urlDe());}catch(e){HIST.ok=false;}
}
/* Un nouvel écran : on retient d'abord où l'on en était sur celui qu'on quitte, puis on ajoute une page à l'historique. */
function histPush(remplace){
  if(!HIST.ok)return;
  try{
    if(remplace){history.replaceState(histEtat(),'',urlDe());return;}
    const cur=history.state;
    if(cur&&cur.pepe){cur.y=Math.round(window.scrollY||window.pageYOffset||0);cur.t=Date.now();history.replaceState(cur,'');}
    HIST.i++;history.pushState(histEtat(),'',urlDe());
  }catch(e){}
}
/* Après chaque rendu : le titre de l'onglet suit l'écran, et l'adresse reste toujours celle de l'écran affiché. */
function titreSync(){
  try{const t=titreDe();if(document.title!==t)document.title=t;}catch(e){}
  if(!HIST.ok)return;
  try{const veut=urlDe(),a=location.pathname+location.hash;if(a!==veut&&location.hash!=='#atelier')history.replaceState(histEtat(),'',veut);}catch(e){}
}
function histRetour(e){
  if(!HIST.ok||location.hash==='#atelier')return;
  const st=e&&e.state;souffleStop();stopTimer();
  if(st&&st.pepe&&st.s){HIST.i=st.i||0;navApply(st.s);}
  else{const r=routeDe()||{};HIST.i=0;navApply({v:r.v||'today',sit:r.sit,kit:r.kit,re:r.re,cf:r.cf,ck:r.ck});try{history.replaceState(histEtat(),'',urlDe());}catch(x){}}
  const y=(st&&st.y)||0;
  /* « apres » : un message à dire une fois revenu sur l'écran d'avant (par exemple après avoir enregistré le point de départ). */
  const dire=state.apres||'';state.apres='';
  fxGo(()=>{render();window.scrollTo(0,y);if(dire)toast(dire);},'back');
}

/* ---------- après un dépôt : la réponse vient sous les yeux ---------- */
/* La question et la lumière s'affichent sous la zone d'écriture. Sur un téléphone, le bas de l'écran les cacherait.
   La page descend donc d'elle-même jusqu'à elles, doucement, ou d'un coup si le téléphone demande moins d'animations. */
function montreReponse(){
  const el=document.querySelector('.emporte')||document.querySelector('.mirror.surface');if(!el||!el.getBoundingClientRect)return;
  const barre=document.querySelector('header.bar');const haut=barre?Math.max(0,barre.getBoundingClientRect().bottom):0;
  const r=el.getBoundingClientRect();
  if(r.top>=haut&&r.bottom<=window.innerHeight-96)return;   /* déjà entièrement à l'écran : la page ne bouge pas */
  const y=Math.max(0,Math.round(r.top+window.scrollY-haut-14));
  try{window.scrollTo({top:y,behavior:fxOn()?'smooth':'auto'});}catch(e){window.scrollTo(0,y);}
}

/* ---------- envoyer une fiche ---------- */
/* Le lien envoyé est l'adresse publique de la fiche, et rien d'autre : ni le prénom, ni les notes, ni l'endroit d'où l'on vient. */
async function partager(id){
  const s=SITS.find(x=>x.id===id);if(!s||!SITE)return;
  const url=ficheUrl(id,true);
  if(navigator.share){
    try{await navigator.share({title:s.t,url:url});return;}
    catch(e){if(e&&e.name==='AbortError')return;}
  }
  try{await navigator.clipboard.writeText(url);state.lien='';toast('Le lien de cette fiche est copié. Vous pouvez le coller dans un message.');return;}catch(e){}
  /* Ni partage ni presse-papiers : le lien s'affiche, prêt à être copié à la main. */
  state.lien=url;render();
  const c=document.getElementById('lien');if(c){try{c.focus();c.select();}catch(e){}}
}

/* ---------- ce que le parent a ouvert dernièrement, pour le rouvrir sans chercher ---------- */
const OUTILS_NOMS={timer:'Le minuteur visuel',ft:'D’abord, ensuite',routine:'La routine du soir',abc:'Le journal',phr:'Mes phrases qui marchent'};
function noteRecent(k,id){
  const d=D();if(!d.onboarded)return;
  if(!Array.isArray(d.recents))d.recents=[];
  d.recents=d.recents.filter(x=>!(x.k===k&&x.id===id));
  d.recents.unshift({k:k,id:id,d:todayIso()});if(d.recents.length>6)d.recents.length=6;
  save();
}
function recentsHtml(){
  const L=(D().recents||[]).map(x=>{
    if(x.k==='sit'){const s=SITS.find(y=>y.id===x.id);return s?'<button type="button" class="chip" data-act="sit" data-id="'+s.id+'"><span aria-hidden="true">'+s.e+'</span> '+esc(s.t)+'</button>':'';}
    if(x.k==='exo'){const e=EXOS.find(y=>y.id===x.id);return e?'<button type="button" class="chip" data-act="exo" data-id="'+e.id+'">'+esc(e.id==='breath'?'Souffler 2 minutes':e.t)+'</button>':'';}
    if(x.k==='tool'&&OUTILS_NOMS[x.id])return '<button type="button" class="chip" data-act="rouvrir-outil" data-v="'+x.id+'">'+esc(OUTILS_NOMS[x.id])+'</button>';
    return '';
  }).filter(Boolean).slice(0,3);
  return L.length?'<div class="rouvrir"><span class="label" id="rouvrir-l">Rouvrir</span><div class="chips" role="group" aria-labelledby="rouvrir-l">'+L.join('')+'</div></div>':'';
}

/* ---------- après un dépôt : une piste, d'après les mots du parent ---------- */
/* L'application repère quelques mots simples. Elle ne lit pas le texte au sens où une personne le lirait, et rien ne quitte l'appareil.
   D'abord ce que vit le parent lui-même, ensuite la situation avec l'enfant. Deux fiches au plus, et aucune si rien n'est repéré. */
const FIN_MOT='(?![a-zà-ÿ])';
const PISTE_MOTS=[
  ['culpa','m[’\']en veux|coupable|culpabil|mauvaise? (mère|maman|père|papa|parent)|j[’\']ai honte'],
  ['epuise','épuis|(^|[^a-zà-ÿ])epuis|à bout'+FIN_MOT+'|n[’\']en peux plus|je craque|j[’\']ai craqué|crev[ée]e?'+FIN_MOT+'|vidée?'+FIN_MOT+'|plus la force'],
  ['aide','toute? seule?'+FIN_MOT+'|personne (ne|pour) m[’\']aide|besoin d[’\']aide|un peu de répit'],
  ['couple','mon mari'+FIN_MOT+'|ma femme|mon conjoint|ma conjointe|mon compagnon|ma compagne|notre couple|on se dispute'],
  ['sommeil','dor[mt]|endor|coucher|se relève|se réveille|réveils|cauchemar|insomni'],
  ['crise','crise|hurl|se roule|se jette|casse tout|a tout cassé|explos'],
  ['automut','se tape|se mord|se griffe|se fait mal|se cogne'],
  ['ecrans','écran|ecran|tablette|console'+FIN_MOT+'|jeux? vidéo|youtube|tiktok|son téléphone'],
  ['ecole','école|ecole|devoirs|maîtresse|maître'+FIN_MOT+'|enseignant|sa classe'],
  ['repas','repas|ne mange|mange rien|son assiette'],
  ['refus','refuse|ne veut pas|ne veut rien|dit non à tout'],
  ['fratrie','son frère|sa sœur|sa soeur|ses frères|ses sœurs|ses soeurs|fratrie|jalou'],
  ['ado','(mon|ma|notre|un|une|cet|cette) ado'+FIN_MOT+'|adolescen|puberté'],
  ['loin','en institution|l[’\']institution|son foyer|en foyer|dans un foyer|internat|son appartement|vit ailleurs'],
  ['grandir','majorité|majeure?'+FIN_MOT+'|curatelle|curateur|curatrice|ses 18 ans|a 18 ans|l[’\']âge adulte|atelier protégé'],
  ['pros','médecin|pédiatre|thérapeute|rendez-vous|réseau'+FIN_MOT+'|éducatrice|éducateur|logopédiste'],
  ['annonce','diagnostic|on vient d[’\']apprendre'],
  ['regard','regard des|les gens'+FIN_MOT+'|leurs remarques|une remarque|me jugent|m[’\']a jugée?'],
  ['dehors','magasin|supermarché|restaurant|dans le bus']
].map(p=>[p[0],new RegExp('('+p[1]+')','i')]);
function pistesDepot(text){
  const out=[];const moi=['culpa','epuise','aide','couple'];let unMoi=false,unEnfant=false;
  PISTE_MOTS.forEach(p=>{
    if(out.length>=2||!p[1].test(text))return;
    const estMoi=moi.indexOf(p[0])>=0;
    if(estMoi&&unMoi)return;if(!estMoi&&unEnfant)return;
    if(estMoi)unMoi=true;else unEnfant=true;
    out.push(p[0]);
  });
  return out;
}
function pistesDepotHtml(x){
  if(x.risk||!Array.isArray(x.pistes)||!x.pistes.length)return '';
  const L=x.pistes.map(id=>SITS.find(s=>s.id===id)).filter(Boolean);if(!L.length)return '';
  return '<div class="pistes-depot"><span class="label">'+(L.length>1?'Deux pistes qui peuvent':'Une piste qui peut')+' vous aider, proposée'+(L.length>1?'s':'')+' par l’application d’après vos mots</span><div class="liste">'+L.map(sitRow).join('')+'</div></div>';
}

/* ---------- déposer : un écran pour écrire, et rien d'autre ---------- */
function viewDeposer(){
  const d=D();const left=depotsLeft();const site=state.sample===false;
  if(site&&state.dire)return viewDire();
  if(site)return '<main id="main" tabindex="-1" class="view deposer"><div class="dep-tete"><h1 class="dep-nom">Déposer ce qui pèse</h1><label class="dep-q" for="draft">'+DEP_Q+'</label><p class="sub">'+DEP_SEUL+'</p></div>'+
    depotBox()+
    (d.depots.length?'<button type="button" class="sit" data-act="go" data-view="depots"><span class="e">'+I.drop+'</span><span class="tx"><b>Mes dépôts</b><span>'+d.depots.length+' dépôt'+(d.depots.length>1?'s':'')+' gardé'+(d.depots.length>1?'s':'')+' sur cet appareil</span></span><span class="chev">'+I.chev+'</span></button>':'')+
    '</main>';
  return '<main id="main" tabindex="-1" class="view deposer"><div><h1 class="t1">Déposer ce qui pèse</h1><p class="sub">'+(left===0?'Vous pouvez toujours écrire ce qui pèse, puis l’effacer. Rien n’est gardé.':'Écrivez comme ça vient, sans donner de prénom. Vous recevez en retour une question et une lumière.')+'</p></div>'+
    depotBox()+
    (left===0?'<button type="button" class="sit" data-act="exo" data-id="deposer"><span class="e">'+I.wind+'</span><span class="tx"><b>Écrire, puis effacer</b><span>Sans réponse, et sans rien garder</span></span><span class="chev">'+I.chev+'</span></button>':'')+
    (d.depots.length?'<button type="button" class="sit" data-act="go" data-view="depots"><span class="e">'+I.drop+'</span><span class="tx"><b>Mes dépôts</b><span>'+d.depots.length+' dépôt'+(d.depots.length>1?'s':'')+' gardé'+(d.depots.length>1?'s':'')+' sur cet appareil</span></span><span class="chev">'+I.chev+'</span></button>':'')+
    '</main>';
}

/* ---------- « J'aimerais le dire à quelqu'un » ----------
   Le parent a écrit. S'il veut être entendu par un proche ou lors d'une réunion, l'espace lui propose une première phrase.
   Il peut la changer, en choisir une autre, la copier avec ses mots à la suite, ou tout laisser et garder ses mots pour lui.
   Ses mots ne sont jamais réécrits : ils sont montrés tels quels, et ajoutés tels quels s'il le veut.
   Les débuts de phrase d'une réunion sont ceux de l'outil « Passer le relais » (« Je perds mes mots »). Rien n'est envoyé : copier est son geste. */
const DIRE_A=[['proche','À un proche'],['reunion','Lors d’une réunion']];
const DIRE_PROCHE=['J’aimerais te dire comment s’est passée ma journée. Je ne te demande pas de solution, j’ai besoin que tu m’écoutes.','J’ai besoin de te parler de quelque chose qui me pèse.','As-tu 5 minutes ? J’aimerais te raconter ma journée.','Je n’attends pas de conseil. J’ai besoin que quelqu’un sache ce que je vis.'];
const DIRE_REUNION='Avant que nous commencions, j’aimerais vous dire quelque chose d’important pour moi.';
const DIRE_LIM=600;
function direAmorces(a){return a==='reunion'?[DIRE_REUNION].concat(RL_MOTS_ECRIRE.map(m=>m.replace('{P}','mon enfant')+' ')):DIRE_PROCHE;}
function direDepot(id){return D().depots.find(x=>x.id===id)||null;}
/* Ouvrir l'étape pour un dépôt : on reprend ce que le parent avait préparé, s'il y était déjà venu. */
function direOuvre(id){
  const x=direDepot(id);if(!x)return null;const g=x.dire||{};const a=g.a==='reunion'?'reunion':'proche';
  return {id:id,a:a,t:typeof g.t==='string'?g.t:direAmorces(a)[(x.risk&&a==='proche')?1:0],j:g.j!==false,mots:false,copie:false};
}
function direGarde(){const s=state.dire;if(!s)return;const x=direDepot(s.id);if(!x)return;x.dire={a:s.a,t:clean(s.t,DIRE_LIM),j:!!s.j};save();}
function direTexte(){const s=state.dire;if(!s)return '';const x=direDepot(s.id);const a=clean(s.t,DIRE_LIM);return (s.j&&x?[a,x.text]:[a]).filter(Boolean).join('\n\n');}
/* Après le choix d'une autre première phrase : le curseur se pose à la fin, pour que le parent la continue avec ses mots. */
function direApres(){if(!state.direFoc)return;state.direFoc=false;try{const el=document.getElementById('amorce');if(el){el.focus();const n=el.value.length;el.setSelectionRange(n,n);}}catch(e){}}
function viewDire(){
  const s=state.dire,x=direDepot(s.id);if(!x){state.dire=null;return viewDeposer();}
  const L=direAmorces(s.a);
  const mots=s.mots?'<div class="dire-modeles" role="group" aria-label="D’autres façons de commencer"><span class="label">Commencer par</span>'+L.map((m,i)=>'<button type="button" class="dire-m" data-act="dire" data-k="mot" data-i="'+i+'">'+esc(m.trim())+(/[.?!]$/.test(m.trim())?'':'…')+'</button>').join('')+'</div>':'<button type="button" class="btn rl-perds" data-act="dire" data-k="mots">'+I.bulb+'Je perds mes mots</button>';
  const pret=s.copie?'<section class="emporte dire-pret" aria-labelledby="dire-pret-t"><h2 id="dire-pret-t">Ce que vous emportez</h2><p class="dire-ok" role="status">'+(s.copie==='main'?'Votre texte est prêt, juste en dessous. Vous pouvez le sélectionner pour le copier, ou le relire avant de le dire à voix haute.':'C’est copié. Vous pouvez le coller dans un message, ou le relire avant de le dire à voix haute.')+'</p><p class="em-texte" id="dire-texte">'+esc(direTexte())+'</p>'+
    '<div class="em-suite"><button type="button" class="btn primary" data-act="dfin">'+I.check+'J’ai fini pour aujourd’hui</button></div></section>':'';
  /* La seule suite proposée mène à un outil que le parent garde et réutilise. Elle ne parle pas de prix : l'outil se présente lui-même. */
  const outil=(s.a==='reunion'&&s.copie)?'<div class="vers-apercu vers-relais"><h2>Arriver à la réunion avec vos mots</h2><p>L’outil « Passer le relais » vous aide aussi à préparer un rendez-vous, avec vos 3 priorités sous les yeux et un bouton « Je perds mes mots ». Vos derniers mots déposés y sont proposés, phrase par phrase.</p><button type="button" class="btn" data-act="rl" data-k="ouvre">'+I.hand+'Découvrir l’outil</button></div>':'';
  return '<main id="main" tabindex="-1" class="view deposer dire"><div><h1 class="t1">J’aimerais le dire à quelqu’un</h1><p class="sub">Voici une première phrase pour commencer. Vous pouvez la changer, la copier ou la laisser de côté.</p></div>'+
    (x.risk?'<div class="mirror dire-aide">'+riskHtml('q')+'</div>':'')+
    '<div class="card dire-c">'+
    '<span class="label" id="dire-a-l">À qui aimeriez-vous le dire ?</span><div class="chips" role="group" aria-labelledby="dire-a-l">'+DIRE_A.map(a=>'<button type="button" class="chip" data-act="dire" data-k="a" data-v="'+a[0]+'" aria-pressed="'+(s.a===a[0])+'">'+a[1]+'</button>').join('')+'</div>'+
    '<div class="field"><label for="amorce">Pour commencer</label><textarea id="amorce" rows="4" maxlength="'+DIRE_LIM+'">'+esc(s.t)+'</textarea></div>'+mots+
    '<div class="em-mots"><span class="label" id="dire-mots-l">Vos mots, tels que vous les avez écrits</span>'+motsCadre(x,'dire-mots-l')+
    '<button type="button" class="chip dire-joint" data-act="dire" data-k="joint" aria-pressed="'+(!!s.j)+'">'+I.check+'Ajouter mes mots à la suite</button></div>'+
    '<div class="dire-b"><button type="button" class="btn primary" data-act="dire" data-k="copie">Copier</button><button type="button" class="btn ghost" data-act="dire" data-k="laisse">Finalement, je garde mes mots pour moi</button></div>'+
    '</div>'+pret+outil+'</main>';
}

/* ---------- souffler 2 minutes : l'étang respire avec le parent ---------- */
/* Trois respirations au choix, et chacune dure environ 2 minutes, comme le dit le bouton.
   « Le souffle régulier » : 5 secondes pour inspirer, 5 secondes pour souffler.
   « L'expiration prolongée » : 4 secondes pour inspirer, 6 secondes pour souffler. C'est celle d'un parent qui n'a rien choisi.
   « À mon rythme » : le parent règle la durée d'une respiration, de 5 à 14 secondes. Deux cinquièmes servent à inspirer, trois cinquièmes à souffler.
   Un cercle posé sur l'eau s'élargit quand on inspire et se referme quand on expire. Avec les effets visuels, une onde part sur l'étang à chaque expiration.
   Sans les effets (réglage du téléphone ou de « Moi »), le cercle ne bouge pas et seuls les mots changent.

   UN SEUL MINUTAGE. « state.souffle.seq » est la suite des mouvements décidés : chacun dit s'il faut inspirer ou souffler, quand il commence et combien il dure.
   Le cercle, les mots et la musique lisent tous cette même suite. Un mouvement est décidé un peu avant de commencer (« avance »),
   avec le réglage du moment : changer de respiration ou de cadence prend donc effet en douceur, au mouvement suivant, sans rien couper. */
const SOUFFLE={n:12,avant:1400,duree:115,avance:450};
const RESP={
  egal:{t:'Le souffle régulier',s:'Vous inspirez pendant 5 secondes, puis vous soufflez pendant 5 secondes.',p:'Vous inspirez par le nez pendant 5 secondes, puis vous soufflez par la bouche pendant 5 secondes.',in:5,out:5},
  long:{t:'L’expiration prolongée',s:'Vous inspirez pendant 4 secondes, puis vous soufflez plus longtemps, pendant 6 secondes.',p:'Vous inspirez par le nez pendant 4 secondes, puis vous soufflez par la bouche plus longtemps, pendant 6 secondes.',in:4,out:6},
  libre:{t:'À mon rythme',s:'Vous choisissez la cadence, et vous pouvez la ralentir ou l’accélérer.',p:'Vous inspirez par le nez, puis vous soufflez par la bouche un peu plus longtemps, à la cadence que vous avez choisie.'}
};
const RESP_ORDRE=['egal','long','libre'],CAD_MIN=5,CAD_MAX=14,CAD_DEF=8;
const SOUFFLE_CLE='Quand les notes montent, inspirez. Quand elles redescendent, soufflez doucement.';
/* Le choix du parent est gardé sur son appareil avec le reste : il retrouve sa respiration la fois suivante. */
function respReglage(){const r=D().souffle||{};const c=Math.round(Number(r.c));return {m:RESP[r.m]?r.m:'long',c:(c>=CAD_MIN&&c<=CAD_MAX)?c:CAD_DEF};}
function respDurees(){const r=respReglage();if(r.m==='libre')return {m:'libre',in:r.c*.4,out:r.c*.6};return {m:r.m,in:RESP[r.m].in,out:RESP[r.m].out};}
function respGarde(m,c){const r=respReglage();D().souffle={m:RESP[m]?m:r.m,c:c||r.c};save();}
function respCadTxt(c){return 'Une respiration dure '+c+' secondes.';}
/* Ce qui guide les yeux : la goutte quand l'eau est dessinée, 2 cercles sinon, et seulement les mots si le téléphone demande moins de mouvement. */
/* On regarde dès l'écran de préparation si le téléphone sait dessiner l'eau : la phrase dit alors vrai, et la photo est prête quand l'exercice commence. */
function souffleGuide(){if(!fxOn())return 'mots';if(EAU.ok===null)eauInit();return EAU.ok?'goutte':'cercles';}
function respPret(){const r=respReglage(),g=souffleGuide();return RESP[r.m].p+(r.m==='libre'?' '+respCadTxt(r.c):'')+(g==='goutte'?' La goutte vous guide. Elle monte quand vous inspirez, et elle redescend quand vous soufflez.':g==='cercles'?' Les cercles posés sur l’eau vous guident.':' Les mots à l’écran vous guident.');}
/* L'écran reste allumé pendant la respiration, et tant qu'un son de la page joue : sans cela, un téléphone réglé sur 30 secondes
   se verrouille au milieu de l'exercice ou avant la fin de l'instant d'écoute. Dès que c'est fini, le téléphone reprend son réglage. */
let veille=null,veilleP=false;
function veilleVoulue(){return (state.souffle.k==='cours'&&!state.souffle.pz)||SON.etat!=='off';}
function veilleOn(){
  try{
    if(!navigator.wakeLock||veille||veilleP||document.visibilityState!=='visible')return;
    veilleP=true;
    navigator.wakeLock.request('screen').then(v=>{
      veilleP=false;veille=v;
      try{v.addEventListener('release',()=>{if(veille===v)veille=null;});}catch(e){}
      if(!veilleVoulue())veilleOff();
    },()=>{veilleP=false;});
  }catch(e){veilleP=false;}
}
function veilleOff(){const v=veille;veille=null;try{if(v){const p=v.release();if(p&&p.catch)p.catch(()=>{});}}catch(e){}}
function veilleSync(){if(veilleVoulue())veilleOn();else veilleOff();}
function souffleStart(){
  const s=state.souffle;souffleStop();
  const d0=respDurees();
  s.k='cours';s.ph='';s.cyc=-1;s.ix=-1;s.tr=-1;s.e=0;s.t0=performance.now()+SOUFFLE.avant;s.hid=0;s.pz=0;s.pzSon=false;s.fin=0;s.cle=-1;s.choix=false;eauPause(false);
  /* La première inspiration est décidée tout de suite : si le parent écoute l'étang, ses premières notes sont prêtes avant qu'elle commence. */
  s.seq=[{ty:'in',a:s.t0,d:d0.in*1000,c:0,m:d0.m}];
  veilleOn();
}
function souffleStop(){
  const s=state.souffle;if(s.raf){(window.cancelAnimationFrame||clearTimeout)(s.raf);s.raf=0;}
  if(s.k==='cours')s.k='pret';
  s.choix=false;s.pz=0;s.pzSon=false;
  /* La goutte ne retombe pas d'un coup : elle redescend doucement à sa place, puis l'eau redevient calme. */
  eauPause(false);if(EAU.resp)EAU.resp.ret={de:EAU.resp.dy,t:eauNow()};
  veilleSync();
}
/* La pause : tout s'arrête là où on en est, la goutte, les mots, le compte des 2 minutes et la musique. « Reprendre » repart du même point. */
function soufflePause(){
  const s=state.souffle;if(s.k!=='cours')return;
  if(!s.pz){
    s.pz=performance.now();s.pzSon=SON.etat!=='off'&&SON.proprio==='souffle';
    if(s.raf){(window.cancelAnimationFrame||clearTimeout)(s.raf);s.raf=0;}
    if(s.pzSon)sonCoupe(true);
    eauPause(true);veilleSync();
  }else{
    souffleDecale(performance.now()-s.pz);s.pz=0;eauPause(false);veilleOn();
    if(s.pzSon&&SON.voulu){s.pzSon=false;sonSouffle();}
  }
}
/* Décider la suite. Après une inspiration vient une expiration, puis une nouvelle inspiration,
   tant qu'elle commencerait avant 1 minute 55. L'exercice se termine donc toujours à la fin d'une expiration, autour de 2 minutes. */
function souffleSuite(now){
  const s=state.souffle;
  for(let garde=0;garde<6&&!s.fin;garde++){
    const L=s.seq[s.seq.length-1];if(!L)return;
    const fin=L.a+L.d;
    if(fin-now>SOUFFLE.avance)return;
    if(L.ty==='in'){const d=respDurees();s.seq.push({ty:'out',a:fin,d:d.out*1000,c:L.c,m:d.m});}
    else if(fin-s.t0>=SOUFFLE.duree*1000-1)s.fin=fin;
    else{const d=respDurees();s.seq.push({ty:'in',a:fin,d:d.in*1000,c:L.c+1,m:d.m});}
  }
}
/* La page a passé un moment à l'arrière-plan : tout le minutage est décalé d'autant, et la respiration reprend là où elle en était. */
function souffleDecale(dt){const s=state.souffle;s.t0+=dt;if(s.fin)s.fin+=dt;(s.seq||[]).forEach(p=>{p.a+=dt;});}
/* La photo de la goutte suspendue au-dessus de l'étang (866 × 470). La goutte est au milieu, et son pied touche l'eau à 55 % de la hauteur.
   Quand l'eau est dessinée, la goutte de la photo s'élève à l'inspiration et redescend à l'expiration, et 2 ondes s'élargissent sur l'étang.
   Sinon (pas de carte graphique, téléphone qui peine), 2 cercles posés au même endroit s'élargissent à l'expiration : ils tiennent lieu de guide. */
const ETANG={w:866,h:470,x:434/866,y:259/470};
const GOUTTE_H=38;   /* de combien la goutte s'élève, en points de la photo : un peu plus que sa propre hauteur */
function soufflePose(){
  const host=document.querySelector('.souffle .etang');const r=document.querySelector('.souffle .ronds');if(!host||!r||!r.style)return;
  const im=host.querySelector('.etang-photo');const b=host.getBoundingClientRect();if(!im||b.width<40||b.height<40)return;
  let px=.5,py=.5;
  try{const m=String(getComputedStyle(im).objectPosition).match(/(-?[\d.]+)%\s+(-?[\d.]+)%/);if(m){px=m[1]/100;py=m[2]/100;}}catch(e){}
  const k=Math.max(b.width/ETANG.w,b.height/ETANG.h),dw=ETANG.w*k,dh=ETANG.h*k;
  /* Quand la photo est basse (le choix d'une respiration est ouvert), les cercles remontent un peu pour rester sur l'eau visible. */
  const x=(b.width-dw)*px+dw*ETANG.x,y=Math.min((b.height-dh)*py+dh*ETANG.y,b.height*.6);
  /* Le plus grand cercle reste dans l'écran, et il ne remonte pas jusqu'au rivage. */
  const w=Math.max(150,Math.min(b.width*.8,470*k*1.1,560));
  r.style.left=Math.round(x)+'px';r.style.top=Math.round(y)+'px';r.style.width=Math.round(w)+'px';r.style.height=Math.round(w*.27)+'px';
}
/* Sans le dessin de l'eau : à chaque expiration, un cercle de plus part du pied de la goutte et s'éloigne, puis s'efface. */
function souffleOnde(){
  const b=document.querySelector('.souffle .ronds b');if(!b||!b.classList)return;
  b.classList.remove('onde');void b.offsetWidth;b.classList.add('onde');
}
const SOUFFLE_MOT={avant:'Installez-vous',in:'Inspirez',out:'Expirez'};
/* La ligne sous le grand mot. En silence, elle dit comment respirer. Avec le son, elle donne la clé d'écoute pendant les premières respirations,
   puis elle se tait : la musique et ses silences guident le moment. */
function souffleAide(){
  const s=state.souffle,son=SON.proprio==='souffle'?SON.etat:'off',ph=s.ph||'avant';
  if(s.pz)return 'Reprenez quand vous voulez. Tout vous attend là où vous étiez.';
  const g=souffleGuide();
  if(ph==='avant')return son!=='off'?SOUFFLE_CLE:(g==='goutte'?'Posez vos épaules et vos pieds. La goutte va vous guider.':g==='cercles'?'Posez vos épaules et vos pieds. Les cercles vont vous guider.':'Posez vos épaules et vos pieds. Les mots vont vous guider.');
  if(son==='charge')return SOUFFLE_CLE;
  if(son==='on')return s.cyc<=s.cle?SOUFFLE_CLE:'';
  if(ph==='in')return g==='goutte'?'Par le nez, pendant que la goutte monte.':g==='cercles'?'Par le nez, pendant que les cercles se resserrent.':'Par le nez, doucement.';
  return g==='goutte'?'Par la bouche, lentement, pendant qu’elle redescend.':g==='cercles'?'Par la bouche, lentement, pendant que les cercles s’élargissent.':'Par la bouche, lentement.';
}
function souffleMots(){
  const s=state.souffle;if(s.k!=='cours')return;
  const mot=document.getElementById('souffle-mot'),aide=document.getElementById('souffle-aide'),tours=document.querySelector('.souffle .tours');
  const M=s.pz?'En pause':SOUFFLE_MOT[s.ph||'avant'];
  if(mot&&M&&mot.textContent!==M)mot.textContent=M;
  if(aide){const a=souffleAide();if(aide.textContent!==a)aide.textContent=a;}
  /* Les 12 points comptent le temps, 10 secondes par point, quelle que soit la cadence choisie. */
  if(tours&&tours.children)for(let i=0;i<tours.children.length;i++){const c=i<s.tr?'f':(i===s.tr?'c':'');if(tours.children[i].className!==c)tours.children[i].className=c;}
}
function souffleFrame(){
  const s=state.souffle;s.raf=0;
  /* Page à l'arrière-plan : le minutage attend. Il sera décalé au retour, et la respiration reprendra là où elle en était. */
  if(s.k!=='cours'||state.view!=='souffle'||s.hid||s.pz)return;
  const now=performance.now();
  souffleSuite(now);
  if(s.fin&&now>=s.fin){rsSuite(now);s.k='fini';s.choix=false;if(EAU.resp)EAU.resp.ret={de:EAU.resp.dy,t:eauNow()};veilleSync();noteRecent('exo','breath');render();return;}
  let i=typeof s.ix==='number'?s.ix:-1;
  while(i+1<s.seq.length&&s.seq[i+1].a<=now)i++;
  let ph='avant',cyc=-1,e=0;
  if(i>=0){const p=s.seq[i],x=Math.max(0,Math.min(1,(now-p.a)/p.d));ph=p.ty;cyc=p.c;e=p.ty==='in'?.5-.5*Math.cos(Math.PI*x):.5+.5*Math.cos(Math.PI*x);}
  const tr=now<s.t0?-1:Math.min(SOUFFLE.n-1,Math.floor((now-s.t0)/10000));
  /* La goutte suit le souffle, avec la même courbe douce que les mots et la musique : elle s'élève quand on inspire, elle redescend quand on expire. */
  const vive=eauRespire(document.querySelector('.souffle .etang'),-GOUTTE_H*e);s.e=e;
  if(i!==s.ix||ph!==s.ph||tr!==s.tr){
    const neuf=i!==s.ix||ph!==s.ph;
    s.ix=i;s.ph=ph;s.cyc=cyc;s.tr=tr;souffleMots();
    /* À chaque expiration, 2 ondes partent du pied de la goutte et s'élargissent sur l'étang, l'une après l'autre. */
    if(neuf&&ph==='out'&&fxOn()){if(vive){eauAdd(434,259,.9,0);eauAdd(434,259,.55,1.25);}else souffleOnde();}
  }
  const r=document.querySelector('.souffle .ronds');
  if(r&&r.style&&fxOn()&&!vive)r.style.setProperty('--s',(1-.5*e).toFixed(3));
  /* La musique reçoit les mouvements décidés par ce même minutage. */
  rsSuite(now);
  s.raf=(window.requestAnimationFrame||(f=>setTimeout(f,50)))(souffleFrame);
}
/* Après chaque rendu de l'écran : le cercle retrouve sa place, et la respiration reprend là où elle en était. */
function souffleApres(){
  if(state.view!=='souffle')return;
  soufflePose();
  const s=state.souffle;
  if(s.k==='cours'){
    souffleMots();
    /* L'écran vient d'être redessiné (pause, choix d'une respiration) : les 2 cercles de secours reprennent la taille qu'ils avaient. */
    try{const r=document.querySelector('.souffle .ronds');if(r&&r.style&&fxOn()&&typeof s.e==='number')r.style.setProperty('--s',(1-.5*s.e).toFixed(3));}catch(e){}
    if(!s.raf&&!s.pz)s.raf=(window.requestAnimationFrame||(f=>setTimeout(f,50)))(souffleFrame);
  }
  /* Quand le choix s'ouvre ou se referme, le curseur du clavier et du lecteur d'écran suit. */
  if(s.foc){const q=s.foc;s.foc='';try{const el=document.querySelector(q);if(el)el.focus({preventScroll:true});}catch(e){}}
}
/* « Changer de respiration » : le choix s'ouvre sous l'étang, sans arrêter l'exercice. Le cercle reste visible et continue. */
function respChoixHtml(){
  const s=state.souffle,r=respReglage();
  const opts=RESP_ORDRE.map(m=>'<button type="button" class="resp-o" data-act="resp" data-v="'+m+'" aria-pressed="'+(r.m===m)+'"><span class="resp-p" aria-hidden="true"></span><span class="tx"><b>'+RESP[m].t+'</b><span>'+RESP[m].s+'</span></span></button>').join('');
  const cad='<div class="resp-cad" id="resp-cad"'+(r.m==='libre'?'':' hidden')+'><button type="button" class="btn small" data-act="cad" data-v="lent"'+(r.c>=CAD_MAX?' aria-disabled="true"':'')+'>Plus lent</button><p id="resp-cad-t" role="status">'+respCadTxt(r.c)+'</p><button type="button" class="btn small" data-act="cad" data-v="vite"'+(r.c<=CAD_MIN?' aria-disabled="true"':'')+'>Plus vite</button></div>';
  return '<div class="resp-choix"><h2 id="resp-h">Changer de respiration</h2><div class="resp-os" role="group" aria-labelledby="resp-h">'+opts+'</div>'+cad+
    (s.k==='cours'?'<p class="resp-note">Le changement se fait en douceur, au prochain souffle.</p>':'')+
    '<div class="actions">'+(s.k==='cours'?'<button type="button" class="btn primary" data-act="resp-ferme">'+I.check+'Continuer</button>':'<button type="button" class="btn primary" data-act="souffle-go">'+I.wind+'Commencer</button>')+'</div></div>';
}
/* Un choix ou un réglage de cadence change l'écran sur place, sans le redessiner : le cercle et la musique ne sont pas dérangés. */
function respChoixMaj(){
  const r=respReglage();
  try{
    const L=document.querySelectorAll('.resp-o');
    for(let i=0;i<L.length;i++)L[i].setAttribute('aria-pressed',String(L[i].getAttribute('data-v')===r.m));
    const c=document.getElementById('resp-cad');if(c)c.hidden=r.m!=='libre';
    const t=document.getElementById('resp-cad-t');if(t&&t.textContent!==respCadTxt(r.c))t.textContent=respCadTxt(r.c);
    const B=document.querySelectorAll('.resp-cad [data-act="cad"]');
    for(let i=0;i<B.length;i++){const bout=B[i].getAttribute('data-v')==='lent'?r.c>=CAD_MAX:r.c<=CAD_MIN;if(bout)B[i].setAttribute('aria-disabled','true');else B[i].removeAttribute('aria-disabled');}
  }catch(e){}
}
function viewSouffle(){
  const s=state.souffle;const k=s.k;const choix=!!s.choix&&k!=='fini';
  const tours='<div class="tours" aria-hidden="true">'+Array.from({length:SOUFFLE.n},()=>'<i></i>').join('')+'</div>';
  const changer='<button type="button" class="resp-l" data-act="resp-ouvre">'+I.swap+'Changer de respiration</button>';
  let bas='';
  if(k==='cours')bas='<h1 class="sr">Souffler 2 minutes</h1><p class="mot" id="souffle-mot" role="status">'+(s.pz?'En pause':SOUFFLE_MOT[s.ph||'avant'])+'</p>'+
    (choix?respChoixHtml():'<p class="aide" id="souffle-aide">'+souffleAide()+'</p>'+tours+
    /* La pause est le premier bouton, large, à portée du pouce. L'exercice commence en silence : « Écouter l'étang » ajoute la musique, et le même bouton la coupe sans arrêter la respiration. */
    '<div class="actions souffle-a">'+(s.pz?'<button type="button" class="btn primary souffle-pz" data-act="souffle-pause">'+I.wind+'Reprendre</button>':'<button type="button" class="btn souffle-pz" data-act="souffle-pause">'+I.pause+'Pause</button>'+sonBoutonHtml('souffle'))+'<button type="button" class="btn ghost" data-act="souffle-stop">'+I.stop+'Arrêter</button></div>'+(s.pz?'':changer));
  else if(k==='fini')bas='<h1 class="sr">Souffler 2 minutes</h1><p class="mot" id="souffle-mot" role="status">Voilà.</p><p class="aide">Vous venez de prendre 2 minutes rien que pour vous. Vous êtes aussi une personne, et pas seulement un parent.</p>'+
    /* Un parent arrivé par la porte de l'accueil n'a pas encore vu « Aujourd'hui » : le bouton lui dit ce qu'il va y trouver d'abord. */
    '<div class="actions col"><button type="button" class="btn primary wide" data-act="go" data-view="today">'+I.sun2+(state.vuAuj?'Revenir à aujourd’hui':'Lire la dose du jour')+'</button><button type="button" class="btn wide" data-act="porte" data-v="deposer">'+I.drop+'Déposer ce qui pèse</button><button type="button" class="btn ghost wide" data-act="souffle-go">'+I.wind+'Encore 2 minutes</button></div>'+
    /* Les dernières notes s'éteignent d'elles-mêmes. Le parent peut aussi les couper. */
    (SON.etat!=='off'&&SON.proprio==='souffle'?'<div class="actions fin-son">'+sonBoutonHtml('souffle')+'</div>':'');
  else bas='<h1 class="mot" id="souffle-mot">Souffler 2 minutes</h1>'+
    (choix?respChoixHtml():'<p class="aide">'+respPret()+'</p><div class="actions"><button type="button" class="btn primary" data-act="souffle-go">'+I.wind+'Commencer</button></div>'+changer);
  return '<main id="main" tabindex="-1" class="view souffle s-'+k+(choix?' s-choix':'')+'" style="padding-top:0"><header class="bar sub"><button type="button" class="back" data-act="back">'+I.back+'Retour</button><button type="button" class="sos" data-act="go" data-view="sos">'+I.alert+'SOS</button></header>'+
    /* La goutte suspendue au-dessus de l'étang. Elle s'élève quand on inspire, elle redescend quand on expire, et 2 ondes s'élargissent sur l'eau. */
    '<div class="etang bleed"><img class="etang-photo" src="'+HERO+'" alt="" width="866" height="470" decoding="async"><span class="ronds" aria-hidden="true"><i></i><i></i><b></b></span></div>'+
    '<div class="resp">'+bas+'</div></main>';
}

/* ---------- prendre un instant : l'étang, à regarder ou à toucher ---------- */
/* On y arrive depuis la dose du jour. L'écran s'ouvre en silence : la goutte rebondit une fois, puis l'eau redevient calme.
   Un toucher sur l'eau fait naître une onde fine, qui s'efface d'elle-même. Le son (40 secondes d'étang) ne part que si le parent le demande,
   et il s'arrête dès que l'on quitte l'écran. Le doigt ne retient pas la page : elle défile comme partout ailleurs. */
function viewInstant(){
  return '<main id="main" tabindex="-1" class="view souffle instant s-pret" style="padding-top:0"><header class="bar sub"><button type="button" class="back" data-act="back">'+I.back+'Retour</button><button type="button" class="sos" data-act="go" data-view="sos">'+I.alert+'SOS</button></header>'+
    '<div class="etang bleed"><img class="etang-photo" src="'+HERO+'" alt="Une goutte suspendue au-dessus d’un étang, dans la lumière d’une forêt." width="866" height="470" decoding="async"></div>'+
    '<div class="resp"><h1 class="mot">Prendre un instant</h1><p class="aide">'+(fxOn()?'Touchez l’eau si vous en avez envie. Vous pouvez aussi simplement la regarder.':'Regardez l’eau aussi longtemps que vous voulez. Ici, rien ne vous attend.')+'</p>'+
    '<div class="actions">'+sonBoutonHtml('dose')+'</div></div></main>';
}

/* ---------- le son de l'étang ---------- */
/* Tout est composé pour cet espace (du son calculé, sans aucun enregistrement) et chargé seulement quand le parent le demande.
   Pour la respiration, la musique n'est pas un morceau écrit d'avance : la page la joue note après note, en suivant le minutage de l'exercice.
   « notes » contient 9 notes de piano feutré, rangées l'une après l'autre dans des cases de 6,5 secondes, et « eau » une boucle d'étang.
   Quand on inspire, 3 notes montent, une note grave les porte et l'eau s'éclaircit. Quand on souffle, les notes redescendent et l'eau se retire.
   « instant » dure 40 secondes et accompagne la dose.
   Les règles : silence par défaut, une seule musique à la fois, une entrée et une sortie en douceur,
   et plus aucun son dès qu'on quitte l'écran qui l'a lancé (Arrêter, Retour, SOS, autre écran, page à l'arrière-plan). */
I.son='<svg class="i" viewBox="0 0 24 24"><path d="M4 10v4h3l5 4V6l-5 4H4z"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M18.6 6.4a8 8 0 0 1 0 11.2"/></svg>';
I.silence='<svg class="i" viewBox="0 0 24 24"><path d="M4 10v4h3l5 4V6l-5 4H4z"/><path d="M16.5 9.5l4.5 5M21 9.5l-4.5 5"/></svg>';
const SON_OK=SITE&&!PRE;
const SON={mode:'',ctx:null,voix:null,fins:[],el:null,octets:{},tampons:{},attente:{},piste:'',proprio:'',pos:null,etat:'off',jeton:0,voulu:false,reprise:null,veille:0,dit:false};
const SON_VOL=0.9,SON_ENTREE=2.4,SON_SORTIE=0.4;
/* La musique de la respiration. Les mêmes nombres servent à « outils/son/compose2.py », qui fabrique les fichiers et simule le résultat pour le mesurer. */
const RS_CASE=6.5,RS_AVANT=0.03,RS_CASES={43:0,45:1,47:2,50:3,57:4,62:5,64:6,66:7,69:8};
const RS_MONTE=[62,66,69],RS_DESC={egal:[66,64,62],long:[66,64,62,57],libre:[66,64,62,57]},RS_BASSES=[50,47,43,45];
const RS_G_MONTE=[.62,.74,.86],RS_G_DESC=[.70,.60,.52,.46],RS_G_BASSE=.50;
const RS_VOL=.85,RS_ENTREE=1.6,RS_EAU=.62,RS_EAU_BAS=.40,RS_CLAIR=3600,RS_SOMBRE=1100,RS_BOUCLE=[.5,28.5];
let SON_IOS=false;try{SON_IOS=/iP(hone|ad|od)/.test(navigator.userAgent||'')||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);}catch(e){}
function sonUrl(nom){return RACINE+'son/'+nom+'.mp3?v='+SON_V;}
/* Deux façons de jouer. La première calcule le son dans la page : elle permet les fondus et de poser chaque note au bon moment.
   Sur iPhone, le bouton « silencieux » la coupe, sauf si la page se déclare comme un lecteur, ce qui est possible depuis iOS 17.
   Pour l'instant de la dose, un iPhone plus ancien passe donc par le lecteur audio ordinaire, que ce bouton ne coupe pas.
   La musique de la respiration, elle, a besoin de la première façon : sur un iPhone plus ancien, un message rappelle de vérifier le bouton silencieux. */
function sonWA(){return !!((window.AudioContext||window.webkitAudioContext)&&window.fetch);}
function sonMode(){
  if(SON.mode)return SON.mode;
  SON.mode=(sonWA()&&(!SON_IOS||navigator.audioSession))?'wa':'el';
  return SON.mode;
}
function sonSession(lecteur){try{if(navigator.audioSession)navigator.audioSession.type=lecteur?'playback':'auto';}catch(e){}}
function sonCtx(){
  sonSession(true);
  if(!SON.ctx){const C=window.AudioContext||window.webkitAudioContext;SON.ctx=new C();}
  if(SON.ctx.state!=='running'&&SON.ctx.resume){const r=SON.ctx.resume();if(r&&r.catch)r.catch(()=>{});}
  return SON.ctx;
}
/* Un fichier n'est téléchargé qu'une fois par visite, à la première demande. Il est gardé tel quel,
   et décodé à chaque passage sur son écran : le décodeur reçoit une copie, parce qu'il vide ce qu'on lui confie. */
function sonCharge(nom){
  if(SON.tampons[nom])return Promise.resolve(SON.tampons[nom]);
  if(SON.attente[nom])return SON.attente[nom];
  const ctx=SON.ctx;
  const octets=SON.octets[nom]?Promise.resolve(SON.octets[nom]):fetch(sonUrl(nom)).then(r=>{if(!r.ok)throw new Error('son');return r.arrayBuffer();}).then(ab=>{SON.octets[nom]=ab;return ab;});
  const p=octets.then(ab=>new Promise((ok,ko)=>{try{const q=ctx.decodeAudioData(ab.slice(0),ok,ko);if(q&&q.then)q.then(ok,ko);}catch(e){ko(e);}}))
    .then(buf=>{delete SON.attente[nom];SON.tampons[nom]=buf;sonMenage();return buf;},e=>{delete SON.attente[nom];throw e;});
  SON.attente[nom]=p;return p;
}
/* Un son décodé pèse plusieurs mégaoctets dans la mémoire du téléphone : il est rendu dès qu'on quitte son écran. */
function sonMenage(){
  if(state.view!=='souffle'){delete SON.tampons.notes;delete SON.tampons.eau;}
  if(state.view!=='today')delete SON.tampons.instant;
  if(state.view!=='avec')delete SON.tampons.antonio;
}
/* Une « voix » est ce qui joue : un réglage de volume général et une ou plusieurs sources. Quand sa dernière source s'est tue, elle est rangée. */
function sonSource(v,src,noeuds,fin){
  v.srcs.push(src);
  src.onended=()=>{
    try{src.disconnect();(noeuds||[]).forEach(n=>{try{n.disconnect();}catch(e){}});}catch(e){}
    const k=v.srcs.indexOf(src);if(k>=0)v.srcs.splice(k,1);
    if(!v.srcs.length&&SON.voix!==v){SON.fins=SON.fins.filter(x=>x!==v);try{v.g.disconnect();}catch(e){}}
    if(fin)fin();
  };
}
/* Ce qui finissait de s'éteindre se tait tout de suite avant un nouveau départ : 2 musiques ne se recouvrent jamais. */
function sonTaire(){
  const ctx=SON.ctx;
  SON.fins.forEach(v=>{
    try{const t=ctx.currentTime;v.g.gain.cancelScheduledValues(t);v.g.gain.setValueAtTime(0.0001,t);v.srcs.slice().forEach(x=>{try{x.stop(t+0.02);}catch(e){try{x.stop();}catch(z){}}});}catch(e){}
  });
  SON.fins=[];
}
function sonDepart(buf,j){
  if(j!==SON.jeton)return;
  const ctx=SON.ctx,o=Math.max(0,SON.pos?SON.pos():0);
  if(o>=buf.duration-0.5){sonEtat('off');return;}
  sonTaire();
  let src,g;
  try{
    src=ctx.createBufferSource();g=ctx.createGain();const t=ctx.currentTime;
    src.buffer=buf;src.connect(g);g.connect(ctx.destination);
    /* L'entrée : presque rien pendant la première seconde, puis le son s'installe. */
    const E=SON.proprio==='avec'?0.12:SON_ENTREE;
    g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(SON_VOL*0.2,t+E*0.5);g.gain.linearRampToValueAtTime(SON_VOL,t+E);
    const v={g:g,srcs:[],niv:x=>{const e=(x-t)/E;return SON_VOL*(e>=1?1:(e<.5?Math.max(0,e)*.4:.2+(e-.5)*1.6));}};
    sonSource(v,src,null,()=>{if(SON.voix===v){SON.voix=null;try{g.disconnect();}catch(e){}if(j===SON.jeton){SON.jeton++;sonSession(false);sonEtat('off');}}});
    src.start(0,o);SON.voix=v;
  }catch(e){sonRate(j);return;}
  sonEtat('on');
  /* Si le téléphone n'a pas laissé le son partir (une autre application le retient, par exemple), le bouton le dit : il redevient « Écouter ». */
  clearTimeout(SON.veille);SON.veille=setTimeout(()=>{if(j===SON.jeton&&SON.etat==='on'&&SON.ctx&&SON.ctx.state!=='running')sonCoupe(true);},900);
}
function sonElement(){
  if(SON.el)return SON.el;
  const a=new Audio();a.preload='auto';
  a.addEventListener('ended',()=>{if(SON.mode==='el'&&SON.proprio!=='souffle'&&SON.etat!=='off'){SON.jeton++;sonEtat('off');}});
  /* Le téléphone peut couper le son lui-même (un appel, des écouteurs retirés) : le bouton dit alors la vérité. */
  a.addEventListener('pause',()=>{if(SON.mode==='el'&&SON.proprio!=='souffle'&&SON.etat==='on'&&!a.ended){SON.jeton++;sonEtat('off');}});
  SON.el=a;return a;
}
function sonElJoue(nom,j){
  const a=sonElement(),url=sonUrl(nom);
  if(a.getAttribute('src')!==url)a.setAttribute('src',url);
  const cale=()=>{const o=SON.pos?SON.pos():0;if(Math.abs((a.currentTime||0)-o)>0.4){try{a.currentTime=Math.max(0,o);}catch(e){}}};
  cale();
  let p;try{p=a.play();}catch(e){sonRate(j);return;}
  const ok=()=>{if(j!==SON.jeton)return;cale();sonEtat('on');};
  if(p&&p.then)p.then(ok,()=>sonRate(j));else ok();
}
/* L'état du son change : le bouton, l'écran qui reste allumé et la ligne d'aide de la respiration suivent. */
function sonEtat(e){SON.etat=e;sonBoutons();veilleSync();if(state.view==='souffle')souffleMots();}
function sonRate(j){if(j!==SON.jeton)return;SON.jeton++;sonEtat('off');toast('Le son n’a pas pu se charger. Tout le reste fonctionne en silence.');}
/* Un morceau entier, joué du début à la fin : c'est l'instant qui suit la dose. */
function sonJoue(nom,proprio,pos){
  if(!SON_OK)return;
  if(SON.etat!=='off')sonCoupe(true);
  const j=++SON.jeton;SON.piste=nom;SON.proprio=proprio;SON.pos=pos||null;SON.reprise=null;sonEtat('charge');
  if(sonMode()==='wa'){
    try{sonCtx();}catch(e){SON.mode='el';}
    if(SON.mode==='wa'){sonCharge(nom).then(buf=>sonDepart(buf,j),()=>sonRate(j));return;}
  }
  sonElJoue(nom,j);
}

/* ----- la musique de la respiration ----- */
/* Le minutage de l'exercice compte en millisecondes de la page. Le son, lui, a sa propre horloge.
   « rsTemps » dit à quel instant de l'horloge du son il faut poser une note pour qu'elle s'entende à un instant donné de la page.
   Le temps que le son met à sortir du téléphone est retiré quand le navigateur le donne. */
function rsTemps(tPage){
  const ctx=SON.ctx;let lat=0;
  try{lat=Math.min(.3,Math.max(0,(Number(ctx.outputLatency)||0)+(Number(ctx.baseLatency)||0)));}catch(e){}
  return ctx.currentTime+(tPage-performance.now())/1000-lat;
}
/* Où commence vraiment la première note dans le fichier décodé ? Les navigateurs ne décodent pas tous le début d'un fichier de la même façon,
   à quelques centièmes de seconde près. On le mesure une fois, et toutes les notes sont posées en conséquence. */
function rsCale(buf){
  try{const d=buf.getChannelData(0),n=Math.min(d.length,Math.floor(buf.sampleRate*.25));for(let i=0;i<n;i++){if(d[i]>.004||d[i]<-.004)return Math.max(0,Math.min(.12,i/buf.sampleRate));}}catch(e){}
  return RS_AVANT;
}
function rsEau(e){return {f:RS_SOMBRE+(RS_CLAIR-RS_SOMBRE)*e,g:RS_EAU*(RS_EAU_BAS+(1-RS_EAU_BAS)*e)};}
/* Une note de piano : la bonne case du fichier, à son volume, à l'instant voulu. Une note qui arriverait trop tard n'est pas jouée du tout. */
function rsNote(v,midi,gain,t){
  const ctx=SON.ctx,tn=ctx.currentTime;
  if(t<tn-.12||!(midi in RS_CASES))return;
  const src=ctx.createBufferSource(),g=ctx.createGain();
  src.buffer=v.bn;g.gain.value=gain;src.connect(g);g.connect(v.g);
  sonSource(v,src,[g]);
  src.start(Math.max(tn,t-v.avant),RS_CASES[midi]*RS_CASE,RS_CASE-.05);
}
/* Un mouvement de la respiration devient de la musique : l'eau avance ou se retire pendant toute sa durée, et les notes se partagent ce temps. */
function rsMouvement(v,p){
  const ctx=SON.ctx,tn=ctx.currentTime,t=rsTemps(p.a),d=p.d/1000,haut=p.ty==='in';
  const a=rsEau(haut?0:1),b=rsEau(haut?1:0);
  if(t+d>tn+.02){
    if(t>=tn){v.f.frequency.setValueAtTime(a.f,t);v.ge.gain.setValueAtTime(a.g,t);}
    else{const x=(tn-t)/d,m=rsEau(haut?x:1-x);v.f.frequency.setValueAtTime(m.f,tn);v.ge.gain.setValueAtTime(m.g,tn);}
    v.f.frequency.linearRampToValueAtTime(b.f,t+d);v.ge.gain.linearRampToValueAtTime(b.g,t+d);
  }
  const N=haut?RS_MONTE:(RS_DESC[p.m]||RS_DESC.long),G=haut?RS_G_MONTE:RS_G_DESC;
  for(let i=0;i<N.length;i++)rsNote(v,N[i],G[i],t+d*i/N.length);
  if(haut)rsNote(v,RS_BASSES[p.c%RS_BASSES.length],RS_G_BASSE,t);
}
/* La fin : un dernier accord égrené, puis tout s'éteint lentement. */
function rsFinale(v,fin){
  const ctx=SON.ctx,tn=ctx.currentTime,t=Math.max(tn,rsTemps(fin));
  rsNote(v,50,.5,t);rsNote(v,57,.5,t+.3);rsNote(v,66,.6,t+.6);
  v.tf=t;
  try{v.g.gain.setValueAtTime(RS_VOL,Math.max(t+1.5,v.t0+RS_ENTREE+.01));v.g.gain.linearRampToValueAtTime(0.0001,t+9);}catch(e){}
  const j=SON.jeton;
  v.fin=setTimeout(()=>{
    if(SON.voix!==v)return;
    SON.voix=null;v.srcs.slice().forEach(x=>{try{x.stop();}catch(e){}});SON.fins.push(v);
    if(j===SON.jeton){SON.jeton++;sonSession(false);sonEtat('off');}
  },Math.max(0,(t+9.2-tn)*1000));
}
/* Appelée à chaque image par le minutage de l'exercice : tout mouvement nouvellement décidé reçoit sa musique. */
function rsSuite(now){
  const v=SON.voix;if(!v||!v.resp||SON.etat!=='on')return;
  const s=state.souffle,ctx=SON.ctx;
  /* Si le téléphone a suspendu le son (un appel, par exemple), le bouton le dit : il redevient « Écouter l'étang ». */
  if(ctx.state!=='running'){if(!v.arret)v.arret=now;else if(now-v.arret>1500){sonCoupe(true);return;}}else v.arret=0;
  try{
    while(v.jx<s.seq.length){rsMouvement(v,s.seq[v.jx]);v.jx++;}
    if(s.fin&&!v.finale){v.finale=true;rsFinale(v,s.fin);}
  }catch(e){sonCoupe(true);}
}
function rsDepart(bn,be,j){
  if(j!==SON.jeton)return;
  const s=state.souffle,ctx=SON.ctx;
  if(state.view!=='souffle'||s.k!=='cours'){SON.jeton++;sonEtat('off');return;}
  sonTaire();
  let v;
  try{
    const t=ctx.currentTime,now=performance.now();
    const g=ctx.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(RS_VOL,t+RS_ENTREE);g.connect(ctx.destination);
    const src=ctx.createBufferSource(),f=ctx.createBiquadFilter(),ge=ctx.createGain();
    src.buffer=be;src.loop=true;src.loopStart=RS_BOUCLE[0];src.loopEnd=RS_BOUCLE[1];
    f.type='lowpass';f.Q.value=.6;
    src.connect(f);f.connect(ge);ge.connect(g);
    v={resp:true,g:g,srcs:[],bn:bn,f:f,ge:ge,t0:t,tf:0,avant:rsCale(bn),jx:0,finale:false,fin:0,arret:0};
    v.niv=x=>{let n=RS_VOL*Math.max(0,Math.min(1,(x-v.t0)/RS_ENTREE));if(v.tf&&x>v.tf+1.5)n=Math.min(n,RS_VOL*Math.max(0,1-(x-v.tf-1.5)/7.5));return n;};
    /* Où en est la respiration à cet instant ? L'eau prend tout de suite la place qu'elle aurait eue, et finit le mouvement en cours. */
    let i=-1;while(i+1<s.seq.length&&s.seq[i+1].a<=now)i++;
    let e=0;
    if(i>=0){const p=s.seq[i],x=Math.max(0,Math.min(1,(now-p.a)/p.d));e=p.ty==='in'?x:1-x;}
    const m=rsEau(e);f.frequency.setValueAtTime(m.f,t);ge.gain.setValueAtTime(m.g,t);
    if(i>=0){const p=s.seq[i],tf=rsTemps(p.a+p.d),b=rsEau(p.ty==='in'?1:0);if(tf>t+.02){f.frequency.linearRampToValueAtTime(b.f,tf);ge.gain.linearRampToValueAtTime(b.g,tf);}}
    /* Les notes, elles, entrent au début du mouvement suivant : la première chose que l'on entend est une phrase entière, qui monte ou qui redescend. */
    v.jx=i+1;
    sonSource(v,src,[f,ge]);
    src.start(t,RS_BOUCLE[0]);
  }catch(e){sonRate(j);return;}
  SON.voix=v;
  /* La clé d'écoute reste affichée pendant la respiration en cours et la suivante. */
  s.cle=Math.max(0,s.cyc)+1;
  sonEtat('on');
  if(SON_IOS&&!navigator.audioSession&&!SON.dit){SON.dit=true;toast('Si vous n’entendez rien, vérifiez le bouton silencieux du téléphone.');}
  clearTimeout(SON.veille);SON.veille=setTimeout(()=>{if(j===SON.jeton&&SON.etat==='on'&&SON.ctx&&SON.ctx.state!=='running')sonCoupe(true);},900);
}
/* « Écouter l'étang » pendant la respiration. */
function sonSouffle(){
  if(!SON_OK||!sonWA())return;
  if(SON.etat!=='off')sonCoupe(true);
  const j=++SON.jeton;SON.piste='etang';SON.proprio='souffle';SON.pos=null;SON.reprise=null;sonEtat('charge');
  try{sonCtx();}catch(e){sonRate(j);return;}
  Promise.all([sonCharge('notes'),sonCharge('eau')]).then(b=>rsDepart(b[0],b[1],j),()=>sonRate(j));
}
/* Couper : le son s'éteint en moins d'une demi-seconde. « vite » sert quand on quitte la page, où il ne doit rien rester. */
function sonCoupe(vite){
  SON.jeton++;clearTimeout(SON.veille);
  const v=SON.voix;SON.voix=null;
  if(v&&SON.ctx){
    const d=vite?0.05:SON_SORTIE;clearTimeout(v.fin);
    try{
      const t=SON.ctx.currentTime;const n=v.niv?v.niv(t):1;
      v.g.gain.cancelScheduledValues(t);v.g.gain.setValueAtTime(Math.max(0.0001,n),t);v.g.gain.linearRampToValueAtTime(0.0001,t+d);
      v.srcs.slice().forEach(x=>{try{x.stop(t+d+0.03);}catch(e){}});
      if(v.srcs.length)SON.fins.push(v);
    }catch(e){v.srcs.slice().forEach(x=>{try{x.stop();}catch(z){}});}
    const j=SON.jeton;setTimeout(()=>{if(j===SON.jeton)sonSession(false);},700);
  }
  if(SON.el){try{SON.el.pause();}catch(e){}}
  if(SON.etat!=='off')sonEtat('off');
}
/* Le son appartient à l'écran qui l'a lancé : la respiration en cours (ou tout juste finie), ou « Aujourd'hui » pour l'instant de la dose. */
function sonChezLui(){
  if(SON.proprio==='souffle')return state.view==='souffle'&&(state.souffle.k==='cours'||state.souffle.k==='fini');
  if(SON.proprio==='dose')return state.view==='instant'&&!state.sheet;
  if(SON.proprio==='avec')return state.view==='avec'&&!state.sheet;
  return false;
}
/* Après chaque rendu : si l'écran n'est plus celui du son, le son s'arrête. C'est ce qui couvre Arrêter, Retour, SOS et tous les autres chemins. */
function sonGarde(){
  if(state.view!=='souffle')SON.voulu=false;
  if((SON.etat!=='off'||SON.reprise)&&!sonChezLui()){SON.reprise=null;sonCoupe();}
  sonMenage();
}
const SON_TXT={souffle:{off:'Écouter l’étang',charge:'L’étang arrive…',on:'Couper le son'},dose:{off:'Écouter l’étang',charge:'L’étang arrive…',on:'Revenir au silence'},avec:{off:'Écouter Antonio, 30 secondes',charge:'Un instant…',on:'Arrêter'}};
const SON_NOMS={souffle:'etang',dose:'instant',avec:'antonio'};
function sonBoutonHtml(ou){
  if(!SON_OK||(ou==='souffle'&&!sonWA()))return '';
  const nom=SON_NOMS[ou]||'instant';
  const e=(SON.piste===nom&&SON.proprio===ou)?SON.etat:'off';
  return '<button type="button" class="son-b son-'+ou+'" data-act="son" data-v="'+nom+'" data-etat="'+e+'"'+(e==='charge'?' aria-busy="true"':'')+'>'+(e==='off'?I.son:I.silence)+'<span class="tx"><b>'+SON_TXT[ou][e]+'</b>'+(ou==='dose'&&e==='off'?' <small>40 secondes, quand vous voulez</small>':'')+'</span></button>';
}
/* Le bouton change sur place, sans redessiner l'écran : la respiration et la lecture ne sont pas dérangées. */
function sonBoutons(){
  try{
    const L=document.querySelectorAll('.son-b');
    for(let i=0;i<L.length;i++){
      const b=L[i],ou=b.classList.contains('son-souffle')?'souffle':(b.classList.contains('son-avec')?'avec':'dose');
      const t=document.createElement('div');t.innerHTML=sonBoutonHtml(ou);const n=t.firstChild;if(!n)continue;
      const e=n.getAttribute('data-etat');b.setAttribute('data-etat',e);
      if(e==='charge')b.setAttribute('aria-busy','true');else b.removeAttribute('aria-busy');
      b.innerHTML=n.innerHTML;
      /* À la fin de la respiration, le bouton ne sert plus une fois les dernières notes éteintes. */
      const fin=b.parentNode&&b.parentNode.classList&&b.parentNode.classList.contains('fin-son');if(fin&&e==='off')b.parentNode.hidden=true;
    }
  }catch(e){}
}

/* ---------- qui parle, dans cet espace ---------- */
/* Une feuille courte, ouverte depuis la dose, depuis la réponse à un dépôt et depuis « Moi ».
   Elle dit ce que l'application choisit, ce qui vient d'Antonio, et ce que la formule « Avec Antonio » montre en démonstration. */
function sheetVoix(sheetIn){
  const ia=!!state.sample;
  return '<div class="backdrop" data-act="sheet-close"></div><div class="sheet'+(sheetIn?' in':'')+'" role="dialog" aria-modal="true" aria-labelledby="voix-t" tabindex="-1"><div class="sheet-in voix"><div class="grab"></div><h2 id="voix-t">Qui vous parle ici ?</h2>'+
    '<div class="qui"><h3>Ce que l’application choisit</h3><p>'+(ia?'La dose du jour et les pistes proposées sont des textes écrits à l’avance, et l’application choisit lequel vous montrer. Quand vous déposez, la réponse est écrite par une intelligence artificielle, et l’espace vous le dit à chaque fois.':'La dose du jour, la question et la lumière que vous recevez après un dépôt et les pistes proposées sont des textes écrits à l’avance. L’application choisit lequel vous montrer, selon le jour et selon quelques mots de votre texte. Personne ne lit ce que vous écrivez, et rien ne quitte votre appareil.')+'</p></div>'+
    (ia?'':'<div class="qui"><h3>Ce que deviennent vos mots</h3><p>Vos mots sont enregistrés dans ce navigateur, sur cet appareil, et vous les retrouvez dans « Mes dépôts ». L’application ne les réécrit pas. Si vous choisissez « J’aimerais le dire à quelqu’un », elle vous propose une première phrase écrite à l’avance, que vous pouvez changer. Rien n’est envoyé. C’est vous qui copiez le texte et qui décidez à qui le montrer.</p></div>')+
    '<div class="qui"><h3>Ce qui vient d’Antonio</h3><p>Les passages « Ce que j’ai vécu » et la page « Mon histoire » racontent ce qu’Antonio Company a vraiment vécu, comme enfant accueilli, comme travailleur social et comme père. Les autres textes de l’espace sont publiés sous sa responsabilité.</p></div>'+
    '<div class="qui"><h3>Ce qui vient de vous dans « Passer le relais »</h3><p>Les phrases modèles sont écrites à l’avance, et la fiche est faite des mots que vous choisissez. Aucune intelligence artificielle n’y intervient, et le site ne lit pas vos fiches.</p></div>'+
    '<button type="button" class="btn primary wide" data-act="sheet-close">J’ai compris</button></div></div>';
}

/* ---------- pour un visiteur arrivé par un lien : le haut et le bas des pages publiques ---------- */
function barPub(){
  return '<header class="bar pubbar"><a class="wordmark" href="'+RACINE+'" data-act="accueil" aria-label="Parent écouté, parent éclairé. Revenir à l’accueil">'+LOGO+'<span>Parent écouté,<small>parent éclairé</small></span></a><button type="button" class="sos" data-act="go" data-view="sos">'+I.alert+'SOS</button></header>';
}
function piedPub(){
  return '<section class="invite" aria-labelledby="invite-t"><h2 id="invite-t">Cette fiche vient d’un espace d’écoute pour les parents</h2><p>« Parent écouté, parent éclairé » a été créé par Antonio Company, éducateur social, responsable d’une équipe socio-éducative et père de 3 enfants. Vous pouvez y souffler, y déposer ce qui pèse et y recevoir chaque jour une dose de lumière. C’est gratuit pour commencer, et il n’y a pas de compte à créer.</p>'+
    portes(true)+
    '<a class="btn wide" href="'+RACINE+'" data-act="accueil">Découvrir l’espace</a></section>'+
    '<footer class="foot"><a href="'+RACINE+'fiches/" data-act="fiches">Toutes les situations</a><a href="'+RACINE+'confidentialite.html">Confidentialité</a><a href="'+RACINE+'conditions.html">Conditions générales</a>'+(MENTIONS?'<a href="'+RACINE+'mentions-legales.html">Mentions légales</a>':'')+'</footer>';
}

/* ---------- la version d'essai : une copie à part, pour essayer avant de publier ---------- */
function essaiNotes(){try{const d=JSON.parse(localStorage.getItem(KEY_SITE)||'null');return d&&typeof d==='object'&&d.onboarded?d:null;}catch(e){return null;}}
function essaiCarte(){
  if(!ESSAI)return '';
  const n=essaiNotes();
  return '<div class="card essai"><span class="label">Version d’essai</span><p class="hint">Vous êtes sur une version d’essai de l’espace, à une adresse à part. Ce que vous y écrivez est rangé séparément, et le site habituel ne change pas.</p>'+
    (n?'<button type="button" class="btn" data-act="essai-copie" style="align-self:flex-start">Ouvrir ici une copie de mes notes</button><p class="hint">Vos dépôts, votre carnet et votre progression de parent-ecoute.ch sont recopiés ici. Les originaux ne sont pas modifiés.</p>':'')+
    (state.confirmEssai?'<div class="confirm" role="alert"><span>Effacer ce que contient la version d’essai sur cet appareil ?</span><div class="row"><button type="button" class="btn danger" data-act="essai-zero-oui">Oui, effacer</button><button type="button" class="btn" data-act="essai-zero-non">Annuler</button></div></div>':'<button type="button" class="btn" data-act="essai-zero" style="align-self:flex-start">Revoir la version d’essai depuis le début</button>')+reperesHtml()+'</div>';
}

/* ---------- « Passer le relais » ---------- */
/* Un outil pour la famille, acheté une fois, indépendant du parcours. Il fabrique une page que l'on confie à la personne qui prend le relais :
   un week-end chez un proche, une garde, une première nuit ailleurs. Tout est fait de modèles écrits d'avance et des mots de la famille.
   Aucune intelligence artificielle n'intervient. Les écrits restent sur l'appareil. Quand la famille envoie la fiche, celle-ci voyage
   dans le lien lui-même, après le signe # : aucun serveur ne la reçoit, et le proche l'ouvre sans compte et sans achat.
   Voir l'exemple, préparer sa fiche et la relire est gratuit. L'envoyer, l'imprimer, noter le retour, repartir de la dernière fiche
   et préparer une réunion demandent l'outil (49 CHF, une seule fois). */
const RL_LIM={l:200,nom:40,chez:60,quand:80,tel:40,lignes:5,moi:4,retour:600,dem:400,pri:140,obs:6};
/* Les rubriques de la fiche : la clé, le titre sans prénom, le titre avec prénom, puis les phrases modèles.
   Une phrase en 2 versions s'adresse au proche : la première le tutoie, la seconde le vouvoie. {P} est le nom choisi par la famille. */
const RL_SEC=[
  ['aide','Ce qui aide','Ce qui aide {P}',['Dire « encore 5 minutes » avant de changer d’activité aide beaucoup {P}.','Une seule consigne à la fois, avec des mots simples.','Le programme de la journée, dit le matin en 3 étapes au plus.','Un endroit calme où se retirer quand il y a du bruit ou du monde.',['Du temps pour répondre. Compte jusqu’à 10 dans ta tête avant de répéter.','Du temps pour répondre. Comptez jusqu’à 10 dans votre tête avant de répéter.'],'Son objet du moment reste à portée de main. Il s’agit de']],
  ['repas','Les repas','Les repas',['{Pm} mange volontiers','Proposer un aliment suffit. Insister pour goûter complique le repas.','Les aliments se servent séparés dans l’assiette.','{Pm} a besoin d’aide pour couper et se sert pour le reste.','À table, 20 minutes suffisent. Ensuite, {P} peut se lever.']],
  ['nuit','Le soir et la nuit','Le soir et la nuit',['Le coucher se fait vers 21 heures, toujours dans le même ordre.','Une veilleuse reste allumée et la porte reste entrouverte.','En cas de réveil, une phrase courte suffit, par exemple « C’est la nuit, je suis là ».','Les écrans s’arrêtent 1 heure avant le coucher.','Le matin, {P} a besoin d’un moment de calme avant de parler.']],
  ['monte','Si la tension monte','Si la tension monte',['Les premiers signes sont','Parler peu, baisser la voix et laisser de la place aide {P} à redescendre.','Mieux vaut prévenir {P} avant de s’approcher ou de toucher.','Ce qui apaise le plus, c’est','Quand c’est passé, un verre d’eau suffit. Il n’y a pas besoin d’en reparler.',['Tu peux m’appeler à tout moment, cela ne me dérange jamais.','Vous pouvez m’appeler à tout moment, cela ne me dérange jamais.']]],
  ['comm','Pour se comprendre','Pour se comprendre',['{Pm} comprend mieux les phrases courtes, une idée à la fois.','Pour dire oui, {P} hoche la tête. Pour dire non, {P} détourne le regard.','{Pm} montre ce qui compte avec des images, des gestes ou en tirant par la main.','Une question répétée sert souvent à se rassurer. La même réponse, dite calmement, suffit.','Mieux vaut une question à la fois, avec 2 choix au plus.']],
  ['aime','Ce qui fait plaisir','Ce que {P} aime',['{Pm} aime','Une activité qui marche presque toujours, c’est','{Pm} aime choisir entre 2 propositions.','{Pm} n’aime pas']],
  ['secu','Santé et sécurité','Santé et sécurité',['Les médicaments sont préparés dans le pilulier. Ils se donnent à 8 heures et à 20 heures.','{Pm} ne doit pas manger','Dehors, {P} a besoin d’un adulte à côté, surtout près d’une route.','{Pm} ne sait pas nager.',['En cas de doute, appelle-moi d’abord.','En cas de doute, appelez-moi d’abord.']]]
];
const RL_MOI=['J’aime','Je n’aime pas','Pour m’aider, on peut','Je décide moi-même de','Quand je dis non,'];
const RL_PAS=['Pour qui','Le quotidien','Les 3 repères','Sa parole','Me joindre'];
const RL_AVEC=[['ecole','L’école'],['foyer','Le foyer ou l’institution'],['soin','Un médecin ou un thérapeute'],['autre','Quelqu’un d’autre']];
const RL_RPAS=['Avec qui','Mes observations','Ma demande','Mes 3 priorités'];
/* « Je perds mes mots » : des débuts de phrase pour écrire sa demande, puis des phrases à dire pendant la réunion. */
const RL_MOTS_ECRIRE=['Ce que j’observe à la maison, c’est que','Ce qui aide {P}, c’est','Je vous demande de','Pouvons-nous essayer pendant un mois de','J’ai besoin de savoir','Ce qui m’inquiète le plus, c’est'];
const RL_MOTS_DIRE=['Je reprends mes notes un instant.','Je voudrais revenir à ma première priorité.','Pouvez-vous me le redire avec des mots simples ?','Qui fait quoi, et pour quand ?','Je préfère y réfléchir et vous répondre par écrit.','J’aimerais que ce soit noté dans le compte rendu.'];
/* Trois fiches d'exemple, inventées : un enfant, une adolescente, un adulte. Aucun âge n'est affiché : l'outil sert à tout âge. Les prénoms et les numéros ne sont ceux de personne. */
const RL_EX={
  e:{id:'ex-e',qui:'Noé',chez:'sa grand-mère',quand:'du samedi 21 au dimanche 22 novembre',tu:true,m:'',
    trois:['Noé ne parle pas encore avec des phrases. Il montre, il tire par la main, et il comprend bien plus qu’il ne dit.','Avant chaque changement, montre-lui l’image ou l’objet de ce qui vient après.','S’il se met à crier, ce n’est pas un caprice. Baisse la voix, éloigne-le du bruit et attends avec lui.'],
    moi:['J’aime l’eau, les bulles et la chanson du crocodile.','Mon lapin en peluche reste avec moi, même à table.','Je dis non en tournant la tête.'],
    s:{repas:['Noé mange volontiers des pâtes, de la banane et du pain.','Proposer un aliment suffit. Insister pour goûter complique le repas.'],nuit:['Le coucher se fait vers 19 heures 30, après le bain et 2 histoires.','Une veilleuse reste allumée et la porte reste entrouverte.'],monte:['Les premiers signes sont les mains sur les oreilles et les pleurs sans larmes.','Ce qui apaise le plus, c’est le noir, sa couverture et quelqu’un assis à côté sans parler.'],secu:['Dehors, Noé a besoin d’une main, surtout près d’une route.','En cas de doute, appelle-moi d’abord.']},
    tel:[{n:'Maman',t:'079 000 00 00'},{n:'Papa',t:'079 000 00 01'}]},
  a:{id:'ex-a',qui:'Lina',chez:'sa tante Élise',quand:'du vendredi 20 au dimanche 22 novembre',tu:true,m:'',
    trois:['Lina a besoin de temps seule après une journée avec du monde. Sa chambre est son refuge, frappe avant d’entrer.','Dis-lui la veille ce qui est prévu. Un changement de dernière minute la met en difficulté.','Son téléphone est son lien avec ses amies. Nous avons convenu ensemble qu’il s’arrête à 22 heures.'],
    moi:['J’aime dessiner, et je préfère qu’on ne commente pas mes dessins.','Je n’aime pas qu’on me touche les cheveux.','Quand je mets mon casque, j’ai besoin de calme. Je ne boude pas.'],
    s:{aide:['Une seule consigne à la fois, avec des mots simples.','Du temps pour répondre. Compte jusqu’à 10 dans ta tête avant de répéter.'],repas:['Lina mange de tout, sauf le poisson et les plats très épicés.','Elle aime aider à cuisiner si on lui confie une tâche précise.'],nuit:['Elle se couche vers 22 heures 30 et lit un moment.','Le matin, Lina a besoin d’un moment de calme avant de parler.'],monte:['Les premiers signes sont les réponses très courtes et les mains qui se tordent.','Parler peu, baisser la voix et laisser de la place aide Lina à redescendre.']},
    tel:[{n:'Maman',t:'079 000 00 00'}]},
  g:{id:'ex-g',qui:'Bastien',chez:'son oncle Rémi',quand:'du samedi 21 au dimanche 22 novembre',tu:true,m:'',
    trois:['Bastien a besoin de savoir ce qui vient après. Dis-lui le programme le matin, en 3 étapes au plus.','Quand il se balance et parle plus fort, il sature. Propose-lui sa chambre et son casque, puis laisse-lui 10 minutes.','C’est un adulte. Demande-lui son avis avant de décider pour lui, même pour un détail.'],
    moi:['J’aime prendre mon café seul, le matin.','Je n’aime pas qu’on parle de moi comme si je n’étais pas là.','Je choisis mes habits moi-même.'],
    s:{aide:['Une seule consigne à la fois, avec des mots simples.','Du temps pour répondre. Compte jusqu’à 10 dans ta tête avant de répéter.'],repas:['Bastien mange de tout, sauf les plats en sauce où tout est mélangé.','Bastien a besoin d’aide pour couper et se sert pour le reste.'],nuit:['Il se couche vers 22 heures, après sa série.','La porte reste entrouverte et la lumière du couloir reste allumée.'],monte:['Parler peu, baisser la voix et laisser de la place aide Bastien à redescendre.','Quand c’est passé, un verre d’eau suffit. Il n’y a pas besoin d’en reparler.'],secu:['Les médicaments sont préparés dans le pilulier. Ils se donnent à 8 heures et à 20 heures.']},
    tel:[{n:'Maman',t:'079 000 00 00'},{n:'Le foyer',t:'026 000 00 00'}]}
};
/* Le dictionnaire de la compression. Il est figé : le changer rendrait illisibles les liens déjà envoyés. Une nouvelle version aurait un autre préfixe. */
const RL_DICO='Les médicaments sont préparés dans le pilulier. Ils se donnent à 8 heures et à 20 heures. ne doit pas manger Dehors, a besoin d’un adulte à côté, surtout près d’une route. ne sait pas nager. En cas de doute, appelle-moi d’abord. appelez-moi d’abord. aime choisir entre 2 propositions. Une activité qui marche presque toujours, c’est n’aime pas comprend mieux les phrases courtes, une idée à la fois. Pour dire oui, hoche la tête. Pour dire non, détourne le regard. montre ce qui compte avec des images, des gestes ou en tirant par la main. Une question répétée sert souvent à se rassurer. La même réponse, dite calmement, suffit. Mieux vaut une question à la fois, avec 2 choix au plus. Les premiers signes sont Parler peu, baisser la voix et laisser de la place aide à redescendre. Mieux vaut prévenir avant de s’approcher ou de toucher. Ce qui apaise le plus, c’est Quand c’est passé, un verre d’eau suffit. Il n’y a pas besoin d’en reparler. Tu peux m’appeler à tout moment, cela ne me dérange jamais. Vous pouvez Le coucher se fait vers 21 heures, toujours dans le même ordre. Une veilleuse reste allumée et la porte reste entrouverte. En cas de réveil, une phrase courte suffit, par exemple « C’est la nuit, je suis là ». Les écrans s’arrêtent 1 heure avant le coucher. Le matin, a besoin d’un moment de calme avant de parler. mange volontiers Proposer un aliment suffit. Insister pour goûter complique le repas. Les aliments se servent séparés dans l’assiette. a besoin d’aide pour couper et se sert pour le reste. À table, 20 minutes suffisent. Ensuite, peut se lever. Un signal 5 minutes avant de changer d’activité aide beaucoup Une seule consigne à la fois, avec des mots simples. Le programme de la journée, dit le matin en 3 étapes au plus. Un endroit calme où se retirer quand il y a du bruit ou du monde. Du temps pour répondre. Compte jusqu’à 10 dans ta tête avant de répéter. Comptez jusqu’à 10 dans votre tête Son objet du moment reste à portée de main. Il s’agit de J’aime Je n’aime pas Pour m’aider, on peut Je décide moi-même de Quand je dis non, du samedi au dimanche vendredi novembre décembre janvier février mars avril mai juin juillet août septembre octobre son oncle sa tante sa grand-mère son grand-père ses grands-parents mon frère ma sœur notre fils notre fille mon fils ma fille Maman Papa 079 078 077 076 026 021 022 "],"comm":["","aime":["","secu":[""],"nuit":["","monte":[""],"repas":["","aide":[""]},"j":[["","0"],[""]],"d":"2026-11-{"q":"","c":"","w":"","u":1,"t":["","","","m":[""],"s":{"aide":["';

function rel(){const d=D();if(!d.rel||typeof d.rel!=='object')d.rel={};const r=d.rel;if(!Array.isArray(r.fiches))r.fiches=[];if(!Array.isArray(r.reunions))r.reunions=[];return r;}
function rlId(){return 'r'+Date.now().toString(36)+Math.floor(Math.random()*1296).toString(36);}
function rlFiche(id){return rel().fiches.find(f=>f.id===id)||null;}
function rlReu(id){return rel().reunions.find(x=>x.id===id)||null;}
function rlVide(){return {id:rlId(),c:todayIso(),m:todayIso(),qui:'',chez:'',quand:'',tu:true,trois:['','',''],moi:[],s:{},tel:[{n:'',t:''}],env:'',retour:'',garde:''};}
function rlOuvert(){return can('relais')||!!D().tout;}
function rlDe(p){return (/^[aeiouyhàâéèêëîïôöùûœ]/i.test(p)?'d’':'de ')+p;}
function rlTitre(f){return f.qui?'Le relais '+rlDe(f.qui):'La fiche de relais';}
function rlSousTitre(f){const a=[];if(f.chez)a.push('Pour '+f.chez);if(f.quand)a.push(f.quand);return a.join(', ');}
function rlMaj(s){return s?s.charAt(0).toUpperCase()+s.slice(1):s;}
/* Une phrase modèle, écrite pour cette fiche : avec le nom choisi, et en tutoyant ou en vouvoyant le proche. */
function rlModele(m,f){const t=Array.isArray(m)?m[f.tu===false?1:0]:m;const p=f.qui||'votre enfant';return t.replace(/\{Pm\}/g,rlMaj(p)).replace(/\{P\}/g,p);}
function rlLignes(f,k){if(!f.s||typeof f.s!=='object')f.s={};if(!Array.isArray(f.s[k]))f.s[k]=[];return f.s[k];}
function rlToutes(f){const out=[];RL_SEC.forEach(S=>((f.s||{})[S[0]]||[]).forEach(x=>{const t=clean(x,RL_LIM.l);if(t&&out.indexOf(t)<0)out.push(t);}));return out;}
function rlTelHtml(t){const s=String(t||'');return /^[+0-9 ().-]{6,20}$/.test(s)?'<a href="tel:'+esc(s.replace(/[^+0-9]/g,''))+'">'+esc(s)+'</a>':esc(s);}
function rlPropre(f){
  const L=(a,n)=>(Array.isArray(a)?a:[]).map(x=>clean(x,RL_LIM.l)).filter(Boolean).slice(0,n);
  const o={qui:clean(f.qui,RL_LIM.nom),chez:clean(f.chez,RL_LIM.chez),quand:clean(f.quand,RL_LIM.quand),tu:f.tu!==false,trois:L(f.trois,3),moi:L(f.moi,RL_LIM.moi),s:{},tel:(Array.isArray(f.tel)?f.tel:[]).map(x=>({n:clean(x&&x.n,RL_LIM.tel),t:clean(x&&x.t,RL_LIM.tel)})).filter(x=>x.n||x.t).slice(0,3),m:f.m||''};
  RL_SEC.forEach(S=>{const l=L((f.s||{})[S[0]],RL_LIM.lignes);if(l.length)o.s[S[0]]=l;});
  return o;
}
/* La fiche, telle qu'elle est lue, envoyée et imprimée. Un seul dessin pour l'exemple, l'aperçu, la fiche reçue et l'impression. */
/* Une fiche tient sur une page A4. On la pose hors de l'écran telle qu'elle sera imprimée, on mesure sa hauteur,
   et l'on resserre le texte en 2 crans si elle est chargée. La hauteur utile d'une feuille est de 269 mm. On garde 5 % de marge. */
const RL_PAGE_MM=269*.95;
function rlMesure(f0){
  let b=null;
  try{
    if(typeof document==='undefined'||!document.body)return {d:0,ok:true};
    b=document.createElement('div');b.className='rl-banc';b.setAttribute('aria-hidden','true');
    b.innerHTML='<div class="rl-etalon" style="height:100mm"></div>'+rlFicheHtml(f0,{cls:'rl-papier',brut:true});
    document.body.appendChild(b);
    const mm=b.firstElementChild.getBoundingClientRect().height/100;const el=b.lastElementChild;
    if(!(mm>0))return {d:0,ok:true};
    let d=0,h=0;
    for(d=0;d<3;d++){el.classList.remove('rl-d0','rl-d1','rl-d2');el.classList.add('rl-d'+d);h=el.getBoundingClientRect().height/mm;if(h<=RL_PAGE_MM)break;}
    return {d:Math.min(d,2),ok:h<=RL_PAGE_MM,mm:Math.round(h)};
  }catch(e){return {d:0,ok:true};}
  finally{try{if(b&&b.parentNode)b.parentNode.removeChild(b);}catch(e){}}
}
function rlFicheHtml(f0,o){
  o=o||{};const f=rlPropre(f0),tu=f.tu,P=f.qui;const H=o.h1?'h1':'h2';const T=o.h1?['<h2 class="rl-h">','</h2>']:['<h3>','</h3>'];
  const dens=o.brut?null:rlMesure(f0);if(dens&&o.mesure)o.mesure.d=dens.d,o.mesure.ok=dens.ok;
  const li=a=>a.map(x=>'<li>'+esc(x)+'</li>').join('');
  const secs=RL_SEC.map(S=>{const L=f.s[S[0]];return L?'<section class="rl-s">'+T[0]+esc(P?S[2].replace('{P}',P):S[1])+T[1]+'<ul>'+li(L)+'</ul></section>':'';}).join('');
  /* « se-pose » : la feuille vient se poser, une seule fois, quand l'aperçu s'ouvre (voir rlSePose). */
  const ps=o.pose==null?null:o.pose;
  return '<article class="rl-fiche'+(o.cls?' '+o.cls:'')+(dens?' rl-d'+dens.d:'')+(ps!=null?' se-pose':'')+'"'+(ps>.05?' style="--pose-d:-'+ps.toFixed(2)+'s"':'')+'>'+
    '<header class="rl-tete"><span class="rl-goutte" aria-hidden="true">'+LOGO+'</span><div><'+H+' class="rl-t">'+esc(rlTitre(f))+'</'+H+'>'+(rlSousTitre(f)?'<p class="rl-st">'+esc(rlSousTitre(f))+'</p>':'')+'</div></header>'+
    '<section class="rl-trois">'+T[0]+(tu?'Si tu ne lis que trois choses':'Si vous ne lisez que trois choses')+T[1]+(f.trois.length?'<ol>'+li(f.trois)+'</ol>':'<p class="rl-vide">Vos 3 repères viendront ici.</p>')+'</section>'+
    (f.moi.length?'<section class="rl-moi">'+T[0]+'Ce que je souhaite dire moi-même'+T[1]+'<ul>'+li(f.moi)+'</ul>'+(P?'<p class="rl-signe">'+esc(rlMaj(P))+'</p>':'')+'</section>':'')+
    (secs?'<div class="rl-cols">'+secs+'</div>':'')+
    (f.tel.length?'<section class="rl-tel">'+T[0]+'Me joindre'+T[1]+'<ul>'+f.tel.map(x=>'<li>'+(x.n?'<b>'+esc(x.n)+'</b> ':'')+rlTelHtml(x.t)+'</li>').join('')+'</ul></section>':'')+
    '<footer class="rl-pied"><span>En cas d’urgence vitale, les secours. En Suisse, le 144.</span><span>Fiche écrite par la famille'+(f.m?', le '+esc(fmtDate(f.m)):'')+'.</span></footer></article>';
}
/* La feuille qui se pose. Quand le parent ouvre l'aperçu de sa fiche (ou l'exemple), la feuille descend de quelques millimètres,
   se redresse et son ombre se resserre, comme une feuille que l'on pose devant lui. Cela dure 1 seconde, une seule fois.
   rlSePose rend le temps écoulé depuis l'ouverture, ou null quand il n'y a rien à jouer : si l'écran est redessiné pendant le mouvement,
   il continue là où il en était. Avec « Réduire les animations », la feuille est simplement là. Imprimée, elle ne bouge jamais. */
function rlSePose(){const t=state.rl.poseT;if(!t||!fxOn())return null;const dt=(performance.now()-t)/1000;return dt<1.5?dt:null;}
/* À l'ouverture, le titre « Si tu ne lis que trois choses » et ses 3 repères doivent se lire ensemble, sans faire défiler.
   Si l'écran est assez grand, la page ne bouge pas. Sinon elle s'ouvre un peu plus bas, juste ce qu'il faut, et toujours au début
   d'un bloc entier (jamais au milieu d'une ligne) : d'abord sans le petit titre, puis sans le grand titre, puis directement sur la feuille.
   Ce qui est passé au-dessus reste à portée de doigt. Sur un très petit écran, la page s'ouvre sur le titre des 3 repères. */
function rlVoirTrois(){
  try{
    const fe=document.querySelector('.v-relais .feuille'),fi=fe&&fe.querySelector(':scope>.rl-fiche'),t=fi&&fi.querySelector('.rl-trois');if(!t)return;
    const barre=document.querySelector('header.bar');const haut=(barre?Math.max(0,barre.getBoundingClientRect().bottom):0)+6;
    let bas=window.innerHeight;const tabs=document.querySelector('.tabs');
    if(tabs&&getComputedStyle(tabs).position==='fixed'){const y=tabs.getBoundingClientRect().top;if(y>window.innerHeight/2)bas=y;}
    bas-=6;
    const r=t.getBoundingClientRect(),manque=r.bottom-bas;if(manque<=0)return;
    /* les débuts de bloc possibles, de haut en bas, jusqu'à la feuille */
    const C=[];
    for(const el of fe.children){if(el===fi){C.push(el.getBoundingClientRect().top-haut);break;}
      if(el.classList.contains('f-tete'))[].forEach.call(el.children,x=>C.push(x.getBoundingClientRect().top-haut));else C.push(el.getBoundingClientRect().top-haut);}
    let dy=C.filter(v=>v>=manque-1).sort((a,b)=>a-b)[0];
    if(dy==null)dy=manque;
    dy=Math.min(dy,r.top-haut);
    if(dy>0)window.scrollTo(0,Math.round(window.scrollY+dy));
  }catch(e){}
}
function rlAvantImpression(){
  try{
    const r=state.rl;if(r.e==='feuille')return;const f=r.e==='lu'?r.lu:r.e==='exemple'?RL_EX[RL_EX[r.ex]?r.ex:'g']:rlFiche(r.id);const el=document.querySelector('.v-relais .rl-fiche');
    if(!f||!el)return;const m=rlMesure(f);el.classList.remove('rl-d0','rl-d1','rl-d2');el.classList.add('rl-d'+m.d);
  }catch(e){}
}
function rlTexte(f0){
  const f=rlPropre(f0),out=[rlTitre(f)];const st=rlSousTitre(f);if(st)out.push(st);
  out.push('',f.tu?'Si tu ne lis que trois choses':'Si vous ne lisez que trois choses');f.trois.forEach((x,i)=>out.push((i+1)+'. '+x));
  if(f.moi.length){out.push('','Ce que je souhaite dire moi-même');f.moi.forEach(x=>out.push('- '+x));}
  RL_SEC.forEach(S=>{const L=f.s[S[0]];if(L){out.push('',f.qui?S[2].replace('{P}',f.qui):S[1]);L.forEach(x=>out.push('- '+x));}});
  if(f.tel.length){out.push('','Me joindre');f.tel.forEach(x=>out.push('- '+[x.n,x.t].filter(Boolean).join(' ')));}
  out.push('','En cas d’urgence vitale, les secours. En Suisse, le 144.');
  return out.join('\n');
}

/* ---------- la fiche dans le lien ---------- */
/* La fiche est écrite en JSON, compressée (les mots déjà vus sont remplacés par un renvoi), puis écrite en lettres et en chiffres.
   Elle voyage après le signe # de l'adresse : cette partie-là n'est jamais envoyée au serveur. */
function rlU8(s){return new TextEncoder().encode(s);}
function rlStr(u){return new TextDecoder().decode(u);}
function rlB64(u){let s='';for(let i=0;i<u.length;i++)s+=String.fromCharCode(u[i]);return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
function rlB64d(t){t=t.replace(/-/g,'+').replace(/_/g,'/');while(t.length%4)t+='=';const b=atob(t);const u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u;}
function rlZip(src){
  const dico=rlU8(RL_DICO),n0=dico.length,N=n0+src.length;const buf=new Uint8Array(N);buf.set(dico);buf.set(src,n0);
  const tete=new Map();const cle=p=>buf[p]<<16|buf[p+1]<<8|buf[p+2];
  const note=p=>{if(p+2<N){const k=cle(p);let l=tete.get(k);if(!l){l=[];tete.set(k,l);}l.push(p);}};
  for(let p=0;p<n0;p++)note(p);
  const out=[];let flags=0,nb=0,grp=[],i=n0;
  while(i<N){
    let best=0,bp=0;
    if(i+2<N){const L=tete.get(cle(i));if(L){for(let q=L.length-1;q>=0&&q>=L.length-32;q--){const p=L[q];if(i-p>4095)break;let l=3;while(l<18&&i+l<N&&buf[p+l]===buf[i+l])l++;if(l>best){best=l;bp=p;if(l===18)break;}}}}
    if(best>=3){const off=i-bp;flags|=1<<nb;grp.push(off>>4,(off&15)<<4|(best-3));for(let k=0;k<best;k++){note(i);i++;}}
    else{grp.push(buf[i]);note(i);i++;}
    if(++nb===8){out.push(flags);for(let k=0;k<grp.length;k++)out.push(grp[k]);flags=0;nb=0;grp=[];}
  }
  if(nb){out.push(flags);for(let k=0;k<grp.length;k++)out.push(grp[k]);}
  return new Uint8Array(out);
}
function rlUnzip(z,max){
  const dico=rlU8(RL_DICO),n0=dico.length;const out=new Uint8Array(n0+max);out.set(dico);let n=n0,i=0;
  while(i<z.length){const flags=z[i++];
    for(let b=0;b<8&&i<z.length;b++){
      if(flags>>b&1){if(i+1>=z.length)throw new Error('lien');const a=z[i++],c=z[i++];const off=a<<4|c>>4,len=(c&15)+3;const p=n-off;if(off<1||p<0||n+len>out.length)throw new Error('lien');for(let k=0;k<len;k++)out[n++]=out[p+k];}
      else{if(n>=out.length)throw new Error('lien');out[n++]=z[i++];}
    }}
  return out.subarray(n0,n);
}
/* Une somme de contrôle de 3 octets suit la fiche. Un lien coupé ou abîmé en route est refusé, au lieu d'afficher une fiche fausse d'une lettre ou d'un chiffre. */
function rlSomme(u){let h=0x811c9dc5;for(let i=0;i<u.length;i++){h^=u[i];h=Math.imul(h,0x01000193)>>>0;}return (h^(h>>>24))&0xffffff;}
function rlCode(f0){const f=rlPropre(f0);const o={q:f.qui,c:f.chez,w:f.quand,u:f.tu?1:0,t:f.trois,m:f.moi,s:f.s,j:f.tel.map(x=>[x.n,x.t]),d:f.m};
  const src=rlU8(JSON.stringify(o)),z=rlZip(src),k=rlSomme(src);const u=new Uint8Array(z.length+3);u.set(z);u[z.length]=k>>16&255;u[z.length+1]=k>>8&255;u[z.length+2]=k&255;
  return '1.'+rlB64(u);}
function rlDecode(t){
  try{const m=/^1\.([A-Za-z0-9_-]{8,16000})$/.exec(String(t||''));if(!m)return null;
    const u=rlB64d(m[1]);if(u.length<5)return null;const n=u.length-3;const src=rlUnzip(u.subarray(0,n),24000);const k=rlSomme(src);
    if((k>>16&255)!==u[n]||(k>>8&255)!==u[n+1]||(k&255)!==u[n+2])return null;
    const o=JSON.parse(rlStr(src));if(!o||typeof o!=='object'||Array.isArray(o))return null;
    const f=rlPropre({qui:o.q,chez:o.c,quand:o.w,tu:o.u!==0,trois:o.t,moi:o.m,s:(o.s&&typeof o.s==='object')?o.s:{},tel:(Array.isArray(o.j)?o.j:[]).map(x=>({n:x&&x[0],t:x&&x[1]})),m:/^\d{4}-\d\d-\d\d$/.test(o.d)?o.d:''});
    f.id='lu';return f;}catch(e){return null;}
}
function rlLien(f){return PUBLIC+'relais/#f='+rlCode(f);}
/* Une adresse …/relais/#f=… porte une fiche. Lue au démarrage et quand l'adresse change. */
function rlDuHash(){const m=/^#f=(.+)$/.exec(location.hash||'');if(!m)return false;state.rl.h=m[1];state.rl.lu=rlDecode(m[1]);state.rl.e='lu';return true;}

/* ---------- les écrans ---------- */
function rlFil(noms,p,quoi){return '<ol class="ap-fil rl-fil" aria-label="'+quoi+'">'+noms.map((t,i)=>'<li'+(i===p?' aria-current="step"':'')+' class="'+(i<p?'ap-fait':i===p?'ap-ici':'')+'"><span>'+(i+1)+'</span><b>'+t+'</b></li>').join('')+'</ol>';}
/* La carte de l'offre. Elle dit ce qui est gratuit et ce que l'outil ajoute, puis ouvre la commande. */
function rlOffre(de){
  return '<section class="offre rl-offre" aria-labelledby="rl-offre-t"><div class="f-haut"><h2 id="rl-offre-t">Passer le relais</h2><p class="f-prix"><b>49 CHF</b> <small>une seule fois</small></p></div>'+
    '<p class="f-benef">Envoyer la fiche, l’imprimer et la retrouver prête la prochaine fois.</p>'+
    '<button type="button" class="btn primary wide" data-act="commande" data-v="relais" data-de="'+(de||'relais')+'">Choisir Passer le relais</button>'+
    '<p class="f-note">Voir l’exemple, préparer votre fiche et la relire est gratuit. L’outil sert ensuite à toute la famille, sans abonnement et sans limite de fiches.</p>'+
    '<p class="demo-paie">'+I.info+'<span>'+DEMO_PAIE+'</span></p></section>';
}
function rlVueAccueil(){
  const R=rel(),F=R.fiches,a=rlOuvert();const attente=F.slice().reverse().find(f=>f.env&&!f.retour);
  let h='<div class="f-tete"><span class="label">Un outil pour toute la famille</span><h1 class="t1">Passer le relais</h1><p class="sub">Une page pour la personne qui garde votre enfant, écrite avec vos mots. Elle sait l’essentiel en 1 minute, et vous partez l’esprit plus léger.</p></div>';
  if(!F.length){
    h+='<div class="ap-suite"><button type="button" class="btn primary wide" data-act="rl" data-k="exemple">'+I.eye+'Voir un exemple de fiche terminée</button><button type="button" class="btn wide" data-act="rl" data-k="nouveau">'+I.pen+'Préparer mon premier relais</button></div>'+
      '<ol class="rl-comment"><li><b>Vous choisissez vos phrases.</b><span>Des modèles vous aident à commencer, et vous les adaptez avec vos mots.</span></li><li><b>Vous décidez des 3 repères.</b><span>Ils sont en tête de la fiche, sous « Si tu ne lis que trois choses ».</span></li><li><b>Votre proche ouvre la fiche.</b><span>Il la lit sur son téléphone, sans compte et sans rien acheter.</span></li><li><b>Au retour, une seule question.</b><span>Le prochain relais est alors prêt en quelques gestes.</span></li></ol>'+
      /* L'outil sert aussi sans fiche : une réunion se prépare avec le journal « avant, pendant, après » ou avec ce que le parent écrit sur le moment. */
      (a?'<div class="ap-suite"><button type="button" class="btn wide" data-act="rl" data-k="reunion">'+I.user+'Préparer une réunion avec l’école ou le foyer</button></div>':'');
  }else{
    if(attente&&a)h+='<section class="rl-carte rl-auretour"><h2>Le relais est passé ?</h2><p>'+esc(rlTitre(attente))+(attente.chez?', pour '+esc(attente.chez):'')+'. Une seule question vous attend.</p><button type="button" class="btn primary" data-act="rl" data-k="retour" data-id="'+attente.id+'">Répondre</button></section>';
    h+='<section class="rl-mes" aria-labelledby="rl-mes-t"><h2 id="rl-mes-t">Mes relais</h2><div class="liste">'+F.slice().reverse().map(f=>'<button type="button" class="sit" data-act="rl" data-k="ouvrir" data-id="'+f.id+'"><span class="e">'+I.note+'</span><span class="tx"><b>'+esc(rlTitre(f))+'</b><span>'+esc([f.chez?'Pour '+f.chez:'',f.env?'envoyée le '+fmtDate(f.env):'pas encore envoyée',f.retour?'retour noté':''].filter(Boolean).join(', '))+'</span></span><span class="chev">'+I.chev+'</span></button>').join('')+'</div></section>'+
      '<div class="ap-suite"><button type="button" class="btn primary wide" data-act="rl" data-k="suivant">'+I.plus+'Préparer un nouveau relais</button><p class="hint">Vous repartez de votre dernière fiche, et vous ne changez que ce qui change.</p>'+
      '<button type="button" class="btn wide" data-act="rl" data-k="reunion">'+I.user+'Préparer une réunion avec l’école ou le foyer</button><button type="button" class="lien-f" data-act="rl" data-k="exemple">'+I.eye+'Revoir un exemple de fiche</button></div>';
  }
  {
    if(R.reunions.length)h+='<section class="rl-mes" aria-labelledby="rl-reu-t"><h2 id="rl-reu-t">Mes réunions</h2><div class="liste">'+R.reunions.slice().reverse().map(x=>'<button type="button" class="sit" data-act="rl" data-k="feuille" data-id="'+x.id+'"><span class="e">'+I.user+'</span><span class="tx"><b>'+esc(rlReuTitre(x))+'</b><span>'+esc(x.quand||'Ma feuille pour la réunion')+'</span></span><span class="chev">'+I.chev+'</span></button>').join('')+'</div></section>';
  }
  h+=a?'<p class="rl-acquis">'+I.check+'<span>Vous avez Passer le relais. Il sert à toute la famille, sans limite de fiches.</span></p>':rlOffre('relais');
  h+='<p class="rl-prive">'+I.lock+'<span>Vos fiches restent sur votre appareil. Vous décidez de ce que vous envoyez, et à qui.</span></p>'+
    '<button type="button" class="lien-f" data-act="rl" data-k="sauver">'+I.download+'Sauvegarder ou restaurer mes écrits</button>';
  return h;
}
function rlVueExemple(){
  const k=RL_EX[state.rl.ex]?state.rl.ex:'g';
  return '<div class="f-tete"><span class="label">Un exemple, inventé pour vous montrer</span><h1 class="t1">Une fiche terminée</h1><p class="sub">Voici ce que reçoit la personne qui prend le relais. Elle l’ouvre sur son téléphone, sans compte et sans rien acheter.</p></div>'+
    '<div class="chips rl-ages" role="group" aria-label="Choisir un exemple">'+[['e','Un enfant'],['a','Une adolescente'],['g','Un adulte']].map(x=>'<button type="button" class="chip" data-act="rl" data-k="ex" data-v="'+x[0]+'" aria-pressed="'+(k===x[0])+'">'+x[1]+'</button>').join('')+'</div>'+
    rlFicheHtml(RL_EX[k],{cls:'rl-ex',pose:rlSePose()})+
    '<p class="hint">Ces 3 fiches sont des exemples. L’outil sert quel que soit l’âge de votre enfant, tout-petit ou adulte depuis longtemps. Les prénoms et les numéros sont inventés.</p>'+
    '<div class="ap-suite"><button type="button" class="btn primary wide" data-act="rl" data-k="nouveau">'+I.pen+(rel().fiches.length?'Préparer un relais':'Préparer mon premier relais')+'</button><p class="hint">Vous choisissez chaque phrase, et rien ne part sans vous.</p>'+(SITE?'<button type="button" class="lien-f" data-act="rl" data-k="imprimer">Imprimer cet exemple</button>':'')+'</div>';
}
function rlChamp(id,ch,lab,val,ph,lim,aide){return '<div class="field"><label for="'+id+'">'+lab+'</label><input type="text" id="'+id+'" data-rl="'+ch+'" maxlength="'+lim+'" value="'+esc(val||'')+'" placeholder="'+esc(ph)+'" autocomplete="off">'+(aide?'<p class="hint">'+aide+'</p>':'')+'</div>';}
function rlVuePrep(){
  const f=rlFiche(state.rl.id);if(!f)return rlVueAccueil();
  const p=Math.max(0,Math.min(4,state.rl.p||0));const P=f.qui||'votre enfant';
  let c='<div class="f-tete"><span class="label">'+(rel().fiches.length>1?'Un nouveau relais':'Mon premier relais')+'</span>';
  /* Dès que la fiche dépasse une page imprimée, la famille le sait, là où elle écrit. */
  const trop=()=>{const m=rlMesure(f);return m.ok?'':'<p class="rl-page rl-trop">'+I.info+'<span>Imprimée, votre fiche dépasse maintenant une page. Votre proche la lira plus facilement si vous retirez une phrase ou deux.</span></p>';};
  const suite=(txt)=>(p>0?trop():'')+'<div class="ap-suite"><button type="button" class="btn primary wide" data-act="rl" data-k="pas" data-v="1">'+txt+' '+I.chev+'</button>'+(p>0?'<button type="button" class="btn ghost wide" data-act="rl" data-k="pas" data-v="-1">Revenir</button>':'')+'</div>';
  if(p===0){
    c+='<h1 class="t1">Pour qui, et chez qui ?</h1><p class="sub">Ces mots servent seulement à écrire la fiche. Ils restent sur votre appareil.</p></div>'+rlFil(RL_PAS,p,'Les 5 moments de la préparation')+
      (f.garde?'<section class="rl-carte rl-garde"><h2>La dernière fois, vous vouliez garder ceci</h2><p class="rl-cite">'+nl2(f.garde)+'</p><button type="button" class="btn" data-act="rl" data-k="garde">'+I.plus+'L’ajouter à « Ce qui aide »</button></section>':'')+
      rlChamp('rl-qui','qui','Comment l’appelez-vous dans cette fiche ?',f.qui,'Son prénom, ou « notre fils », « ma fille »',RL_LIM.nom,'')+
      rlChamp('rl-chez','chez','Qui prend le relais ?',f.chez,'Par exemple, son oncle Rémi',RL_LIM.chez,'')+
      rlChamp('rl-quand','quand','Quand ?',f.quand,'Par exemple, du samedi 21 au dimanche 22 novembre',RL_LIM.quand,'Vous pouvez laisser cette ligne vide.')+
      '<div class="rl-tu"><span class="label" id="rl-tu-l">Dans la fiche, vous dites</span><div class="seg" role="group" aria-labelledby="rl-tu-l"><button type="button" data-act="rl" data-k="tu" data-v="1" aria-pressed="'+(f.tu!==false)+'">Tu</button><button type="button" data-act="rl" data-k="tu" data-v="0" aria-pressed="'+(f.tu===false)+'">Vous</button></div></div>'+
      suite('Continuer');
  }else if(p===1){
    c+='<h1 class="t1">Ce qui aide '+esc(P)+' au quotidien</h1><p class="sub">Choisissez une phrase, puis adaptez-la. 2 ou 3 phrases par rubrique suffisent, et une rubrique peut rester vide.</p></div>'+rlFil(RL_PAS,p,'Les 5 moments de la préparation')+
      RL_SEC.map(S=>{const k=S[0],L=rlLignes(f,k),ouv=state.rl.sec===k;
        return '<section class="rl-rub" aria-labelledby="rl-r-'+k+'"><h2 id="rl-r-'+k+'">'+esc(f.qui?S[2].replace('{P}',f.qui):S[1])+'</h2>'+
          L.map((x,i)=>'<div class="rl-ligne"><textarea rows="2" maxlength="'+RL_LIM.l+'" data-rl="s.'+k+'.'+i+'" aria-label="Phrase '+(i+1)+', '+esc(S[1])+'">'+esc(x)+'</textarea><button type="button" class="rl-ote" data-act="rl" data-k="ote" data-s="'+k+'" data-i="'+i+'" aria-label="Retirer cette phrase">'+I.trash+'</button></div>').join('')+
          (L.length>=RL_LIM.lignes?'<p class="hint">'+RL_LIM.lignes+' phrases, c’est déjà beaucoup pour une page.</p>':
            ouv?'<div class="rl-modeles" role="group" aria-label="Phrases à adapter">'+S[3].map((m,i)=>'<button type="button" class="rl-m" data-act="rl" data-k="modele" data-s="'+k+'" data-i="'+i+'">'+esc(rlModele(m,f))+'</button>').join('')+'<button type="button" class="rl-m rl-libre" data-act="rl" data-k="vierge" data-s="'+k+'">'+I.pen+'Écrire ma propre phrase</button></div>':
            '<button type="button" class="lien-f" data-act="rl" data-k="idees" data-s="'+k+'">'+I.plus+'Ajouter une phrase</button>')+'</section>';}).join('')+
      suite('Choisir les 3 repères');
  }else if(p===2){
    const T=[0,1,2].map(i=>(f.trois||[])[i]||'');const dispo=rlToutes(f).filter(x=>T.indexOf(x)<0);
    c+='<h1 class="t1">'+(f.tu===false?'Si vous ne lisez que trois choses':'Si tu ne lis que trois choses')+'</h1><p class="sub">Ces 3 repères ouvrent la fiche. Si la personne ne lisait que cela, que devrait-elle savoir ?</p></div>'+rlFil(RL_PAS,p,'Les 5 moments de la préparation')+
      '<ol class="rl-3">'+T.map((x,i)=>'<li><textarea rows="3" maxlength="'+RL_LIM.l+'" data-rl="trois.'+i+'" aria-label="Repère '+(i+1)+'" placeholder="'+['Le plus important pour que tout se passe bien','Ce qui évite une difficulté','Ce qui compte pour '+esc(P)][i]+'">'+esc(x)+'</textarea></li>').join('')+'</ol>'+
      (dispo.length?'<div class="rl-modeles" role="group" aria-label="Reprendre une phrase déjà écrite"><span class="label">Reprendre une de vos phrases</span>'+dispo.slice(0,12).map(x=>'<button type="button" class="rl-m" data-act="rl" data-k="pique" data-t="'+esc(x)+'">'+esc(x)+'</button>').join('')+'</div>':'')+
      suite('Continuer');
  }else if(p===3){
    const M=f.moi||[];
    c+='<h1 class="t1">Ce que je souhaite dire moi-même</h1><p class="sub">Cette partie appartient à '+esc(P)+'. Vous pouvez l’écrire ensemble, avec ses mots, ses gestes ou ses images, à tout âge. Elle a sa place à part dans la fiche.</p></div>'+rlFil(RL_PAS,p,'Les 5 moments de la préparation')+
      M.map((x,i)=>'<div class="rl-ligne"><textarea rows="2" maxlength="'+RL_LIM.l+'" data-rl="moi.'+i+'" aria-label="Phrase '+(i+1)+' de '+esc(P)+'">'+esc(x)+'</textarea><button type="button" class="rl-ote" data-act="rl" data-k="ote-moi" data-i="'+i+'" aria-label="Retirer cette phrase">'+I.trash+'</button></div>').join('')+
      (M.length<RL_LIM.moi?'<div class="rl-modeles" role="group" aria-label="Débuts de phrase"><span class="label">Commencer par</span>'+RL_MOI.map((m,i)=>'<button type="button" class="rl-m" data-act="rl" data-k="moi" data-i="'+i+'">'+esc(m.replace(/,$/,''))+'…</button>').join('')+'</div>':'')+
      '<p class="hint">Si '+esc(P)+' préfère ne rien dire cette fois, la fiche s’en passe très bien.</p>'+
      suite(M.filter(Boolean).length?'Continuer':'Passer cette partie');
  }else{
    const T=(f.tel&&f.tel.length?f.tel:[{n:'',t:''}]).slice(0,3);
    c+='<h1 class="t1">Me joindre</h1><p class="sub">Ces numéros apparaissent au bas de la fiche. Vous pouvez laisser cette partie vide.</p></div>'+rlFil(RL_PAS,p,'Les 5 moments de la préparation')+
      T.map((x,i)=>'<div class="rl-contact">'+rlChamp('rl-tn'+i,'tel.'+i+'.n',i?'Une autre personne':'Votre nom dans la fiche',x.n,i?'Par exemple, Papa':'Par exemple, Maman',RL_LIM.tel,'')+rlChamp('rl-tt'+i,'tel.'+i+'.t','Son numéro',x.t,'079 000 00 00',RL_LIM.tel,'')+'</div>').join('')+
      (T.length<3?'<button type="button" class="lien-f" data-act="rl" data-k="tel-plus">'+I.plus+'Ajouter une personne</button>':'')+
      '<div class="ap-suite"><button type="button" class="btn primary wide" data-act="rl" data-k="apercu">'+I.eye+'Voir ma fiche</button><button type="button" class="btn ghost wide" data-act="rl" data-k="pas" data-v="-1">Revenir</button></div>';
  }
  return c;
}
function rlVueApercu(){
  const f=rlFiche(state.rl.id);if(!f)return rlVueAccueil();const a=rlOuvert();const n3=(f.trois||[]).filter(x=>clean(x,9)).length;
  const M={d:0,ok:true};const fiche=rlFicheHtml(f,{mesure:M,pose:rlSePose()});
  return '<div class="f-tete"><span class="label">Avant d’envoyer</span><h1 class="t1">Voici exactement ce que vous transmettez</h1><p class="sub">Rien d’autre ne part. Vos autres écrits restent sur votre appareil.</p></div>'+
    (n3<3?'<p class="rl-alerte">'+I.info+'<span>'+(n3?'Il vous reste '+(3-n3)+' repère'+(3-n3>1?'s':'')+' à choisir.':'Vos 3 repères ne sont pas encore choisis.')+'</span><button type="button" class="lien-f" data-act="rl" data-k="aller" data-v="2">Les choisir</button></p>':'')+
    fiche+
    (M.ok?'<p class="rl-page">'+I.check+'<span>Votre fiche tient sur une page, sur un téléphone comme sur une feuille.</span></p>':'<p class="rl-page rl-trop">'+I.info+'<span>Imprimée, votre fiche dépasse une page. Votre proche la lira plus facilement si vous retirez une phrase ou deux.</span></p>')+
    '<div class="ap-suite">'+(a?'<button type="button" class="btn primary wide" data-act="rl" data-k="envoi">'+I.send+'Envoyer la fiche</button><button type="button" class="btn wide" data-act="rl" data-k="imprimer">Imprimer la fiche</button>':'')+
    '<button type="button" class="btn'+(a?'':' primary')+' wide" data-act="rl" data-k="aller" data-v="0">'+I.pen+'Modifier la fiche</button>'+(f.env&&a?'<button type="button" class="btn wide" data-act="rl" data-k="retour" data-id="'+f.id+'">Noter le retour</button>':'')+'</div>'+
    (a?'':rlOffre('apercu'));
}
function rlMessage(f){return 'Voici la fiche pour le relais. Elle se lit en 1 minute.';}
function rlVueEnvoi(){
  const f=rlFiche(state.rl.id);if(!f||!rlOuvert())return rlVueApercu();const url=rlLien(f);
  return '<div class="f-tete"><span class="label">Envoyer</span><h1 class="t1">'+esc(f.chez?'Envoyer la fiche à '+f.chez:'Envoyer la fiche')+'</h1></div>'+
    '<ul class="list rl-sait"><li>La fiche est écrite dans le lien lui-même. Aucun serveur ne la reçoit, et le site ne la lit pas.</li><li>La personne l’ouvre sur son téléphone, sans compte et sans rien acheter.</li><li>Toute personne à qui ce lien est transmis peut lire la fiche. Envoyez-le comme vous enverriez une photo de famille.</li></ul>'+
    '<div class="ap-suite"><button type="button" class="btn primary wide" data-act="rl" data-k="partage">'+I.share+'Envoyer le lien</button><button type="button" class="btn wide" data-act="rl" data-k="texte">'+I.mail+'Envoyer le texte, sans lien</button><button type="button" class="btn wide" data-act="rl" data-k="imprimer">Imprimer la fiche</button></div>'+
    '<div class="field"><label for="rl-lien">Le lien de la fiche, à copier</label><input type="text" id="rl-lien" readonly value="'+esc(url)+'"><p class="hint">Dans WhatsApp ou dans un message, l’aperçu du lien ne montre rien de votre fiche.</p></div>'+
    '<p class="lecture-l">Quand le relais est passé, revenez ici. Une seule question vous attend, et le prochain relais sera prêt plus vite.</p>'+
    '<div class="rl-recap"><span class="label">Ce qui est envoyé</span>'+rlFicheHtml(f)+'</div>';
}
function rlVueRetour(){
  const f=rlFiche(state.rl.id);if(!f)return rlVueAccueil();
  return '<div class="f-tete"><span class="label">Au retour</span><h1 class="t1">Qu’est-ce qui a bien marché et que vous aimeriez garder pour la prochaine fois ?</h1><p class="sub">C’est la seule question. Quelques mots suffisent, les vôtres ou ceux de la personne qui a pris le relais.</p></div>'+
    '<div class="field"><label for="rl-retour" class="sr">Votre réponse</label><textarea id="rl-retour" data-rl="retour" rows="5" maxlength="'+RL_LIM.retour+'" placeholder="Par exemple, le programme dit le matin a bien aidé.">'+esc(f.retour||'')+'</textarea></div>'+
    '<div class="ap-suite"><button type="button" class="btn primary wide" data-act="rl" data-k="retour-ok">'+I.check+'Garder pour la prochaine fois</button><button type="button" class="btn ghost wide" data-act="rl" data-k="accueil">Plus tard</button></div>'+
    '<p class="hint">Votre réponse reste sur votre appareil. Au prochain relais, elle vous sera proposée en un geste.</p>';
}
/* ---------- préparer une réunion ---------- */
function rlReuTitre(x){const a=(RL_AVEC.find(y=>y[0]===x.avec)||RL_AVEC[3])[1];return 'Réunion avec '+a.charAt(0).toLowerCase()+a.slice(1);}
/* Ce que le parent a déjà écrit et qui peut servir : les phrases de ses fiches, ses retours, et son journal « avant, pendant, après ». */
/* Un texte du parent, phrase par phrase, sans rien changer aux mots. Une phrase finit sur un point, un point d'interrogation ou d'exclamation
   suivi d'une majuscule, d'un chiffre ou d'un guillemet ouvrant, ou bien à la ligne : « non ! » au milieu d'une phrase ne la coupe pas. */
function rlPhrases(t){
  const s=String(t==null?'':t),out=[];let cur='';
  for(let i=0;i<s.length;i++){const c=s[i];
    if(c==='\n'){out.push(cur);cur='';continue;}
    cur+=c;
    if(/[.!?…]/.test(c)){let j=i+1;while(j<s.length&&/[.!?…]/.test(s[j])){cur+=s[j];j++;}i=j-1;
      const reste=s.slice(j);if(!reste||/^\s+[A-ZÀ-ÖØ-Þ0-9«“"]/.test(reste)||/^[ \t]*\n/.test(reste)){out.push(cur);cur='';}}
  }
  out.push(cur);return out.map(x=>x.trim()).filter(Boolean);
}
function rlObsDispo(){
  const out=[],vu={};const add=(t,d)=>{t=clean(t,RL_LIM.l);if(t&&!vu[t]){vu[t]=1;out.push({t:t,d:d});}};
  /* Les mots que le parent a déposés servent aussi, s'il le veut : ses 2 derniers dépôts, phrase par phrase, en tête de liste.
     Aucune phrase n'est coupée ni réécrite : une phrase plus longue qu'une observation n'est pas proposée. */
  (D().depots||[]).filter(x=>!x.risk&&typeof x.text==='string').slice(-2).reverse().forEach(x=>{rlPhrases(x.text).filter(s=>s.length>=12&&s.length<=RL_LIM.l).slice(0,4).forEach(s=>add(s,'Vos mots du '+fmtDate(x.date)));});
  rel().fiches.slice().reverse().forEach(f=>{if(f.retour)add(f.retour,'Votre retour du '+fmtDate(f.retourLe||f.m||todayIso()));(f.trois||[]).forEach(x=>add(x,'Vos 3 repères'));rlToutes(f).forEach(x=>add(x,'Votre fiche de relais'));});
  (D().abc||[]).slice(-5).reverse().forEach(x=>add([x.a?'Avant, '+x.a:'',x.b?'Pendant, '+x.b:'',x.c?'Après, '+x.c:''].filter(Boolean).join('. '),'Votre journal du '+fmtDate(x.date)));
  return out.slice(0,18);
}
function rlVueReunion(){
  const x=rlReu(state.rl.r);if(!x)return rlVueAccueil();const p=Math.max(0,Math.min(3,state.rl.p||0));
  const der=rel().fiches[rel().fiches.length-1];const P=(der&&der.qui)||'votre enfant';
  let c='<div class="f-tete"><span class="label">Préparer une réunion</span>';
  const suite=(txt,k)=>'<div class="ap-suite"><button type="button" class="btn primary wide" data-act="rl" data-k="'+(k||'rpas')+'" data-v="1">'+txt+' '+I.chev+'</button>'+(p>0?'<button type="button" class="btn ghost wide" data-act="rl" data-k="rpas" data-v="-1">Revenir</button>':'')+'</div>';
  if(p===0){
    c+='<h1 class="t1">Avec qui avez-vous rendez-vous ?</h1><p class="sub">En 4 temps, vous arrivez avec vos observations, votre demande et vos 3 priorités sous les yeux.</p></div>'+rlFil(RL_RPAS,p,'Les 4 temps de la préparation')+
      '<div class="chips" role="group" aria-label="Avec qui">'+RL_AVEC.map(a=>'<button type="button" class="chip" data-act="rl" data-k="avec" data-v="'+a[0]+'" aria-pressed="'+(x.avec===a[0])+'">'+a[1]+'</button>').join('')+'</div>'+
      rlChamp('rl-rq','reu.quand','Quand ?',x.quand,'Par exemple, jeudi 3 décembre à 16 heures',RL_LIM.quand,'Vous pouvez laisser cette ligne vide.')+suite('Continuer');
  }else if(p===1){
    const D0=rlObsDispo();const S=x.obs||[];
    c+='<h1 class="t1">Ce que vous avez observé</h1><p class="sub">Ce que vous avez déjà écrit peut servir. Touchez les phrases à emporter, '+RL_LIM.obs+' au plus.</p></div>'+rlFil(RL_RPAS,p,'Les 4 temps de la préparation')+
      (D0.length?'<div class="rl-obs" role="group" aria-label="Vos phrases déjà écrites">'+D0.map(o=>'<button type="button" class="rl-m" data-act="rl" data-k="obs" data-t="'+esc(o.t)+'" aria-pressed="'+(S.indexOf(o.t)>=0)+'"><span>'+esc(o.t)+'</span><small>'+esc(o.d)+'</small></button>').join('')+'</div>':'<p class="lecture-l">Vous n’avez encore rien écrit dans vos fiches ni dans votre journal. Vous pouvez noter une observation ci-dessous.</p>')+
      '<div class="field"><label for="rl-ro">Une autre observation</label><textarea id="rl-ro" data-rl="reu.plus" rows="3" maxlength="'+RL_LIM.l+'" placeholder="Un fait précis, avec le jour si vous l’avez.">'+esc(x.plus||'')+'</textarea></div>'+suite('Continuer');
  }else if(p===2){
    c+='<h1 class="t1">Ce que vous demandez</h1><p class="sub">Une demande claire aide tout le monde. Une ou deux phrases suffisent.</p></div>'+rlFil(RL_RPAS,p,'Les 4 temps de la préparation')+
      '<div class="field"><label for="rl-rd">Ma demande</label><textarea id="rl-rd" data-rl="reu.dem" rows="4" maxlength="'+RL_LIM.dem+'">'+esc(x.dem||'')+'</textarea></div>'+
      (state.rl.mots?'<div class="rl-modeles" role="group" aria-label="Débuts de phrase"><span class="label">Commencer par</span>'+RL_MOTS_ECRIRE.map((m,i)=>'<button type="button" class="rl-m" data-act="rl" data-k="mot" data-i="'+i+'">'+esc(m.replace('{P}',P))+'…</button>').join('')+'</div>':'<button type="button" class="btn rl-perds" data-act="rl" data-k="mots">'+I.bulb+'Je perds mes mots</button>')+suite('Continuer');
  }else{
    const Pr=[0,1,2].map(i=>(x.pri||[])[i]||'');
    c+='<h1 class="t1">Vos 3 priorités</h1><p class="sub">Si la réunion part dans tous les sens, ce sont elles que vous gardez sous les yeux.</p></div>'+rlFil(RL_RPAS,p,'Les 4 temps de la préparation')+
      '<ol class="rl-3">'+Pr.map((v,i)=>'<li><textarea rows="2" maxlength="'+RL_LIM.pri+'" data-rl="reu.pri.'+i+'" aria-label="Priorité '+(i+1)+'" placeholder="'+['Ce qui doit absolument être dit','Ce que vous voulez obtenir','Ce qui peut attendre la prochaine fois'][i]+'">'+esc(v)+'</textarea></li>').join('')+'</ol>'+suite('Voir ma feuille','feuille-ok');
  }
  return c;
}
function rlVueFeuille(){
  const x=rlReu(state.rl.r);if(!x)return rlVueAccueil();const Pr=(x.pri||[]).map(v=>clean(v,RL_LIM.pri)).filter(Boolean);const O=(x.obs||[]).concat(x.plus?[x.plus]:[]).map(v=>clean(v,RL_LIM.l)).filter(Boolean);
  return '<div class="f-tete"><span class="label">'+esc(rlReuTitre(x))+(x.quand?', '+esc(x.quand):'')+'</span><h1 class="t1">Ma feuille pour la réunion</h1></div>'+
    '<article class="rl-fiche rl-reu"><section class="rl-trois"><h2 class="rl-h">Mes 3 priorités</h2>'+(Pr.length?'<ol>'+Pr.map(v=>'<li>'+esc(v)+'</li>').join('')+'</ol>':'<p class="rl-vide">Vos priorités viendront ici.</p>')+'</section>'+
    (x.dem?'<section class="rl-moi"><h2 class="rl-h">Ma demande</h2><p>'+nl2(clean(x.dem,RL_LIM.dem))+'</p></section>':'')+
    (O.length?'<section class="rl-s"><h2 class="rl-h">Ce que j’ai observé</h2><ul>'+O.map(v=>'<li>'+esc(v)+'</li>').join('')+'</ul></section>':'')+'</article>'+
    (state.rl.mots?'<section class="rl-carte rl-dire" aria-labelledby="rl-dire-t"><h2 id="rl-dire-t">Des phrases à dire, telles quelles</h2><ul class="list">'+RL_MOTS_DIRE.map(m=>'<li>'+esc(m)+'</li>').join('')+'</ul><button type="button" class="lien-f" data-act="rl" data-k="mots">Refermer</button></section>':'<button type="button" class="btn primary wide rl-perds" data-act="rl" data-k="mots">'+I.bulb+'Je perds mes mots</button>')+
    '<div class="ap-suite"><button type="button" class="btn wide" data-act="rl" data-k="imprimer">Imprimer ma feuille</button><button type="button" class="btn wide" data-act="rl" data-k="reu-modif">'+I.pen+'Modifier</button><button type="button" class="btn ghost wide" data-act="rl" data-k="accueil">Revenir à mes relais</button></div>'+
    '<p class="hint">Cette feuille reste sur votre appareil. Vous pouvez la garder ouverte pendant la réunion.</p>';
}
/* ---------- sauvegarder et restaurer ---------- */
function rlVueSauver(){
  const r=state.rl;
  return '<div class="f-tete"><span class="label">Vos écrits vous appartiennent</span><h1 class="t1">Sauvegarder ou restaurer mes écrits</h1><p class="sub">Vos fiches, votre carnet et vos dépôts vivent sur cet appareil. Une sauvegarde vous permet de les garder, ou de les emporter sur un autre appareil.</p></div>'+
    '<section class="rl-carte"><h2>Sauvegarder</h2><p>Vous recevez un fichier à garder où vous voulez. Il contient tout ce que vous avez écrit ici, et lui seul.</p><button type="button" class="btn primary" data-act="rl" data-k="sauve">'+I.download+'Sauvegarder dans un fichier</button></section>'+
    '<section class="rl-carte"><h2>Restaurer</h2><p>Vous choisissez un fichier de sauvegarde. Son contenu remplace alors ce qui se trouve sur cet appareil.</p>'+
      (r.attente?'<div class="confirm" role="alert"><span>Remplacer ce que contient cet appareil par la sauvegarde du '+esc(fmtDate(r.attente.le))+' ?</span><div class="row"><button type="button" class="btn danger" data-act="rl" data-k="restaure-oui">Oui, remplacer</button><button type="button" class="btn" data-act="rl" data-k="restaure-non">Annuler</button></div></div>':
      '<label class="btn rl-fichier" for="rl-f">'+I.note+'Choisir un fichier de sauvegarde</label><input type="file" id="rl-f" class="sr" data-rlf="1" accept="application/json,.json">')+'</section>'+
    '<p class="hint">Rien n’est envoyé pendant ces 2 opérations. Le fichier passe de votre appareil à votre appareil.</p>';
}
function rlVueLu(){
  const f=state.rl.lu;
  if(!f)return '<div class="f-tete"><span class="label">Une fiche de relais</span><h1 class="t1">Cette fiche ne s’ouvre pas</h1><p class="sub">Le lien semble incomplet. Demandez à la personne qui vous l’a envoyé de vous le renvoyer en entier.</p></div><div class="ap-suite"><button type="button" class="btn wide" data-act="rl" data-k="exemple">'+I.eye+'Voir un exemple de fiche</button></div>';
  return '<p class="label rl-recu-l">Une fiche de relais, écrite par une famille</p>'+rlFicheHtml(f,{cls:'rl-recu',h1:true})+
    '<div class="ap-suite"><button type="button" class="btn wide" data-act="rl" data-k="imprimer">Imprimer la fiche</button></div>'+
    '<p class="hint">Cette fiche est contenue dans le lien que vous avez reçu. Le site ne l’a ni lue ni enregistrée. Gardez ce lien pour la retrouver.</p>'+
    '<section class="rl-carte"><h2>D’où vient cette fiche ?</h2><p>Elle a été préparée avec « Passer le relais », un outil de Parent écouté, parent éclairé, un espace pour les parents d’une personne en situation de handicap.</p><button type="button" class="lien-f" data-act="rl" data-k="exemple">'+I.eye+'Voir comment une famille prépare sa fiche</button></section>';
}
function viewRelais(){
  const e=state.rl.e||'accueil';
  /* L'aperçu ou l'exemple vient de s'ouvrir (et l'écran n'est pas seulement redessiné) : la feuille se posera. */
  {const R=state.rl,cle=e+'/'+(R.id||'');if(!/relais$/.test(state.lastKey||'')||R.vu!==cle)R.poseT=(e==='apercu'||e==='exemple')?performance.now():0;R.vu=cle;}
  const c=e==='lu'?rlVueLu():e==='exemple'?rlVueExemple():e==='prep'?rlVuePrep():e==='apercu'?rlVueApercu():e==='envoi'?rlVueEnvoi():e==='retour'?rlVueRetour():e==='reunion'?rlVueReunion():e==='feuille'?rlVueFeuille():e==='sauver'?rlVueSauver():rlVueAccueil();
  return '<main id="main" tabindex="-1" class="view v-feuille v-relais rl-e-'+e+'"><div class="feuille">'+c+'</div></main>';
}
/* La porte de l'outil, posée dans la boîte à outils et sur « Aujourd'hui » quand un retour est attendu. */
function rlPorteHtml(){
  const F=rel().fiches;const attente=rlOuvert()?F.slice().reverse().find(f=>f.env&&!f.retour):null;
  return '<button type="button" class="sit rl-porte" data-act="rl" data-k="ouvre"><span class="e">'+I.hand+'</span><span class="tx"><b>Passer le relais</b><span>'+(attente?'Le relais est passé ? Une seule question vous attend.':F.length?'Vos fiches, et le prochain relais en quelques gestes':'Une page pour la personne qui garde votre enfant')+'</span></span><span class="chev">'+I.chev+'</span></button>';
}
/* Sur la vitrine : les 3 repères d'une fiche d'exemple, pour montrer le résultat avant tout. */
/* Plus bas dans la vitrine, l'exemple est celui de Noé (5 ans) : la fiche de Bastien (35 ans) est déjà posée sur la table, tout en haut. */
function rlVitrineHtml(){
  const f=RL_EX.e;
  return '<div class="rl-mini" aria-label="Le début d’une fiche d’exemple"><span class="label">'+esc(rlTitre(f))+', '+esc(f.quand)+'</span><b>Si tu ne lis que trois choses</b><ol>'+f.trois.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol></div>'+
    '<div class="acc-relais-b"><button type="button" class="btn" data-act="rl" data-k="exemple" data-v="e">'+I.eye+'Voir un exemple de fiche terminée</button><span class="prix">49 CHF, une seule fois</span></div>';
}

/* ---------- les gestes ---------- */
let rlT=null;
function rlPose(f,ch,v){
  const p=ch.split('.');
  if(p[0]==='s'){const L=rlLignes(f,p[1]);L[Number(p[2])]=v;}
  else if(p[0]==='trois'){if(!Array.isArray(f.trois))f.trois=['','',''];f.trois[Number(p[1])]=v;}
  else if(p[0]==='moi'){if(!Array.isArray(f.moi))f.moi=[];f.moi[Number(p[1])]=v;}
  else if(p[0]==='tel'){if(!Array.isArray(f.tel))f.tel=[];const i=Number(p[1]);if(!f.tel[i])f.tel[i]={n:'',t:''};f.tel[i][p[2]==='t'?'t':'n']=v;}
  else if(p[0]==='qui'||p[0]==='chez'||p[0]==='quand'||p[0]==='retour')f[p[0]]=v;
}
/* Chaque champ de l'outil se garde tout seul pendant qu'on écrit. */
function rlSaisie(el){
  const ch=el.dataset.rl;if(!ch)return;const v=String(el.value);
  if(ch.indexOf('reu.')===0){const x=rlReu(state.rl.r);if(!x)return;const p=ch.split('.');
    if(p[1]==='pri'){if(!Array.isArray(x.pri))x.pri=['','',''];x.pri[Number(p[2])]=v.slice(0,RL_LIM.pri);}
    else if(p[1]==='dem')x.dem=v.slice(0,RL_LIM.dem);else if(p[1]==='plus')x.plus=v.slice(0,RL_LIM.l);else if(p[1]==='quand')x.quand=v.slice(0,RL_LIM.quand);}
  else{const f=rlFiche(state.rl.id);if(!f)return;
    const lim=ch==='qui'?RL_LIM.nom:ch==='chez'?RL_LIM.chez:ch==='quand'?RL_LIM.quand:ch==='retour'?RL_LIM.retour:ch.indexOf('tel')===0?RL_LIM.tel:RL_LIM.l;
    rlPose(f,ch,v.slice(0,lim));if(ch!=='retour')f.m=todayIso();}
  clearTimeout(rlT);rlT=setTimeout(save,400);
}
function rlCapture(){try{document.querySelectorAll('#app [data-rl]').forEach(el=>{if(el.tagName==='TEXTAREA'||el.tagName==='INPUT')rlSaisie(el);});}catch(e){}clearTimeout(rlT);}
function rlRange(f){RL_SEC.forEach(S=>{if(f.s&&Array.isArray(f.s[S[0]]))f.s[S[0]]=f.s[S[0]].filter(x=>clean(x,RL_LIM.l));});if(Array.isArray(f.moi))f.moi=f.moi.filter(x=>clean(x,RL_LIM.l));if(Array.isArray(f.tel)){f.tel=f.tel.filter(x=>x&&(clean(x.n,9)||clean(x.t,9)));if(!f.tel.length)f.tel=[{n:'',t:''}];}}
async function rlPartage(f,texte){
  const url=rlLien(f);const corps=texte?rlTexte(f):rlMessage(f);
  const fait=()=>{f.env=todayIso();save();};
  if(navigator.share){try{await navigator.share(texte?{title:rlTitre(f),text:corps}:{title:rlTitre(f),text:corps,url:url});fait();render();return;}catch(e){if(e&&e.name==='AbortError')return;}}
  try{await navigator.clipboard.writeText(texte?corps:url);fait();render();toast(texte?'Le texte de la fiche est copié. Vous pouvez le coller dans un message.':'Le lien de la fiche est copié. Vous pouvez le coller dans un message.');return;}catch(e){}
  fait();render();const c=document.getElementById('rl-lien');if(c){try{c.focus();c.select();}catch(e){}}
  toast('Le lien est prêt à être copié, juste en dessous.');
}
function rlSauve(){
  const o={app:'parent-ecoute',v:1,le:todayIso(),donnees:JSON.parse(JSON.stringify(D()))};const nom='parent-ecoute-mes-ecrits-'+todayIso()+'.json';const txt=JSON.stringify(o);
  try{const b=new Blob([txt],{type:'application/json'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=nom;a.rel='noopener';a.style.display='none';document.body.appendChild(a);a.click();setTimeout(()=>{try{URL.revokeObjectURL(u);a.remove();}catch(e){}},4000);
    const c=com();c.sv=todayIso();save();toast('Votre sauvegarde est prête. Elle s’appelle '+nom+'.');}catch(e){toast('La sauvegarde n’a pas pu être créée sur cet appareil.');}
}
/* Le fichier choisi est lu sur l'appareil. Rien n'est remplacé avant que le parent ait dit oui. */
function rlFichier(el){
  const file=el.files&&el.files[0];if(!file)return;
  if(file.size>4000000){toast('Ce fichier est trop gros pour être une sauvegarde de cet espace.');el.value='';return;}
  const rd=new FileReader();
  rd.onload=()=>{let o=null;try{o=JSON.parse(String(rd.result));}catch(e){}
    if(!o||o.app!=='parent-ecoute'||!o.donnees||typeof o.donnees!=='object'||Array.isArray(o.donnees)){toast('Ce fichier n’est pas une sauvegarde de cet espace.');el.value='';return;}
    state.rl.attente={le:/^\d{4}-\d\d-\d\d$/.test(o.le)?o.le:todayIso(),donnees:o.donnees};render();};
  rd.onerror=()=>{toast('Ce fichier n’a pas pu être lu.');};
  rd.readAsText(file);
}
function rlAct(d){
  const r=state.rl,R=rel();rlCapture();let f=rlFiche(r.id);
  const versOutil=()=>{if(state.view!=='relais')nav('relais');};
  if(rlOuvert())usage('relais');
  switch(d.k){
    case 'ouvre':r.e='accueil';r.sec='';r.mots=false;versOutil();break;
    case 'accueil':r.e='accueil';r.sec='';r.mots=false;r.attente=null;break;
    case 'exemple':r.e='exemple';if(d.v&&RL_EX[d.v])r.ex=d.v;versOutil();break;
    case 'ex':if(RL_EX[d.v])r.ex=d.v;break;
    case 'nouveau':{if(R.fiches.length){if(rlOuvert())return rlAct({k:'suivant'});r.id=R.fiches[0].id;}else{entrer('relais');const n=rlVide();R.fiches.push(n);r.id=n.id;save();}r.e='prep';r.p=0;r.sec='';versOutil();break;}
    case 'suivant':{if(!rlOuvert()){r.e='accueil';toast('Repartir de votre dernière fiche fait partie de l’outil.');break;}
      const der=R.fiches[R.fiches.length-1];const n=rlVide();if(der){const c=JSON.parse(JSON.stringify(rlPropre(der)));n.qui=c.qui;n.chez=c.chez;n.tu=c.tu;n.trois=[0,1,2].map(i=>c.trois[i]||'');n.moi=c.moi;n.s=c.s;n.tel=c.tel.length?c.tel:[{n:'',t:''}];n.garde=clean(der.retour,RL_LIM.retour);}
      R.fiches.push(n);r.id=n.id;r.e='prep';r.p=0;r.sec='';save();versOutil();break;}
    case 'ouvrir':{const x=rlFiche(d.id);if(!x)break;r.id=x.id;r.e='apercu';versOutil();break;}
    case 'tu':if(f){f.tu=d.v!=='0';save();}break;
    case 'pas':{if(!f)break;const s=Number(d.v)||0;
      if(r.p===0&&s>0&&!clean(f.qui,RL_LIM.nom)){fieldErr('rl-qui','Écrivez son prénom, ou simplement « notre fils » ou « ma fille ».');return false;}
      rlRange(f);r.p=Math.max(0,Math.min(4,(r.p||0)+s));r.sec='';save();break;}
    case 'aller':if(f){rlRange(f);r.e='prep';r.p=Math.max(0,Math.min(4,Number(d.v)||0));r.sec='';save();}break;
    case 'idees':r.sec=d.s;break;
    case 'modele':{if(!f)break;const S=RL_SEC.find(x=>x[0]===d.s);if(!S)break;const L=rlLignes(f,S[0]);if(L.length<RL_LIM.lignes)L.push(rlModele(S[3][Number(d.i)]||'',f));r.sec='';f.m=todayIso();save();break;}
    case 'vierge':{if(!f)break;const L=rlLignes(f,d.s);if(L.length<RL_LIM.lignes)L.push('');r.sec='';r.foc='s.'+d.s+'.'+(L.length-1);break;}
    case 'ote':if(f){rlLignes(f,d.s).splice(Number(d.i),1);f.m=todayIso();save();}break;
    case 'pique':{if(!f)break;if(!Array.isArray(f.trois))f.trois=['','',''];const i=[0,1,2].find(k=>!clean(f.trois[k],9));if(i===undefined){toast('Vos 3 repères sont déjà choisis. Videz-en un pour le remplacer.');return false;}f.trois[i]=clean(d.t,RL_LIM.l);f.m=todayIso();save();break;}
    case 'moi':{if(!f)break;if(!Array.isArray(f.moi))f.moi=[];if(f.moi.length<RL_LIM.moi){f.moi.push(RL_MOI[Number(d.i)]+' ');r.foc='moi.'+(f.moi.length-1);}break;}
    case 'ote-moi':if(f&&Array.isArray(f.moi)){f.moi.splice(Number(d.i),1);save();}break;
    case 'tel-plus':if(f){if(!Array.isArray(f.tel))f.tel=[];if(f.tel.length<3)f.tel.push({n:'',t:''});}break;
    case 'garde':{if(!f||!f.garde)break;const L=rlLignes(f,'aide');const t=clean(f.garde,RL_LIM.l);if(L.length<RL_LIM.lignes&&L.indexOf(t)<0)L.push(t);f.garde='';save();toast('C’est ajouté à « Ce qui aide ».');break;}
    case 'apercu':if(f){rlRange(f);r.e='apercu';save();}break;
    case 'reprise':r.e=f?'apercu':'accueil';versOutil();break;
    case 'envoi':if(!f)break;if(!rlOuvert()){r.e='apercu';break;}if((f.trois||[]).filter(x=>clean(x,9)).length<1){toast('Choisissez au moins un de vos 3 repères avant d’envoyer.');return false;}r.e='envoi';break;
    case 'partage':if(f&&rlOuvert())rlPartage(f,false);return false;
    case 'texte':if(f&&rlOuvert())rlPartage(f,true);return false;
    case 'imprimer':if(r.e!=='exemple'&&r.e!=='lu'&&!rlOuvert()){toast('Imprimer fait partie de l’outil.');return false;}rlAvantImpression();try{window.print();}catch(e){}return false;
    case 'retour':{const x=rlFiche(d.id)||f;if(!x||!rlOuvert())break;r.id=x.id;r.e='retour';versOutil();break;}
    case 'retour-ok':if(f){f.retour=clean(f.retour,RL_LIM.retour);if(!f.retour){fieldErr('rl-retour','Écrivez quelques mots, ou touchez « Plus tard ».');return false;}f.retourLe=todayIso();save();r.e='accueil';toast('C’est gardé. Au prochain relais, vous le retrouverez.');}break;
    case 'reunion':{if(!rlOuvert()){r.e='accueil';toast('Préparer une réunion fait partie de l’outil.');break;}const x={id:rlId(),c:todayIso(),avec:'ecole',quand:'',obs:[],plus:'',dem:'',pri:['','','']};R.reunions.push(x);r.r=x.id;r.e='reunion';r.p=0;r.mots=false;save();versOutil();break;}
    case 'avec':{const x=rlReu(r.r);if(x&&RL_AVEC.some(a=>a[0]===d.v)){x.avec=d.v;save();}break;}
    case 'rpas':r.p=Math.max(0,Math.min(3,(r.p||0)+(Number(d.v)||0)));r.mots=false;save();break;
    case 'obs':{const x=rlReu(r.r);if(!x)break;if(!Array.isArray(x.obs))x.obs=[];const t=clean(d.t,RL_LIM.l);const i=x.obs.indexOf(t);if(i>=0)x.obs.splice(i,1);else if(x.obs.length<RL_LIM.obs)x.obs.push(t);else{toast(RL_LIM.obs+' observations, c’est déjà beaucoup pour une réunion.');return false;}save();break;}
    case 'mots':r.mots=!r.mots;break;
    case 'mot':{const x=rlReu(r.r);if(!x)break;const der=R.fiches[R.fiches.length-1];const m=RL_MOTS_ECRIRE[Number(d.i)]||'';x.dem=clean((x.dem?x.dem+'\n':'')+m.replace('{P}',(der&&der.qui)||'mon enfant')+' ',RL_LIM.dem)+' ';r.mots=false;r.foc='reu.dem';save();break;}
    case 'feuille-ok':r.e='feuille';r.mots=false;save();break;
    case 'feuille':{const x=rlReu(d.id);if(!x)break;r.r=x.id;r.e='feuille';r.mots=false;versOutil();break;}
    case 'reu-modif':r.e='reunion';r.p=0;r.mots=false;break;
    case 'sauver':r.e='sauver';r.attente=null;versOutil();break;
    case 'sauve':rlSauve();return false;
    case 'restaure-non':r.attente=null;break;
    case 'restaure-oui':{if(!r.attente)break;const dn=r.attente.donnees;state.data=migre(Object.assign(JSON.parse(JSON.stringify(DEF)),dn));state.data.onboarded=true;if(!state.data.start)state.data.start=todayIso();save();r.attente=null;r.e='accueil';r.id=null;r.r=null;toast('Vos écrits sont restaurés sur cet appareil.');break;}
    default:return false;
  }
  return true;
}
/* Après un nouveau rendu, le curseur va dans la ligne que l'on vient d'ajouter. */
function rlApres(){const ch=state.rl.foc;if(!ch)return;state.rl.foc='';try{const el=document.querySelector('#app [data-rl="'+ch+'"]');if(el){el.focus();const n=el.value.length;el.setSelectionRange(n,n);}}catch(e){}}
/* Sur « Aujourd'hui », seulement quand un relais envoyé attend son retour. */
function rlRappelHtml(){if(!rlOuvert())return '';const f=rel().fiches.slice().reverse().find(x=>x.env&&!x.retour&&x.env!==todayIso());if(!f)return '';
  return '<div class="card rl-rappel reveal d2"><span class="label">Passer le relais</span><p class="rg-t">'+esc(rlTitre(f))+(f.chez?', pour '+esc(f.chez):'')+'. Le relais est passé ?</p><button type="button" class="btn primary" data-act="rl" data-k="retour" data-id="'+f.id+'">Répondre à une seule question</button></div>';}

/* ---------- boîte à outils ---------- */
function viewKit(){
  /* Un visiteur arrivé par un lien voit la liste publique des situations. Les outils et « Pour moi » sont dans l'espace. */
  const pub=!D().onboarded;
  if(pub)state.kit='sits';
  const seg=pub?'':'<div class="seg" role="group" aria-label="Rubriques de la boîte à outils"><button type="button" data-act="kit" data-v="sits" aria-pressed="'+(state.kit==='sits')+'">Situations</button><button type="button" data-act="kit" data-v="tools" aria-pressed="'+(state.kit==='tools')+'">Outils</button><button type="button" data-act="kit" data-v="me" aria-pressed="'+(state.kit==='me')+'">Pour moi</button></div>';
  let body='';
  if(state.kit==='sits')body=kitSits();else if(state.kit==='tools')body=kitTools();else body=kitMe();
  /* Arrivé par la porte « Trouver une idée pour ce soir », le parent voit d'abord ce que la porte annonce : 4 situations à ouvrir en un geste,
     choisies selon le moment de la journée et selon l'âge. Sans âge choisi, il y en a une pour un enfant, une pour un ado, une pour un adulte
     et une pour le parent lui-même. La boîte à outils entière suit, juste en dessous. */
  const mo=moment();const piste=!pub&&state.piste&&state.kit==='sits';
  const pisteBloc=piste?'<section class="grp ce-soir" aria-label="'+esc(PISTE_T[mo])+'"><div class="liste">'+pistesDuMoment(mo,state.age==='all'?'':state.age,D().age).map(id=>sitRow(SITS.find(y=>y.id===id))).join('')+'</div></section>'+
    '<div class="autres-ages"><span class="label" id="ages-l">D’autres idées, selon l’âge</span>'+agesChips()+'</div><h2 class="t2 suite">Toute la boîte à outils</h2>':'';
  return '<main id="main" tabindex="-1" class="view k-'+state.kit+(piste?' k-piste':'')+'" style="padding-top:0"><div class="band thin bleed" style="background-image:url('+HERO+');background-position:left 55%"><h1 class="t1">'+(pub?SITS.length+' situations de la vraie vie':piste?PISTE_T[mo]:'La boîte à outils')+'</h1></div><p class="sub">'+(piste?'Touchez ce qui ressemble à ce que vous vivez.':pub?'Chaque fiche dit ce qui se passe, ce que vous pouvez essayer et ce qu’il vaut mieux éviter, avec toujours un mot pour vous. Elle se lit en 2 minutes et s’envoie telle quelle.':state.kit==='sits'?'Vous trouverez ici '+SITS.length+' situations de la vraie vie, avec des pistes venues du terrain et toujours un mot pour vous.':state.kit==='tools'?'Ce sont les outils que les éducateurs utilisent tous les jours, et vous pouvez les poser sur la table de la cuisine.':'Deux minutes rien que pour vous, parce que vous êtes aussi une personne et pas seulement un parent.')+'</p>'+pisteBloc+seg+body+'</main>';
}
/* Les situations sont rangées par thèmes : chaque thème a son titre, son compte et sa liste. Une recherche donne une seule liste. */
const GROUPES=[['comp','Le comportement'],['comm','La communication'],['quot','Le quotidien'],['ecole','L’école, les professionnels, l’avenir'],['fam','La famille'],['moi','Vous, parent']];
/* Sur le site, chaque ligne est un vrai lien vers la fiche : on peut l'ouvrir dans un autre onglet, et les moteurs de recherche la suivent. */
/* Une situation illustrée par 2 personnages (les frères et sœurs) : ils se serrent pour tenir dans la même case. */
const deuxImages=e=>(String(e).match(/\p{Extended_Pictographic}/gu)||[]).length>1;
function sitRow(s){const dedans='<span class="e'+(deuxImages(s.e)?' duo':'')+'">'+s.e+'</span><span class="tx"><b>'+esc(s.t)+'</b><span>'+esc(s.s)+'</span></span><span class="chev">'+I.chev+'</span>';
  return SITE?'<a class="sit" href="'+ficheUrl(s.id)+'" data-act="sit" data-id="'+s.id+'">'+dedans+'</a>':'<button type="button" class="sit" data-act="sit" data-id="'+s.id+'">'+dedans+'</button>';}
/* Le choix de l'âge : il range les situations, et dans « Trouver une idée » il choisit celles qu'on propose d'abord. */
function agesChips(){return '<div class="chips scroll ages" role="group" aria-label="Âge">'+Object.keys(AGES).map(k=>'<button type="button" class="chip" data-act="age" data-v="'+k+'" aria-pressed="'+(state.age===k)+'">'+AGES[k]+'</button>').join('')+'</div>';}
/* Sur grand écran, les thèmes sont rangés en colonnes de hauteurs voisines, pour ne laisser aucun trou entre 2 thèmes.
   Une grille alignerait les thèmes par rangées : un thème de 2 lignes à côté d'un thème de 6 laisserait un vide sous lui.
   On essaie toutes les répartitions (6 thèmes, 3 colonnes : 729 au plus) et on garde celle dont la plus haute colonne est la plus basse,
   puis la plus régulière. Dans une colonne, les thèmes gardent leur ordre, et les colonnes se suivent dans l'ordre de leur premier thème. */
function colonnesSits(){return large()?((MQ_TROIS&&MQ_TROIS.matches)?3:2):1;}
function rangeEnColonnes(blocs,nc){
  const n=blocs.length;if(n<=nc)return blocs.map(b=>[b]);
  const poids=blocs.map(b=>b.n+0.6);let mieux=null,note=null;
  const total=Math.pow(nc,n);
  for(let k=0;k<total;k++){
    const h=new Array(nc).fill(0);let x=k,vide=nc;const ou=[];
    for(let i=0;i<n;i++){const c=x%nc;x=(x-c)/nc;if(!h[c])vide--;h[c]+=poids[i];ou.push(c);}
    if(vide)continue;
    const haut=Math.max.apply(null,h),bas=Math.min.apply(null,h);
    /* à hauteur égale, on préfère la répartition la plus régulière, puis celle qui laisse les premiers thèmes en tête de colonne */
    const tetes=ou.map((c,i)=>ou.indexOf(c)===i?i:-1).filter(i=>i>=0).reduce((s,i)=>s+i,0);
    const s=[haut,haut-bas,tetes];
    if(!note||s[0]<note[0]-1e-9||(Math.abs(s[0]-note[0])<1e-9&&(s[1]<note[1]-1e-9||(Math.abs(s[1]-note[1])<1e-9&&s[2]<note[2])))){note=s;mieux=ou;}
  }
  const cols=[];for(let c=0;c<nc;c++)cols.push(blocs.filter((b,i)=>mieux[i]===c));
  return cols.filter(c=>c.length).sort((p,q)=>blocs.indexOf(p[0])-blocs.indexOf(q[0]));
}
function kitSits(){
  let list=SITS.filter(s=>state.age==='all'||s.ages.includes(state.age));
  const q=state.q.trim().toLowerCase();if(q)list=list.filter(s=>(s.t+' '+s.s+' '+s.comp).toLowerCase().includes(q));
  const nc=colonnesSits();
  /* Les situations qui reviennent le plus à cette heure-ci, pour ne pas avoir à chercher. Si le parent a dit l'âge de son enfant,
     celles de cet âge passent devant. La liste complète reste entière : rien n'est caché d'après une réponse. */
  const mo=moment();const PT={matin:'Souvent, le matin',jour:'Souvent, dans la journée',soir:'Souvent, le soir',nuit:'Souvent, la nuit'};
  const souvent=(D().onboarded&&!q&&!state.piste)?'<div class="souvent"><span class="label" id="souvent-l">'+PT[mo]+'</span><div class="chips" role="group" aria-labelledby="souvent-l">'+pistesDuMoment(mo,state.age==='all'?'':state.age,D().age).map(id=>{const x=SITS.find(y=>y.id===id);return '<button type="button" class="chip" data-act="sit" data-id="'+id+'"><span aria-hidden="true">'+x.e+'</span> '+esc(x.t)+'</button>';}).join('')+'</div></div>':'';
  const corps=!list.length?'<div class="card vide"><p>Je n’ai rien trouvé pour ce mot. Vous pouvez essayer un autre mot, ou écrire ce qui se passe avec vos mots à vous.</p><button type="button" class="btn" data-act="porte" data-v="deposer" style="align-self:flex-start">'+I.drop+'Déposer ce qui pèse</button></div>':
    q?'<div class="grp"><div class="liste">'+list.map(sitRow).join('')+'</div></div>':
    (()=>{const blocs=GROUPES.map(g=>{const L=list.filter(s=>s.th===g[0]);return L.length?{n:L.length,h:'<section class="grp"><h2><span class="nom">'+g[1]+'</span><span class="nb" aria-hidden="true">'+L.length+'</span></h2><div class="liste">'+L.map(sitRow).join('')+'</div></section>'}:null;}).filter(Boolean);
      if(nc<2||blocs.length<2)return blocs.map(x=>x.h).join('');
      return rangeEnColonnes(blocs,nc).map(c=>'<div class="th-col">'+c.map(x=>x.h).join('')+'</div>').join('');})();
  const enCols=nc>1&&!q&&list.length>0;
  return '<div class="search">'+I.search+'<input type="search" id="q" aria-label="Chercher une situation" maxlength="'+LIM.search+'" placeholder="Coucher, ado, âge adulte…" value="'+esc(state.q)+'" autocomplete="off" enterkeyhint="search"></div>'+
    (state.piste?'':agesChips())+
    souvent+'<div class="sits groupes'+(q?' trouve':'')+(enCols?' en-cols':'')+'">'+corps+'</div>';
}
function viewSit(){
  const s=SITS.find(x=>x.id===state.sit);if(!s){state.view='kit';return viewKit();}
  const li=a=>'<ul class="list">'+a.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
  /* Les autres situations du même thème, pour continuer sans repasser par la liste. */
  const pr=SITS.filter(x=>x.th===s.th&&x.id!==s.id).slice(0,3);
  const pub=!D().onboarded;
  /* Le lien envoyé est l'adresse publique de la fiche, et rien d'autre. */
  const versAp=suiteFiche(s);
  const part=SITE?'<div class="partage"><button type="button" class="btn" data-act="partager" data-id="'+s.id+'">'+I.share+'Envoyer cette fiche</button><a class="btn wa" href="'+esc(waUrl(s))+'" target="_blank" rel="noopener">Envoyer par WhatsApp</a><p class="hint">Le lien mène tout droit à cette fiche, et il ne contient rien de vous.</p>'+(state.lien?'<div class="field"><label for="lien">Le lien de cette fiche, à copier</label><input type="text" id="lien" readonly value="'+esc(state.lien)+'"></div>':'')+'</div>':'';
  /* La fiche elle-même se lit sur la feuille claire. Ce que l'on fait ensuite (essayer une étape, envoyer la fiche, déposer) reste au bord de l'eau. */
  return '<main id="main" tabindex="-1" class="view fiche"><div class="feuille f-fiche"><div class="couv"><span class="med'+(deuxImages(s.e)?' duo':'')+'" aria-hidden="true">'+s.e+'</span><span class="label">'+esc(liste(s.ages.map((a,i)=>i?AGES[a].toLowerCase():AGES[a])))+'</span><h1 class="t1">'+esc(s.t)+'</h1><p class="sub">'+esc(s.s)+'</p></div>'+
    '<div class="card sec comp"><h2><span class="dot"></span>Ce qui se passe</h2><p>'+esc(s.comp)+'</p></div>'+
    '<div class="card sec ess"><h2><span class="dot"></span>Ce que vous pouvez essayer</h2>'+li(s.ess)+'</div>'+
    '<div class="card sec ev"><h2><span class="dot"></span>Ce qu’il vaut mieux éviter</h2>'+li(s.ev)+'</div>'+
    '<div class="comfort"><span class="label">Un mot pour vous</span><p>'+esc(s.moi)+'</p></div>'+
    '<div class="card sec aide"><h2><span class="dot"></span>Quand demander de l’aide</h2><p>'+esc(s.aide)+'</p></div></div>'+
    versAp+part+
    (pub?'':'<div class="quick"><button type="button" class="btn" data-act="porte" data-v="deposer">'+I.drop+'Déposer</button>'+(/minuteur visuel/.test(s.ess.join(' '))?'<button type="button" class="btn" data-act="kit" data-v="tools" data-tool="timer">'+I.timer+'Le minuteur visuel</button>':'<button type="button" class="btn" data-act="kit" data-v="tools">'+I.tools+'Les outils</button>')+'</div>')+
    (pr.length?'<section class="grp proches"><h2><span class="nom">Dans le même thème</span></h2><div class="liste">'+pr.map(sitRow).join('')+'</div></section>':'')+'</main>';
}
function kitTools(){
  const tabs=[['timer','Minuteur'],['ft','D’abord, ensuite'],['routine','Routine'],['abc','Journal'],['phr','Mes phrases']];
  const seg='<div class="chips scroll" role="group" aria-label="Outils">'+tabs.map(t=>'<button type="button" class="chip" data-act="tool" data-v="'+t[0]+'" aria-pressed="'+(state.tool===t[0])+'">'+t[1]+'</button>').join('')+'</div>';
  let body='';
  if(state.tool==='timer')body=toolTimer();else if(state.tool==='ft')body=toolFT();else if(state.tool==='routine')body=toolRoutine();else if(state.tool==='abc')body=toolABC();else body=toolPhr();
  return rlPorteHtml()+seg+body;
}
/* ---------- Le minuteur visuel ----------
   Un disque de couleur montre le temps qui reste, et il diminue peu à peu, dans le sens des aiguilles d'une montre.
   Quand la couleur a disparu, c'est fini. L'enfant le voit sans savoir lire l'heure, et le parent a les chiffres en dessous.
   Le dessin est celui de cet espace (la couleur du soleil sur le vert, sans cadran et sans chiffres autour).
   « Time Timer » est le nom d'une marque déposée, et son disque rouge aussi : l'outil s'appelle donc « Minuteur visuel », et il a ses propres couleurs. */
const MV_C=2*Math.PI*27;
/* La couleur du disque se choisit, parce qu'un enfant a souvent la sienne. Aucune n'est rouge. Le choix est gardé sur l'appareil. */
const MV_COUL=[['soleil','Soleil'],['vert','Vert'],['bleu','Bleu'],['lilas','Lilas']];
function mvCoul(){const c=D().mvc;return MV_COUL.some(x=>x[0]===c)?c:'soleil';}
function mvDash(frac){const r=Math.max(0,Math.min(1,frac))*MV_C;return '0 '+(MV_C-r).toFixed(2)+' '+r.toFixed(2)+' '+MV_C.toFixed(2);}
function toolTimer(){const t=state.timer;const mins=[1,2,3,5,10,15];const frac=t.total?t.left/t.total:0;
  const coul=mvCoul();
  return '<div class="card green minuteur mv-c-'+coul+'" style="align-items:center"><span class="label">Minuteur visuel</span><p class="hint" style="text-align:center">Votre enfant voit le temps qui reste, sans avoir besoin de lire l’heure. Vous pouvez lui dire « Quand la couleur a disparu, on range ».</p>'+
    '<div class="timerwrap"><div class="ring disque"><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="mv-fond" cx="60" cy="60" r="54"/><circle id="mv-part" class="mv-part" cx="60" cy="60" r="27" style="stroke-dasharray:'+mvDash(frac)+'"/><circle class="mv-bord" cx="60" cy="60" r="54"/></svg></div>'+
    '<div class="mv-num" id="tnum" role="timer" aria-live="off" aria-label="Temps restant">'+Math.floor(t.left/60)+':'+pad(t.left%60)+'</div>'+
    '<div class="bigrow">'+mins.map(m=>'<button type="button" class="btn small'+(t.total===m*60?' primary':'')+'" data-act="tset" data-m="'+m+'">'+m+' min</button>').join('')+'</div><div class="bigrow"><button type="button" class="btn primary" data-act="ttoggle">'+(t.running?I.stop+'Pause':I.timer+'Lancer')+'</button><button type="button" class="btn" data-act="treset">Remettre</button></div>'+
    '<div class="mv-coul" role="group" aria-labelledby="mv-coul-l"><span class="hint" id="mv-coul-l">La couleur du disque</span><div class="mv-pastilles">'+MV_COUL.map(c=>'<button type="button" class="mv-p mv-p-'+c[0]+'" data-act="mvc" data-v="'+c[0]+'" aria-pressed="'+(coul===c[0])+'"><i aria-hidden="true"></i><span class="sr">'+c[1]+'</span></button>').join('')+'</div></div></div></div>';}
function minuteurEnVue(){try{const c=document.querySelector('.minuteur');if(!c)return;const barre=document.querySelector('header.bar');const haut=(barre?Math.max(0,barre.getBoundingClientRect().bottom):0)+12;const y=Math.round(c.getBoundingClientRect().top+window.scrollY-haut);if(y>0)window.scrollTo(0,y);}catch(e){}}
/* Le même minutage sert à l'outil (un disque) et à l'exercice « Une minute pour moi » (un anneau). */
function drawTimer(){const t=state.timer;const num=document.getElementById('tnum');if(!num)return;const frac=t.total?t.left/t.total:0;
  const arc=document.getElementById('arc'),part=document.getElementById('mv-part');
  if(arc){arc.style.strokeDashoffset=String(326.7*(1-frac));arc.style.stroke=frac<.2?'var(--coral)':'var(--green)';}
  if(part)part.style.strokeDasharray=mvDash(frac);
  num.textContent=Math.floor(t.left/60)+':'+pad(t.left%60);}
function tick(){const t=state.timer;if(!t.running)return;t.left=Math.max(0,t.left-1);drawTimer();if(t.left===0){t.running=false;clearInterval(t.h);t.h=null;try{if(navigator.vibrate)navigator.vibrate([200,100,200]);}catch(e){}toast('C’est fini. Bravo.');render();}}
function stopTimer(){const t=state.timer;t.running=false;if(t.h){clearInterval(t.h);t.h=null;}}
/* ---------- « D'abord, ensuite » et la routine : des cartes-images ---------- */
/* Les images sont des cartes blanches, une seule chose par carte, avec le mot dessous. Le tableau choisi est gardé sur l'appareil (data.ft).
   Toucher une image ou une case ne redessine pas l'écran : seules les parties qui changent sont mises à jour, pour que les images ne clignotent pas. */
const PICTO_DIR=SITE?RACINE+'img/pictos/':'https://parent-ecoute.ch/img/pictos/';
const PICTO_PAR=Object.create(null);PICTOS.forEach(p=>{PICTO_PAR[p[0]]=p;});
const FT_FLECHE='<svg class="puis" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" style="fill:none;stroke:currentColor;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round"/></svg>';
function pictoImg(id,t,tard){return '<img src="'+PICTO_DIR+id+'.svg" alt="" width="'+t+'" height="'+t+'"'+(tard?' loading="lazy"':'')+'>';}
/* Le tableau gardé : deux identifiants d'image. Un identifiant inconnu (image retirée depuis) vaut une case vide. */
function ftRec(){const f=D().ft||{};const ok=k=>(f[k]&&PICTO_PAR[f[k]])?f[k]:null;return {first:ok('first'),then:ok('then')};}
/* Le groupe d'images affiché : celui que le parent a choisi, sinon celui du moment de la journée. */
function ftGroupe(){if(!state.ft.g){const h=new Date().getHours();state.ft.g=h<5?'soir':h<10?'matin':h<14?'repas':h<18?'jouer':'soir';}return state.ft.g;}
/* « --l » est la longueur du plus long mot : le mot sous l'image est écrit aussi grand que la carte le permet, sans être coupé. */
function ftCarte(k){const f=ftRec(),p=PICTO_PAR[f[k]];return '<button type="button" class="ftcard'+(k==='then'?' then':'')+'" data-act="ftpick" data-k="'+k+'" data-img="'+(f[k]||'')+'" aria-pressed="'+(state.ft.pick===k)+'"><span class="lbl">'+(k==='first'?'D’abord':'Ensuite')+'</span>'+(p?'<span class="pcarte" style="--l:'+Math.max.apply(null,p[1].split(/[\s-]+/).map(x=>x.length))+'">'+pictoImg(p[0],160)+'<span>'+esc(p[1])+'</span></span>':'<span class="vide">'+(k==='first'?'Ce qu’il doit faire':'Ce qui lui fait plaisir')+'</span>')+'</button>';}
function ftDit(){const f=ftRec();return f.first&&f.then?'<div class="comfort">Montrez-lui le tableau et dites « D’abord '+esc(PICTO_PAR[f.first][2])+', ensuite '+esc(PICTO_PAR[f.then][2])+' ».</div>':'';}
function ftOu(){const f=ftRec(),k=state.ft.pick;return 'Touchez une image pour '+(f[k]?'changer':'remplir')+' la case <b>'+(k==='first'?'D’abord':'Ensuite')+'</b>. Il y en a '+PICTOS.length+', rangées par moment de la journée.';}
function ftVideOff(){const f=ftRec();return !(f.first||f.then);}
/* Dans la grille, une image posée dans le tableau porte une étiquette qui dit dans quelle case elle se trouve. */
function ftOuEst(id,f){return f.first===id?'first':f.then===id?'then':'';}
function ftMarque(k){return k?'<b class="ou"><span class="sr">, dans la case </span>'+(k==='first'?'D’abord':'Ensuite')+'</b>':'';}
function ftGrille(){const g=ftGroupe(),f=ftRec();const G=PICTO_GROUPES.find(x=>x[0]===g);const ids=G?G[2].split(' '):PICTOS.map(p=>p[0]);return ids.map(id=>{const p=PICTO_PAR[id],k=ftOuEst(id,f);return '<button type="button" class="pcarte" data-act="ftset" data-id="'+id+'" data-ou="'+k+'" aria-pressed="'+(!!k)+'">'+pictoImg(id,96,true)+'<span>'+esc(p[1])+'</span>'+ftMarque(k)+'</button>';}).join('');}
function toolFT(){const g=ftGroupe();
  return '<div class="card ftool"><span class="label">Tableau « d’abord, ensuite »</span><p class="hint">Ce tableau montre deux images à votre enfant. La première est ce qu’il doit faire, et la seconde est ce qui lui fait plaisir juste après. Il accepte plus facilement la première quand il voit la seconde. Par exemple, d’abord les dents, ensuite l’histoire.</p>'+
    '<div id="ft-dit" aria-live="polite">'+ftDit()+'</div><div class="ft" id="ft">'+ftCarte('first')+FT_FLECHE+ftCarte('then')+'</div>'+
    '<p class="hint" id="ft-ou">'+ftOu()+'</p>'+
    '<div class="chips" role="group" aria-label="Moments de la journée">'+PICTO_GROUPES.map(x=>'<button type="button" class="chip" data-act="ftg" data-v="'+x[0]+'" aria-pressed="'+(g===x[0])+'">'+x[1]+'</button>').join('')+'<button type="button" class="chip" data-act="ftg" data-v="tout" aria-pressed="'+(g==='tout')+'">Tout</button></div>'+
    '<div class="picto" id="ft-grille">'+ftGrille()+'</div>'+
    '<button type="button" class="btn small" id="ft-vide" data-act="ftvide" style="align-self:flex-start"'+(ftVideOff()?' hidden':'')+'>Vider le tableau</button>'+
    '<p class="pcredit">Les images sont des <a href="'+(SITE?'':'https://parent-ecoute.ch/')+'conditions.html#propriete">Mulberry Symbols de Steve Lee</a>, partagés sous licence CC BY-SA 4.0.</p></div>';}
/* Met à jour le tableau sans redessiner l'écran. quoi : 'cases' (une image a changé), 'groupe' (un autre groupe d'images), sinon seulement la case visée. */
function ftSync(quoi){
  const box=document.getElementById('ft');if(!box){render();return;}
  const f=ftRec();
  /* La grille ne doit pas bouger sous le doigt quand la phrase à dire apparaît ou disparaît au-dessus d'elle : on note où elle est, et on rattrape l'écart à la fin. */
  const gr0=document.getElementById('ft-grille');const y0=gr0&&quoi!=='groupe'?gr0.getBoundingClientRect().top:null;
  /* Une case n'est refaite que si son image a changé. */
  ['first','then'].forEach(k=>{const b=box.querySelector('[data-k="'+k+'"]');if(!b)return;if(b.dataset.img!==(f[k]||''))b.outerHTML=ftCarte(k);else b.setAttribute('aria-pressed',String(state.ft.pick===k));});
  /* Un texte n'est réécrit que s'il a changé (comparé une fois mis en forme par le navigateur), pour qu'un lecteur d'écran ne le relise pas pour rien. */
  const set=(id,h)=>{const el=document.getElementById(id);if(!el)return;const t=document.createElement('div');t.innerHTML=h;if(el.innerHTML!==t.innerHTML)el.innerHTML=h;};
  set('ft-dit',ftDit());
  const v=document.getElementById('ft-vide');if(v)v.hidden=ftVideOff();
  set('ft-ou',ftOu());
  const gr=document.getElementById('ft-grille');
  if(gr){
    if(quoi==='groupe'){gr.innerHTML=ftGrille();const g=ftGroupe();[].forEach.call(document.querySelectorAll('[data-act="ftg"]'),c=>c.setAttribute('aria-pressed',String(c.dataset.v===g)));}
    else [].forEach.call(gr.querySelectorAll('button'),b=>{const k=ftOuEst(b.dataset.id,f);if(b.dataset.ou===k)return;b.dataset.ou=k;b.setAttribute('aria-pressed',String(!!k));const m=b.querySelector('.ou');if(m)m.remove();if(k)b.insertAdjacentHTML('beforeend',ftMarque(k));});
    if(y0!==null){const dy=gr.getBoundingClientRect().top-y0;if(Math.abs(dy)>=1){try{window.scrollBy(0,dy);}catch(e){}}}
  }
}
function rFait(){const d=D();return d.routineDone[todayIso()]||{};}
function rFin(){const done=rFait();return ROUTINE_DEF.every((x,i)=>done[i])?'<div class="comfort">Tout est fait. Bonne nuit à tous les deux.</div>':'';}
function toolRoutine(){const done=rFait();return '<div class="card"><span class="label">La routine du soir</span><p class="hint">Suivez le même ordre chaque soir. Laissez votre enfant cocher lui-même, pour qu’il sente que c’est lui qui avance.</p><div class="routine" id="routine">'+ROUTINE_DEF.map((id,i)=>'<button type="button" class="rstep'+(done[i]?' done':'')+'" data-act="rdone" data-i="'+i+'" aria-pressed="'+(!!done[i])+'"><span class="e">'+pictoImg(id,56)+'</span><span class="t">'+esc(PICTO_PAR[id][1])+'</span><span class="ck">'+(done[i]?I.check:'')+'</span></button>').join('')+'</div><div id="r-fin">'+rFin()+'</div><button type="button" class="btn small" data-act="rreset" style="align-self:flex-start">Remettre à zéro</button></div>';}
/* Coche ou décoche une étape de la routine sans redessiner l'écran. */
function rSync(){
  const box=document.getElementById('routine');if(!box){render();return;}
  const done=rFait();
  [].forEach.call(box.querySelectorAll('.rstep'),b=>{const on=!!done[b.dataset.i];b.classList.toggle('done',on);b.setAttribute('aria-pressed',String(on));const ck=b.querySelector('.ck');if(ck)ck.innerHTML=on?I.check:'';});
  const fin=document.getElementById('r-fin');if(fin){const h=rFin();if(!!h!==!!fin.firstChild)fin.innerHTML=h;}
}
function toolABC(){const d=D();const list=d.abc.slice().reverse().slice(0,10);return '<div class="card"><span class="label">Journal avant, pendant, après</span><p class="hint">Notez trois lignes à chaque fois que cela déborde. Au bout de trois semaines, vous verrez ce qui se passe juste avant. C’est aussi ce que tout professionnel vous demandera.</p><div class="abc"><div class="field"><label for="a1">Avant</label><input type="text" id="a1" maxlength="'+LIM.line+'" placeholder="Où, quand, qui, quoi juste avant" autocomplete="off"></div><div class="field"><label for="a2">Pendant</label><input type="text" id="a2" maxlength="'+LIM.line+'" placeholder="Ce qui s’est passé, combien de temps" autocomplete="off"></div><div class="field"><label for="a3">Après</label><input type="text" id="a3" maxlength="'+LIM.line+'" placeholder="Ce qui a aidé, ce qui a suivi" autocomplete="off"></div></div><button type="button" class="btn primary" data-act="abcadd" style="align-self:flex-start">'+I.plus+'Noter</button></div>'+(list.length?'<div class="log">'+list.map(x=>'<div class="logi"><span class="d">'+esc(fmtDate(x.date))+' à '+esc(hm(x.time))+'</span><span><b>Avant</b> '+esc(x.a)+'</span><span><b>Pendant</b> '+esc(x.b)+'</span><span><b>Après</b> '+esc(x.c)+'</span></div>').join('')+'</div>':'');}
function toolPhr(){const d=D();return '<div class="card"><span class="label">Mes phrases qui marchent</span><p class="hint">Gardez ici les phrases qui calment, qui font rire ou qui débloquent une situation. Elles serviront à vous, à l’autre parent ou à la grand-mère qui garde samedi.</p><div class="field"><label class="sr" for="ph">Une phrase qui marche</label><input type="text" id="ph" maxlength="'+LIM.phrase+'" placeholder="Par exemple « On respire comme le dragon »" autocomplete="off" enterkeyhint="done"></div><button type="button" class="btn primary" data-act="phadd" style="align-self:flex-start">'+I.plus+'Garder</button>'+(d.phrases.length?'<div class="phr">'+d.phrases.map((p,i)=>'<div><span>'+esc(p)+'</span><button type="button" class="btn small ghost" data-act="phdel" data-i="'+i+'" aria-label="Retirer cette phrase">'+I.trash+'</button></div>').join('')+'</div>':'')+'</div>';}
function kitMe(){
  return '<div class="ex">'+EXOS.map(x=>'<button type="button" class="sit" data-act="exo" data-id="'+x.id+'"><span class="e">'+I[x.ico]+'</span><span class="tx"><b>'+esc(x.t)+'</b><span>'+esc(x.s)+'</span></span><span class="chev">'+I.chev+'</span></button>').join('')+'</div>'+
    '<div class="comfort">'+esc(WORDS[(dayIdx(WORDS.length)+5)%WORDS.length])+'</div>';
}
function viewExo(){
  const x=EXOS.find(e=>e.id===state.exo);if(!x){state.view='kit';return viewKit();}
  let body='';
  if(x.id==='breath')body='<div class="breath"><div class="orbwrap" aria-hidden="true"><div class="orb"></div></div><div class="txt">Inspirez quand le cercle grandit, expirez quand il rétrécit.</div></div>';
  else if(x.id==='trois'){const t=D().three.slice().reverse().slice(0,5);body='<div class="card"><div class="field"><input type="text" id="t1" aria-label="Première chose" maxlength="'+LIM.three+'" placeholder="Une" autocomplete="off"></div><div class="field"><input type="text" id="t2" aria-label="Deuxième chose" maxlength="'+LIM.three+'" placeholder="Deux" autocomplete="off"></div><div class="field"><input type="text" id="t3" aria-label="Troisième chose" maxlength="'+LIM.three+'" placeholder="Trois" autocomplete="off"></div><button type="button" class="btn primary" data-act="threeadd" style="align-self:flex-start">'+I.star+'Garder</button></div>'+(t.length?'<div class="log">'+t.map(e=>'<div class="logi"><span class="d">'+esc(fmtDate(e.date))+'</span><span>'+esc(e.items.join(', '))+'</span></div>').join('')+'</div>':'');}
  else if(x.id==='deposer')body='<div class="card"><textarea id="dep" aria-label="Ce qui pèse (rien n’est gardé)" maxlength="10000" style="min-height:200px" placeholder="Tout ce qui tourne…"></textarea><button type="button" class="btn primary" data-act="depose" style="align-self:flex-start">'+I.wind+'Déposer et effacer</button><p class="hint">Rien n’est enregistré, et le texte disparaît dès que vous appuyez. Si vous souhaitez une réponse, utilisez plutôt « Déposer ce qui pèse », dans « Aujourd’hui ».</p></div>';
  else if(x.id==='droit')body='<div class="perm">'+PERMISSIONS.map(p=>'<div><b>'+esc(p[0])+'</b> '+esc(p[1])+'</div>').join('')+'</div>';
  else if(x.id==='minute')body='<div class="card green" style="align-items:center"><div class="ring" style="width:200px;height:200px"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" style="fill:none;stroke:var(--surface);stroke-width:12"/><circle id="arc" cx="60" cy="60" r="52" style="fill:none;stroke:var(--green);stroke-width:12;stroke-linecap:round;stroke-dasharray:326.7;stroke-dashoffset:0"/></svg><div class="num" id="tnum" style="font-size:44px">'+Math.floor(state.timer.left/60)+':'+pad(state.timer.left%60)+'</div></div><button type="button" class="btn primary" data-act="minute">'+(state.timer.running?I.stop+'Arrêter':I.timer+'Une minute')+'</button></div>';
  else if(x.id==='appeler')body='<div class="log">'+HELP.map(h=>'<div class="logi"><b>'+esc(h.t)+'</b>'+(h.tel?'<span style="font-size:22px">'+tel(h.tel)+'</span>':'<a href="'+h.url+'" target="_blank" rel="noopener noreferrer" style="font-size:18px;font-weight:800">'+esc(h.label)+' '+I.ext+'<span class="sr"> (nouvel onglet)</span></a>')+'<span class="hint">'+esc(h.d)+'</span></div>').join('')+'</div>';
  return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">'+esc(x.t)+'</h1>'+(x.how?'<p class="sub">'+esc(x.how)+'</p>':'')+'</div>'+body+'</main>';
}
function viewSOS(){
  return '<main id="main" tabindex="-1" class="view sosview" style="padding-top:14px"><header class="bar"><button type="button" class="back" data-act="back">'+I.back+'Sortir</button></header>'+
    '<div><h1 class="t1" style="color:var(--coral)">Là, maintenant.</h1><p class="sub">Vous n’avez rien à réussir, juste à laisser passer la vague. Suivez ces quatre étapes dans l’ordre.</p></div>'+
    '<div class="sosstep"><span class="n">1</span><div class="tx"><b>Sécurité</b><span>Écartez ce qui peut blesser et laissez de la place. Ne retenez pas votre enfant si ce n’est pas nécessaire.</span></div></div>'+
    '<div class="sosstep"><span class="n">2</span><div class="tx"><b>Moins</b><span>Mettez moins de mots, moins de lumière et moins de bruit. Répétez calmement une seule phrase, par exemple « Je suis là, on attend ».</span></div></div>'+
    '<div class="sosstep"><span class="n">3</span><div class="tx"><b>Vous</b><span>Posez vos pieds bien au sol et respirez avec le cercle. Si tout est sûr, vous avez le droit de sortir trente secondes.</span></div></div>'+
    '<div class="breath"><div class="orbwrap" aria-hidden="true"><div class="orb"></div></div><div class="txt">Inspirez… expirez…</div></div>'+
    '<div class="sosstep"><span class="n">4</span><div class="tx"><b>Après</b><span>Proposez un verre d’eau et un geste doux s’il est accepté. Ne revenez pas sur la scène et ne punissez pas, parce qu’on ne punit pas une vague. Plus tard, notez ce qui s’est passé juste avant.</span></div></div>'+
    '<div class="emg"><b>Si quelqu’un est en danger</b><span>Appelez le '+tel('144')+' pour les urgences ou le '+tel('117')+' pour la police.</span><span>Si c’est vous qui n’en pouvez plus, appelez La Main Tendue au '+tel('143')+', de jour comme de nuit.</span></div>'+
    '<button type="button" class="btn primary wide" data-act="back">C’est passé, je reviens</button><p class="hint">Ce que vous venez de faire, c’est exactement ce qu’un professionnel aurait fait.</p></main>';
}
/* ---------- moi ---------- */
function moodDots(){const d=D();const out=[];for(let i=13;i>=0;i--){const dt=new Date(Date.now()-i*86400000);const k=dt.getFullYear()+'-'+pad(dt.getMonth()+1)+'-'+pad(dt.getDate());const m=d.moods[k];out.push('<i class="'+(m!==undefined?'m'+m:'')+'"></i>');}const n=out.filter(x=>x.indexOf('class="m')>0).length;return '<div class="mooddots" role="img" aria-label="Humeur notée '+n+' jour'+(n>1?'s':'')+' sur les quatorze derniers">'+out.join('')+'</div>';}
function viewMe(){
  const d=D();const T=TIERS[tier()];const ld=lastDepot();const ql=questionsLeft();
  const nf=doneCount(),np=nbNotes(),nd=d.depots.length;const dep=d.start?dateLongue(d.start):'';
  /* Trois chiffres en haut : les étapes faites, les pages écrites, les dépôts. Chacun mène à son écran. */
  const trio='<div class="trio"><button type="button" data-act="go" data-view="parcours"><b>'+nf+'</b><span>étape'+(nf>1?'s':'')+' faite'+(nf>1?'s':'')+'</span></button><button type="button" data-act="go" data-view="carnet"><b>'+np+'</b><span>page'+(np>1?'s':'')+' écrite'+(np>1?'s':'')+'</span></button><button type="button" data-act="go" data-view="depots"><b>'+nd+'</b><span>dépôt'+(nd>1?'s':'')+'</span></button></div>';
  return '<main id="main" tabindex="-1" class="view moi" style="padding-top:0"><div class="band thin bleed" style="background-image:url('+HERO+');background-position:right 70%"><h1 class="t1" data-act="atelier">Moi</h1></div><p class="sub">'+(dep?'Vous avez commencé le '+esc(dep)+'. ':'')+'Vous retrouvez ici vos achats, vos dépôts, votre carnet, votre humeur et vos réglages.</p>'+
    '<div class="duo"><div class="duo-a">'+trio+achatsHtml()+rlPorteHtml()+
    '<button type="button" class="sit" data-act="go" data-view="final"><span class="e">'+I.path+'</span><span class="tx"><b>Mon chemin</b><span>Tout votre parcours sur une page, à garder ou à imprimer</span></span><span class="chev">'+I.chev+'</span></button>'+
    '</div><div class="duo-b">'+essaiCarte()+'<div class="card"><span class="label">Mon humeur, quatorze jours</span>'+moodDots()+'<p class="hint">Chaque carré représente un jour, du plus ancien au plus récent. Vos humeurs restent sur votre appareil.</p></div>'+
    '<div class="menu-list"><button type="button" data-act="fx" aria-pressed="'+(!d.fxOff)+'">'+I.sun2+'<span>Effets visuels</span><span class="state">'+(FX_RM&&FX_RM.matches?'Coupés par votre appareil':d.fxOff?'Désactivés':(fxOn()&&eauInit()===false?'Activés, sans l’eau':'Activés'))+'</span></button>'+(d.atelier?'<button type="button" data-act="tout" aria-pressed="'+(!!d.tout)+'">'+I.path+'<span>Tout voir, l’aperçu d’Antonio</span><span class="state">'+(d.tout?'Activé':'Désactivé')+'</span></button>':'')+'<button type="button" data-act="onboard">'+I.user+'<span>Personnaliser mon espace (prénom, âge, situation)</span><span class="chev">'+I.chev+'</span></button><button type="button" data-act="voix">'+I.question+'<span>Qui vous parle ici ?</span><span class="chev">'+I.chev+'</span></button><button type="button" data-act="go" data-view="data">'+I.download+'<span>Vos données et tout recommencer</span><span class="chev">'+I.chev+'</span></button><button type="button" data-act="go" data-view="about">'+I.info+'<span>L’histoire d’Antonio</span><span class="chev">'+I.chev+'</span></button>'+
    (SITE?'<a href="'+RACINE+'confidentialite.html">'+I.shield+'<span>Politique de confidentialité</span><span class="chev">'+I.chev+'</span></a><a href="'+RACINE+'conditions.html">'+I.note+'<span>Conditions générales</span><span class="chev">'+I.chev+'</span></a>'+(MENTIONS?'<a href="'+RACINE+'mentions-legales.html">'+I.info+'<span>Mentions légales</span><span class="chev">'+I.chev+'</span></a>':''):'')+'</div></div></div></main>';
}
function viewDepots(){
  const list=D().depots.slice().reverse();
  return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">Mes dépôts</h1><p class="sub">Vous retrouvez ici tout ce que vous avez déposé et ce que vous avez reçu en retour. Tout reste sur votre appareil.'+(can('antonio')?(DEMO?' Dans la version complète, Antonio ne lira que les dépôts cochés « Partager ». Dans cette version de test, rien ne lui est transmis.':' Seuls les dépôts cochés « Partager » sont lus par Antonio.'):'')+'</p></div>'+
    (list.length?'<div class="depots">'+list.map(x=>depotHtml(x,false)).join('')+'</div>':'<div class="card vide"><p>Vous n’avez encore rien déposé. Quand quelque chose pèse, vous pouvez l’écrire, et vous recevez en retour une question et une lumière.</p><button type="button" class="btn primary" data-act="porte" data-v="deposer" style="align-self:flex-start">'+I.drop+'Déposer ce qui pèse</button></div>')+'</main>';
}
/* ---------- les 3 offres, l'essai du parcours et la commande ---------- */
/* Tout ce qui touche à la vente tient ici, à l'écart du SOS, de la respiration et de l'écran « Déposer ».
   Découverte est gratuite. Le parcours s'achète une fois, 84 CHF en tout, payés en une fois ou en six fois. « Passer le relais » s'achète une fois, 49 CHF,
   avec ou sans le parcours. Il n'y a pas d'abonnement, donc rien à arrêter.
   Rien n'est payé et rien n'est envoyé : il n'existe encore ni prestataire de paiement, ni compte, ni serveur. La commande est une démonstration. */
function com(){const d=D();if(!d.com||typeof d.com!=='object')d.com={};return d.com;}
/* Les 3 mesures prévues pour le lancement : un aperçu terminé, un achat par offre, et un retour sur l'outil acheté un autre jour.
   Elles ne contiennent ni texte, ni humeur, ni situation. Dans cette version, elles restent sur l'appareil. Le jour où un compteur sera branché,
   il ne recevra que le nom de la mesure et celui de l'offre, et seulement si le visiteur a dit oui à la mesure. */
function repere(quoi,f,m){const c=com();const j=todayIso();
  if(quoi==='apercu'){if(!c.ap)c.ap=j;}
  else if(quoi==='choix')c.ch={f:f,d:j};
  else if(quoi==='achat'){if(!c.ach||typeof c.ach!=='object')c.ach={};c.ach[f]={d:j,m:m||''};}
  save();}
function usage(k){const c=com();if(!c.us||typeof c.us!=='object')c.us={};if(!Array.isArray(c.us[k]))c.us[k]=[];const a=c.us[k],j=todayIso();if(a.indexOf(j)<0&&a.length<2){a.push(j);save();}}
function contact(){return String(CONTACT_R||'').split('').reverse().join('');}
const F_TXT={
  free:{b:'Recevoir une aide tout de suite.',s:'Ce que vous pouvez faire gratuitement',
    c:['Vous soufflez 2 minutes, en silence ou avec la musique de l’étang.','Vous lisez la dose de lumière, chaque jour.','Vous ouvrez les '+SITS.length+' fiches pratiques et tous les outils.','Vous essayez une vraie étape du parcours, en 3 minutes.',SITE?'Vous déposez ce qui pèse autant que vous en avez besoin, pour vous ou pour préparer ce que vous aimeriez dire à quelqu’un.':'Vous déposez ce qui pèse, et 3 dépôts reçoivent une réponse.'],
    d:'Découverte est gratuite, sans limite de durée et sans compte.'},
  parcours:{b:'24 étapes guidées pour avancer d’une semaine à l’autre, pendant 6 mois.',s:'Ce que contient Le parcours',
    c:['24 étapes guidées s’ouvrent une par une, chaque semaine.','À chaque étape, vous comprenez une idée, vous l’essayez chez vous et vous écrivez quelques mots dans votre carnet de route.','Vous voyez votre chemin dans « Mon évolution », au départ, à 3 mois et à 6 mois.',SITE?'':'Vous déposez ce qui pèse autant que vous en avez besoin.','Vous choisissez une image pour dire où vous en êtes, avec le photolangage.'].filter(Boolean),
    d:'Une fois acheté, le parcours reste ouvert sans limite de durée. Si vous vous absentez, rien ne s’accumule.'},
  relais:{b:'Confier votre enfant à un proche, l’esprit plus léger.',s:'Ce que fait l’outil',
    c:['Vous préparez une page pour la personne qui prend le relais, avec vos mots.','En tête, « Si tu ne lis que trois choses », que vous choisissez vous-même.','Votre proche ouvre la fiche sur son téléphone, sans compte et sans rien acheter.','Au retour, une seule question, et le prochain relais est prêt plus vite.','Vous préparez aussi une réunion avec l’école ou le foyer, avec « Je perds mes mots ».'],
    d:'L’outil sert à toute la famille, sans abonnement et sans limite de fiches.'}
};
const PRIX=k=>k==='relais'?'49 CHF, une seule fois':k==='parcours'?'84 CHF en tout':'0 CHF';
const DEMO_PAIE='Dans cette version d’essai, aucun montant réel n’est débité.';
const TOTAL_84='Total 84 CHF dans les deux cas. Sans supplément ni renouvellement automatique.';
/* Les 6 dates d'un paiement en six fois : le jour de l'achat, puis le même jour des 5 mois suivants (ou le dernier jour du mois s'il est plus court). */
function echeances(depuis){const p=String(depuis||todayIso()).split('-').map(Number);const out=[];for(let i=0;i<NB_ECH;i++){const y=p[0]+Math.floor((p[1]-1+i)/12),m=(p[1]-1+i)%12;const fin=new Date(y,m+1,0).getDate();out.push(y+'-'+pad(m+1)+'-'+pad(Math.min(p[2],fin)));}return out;}
function echeancesHtml(depuis,payees){
  const E=echeances(depuis);const n=payees||0;
  return '<ol class="ech">'+E.map((d,i)=>'<li'+(i<n?' class="ech-ok"':'')+'><span>'+(i===0&&!n?'Aujourd’hui, le ':'Le ')+esc(dateLongue(d))+(i<n?', payée':'')+'</span><b>'+MENSU+' CHF</b></li>').join('')+'<li class="ech-total"><span>Total</span><b>84 CHF</b></li></ol>'+
    '<p class="f-note">La dernière mensualité est celle du '+esc(dateLongue(E[NB_ECH-1]))+'. Après elle, plus rien n’est prélevé.</p>';
}
/* Les 2 façons de payer Le parcours, avec la même importance à l'écran. */
function payerParcours(de){
  if(can('parcours'))return '<button type="button" class="btn wide" data-act="rien" aria-disabled="true">'+I.check+'Vous avez Le parcours</button>';
  return '<div class="f-payer" role="group" aria-label="2 façons de payer Le parcours"><button type="button" class="btn primary f-mode" data-act="commande" data-v="parcours" data-m="une" data-de="'+de+'"><b>En une fois</b><span>84 CHF aujourd’hui</span></button><button type="button" class="btn primary f-mode" data-act="commande" data-v="parcours" data-m="six" data-de="'+de+'"><b>En six fois</b><span>14 CHF aujourd’hui, puis 5 mensualités de 14 CHF</span></button></div><p class="f-total">'+TOTAL_84+'</p>';
}
function viewPlans(){
  const peek=!D().onboarded;
  let large=false;try{large=!!(window.matchMedia&&window.matchMedia('(min-width:900px)').matches);}catch(e){}
  const carte=(k,nom,prix,petit,bouton,plus,best)=>{const X=F_TXT[k];
    /* Sur un téléphone, on voit d'abord le bénéfice, le prix et le geste. Le détail se déplie. Sur un grand écran, il est ouvert. */
    return '<section class="formule f-'+k+(best?' best':'')+'" aria-labelledby="f-'+k+'"><div class="f-haut"><div class="f-nom"><h2 id="f-'+k+'">'+nom+'</h2></div><p class="f-prix"><b>'+prix+'</b> <small>'+petit+'</small></p></div><p class="f-benef">'+X.b+'</p>'+bouton+plus+
      '<details class="f-concret"'+(large?' open':'')+'><summary>'+X.s+'</summary><ul>'+X.c.map(x=>'<li>'+x+'</li>').join('')+'</ul><p class="f-note">'+X.d+'</p></details></section>';};
  const bFree=peek?'<button type="button" class="btn wide" data-act="entrer" data-v="today">Commencer gratuitement</button>':'<button type="button" class="btn wide" data-act="rien" aria-disabled="true">'+I.check+'C’est déjà à vous</button>';
  const bRel=can('relais')?'<button type="button" class="btn wide" data-act="rl" data-k="ouvre">'+I.hand+'Ouvrir Passer le relais</button>':'<button type="button" class="btn primary wide" data-act="commande" data-v="relais" data-de="plans">Choisir Passer le relais</button>';
  return '<main id="main" tabindex="-1" class="view v-feuille"><div class="feuille">'+
    '<div class="f-tete"><h1 class="t1">Les 3 offres</h1><p class="sub">Vous commencez gratuitement. Ensuite, vous payez une fois ce qui vous sert, sans abonnement.</p><p class="demo-paie">'+I.info+'<span>'+DEMO_PAIE+'</span></p></div>'+
    '<div class="formules">'+
      carte('free','Découverte','0 CHF','sans limite de durée',bFree,'<button type="button" class="lien-f" data-act="apercu">'+I.path+'Essayer une étape, en 3 minutes</button>',false)+
      carte('parcours','Le parcours','84 CHF','en tout',payerParcours('plans'),'<button type="button" class="lien-f" data-act="apercu">'+I.path+'Essayer une étape avant de choisir</button>',false)+
      carte('relais','Passer le relais','49 CHF','une seule fois',bRel,'<button type="button" class="lien-f" data-act="rl" data-k="exemple">'+I.eye+'Voir un exemple de fiche terminée</button>',false)+
    '</div>'+
    '<section class="f-regles"><h2>Paiement, durée et ce que vous gardez</h2><ul class="list">'+
      '<li>Découverte est gratuite, sans limite de durée.</li>'+
      '<li>Le parcours coûte 84 CHF en tout. Vous le payez en une fois, ou en 6 fois 14 CHF, une fois par mois. Dans les deux cas, vous achetez le parcours complet.</li>'+
      '<li>Passer le relais coûte 49 CHF, une seule fois. Il s’achète avec ou sans le parcours.</li>'+
      '<li>Il n’y a ni abonnement ni renouvellement automatique. Après le dernier paiement prévu, plus rien n’est prélevé.</li>'+
      '<li>Ce que vous achetez reste ouvert sans limite de durée.</li>'+
      '<li>Votre carnet, vos fiches et vos dépôts restent sur votre appareil. Vous pouvez les sauvegarder dans un fichier, les restaurer, et imprimer « Mon chemin » comme vos fiches de relais.</li>'+
    '</ul><p class="f-avant">Le moyen de paiement, le remboursement et ce qui se passe si une mensualité ne peut pas être prélevée seront écrits ici et dans les conditions générales avant l’ouverture de la vente.</p></section>'+
    '<section class="f-prevenir"><h2>Être prévenu de l’ouverture</h2><p>La vente n’est pas encore ouverte. Si vous le souhaitez, vous pouvez demander à être prévenu par e-mail du jour où une offre ouvrira, à son prix annoncé.</p>'+prevenirHtml('parcours')+prevenirHtml('relais')+'<p class="hint">Le message part de votre propre messagerie. Antonio garde votre adresse seulement pour vous écrire ce jour-là, et vous pouvez lui demander de l’effacer.'+(CONTACT_R?' Si rien ne s’ouvre, écrivez à '+esc(contact())+'.':'')+'</p></section>'+
    '<div class="f-discret"><button type="button" class="lien-f" data-act="cadeau">'+I.star+'Offrir à un parent</button><button type="button" class="lien-f" data-act="retrouver">'+I.search+'Retrouver un achat</button></div>'+
    '<p class="hint">Dans cette version d’essai, choisir une offre ouvre une démonstration de commande. Aucun paiement n’est demandé et rien n’est transmis.'+(SITE?' <a href="'+RACINE+'conditions.html">Conditions générales</a>':'')+'</p>'+
    '</div></main>';
}
/* « Me prévenir » est un vrai lien vers la messagerie du parent, avec un message écrit d'avance. C'est lui qui l'envoie : rien ne part sans lui. */
function prevenirUrl(k){
  const T=PRODUITS[k];
  return 'mailto:'+contact()+'?subject='+encodeURIComponent('Me prévenir à l’ouverture de '+T.t)+'&body='+encodeURIComponent('Bonjour,\n\nMerci de me prévenir par e-mail quand « '+T.t+' » ouvrira, à '+PRIX(k)+'.\n\n');
}
function prevenirHtml(k){return CONTACT_R?'<a class="btn wide prevenir" href="'+esc(prevenirUrl(k))+'">'+I.mail+'<span>Me prévenir pour '+esc(PRODUITS[k].t)+', '+PRIX(k)+'</span></a>':'';}

/* ---------- l'essai du parcours : l'étape 7, en 3 minutes ---------- */
/* Un chemin complet, fait de ce qui existe déjà : la vague de l'émotion (l'idée et le schéma de l'étape 7), un geste à choisir (son exercice),
   le carnet de route (la page de l'étape), puis ce que la semaine suivante apporte. Le parent repart avec quelque chose d'utile même s'il s'arrête là.
   L'offre du Parcours n'arrive qu'au dernier écran. À sa visite suivante, « Aujourd'hui » lui montre son geste et « Reprendre ici ». */
const AP_GESTES=[['souffle','Expirer lentement'],['sortir','Sortir un instant'],['marcher','Marcher 5 minutes'],['mains','Poser les mains à plat'],['phrase','Dire une phrase apprise par cœur']];
const AP_TITRES=['La vague','Mon geste','Mon carnet','La semaine prochaine'];
function apEtape(){return allSteps().find(x=>x.id==='reguler');}
function apGarde(){
  const a=state.ap,d=D(),s=apEtape();if(!s)return false;
  const g=(AP_GESTES.find(x=>x[0]===a.g)||[])[1]||'';const champ=document.getElementById('ap-mot');const mot=clean(champ?champ.value:(a.mot||''),LIM.note);
  if(!g&&!mot)return false;
  a.mot=mot;
  const texte=(g?g+'.':'')+(g&&mot?' ':'')+mot;
  /* Une page déjà écrite à l'étape 7 n'est jamais remplacée : le geste choisi s'ajoute à la suite. */
  const nt=noteDe(s.id);
  if(nt){if(nt.t.indexOf(texte)<0){nt.t=(nt.t+'\n'+texte).slice(0,LIM.note);nt.d=todayIso();}}
  else d.notes[s.id]={t:texte,d:todayIso()};
  entrer('apercu');save();return true;
}
/* Le geste gardé pendant l'essai, pour « Aujourd'hui » : il attend le parent, avec un seul bouton pour reprendre. */
function repriseHtml(){
  const s=apEtape();if(!s||can('parcours'))return '';const nt=noteDe(s.id);if(!nt||!com().ap&&!nt.t)return '';
  return '<div class="card reprise-geste reveal d2"><span class="label">Votre geste, quand la vague monte</span><p class="rg-t">'+nl2(String(nt.t).split('\n').slice(-2).join('\n'))+'</p><button type="button" class="btn primary" data-act="apercu-reprise">'+I.path+'Reprendre ici</button><p class="hint">Vous l’avez gardé le '+esc(fmtDate(nt.d))+', dans votre carnet.</p></div>';
}
/* Après une absence de 10 jours ou plus, un mot simple. Rien n'est en retard. */
function revoila(){
  if(state.abs===undefined){const d=D();const av=d.vu||'';const j=todayIso();state.abs=!!av&&av!==j&&(Date.parse(j)-Date.parse(av))/86400000>=10;if(d.onboarded&&av!==j){d.vu=j;save();}}
  return state.abs?'<p class="revoila">Vous revoilà. Ici, rien n’est en retard, et ce que vous avez écrit vous attend.</p>':'';
}
function viewApercu(){
  const s=apEtape(),a=state.ap,k=Math.max(0,Math.min(3,a.k||0));const steps=allSteps();const sv=steps[s.idx+1];
  const fil='<ol class="ap-fil" aria-label="Les 4 moments de cet essai">'+AP_TITRES.map((t,i)=>'<li'+(i===k?' aria-current="step"':'')+' class="'+(i<k?'ap-fait':i===k?'ap-ici':'')+'"><span>'+(i+1)+'</span><b>'+t+'</b></li>').join('')+'</ol>';
  const idee=Array.isArray(s.idee)?s.idee:[s.idee];
  let corps='';
  if(k===0)corps='<div class="f-tete"><span class="label">Une vraie étape du parcours, en 3 minutes</span><h1 class="t1">'+esc(s.t)+'</h1><p class="sub">Voici l’étape '+(s.idx+1)+' du parcours, en plus court. Vous repartez avec un geste à vous, même si vous vous arrêtez là.</p></div>'+fil+
    '<p class="lecture-l">'+esc(idee[0])+'</p>'+
    schHtml('vague')+
    '<div class="ap-suite"><button type="button" class="btn primary wide" data-act="ap" data-k="1">Choisir mon geste '+I.chev+'</button></div>';
  else if(k===1)corps='<div class="f-tete"><span class="label">Essai du parcours, étape '+(s.idx+1)+'</span><h1 class="t1">Votre geste, quand la vague monte</h1></div>'+fil+
    '<div class="mots-a"><div class="from"><span class="av" aria-hidden="true">A</span><div><b>Ce que j’ai vécu</b><small>Antonio</small></div></div><p>'+esc(Array.isArray(s.vecu)?s.vecu[0]:s.vecu)+'</p></div>'+
    '<p class="ap-consigne">'+esc(s.exo)+'</p>'+
    '<div class="ap-gestes" role="group" aria-label="Choisir un geste">'+AP_GESTES.map(g=>'<button type="button" class="ap-g" data-act="ap-g" data-v="'+g[0]+'" aria-pressed="'+(a.g===g[0])+'"><span class="resp-p" aria-hidden="true"></span><b>'+g[1]+'</b></button>').join('')+'</div>'+
    '<div class="field"><label for="ap-mot">'+esc(s.ecr)+'</label><textarea id="ap-mot" maxlength="'+LIM.note+'" placeholder="Vous pouvez aussi l’écrire avec vos mots.">'+esc(a.mot||'')+'</textarea></div>'+
    '<div class="ap-suite"><button type="button" class="btn primary wide" data-act="ap-garde">'+I.note+'Garder ce geste dans mon carnet</button><p class="hint">Votre geste reste sur votre appareil. Personne d’autre ne le lit.</p></div>';
  else if(k===2){const nt=noteDe(s.id);const avant=nt&&nt.d!==todayIso();
    corps='<div class="f-tete"><span class="label">Essai du parcours, étape '+(s.idx+1)+'</span><h1 class="t1">'+(avant?'Votre geste vous attendait':'C’est gardé dans votre carnet')+'</h1></div>'+fil+
    '<article class="carnet-p"><span class="label">Mon carnet de route, étape '+(s.idx+1)+'</span><p class="q">'+esc(s.ecr)+'</p><p class="ecrit">'+(nt?nl2(nt.t):'')+'</p><span class="hint">'+(nt?'Écrit le '+esc(fmtDate(nt.d)):'')+'</span></article>'+
    '<p class="lecture-l">'+(avant?'Vous pouvez le relire, le compléter dans votre carnet, ou voir ce que la suite du parcours vous apporterait.':'Vous retrouvez cette page quand vous voulez, dans « Parcours », puis « Mon carnet ». Un jour de tempête, c’est là que votre geste vous attend.')+'</p>'+
    (a.g==='souffle'?'<button type="button" class="btn wide" data-act="exo" data-id="breath">'+I.wind+'L’essayer maintenant avec « Souffler 2 minutes »</button>':'')+
    '<div class="ap-suite"><button type="button" class="btn primary wide" data-act="ap" data-k="3">Voir la semaine prochaine '+I.chev+'</button><button type="button" class="btn wide" data-act="go" data-view="carnet">'+I.note+'Ouvrir mon carnet</button></div>';}
  else{
    const deja=can('parcours');
    corps='<div class="f-tete"><span class="label">Essai du parcours</span><h1 class="t1">Ce que vous retrouvez la semaine prochaine</h1></div>'+fil+
    '<ol class="ap-semaine"><li><b>Votre geste, dans votre carnet.</b><span>Vous le relisez, et vous pouvez le compléter après l’avoir essayé.</span></li>'+
      (sv?'<li><b>Une nouvelle étape, « '+esc(sv.t)+' ».</b><span>'+esc(sv.acc||'')+'</span></li>':'')+
      '<li><b>La même forme, chaque semaine.</b><span>Vous comprenez une idée, vous l’essayez chez vous et vous écrivez quelques mots. Si vous vous absentez, rien ne s’accumule.</span></li></ol>'+
    (deja?'<div class="offre"><p class="f-benef">Vous avez déjà Le parcours.</p><button type="button" class="btn primary wide" data-act="go" data-view="parcours">'+I.path+'Ouvrir mon parcours</button></div>':
      '<section class="offre" aria-labelledby="offre-t"><div class="f-haut"><h2 id="offre-t">Le parcours</h2><p class="f-prix"><b>84 CHF</b> <small>en tout</small></p></div><p class="f-benef">'+F_TXT.parcours.b+'</p>'+
      payerParcours('apercu')+
      '<p class="f-note">24 étapes guidées, une par semaine, pendant 6 mois. Une fois acheté, le parcours reste ouvert sans limite de durée.</p>'+
      '<p class="demo-paie">'+I.info+'<span>'+DEMO_PAIE+'</span></p></section>'+
      '<div class="ap-suite"><button type="button" class="btn wide" data-act="entrer" data-v="parcours">Continuer gratuitement avec l’étape 1</button><button type="button" class="lien-f" data-act="go" data-view="plans">Voir les 3 offres</button></div>');
  }
  return '<main id="main" tabindex="-1" class="view v-feuille v-apercu ap-'+k+'"><div class="feuille">'+corps+'</div></main>';
}

/* ---------- la commande, en démonstration ---------- */
/* Les écrans d'une vraie commande, sans paiement : le récapitulatif avec les dates et les montants, puis l'issue que l'on choisit de voir.
   Seul « paiement accepté » ouvre ce qui a été acheté. S'y ajoutent 2 écrans à part : retrouver un achat, et offrir à un parent (une maquette). */
function achete(f,m){
  const d=D(),A=achats();
  if(f==='parcours'){d.tier='parcours';A.parcours={m:m==='six'?'six':'une',le:todayIso(),n:1};}
  else if(f==='relais')A.relais={le:todayIso()};
  entrer('achat');save();
}
function viewCommande(){
  const c=state.cmd||{},e=c.k||'recap';const f=PRODUITS[c.f]?c.f:'parcours',P=PRODUITS[f],X=F_TXT[f],six=f==='parcours'&&c.m==='six';
  const demo='<p class="demo-paie demo-fort">'+I.info+'<span>Ceci est une démonstration. Aucun montant réel n’est débité, et aucune carte n’est demandée.</span></p>';
  const tete=(l,t,s)=>'<div class="f-tete"><span class="label">'+l+'</span><h1 class="t1">'+t+'</h1>'+(s?'<p class="sub">'+s+'</p>':'')+'</div>';
  let corps='';
  if(e==='retrouver')corps=tete('Démonstration','Retrouver un achat','Vous avez changé d’appareil, ou effacé les données de votre navigateur ? Votre achat, lui, n’est pas perdu.')+demo+
      '<div class="cmd-recap"><p class="f-benef">Dans la vraie version, vous écrirez ici l’adresse e-mail utilisée pour l’achat.</p><ul><li>Vous recevrez un lien par e-mail, et ce lien rouvrira votre achat sur cet appareil.</li><li>Vos écrits, eux, ne voyagent pas avec l’achat. Pour les emporter, utilisez « Sauvegarder mes écrits ».</li></ul></div>'+
      '<section class="cmd-paie"><h2>Pour l’essai</h2><p>Choisissez l’achat que ce lien rouvrirait.</p><div class="ap-suite"><button type="button" class="btn primary wide" data-act="cmd" data-v="retrouve" data-f="parcours">Simuler le lien pour Le parcours</button><button type="button" class="btn primary wide" data-act="cmd" data-v="retrouve" data-f="relais">Simuler le lien pour Passer le relais</button><button type="button" class="btn ghost wide" data-act="go" data-view="plans">Revenir aux offres</button></div></section>';
  else if(e==='retrouve')corps=tete('Démonstration','Votre achat est rouvert.',esc(P.t)+' est de nouveau ouvert sur cet appareil.')+demo+
      '<div class="ap-suite">'+(f==='relais'?'<button type="button" class="btn primary wide" data-act="rl" data-k="ouvre">'+I.hand+'Ouvrir Passer le relais</button>':'<button type="button" class="btn primary wide" data-act="go" data-view="parcours">'+I.path+'Ouvrir mon parcours</button>')+'<button type="button" class="btn wide" data-act="rl" data-k="sauver">'+I.download+'Restaurer mes écrits depuis un fichier</button></div>';
  else if(e==='cadeau')corps=tete('Maquette','Offrir à un parent','Vous payez une fois. Le parent reçoit un lien et active son cadeau quand il le souhaite.')+demo+
      '<div class="f-payer" role="group" aria-label="Choisir ce que vous offrez"><button type="button" class="btn f-mode" data-act="cadeau" data-v="parcours" aria-pressed="'+(f==='parcours')+'"><b>Le parcours</b><span>84 CHF, en une fois</span></button><button type="button" class="btn f-mode" data-act="cadeau" data-v="relais" aria-pressed="'+(f==='relais')+'"><b>Passer le relais</b><span>49 CHF, une seule fois</span></button></div>'+
      '<div class="cmd-recap"><p class="f-benef">'+X.b+'</p><ul><li>Le cadeau donne accès à '+esc(P.t)+', en entier.</li><li>Vous ne saurez ni quand le parent l’ouvre, ni ce qu’il y écrit. Ses écrits restent sur son appareil.</li><li>Le parent n’a rien à payer et aucun compte à créer.</li></ul></div>'+
      '<div class="ap-suite"><button type="button" class="btn primary wide" data-act="cmd" data-v="cadeau-ok">Simuler l’achat du cadeau</button><button type="button" class="btn ghost wide" data-act="go" data-view="plans">Revenir aux offres</button></div>';
  else if(e==='cadeau-ok'){const lien=PUBLIC+'#cadeau-'+f;
    corps=tete('Maquette','Votre cadeau est prêt.','Transmettez ce lien au parent, avec un mot de vous.')+demo+
      '<div class="field"><label for="cad-lien">Le lien du cadeau, à copier</label><input type="text" id="cad-lien" readonly value="'+esc(lien)+'"><p class="hint">Dans la vraie version, ce lien portera un code qui ne sert qu’une fois.</p></div>'+
      '<div class="ap-suite"><button type="button" class="btn primary wide" data-act="cadeau-envoi">'+I.share+'Envoyer le lien</button><button type="button" class="btn wide" data-act="cadeau-voir" data-v="'+f+'">Voir ce que le parent verra</button><button type="button" class="btn ghost wide" data-act="go" data-view="plans">Revenir aux offres</button></div>';}
  else if(e==='activer')corps=tete('Un cadeau pour vous','Quelqu’un vous offre '+esc(P.t)+'.',X.b)+demo+
      '<div class="cmd-recap"><ul><li>Vous l’activez quand vous voulez. Rien ne presse.</li><li>La personne qui vous l’offre ne voit rien de ce que vous faites ici.</li><li>Vous n’avez rien à payer et aucun compte à créer.</li></ul></div>'+
      '<div class="ap-suite">'+(can(f)?'<button type="button" class="btn wide" data-act="rien" aria-disabled="true">'+I.check+'Vous l’avez déjà</button>':'<button type="button" class="btn primary wide" data-act="cmd" data-v="active">'+I.star+'Activer mon cadeau</button>')+'<button type="button" class="btn ghost wide" data-act="entrer" data-v="today">Plus tard</button></div>';
  else if(e==='ok'||e==='active'){const A=achats();
    corps=tete(e==='active'?'Votre cadeau':'Démonstration',e==='active'?'Votre cadeau est activé.':'C’est confirmé.',esc(P.t)+' est à vous.')+demo+
      '<div class="cmd-recap"><p class="f-benef">'+(f==='relais'?'L’outil est ouvert, pour toute la famille.':'Votre parcours est ouvert.')+'</p><ul>'+(f==='relais'?'<li>Vous pouvez envoyer votre fiche, l’imprimer et la retrouver la prochaine fois.</li><li>Vous n’aurez rien d’autre à payer.</li>':'<li>Une étape s’ouvre chaque semaine, 7 jours après la précédente.</li><li>Votre carnet garde ce que vous écrivez, sur votre appareil.</li>'+(six&&e==='ok'?'':'<li>Vous n’aurez rien d’autre à payer.</li>'))+'<li>Ce que vous avez acheté reste ouvert sans limite de durée.</li></ul></div>'+
      (six&&e==='ok'&&A.parcours?'<section class="cmd-ech"><h2>Vos 6 mensualités</h2>'+echeancesHtml(A.parcours.le,A.parcours.n)+'</section>':'')+
      '<p class="hint">Pour retrouver cet achat sur un autre appareil, vous recevrez un lien par e-mail dans la vraie version. Ici, « Retrouver un achat » en montre le principe.</p>'+
      '<div class="ap-suite">'+(f==='relais'?'<button type="button" class="btn primary wide" data-act="rl" data-k="reprise">'+I.hand+(rlFiche(state.rl.id)?'Revenir à ma fiche':'Ouvrir Passer le relais')+'</button>':'<button type="button" class="btn primary wide" data-act="go" data-view="parcours">'+I.path+'Ouvrir mon parcours</button>')+'</div>';}
  else if(e==='refus')corps=tete('Démonstration','Le paiement n’a pas abouti.','Rien n’a été débité, et rien n’a changé dans votre espace.')+demo+
      '<div class="cmd-recap"><p class="f-benef">Dans la vraie version, vous pourrez réessayer ou choisir un autre moyen de paiement.</p><p class="f-note">Tout ce qui est gratuit reste ouvert, et ce que vous avez écrit est toujours là.</p></div>'+
      '<div class="ap-suite"><button type="button" class="btn primary wide" data-act="cmd" data-v="recap">Réessayer</button><button type="button" class="btn wide" data-act="go" data-view="plans">Revenir aux offres</button></div>';
  else if(e==='abandon')corps=tete('Démonstration','Vous avez arrêté avant de payer.','Rien n’a été débité, et rien n’a changé dans votre espace.')+demo+
      '<div class="ap-suite"><button type="button" class="btn primary wide" data-act="go" data-view="plans">Revenir aux offres</button><button type="button" class="btn wide" data-act="cmd" data-v="recap">Reprendre la commande</button></div>';
  else{
    const auj=dateLongue(todayIso());
    corps=tete('Démonstration de commande','Votre commande','')+demo+
      '<div class="cmd-recap"><div class="f-haut"><h2>'+esc(P.t)+'</h2><p class="f-prix"><b>'+P.p+' CHF</b> <small>'+(f==='relais'?'une seule fois':'en tout')+'</small></p></div><p class="f-benef">'+X.b+'</p><ul>'+X.c.slice(0,3).map(x=>'<li>'+x+'</li>').join('')+'</ul></div>'+
      (f==='parcours'?'<section class="cmd-mode" aria-labelledby="cmd-mode-t"><h2 id="cmd-mode-t">Votre façon de payer</h2><div class="f-payer" role="group" aria-labelledby="cmd-mode-t"><button type="button" class="btn f-mode" data-act="cmd-mode" data-v="une" aria-pressed="'+(!six)+'"><b>En une fois</b><span>84 CHF aujourd’hui</span></button><button type="button" class="btn f-mode" data-act="cmd-mode" data-v="six" aria-pressed="'+six+'"><b>En six fois</b><span>14 CHF aujourd’hui, puis 5 mensualités de 14 CHF</span></button></div>'+
        (six?echeancesHtml(todayIso(),0)+'<p class="f-note">En choisissant ce paiement, vous achetez le parcours complet. Les 6 mensualités sont dues.</p>':'<ol class="ech"><li><span>Aujourd’hui, le '+esc(auj)+'</span><b>84 CHF</b></li><li class="ech-total"><span>Total</span><b>84 CHF</b></li></ol><p class="f-note">Ensuite, plus rien n’est prélevé.</p>')+
        '<p class="f-total">'+TOTAL_84+'</p></section>':
        '<section class="cmd-mode"><h2>Ce que vous payez</h2><ol class="ech"><li><span>Aujourd’hui, le '+esc(auj)+'</span><b>49 CHF</b></li><li class="ech-total"><span>Total</span><b>49 CHF</b></li></ol><p class="f-note">Ensuite, plus rien n’est prélevé. Il n’y a ni abonnement ni renouvellement.</p></section>')+
      '<section class="cmd-garde"><h2>Ce que vous gardez</h2><ul class="list"><li>'+esc(P.t)+' reste ouvert sans limite de durée.</li><li>'+(f==='relais'?'Vos fiches restent sur votre appareil. Vous pouvez les envoyer, les imprimer et les sauvegarder dans un fichier.':'Votre carnet reste sur votre appareil. Vous pouvez le sauvegarder dans un fichier et imprimer « Mon chemin ».')+'</li></ul></section>'+
      '<section class="cmd-paie"><h2>Le paiement</h2><p>Dans la vraie version, vous paierez ici, auprès d’un prestataire de paiement. Il n’est pas encore choisi. Pour l’essai, choisissez l’issue que vous voulez voir.</p>'+
      '<div class="ap-suite"><button type="button" class="btn primary wide" data-act="cmd" data-v="ok">Simuler un paiement accepté</button><button type="button" class="btn wide" data-act="cmd" data-v="refus">Simuler un paiement refusé</button><button type="button" class="btn ghost wide" data-act="cmd" data-v="abandon">Abandonner la commande</button></div></section>';
  }
  return '<main id="main" tabindex="-1" class="view v-feuille commande cde-'+e+'"><div class="feuille">'+corps+'</div></main>';
}
/* Ce que le parent a acheté, pour l'écran « Moi ». Dans la version d'essai, on peut y faire avancer les mensualités pour voir qu'elles s'arrêtent à la sixième. */
function achatsHtml(){
  const A=achats(),p=A.parcours,r=A.relais;const E=p&&p.m==='six'?echeances(p.le):null;const n=p?Math.min(NB_ECH,p.n||1):0;
  return '<div class="card mes-achats"><span class="label">Mes achats</span>'+
    '<div class="kv"><span>Découverte</span><span>ouverte, gratuite</span></div>'+
    '<div class="kv"><span>Le parcours</span><span>'+(p?(p.m==='six'?(n>=NB_ECH?'payé, 6 mensualités sur 6':n+' mensualité'+(n>1?'s':'')+' sur 6'):'payé en une fois'):'pas acheté')+'</span></div>'+
    (p&&E&&n<NB_ECH?'<p class="hint">La prochaine mensualité de 14 CHF est celle du '+esc(dateLongue(E[n]))+'. La dernière est celle du '+esc(dateLongue(E[NB_ECH-1]))+'.</p>':'')+
    (p&&E&&n>=NB_ECH?'<p class="hint">Les 6 mensualités sont payées. Plus rien ne sera prélevé.</p>':'')+
    '<div class="kv"><span>Passer le relais</span><span>'+(r?'acheté, 49 CHF':'pas acheté')+'</span></div>'+
    (ESSAI&&p&&E&&n<NB_ECH?'<button type="button" class="btn small" data-act="ech-suite" style="align-self:flex-start">Simuler la mensualité suivante</button>':'')+
    '<div class="row"><button type="button" class="btn'+(p&&r?'':' primary')+'" data-act="go" data-view="plans">'+I.tag+'Voir les 3 offres</button></div>'+
    (ESSAI&&(p||r)?'<button type="button" class="lien-f" data-act="achats-zero">Annuler mes achats de démonstration</button>':'')+'</div>';
}
/* Ce que cet appareil a compté, pour la carte « Version d'essai » de l'écran « Moi ». */
function reperesHtml(){
  const c=com(),a=c.ach||{},u=c.us||{};const dit=k=>a[k]?(k==='parcours'?(a[k].m==='six'?'en six fois':'en une fois')+', ':'')+'le '+fmtDate(a[k].d):'aucun';
  const rev=k=>Array.isArray(u[k])&&u[k].length>1?'oui, le '+fmtDate(u[k][1]):Array.isArray(u[k])&&u[k].length?'pas encore':'';
  const l=[['Essai du parcours terminé',c.ap?'le '+fmtDate(c.ap):'pas encore'],['Achat du parcours',dit('parcours')],['Achat de Passer le relais',dit('relais')]];
  if(a.parcours)l.push(['Retour sur le parcours, un autre jour',rev('parcours')||'pas encore']);
  if(a.relais)l.push(['Retour sur Passer le relais, un autre jour',rev('relais')||'pas encore']);
  return '<div class="reperes"><span class="label">Les 3 mesures du lancement, sur cet appareil</span>'+l.map(x=>'<div class="kv"><span>'+x[0]+'</span><span>'+esc(x[1])+'</span></div>').join('')+'<p class="hint">Ces mesures ne contiennent ni vos écrits, ni vos humeurs, ni votre situation. Dans cette version d’essai, elles restent sur votre appareil et rien n’est envoyé. Les achats sont des démonstrations.</p></div>';
}

function sheetUpgrade(sheetIn){
  const u=UP[state.upFeat]||UP.parcours;
  /* La feuille ne vend pas : elle propose d'essayer d'abord, puis de voir les offres. */
  return '<div class="backdrop" data-act="sheet-close"></div><div class="sheet'+(sheetIn?' in':'')+'" role="dialog" aria-modal="true" aria-labelledby="up-title" tabindex="-1"><div class="sheet-in"><div class="grab"></div><span class="label">'+I.lock+' Fait partie du Parcours</span><h2 id="up-title" class="t2" style="font-family:var(--font-display);font-weight:500">'+esc(u.t)+'</h2><p>'+esc(u.s)+'</p>'+
    '<button type="button" class="btn primary wide" data-act="apercu">'+I.path+'Essayer une étape, en 3 minutes</button>'+
    '<button type="button" class="btn wide" data-act="go" data-view="plans">Voir les 3 offres et les prix</button>'+
    '<button type="button" class="btn ghost wide" data-act="sheet-close">Plus tard</button><p class="hint" style="text-align:center">'+DEMO_PAIE+'</p></div></div>';
}

/* ---------- une page à transmettre ---------- */
/* Une association ou un professionnel peut envoyer cette page à une famille. Elle parle au parent, lui propose une seule chose à faire tout de suite,
   et donne à la personne qui transmet une phrase toute prête. */
const TRANSMETTRE_MOT='Je vous transmets cette page parce qu’on vous demande souvent comment va votre enfant, et plus rarement comment vous allez, vous. Ici, on commence par vous. C’est gratuit pour commencer, sans compte, et vous pouvez y souffler 2 minutes dès maintenant.';
function viewTransmettre(){
  const url=PUBLIC+'transmettre/';
  return '<main id="main" tabindex="-1" class="view v-feuille v-transmettre"><div class="feuille">'+
    '<div class="f-tete"><span class="label">Quelqu’un qui vous accompagne vous a transmis cette page</span><h1 class="t1">On vous demande souvent comment va votre enfant. Ici, on commence par vous.</h1></div>'+
    '<p class="lecture-l">Parent écouté, parent éclairé est un espace pour la mère ou le père d’une personne en situation de handicap, quel que soit son âge, tout-petit ou adulte depuis longtemps. Il a été créé par Antonio Company, éducateur social, responsable d’une équipe socio-éducative et père de 3 enfants.</p>'+
    '<p class="lecture-l">Vous pouvez commencer par 2 minutes pour vous, tout de suite. C’est gratuit, sans compte, et rien de ce que vous écrivez ne quitte votre appareil.</p>'+
    '<div class="ap-suite"><button type="button" class="btn primary wide" data-act="porte" data-v="souffle">'+I.wind+'Souffler 2 minutes, maintenant</button></div>'+
    '<section class="tr-suite" aria-labelledby="tr-suite-t"><h2 id="tr-suite-t">Ensuite, si vous le souhaitez</h2><ul class="tr-liens"><li><a class="lien-f" href="'+RACINE+'fiches/" data-act="fiches">'+I.kit+'Ouvrir une fiche pratique</a><span>Sur le coucher, les crises, l’école ou la vie en foyer.</span></li><li><button type="button" class="lien-f" data-act="apercu">'+I.path+'Essayer une vraie étape du parcours</button><span>En 3 minutes, sans rien créer.</span></li><li><button type="button" class="lien-f" data-act="rl" data-k="exemple">'+I.eye+'Voir un exemple de fiche de relais</button><span>Pour confier votre enfant à un proche.</span></li></ul></section>'+
    '<section class="tr-pro" aria-labelledby="tr-pro-t"><h2 id="tr-pro-t">Vous accompagnez des familles ?</h2><p>Vous pouvez transmettre cette page telle quelle, par message ou sur papier. Voici une phrase pour l’accompagner, à adapter avec vos mots.</p>'+
      '<blockquote class="tr-mot"><p>'+esc(TRANSMETTRE_MOT)+'</p></blockquote>'+
      '<div class="ap-suite"><button type="button" class="btn wide" data-act="tr-copie">'+I.share+'Copier la phrase et le lien</button></div>'+
      '<div class="field"><label for="tr-lien">Le lien de cette page</label><input type="text" id="tr-lien" readonly value="'+esc(url)+'"></div>'+
      '<ul class="list"><li>Cet espace ne remplace ni un suivi, ni un médecin, ni un thérapeute.</li><li>Il ne demande aucun diagnostic et ne crée aucun compte.</li><li>Ce que le parent écrit reste sur son appareil. Rien n’est enregistré sur un serveur.</li><li>Commencer est gratuit. Il existe 2 outils payants, sans abonnement, et le parent les découvre seulement s’il le souhaite.</li></ul>'+
      (CONTACT_R?'<p class="hint">Une question avant de transmettre ? Écrivez à '+esc(contact())+'.</p>':'')+'</section>'+
    '</div></main>';
}

/* ---------- une seule suite logique au bas d'une fiche ---------- */
/* Après la fiche sur les crises, l'essai d'une étape du parcours. Après une fiche qui parle de relais, l'outil « Passer le relais ».
   Après une fiche sur les réunions, la préparation d'une réunion. Ces cartes ne parlent pas de prix. Les autres fiches n'en ont pas. */
function suiteFiche(s){
  if(s.id==='crise')return '<div class="vers-apercu"><h2>Et vous, quand la vague monte ?</h2><p>Une étape du parcours vous aide à traverser ce moment sans rien casser. Vous pouvez l’essayer maintenant, en 3 minutes.</p><button type="button" class="btn" data-act="apercu">'+I.path+'Essayer cette étape</button></div>';
  if(['relais','aide','loin'].includes(s.id))return '<div class="vers-apercu vers-relais"><h2>Une page pour la personne qui prend le relais</h2><p>Vous choisissez 3 repères, avec vos mots, et votre proche les lit en 1 minute. Vous pouvez voir une fiche terminée avant de rien écrire.</p><button type="button" class="btn" data-act="rl" data-k="exemple">'+I.eye+'Voir un exemple de fiche terminée</button></div>';
  if(['pros','ecole'].includes(s.id))return '<div class="vers-apercu vers-relais"><h2>Arriver à la réunion avec vos mots</h2><p>L’outil « Passer le relais » vous aide aussi à préparer un rendez-vous, avec vos 3 priorités sous les yeux et un bouton « Je perds mes mots ».</p><button type="button" class="btn" data-act="rl" data-k="ouvre">'+I.hand+'Découvrir l’outil</button></div>';
  return '';
}
/* Le lien WhatsApp d'une fiche publique : le titre de la fiche et son adresse, rien d'autre. */
function waUrl(s){return 'https://wa.me/?text='+encodeURIComponent('« '+s.t+' », une fiche courte à lire. '+ficheUrl(s.id,true));}

/* ---------- avec Antonio ---------- */
function viewAntonio(){
  const d=D();const L=d.letters.slice().reverse();const Q=d.questions.slice().reverse();const ql=questionsLeft();
  return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">Mes échanges avec Antonio</h1><p class="sub">Un travailleur social qui vous connaît sans que vous ayez à tout raconter, parce qu’il lit ce que vous choisissez de partager.</p></div>'+
    (DEMO?'<div class="demo-note"><b>Démonstration.</b> Dans cette version de test, rien n’est transmis à Antonio. Vos questions et vos dépôts cochés restent sur votre appareil, et le mot comme la réponse affichés ici sont des exemples. Les vrais échanges commenceront à l’ouverture des abonnements.</div>':'')+
    '<div class="card sun"><div class="kv"><span>Le mot d’Antonio</span><span>'+(DEMO?'le 1er de chaque mois':esc(nextLetterDate()))+'</span></div><div class="kv"><span>Dépôts cochés ce mois</span><span>'+sharedThisMonth()+'</span></div><div class="kv"><span>Questions restantes ce mois</span><span>'+ql+' sur '+Q_PER_MONTH+'</span></div><p class="hint">Pour partager un dépôt, cochez « Partager avec Antonio » sous le dépôt. Antonio lit seulement ce que vous cochez et les questions que vous lui envoyez.</p></div>'+
    (ql>0?'<div class="card"><label class="label" for="qdraft">Poser une question à Antonio</label><textarea id="qdraft" maxlength="'+LIM.q+'" placeholder="Décrivez une situation, une décision ou un doute, sans donner de prénom." style="min-height:90px">'+esc(state.qdraft)+'</textarea><button type="button" class="btn primary" data-act="qsend" style="align-self:flex-start">'+I.send+(DEMO?'Enregistrer ma question':'Envoyer ma question')+'</button></div>':'<div class="card"><span class="label">Poser une question à Antonio</span><p>Vos deux questions du mois sont posées. Vous pourrez en poser à nouveau le '+esc(nextLetterDate())+'. En attendant, « Déposer » reste ouvert.</p></div>')+
    (Q.length?Q.map(q=>'<div class="qa"><span class="st">'+esc(fmtDate(q.date))+(q.answer?', réponse d’Antonio le '+esc(fmtDate(q.answeredAt)):(DEMO?', gardée sur votre appareil et non transmise (version de test)':', en attente d’une réponse sous 48 h'))+'</span><p class="q">'+esc(q.text)+'</p>'+(q.answer?'<p class="a">'+esc(q.answer)+'</p>':'')+(q.risk?riskHtml('hint'):'')+'</div>').join(''):'')+
    ((DEMO||!Q.length)?'<div class="qa"><span class="st">Exemple de question et de réponse</span><p class="q">'+esc(QA_EXAMPLE.q)+'</p><p class="a">'+esc(QA_EXAMPLE.a)+'</p></div>':'')+
    '<div><span class="label">Les mots d’Antonio</span></div>'+
    (L.length?L.map((l,i)=>'<button type="button" class="letter" data-act="letter" data-i="'+(d.letters.length-1-i)+'"><div class="from"><span class="av" aria-hidden="true">A</span><div><b>'+esc(MONTHS_FR[Number(l.date.slice(5,7))-1])+'</b><span>'+esc(fmtDate(l.date))+'</span></div></div><p>'+esc(l.text.split('\n')[0])+'</p></button>').join(''):'<button type="button" class="letter" data-act="letter" data-i="-1"><div class="from"><span class="av" aria-hidden="true">A</span><div><b>Exemple de mot</b><span>'+(DEMO?'Démonstration':'Votre premier arrive le '+esc(nextLetterDate()))+'</span></div></div><p>'+esc(LETTER_EXAMPLE.split('\n')[0])+'</p><span class="hint">Lire l’exemple '+I.chev+'</span></button>')+'</main>';
}
function viewLetter(){
  const i=state.letter;const l=i>=0?D().letters[i]:null;const txt=l?l.text:LETTER_EXAMPLE;
  return '<main id="main" tabindex="-1" class="view v-feuille"><div class="feuille f-lettre"><div class="f-tete"><span class="label">'+(l?'Le mot d’Antonio du '+esc(fmtDate(l.date)):'Un exemple de ce que sera le mot d’Antonio')+'</span><h1 class="t1">'+(D().me?'Bonjour '+esc(D().me)+',':'Bonjour,')+'</h1></div>'+
    '<div class="mots-a mots-grand">'+txt.split('\n').map(p=>'<p>'+esc(p)+'</p>').join('')+'<div class="from" style="margin-top:6px"><span class="av" aria-hidden="true">A</span><div><b>Antonio Company</b><small>'+ROLE_A+'</small></div></div></div>'+
    (l?'':'<p class="hint">Ceci est un exemple. Dans la version complète, Antonio écrira ce mot chaque mois à partir des dépôts que vous aurez partagés, de votre humeur et de vos étapes. Il ne citera jamais de prénom et ne posera jamais de diagnostic.</p>')+
    '<div class="quick"><button type="button" class="btn" data-act="porte" data-v="deposer">'+I.drop+'Déposer</button><button type="button" class="btn" data-act="go" data-view="antonio">'+I.question+'Poser une question</button></div></div></main>';
}
/* ---------- données / à propos ---------- */
function consentCard(){
  /* Tant qu'aucun outil de mesure n'est branché sur le site, il n'y a rien à accepter ni à refuser : la carte n'apparaît pas. */
  if(!SITE||!window.PEPEConsent||!window.PEPEConsent.active())return '';
  const c=window.PEPEConsent.get();
  const st=c?(c.audience?'Vous avez accepté la mesure d’audience anonyme le '+esc(fmtDate(c.date))+'.':'Vous avez refusé la mesure d’audience le '+esc(fmtDate(c.date))+'.'):'Vous n’avez pas encore fait de choix.';
  return '<div class="card"><span class="label">Cookies et mesure d’audience</span><p class="hint">Cet espace n’utilise aucun cookie. '+st+' <a href="'+RACINE+'confidentialite.html#cookies">En savoir plus</a></p><div class="row"><button type="button" class="btn small" data-act="consent" data-v="no" aria-pressed="'+(!!c&&!c.audience)+'">Refuser</button><button type="button" class="btn small" data-act="consent" data-v="yes" aria-pressed="'+(!!c&&c.audience)+'">Accepter</button></div></div>';
}
function viewData(){
  const where=state.sample?'Quand vous déposez, votre texte est envoyé sans votre nom à une intelligence artificielle, qui écrit la réponse. L’application, elle, ne le garde que sur cet appareil.':'Dans cette version, rien de ce que vous écrivez n’est envoyé, ni à un serveur ni à Antonio.';
  return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">Vos données</h1><p class="sub">Vos dépôts, vos points et vos notes restent sur cet appareil. '+where+'</p></div>'+
    '<div class="card green"><span class="label">Bon à savoir</span><p class="hint">Vos dépôts ne sont pas protégés par un mot de passe. Si vous prêtez cet appareil, verrouillez-le ou effacez d’abord vos notes. Sachez aussi que si vous effacez les données de votre navigateur, vos notes sont perdues, sauf si vous en avez gardé une copie.</p></div>'+
    '<div class="card"><span class="label">Garder une copie</span><p class="hint">Vous pouvez sauvegarder tous vos écrits dans un fichier, sur votre appareil, puis les restaurer plus tard ou sur un autre appareil. Rien n’est envoyé.</p><button type="button" class="btn" data-act="rl" data-k="sauver" style="align-self:flex-start">'+I.download+'Sauvegarder ou restaurer mes écrits</button></div>'+
    '<div class="card"><span class="label">Recommencer depuis le début</span><p class="hint">Ce bouton efface tout ce qui est sur cet appareil, c’est-à-dire votre prénom, vos dépôts, vos étapes, votre carnet et vos points, puis il rouvre l’écran d’accueil et le questionnaire de départ. C’est utile pour faire tester l’application à une autre personne sur votre appareil.</p>'+(state.confirmReset?'<div class="confirm" role="alert"><span>Effacer tout le contenu sur cet appareil ?</span><div class="row"><button type="button" class="btn danger" data-act="reset-yes">Oui, effacer</button><button type="button" class="btn" data-act="reset-no">Annuler</button></div></div>':'<button type="button" class="btn danger" data-act="reset" style="align-self:flex-start">'+I.trash+'Tout effacer et recommencer</button>')+'</div>'+
    consentCard()+
    '<div class="card"><span class="label">Pour les tests</span><p class="hint">Vous pouvez aussi ajouter <b>?nouveau</b> à la fin de l’adresse. L’application repart alors de zéro sur cet appareil.</p></div></main>';
}
function viewAbout(){
  const peek=!D().onboarded;
  return '<main id="main" tabindex="-1" class="view v-feuille histoire" style="padding-top:0">'+
    '<div class="band story bleed" style="background-image:url('+HERO+')"><h1 class="t1">Avant d’accompagner des familles, j’ai moi-même été accueilli dans une famille.</h1></div>'+
    '<div class="feuille f-histoire"><div class="story">'+
    '<p>Je m’appelle Antonio. Avant de vous proposer cet espace, j’aimerais vous raconter un peu mon histoire, pour que vous sachiez qui est derrière.</p>'+
    '<ul class="places">'+
    '<li><h2>À dix ans</h2><p>J’ai été placé dans une famille d’accueil. Mes parents d’accueil sont devenus mon pilier et aujourd’hui encore, je les appelle Mami et Papi.</p><p>C’est chez eux que j’ai compris qu’une famille peut se construire autrement que ce qu’on avait prévu.</p></li>'+
    '<li><h2>À 19 ans</h2><p>J’ai commencé à travailler dans le social et je n’ai jamais arrêté. Cela fait maintenant plus de vingt ans. J’ai toujours accompagné des personnes en situation de handicap, avec ou sans troubles du comportement, et j’ai côtoyé leurs familles. Je me suis formé au fil des années et aujourd’hui, je forme à mon tour des apprentis. Je suis aussi responsable d’une équipe socio-éducative.</p><p>Pendant toutes ces années, j’ai rencontré beaucoup de parents. Beaucoup se sentent seuls, pas toujours compris, fatigués, et ils portent souvent de la culpabilité. Le regard des autres pèse aussi.</p><p class="big">Je me suis souvent dit qu’on s’occupe beaucoup de l’enfant, mais très peu du parent.</p></li>'+
    '<li><h2>À la maison</h2><p>Je suis père de trois enfants. Un de mes fils est né avec une cataracte congénitale et un autre a eu un retard de langage. Je sais ce que c’est quand la santé ou le développement d’un enfant prend beaucoup de place dans la vie d’une famille.</p><p>Dans ces moments-là, j’étais avant tout un papa, avec les mêmes questions que vous.</p></li>'+
    '</ul>'+
    '<p>Tout ce parcours m’a fait comprendre à quel point la présence de quelqu’un qui écoute et qui soutient peut tout changer.</p>'+
    '<div class="avec">'+
    '<p>On parle souvent d’ouverture à la différence. Moi, je préfère dire qu’on avance avec elle.</p>'+
    '<svg class="rings" viewBox="0 0 320 112" aria-hidden="true" focusable="false"><path class="drop" d="M160 8c5 9 8 14 8 19a8 8 0 0 1-16 0c0-5 3-10 8-19z"/><ellipse cx="160" cy="76" rx="30" ry="8" stroke-opacity=".95" stroke-width="1.7"/><ellipse cx="160" cy="76" rx="76" ry="19" stroke-opacity=".6" stroke-width="1.4"/><ellipse cx="160" cy="76" rx="132" ry="32" stroke-opacity=".34" stroke-width="1.1"/></svg>'+
    '<ul class="verbs"><li><b>Composer</b> <span>avec la différence</span></li><li><b>Apprendre</b> <span>avec la différence</span></li><li><b>Évoluer</b> <span>avec la différence</span></li></ul>'+
    '<p class="punch">C’est ce que j’essaie de faire chaque jour, au travail comme à la maison.</p>'+
    '</div>'+
    '<h2 class="chap">Ce que je crois</h2>'+
    '<p>Je crois que chaque parent a en lui des trésors insoupçonnés, et j’aimerais vous aider à retrouver les vôtres et votre pouvoir d’agir.</p>'+
    '<p>Je cours régulièrement et j’aime comparer la vie de parent à un marathon. On ne peut pas le courir au sprint et on a besoin de ravitaillements pour tenir. La dose de lumière que vous recevez chaque jour, je la vois comme un verre d’eau sur le parcours.</p>'+
    '<h2 class="chap">Pourquoi cet espace</h2>'+
    '<p>En février 2025, j’ai imaginé «\u00a0Parent écouté, parent éclairé\u00a0». Au départ, c’était un accompagnement de six mois pour les parents de personnes en situation de handicap. En avril, j’ai voulu l’ouvrir à tous les parents. Cette application, c’est la version que vous pouvez garder dans votre poche.</p>'+
    '<p>Écouté, cela veut dire que vous pouvez déposer librement ce qui vous pèse et être accueilli avec attention et douceur. Éclairé, cela veut dire que vous repartez avec quelque chose qui vous aide à retrouver un peu de paix, de clarté, de recul ou de confiance.</p>'+
    '<p>À l’époque, j’avais écrit ceci.</p>'+
    '<p class="quote">«\u00a0Parce qu’un parent écouté devient un parent éclairé. Et un parent éclairé devient un parent confiant, aligné et pleinement acteur du bien-être de son enfant.\u00a0»</p>'+
    '<p>Si je vous raconte tout cela, c’est pour que vous sachiez d’où vient cet espace. Il vient d’un enfant qui a eu la chance d’être écouté.</p>'+
    '<p>Ici, vous n’avez rien à prouver à personne. Vous pouvez simplement déposer ce qui vous pèse.</p>'+
    '<p>Merci d’avoir pris le temps de me lire.</p>'+
    '<div class="sign"><span class="logo-sceau" role="img" aria-label="Logo de Parent écouté, parent éclairé, une goutte au-dessus de ses 2 ondes.">'+LOGO+'</span><div><b>Antonio Company</b><span>Travailleur social depuis mes 19 ans, responsable d’une équipe socio-éducative, père de trois enfants.</span></div></div>'+
    '</div>'+
    (peek?'<button type="button" class="btn primary wide" data-act="entrer" data-v="today">'+I.sun2+'Commencer gratuitement</button>':'')+
    '<div class="card green"><h2 class="label">Ce que cet espace n’est pas</h2><ul class="list"><li>Ce n’est pas un diagnostic ni une thérapie. Pour cela, il y a votre pédiatre, votre médecin et les thérapeutes.</li><li>Ce n’est pas un service d’urgence. En cas de danger, appelez le '+tel('144')+'. Si vous êtes à bout, appelez le '+tel('143')+'.</li><li>Cela ne remplace pas les personnes qui vous entourent. C’est plutôt un pont vers elles.</li></ul></div><p class="hint">Version de test.</p></div></main>';
}
/* ---------- onglets, feuilles ---------- */
function tabs(){
  const grp={today:['today','deposer'],parcours:['parcours','step','carnet','evo','photo'],kit:['kit','sit','exo','relais'],me:['me','plans','depots','antonio','letter','data','about']};
  const cur=v=>grp[v].includes(state.view)?' aria-current="page"':'';
  return '<nav class="tabs" aria-label="Navigation"><a class="rail-brand" href="'+RACINE+'#accueil" data-act="accueil" aria-label="Parent écouté, parent éclairé. Revenir à l’accueil">'+LOGO+'<span>Parent écouté,<small>parent éclairé</small></span></a><div class="tabs-in">'+(large()?'<a class="tab tab-accueil" href="'+RACINE+'#accueil" data-act="accueil">'+I.home+'Accueil</a>':'')+'<button type="button" class="tab" data-act="go" data-view="today"'+cur('today')+'>'+I.sun2+'Aujourd’hui</button><button type="button" class="tab" data-act="go" data-view="parcours"'+cur('parcours')+'>'+I.path+'Parcours</button><button type="button" class="tab" data-act="go" data-view="kit"'+cur('kit')+'>'+I.kit+'Outils</button><button type="button" class="tab" data-act="go" data-view="me"'+cur('me')+'>'+I.user+'Moi</button></div>'+(large()?'<button type="button" class="sos" data-act="go" data-view="sos">'+I.alert+'SOS</button>':'')+'</nav>';
}
/* « Faisons connaissance » : la personnalisation de l'espace. Elle est facultative, rien n'y est coché à l'avance,
   et les réponses ne sont gardées qu'au moment où le parent touche « Enregistrer » (state.ob est le brouillon). */
function sheetOnboard(sheetIn){
  const d=state.ob||D();const opt=(k,v,l)=>'<button type="button" class="chip" data-act="ob" data-k="'+k+'" data-v="'+v+'" aria-pressed="'+(d[k]===v)+'">'+esc(l)+'</button>';
  const w=(k,l)=>'<button type="button" class="chip" data-act="obw" data-v="'+k+'" aria-pressed="'+(d.weights.includes(k))+'">'+esc(l)+'</button>';
  return '<div class="backdrop" data-act="sheet-close"></div><div class="sheet'+(sheetIn?' in':'')+'" role="dialog" aria-modal="true" aria-labelledby="ob-title" tabindex="-1"><div class="sheet-in"><div class="grab"></div><h2 id="ob-title">Faisons connaissance</h2>'+
    '<p class="hint">Tout est facultatif. Vos réponses servent à vous proposer d’abord ce qui vous concerne, et vous pouvez les changer à tout moment dans « Moi ».</p>'+
    '<div class="field"><label for="ob-me">Votre prénom</label><input type="text" id="ob-me" value="'+esc(d.me)+'" maxlength="'+LIM.me+'" autocomplete="given-name" autocapitalize="words" enterkeyhint="done"></div>'+
    '<div class="field"><span class="flabel" id="ob-l-age">Votre enfant est…</span><div class="chips" role="group" aria-labelledby="ob-l-age">'+opt('age','e','un enfant')+opt('age','a','un ado')+opt('age','g','un adulte')+'</div></div>'+
    '<div class="field"><span class="flabel" id="ob-l-sit">Votre situation</span><div class="chips" role="group" aria-labelledby="ob-l-sit">'+opt('situation','hand','handicap ou besoins particuliers')+opt('situation','diff','une période difficile')+opt('situation','parent','je suis parent, simplement')+'</div></div>'+
    '<div class="field"><span class="flabel" id="ob-l-w">Ce qui pèse le plus en ce moment (plusieurs réponses possibles)</span><div class="chips" role="group" aria-labelledby="ob-l-w">'+WEIGHTS.map(x=>w(x[0],x[1])).join('')+'</div></div>'+
    '<p class="hint">Je ne vous demande pas le prénom de votre enfant, parce que rien de ce qui le concerne ne doit sortir de votre poche.</p>'+
    '<button type="button" class="btn primary wide" data-act="ob-done">'+I.check+'Enregistrer</button><button type="button" class="btn ghost wide" data-act="sheet-close">Fermer sans rien changer</button></div></div>';
}
function mdLite(t){const lines=String(t).split('\n');let out='';let inl=false;for(const raw of lines){const l=raw.replace(/\*\*(.+?)\*\*/g,'$1');if(/^\s*[-•]\s+/.test(l)){if(!inl){out+='<ul class="list">';inl=true;}out+='<li>'+esc(l.replace(/^\s*[-•]\s+/,''))+'</li>';continue;}if(inl){out+='</ul>';inl=false;}if(/^#{1,3}\s/.test(l))out+='<p style="font-weight:800;margin-top:6px;color:var(--green)">'+esc(l.replace(/^#{1,3}\s*/,''))+'</p>';else if(l.trim())out+='<p>'+esc(l)+'</p>';}if(inl)out+='</ul>';return out;}

/* ---------- actions ---------- */
function nav(v){if(state.view==='souffle'&&v!=='souffle')souffleStop();if(state.dire){direGarde();state.dire=null;}state.prev=state.view;state.view=v;state.sheet=null;state.ob=null;state.confirmReset=false;state.confirmEssai=false;state.photoPick=false;state.photoOrder=null;state.pdraft=null;state.lien='';state.piste=false;}
function fxSig(){return [state.view,state.sit,state.exo,state.step,state.kit,state.piste?'piste':'',state.letter,!!D().onboarded,state.view==='photo'?(state.photoPick?'choix':'photo-'+(photoRec().id||'')):'',state.view==='apercu'?'ap'+state.ap.k:'',state.view==='commande'?state.cmd.f+'-'+state.cmd.k:'',state.view==='relais'?'rl-'+state.rl.e+'-'+state.rl.p+'-'+(state.rl.id||'')+'-'+(state.rl.r||''):'',state.view==='deposer'&&state.dire?'dire-'+state.dire.id:''].join('|');}
function handle(act,d,el){
  const data=D();const sig0=fxSig();const sheet0=state.sheet;const view0=state.view;
  switch(act){
    case 'peek-plans':state.prev=null;state.sheet=null;state.view='plans';break;
    case 'peek-about':nav('about');break;
    /* Le premier geste : une porte ouvre l'espace et mène tout de suite à ce qu'elle annonce. Rien n'est demandé avant. */
    case 'porte':{entrer(d.v);
      if(d.v==='souffle'){nav('souffle');SON.voulu=false;souffleStart();}
      else if(d.v==='deposer')nav('deposer');
      else{state.kit='sits';state.q='';nav('kit');state.piste=true;}
      break;}
    /* « Commencer le parcours de 6 mois » ouvre la première étape, comme le dit le bouton. Le parcours entier est la page d'avant : Retour y mène. */
    case 'entrer':{entrer(d.v||'');
      if(d.v==='parcours'&&stepEtat(0).k==='open'){nav('parcours');histPush();const s0=allSteps()[0];if(!data.tout&&!data.seen[s0.id]){data.seen[s0.id]=todayIso();save();}state.step=0;state.sch=1;nav('step');}
      else nav(d.v==='parcours'?'parcours':'today');
      break;}
    /* « Accueil » : la vitrine entière, pour un visiteur comme pour un parent déjà entré. */
    case 'accueil':nav('intro');break;
    case 'fiches':state.kit='sits';state.q='';nav('kit');break;
    /* « Encore 2 minutes » : si le parent écoutait l'étang, le son repart avec la respiration. Sinon, tout recommence en silence. */
    case 'souffle-go':{const avecSon=SON.voulu;souffleStart();if(avecSon)sonSouffle();break;}
    case 'souffle-stop':SON.voulu=false;souffleStop();break;
    case 'souffle-pause':soufflePause();break;
    /* « Changer de respiration » : le choix s'ouvre et se referme sans arrêter l'exercice. Un choix ou un réglage prend effet au mouvement suivant. */
    case 'resp-ouvre':state.souffle.choix=true;state.souffle.foc='.resp-o[aria-pressed="true"]';break;
    case 'resp-ferme':state.souffle.choix=false;state.souffle.foc='.resp-l';break;
    case 'resp':{if(!RESP[d.v])return;respGarde(d.v,0);respChoixMaj();return;}
    case 'cad':{const r=respReglage();const c=Math.max(CAD_MIN,Math.min(CAD_MAX,r.c+(d.v==='lent'?1:-1)));if(c!==r.c)respGarde('libre',c);respChoixMaj();return;}
    /* Le son : un geste pour l'entendre, le même geste pour le couper. La respiration, elle, continue. */
    case 'son':{if(d.v==='antonio'){if(SON.etat!=='off'&&SON.piste==='antonio')sonCoupe();else if(state.view==='avec')sonJoue('antonio','avec',null);return;}
      const nom=d.v==='instant'?'instant':'etang';
      if(SON.etat!=='off'&&SON.piste===nom){if(nom==='etang')SON.voulu=false;sonCoupe();}
      else if(nom==='etang'){if(state.view!=='souffle'||state.souffle.k!=='cours')return;SON.voulu=true;sonSouffle();}
      else{if(state.view!=='instant')return;sonJoue('instant','dose',null);}
      return;}
    case 'voix':state.sheet='voix';break;
    case 'partager':partager(d.id);return;
    case 'perso-tard':data.persoTard=true;save();toast('D’accord. Vous retrouverez ce réglage dans « Moi ».');break;
    case 'rouvrir-outil':if(!OUTILS_NOMS[d.v])return;state.tool=d.v;nav('kit');state.kit='tools';break;
    /* La version d'essai : ouvrir une copie des notes de l'espace habituel, ou revoir l'essai depuis le début. L'espace habituel n'est jamais modifié. */
    case 'essai-copie':{const n=essaiNotes();if(!ESSAI||!n)return;state.data=migre(Object.assign(JSON.parse(JSON.stringify(DEF)),JSON.parse(JSON.stringify(n))));save();state.view='today';state.prev=null;state.sheet=null;fxSync();render();histPush(true);window.scrollTo(0,0);toast('Une copie de vos notes est ouverte ici. Les originaux ne changent pas.');return;}
    case 'essai-zero':state.confirmEssai=true;break;
    case 'essai-zero-non':state.confirmEssai=false;break;
    case 'essai-zero-oui':if(!ESSAI)return;souffleStop();state.draft='';brouillonOte();placeOte();state.data=migre(JSON.parse(JSON.stringify(DEF)));try{localStorage.removeItem(KEY);}catch(e){}state.confirmEssai=false;state.view='intro';state.prev=null;state.sheet=null;fxSync();render();histPush(true);window.scrollTo(0,0);toast('La version d’essai repart du début.');return;
    case 'imprimer':try{window.print();}catch(e){}return;
    case 'intro-suite':{const s=document.querySelector('.intro .acc');if(s&&s.scrollIntoView)s.scrollIntoView({behavior:fxOn()?'smooth':'auto',block:'start'});return;}
    /* La personnalisation : un brouillon (state.ob), gardé seulement quand le parent touche « Enregistrer ». Toucher une réponse déjà choisie la retire. */
    case 'onboard':state.ob={me:data.me,age:data.age,situation:data.situation,weights:data.weights.slice()};state.sheet='onboard';break;
    case 'ob':if(state.ob)state.ob[d.k]=state.ob[d.k]===d.v?'':d.v;break;
    case 'obw':{if(!state.ob)break;const i=state.ob.weights.indexOf(d.v);if(i>=0)state.ob.weights.splice(i,1);else state.ob.weights.push(d.v);break;}
    case 'ob-done':{const o=state.ob;const m=document.getElementById('ob-me');data.me=clean(m?m.value:(o?o.me:data.me),LIM.me);if(o){data.age=o.age||'';data.situation=o.situation||'';data.weights=o.weights.slice();}data.perso=true;const first=entrer('perso');state.ob=null;state.sheet=null;save();if(first)state.view='today';toast('C’est enregistré.');break;}
    case 'go':if(d.view==='photo'&&!can('parcours')){openUpgrade('photo');break;}nav(d.view);if(d.view!=='kit'&&d.view!=='exo')stopTimer();break;
    /* Le bouton Retour de l'écran fait la même chose que celui du téléphone : il revient à la page d'avant.
       Quand il n'y a pas de page d'avant (on est arrivé ici par un lien), il remonte d'un niveau. */
    case 'back':{if(HIST.ok&&HIST.i>0){try{history.back();return;}catch(e){}}
      if(!data.onboarded){state.view=['apercu','commande'].includes(state.view)?'plans':'intro';state.sheet=null;break;}const v=state.view;if(v==='souffle')souffleStop();let t;if(v==='sit'||v==='exo'){t='kit';stopTimer();}else if(v==='step'||v==='carnet'||v==='final'||v==='photo'||v==='evo')t='parcours';else if(v==='letter')t='antonio';else if(['apercu','commande'].includes(v))t='plans';else if(v==='relais')t='kit';else if(v==='transmettre')t='intro';else if(['plans','depots','antonio','data','about'].includes(v))t='me';else t='today';if(state.prev&&state.prev!==v&&state.prev!=='sos')t=state.prev;state.prev=null;state.view=t;break;}
    case 'mood':data.moods[todayIso()]=Number(d.i);save();break;
    case 'kit':nav('kit');state.kit=d.v;if(d.v!=='tools')stopTimer();else if(d.tool==='timer')state.tool='timer';break;
    case 'sit':state.sit=d.id;nav('sit');noteRecent('sit',d.id);break;
    case 'age':state.age=d.v;break;
    case 'theme':state.theme=d.v;break;
    case 'dmode':state.depotMode=d.v;break;
    case 'dsend':sendDepot();return;
    /* « J'aimerais le dire à quelqu'un », depuis la zone d'écriture : les mots sont gardés d'abord, puis l'étape s'ouvre. */
    /* Champ vide, mais des mots déjà déposés aujourd'hui : le bouton prépare alors comment dire ceux-là, au lieu d'afficher une erreur. */
    case 'ddire':{if(clean(state.draft,LIM.draft).length<5){const td=D().depots.filter(x=>x.date===todayIso()).slice(-1)[0];if(td){handle('dire',{k:'ouvre',id:td.id},el);return;}}sendDepot('dire');return;}
    /* « J'ai fini pour aujourd'hui » : l'espace d'expression se referme simplement, et le parent retrouve l'accueil. */
    case 'dfin':nav('intro');setTimeout(()=>{if(state.view==='intro')toast('Vos mots sont gardés sur cet appareil. À bientôt.');},500);break;
    case 'dire':{
      const k=d.k;
      if(k==='ouvre'){const g=direOuvre(d.id);if(!g)break;if(state.view!=='deposer')nav('deposer');state.dire=g;break;}
      const g=state.dire;if(!g)break;
      /* Changer de destinataire remplace la première phrase seulement si le parent n'a pas commencé à écrire la sienne. */
      if(k==='a'){const v=d.v==='reunion'?'reunion':'proche';if(v!==g.a){const avant=direAmorces(g.a);const intacte=!clean(g.t,DIRE_LIM)||avant.some(m=>m.trim()===clean(g.t,DIRE_LIM));g.a=v;if(intacte)g.t=direAmorces(v)[0];g.mots=false;g.copie=false;direGarde();}break;}
      if(k==='mots'){g.mots=!g.mots;break;}
      if(k==='mot'){const m=direAmorces(g.a)[Number(d.i)];if(m){g.t=m;g.mots=false;g.copie=false;direGarde();state.direFoc=true;}break;}
      if(k==='joint'){g.j=!g.j;g.copie=false;direGarde();break;}
      if(k==='laisse'){direGarde();if(HIST.ok&&HIST.i>0){try{history.back();return;}catch(e){}}state.dire=null;break;}
      if(k==='copie'){
        direGarde();const t=direTexte();if(!t){fieldErr('amorce','Écrivez une première phrase, ou ajoutez vos mots à la suite.');return;}
        (async()=>{let ok=false;try{await navigator.clipboard.writeText(t);ok=true;}catch(e){}
          /* « ok » : le texte est dans le presse-papiers. « main » : le téléphone a refusé, le texte est alors sélectionné pour être copié à la main. L'écran ne dit « copié » que si c'est vrai. */
          g.copie=ok?'ok':'main';render();const el=document.getElementById('dire-texte');
          if(el){try{el.scrollIntoView({block:'center',behavior:fxOn()?'smooth':'auto'});}catch(e){}
            if(!ok){try{const r=document.createRange();r.selectNodeContents(el);const sel=window.getSelection();sel.removeAllRanges();sel.addRange(r);}catch(e){}}}
          toast(ok?(g.j?'C’est copié, avec vos mots tels que vous les avez écrits.':'C’est copié.'):'Le texte est sélectionné juste en dessous. Vous pouvez le copier.');})();
        return;}
      break;}
    case 'dstop':if(state.ctl)state.ctl.abort();return;
    case 'dconcret':concret(d.id);return;
    case 'dose-perso':dosePerso();return;
    case 'share':data.shared[d.id]=!!(el&&el.checked);save();return;
    case 'upgrade':openUpgrade(d.f);break;
    /* Les aperçus, puis la commande en démonstration. Choisir une formule payante ouvre la commande, et c'est seulement « paiement accepté » qui change la formule. */
    case 'apercu':state.ap={k:0,g:'',mot:''};state.sch=1;state.sheet=null;nav('apercu');break;
    case 'ap':{const k=Math.max(0,Math.min(3,Number(d.k)||0));state.ap.k=k;if(k===3)repere('apercu');break;}
    case 'ap-g':{const m=document.getElementById('ap-mot');if(m)state.ap.mot=m.value;state.ap.g=state.ap.g===d.v?'':d.v;break;}
    case 'ap-garde':if(!apGarde()){toast('Choisissez un geste, ou écrivez le vôtre.');return;}state.ap.k=2;break;
    case 'apercu-reprise':state.ap={k:2,g:'',mot:''};state.sheet=null;if(!com().rp){com().rp=todayIso();save();}nav('apercu');break;
    case 'commande':{if(!PRODUITS[d.v])return;if(can(d.v)){toast('Vous avez déjà '+PRODUITS[d.v].t+'.');return;}state.cmd={f:d.v,m:d.m==='six'?'six':'une',k:'recap',de:d.de||''};state.sheet=null;repere('choix',d.v);nav('commande');break;}
    case 'cmd-mode':state.cmd.m=d.v==='six'?'six':'une';break;
    case 'cmd':{const c=state.cmd;if(!c)return;const v=d.v;
      if(v==='retrouve'){if(!PRODUITS[d.f])return;c.f=d.f;if(!can(d.f))achete(d.f,'une');c.k='retrouve';break;}
      if(v==='cadeau-ok'){if(!PRODUITS[c.f])return;c.k='cadeau-ok';break;}
      if(v==='active'){if(!PRODUITS[c.f])return;if(!can(c.f))achete(c.f,'une');c.k='active';break;}
      if(['recap','ok','refus','abandon'].indexOf(v)<0||!PRODUITS[c.f])return;
      if(v==='ok'){achete(c.f,c.m);repere('achat',c.f,c.f==='parcours'?c.m:'');}
      c.k=v;break;}
    /* « Offrir à un parent » est une maquette. « Retrouver un achat » montre le principe du lien reçu par e-mail. */
    case 'cadeau':state.cmd={f:PRODUITS[d.v]?d.v:(state.view==='commande'&&state.cmd.k==='cadeau'&&PRODUITS[state.cmd.f]?state.cmd.f:'parcours'),m:'une',k:'cadeau',de:''};state.sheet=null;if(state.view!=='commande')nav('commande');break;
    case 'cadeau-voir':if(!PRODUITS[d.v])return;state.cmd={f:d.v,m:'une',k:'activer',de:''};break;
    case 'cadeau-envoi':{const u=PUBLIC+'#cadeau-'+state.cmd.f;(async()=>{if(navigator.share){try{await navigator.share({title:'Un cadeau pour vous',text:'Je vous offre '+PRODUITS[state.cmd.f].t+', sur Parent écouté, parent éclairé. Vous l’activez quand vous voulez.',url:u});return;}catch(e){if(e&&e.name==='AbortError')return;}}try{await navigator.clipboard.writeText(u);toast('Le lien du cadeau est copié.');}catch(e){const c=document.getElementById('cad-lien');if(c){try{c.focus();c.select();}catch(x){}}}})();return;}
    case 'retrouver':state.cmd={f:'parcours',m:'une',k:'retrouver',de:''};state.sheet=null;nav('commande');break;
    case 'ech-suite':{const p=achats().parcours;if(!p||p.m!=='six'||(p.n||1)>=NB_ECH)return;p.n=(p.n||1)+1;save();toast(p.n>=NB_ECH?'La 6e mensualité est payée. Plus rien ne sera prélevé.':'Mensualité '+p.n+' sur 6, en démonstration.');break;}
    case 'achats-zero':data.tier='free';data.achats={};save();toast('Vos achats de démonstration sont annulés. Rien de ce que vous avez écrit n’a été effacé.');break;
    /* « Passer le relais » a ses propres gestes, dans v2-r.js. */
    case 'rl':if(rlAct(d)===false)return;break;
    case 'transmettre':nav('transmettre');break;
    case 'tr-copie':{const t=TRANSMETTRE_MOT+'\n'+PUBLIC+'transmettre/';(async()=>{try{await navigator.clipboard.writeText(t);toast('La phrase et le lien sont copiés.');}catch(e){const c=document.getElementById('tr-lien');if(c){try{c.focus();c.select();}catch(x){}}toast('Le lien est prêt à être copié, juste en dessous.');}})();return;}
    case 'rien':return;
    case 'step':{const i=Number(d.i);const e=stepEtat(i);if(can('parcours'))usage('parcours');
      if(e.k==='formule'){openUpgrade('parcours');break;}
      if(e.k==='bientot'){toast('Cette étape s’ouvrira '+dansJours(e.n)+'. Chaque étape demande une semaine de pratique.');return;}
      if(e.k!=='open'){toast('Cette étape s’ouvrira plus tard, quand vous aurez ouvert celles qui la précèdent.');return;}
      const s=allSteps()[i];if(!data.tout&&!data.seen[s.id]){data.seen[s.id]=todayIso();save();}
      state.step=i;state.sch=1;nav('step');break;}
    case 'stepdone':{const id=d.id;if(!id)return;data.steps[id]=!data.steps[id];save();if(data.steps[id]){state.bravoAt=Date.now();toast('Étape faite. Une par semaine, c’est le bon rythme.');}break;}
    /* Le schéma avance d'un moment, sans redessiner l'écran. */
    case 'schnext':{const bx=document.querySelector('.sch');const S=bx?SCHEMAS[bx.dataset.sch]:null;if(!S)return;state.sch=Math.min(S.caps.length,(state.sch||1)+1);schSync(true);return;}
    case 'schagain':state.sch=1;schSync(false);return;
    /* Les 3 temps de l'étape : toucher un temps y descend, sans redessiner l'écran. */
    case 'temps':{const h=document.getElementById('t-'+d.k);if(!h)return;const br=document.querySelector('.app>.bar');const y=h.getBoundingClientRect().top+(window.scrollY||0)-(br?br.offsetHeight:0)-14;
      try{window.scrollTo({top:Math.max(0,y),behavior:fxOn()?'smooth':'auto'});}catch(e){window.scrollTo(0,Math.max(0,y));}
      try{h.focus({preventScroll:true});}catch(e){}return;}
    /* L'aperçu d'Antonio : cinq touches sur le titre « Moi » le font apparaître sur l'appareil, puis une ligne de « Moi » l'allume et l'éteint. */
    case 'atelier':{const now=Date.now();state.atTaps=(state.atTaps||[]).filter(x=>now-x<4000);state.atTaps.push(now);if(state.atTaps.length<5)return;state.atTaps=[];if(data.atelier)return;data.atelier=true;data.tout=true;save();toast('Aperçu d’Antonio activé sur cet appareil. Tout le parcours est ouvert.');break;}
    case 'tout':if(!data.atelier)return;data.tout=!data.tout;save();toast(data.tout?'Aperçu activé. Tout le parcours est ouvert sur cet appareil.':'Aperçu désactivé. Vous voyez le parcours comme un parent.');break;
    case 'evotime':if(d.v!=='t1'&&!can('parcours')){openUpgrade('evo');break;}state.evoTime=d.v;break;
    case 'evosave':{if(state.evoTime!=='t1'&&!can('parcours')){openUpgrade('evo');break;}const rec={date:todayIso()};EVO_SCALES.forEach(s=>{const x=document.querySelector('[data-evo="'+s.id+'"]');rec[s.id]=x?Number(x.value):5;});EVO_OPEN.forEach(o=>{const x=document.querySelector('[data-evoopen="'+o[0]+'"]');rec[o[0]]=x?clean(x.value,LIM.evo):'';});const first=state.evoTime==='t1'&&!data.evo.t1;data.evo[state.evoTime]=rec;if(state.evoDraft)delete state.evoDraft[state.evoTime];save();/* Le premier point de départ se fait depuis l'étape 1 (ou depuis le parcours) : une fois enregistré, on revient là d'où l'on venait. */
      if(first){if(HIST.ok&&HIST.i>0){state.apres='Votre point de départ est enregistré.';try{history.back();return;}catch(e){state.apres='';}}
        nav(state.prev&&state.prev!=='evo'?state.prev:'parcours');histPush();render();window.scrollTo(0,0);toast('Votre point de départ est enregistré.');return;}render();toast('Point enregistré. Ce qui bouge est à vous.');return;}
    case 'evoset':{const r=document.querySelector('[data-evo="'+d.k+'"]');if(r){r.value=d.v;evoSync(r);if(r.focus)r.focus({preventScroll:true});}return;}
    case 'photopick':{const av=photoRec();data.photo={id:d.id,text:av.text,date:av.id===d.id?av.date:''};state.photoPick=false;state.lastKey=null;save();break;}
    case 'photoback':state.photoPick=true;state.lastKey=null;break;
    case 'photosave':{const t=document.getElementById('ptext');const av=photoRec();if(!av.id){toast('Choisissez d’abord une photo, puis écrivez ce qu’elle évoque.');return;}data.photo={id:av.id,text:t?clean(t.value,LIM.photo):'',date:todayIso()};
      /* Le final montre toutes les photos choisies : un choix refait le même jour remplace celui du jour, un autre jour il s'ajoute. */
      {if(!Array.isArray(data.photos))data.photos=[];const L=data.photos,der=L[L.length-1],r={id:data.photo.id,text:data.photo.text,date:data.photo.date};if(der&&der.date===r.date)L[L.length-1]=r;else L.push(r);if(L.length>12)L.splice(0,L.length-12);}
      state.pdraft=null;save();render();toast('Gardé.');return;}
    case 'tool':state.tool=d.v;if(d.v!=='timer')stopTimer();noteRecent('tool',d.v);break;
    case 'mvc':if(MV_COUL.some(x=>x[0]===d.v)){data.mvc=d.v;save();}break;
    case 'tset':stopTimer();state.timer.total=Number(d.m)*60;state.timer.left=state.timer.total;break;
    case 'ttoggle':if(state.timer.running)stopTimer();else{if(state.timer.left===0)state.timer.left=state.timer.total;state.timer.running=true;state.timer.h=setInterval(tick,1000);}break;
    case 'treset':stopTimer();state.timer.left=state.timer.total;break;
    case 'minute':if(state.timer.running)stopTimer();else{state.timer.total=60;state.timer.left=60;state.timer.running=true;state.timer.h=setInterval(tick,1000);}break;
    /* Le tableau « d'abord, ensuite » : on vise une case, puis on y pose une image. Une image ne peut être qu'à un seul endroit du tableau. */
    case 'ftpick':state.ft.pick=d.k==='then'?'then':'first';ftSync();return;
    case 'ftset':{if(!PICTO_PAR[d.id])return;const k=state.ft.pick,autre=k==='first'?'then':'first';const f=ftRec();f[k]=d.id;if(f[autre]===d.id)f[autre]=null;data.ft=f;save();/* la case visée passe à l'autre tant que celle-ci est vide */if(!f[autre])state.ft.pick=autre;ftSync('cases');return;}
    case 'ftg':state.ft.g=d.v;ftSync('groupe');return;
    case 'ftvide':{data.ft={first:null,then:null};state.ft.pick='first';save();ftSync('cases');const b1=document.querySelector('#ft [data-k="first"]');if(b1){try{b1.focus({preventScroll:true});}catch(e){}}return;}
    case 'rdone':{const t=todayIso();data.routineDone[t]=data.routineDone[t]||{};data.routineDone[t][d.i]=!data.routineDone[t][d.i];save();rSync();return;}
    case 'rreset':data.routineDone[todayIso()]={};save();rSync();return;
    case 'abcadd':{const a=clean(document.getElementById('a1').value,LIM.line),b=clean(document.getElementById('a2').value,LIM.line),c=clean(document.getElementById('a3').value,LIM.line);if(!a&&!b&&!c){fieldErr('a1','Écrivez au moins une des trois lignes.');return;}const n=new Date();data.abc.push({date:todayIso(),time:pad(n.getHours())+':'+pad(n.getMinutes()),a,b,c});save();render();toast('Noté.');return;}
    case 'phadd':{const v=clean(document.getElementById('ph').value,LIM.phrase);if(!v){fieldErr('ph','Écrivez la phrase à garder.');return;}if(data.phrases.includes(v)){fieldErr('ph','Cette phrase est déjà dans votre liste.');return;}data.phrases.push(v);save();render();toast('Gardée.');return;}
    case 'phdel':data.phrases.splice(Number(d.i),1);save();break;
    case 'exo':if(d.id==='breath'){nav('souffle');SON.voulu=false;souffleStart();break;}state.exo=d.id;nav('exo');noteRecent('exo',d.id);break;
    case 'threeadd':{const items=['t1','t2','t3'].map(id=>clean(document.getElementById(id).value,LIM.three)).filter(Boolean);if(!items.length){fieldErr('t1','Une seule chose suffit, écrivez-la ici.');return;}data.three.push({date:todayIso(),items});save();render();toast('Gardé.');return;}
    case 'depose':{const t=document.getElementById('dep');if(t&&t.value&&fxOn()){t.classList.add('ink');setTimeout(()=>{t.value='';t.classList.remove('ink');},1150);}else if(t)t.value='';toast('C’est déposé, vous n’avez plus à le garder en vous.');return;}
    case 'letter':state.letter=Number(d.i);nav('letter');break;
    case 'qsend':{const t=clean(state.qdraft,LIM.q);if(t.length<10){fieldErr('qdraft','Écrivez votre question en une phrase ou deux (dix caractères au moins).');return;}if(questionsLeft()===0){toast('Vos deux questions du mois sont posées.');return;}const risk=RISK.test(t);data.questions.push(risk?{id:'q'+Date.now(),date:todayIso(),text:t,risk:true}:{id:'q'+Date.now(),date:todayIso(),text:t});state.qdraft='';save();render();toast(risk?'Si c’est urgent, n’attendez pas et appelez le 143 ou le 144 maintenant.':(DEMO?'Votre question est gardée sur votre appareil. Dans cette version de test, elle n’est pas transmise à Antonio.':'Votre question est envoyée. Antonio répond par écrit sous 48 heures.'));return;}
    case 'sheet-close':state.sheet=null;state.ob=null;break;
    case 'fx':data.fxOff=!data.fxOff;save();fxSync();toast(data.fxOff?'Les effets visuels sont désactivés.':'Les effets visuels sont activés.');break;
    case 'consent':if(window.PEPEConsent)window.PEPEConsent.set(d.v==='yes');break;
    case 'reset':state.confirmReset=true;break;
    case 'reset-no':state.confirmReset=false;break;
    case 'reset-yes':souffleStop();state.draft='';brouillonOte();placeOte();state.data=migre(JSON.parse(JSON.stringify(DEF)));try{localStorage.removeItem(KEY);}catch(e){}state.confirmReset=false;state.view='intro';state.prev=null;fxSync();render();histPush(true);window.scrollTo(0,0);toast('Effacé.');return;
    default:return;
  }
  const navAct=['go','sit','back','exo','step','kit','letter','peek-plans','peek-about','ob-done','photopick','photoback','porte','entrer','accueil','fiches','rouvrir-outil','apercu','apercu-reprise','ap','ap-garde','commande','cmd','cadeau','cadeau-voir','retrouver','transmettre','dfin'].includes(act)||((act==='rl'||act==='dire')&&fxSig()!==sig0);
  /* Chaque nouvel écran est une page de l'historique. Ce qui se passe à l'intérieur d'un même écran (une rubrique de la boîte à outils, le choix d'une photo) remplace la page au lieu d'en ajouter une. */
  /* L'aperçu d'une fiche du relais (ou la fiche d'exemple) : l'écran arrive en simple fondu, parce que c'est la feuille qui fait le mouvement.
     Elle vient se poser, et la page s'ouvre de façon que ses 3 repères se lisent ensemble. */
  const pose=act==='rl'&&state.view==='relais'&&(state.rl.e==='apercu'||state.rl.e==='exemple');
  /* Le bouton « Le minuteur visuel » d'une fiche mène tout droit au minuteur, et pas en haut de la boîte à outils. */
  const versMinuteur=act==='kit'&&d.tool==='timer';
  if(navAct&&fxSig()!==sig0){histPush((act==='kit'&&view0==='kit')||act==='photopick'||act==='photoback'||act==='ob-done'||act==='cmd'||(act==='cadeau'&&view0==='commande'));fxGo(()=>{render();window.scrollTo(0,0);if(pose)rlVoirTrois();if(versMinuteur)minuteurEnVue();},pose?'fade':act==='back'||act==='photoback'?'back':(act==='kit'||(el&&el.classList&&el.classList.contains('tab'))?'tab':'open'));return;}
  /* Une feuille qui se referme s'efface en douceur elle aussi, quand le navigateur sait faire le fondu d'écran. */
  if(sheet0&&!state.sheet){fxGo(()=>{render();if(navAct)window.scrollTo(0,0);},'fade',true);return;}
  render();
  if(act==='rl')rlApres();
  if(act==='dire')direApres();
  if(navAct)window.scrollTo(0,0);
}
const app=document.getElementById('app');
app.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el||el.tagName==='INPUT'||el.tagName==='LABEL')return;
  if(el.tagName==='A'){if(e.defaultPrevented||e.button>0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();}
  handle(el.dataset.act,el.dataset,el);});
app.addEventListener('change',e=>{const el=e.target;if(el.dataset&&el.dataset.rlf){rlFichier(el);return;}if(el.tagName==='INPUT'&&el.dataset.act==='share')handle('share',el.dataset,el);if(el.dataset&&el.dataset.note&&noteAttend){clearTimeout(noteT);noteAttend=false;save();}});
/* Si l'on quitte la page pendant qu'on écrit dans le carnet, les derniers mots sont gardés tout de suite. Rien n'est écrit s'il n'y a rien en attente,
   pour ne pas écraser ce qu'un autre onglet aurait enregistré entre-temps. */
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&noteAttend){clearTimeout(noteT);noteAttend=false;save();}});
let typing=null,noteT=null,noteAttend=false,direT=null;
app.addEventListener('input',e=>{
  const t=e.target;clearErr(t);
  /* Les champs de « Passer le relais » se gardent tout seuls. */
  if(t.dataset&&t.dataset.rl)rlSaisie(t);
  /* Le carnet de route se garde tout seul, pendant qu'on écrit. */
  if(t.dataset&&t.dataset.note){const id=t.dataset.note;const v=String(t.value).slice(0,LIM.note);if(v.trim())D().notes[id]={t:v,d:todayIso()};else delete D().notes[id];clearTimeout(noteT);noteAttend=true;noteT=setTimeout(()=>{noteAttend=false;save();},400);const st=document.getElementById('note-etat');if(st){const m=v.trim()?NOTE_OUI:NOTE_NON;if(st.textContent!==m)st.textContent=m;}carnetHaut(t);lectureSync();}
  if(t.id==='draft'){state.draft=t.value;updCount(t);brouillonGarde();}
  if(t.id==='amorce'&&state.dire){state.dire.t=String(t.value).slice(0,DIRE_LIM);/* Le parent reprend sa phrase après avoir copié : le texte prêt n'est plus le bon, il s'efface jusqu'à la prochaine copie. */
    if(state.dire.copie){state.dire.copie=false;try{document.querySelectorAll('main.dire .dire-pret,main.dire .vers-relais').forEach(e=>e.remove());}catch(e){}}clearTimeout(direT);direT=setTimeout(direGarde,400);}
  if(t.id==='qdraft')state.qdraft=t.value;
  if(t.id==='ptext')state.pdraft=t.value;
  if(t.dataset&&t.dataset.evo)evoSync(t);
  if(t.dataset&&t.dataset.evoopen){const k=state.evoTime;state.evoDraft=state.evoDraft||{};state.evoDraft[k]=state.evoDraft[k]||{};state.evoDraft[k][t.dataset.evoopen]=t.value;}
  if(t.id==='ob-me'&&state.ob)state.ob.me=String(t.value).slice(0,LIM.me);
  if(t.id==='q'){state.q=t.value;clearTimeout(typing);typing=setTimeout(()=>{const pos=t.selectionStart;render();const nq=document.getElementById('q');if(nq){nq.focus();try{nq.setSelectionRange(pos,pos);}catch(e){}}},250);}
});
/* Entrée valide les champs d'une seule ligne, comme sur un vrai formulaire. */
app.addEventListener('keydown',e=>{
  if(e.key!=='Enter'||e.isComposing)return;const t=e.target;
  if(t.id==='ph'){e.preventDefault();handle('phadd',{},t);}
  else if(t.id==='ob-me'){e.preventDefault();handle('ob-done',{},t);}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state.sheet){state.sheet=null;state.ob=null;fxGo(render,'fade',true);}});
try{if(/[?&](nouveau|reset|new)\b/.test(location.search)){localStorage.removeItem(KEY);try{sessionStorage.removeItem(KEY+'-place');sessionStorage.removeItem(KEY+'-brouillon');}catch(e){}if(history.replaceState)history.replaceState(null,'',location.pathname+location.hash);}}catch(e){}
state.data=load();
/* L'aperçu d'Antonio s'active aussi par l'adresse …/#atelier. Ce n'est pas un verrou : il sert à tout relire sans attendre les sept jours. */
let atelierMsg=false;
try{if(location.hash==='#atelier'){state.data.atelier=true;state.data.tout=true;save();atelierMsg=true;if(history.replaceState)history.replaceState(null,'',location.pathname+location.search);}}catch(e){}
fxSync();
/* La fenêtre passe d'un format à l'autre (fenêtre agrandie ou réduite, tablette qu'on tourne) : l'écran est réécrit dans le bon ordre, sans perdre ce qui est en cours de saisie. */
if(MQ_LARGE){const relayout=()=>{const keep={};document.querySelectorAll('#app input[id],#app textarea[id]').forEach(el=>{if(el.type!=='range'&&el.type!=='checkbox'&&el.type!=='radio')keep[el.id]=el.value;});render();Object.keys(keep).forEach(id=>{const el=document.getElementById(id);if(el&&el.value!==keep[id])el.value=keep[id];});};if(MQ_LARGE.addEventListener)MQ_LARGE.addEventListener('change',relayout);else if(MQ_LARGE.addListener)MQ_LARGE.addListener(relayout);
  /* le passage de 2 à 3 colonnes ne concerne que la boîte à outils */
  if(MQ_TROIS){const trois=()=>{if(state.view==='kit')relayout();};if(MQ_TROIS.addEventListener)MQ_TROIS.addEventListener('change',trois);else if(MQ_TROIS.addListener)MQ_TROIS.addListener(trois);}}
window.addEventListener('scroll',lectureScroll,{passive:true});window.addEventListener('resize',lectureScroll,{passive:true});
if(FX_OK){document.addEventListener('pointerdown',fxTap,{passive:true,capture:true});document.addEventListener('pointerup',fxLeve,{passive:true,capture:true});document.addEventListener('pointercancel',()=>{fxPt.vt=false;},{passive:true,capture:true});document.addEventListener('click',fxDouble,true);document.addEventListener('pointerdown',eauTouch,{passive:true});window.addEventListener('resize',()=>{EAU.geo=null;},{passive:true});window.addEventListener('popstate',e=>{if(e&&e.hasUAVisualTransition)fxSkip=Date.now();});if(FX_RM&&FX_RM.addEventListener)FX_RM.addEventListener('change',()=>{fxSync();});}
/* Sur le site, l'adresse dit quel écran ouvrir : une fiche (…/fiches/le-coucher-et-la-nuit/), la liste des situations (…/fiches/) ou « Mon histoire » (…/#histoire).
   On peut envoyer ces adresses telles quelles, et le bouton Retour du téléphone fonctionne partout. */
const r0=routeDe();
if(r0){state.view=r0.v;if(r0.sit)state.sit=r0.sit;if(r0.kit)state.kit=r0.kit;
  /* Une fiche de relais reçue par lien se lit dès l'arrivée. Un cadeau ou « Offrir » ouvrent leur écran de la même façon. */
  if(r0.re==='lu')rlDuHash();
  if(r0.cf)state.cmd={f:r0.cf,m:'une',k:r0.ck||'recap',de:''};}
/* Un visiteur arrive sur la vitrine. Elle compte comme une page de l'historique : après « Souffler 2 minutes », « Retour » y ramène. */
else if(!D().onboarded)state.view='intro';
/* Le téléphone recharge parfois la page tout seul (on a changé d'application un instant, ou l'on revient d'une page de texte) :
   dans la demi-heure, le parent retrouve l'écran où il était, et le texte qu'il était en train d'écrire. Plus tard, il arrive sur « Aujourd'hui ». */
let y0=0;
if(SITE&&!PRE){try{
  const venue=((performance.getEntriesByType&&performance.getEntriesByType('navigation')[0])||{}).type;
  const pl=JSON.parse(sessionStorage.getItem(PLACE)||'null');
  if((venue==='reload'||venue==='back_forward')&&pl&&pl.s&&Date.now()-pl.t<30*60000&&D().onboarded&&(!r0||(r0.v===pl.s.v&&(r0.v!=='sit'||r0.sit===pl.s.sit)))){navApply(pl.s);y0=pl.y||0;}
}catch(e){}}
brouillonLit();
if(SITE)window.addEventListener('hashchange',()=>{
  /* L'adresse …/#atelier, tapée alors que l'espace est déjà ouvert, allume l'aperçu d'Antonio sans recharger la page. */
  if(location.hash==='#atelier'){const d=D();d.atelier=true;d.tout=true;save();histPush(true);if(d.onboarded)render();toast('Aperçu d’Antonio activé sur cet appareil. Tout le parcours est ouvert.');}
  /* Une fiche de relais reçue par lien, ou un cadeau, ouverts alors que la page est déjà là. */
  else if(/^#f=/.test(location.hash)){rlDuHash();if(state.view!=='relais')nav('relais');histPush(true);render();window.scrollTo(0,0);}
  else if(/^#cadeau-(parcours|relais)$/.test(location.hash)){state.cmd={f:location.hash.slice(8),m:'une',k:'activer',de:''};nav('commande');histPush(true);render();window.scrollTo(0,0);}
  /* Les adresses des offres, de l'essai du parcours et du relais, tapées alors que l'espace est ouvert. */
  else if(VUES_HASH[location.hash]&&state.view!==VUES_HASH[location.hash]){const v=VUES_HASH[location.hash];if(v==='apercu'){state.ap={k:0,g:'',mot:''};state.sch=1;}nav(v);histPush(true);render();window.scrollTo(0,0);}
  /* L'adresse …/#accueil, tapée alors que l'espace est ouvert, montre la vitrine. */
  else if(location.hash==='#accueil'&&state.view!=='intro'){nav('intro');histPush(true);render();window.scrollTo(0,0);}
});
if(SITE)window.addEventListener('popstate',histRetour);
/* La respiration s'arrête quand l'écran s'éteint ou que l'on change d'onglet, et reprend là où elle en était. */
document.addEventListener('visibilitychange',()=>{const z=state.souffle;if(z.k!=='cours'||z.pz)return;
  if(document.visibilityState==='hidden'){if(!z.hid)z.hid=performance.now();veilleOff();}
  else{if(z.hid){souffleDecale(performance.now()-z.hid);z.hid=0;}veilleOn();souffleApres();}});
/* Le son s'arrête dès que la page passe à l'arrière-plan. Au retour, celui de la respiration reprend là où en est l'exercice. Celui de la dose reste coupé. */
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='hidden'){if(SON.etat!=='off'){SON.reprise=(SON.proprio==='souffle'&&state.souffle.k==='cours')?1:null;const r=SON.reprise;sonCoupe(true);SON.reprise=r;}}
  else{
    /* Si le téléphone a figé le son avant la fin de son extinction, ce qui restait se tait pour de bon au retour. */
    sonTaire();
    if(SON.reprise){SON.reprise=null;if(state.view==='souffle'&&state.souffle.k==='cours'&&SON.voulu)sonSouffle();}
  }
});
window.addEventListener('pagehide',()=>{SON.reprise=null;sonCoupe(true);});
window.addEventListener('resize',()=>{if(state.view==='souffle')soufflePose();},{passive:true});
state.inClaude=!SITE&&!!(window.claude&&typeof window.claude.use==='function');
if(SITE)state.sample=false;
/* Sur le site, l'accueil, la liste des situations et chaque fiche sont déjà écrits dans leur page (affichage immédiat, lisible sans JavaScript
   par les moteurs et par les aperçus de lien) : pour un visiteur, on garde l'écran tel quel. Un parent déjà entré retrouve son espace. */
{const pre=app.getAttribute('data-prerender');
  if(!D().onboarded&&!PRE&&((pre==='intro'&&(!r0||r0.v==='intro'))||(pre==='pub-sit'&&r0&&r0.v==='sit')||(pre==='pub-kit'&&r0&&r0.v==='kit'))){
    state.lastKey=pre;app.removeAttribute('data-prerender');heureLive();titreSync();
    if(pre==='intro'){introLive();fxMark();eauArrive(true);}else fxMark();
  }else{render();if(y0)window.scrollTo(0,y0);}}
histInit();
/* En quittant la page (autre application, autre page, onglet fermé) : on note l'heure et l'endroit, pour les retrouver au retour. */
window.addEventListener('pagehide',histQuitte);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')histQuitte();});
if(atelierMsg)toast('Aperçu d’Antonio activé sur cet appareil. Tout le parcours est ouvert.');
if(!SITE)(async()=>{try{if(state.inClaude){const s=await window.claude.use('sample');state.sample=s||false;}else state.sample=false;}catch(e){state.sample=false;}if(D().onboarded||state.view==='plans')render();})();
})();
