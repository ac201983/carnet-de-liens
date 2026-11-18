(function(){
'use strict';
const SITE=true;
const MENTIONS=true;
const KEY='pepe-v1';
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
   aide:'Si la tristesse s’installe pendant des semaines sans vous laisser de répit, parlez-en à un ou une psychologue qui connaît le handicap, ou rejoignez un groupe de parents. Et pour les nuits trop longues, vous pouvez appeler La Main Tendue au 143.'}
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
   caps : une phrase par moment. Les mots du dessin restent très courts, la phrase complète est dessous. */
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
const SCHEMAS={
  points:{vb:'0 0 340 200',
    alt:'Un chemin qui monte, avec 3 points. Le premier est posé aujourd’hui, le deuxième au milieu du parcours et le troisième à la fin. Une ligne relie les 3 points.',
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
    base:sFleche('vague')+'<path class="s-sol" d="M12 186 L328 186"/><path class="s-route" d="M20 176 C 90 176, 110 44, 170 44 S 250 176, 320 176"/>',
    l:[[5,'<path class="s-trace" pathLength="1" d="M20 176 C 90 176, 110 44, 170 44 S 250 176, 320 176"/>'],
       [1,sPoint(99,110,1)],
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
    base:'<path class="s-route" d="M30 156 C 120 156, 160 84, 304 84"/>',
    l:[[2,'<path class="s-brume" d="M118 158 C 90 158, 88 128, 112 124 C 110 100, 144 88, 162 104 C 176 82, 220 86, 224 112 C 252 110, 260 150, 234 158 Z"/><text class="s-t" x="172" y="76" text-anchor="middle">Le flou</text>'],
       [5,'<path class="s-trace" pathLength="1" d="M30 156 C 46.2 156, 60.8 153.7, 74.6 149.8"/>'],
       [1,sPoint(30,156,1)+'<text class="s-t" x="12" y="128" text-anchor="start">Aujourd’hui</text>'],
       [3,sPoint(304,84,3)+sBulle(258,40,140,['Mon image'],'vert')],
       [4,sBulle(172,131,120,['Ma peur'],'rose',4)],
       [5,sPoint(75,150,5)+sBulle(139,190,130,['Un petit pas'],'vert')]],
    caps:['Vous êtes ici, aujourd’hui, avec votre enfant tel qu’il est.','Devant vous, l’avenir est flou. Dans le flou, la peur imagine souvent le pire.','Vous posez une image au loin. C’est une journée de votre enfant dans 10 ans, belle et possible.','Vous nommez ce qui vous fait peur entre aujourd’hui et cette image. Une peur qui a un nom prend moins de place.','Vous choisissez un petit pas pour cette semaine. La route se fait un pas après l’autre.']}
  ,creux:{vb:'0 0 340 222',
    alt:'Une courbe en forme de vallée. L’élan est haut au départ, il baisse vers la moitié du chemin, et il remonte à l’approche du but. Dans le creux, on se retourne pour mesurer le chemin fait, puis on se donne un but tout proche.',
    base:sFleche('creux')+'<path class="s-sol" d="M12 198 L328 198"/><path class="s-route" d="M20 56 C 90 56, 110 160, 170 160 S 250 56, 320 56"/>',
    l:[[5,'<path class="s-trace" pathLength="1" d="M170 160 C 191 160, 207.1 147.3, 222.2 130.7"/>'],
       [1,sPoint(20,56,1)+'<text class="s-t" x="4" y="28" text-anchor="start">Le départ</text>'],
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
    base:sFleche('ravito')+'<path class="s-sol" d="M14 200 L326 200"/><path class="s-sol" d="M14 200 L14 46"/>',
    l:[[2,'<path class="s-pente" d="M30 62 L240 200"/><path class="s-bout" d="M228 200 L252 200"/>'+sBulle(82,168,124,['Sans recharge'],'rose')],
       [3,'<path class="s-trace" pathLength="1" d="M30 62 L90 101 L90 66 L150 105 L150 70 L210 109"/>'+sPts([[90,66],[150,70]],'lui')+sTrait('M140 40 C 126 50, 108 54, 97 61','ravito')+sBulle(160,22,118,['Un rituel'],'vert',3)],
       [4,'<path class="s-trace" pathLength="1" d="M210 109 L210 58 L270 97"/>'+sPts([[210,58]],'lui')+sTrait('M262 40 C 250 46, 232 48, 217 54','ravito')+sBulle(274,22,108,['Un relais'],'vert',4)],
       [5,'<path class="s-trace" pathLength="1" d="M270 97 L270 62 L312 90 L312 60"/>'+sPts([[270,62]],'lui')+sPoint(312,60,5)],
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
    base:sFleche('arche')+'<path class="s-sol" d="M12 204 L328 204"/><path class="s-route" d="M44 184 C 70 18, 270 18, 296 184"/>',
    l:[[1,'<path class="s-pli" d="M170 30 L170 132"/><text class="s-t" x="88" y="22" text-anchor="middle">Je ne sais pas encore</text><text class="s-t" x="252" y="22" text-anchor="middle">Je sais faire</text>'],
       [2,'<path class="s-trace" pathLength="1" d="M44 184 C 51 139.2, 70.7 106.5, 96.3 85.8"/>'],
       [3,'<path class="s-trace" pathLength="1" d="M96.3 85.8 C 139.8 50.7, 200.2 50.7, 243.7 85.8"/>'],
       [4,'<path class="s-trace" pathLength="1" d="M243.7 85.8 C 269.3 106.5, 289 139.2, 296 184"/>'],
       [1,sPoint(44,184,1)+'<text class="s-t" x="52" y="226" text-anchor="middle">Sans le voir</text>'],
       [2,sPoint(96,86,2)+'<text class="s-t" x="74" y="90.6" text-anchor="end">Je le vois</text>'],
       [3,sPoint(244,86,3)+'<text class="s-t" x="266" y="90.6" text-anchor="start">J’y pense</text>'],
       [4,sPoint(296,184,4)+'<text class="s-t" x="288" y="226" text-anchor="middle">Sans y penser</text>'],
       [5,'<circle class="s-anneau" cx="296" cy="184" r="22"/>'+sTrait('M226 168 C 242 172, 256 176, 268 180','arche')+sBulle(170,162,112,['Le bilan'],'vert',5)]],
    caps:['Au début, il y a des choses que vous ne savez pas faire, et vous ne le voyez pas.','Un jour, vous le voyez. C’est souvent le moment le plus inconfortable, et c’est pourtant le signe que vous avancez.','Puis vous savez faire, à condition d’y penser. Cela demande de l’attention.','Un jour enfin, vous faites sans y penser. C’est devenu un réflexe.','Ce que vous faites sans y penser ne se voit plus. Le bilan sert à le retrouver.']}
  ,sentier:{vb:'0 0 340 250',
    alt:'Un sentier en lacets qui monte. En bas, le départ. 5 petits repères marquent les mois, et le sixième, plus haut, est aujourd’hui. Encore plus haut, une bulle en pointillé porte les mots le parent parfait, et personne ne s’y trouve. Une flèche part d’une bulle, ma lettre, et redescend vers le départ.',
    base:sFleche('sentier')+'<path class="s-route" d="M30 214 C 110 214, 196 216, 204 194 C 212 170, 100 186, 92 160 C 84 132, 190 128, 224 104"/>',
    l:[[2,'<path class="s-trace" pathLength="1" d="M30 214 C 110 214, 196 216, 204 194 C 212 170, 100 186, 92 160 C 84 132, 190 128, 224 104"/>'+sPts([[105.3,213.8],[180.4,207.5],[163.9,178.6],[92.5,161.3],[152.7,127.9]],'lui')+'<text class="s-t" x="12" y="136" text-anchor="start">6 mois</text>'],
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

const MEDAL='img/medaillon.webp';
const HERO='img/hero.webp';

Object.assign(I,{
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
  hand:'<svg class="i" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/><circle cx="12" cy="12" r="9.5"/></svg>'
});
Object.keys(I).forEach(k=>{I[k]=I[k].replace('<svg class="i"','<svg class="i" aria-hidden="true" focusable="false"');});

/* ---------- formules ---------- */
const TIERS={free:{t:'Découverte',p:'0',per:'gratuit',cls:''},parcours:{t:'Le parcours',p:'14',per:'par mois',cls:'parcours'},antonio:{t:'Avec Antonio',p:'49',per:'par mois',cls:'antonio'}};
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
  ['Mot mensuel d’Antonio',false,false,true],
  ['2 questions par mois',false,false,true]
];
const UP={
  depots:{t:'Déposer sans limite',s:'Vous avez utilisé vos trois dépôts Découverte. Avec Le parcours, vous déposez autant que nécessaire, avec la phrase-miroir à chaque fois.'},
  dose:{t:'Votre dose, à vous',s:'Avec Le parcours, la dose du jour est écrite d’après ce que vous avez déposé ces derniers jours.'},
  parcours:{t:'Les 24 étapes',s:'La première étape est offerte. Les vingt-trois suivantes, une par semaine pendant six mois, font partie du Parcours.'},
  evo:{t:'Voir le chemin',s:'Le point de départ est offert. Le point à trois mois et le bilan à six mois font partie du Parcours.'},
  photo:{t:'Le photolangage',s:'Choisir une image pour dire votre vécu, au départ puis au bilan, fait partie du Parcours.'},
  antonio:{t:'Avec Antonio',s:'Chaque mois, Antonio lit les dépôts que vous choisissez de lui partager et vous écrit un mot personnel. Deux fois par mois, vous pouvez aussi lui poser une question, et il vous répond par écrit dans les 48 heures.'}
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
const DEF={fxOff:false,tier:'free',me:'',age:'e',situation:'hand',weights:[],start:'',moods:{},depots:[],shared:{},steps:{},notes:{},seen:{},pv:0,atelier:false,tout:false,evo:{},photo:null,photos:[],abc:[],phrases:[],routineDone:{},ft:{first:null,then:null},three:[],letters:[],questions:[],onboarded:false,doseDate:'',doseText:''};
const state={photoPick:false,photoOrder:null,pdraft:null,evoDraft:null,data:null,view:'today',prev:null,lastKey:null,lastSheet:null,sit:null,q:'',theme:'all',age:'all',sheet:null,upFeat:null,toast:'',exo:null,kit:'sits',tool:'timer',timer:{total:300,left:300,running:false,h:null},ft:{pick:'first',g:null},confirmReset:false,sample:null,inClaude:false,busy:false,ctl:null,draft:'',qdraft:'',step:null,evoTime:'t1',depotMode:'listen',doseBusy:false,letter:null};
let toastTimer=null;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function load(){try{const d=JSON.parse(localStorage.getItem(KEY)||'null');if(d&&typeof d==='object')return migre(Object.assign(JSON.parse(JSON.stringify(DEF)),d));}catch(e){}return migre(JSON.parse(JSON.stringify(DEF)));}
/* Avant le 16 novembre 2026, les étapes faites étaient rangées par leur numéro. Elles le sont maintenant par leur nom.
   Un parent venu avant garde ouvertes autant d'étapes que de semaines écoulées depuis son arrivée, et celles qu'il avait faites. */
function migre(d){
  /* L'historique des photos commence avec celle qui était déjà gardée. */
  if(!Array.isArray(d.photos))d.photos=[];
  if(!d.photos.length&&d.photo&&d.photo.date){const pid=d.photo.id||(typeof d.photo.i==='number'?PHOTOS_AVANT[d.photo.i]:null);if(pid)d.photos.push({id:pid,text:d.photo.text||'',date:d.photo.date});}
  if(d.pv>=2)return d;
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
  d.steps=faits;d.seen=vus;if(!d.notes||typeof d.notes!=='object')d.notes={};d.pv=2;return d;
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
function weekNo(){const s=D().start||todayIso();const p=s.split('-').map(Number);const d0=new Date(p[0],p[1]-1,p[2]);return Math.max(0,Math.floor((Date.now()-d0.getTime())/(7*86400000)));}
function allSteps(){const out=[];PARCOURS.forEach((m,mi)=>m.steps.forEach((s,si)=>out.push(Object.assign({mi,si,idx:out.length},s))));return out;}
/* L'étape du moment : la dernière qui est ouverte. Dans l'aperçu d'Antonio, où tout est ouvert, la première qui n'est pas faite. */
function currentStepIdx(){const S=allSteps();if(D().tout){const f=S.findIndex(s=>!D().steps[s.id]);return f<0?S.length-1:f;}let c=0;for(let i=1;i<S.length;i++){if(stepEtat(i).k==='open')c=i;else break;}return c;}
function doneCount(){return allSteps().filter(s=>D().steps[s.id]).length;}
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
const tier=()=>D().tier||'free';
function can(f){const t=tier();if(f==='parcours')return t!=='free';if(f==='antonio')return t==='antonio';return true;}
function depotsLeft(){return can('parcours')?Infinity:Math.max(0,FREE_DEPOTS-D().depots.length);}
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
    const ph=[].find.call(document.querySelectorAll(EAU_ICI),dedans);if(ph)eauTouch({clientX:x,clientY:y,button:0,target:ph});
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
/* Déposer : le texte se dissout doucement dans l'eau avant que la réponse remonte. */
function fxSink(){
  const el=document.getElementById('draft');if(!fxOn()||!el)return Promise.resolve();
  return new Promise(res=>{el.classList.add('sink');setTimeout(res,720);});
}
/* ---------- l'eau de la photo : de vraies ondes, calculées dans l'image ---------- */
/* La photo est redessinée par la carte graphique du téléphone, et chaque onde déplace vraiment les reflets de l'étang,
   en suivant sa perspective (les cercles s'aplatissent au loin). Rien n'est dessiné par-dessus la photo.
   Là où l'eau est calme, ce calque est transparent, et il s'enlève tout seul quand la dernière onde s'est éteinte.
   Sans carte graphique utilisable, la photo reste simplement immobile. */
const EAU={ok:null,cv:null,gl:null,u:null,tex:false,host:null,geo:null,rips:[],wait:[],raf:0,t0:0,fix:null,n:0,last:0,slow:0,weak:0,seq:0,lost:0,drop:null};
const EAU_LIFE=3.2;
const EAU_TC=1.2;   /* le moment où la goutte touche la pointe de la colonne, en secondes depuis le début de son rebond */
const EAU_ICI='.herofull,.band';   /* toutes les photos : l'accueil, les quatre onglets et « Mon histoire » */
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
    im.src=HERO;
    EAU.cv=cv;EAU.gl=gl;EAU.ok=true;
  }catch(e){EAU.ok=false;}
  return EAU.ok;
}
/* Où la photo est-elle affichée, et quel morceau en voit-on ? (elle remplit sa boîte en étant rognée, comme « cover ») */
function eauGeo(host){
  const hero=host.classList.contains('herofull');const box=hero?host.querySelector('.herobg'):host;if(!box)return null;
  const r=box.getBoundingClientRect();if(r.width<40||r.height<40)return null;
  let px=.5,py=.5;
  try{const cs=getComputedStyle(box);const m=String(hero?cs.objectPosition:cs.backgroundPosition).match(/(-?[\d.]+)%\s+(-?[\d.]+)%/);if(m){px=m[1]/100;py=m[2]/100;}}catch(e){}
  const k=Math.max(r.width/866,r.height/470);
  return {el:box,w:r.width,h:r.height,k:k,ox:-(r.width-866*k)*px/k,oy:-(r.height-470*k)*py/k};
}
function eauHost(host){
  if(!EAU.ok||!host)return false;
  if(EAU.host!==host||EAU.cv.parentNode!==host){
    if(host.classList.contains('herofull')){const im=host.querySelector('.herobg');if(!im)return false;host.insertBefore(EAU.cv,im.nextSibling);}
    else host.insertBefore(EAU.cv,host.firstChild);
    EAU.host=host;EAU.geo=null;
  }
  if(!EAU.geo)EAU.geo=eauGeo(host);
  return !!EAU.geo;
}
function eauStop(){
  if(EAU.raf){cancelAnimationFrame(EAU.raf);EAU.raf=0;}
  EAU.rips=[];EAU.wait=[];EAU.n=0;EAU.slow=0;EAU.host=null;EAU.geo=null;EAU.drop=null;
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
  if(!EAU.rips.length&&EAU.drop==null){eauStop();return;}
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
  const G=EAU.drop!=null?eauGoutte(now-EAU.drop):{d:[0,1,1,0],s:[-1,0,12,0]};
  gl.uniform4f(EAU.u.d,G.d[0],G.d[1],G.d[2],G.d[3]);gl.uniform4f(EAU.u.s,G.s[0],G.s[1],G.s[2],G.s[3]);   /* photo affichée en petit (le bandeau) : l'onde est un peu plus marquée, pour rester visible */
  const a=EAU.buf||(EAU.buf=new Float32Array(32));a.fill(0);EAU.rips.forEach((r,i)=>{a[i*4]=r.x;a[i*4+1]=r.z;a[i*4+2]=r.t;a[i*4+3]=r.s;});
  gl.uniform4fv(EAU.u.r,a);
  gl.drawArrays(gl.TRIANGLES,0,3);
  if(EAU.fix==null)EAU.raf=requestAnimationFrame(eauFrame);
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
    if(!document.querySelector(EAU_ICI))return;
    eauReady(()=>{if(id!==EAU.seq)return;const host=document.querySelector(EAU_ICI);if(!host||!eauHost(host))return;eauBond();});
  },attente);
  /* On attend que la page ait fini de se charger : la première onde ne doit pas être saccadée. */
  if(document.readyState==='complete')go();else window.addEventListener('load',go,{once:true});
}
/* Sous le doigt : on ne fait bouger l'eau que là où il y a de l'eau. */
function eauTouch(e){
  if(!fxOn()||e.button>0)return;const t=e.target&&e.target.closest?e.target:null;
  if(!t||t.closest('button,a,input,textarea,select,label'))return;
  const host=t.closest('.herofull,.band');if(!host)return;
  const x=e.clientX,y=e.clientY;
  eauReady(()=>{
    if(!host.isConnected)return;const g=eauGeo(host);if(!g)return;const r=g.el.getBoundingClientRect();
    const ix=g.ox+(x-r.left)/g.k,iy=g.oy+(y-r.top)/g.k;
    if(Math.abs(ix-435)<30&&iy>140&&iy<262){if(eauHost(host))eauBond();return;}      /* la goutte ou sa colonne : elle rebondit */
    if(iy<118||iy>470||ix<0||ix>866)return;      /* la rive, la forêt, ou plus bas que la photo : rien ne bouge */
    if(eauHost(host))eauAdd(ix,iy,.8,0);
  });
}
/* Après chaque rendu : en changeant d'écran l'eau redevient calme, et sur le même écran le calque retrouve sa photo. */
function eauSync(entering){
  if(!EAU.cv)return;
  if(entering||!EAU.rips.length){eauStop();return;}
  if(!EAU.cv.isConnected){const host=document.querySelector('.herofull,.band');if(!host||!eauHost(host))eauStop();else if(!EAU.raf&&EAU.fix==null)EAU.raf=requestAnimationFrame(eauFrame);}
}
/* ---------- rendu ---------- */
const TAB_VIEWS=['today','parcours','kit','me'];
const BACK_VIEWS=['sit','exo','step','carnet','final','photo','data','about','plans','evo','depots','antonio','letter'];
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
  const fkey=focusKey(document.activeElement);
  const oldSheet=app.querySelector('.sheet');const sheetTop=oldSheet?oldSheet.scrollTop:0;
  if(!D().onboarded&&(state.view==='plans'||state.view==='about')){base='app nobar';key='peek-'+state.view;html='<header class="bar"><button type="button" class="back" data-act="back">'+I.back+'Retour</button></header>'+(state.view==='about'?viewAbout():viewPlans());}
  else if(!D().onboarded){base='app nobar';key='intro';html=viewIntro();}
  else if(state.view==='sos'){base='app nobar';key='sos';html=viewSOS();}
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
      case 'depots':html+=viewDepots();break;
      case 'antonio':html+=viewAntonio();break;
      case 'letter':html+=viewLetter();break;
      case 'data':html+=viewData();break;
      case 'about':html+=viewAbout();break;
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
  /* « lum » : la lumière qui se lève une fois sur la photo. Si l'écran est redessiné entre-temps, elle reprend là où elle en était (--fx-age). */
  /* « v-… » dit quel écran est affiché, et « wide » marque les quatre onglets : la mise en page pour grand écran s'appuie dessus. */
  base+=' v-'+key+(TAB_VIEWS.includes(key)?' wide':'');
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
  if(key==='intro')introLive();
  if(key==='step')lectureSync();
  fxMark();
  eauSync(entering);if(entering)eauArrive();
}
/* ---------- « Mon histoire » : adresse partageable (#histoire, sur le site) et un seul moment d'animation ---------- */
const STORY_HASH='#histoire';const TITLE0=document.title;
function syncStory(entering){
  const on=state.view==='about';
  try{document.title=on?'Mon histoire, par Antonio Company, créateur de Parent Écouté, Parent Éclairé':TITLE0;}catch(e){}
  if(SITE&&!on&&location.hash===STORY_HASH){try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}}
  if(!on||!entering)return;
  const el=document.querySelector('.avec');
  if(!el||!('IntersectionObserver' in window)||!fxOn())return;
  el.classList.add('arm');
  const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){el.classList.add('seen');io.disconnect();}},{threshold:.35});
  io.observe(el);
}
function openStory(){
  if(SITE&&location.hash!==STORY_HASH){location.hash=STORY_HASH.slice(1);return;}
  showStory();
}
function showStory(){if(state.view!=='about')state.prev=state.view;state.view='about';state.sheet=null;state.confirmReset=false;stopTimer();fxGo(()=>{render();window.scrollTo(0,0);},'open');}
function bar(){
  const back=BACK_VIEWS.includes(state.view)?'<button type="button" class="back" data-act="back">'+I.back+'Retour</button>':'';
  /* Sur grand écran, le nom de l'espace et le SOS sont dans la colonne de gauche : il ne reste ici que le bouton Retour, quand il y en a un. */
  /* Dans une étape, 3 traits sous la barre se remplissent pendant la lecture : comprendre, essayer, écrire. */
  const lect=state.view==='step'?'<span class="lecture" aria-hidden="true"><i><b></b></i><i><b></b></i><i><b></b></i></span>':'';
  if(large())return back?'<header class="bar sub">'+back+lect+'</header>':'';
  const wm=back?'':'<span class="wordmark">'+LOGO+'<span>Parent écouté<small>parent éclairé</small></span></span>';
  return '<header class="bar'+(back?' sub':'')+'">'+back+wm+'<button type="button" class="sos" data-act="go" data-view="sos">'+I.alert+'SOS</button>'+lect+'</header>';
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
function lectureScroll(){if(lectTick)return;lectTick=1;(window.requestAnimationFrame||setTimeout)(()=>{lectTick=0;lectureSync();});}
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
function introDoseLabel(){if(new Date().getDay()===0)return 'Dose spéciale du dimanche';let j='';try{j=new Date().toLocaleDateString('fr-CH',{weekday:'long',day:'numeric',month:'long'});}catch(e){}return 'La dose du '+(j||fmtDate(todayIso()));}
function viewIntro(){
  const cta=wide=>'<button type="button" class="btn primary'+(wide?' wide':'')+'" data-act="onboard">'+I.sun2+'Commencer gratuitement</button>';
  const priv=SITE?'Cette version de test est gratuite et tout ce que vous écrivez reste sur votre appareil. La phrase-miroir personnalisée arrivera avec la version complète. En attendant, chaque dépôt reçoit une question et une lumière.':'Vos notes restent sur votre appareil. Quand vous déposez, votre texte part sans votre nom et une intelligence artificielle écrit la réponse, avec la méthode d’Antonio.';
  const sec=(k,t,l,c)=>'<section class="acc acc-'+k+'" aria-labelledby="acc-'+k+'-t"><div class="acc-h"><h2 id="acc-'+k+'-t" class="acc-t">'+t+'</h2>'+(l?'<p class="acc-l">'+l+'</p>':'')+'</div><div class="acc-c">'+c+'</div></section>';
  const steps=allSteps();const etape=id=>steps.find(x=>x.id===id)||{};
  /* 1. Les permissions : 4 des 10 que l'espace propose. Le titre commence la phrase, chaque ligne la finit. */
  const perms='<ul class="acc-perms">'+[0,2,3,9].map(i=>PERMISSIONS[i]).filter(Boolean).map(p=>'<li>'+esc(p[1])+'</li>').join('')+'</ul><p class="acc-l">Ici, vous n’avez rien à prouver à personne.</p>';
  /* 2. La dose du jour, la vraie. Sur le site, la page est écrite à l'avance : introLive() remet la dose d'aujourd'hui. */
  const dose='<div class="dose"><span class="label">'+esc(introDoseLabel())+'</span><p>'+esc(curatedDose())+'</p><span class="sig">Antonio</span></div>';
  /* 3. Déposer : un exemple, avec une question et une lumière prises dans celles de l'espace. */
  const depot='<div class="mirror"><span class="lbl">Un exemple</span><p class="depot you">« Ce soir, j’ai crié pour une histoire de chaussettes. Il a pleuré, et moi aussi après. Je m’en veux. »</p><p class="q">'+esc(LOCAL_Q[1])+'</p><p class="l">'+esc(WORDS[10])+'</p></div>'+
    '<p class="hint">'+(SITE?'Ce que vous écrivez reste sur votre appareil. Personne d’autre ne le lit.':'Votre texte part sans votre nom, et une intelligence artificielle écrit la réponse.')+'</p>';
  /* 4. Le parcours : un schéma à dérouler, les 6 mois et leurs 24 étapes, puis un extrait de ce qu'Antonio raconte à l'étape 2. */
  const sch=schHtml('vague').replace('<span class="label">Le schéma</span>','<span class="label">Un schéma de l’étape 7, à dérouler</span>');
  const mois='<p class="acc-st">Les 6 mois, étape par étape</p><div class="acc-mois">'+PARCOURS.map((m,mi)=>'<details class="mois"'+(mi===0?' open':'')+'><summary><span class="n">'+(mi+1)+'</span><span class="tx"><b>'+esc(m.m)+'</b><span>Mois '+(mi+1)+'</span></span>'+I.chev+'</summary><ol start="'+(mi*4+1)+'">'+m.steps.map(s=>'<li>'+esc(s.t)+'</li>').join('')+'</ol></details>').join('')+'</div>';
  const cr=etape('croire');const vec=Array.isArray(cr.vecu)?cr.vecu.slice(0,2):[];
  const vecu=!vec.length?'':'<div class="card vecu"><div class="from"><span class="av" aria-hidden="true">A</span><div><b>Ce que j’ai vécu</b><small>Antonio, à l’étape 2</small></div></div>'+vec.map(p=>'<p class="lesson">'+esc(p)+'</p>').join('')+'<div class="vecu-lien"><button type="button" class="linkbtn" data-act="peek-about">Lire mon histoire</button></div></div>';
  /* 5. La boîte à outils : les 6 images de la routine du soir, et quelques-unes des situations. */
  const pictos='<p class="acc-st">La routine du soir, en '+ROUTINE_DEF.length+' images</p><ul class="acc-pictos">'+ROUTINE_DEF.map(id=>{const p=PICTOS.find(x=>x[0]===id);return p?'<li class="pc">'+pictoImg(id,72,true)+'<b>'+esc(p[1])+'</b></li>':'';}).join('')+'</ul>';
  const choix=[0,2,3,4,11,8,15,20].map(i=>SITS[i]).filter(Boolean);
  const sits='<p class="acc-st">Quelques-unes des '+SITS.length+' situations</p><ul class="acc-chips">'+choix.map(s=>'<li>'+esc(s.t)+'</li>').join('')+'<li class="plus">et '+(SITS.length-choix.length)+' autres</li></ul>';
  /* 7. Les formules, avec les prix affichés dans l'espace. */
  const F=[['free','La dose chaque jour, toute la boîte à outils, 3 dépôts écoutés et la première étape du parcours.'],['parcours','Les 24 étapes, votre carnet de route, « Mon évolution », le photolangage et des dépôts sans limite.'],['antonio','Tout Le parcours, avec un mot personnel d’Antonio chaque mois et 2 questions par mois.']];
  const plans='<ul class="acc-plans">'+F.map(f=>{const T=TIERS[f[0]];return '<li'+(f[0]==='parcours'?' class="best"':'')+'><div class="h"><b>'+esc(T.t)+'</b><span class="prix">'+T.p+' CHF'+(T.p==='0'?'':' <small>par mois</small>')+'</span></div><p>'+f[1]+'</p></li>';}).join('')+'</ul><button type="button" class="btn" data-act="peek-plans">Voir le détail des formules</button>';
  /* 8. Les questions qu'un parent se pose avant de commencer. */
  const Q=[
    ['Est-ce pour moi si mon enfant n’a pas de diagnostic ?','Oui. Cet espace s’adresse à tous les parents, que votre enfant vive une situation de handicap, que votre famille traverse une période difficile, ou que vous soyez parent, simplement.'],
    ['Qui lit ce que j’écris ?',SITE?'Personne. Dans cette version, tout ce que vous écrivez reste sur votre appareil, et rien n’est envoyé.':'Vos notes restent sur votre appareil. Quand vous déposez, votre texte part sans votre nom, et une intelligence artificielle écrit la réponse.'],
    ['Qui me répond ?',SITE?'Les textes de l’espace sont écrits à l’avance, sous la responsabilité d’Antonio Company. Dans cette version de test, chaque dépôt reçoit une question et une lumière. Dans la version complète, une intelligence artificielle écrira une réponse personnelle, et l’espace vous le dira clairement.':'Quand vous déposez, une intelligence artificielle écrit la réponse, avec la méthode d’Antonio, et l’espace vous le dit. Les autres textes sont écrits à l’avance, sous la responsabilité d’Antonio Company.'],
    ['Combien de temps cela demande-t-il ?','Comptez 5 à 10 minutes par semaine pour lire une étape, puis un essai chez vous et quelques mots dans votre carnet. Si vous vous absentez, rien ne s’accumule, et votre étape vous attend.'],
    ['Est-ce que cela remplace un professionnel ?','Non. Cet espace vous soutient entre deux rendez-vous, et il ne remplace ni un médecin ni un thérapeute. En cas d’urgence, le bouton SOS vous donne les numéros à appeler.']
  ];
  const faq='<div class="acc-faq-l">'+Q.map(q=>'<details class="faq"><summary><span>'+q[0]+'</span>'+I.chev+'</summary><p>'+q[1]+'</p></details>').join('')+'</div>';
  /* 9. La fin : la phrase qu'Antonio adresse aux parents à l'étape 4, puis le bouton. */
  const ob=etape('objectifs');const cit=((typeof ob.vecu==='string'?ob.vecu:'').match(/Vous qui me lisez.*$/)||[''])[0];
  return '<main id="main" tabindex="-1" class="view intro" style="padding-top:0">'+
    '<div class="herofull bleed"><img class="herobg" src="'+HERO+'" alt="Une goutte tombe sur un étang et dessine des cercles, dans la lumière d’une forêt." width="866" height="470" decoding="async" fetchpriority="high"><span class="pill test">Version de test</span><h1>Parent Écouté,<br>Parent Éclairé</h1><span class="by">Par Antonio Company</span><p class="tag">Un espace d’écoute pour tout parent en chemin, pour déposer ce qui pèse, recevoir chaque jour une dose de lumière et avancer pendant 6 mois, à votre rythme.</p>'+cta(false)+
    '<p class="rassure">Gratuit pour commencer, sans carte bancaire. Rien à installer.</p><button type="button" class="voir" data-act="intro-suite">Voir ce qu’il y a dedans'+I.chev+'</button></div>'+
    sec('perm','Ici, vous avez le droit','',perms)+
    sec('dose','Chaque matin, une dose de lumière','Voici celle d’aujourd’hui. Demain, une autre vous attendra.',dose)+
    sec('depot','Un endroit pour déposer ce qui pèse','Vous écrivez ce que vous avez sur le cœur, sans donner de prénom. En retour, vous recevez une question qui ouvre et une lumière.',depot)+
    sec('parcours','6 mois pour comprendre, essayer et avancer','Le parcours compte 24 étapes, une par semaine. À chaque étape, un schéma vous fait comprendre une idée, Antonio vous raconte ce qu’il a vécu, vous essayez chez vous et vous écrivez quelques mots dans votre carnet de route.',sch+mois+vecu)+
    sec('outils','Une boîte à outils pour les jours difficiles','Vous y trouvez '+SITS.length+' situations du quotidien avec des pistes à essayer, '+PICTOS.length+' images pour montrer à votre enfant ce qui vient d’abord et ce qui vient ensuite, des exercices pour souffler, et un bouton SOS.',pictos+sits)+
    '<section class="voice" aria-labelledby="voice-t"><h2 id="voice-t" class="sr">Qui est derrière cet espace</h2><p class="say">Avant d’accompagner des familles, j’ai moi-même été accueilli dans une famille.</p><p>J’ai été placé en famille d’accueil à 10 ans, je suis travailleur social depuis mes 19 ans et je suis père de 3 enfants. Moi aussi, j’ai connu ces périodes où la santé d’un enfant prend beaucoup de place.</p><p>Avec le temps, j’ai appris à composer, à apprendre et à évoluer avec la différence, et c’est ce que j’ai voulu mettre dans cet espace.</p><div class="who"><span class="av" aria-hidden="true">A</span><b>Antonio Company</b><button type="button" class="btn small" data-act="peek-about">Lire mon histoire</button></div></section>'+
    sec('formules','Vous commencez gratuitement','Pendant la version de test, vous pouvez essayer chaque formule sans rien payer, et la formule « Avec Antonio » est une démonstration. Voici les prix prévus pour la Suisse.',plans)+
    sec('faq','Vos questions','',faq)+
    '<section class="acc-fin" aria-label="Pour commencer"><img class="finbg" src="'+HERO+'" alt="" width="866" height="470" loading="lazy" decoding="async">'+(cit?'<blockquote><p>'+esc(cit)+'</p><footer>Antonio</footer></blockquote>':'')+cta(true)+'</section>'+
    '<p class="hint" style="text-align:center">'+priv+'</p>'+
    '<div class="cta-flot">'+cta(false)+'</div></main>'+
    '<footer class="foot"><button type="button" class="linkbtn" data-act="peek-plans">Formules</button>'+(SITE?'<a href="confidentialite.html">Confidentialité</a><a href="conditions.html">Conditions générales</a>'+(MENTIONS?'<a href="mentions-legales.html">Mentions légales</a>':''):'')+'</footer>';
}
/* Ce qui vit sur l'accueil une fois la page à l'écran : la dose du jour (la page a pu être écrite un autre jour),
   et le bouton flottant, qui apparaît quand le bouton du haut est sorti de l'écran et s'efface quand celui du bas arrive. */
let introIO=null;
function introLive(){
  if(introIO){try{introIO.disconnect();}catch(e){}introIO=null;}
  const app=document.getElementById('app');if(!app||!app.querySelector)return;const m=app.querySelector('main.intro');if(!m)return;
  const dp=m.querySelector('.acc-dose .dose p'),dl=m.querySelector('.acc-dose .dose .label');
  if(dp){const tx=curatedDose();if(dp.textContent!==tx)dp.textContent=tx;}
  if(dl){const lb=introDoseLabel();if(dl.textContent!==lb)dl.textContent=lb;}
  const fl=m.querySelector('.cta-flot'),haut=m.querySelector('.herofull'),bas=m.querySelector('.acc-fin');
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
function viewToday(){
  const d=D();const t=todayIso();const m=d.moods[t];const st=allSteps()[currentStepIdx()];const rd=recentDepot();
  let html='<main id="main" tabindex="-1" class="view" style="padding-top:0"><div class="band bleed" style="background-image:url('+HERO+')"><span class="label">'+esc(jourLong())+'</span><h1 class="t1">'+esc(greeting())+(d.me?', '+esc(d.me):'')+'.</h1>'+filHtml()+'</div>';
  html+='<div class="duo"><div class="duo-a">';
  if(can('antonio'))html+=letterCard();
  if(!d.evo.t1)html+='<button type="button" class="card reveal d1" data-act="go" data-view="evo" style="text-align:left;cursor:pointer;border-color:var(--green)"><div class="row" style="justify-content:space-between;align-items:center"><span class="label" style="color:var(--green)">Pour commencer, 3 minutes</span><span class="pill green">Étape 1</span></div><p class="lesson" style="font-size:20px">Le questionnaire de départ</p><span class="hint">Il y a cinq échelles de 0 à 10 et deux questions pour voir où vous en êtes aujourd’hui. Vous le referez à trois mois puis à six mois, et c’est ce qui vous montrera le chemin parcouru.</span><span class="btn primary small" style="align-self:flex-start;margin-top:4px">'+I.chart+'Faire mon point de départ</span></button>';
  html+='<div class="dose reveal d1"><span class="label">'+(new Date().getDay()===0?'Dose spéciale du dimanche':'La dose de lumière intérieure')+'</span><p>'+esc(doseText())+'</p>'+(d.doseDate===t&&d.doseText?'<span class="sig">Écrite pour vous par une intelligence artificielle, dans l’esprit d’Antonio</span>':'<div class="sigrow"><span class="sig">Antonio</span><button type="button" class="linkbtn" data-act="go" data-view="about">Lire mon histoire</button></div>')+
    (rd&&state.sample?(can('parcours')?'<div class="row"><button type="button" class="btn small" data-act="dose-perso"'+(state.doseBusy?' disabled':'')+'>'+I.sun2+(state.doseBusy?'Un instant…':(d.doseDate===t?'Une autre dose pour moi':'Ma dose, d’après ce que j’ai déposé'))+'</button></div>':'<div class="row"><button type="button" class="btn small" data-act="upgrade" data-f="dose">'+I.lock+'Ma dose personnalisée</button></div>'):'')+'</div>';
  /* L'étape de la semaine, en grand : où l'on en est, ce que l'on y trouvera, et un seul geste. */
  const stFait=!!d.steps[st.id];const stAp=st.idx<23?stepEtat(st.idx+1):null;const stSuiv=st.idx<23?allSteps()[st.idx+1]:null;
  const stLab=!stFait?'L’étape de la semaine':(stAp&&stAp.k==='bientot'?'Étape faite. La suivante s’ouvre '+dansJours(stAp.n)+'.':'Étape faite');
  html+='<button type="button" class="step now semaine'+(stFait?' done':'')+' reveal d2" data-act="step" data-i="'+st.idx+'"><span class="haut"><span class="n" style="--p:'+Math.round(doneCount()/24*100)+'">'+(stFait?I.check:(st.idx+1))+'</span><span class="tx"><span class="label">'+stLab+'</span><b>'+esc(st.t)+'</b><span class="ou">Étape '+(st.idx+1)+' sur 24, '+esc(PARCOURS[st.mi].m)+'</span></span></span>'+
    (!stFait&&st.acc?'<span class="promesse">'+esc(st.acc)+'</span>':'')+
    (stFait&&stSuiv&&stSuiv.acc?'<span class="promesse"><b>Ensuite, '+esc(stSuiv.t)+'.</b> '+esc(stSuiv.acc)+'</span>':'')+
    '<span class="btn primary small aller">'+I.path+(stFait?'Relire l’étape':(d.seen[st.id]?'Reprendre l’étape':'Ouvrir l’étape'))+'</span></button>';
  html+='</div><div class="duo-b">';
  html+=depotBox();
  html+='<div class="card reveal d4"><span class="label">Comment ça va, là, maintenant ?</span><div class="moodrow">'+MOODS.map((x,i)=>'<button type="button" data-act="mood" data-i="'+i+'" aria-pressed="'+(m===i)+'" aria-label="'+esc(x[1])+'">'+x[0]+'</button>').join('')+'</div>'+(m!==undefined?'<p style="font-family:var(--font-display);font-size:17px;line-height:1.4">'+esc(MOOD_WORDS[m])+'</p>':'')+'</div>';
  return html+'</div></div></main>';
}
function letterCard(){
  const L=D().letters;const l=L.length?L[L.length-1]:null;
  const txt=l?l.text:LETTER_EXAMPLE;
  return '<button type="button" class="letter reveal d1" data-act="letter" data-i="'+(l?L.length-1:-1)+'"><div class="from"><span class="av" aria-hidden="true">A</span><div><b>'+(l?'Le mot d’Antonio '+esc(deMois(l.date)):'Le mot d’Antonio, un exemple')+'</b><span>'+(l?esc(fmtDate(l.date)):'Démonstration de ce qu’il sera')+'</span></div></div><p>'+esc(txt.split('\n')[0])+'</p><span class="hint">'+(l?'Lire ':'Lire l’exemple ')+I.chev+'</span></button>';
}
function depotBox(){
  const left=depotsLeft();const today=todayIso();const td=D().depots.filter(x=>x.date===today).slice(-1)[0];
  const head=lab=>'<div class="row" style="justify-content:space-between;align-items:center">'+lab+(left!==Infinity&&left>0?'<span class="pill">'+left+' dépôt'+(left>1?'s':'')+' offert'+(left>1?'s':'')+'</span>':'')+'</div>';
  let html='<div class="card reveal d2">';
  if(left===0){
    html+=head('<span class="label">Déposer ce qui pèse</span>')+'<p class="lesson" style="font-size:18px">Vos trois dépôts Découverte sont utilisés.</p>'+lockline('Déposer sans limite, avec la phrase-miroir','depots')+'<button type="button" class="btn primary" data-act="upgrade" data-f="depots" style="align-self:flex-start">Passer au Parcours pour 14 CHF par mois</button>';
  }else{
    html+=head('<label class="label" for="draft">Déposer ce qui pèse</label>')+
      '<div class="chips attente" role="group" aria-label="Ce que vous attendez"><button type="button" class="chip" data-act="dmode" data-v="listen" aria-pressed="'+(state.depotMode==='listen')+'">Écoutez-moi</button><button type="button" class="chip" data-act="dmode" data-v="advice" aria-pressed="'+(state.depotMode==='advice')+'">Et concrètement, je fais quoi ?</button></div>'+
      '<textarea id="draft" maxlength="'+LIM.draft+'" placeholder="Qu’est-ce qui pèse, là, maintenant ? Écrivez comme ça vient, sans prénom." style="min-height:110px">'+esc(state.draft)+'</textarea>'+
      '<div class="row" style="align-items:center">'+(state.busy?'<button type="button" class="btn" data-act="dstop">'+I.stop+'Arrêter</button>':'<button type="button" class="btn primary" data-act="dsend">'+I.drop+'Déposer</button>')+'<span class="count" id="draft-count" aria-hidden="true"></span></div>'+
      (state.sample?'<p class="hint">La réponse est écrite par une intelligence artificielle, avec la méthode d’Antonio. Ce n’est pas Antonio qui vous répond ici.</p>':'')+
      (state.sample===false?'<p class="hint">Dans cette version de test, votre texte ne quitte pas votre appareil. Vous recevez une question et une lumière choisies par l’application, et la phrase-miroir arrivera avec la version complète.</p>':'');
  }
  if(state.busy)html+='<div class="mirror"><div class="think" role="status"><span class="dotp"></span>Je vous lis…</div></div>';
  if(td&&!state.busy)html+=depotHtml(td,true);
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
  if(row.length)out+='<div class="row" style="align-items:center">'+row.join('')+'</div>';
  return out+'</div>';
}
/* ---------- écoute ---------- */
const LOCAL_Q=['Qu’est-ce qui, dans tout ça, dépend vraiment de vous ?','Si une amie vivait exactement cela, que lui diriez-vous ?','Qu’est-ce qui vous a tenu debout aujourd’hui, même un peu ?','De quoi auriez-vous besoin ce soir, en une phrase ?','Qu’est-ce que votre enfant a fait aujourd’hui que vous n’avez pas eu le temps de voir ?'];
function ctx(){return 'enfant '+AGES[D().age].toLowerCase()+' ; ce qui pèse le plus pour ce parent : '+(D().weights.length?D().weights.map(w=>(WEIGHTS.find(x=>x[0]===w)||['',w])[1].toLowerCase()).join(', '):'non précisé');}
function listenPrompt(text){
  return 'Tu es la voix de « Parent Écouté, Parent Éclairé », un espace d’écoute créé par Antonio Company, travailleur social depuis ses 19 ans (responsable d’une équipe socio-éducative, auprès de personnes en situation de handicap ou en difficulté et de leurs familles ; père de trois enfants ; il a lui-même connu la famille d’accueil dans son enfance). Un parent vient de déposer ce qui pèse. Ta tâche : l’écouter, pas le conseiller. Réponds UNIQUEMENT avec un objet JSON : {"miroir":"...","question":"...","lumiere":"..."}.\n'+
  '« miroir » : une ou deux phrases qui reformulent ce que le parent vit, avec ses mots, en nommant l’émotion probable sans l’imposer (« on dirait que… »), sans aucun conseil, sans jugement, sans minimiser. « question » : une seule question ouverte, courte, qui aide le parent à voir plus clair ou à se reconnecter à ses ressources ; jamais « pourquoi ». « lumiere » : une phrase chaleureuse et vraie, jamais mièvre, qui reconnaît ce que le parent fait déjà, ou lui donne une permission (droit à la fatigue, à la colère, au repos). Français de Suisse romande, vouvoiement, aucun prénom, aucun diagnostic. Écris comme Antonio parle, avec des phrases simples et complètes, reliées par « et », « mais » ou « parce que ». N’utilise ni deux-points, ni point-virgule, ni tiret long, ni point médian, ni phrase sans verbe, ni formule du type « pas ceci, pas cela ». Si le message évoque un danger immédiat (idées suicidaires, violence grave), « lumiere » commence par inviter doucement à appeler le 143 (La Main Tendue) ou le 144.\n\nContexte : '+ctx()+'.\n\nDÉPÔT :\n"""\n'+text.slice(0,6000)+'\n"""';
}
function advicePrompt(){
  return 'Tu es la voix de « Parent Écouté, Parent Éclairé », celle d’un travailleur social expérimenté (dans le métier depuis ses 19 ans, auprès d’enfants, d’adolescents et d’adultes en situation de handicap ou en difficulté, responsable d’une équipe socio-éducative, père). Tu parles à un parent, en français de Suisse romande, vouvoiement, chaleur, zéro jargon, zéro jugement. Aucun diagnostic, aucun trouble nommé, aucun médicament, aucun prénom. Contexte : '+ctx()+'.\n'+
  'Structure en quatre parties courtes avec ces titres exacts précédés de « ## » : « Ce que j’entends » (deux phrases, sans juger, qui reconnaissent l’effort), « Ce que vous pouvez essayer » (trois pistes concrètes en liste à puces, réalistes ce soir ou cette semaine : prévisibilité, moins de mots, choix entre deux options, d’abord/ensuite, routines visuelles, sécurité d’abord, observer ce qui précède), « Pour vous » (une ou deux phrases pour le parent lui-même), « Si ça continue » (une phrase : quand et à qui demander de l’aide, sans dramatiser ; pédiatre ou médecin, l’équipe de l’institution ou de l’école, Pro Infirmis, associations de parents ; La Main Tendue 143 si le parent va très mal). Écris comme Antonio parle, avec des phrases simples et complètes, reliées par « et », « mais » ou « parce que ». N’utilise ni deux-points, ni point-virgule, ni tiret long, ni point médian, ni phrase sans verbe, ni formule du type « pas ceci, pas cela ». Maximum 200 mots. Pas de gras. Termine par une phrase simple et vraie.';
}
const RISK=/(suicid|me tuer|en finir|plus envie de vivre|le tuer|la tuer|je vais le frapper|je vais la frapper)/i;
async function sendDepot(){
  if(state.busy||state.sinking)return;
  const text=clean(state.draft,LIM.draft);if(text.length<5){fieldErr('draft','Écrivez quelques mots, comme ça vient (cinq caractères au moins).');return;}
  if(depotsLeft()===0){openUpgrade('depots');render();return;}
  const d=D();const n=new Date();const dep={id:'d'+Date.now(),date:todayIso(),time:pad(n.getHours())+':'+pad(n.getMinutes()),text,mode:state.depotMode};
  if(RISK.test(text)){dep.risk=true;toast('Si c’est urgent, appelez le 143 (La Main Tendue) ou le 144, de jour comme de nuit.');}
  state.sinking=true;await fxSink();state.sinking=false;
  state.draft='';state.busy=true;render();
  if(!state.sample){
    dep.question=LOCAL_Q[dayIdx(LOCAL_Q.length)];dep.lumiere=WORDS[(dayIdx(WORDS.length)+3)%WORDS.length];
    d.depots.push(dep);state.busy=false;state.fresh=dep.id;save();render();setTimeout(()=>{state.fresh=null;},1900);if(!dep.risk)toast('C’est déposé et gardé pour vous.');return;
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
  d.depots.push(dep);state.busy=false;state.ctl=null;state.fresh=dep.id;save();render();setTimeout(()=>{state.fresh=null;},1900);
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
    (can('parcours')||d.tout?'<p class="hint">Une étape s’ouvre 7 jours après la précédente, pour vous laisser le temps d’essayer. Si vous vous absentez, rien ne s’accumule, et votre étape vous attend.</p>':lockline('Les 23 étapes suivantes font partie du Parcours, à 14 CHF par mois','parcours'))+'</main>';
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
  if(!n)return h+'<div class="card"><p>Votre carnet est encore vide. Il se remplira avec ce que vous écrirez à la fin de chaque étape.</p><button type="button" class="btn primary" data-act="step" data-i="'+currentStepIdx()+'" style="align-self:flex-start">'+I.path+'Ouvrir mon étape</button></div></main>';
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
  let h='<main id="main" tabindex="-1" class="view final"><div class="fin-couv"><span class="label">Parent Écouté, Parent Éclairé</span><h1 class="t1">'+(d.me?'Le chemin de '+esc(d.me):'Mon chemin')+'</h1>'+
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
function schHtml(key){
  const S=SCHEMAS[key];if(!S)return '';
  const n=S.caps.length,k=schK(S);
  return '<div class="card sch" data-sch="'+key+'"><span class="label">Le schéma</span>'+
    '<svg class="sch-svg" viewBox="'+S.vb+'" role="img" aria-label="'+esc(S.alt)+'">'+S.base+S.l.map(x=>'<g class="sp'+(x[0]<=k?' on':'')+'" data-p="'+x[0]+'">'+x[1]+'</g>').join('')+'</svg>'+
    '<ol class="sch-caps" aria-live="polite">'+S.caps.map((c,i)=>'<li class="'+(i<k?'on':'')+(i===k-1?' cur':'')+'">'+esc(c)+'</li>').join('')+'</ol>'+
    '<div class="sch-nav"><span class="sch-pos">'+k+' sur '+n+'</span><button type="button" class="btn small'+(k<n?' primary':'')+'" data-act="'+(k<n?'schnext':'schagain')+'">'+(k<n?'Voir la suite'+I.chev:'Revoir depuis le début')+'</button></div></div>';
}
function schSync(neuf){
  const box=document.querySelector('.sch');if(!box)return;const S=SCHEMAS[box.dataset.sch];if(!S)return;
  const n=S.caps.length,k=schK(S);
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
function evoQ(o){const q=o[1];return typeof q==='string'?q:(q[D().situation]||q.hand);}
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
const PHOTO_DIR=SITE?'img/photos/':'https://parent-ecoute.ch/img/photos/';
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

/* ---------- boîte à outils ---------- */
function viewKit(){
  const seg='<div class="seg" role="group" aria-label="Rubriques de la boîte à outils"><button type="button" data-act="kit" data-v="sits" aria-pressed="'+(state.kit==='sits')+'">Situations</button><button type="button" data-act="kit" data-v="tools" aria-pressed="'+(state.kit==='tools')+'">Outils</button><button type="button" data-act="kit" data-v="me" aria-pressed="'+(state.kit==='me')+'">Pour moi</button></div>';
  let body='';
  if(state.kit==='sits')body=kitSits();else if(state.kit==='tools')body=kitTools();else body=kitMe();
  return '<main id="main" tabindex="-1" class="view k-'+state.kit+'" style="padding-top:0"><div class="band thin bleed" style="background-image:url('+HERO+');background-position:left 55%"><h1 class="t1">La boîte à outils</h1></div><p class="sub">'+(state.kit==='sits'?'Vous trouverez ici vingt-deux situations de la vraie vie, avec des pistes venues du terrain et toujours un mot pour vous.':state.kit==='tools'?'Ce sont les outils que les éducateurs utilisent tous les jours, et vous pouvez les poser sur la table de la cuisine.':'Deux minutes rien que pour vous, parce que vous êtes aussi une personne et pas seulement un parent.')+'</p>'+seg+body+'</main>';
}
/* Les situations sont rangées par thèmes : chaque thème a son titre, son compte et sa liste. Une recherche donne une seule liste. */
const GROUPES=[['comp','Le comportement'],['comm','La communication'],['quot','Le quotidien'],['ecole','L’école, les professionnels, l’avenir'],['fam','La famille'],['moi','Vous, parent']];
function sitRow(s){return '<button type="button" class="sit" data-act="sit" data-id="'+s.id+'"><span class="e">'+s.e+'</span><span class="tx"><b>'+esc(s.t)+'</b><span>'+esc(s.s)+'</span></span><span class="chev">'+I.chev+'</span></button>';}
function kitSits(){
  let list=SITS.filter(s=>state.age==='all'||s.ages.includes(state.age));
  const q=state.q.trim().toLowerCase();if(q)list=list.filter(s=>(s.t+' '+s.s+' '+s.comp).toLowerCase().includes(q));
  const corps=!list.length?'<p class="hint">Je n’ai rien trouvé pour ce mot. Vous pouvez le déposer sur l’accueil, et vous recevrez une réponse.</p>':
    q?'<div class="grp"><div class="liste">'+list.map(sitRow).join('')+'</div></div>':
    GROUPES.map(g=>{const L=list.filter(s=>s.th===g[0]);return L.length?'<section class="grp"><h2><span class="nom">'+g[1]+'</span><span class="nb" aria-hidden="true">'+L.length+'</span></h2><div class="liste">'+L.map(sitRow).join('')+'</div></section>':'';}).join('');
  return '<div class="search">'+I.search+'<input type="search" id="q" aria-label="Chercher une situation" maxlength="'+LIM.search+'" placeholder="Coucher, crise, école…" value="'+esc(state.q)+'" autocomplete="off" enterkeyhint="search"></div>'+
    '<div class="chips scroll" role="group" aria-label="Âge">'+Object.keys(AGES).map(k=>'<button type="button" class="chip" data-act="age" data-v="'+k+'" aria-pressed="'+(state.age===k)+'">'+AGES[k]+'</button>').join('')+'</div>'+
    '<div class="sits groupes'+(q?' trouve':'')+'">'+corps+'</div>';
}
function viewSit(){
  const s=SITS.find(x=>x.id===state.sit);if(!s){state.view='kit';return viewKit();}
  const li=a=>'<ul class="list">'+a.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
  /* Les autres situations du même thème, pour continuer sans repasser par la liste. */
  const pr=SITS.filter(x=>x.th===s.th&&x.id!==s.id).slice(0,3);
  return '<main id="main" tabindex="-1" class="view fiche"><div class="couv"><span class="med" aria-hidden="true">'+s.e+'</span><span class="label">'+esc(liste(s.ages.map((a,i)=>i?AGES[a].toLowerCase():AGES[a])))+'</span><h1 class="t1">'+esc(s.t)+'</h1><p class="sub">'+esc(s.s)+'</p></div>'+
    '<div class="card sec comp"><h2><span class="dot"></span>Ce qui se passe</h2><p>'+esc(s.comp)+'</p></div>'+
    '<div class="card sec ess"><h2><span class="dot"></span>Ce que vous pouvez essayer</h2>'+li(s.ess)+'</div>'+
    '<div class="card sec ev"><h2><span class="dot"></span>Ce qu’il vaut mieux éviter</h2>'+li(s.ev)+'</div>'+
    '<div class="comfort"><span class="label">Un mot pour vous</span><p>'+esc(s.moi)+'</p></div>'+
    '<div class="card sec aide"><h2><span class="dot"></span>Quand demander de l’aide</h2><p>'+esc(s.aide)+'</p></div>'+
    '<div class="quick"><button type="button" class="btn" data-act="go" data-view="today">'+I.drop+'Déposer</button><button type="button" class="btn" data-act="kit" data-v="tools">'+I.tools+'Les outils</button></div>'+
    (pr.length?'<section class="grp proches"><h2><span class="nom">Dans le même thème</span></h2><div class="liste">'+pr.map(sitRow).join('')+'</div></section>':'')+'</main>';
}
function kitTools(){
  const tabs=[['timer','Minuteur'],['ft','D’abord, ensuite'],['routine','Routine'],['abc','Journal'],['phr','Mes phrases']];
  const seg='<div class="chips scroll" role="group" aria-label="Outils">'+tabs.map(t=>'<button type="button" class="chip" data-act="tool" data-v="'+t[0]+'" aria-pressed="'+(state.tool===t[0])+'">'+t[1]+'</button>').join('')+'</div>';
  let body='';
  if(state.tool==='timer')body=toolTimer();else if(state.tool==='ft')body=toolFT();else if(state.tool==='routine')body=toolRoutine();else if(state.tool==='abc')body=toolABC();else body=toolPhr();
  return seg+body;
}
function toolTimer(){const t=state.timer;const mins=[1,2,3,5,10,15];return '<div class="card green" style="align-items:center"><span class="label">Minuteur visuel</span><p class="hint" style="text-align:center">Votre enfant voit le temps qui reste. Vous pouvez lui dire « Quand le vert a disparu, on range ».</p><div class="timerwrap"><div class="ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" style="fill:none;stroke:var(--surface);stroke-width:12"/><circle id="arc" cx="60" cy="60" r="52" style="fill:none;stroke:var(--green);stroke-width:12;stroke-linecap:round;stroke-dasharray:326.7;stroke-dashoffset:0"/></svg><div class="num" id="tnum">'+Math.floor(t.left/60)+':'+pad(t.left%60)+'</div></div><div class="bigrow">'+mins.map(m=>'<button type="button" class="btn small'+(t.total===m*60?' primary':'')+'" data-act="tset" data-m="'+m+'">'+m+' min</button>').join('')+'</div><div class="bigrow"><button type="button" class="btn primary" data-act="ttoggle">'+(t.running?I.stop+'Pause':I.timer+'Lancer')+'</button><button type="button" class="btn" data-act="treset">Remettre</button></div></div></div>';}
function drawTimer(){const t=state.timer;const arc=document.getElementById('arc');const num=document.getElementById('tnum');if(!arc||!num)return;const frac=t.total?t.left/t.total:0;arc.style.strokeDashoffset=String(326.7*(1-frac));num.textContent=Math.floor(t.left/60)+':'+pad(t.left%60);arc.style.stroke=frac<.2?'var(--coral)':'var(--green)';}
function tick(){const t=state.timer;if(!t.running)return;t.left=Math.max(0,t.left-1);drawTimer();if(t.left===0){t.running=false;clearInterval(t.h);t.h=null;try{if(navigator.vibrate)navigator.vibrate([200,100,200]);}catch(e){}toast('C’est fini. Bravo.');render();}}
function stopTimer(){const t=state.timer;t.running=false;if(t.h){clearInterval(t.h);t.h=null;}}
/* ---------- « D'abord, ensuite » et la routine : des cartes-images ---------- */
/* Les images sont des cartes blanches, une seule chose par carte, avec le mot dessous. Le tableau choisi est gardé sur l'appareil (data.ft).
   Toucher une image ou une case ne redessine pas l'écran : seules les parties qui changent sont mises à jour, pour que les images ne clignotent pas. */
const PICTO_DIR=SITE?'img/pictos/':'https://parent-ecoute.ch/img/pictos/';
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
  else if(x.id==='deposer')body='<div class="card"><textarea id="dep" aria-label="Ce qui pèse (rien n’est gardé)" maxlength="10000" style="min-height:200px" placeholder="Tout ce qui tourne…"></textarea><button type="button" class="btn primary" data-act="depose" style="align-self:flex-start">'+I.wind+'Déposer et effacer</button><p class="hint">Rien n’est enregistré, et le texte disparaît dès que vous appuyez. Si vous souhaitez une réponse, utilisez plutôt « Déposer » sur l’accueil.</p></div>';
  else if(x.id==='droit')body='<div class="perm">'+PERMISSIONS.map(p=>'<div><b>'+esc(p[0])+'</b> '+esc(p[1])+'</div>').join('')+'</div>';
  else if(x.id==='minute')body='<div class="card green" style="align-items:center"><div class="ring" style="width:200px;height:200px"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" style="fill:none;stroke:var(--surface);stroke-width:12"/><circle id="arc" cx="60" cy="60" r="52" style="fill:none;stroke:var(--green);stroke-width:12;stroke-linecap:round;stroke-dasharray:326.7;stroke-dashoffset:0"/></svg><div class="num" id="tnum" style="font-size:44px">'+Math.floor(state.timer.left/60)+':'+pad(state.timer.left%60)+'</div></div><button type="button" class="btn primary" data-act="minute">'+(state.timer.running?I.stop+'Arrêter':I.timer+'Une minute')+'</button></div>';
  else if(x.id==='appeler')body='<div class="log">'+HELP.map(h=>'<div class="logi"><b>'+esc(h.t)+'</b>'+(h.tel?'<span style="font-size:22px">'+tel(h.tel)+'</span>':'<a href="'+h.url+'" target="_blank" rel="noopener noreferrer" style="font-size:18px;font-weight:800">'+esc(h.label)+' '+I.ext+'<span class="sr"> (nouvel onglet)</span></a>')+'<span class="hint">'+esc(h.d)+'</span></div>').join('')+'</div>';
  return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">'+esc(x.t)+'</h1>'+(x.how?'<p class="sub">'+esc(x.how)+'</p>':'')+'</div>'+body+'</main>';
}
function viewSOS(){
  return '<main id="main" tabindex="-1" class="view sosview" style="padding-top:14px"><header class="bar"><button type="button" class="back" data-act="go" data-view="today">'+I.back+'Sortir</button></header>'+
    '<div><h1 class="t1" style="color:var(--coral)">Là, maintenant.</h1><p class="sub">Vous n’avez rien à réussir, juste à laisser passer la vague. Suivez ces quatre étapes dans l’ordre.</p></div>'+
    '<div class="sosstep"><span class="n">1</span><div class="tx"><b>Sécurité</b><span>Écartez ce qui peut blesser et laissez de la place. Ne retenez pas votre enfant si ce n’est pas nécessaire.</span></div></div>'+
    '<div class="sosstep"><span class="n">2</span><div class="tx"><b>Moins</b><span>Mettez moins de mots, moins de lumière et moins de bruit. Répétez calmement une seule phrase, par exemple « Je suis là, on attend ».</span></div></div>'+
    '<div class="sosstep"><span class="n">3</span><div class="tx"><b>Vous</b><span>Posez vos pieds bien au sol et respirez avec le cercle. Si tout est sûr, vous avez le droit de sortir trente secondes.</span></div></div>'+
    '<div class="breath"><div class="orbwrap" aria-hidden="true"><div class="orb"></div></div><div class="txt">Inspirez… expirez…</div></div>'+
    '<div class="sosstep"><span class="n">4</span><div class="tx"><b>Après</b><span>Proposez un verre d’eau et un geste doux s’il est accepté. Ne revenez pas sur la scène et ne punissez pas, parce qu’on ne punit pas une vague. Plus tard, notez ce qui s’est passé juste avant.</span></div></div>'+
    '<div class="emg"><b>Si quelqu’un est en danger</b><span>Appelez le '+tel('144')+' pour les urgences ou le '+tel('117')+' pour la police.</span><span>Si c’est vous qui n’en pouvez plus, appelez La Main Tendue au '+tel('143')+', de jour comme de nuit.</span></div>'+
    '<button type="button" class="btn primary wide" data-act="go" data-view="today">C’est passé, je reviens</button><p class="hint">Ce que vous venez de faire, c’est exactement ce qu’un professionnel aurait fait.</p></main>';
}
/* ---------- moi ---------- */
function moodDots(){const d=D();const out=[];for(let i=13;i>=0;i--){const dt=new Date(Date.now()-i*86400000);const k=dt.getFullYear()+'-'+pad(dt.getMonth()+1)+'-'+pad(dt.getDate());const m=d.moods[k];out.push('<i class="'+(m!==undefined?'m'+m:'')+'"></i>');}const n=out.filter(x=>x.indexOf('class="m')>0).length;return '<div class="mooddots" role="img" aria-label="Humeur notée '+n+' jour'+(n>1?'s':'')+' sur les quatorze derniers">'+out.join('')+'</div>';}
function viewMe(){
  const d=D();const T=TIERS[tier()];const ld=lastDepot();const ql=questionsLeft();
  const nf=doneCount(),np=nbNotes(),nd=d.depots.length;const dep=d.start?dateLongue(d.start):'';
  /* Trois chiffres en haut : les étapes faites, les pages écrites, les dépôts. Chacun mène à son écran. */
  const trio='<div class="trio"><button type="button" data-act="go" data-view="parcours"><b>'+nf+'</b><span>étape'+(nf>1?'s':'')+' faite'+(nf>1?'s':'')+'</span></button><button type="button" data-act="go" data-view="carnet"><b>'+np+'</b><span>page'+(np>1?'s':'')+' écrite'+(np>1?'s':'')+'</span></button><button type="button" data-act="go" data-view="depots"><b>'+nd+'</b><span>dépôt'+(nd>1?'s':'')+'</span></button></div>';
  return '<main id="main" tabindex="-1" class="view moi" style="padding-top:0"><div class="band thin bleed" style="background-image:url('+HERO+');background-position:right 70%"><h1 class="t1" data-act="atelier">Moi</h1></div><p class="sub">'+(dep?'Vous avez commencé le '+esc(dep)+'. ':'')+'Vous retrouvez ici votre formule, vos dépôts, votre carnet, votre humeur et vos réglages.</p>'+
    '<div class="duo"><div class="duo-a">'+trio+'<div class="card"><span class="label">Ma formule</span><div class="row" style="align-items:center;justify-content:space-between">'+badge()+'<span class="price" style="font-family:var(--font-display);font-size:22px">'+esc(T.p)+' CHF <small style="font-size:13px;color:var(--muted);font-family:var(--font-ui);font-weight:700">'+esc(T.per)+'</small></span></div>'+
    (tier()==='free'?'<p class="hint">Vous avez la dose, la boîte à outils, le SOS, trois dépôts écoutés et la première étape. Il vous reste '+depotsLeft()+' dépôt'+(depotsLeft()>1?'s':'')+'.</p>':tier()==='parcours'?'<p class="hint">Vous avez les dépôts sans limite, la dose personnalisée, les 24 étapes, Mon évolution et le photolangage.</p>':'<p class="hint">Vous avez tout Le parcours, le mot d’Antonio chaque mois et deux questions par mois.</p>')+
    '<button type="button" class="btn'+(tier()==='free'?' primary':'')+'" data-act="go" data-view="plans" style="align-self:flex-start">'+I.tag+(tier()==='free'?'Voir les formules':'Changer de formule')+'</button></div>'+
    (can('antonio')?'<button type="button" class="sit" data-act="go" data-view="antonio"><span class="e">'+I.mail+'</span><span class="tx"><b>Mes échanges avec Antonio</b><span>'+(DEMO?'Démonstration avec un exemple de mot et de réponse':'Prochain mot le '+esc(nextLetterDate())+', il vous reste '+ql+' question'+(ql>1?'s':''))+'</span></span><span class="chev">'+I.chev+'</span></button>':'<button type="button" class="sit" data-act="upgrade" data-f="antonio"><span class="e">'+I.lock+'</span><span class="tx"><b>Avec Antonio</b><span>Un mot par mois et deux questions</span></span><span class="chev">'+I.chev+'</span></button>')+
    '<button type="button" class="sit" data-act="go" data-view="final"><span class="e">'+I.path+'</span><span class="tx"><b>Mon chemin</b><span>Tout votre parcours sur une page, à garder ou à imprimer</span></span><span class="chev">'+I.chev+'</span></button>'+
    '</div><div class="duo-b"><div class="card"><span class="label">Mon humeur, quatorze jours</span>'+moodDots()+'<p class="hint">Chaque carré représente un jour, du plus ancien au plus récent. C’est ce qu’Antonio regardera en premier dans la formule Avec Antonio.</p></div>'+
    '<div class="menu-list"><button type="button" data-act="fx" aria-pressed="'+(!d.fxOff)+'">'+I.sun2+'<span>Effets visuels</span><span class="state">'+(FX_RM&&FX_RM.matches?'Coupés par votre appareil':d.fxOff?'Désactivés':(fxOn()&&eauInit()===false?'Activés, sans l’eau':'Activés'))+'</span></button>'+(d.atelier?'<button type="button" data-act="tout" aria-pressed="'+(!!d.tout)+'">'+I.path+'<span>Tout voir, l’aperçu d’Antonio</span><span class="state">'+(d.tout?'Activé':'Désactivé')+'</span></button>':'')+'<button type="button" data-act="onboard">'+I.swap+'<span>Modifier le début (prénom, âge, situation)</span><span class="chev">'+I.chev+'</span></button><button type="button" data-act="go" data-view="data">'+I.download+'<span>Vos données et tout recommencer</span><span class="chev">'+I.chev+'</span></button><button type="button" data-act="go" data-view="about">'+I.info+'<span>L’histoire d’Antonio</span><span class="chev">'+I.chev+'</span></button>'+
    (SITE?'<a href="confidentialite.html">'+I.shield+'<span>Politique de confidentialité</span><span class="chev">'+I.chev+'</span></a><a href="conditions.html">'+I.note+'<span>Conditions générales</span><span class="chev">'+I.chev+'</span></a>'+(MENTIONS?'<a href="mentions-legales.html">'+I.info+'<span>Mentions légales</span><span class="chev">'+I.chev+'</span></a>':''):'')+'</div></div></div></main>';
}
function viewDepots(){
  const list=D().depots.slice().reverse();
  return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">Mes dépôts</h1><p class="sub">Vous retrouvez ici tout ce que vous avez déposé et ce que vous avez reçu en retour. Tout reste sur votre appareil.'+(can('antonio')?(DEMO?' Dans la version complète, Antonio ne lira que les dépôts cochés « Partager ». Dans cette version de test, rien ne lui est transmis.':' Seuls les dépôts cochés « Partager » sont lus par Antonio.'):'')+'</p></div>'+
    (list.length?'<div class="depots">'+list.map(x=>depotHtml(x,false)).join('')+'</div>':'<div class="card"><p>Vous n’avez encore rien déposé. Le premier dépôt se fait sur l’accueil, dans « Déposer ce qui pèse ».</p><button type="button" class="btn primary" data-act="go" data-view="today" style="align-self:flex-start">'+I.drop+'Déposer</button></div>')+'</main>';
}
/* ---------- formules ---------- */
function cell(v){if(v===true)return '<td>'+I.check+'<span class="sr">inclus</span></td>';if(v===false)return '<td class="no"><span class="sr">non inclus</span></td>';return '<td class="tx">'+esc(v)+'</td>';}
function viewPlans(){
  const t=tier();const peek=!D().onboarded;
  const btn=k=>{
    const name=TIERS[k].t;
    if(peek)return k==='free'?'<button type="button" class="btn wide" data-act="onboard">Commencer gratuitement</button>':'<button type="button" class="btn'+(k==='parcours'?' primary':'')+' wide" data-act="tier" data-v="'+k+'" aria-label="Choisir la formule '+esc(name)+'">Choisir</button>';
    return t===k?'<button type="button" class="btn wide" disabled>'+I.check+'Votre formule</button>':'<button type="button" class="btn'+(k==='parcours'?' primary':'')+' wide" data-act="tier" data-v="'+k+'" aria-label="'+(k==='free'?'Revenir à Découverte, la formule gratuite':'Choisir la formule '+esc(name))+'">'+(k==='free'?'Revenir à Découverte':'Choisir')+'</button>';
  };
  return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">Les formules</h1><p class="sub">Les formules sont sans engagement et vous pouvez arrêter à tout moment. Voici ce que chacune vous donne concrètement.</p></div>'+
    '<div class="plans">'+
    '<div class="plan"><h2 class="t2">Découverte</h2><div class="price">0 CHF <small>pour toujours</small></div><p>Cette formule vous permet de voir si l’espace vous parle. Vous avez la dose chaque jour, toute la boîte à outils, trois dépôts écoutés et la première étape.</p>'+btn('free')+'</div>'+
    '<div class="plan best"><span class="pill sun">Recommandé</span><h2 class="t2">Le parcours</h2><div class="price">14 CHF <small>par mois</small></div><p>Tous les cadenas disparaissent. Vous déposez autant que nécessaire avec la phrase-miroir, vous recevez une dose écrite pour vous, vous suivez les 24 étapes et vous voyez votre chemin sur six mois.</p>'+btn('parcours')+'</div>'+
    '<div class="plan"><h2 class="t2">Avec Antonio</h2><div class="price">49 CHF <small>par mois</small></div><p>Vous avez tout Le parcours, avec en plus un travailleur social qui vous connaît. <b>Chaque mois, Antonio lit les dépôts que vous choisissez de lui partager et vous écrit un mot personnel</b>, qui s’affiche en haut de votre accueil. <b>Deux fois par mois, vous pouvez lui poser une question</b> et il vous répond par écrit dans les 48 heures. Il ne demande jamais le prénom de votre enfant et ne pose jamais de diagnostic.</p>'+btn('antonio')+'</div></div>'+
    '<h2 class="t2 detail">Le détail de chaque formule</h2><div class="card"><table class="cmp"><caption class="sr">Ce que comprend chaque formule</caption><thead><tr><th scope="col"><span class="sr">Ce qui est compris</span></th><th scope="col">Découverte<br>0</th><th scope="col" class="best">Parcours<br>14/mois</th><th scope="col">Antonio<br>49/mois</th></tr></thead><tbody>'+FEATURES.map(f=>'<tr><th scope="row">'+esc(f[0])+'</th>'+cell(f[1])+cell(f[2])+cell(f[3])+'</tr>').join('')+'</tbody></table></div>'+
    '<p class="hint">Dans cette version de test, choisir une formule change simplement l’interface pour vous la montrer. Aucun paiement n’est demandé et rien n’est transmis à Antonio. Les prix sont ceux prévus pour la Suisse.'+(SITE?' <a href="conditions.html">Conditions générales</a>':'')+'</p></main>';
}
function sheetUpgrade(sheetIn){
  const u=UP[state.upFeat]||UP.parcours;const anto=state.upFeat==='antonio';
  return '<div class="backdrop" data-act="sheet-close"></div><div class="sheet'+(sheetIn?' in':'')+'" role="dialog" aria-modal="true" aria-labelledby="up-title" tabindex="-1"><div class="sheet-in"><div class="grab"></div><span class="label">'+I.lock+' Fait partie '+(anto?'de la formule Avec Antonio':'du Parcours')+'</span><h2 id="up-title" class="t2" style="font-family:var(--font-display);font-weight:500">'+esc(u.t)+'</h2><p>'+esc(u.s)+'</p>'+
    (anto?'':'<button type="button" class="btn primary wide" data-act="tier" data-v="parcours">Le parcours, 14 CHF par mois</button>')+
    '<button type="button" class="btn'+(anto?' primary':'')+' wide" data-act="tier" data-v="antonio">Avec Antonio, 49 CHF par mois</button>'+
    '<button type="button" class="btn ghost wide" data-act="sheet-close">Plus tard</button><p class="hint" style="text-align:center">Dans cette version de test, la formule s’active sans paiement, pour vous montrer l’interface.</p></div></div>';
}
/* ---------- avec Antonio ---------- */
function viewAntonio(){
  const d=D();const L=d.letters.slice().reverse();const Q=d.questions.slice().reverse();const ql=questionsLeft();
  return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">Mes échanges avec Antonio</h1><p class="sub">Un travailleur social qui vous connaît sans que vous ayez à tout raconter, parce qu’il lit ce que vous choisissez de partager.</p></div>'+
    (DEMO?'<div class="demo-note"><b>Démonstration.</b> Dans cette version de test, rien n’est transmis à Antonio. Vos questions et vos dépôts cochés restent sur votre appareil, et le mot comme la réponse affichés ici sont des exemples. Les vrais échanges commenceront à l’ouverture des abonnements.</div>':'')+
    '<div class="card sun"><div class="kv"><span>Le mot d’Antonio</span><span>'+(DEMO?'le 1er de chaque mois':esc(nextLetterDate()))+'</span></div><div class="kv"><span>Dépôts cochés ce mois</span><span>'+sharedThisMonth()+'</span></div><div class="kv"><span>Questions restantes ce mois</span><span>'+ql+' sur '+Q_PER_MONTH+'</span></div><p class="hint">Pour partager un dépôt, cochez « Partager avec Antonio » sous le dépôt. Sans dépôt partagé, le mot d’Antonio se base sur votre humeur et vos étapes.</p></div>'+
    (ql>0?'<div class="card"><label class="label" for="qdraft">Poser une question à Antonio</label><textarea id="qdraft" maxlength="'+LIM.q+'" placeholder="Décrivez une situation, une décision ou un doute, sans donner de prénom." style="min-height:90px">'+esc(state.qdraft)+'</textarea><button type="button" class="btn primary" data-act="qsend" style="align-self:flex-start">'+I.send+(DEMO?'Enregistrer ma question':'Envoyer ma question')+'</button></div>':'<div class="card"><span class="label">Poser une question à Antonio</span><p>Vos deux questions du mois sont posées. Vous pourrez en poser à nouveau le '+esc(nextLetterDate())+'. En attendant, « Déposer » reste ouvert.</p></div>')+
    (Q.length?Q.map(q=>'<div class="qa"><span class="st">'+esc(fmtDate(q.date))+(q.answer?', réponse d’Antonio le '+esc(fmtDate(q.answeredAt)):(DEMO?', gardée sur votre appareil et non transmise (version de test)':', en attente d’une réponse sous 48 h'))+'</span><p class="q">'+esc(q.text)+'</p>'+(q.answer?'<p class="a">'+esc(q.answer)+'</p>':'')+(q.risk?riskHtml('hint'):'')+'</div>').join(''):'')+
    ((DEMO||!Q.length)?'<div class="qa"><span class="st">Exemple de question et de réponse</span><p class="q">'+esc(QA_EXAMPLE.q)+'</p><p class="a">'+esc(QA_EXAMPLE.a)+'</p></div>':'')+
    '<div><span class="label">Les mots d’Antonio</span></div>'+
    (L.length?L.map((l,i)=>'<button type="button" class="letter" data-act="letter" data-i="'+(d.letters.length-1-i)+'"><div class="from"><span class="av" aria-hidden="true">A</span><div><b>'+esc(MONTHS_FR[Number(l.date.slice(5,7))-1])+'</b><span>'+esc(fmtDate(l.date))+'</span></div></div><p>'+esc(l.text.split('\n')[0])+'</p></button>').join(''):'<button type="button" class="letter" data-act="letter" data-i="-1"><div class="from"><span class="av" aria-hidden="true">A</span><div><b>Exemple de mot</b><span>'+(DEMO?'Démonstration':'Votre premier arrive le '+esc(nextLetterDate()))+'</span></div></div><p>'+esc(LETTER_EXAMPLE.split('\n')[0])+'</p><span class="hint">Lire l’exemple '+I.chev+'</span></button>')+'</main>';
}
function viewLetter(){
  const i=state.letter;const l=i>=0?D().letters[i]:null;const txt=l?l.text:LETTER_EXAMPLE;
  return '<main id="main" tabindex="-1" class="view"><div><span class="label">'+(l?'Le mot d’Antonio du '+esc(fmtDate(l.date)):'Un exemple de ce que sera le mot d’Antonio')+'</span><h1 class="t1">'+(D().me?'Bonjour '+esc(D().me)+',':'Bonjour,')+'</h1></div>'+
    '<div class="letter">'+txt.split('\n').map(p=>'<p>'+esc(p)+'</p>').join('')+'<div class="from" style="margin-top:6px"><span class="av" aria-hidden="true">A</span><div><b>Antonio Company</b><span>travailleur social</span></div></div></div>'+
    (l?'':'<p class="hint">Ceci est un exemple. Dans la version complète, Antonio écrira ce mot chaque mois à partir des dépôts que vous aurez partagés, de votre humeur et de vos étapes. Il ne citera jamais de prénom et ne posera jamais de diagnostic.</p>')+
    '<div class="quick"><button type="button" class="btn" data-act="go" data-view="today">'+I.drop+'Déposer</button><button type="button" class="btn" data-act="go" data-view="antonio">'+I.question+'Poser une question</button></div></main>';
}
/* ---------- données / à propos ---------- */
function consentCard(){
  if(!SITE||!window.PEPEConsent)return '';
  const c=window.PEPEConsent.get();
  const st=c?(c.audience?'Vous avez accepté la mesure d’audience anonyme le '+esc(fmtDate(c.date))+'.':'Vous avez refusé la mesure d’audience le '+esc(fmtDate(c.date))+'.'):'Vous n’avez pas encore fait de choix.';
  return '<div class="card"><span class="label">Cookies et mesure d’audience</span><p class="hint">Cet espace n’utilise aucun cookie. '+st+' <a href="confidentialite.html#cookies">En savoir plus</a></p><div class="row"><button type="button" class="btn small" data-act="consent" data-v="no" aria-pressed="'+(!!c&&!c.audience)+'">Refuser</button><button type="button" class="btn small" data-act="consent" data-v="yes" aria-pressed="'+(!!c&&c.audience)+'">Accepter</button></div></div>';
}
function viewData(){
  const where=state.sample?'Quand vous déposez, votre texte est envoyé sans votre nom à une intelligence artificielle, qui écrit la réponse. L’application, elle, ne le garde que sur cet appareil.':'Dans cette version, rien de ce que vous écrivez n’est envoyé, ni à un serveur ni à Antonio.';
  return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">Vos données</h1><p class="sub">Vos dépôts, vos points et vos notes restent sur cet appareil. '+where+'</p></div>'+
    '<div class="card green"><span class="label">Bon à savoir</span><p class="hint">Vos dépôts ne sont pas protégés par un mot de passe. Si vous prêtez cet appareil, verrouillez-le ou effacez d’abord vos notes. Sachez aussi que si vous effacez les données de votre navigateur, vos notes sont perdues, parce qu’il n’en existe aucune copie ailleurs.</p></div>'+
    '<div class="card"><span class="label">Recommencer depuis le début</span><p class="hint">Ce bouton efface tout ce qui est sur cet appareil, c’est-à-dire votre prénom, vos dépôts, vos étapes, votre carnet et vos points, puis il rouvre l’écran d’accueil et le questionnaire de départ. C’est utile pour faire tester l’application à une autre personne sur votre appareil.</p>'+(state.confirmReset?'<div class="confirm" role="alert"><span>Effacer tout le contenu sur cet appareil ?</span><div class="row"><button type="button" class="btn danger" data-act="reset-yes">Oui, effacer</button><button type="button" class="btn" data-act="reset-no">Annuler</button></div></div>':'<button type="button" class="btn danger" data-act="reset" style="align-self:flex-start">'+I.trash+'Tout effacer et recommencer</button>')+'</div>'+
    consentCard()+
    '<div class="card"><span class="label">Pour les tests</span><p class="hint">Vous pouvez aussi ajouter <b>?nouveau</b> à la fin de l’adresse. L’application repart alors de zéro sur cet appareil.</p></div></main>';
}
function viewAbout(){
  const peek=!D().onboarded;
  return '<main id="main" tabindex="-1" class="view" style="padding-top:0">'+
    '<div class="band story bleed" style="background-image:url('+HERO+')"><h1 class="t1">Avant d’accompagner des familles, j’ai moi-même été accueilli dans une famille.</h1></div>'+
    '<div class="story">'+
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
    '<p>En février 2025, j’ai imaginé «\u00a0Parent Écouté, Parent Éclairé\u00a0». Au départ, c’était un accompagnement de six mois pour les parents de personnes en situation de handicap. En avril, j’ai voulu l’ouvrir à tous les parents. Cette application, c’est la version que vous pouvez garder dans votre poche.</p>'+
    '<p>Écouté, cela veut dire que vous pouvez déposer librement ce qui vous pèse et être accueilli avec attention et douceur. Éclairé, cela veut dire que vous repartez avec quelque chose qui vous aide à retrouver un peu de paix, de clarté, de recul ou de confiance.</p>'+
    '<p>À l’époque, j’avais écrit ceci.</p>'+
    '<p class="quote">«\u00a0Parce qu’un parent écouté devient un parent éclairé. Et un parent éclairé devient un parent confiant, aligné et pleinement acteur du bien-être de son enfant.\u00a0»</p>'+
    '<p>Si je vous raconte tout cela, c’est pour que vous sachiez d’où vient cet espace. Il vient d’un enfant qui a eu la chance d’être écouté.</p>'+
    '<p>Ici, vous n’avez rien à prouver à personne. Vous pouvez simplement déposer ce qui vous pèse.</p>'+
    '<p>Merci d’avoir pris le temps de me lire.</p>'+
    '<div class="sign"><img class="medal seal" src="'+MEDAL+'" alt="Logo de Parent Écouté, Parent Éclairé, une goutte qui tombe sur un étang dans la lumière d’une forêt." width="64" height="64" loading="lazy" decoding="async"><div><b>Antonio Company</b><span>Travailleur social depuis mes 19 ans, responsable d’une équipe socio-éducative, père de trois enfants.</span></div></div>'+
    '</div>'+
    (peek?'<button type="button" class="btn primary wide" data-act="onboard">'+I.sun2+'Commencer gratuitement</button>':'')+
    '<div class="card green"><h2 class="label">Ce que cet espace n’est pas</h2><ul class="list"><li>Ce n’est pas un diagnostic ni une thérapie. Pour cela, il y a votre pédiatre, votre médecin et les thérapeutes.</li><li>Ce n’est pas un service d’urgence. En cas de danger, appelez le '+tel('144')+'. Si vous êtes à bout, appelez le '+tel('143')+'.</li><li>Cela ne remplace pas les personnes qui vous entourent. C’est plutôt un pont vers elles.</li></ul></div><p class="hint">Version de test.</p></main>';
}
/* ---------- onglets, feuilles ---------- */
function tabs(){
  const grp={today:['today'],parcours:['parcours','step','carnet','evo','photo'],kit:['kit','sit','exo'],me:['me','plans','depots','antonio','letter','data','about']};
  const cur=v=>grp[v].includes(state.view)?' aria-current="page"':'';
  return '<nav class="tabs" aria-label="Navigation"><span class="rail-brand">'+LOGO+'<span>Parent écouté<small>parent éclairé</small></span></span><div class="tabs-in"><button type="button" class="tab" data-act="go" data-view="today"'+cur('today')+'>'+I.sun2+'Aujourd’hui</button><button type="button" class="tab" data-act="go" data-view="parcours"'+cur('parcours')+'>'+I.path+'Parcours</button><button type="button" class="tab" data-act="go" data-view="kit"'+cur('kit')+'>'+I.kit+'Outils</button><button type="button" class="tab" data-act="go" data-view="me"'+cur('me')+'>'+I.user+'Moi</button></div>'+(large()?'<button type="button" class="sos" data-act="go" data-view="sos">'+I.alert+'SOS</button>':'')+'</nav>';
}
function sheetOnboard(sheetIn){
  const d=D();const opt=(k,v,l)=>'<button type="button" class="chip" data-act="ob" data-k="'+k+'" data-v="'+v+'" aria-pressed="'+(d[k]===v)+'">'+esc(l)+'</button>';
  const w=(k,l)=>'<button type="button" class="chip" data-act="obw" data-v="'+k+'" aria-pressed="'+(d.weights.includes(k))+'">'+esc(l)+'</button>';
  return '<div class="backdrop"></div><div class="sheet'+(sheetIn?' in':'')+'" role="dialog" aria-modal="true" aria-labelledby="ob-title" tabindex="-1"><div class="sheet-in"><div class="grab"></div><h2 id="ob-title">Faisons connaissance</h2>'+
    '<div class="field"><label for="ob-me">Votre prénom (facultatif)</label><input type="text" id="ob-me" value="'+esc(d.me)+'" maxlength="'+LIM.me+'" autocomplete="given-name" autocapitalize="words" enterkeyhint="done"></div>'+
    '<div class="field"><span class="flabel" id="ob-l-age">Votre enfant est…</span><div class="chips" role="group" aria-labelledby="ob-l-age">'+opt('age','e','un enfant')+opt('age','a','un ado')+opt('age','g','un adulte')+'</div></div>'+
    '<div class="field"><span class="flabel" id="ob-l-sit">Votre situation</span><div class="chips" role="group" aria-labelledby="ob-l-sit">'+opt('situation','hand','handicap ou besoins particuliers')+opt('situation','diff','une période difficile')+opt('situation','parent','je suis parent, simplement')+'</div></div>'+
    '<div class="field"><span class="flabel" id="ob-l-w">Ce qui pèse le plus en ce moment (plusieurs réponses possibles)</span><div class="chips" role="group" aria-labelledby="ob-l-w">'+WEIGHTS.map(x=>w(x[0],x[1])).join('')+'</div></div>'+
    '<p class="hint">Je ne vous demande pas le prénom de votre enfant, parce que rien de ce qui le concerne ne doit sortir de votre poche.</p>'+
    '<button type="button" class="btn primary wide" data-act="ob-done">'+I.sun2+(d.onboarded?'Enregistrer':'Recevoir ma première dose')+'</button></div></div>';
}
function mdLite(t){const lines=String(t).split('\n');let out='';let inl=false;for(const raw of lines){const l=raw.replace(/\*\*(.+?)\*\*/g,'$1');if(/^\s*[-•]\s+/.test(l)){if(!inl){out+='<ul class="list">';inl=true;}out+='<li>'+esc(l.replace(/^\s*[-•]\s+/,''))+'</li>';continue;}if(inl){out+='</ul>';inl=false;}if(/^#{1,3}\s/.test(l))out+='<p style="font-weight:800;margin-top:6px;color:var(--green)">'+esc(l.replace(/^#{1,3}\s*/,''))+'</p>';else if(l.trim())out+='<p>'+esc(l)+'</p>';}if(inl)out+='</ul>';return out;}

/* ---------- actions ---------- */
function nav(v){state.prev=state.view;state.view=v;state.sheet=null;state.confirmReset=false;state.photoPick=false;state.photoOrder=null;state.pdraft=null;}
function fxSig(){return [state.view,state.sit,state.exo,state.step,state.kit,state.letter,!!D().onboarded,state.view==='photo'?(state.photoPick?'choix':'photo-'+(photoRec().id||'')):''].join('|');}
function handle(act,d,el){
  const data=D();const sig0=fxSig();const sheet0=state.sheet;
  switch(act){
    case 'peek-plans':state.prev=null;state.sheet=null;state.view='plans';break;
    case 'peek-about':openStory();return;
    case 'imprimer':try{window.print();}catch(e){}return;
    case 'intro-suite':{const s=document.querySelector('.intro .acc');if(s&&s.scrollIntoView)s.scrollIntoView({behavior:fxOn()?'smooth':'auto',block:'start'});return;}
    case 'onboard':state.sheet='onboard';break;
    case 'ob':data[d.k]=d.v;save();break;
    case 'obw':{const i=data.weights.indexOf(d.v);if(i>=0)data.weights.splice(i,1);else data.weights.push(d.v);save();break;}
    case 'ob-done':{const m=document.getElementById('ob-me');data.me=clean(m?m.value:data.me,LIM.me);if(!data.start)data.start=todayIso();const first=!data.onboarded;data.onboarded=true;state.sheet=null;save();if(first)state.view='today';break;}
    case 'go':if(d.view==='about'){openStory();return;}if(d.view==='photo'&&!can('parcours')){openUpgrade('photo');break;}nav(d.view);if(d.view!=='kit'&&d.view!=='exo')stopTimer();break;
    case 'back':{if(!data.onboarded){state.view='today';break;}const v=state.view;let t;if(v==='sit'||v==='exo'){t='kit';stopTimer();}else if(v==='step'||v==='carnet'||v==='final'||v==='photo'||v==='evo')t='parcours';else if(v==='letter')t='antonio';else if(['plans','depots','antonio','data','about'].includes(v))t='me';else t='today';if(state.prev&&state.prev!==v&&state.prev!=='sos')t=state.prev;state.prev=null;state.view=t;break;}
    case 'mood':data.moods[todayIso()]=Number(d.i);save();break;
    case 'kit':nav('kit');state.kit=d.v;if(d.v!=='tools')stopTimer();break;
    case 'sit':state.sit=d.id;nav('sit');break;
    case 'age':state.age=d.v;break;
    case 'theme':state.theme=d.v;break;
    case 'dmode':state.depotMode=d.v;break;
    case 'dsend':sendDepot();return;
    case 'dstop':if(state.ctl)state.ctl.abort();return;
    case 'dconcret':concret(d.id);return;
    case 'dose-perso':dosePerso();return;
    case 'share':data.shared[d.id]=!!(el&&el.checked);save();return;
    case 'upgrade':openUpgrade(d.f);break;
    case 'tier':if(!TIERS[d.v])return;data.tier=d.v;state.sheet=null;save();if(!data.onboarded){state.view='today';state.sheet='onboard';break;}toast('La formule « '+TIERS[d.v].t+' » est activée, sans paiement dans cette version de test.');break;
    case 'step':{const i=Number(d.i);const e=stepEtat(i);
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
    case 'evosave':{if(state.evoTime!=='t1'&&!can('parcours')){openUpgrade('evo');break;}const rec={date:todayIso()};EVO_SCALES.forEach(s=>{const x=document.querySelector('[data-evo="'+s.id+'"]');rec[s.id]=x?Number(x.value):5;});EVO_OPEN.forEach(o=>{const x=document.querySelector('[data-evoopen="'+o[0]+'"]');rec[o[0]]=x?clean(x.value,LIM.evo):'';});const first=state.evoTime==='t1'&&!data.evo.t1;data.evo[state.evoTime]=rec;if(state.evoDraft)delete state.evoDraft[state.evoTime];save();if(first){nav('today');render();window.scrollTo(0,0);toast('Votre point de départ est enregistré, et votre dose vous attend.');return;}render();toast('Point enregistré. Ce qui bouge est à vous.');return;}
    case 'evoset':{const r=document.querySelector('[data-evo="'+d.k+'"]');if(r){r.value=d.v;evoSync(r);if(r.focus)r.focus({preventScroll:true});}return;}
    case 'photopick':{const av=photoRec();data.photo={id:d.id,text:av.text,date:av.id===d.id?av.date:''};state.photoPick=false;state.lastKey=null;save();break;}
    case 'photoback':state.photoPick=true;state.lastKey=null;break;
    case 'photosave':{const t=document.getElementById('ptext');const av=photoRec();if(!av.id){toast('Choisissez d’abord une photo, puis écrivez ce qu’elle évoque.');return;}data.photo={id:av.id,text:t?clean(t.value,LIM.photo):'',date:todayIso()};
      /* Le final montre toutes les photos choisies : un choix refait le même jour remplace celui du jour, un autre jour il s'ajoute. */
      {if(!Array.isArray(data.photos))data.photos=[];const L=data.photos,der=L[L.length-1],r={id:data.photo.id,text:data.photo.text,date:data.photo.date};if(der&&der.date===r.date)L[L.length-1]=r;else L.push(r);if(L.length>12)L.splice(0,L.length-12);}
      state.pdraft=null;save();render();toast('Gardé.');return;}
    case 'tool':state.tool=d.v;if(d.v!=='timer')stopTimer();break;
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
    case 'exo':state.exo=d.id;nav('exo');break;
    case 'threeadd':{const items=['t1','t2','t3'].map(id=>clean(document.getElementById(id).value,LIM.three)).filter(Boolean);if(!items.length){fieldErr('t1','Une seule chose suffit, écrivez-la ici.');return;}data.three.push({date:todayIso(),items});save();render();toast('Gardé.');return;}
    case 'depose':{const t=document.getElementById('dep');if(t&&t.value&&fxOn()){t.classList.add('ink');setTimeout(()=>{t.value='';t.classList.remove('ink');},1150);}else if(t)t.value='';toast('C’est déposé, vous n’avez plus à le garder en vous.');return;}
    case 'letter':state.letter=Number(d.i);nav('letter');break;
    case 'qsend':{const t=clean(state.qdraft,LIM.q);if(t.length<10){fieldErr('qdraft','Écrivez votre question en une phrase ou deux (dix caractères au moins).');return;}if(questionsLeft()===0){toast('Vos deux questions du mois sont posées.');return;}const risk=RISK.test(t);data.questions.push(risk?{id:'q'+Date.now(),date:todayIso(),text:t,risk:true}:{id:'q'+Date.now(),date:todayIso(),text:t});state.qdraft='';save();render();toast(risk?'Si c’est urgent, n’attendez pas et appelez le 143 ou le 144 maintenant.':(DEMO?'Votre question est gardée sur votre appareil. Dans cette version de test, elle n’est pas transmise à Antonio.':'Votre question est envoyée. Antonio répond par écrit sous 48 heures.'));return;}
    case 'sheet-close':state.sheet=null;break;
    case 'fx':data.fxOff=!data.fxOff;save();fxSync();toast(data.fxOff?'Les effets visuels sont désactivés.':'Les effets visuels sont activés.');break;
    case 'consent':if(window.PEPEConsent)window.PEPEConsent.set(d.v==='yes');break;
    case 'reset':state.confirmReset=true;break;
    case 'reset-no':state.confirmReset=false;break;
    case 'reset-yes':state.data=JSON.parse(JSON.stringify(DEF));try{localStorage.removeItem(KEY);}catch(e){}state.confirmReset=false;state.view='today';state.prev=null;fxSync();render();window.scrollTo(0,0);toast('Effacé.');return;
    default:return;
  }
  const navAct=['go','sit','back','exo','step','kit','letter','peek-plans','tier','ob-done','photopick','photoback'].includes(act);
  if(navAct&&fxSig()!==sig0){fxGo(()=>{render();window.scrollTo(0,0);},act==='back'||act==='photoback'?'back':(act==='kit'||(el&&el.classList&&el.classList.contains('tab'))?'tab':'open'));return;}
  /* Une feuille qui se referme s'efface en douceur elle aussi, quand le navigateur sait faire le fondu d'écran. */
  if(sheet0&&!state.sheet){fxGo(()=>{render();if(navAct)window.scrollTo(0,0);},'fade',true);return;}
  render();
  if(navAct)window.scrollTo(0,0);
}
const app=document.getElementById('app');
app.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el||el.tagName==='A'||el.tagName==='INPUT'||el.tagName==='LABEL')return;handle(el.dataset.act,el.dataset,el);});
app.addEventListener('change',e=>{const el=e.target;if(el.tagName==='INPUT'&&el.dataset.act==='share')handle('share',el.dataset,el);if(el.dataset&&el.dataset.note&&noteAttend){clearTimeout(noteT);noteAttend=false;save();}});
/* Si l'on quitte la page pendant qu'on écrit dans le carnet, les derniers mots sont gardés tout de suite. Rien n'est écrit s'il n'y a rien en attente,
   pour ne pas écraser ce qu'un autre onglet aurait enregistré entre-temps. */
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&noteAttend){clearTimeout(noteT);noteAttend=false;save();}});
let typing=null,noteT=null,noteAttend=false;
app.addEventListener('input',e=>{
  const t=e.target;clearErr(t);
  /* Le carnet de route se garde tout seul, pendant qu'on écrit. */
  if(t.dataset&&t.dataset.note){const id=t.dataset.note;const v=String(t.value).slice(0,LIM.note);if(v.trim())D().notes[id]={t:v,d:todayIso()};else delete D().notes[id];clearTimeout(noteT);noteAttend=true;noteT=setTimeout(()=>{noteAttend=false;save();},400);const st=document.getElementById('note-etat');if(st){const m=v.trim()?NOTE_OUI:NOTE_NON;if(st.textContent!==m)st.textContent=m;}}
  if(t.id==='draft'){state.draft=t.value;updCount(t);}
  if(t.id==='qdraft')state.qdraft=t.value;
  if(t.id==='ptext')state.pdraft=t.value;
  if(t.dataset&&t.dataset.evo)evoSync(t);
  if(t.dataset&&t.dataset.evoopen){const k=state.evoTime;state.evoDraft=state.evoDraft||{};state.evoDraft[k]=state.evoDraft[k]||{};state.evoDraft[k][t.dataset.evoopen]=t.value;}
  if(t.id==='ob-me')D().me=String(t.value).slice(0,LIM.me);
  if(t.id==='q'){state.q=t.value;clearTimeout(typing);typing=setTimeout(()=>{const pos=t.selectionStart;render();const nq=document.getElementById('q');if(nq){nq.focus();try{nq.setSelectionRange(pos,pos);}catch(e){}}},250);}
});
/* Entrée valide les champs d'une seule ligne, comme sur un vrai formulaire. */
app.addEventListener('keydown',e=>{
  if(e.key!=='Enter'||e.isComposing)return;const t=e.target;
  if(t.id==='ph'){e.preventDefault();handle('phadd',{},t);}
  else if(t.id==='ob-me'){e.preventDefault();handle('ob-done',{},t);}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state.sheet&&state.sheet!=='onboard'){state.sheet=null;fxGo(render,'fade',true);}});
try{if(/[?&](nouveau|reset|new)\b/.test(location.search)){localStorage.removeItem(KEY);if(history.replaceState)history.replaceState(null,'',location.pathname+location.hash);}}catch(e){}
state.data=load();
/* L'aperçu d'Antonio s'active aussi par l'adresse …/#atelier. Ce n'est pas un verrou : il sert à tout relire sans attendre les sept jours. */
let atelierMsg=false;
try{if(location.hash==='#atelier'){state.data.atelier=true;state.data.tout=true;save();atelierMsg=true;if(history.replaceState)history.replaceState(null,'',location.pathname+location.search);}}catch(e){}
fxSync();
/* La fenêtre passe d'un format à l'autre (fenêtre agrandie ou réduite, tablette qu'on tourne) : l'écran est réécrit dans le bon ordre, sans perdre ce qui est en cours de saisie. */
if(MQ_LARGE){const relayout=()=>{const keep={};document.querySelectorAll('#app input[id],#app textarea[id]').forEach(el=>{if(el.type!=='range'&&el.type!=='checkbox'&&el.type!=='radio')keep[el.id]=el.value;});render();Object.keys(keep).forEach(id=>{const el=document.getElementById(id);if(el&&el.value!==keep[id])el.value=keep[id];});};if(MQ_LARGE.addEventListener)MQ_LARGE.addEventListener('change',relayout);else if(MQ_LARGE.addListener)MQ_LARGE.addListener(relayout);}
window.addEventListener('scroll',lectureScroll,{passive:true});window.addEventListener('resize',lectureScroll,{passive:true});
if(FX_OK){document.addEventListener('pointerdown',fxTap,{passive:true,capture:true});document.addEventListener('pointerup',fxLeve,{passive:true,capture:true});document.addEventListener('pointercancel',()=>{fxPt.vt=false;},{passive:true,capture:true});document.addEventListener('click',fxDouble,true);document.addEventListener('pointerdown',eauTouch,{passive:true});window.addEventListener('resize',()=>{EAU.geo=null;},{passive:true});window.addEventListener('popstate',e=>{if(e&&e.hasUAVisualTransition)fxSkip=Date.now();});if(FX_RM&&FX_RM.addEventListener)FX_RM.addEventListener('change',()=>{fxSync();});}
/* Sur le site, « Mon histoire » a sa propre adresse (…/#histoire) : on peut l'envoyer telle quelle, et le bouton Retour du téléphone fonctionne. */
const storyFirst=SITE&&location.hash===STORY_HASH;
if(storyFirst)state.view='about';
if(SITE)window.addEventListener('hashchange',()=>{
  /* L'adresse …/#atelier, tapée alors que l'espace est déjà ouvert, allume l'aperçu d'Antonio sans recharger la page. */
  if(location.hash==='#atelier'){const d=D();d.atelier=true;d.tout=true;save();try{if(history.replaceState)history.replaceState(null,'',location.pathname+location.search);}catch(e){}if(d.onboarded)render();toast('Aperçu d’Antonio activé sur cet appareil. Tout le parcours est ouvert.');return;}
  if(location.hash===STORY_HASH){if(state.view!=='about')showStory();}
  else if(state.view==='about')handle('back',{},null);
});
state.inClaude=!SITE&&!!(window.claude&&typeof window.claude.use==='function');
if(SITE)state.sample=false;
/* Sur le site, l'accueil est déjà écrit dans la page (affichage immédiat, lisible sans JavaScript par les moteurs) : on le garde tel quel. */
if(app.getAttribute('data-prerender')==='intro'&&!D().onboarded&&!storyFirst){state.lastKey='intro';app.removeAttribute('data-prerender');introLive();fxMark();eauArrive(true);}
else render();
if(atelierMsg)toast('Aperçu d’Antonio activé sur cet appareil. Tout le parcours est ouvert.');
if(!SITE)(async()=>{try{if(state.inClaude){const s=await window.claude.use('sample');state.sample=s||false;}else state.sample=false;}catch(e){state.sample=false;}if(D().onboarded||state.view==='plans')render();})();
})();
