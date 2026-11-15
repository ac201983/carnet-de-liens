(function(){
'use strict';
const SITE=true;
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
  ['Vous avez le droit','d’avoir des projets qui ne concernent pas le handicap.'],
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
   comp:'Chez beaucoup d’enfants en situation de handicap, le sommeil est fragile. Leur corps ne donne pas toujours les signaux au bon moment, l’angoisse de la séparation est plus forte et la journée laisse beaucoup de tension. Un coucher qui se passe mal ne veut donc pas dire que vous manquez d’autorité.',
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
   moi:'Rien ne vous oblige à représenter le handicap tous les jours. Certains jours, vous avez le droit de fermer les yeux et de passer votre chemin.',
   aide:'Les groupes de parents existent justement pour pouvoir parler sans devoir tout expliquer. Vous en trouverez chez insieme, autisme suisse romande ou Cerebral, et il existe aussi beaucoup de groupes locaux.'},
  {id:'ecole',e:'🏫',t:'L’école',s:'Intégration, devoirs, réunions, enseignants',ages:['e','a'],th:'ecole',
   comp:'L’école est souvent le premier endroit où la différence se voit. Les enseignants sont en général de bonne volonté, mais ils sont peu formés. Les réunions sont nombreuses et vous vous y retrouvez parfois sans personne à vos côtés, face à plusieurs professionnels. Pourtant, c’est vous qui connaissez le mieux votre enfant, et cette connaissance a autant de valeur que la leur.',
   ess:['Demandez à avoir une seule personne de contact et un moyen simple de communiquer, comme un cahier ou un e-mail chaque semaine.','Avant chaque réunion, écrivez trois forces de votre enfant, deux difficultés et une demande.','Partagez ce qui marche à la maison, comme les gestes, les pictogrammes ou les routines, et reprenez chez vous ce qui marche à l’école.','Pour les devoirs, gardez des séances courtes, à la même heure et à la même place, avec le droit de s’arrêter après quinze minutes.','Demandez que les décisions soient mises par écrit, avec ce que chacun doit faire.'],
   ev:['Arriver en réunion sans avoir écrit vos points, parce qu’on en ressort souvent avec de la frustration.','Faire des devoirs un combat de tous les jours, parce que votre enfant a besoin d’une famille à la maison et non d’une deuxième école.'],
   moi:'Les réunions à l’école sont épuisantes. Préparez-les, venez à deux si c’est possible et offrez-vous ensuite un café tranquille, rien que pour vous.',
   aide:'Chaque canton a un service de pédagogie spécialisée. Demandez à l’école quel appui est possible, par exemple du soutien, de l’ergothérapie, de la logopédie ou une aide à l’intégration. Pro Infirmis et les associations de parents peuvent aussi vous aider à comprendre vos droits.'},
  {id:'fratrie',e:'👧👦',t:'Les frères et sœurs',s:'Jalousie, colère, trop sages, trop grands',ages:['e','a','g'],th:'fam',
   comp:'Les frères et sœurs vivent le handicap de l’intérieur, sans l’avoir choisi. Certains deviennent très sages pour ne pas ajouter de poids, et d’autres explosent. Tous ont besoin qu’on les regarde pour eux-mêmes, et pas seulement comme l’enfant qui va bien.',
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
   aide:'Si la culpabilité vous empêche de dormir ou de vous réjouir depuis des semaines, un ou une psychologue qui connaît le handicap peut vous aider. Pro Infirmis et les associations sauront vous orienter. Consulter n’a rien d’une faiblesse, c’est une façon de prendre soin de vous.'},
  {id:'epuise',e:'🔋',t:'Je n’en peux plus',s:'Épuisement, isolement, à bout',ages:['e','a','g'],th:'moi',
   comp:'L’épuisement des proches aidants n’a rien à voir avec de la faiblesse. Il arrive après des mois ou des années de vigilance sans pause, de nuits coupées, de rendez-vous et de démarches administratives. Votre corps finit par dire ce que vous n’osez pas dire vous-même. En l’écoutant, vous n’abandonnez pas votre enfant, vous faites ce qu’il faut pour rester debout pour lui.',
   ess:['Aujourd’hui, ne faites qu’une seule chose et laissez le reste attendre.','Dites-le à une personne en une seule phrase, par exemple « je suis à bout ». Vous n’avez pas besoin de donner de détails.','Demandez du répit, que ce soit un week-end, un après-midi ou une nuit. Vous en avez besoin pour votre santé.','Réservez une heure par semaine rien que pour vous et notez-la dans votre agenda comme un rendez-vous médical.','Dormez dès que vous le pouvez, même si c’est peu et même si vous dormez mal.'],
   ev:['Attendre d’aller vraiment mal pour demander de l’aide.','Refuser l’aide qu’on vous propose en pensant que personne ne fera aussi bien que vous. Les autres feront autrement, et c’est très bien ainsi.'],
   moi:'Si vous lisez ces lignes à deux heures du matin, posez votre téléphone juste après. Vous avez tenu toute la journée, et c’est assez pour aujourd’hui.',
   aide:'Des solutions existent et beaucoup sont financées. Vous pouvez vous adresser à Pro Infirmis pour un service de relève, à la Croix-Rouge pour une garde à domicile, à Cerebral pour du répit ou à votre commune pour l’aide aux proches aidants. Et si vous avez des idées noires, appelez La Main Tendue au 143 dès maintenant.'},
  {id:'couple',e:'💑',t:'Le couple',s:'Plus de temps à deux, désaccords, solitude',ages:['e','a','g'],th:'fam',
   comp:'Le handicap d’un enfant met le couple à l’épreuve. Il y a la fatigue, les désaccords sur l’éducation, l’un des deux qui porte plus que l’autre, le désir qui s’éteint et les mots qui manquent. Cela ne veut pas dire que l’amour a disparu, mais que toute votre énergie part ailleurs. Votre couple a donc besoin que vous preniez soin de lui volontairement, parce que cela ne se fait plus tout seul.',
   ess:['Prévoyez un rendez-vous à deux, régulier même s’il est court, même à la maison après le coucher, et ne parlez pas du handicap pendant ce moment.','Dites à voix haute qui s’occupe de quoi, et refaites le point de temps en temps.','Parlez de ce que vous ressentez en commençant par « je ». Dire « j’ai besoin de toi en ce moment » passe mieux que « tu ne fais rien ».','Acceptez que l’autre ne vive pas la même chose au même moment.','Demandez de l’aide ensemble, plutôt que chacun de votre côté contre l’autre.'],
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
const PICTOS=[['🍽️','Manger'],['🚿','Douche'],['🪥','Dents'],['🛏️','Dodo'],['🧩','Jouer'],['📱','Tablette'],['🏫','École'],['🚗','Voiture'],['☕','Pause'],['🤗','Câlin'],['🌳','Dehors'],['🎵','Musique'],['📖','Histoire'],['👕','Habiller'],['🧸','Doudou'],['🚽','Toilettes']];
const ROUTINE_DEF=[['🛁','Bain'],['👕','Pyjama'],['🪥','Dents'],['📖','Histoire'],['🤗','Câlin'],['🛏️','Dodo']];

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
/* ---------- Le parcours en 24 étapes (6 mois) ---------- */
const PARCOURS=[
  {m:'Accueil, point de départ et changement de regard',steps:[
    {t:'D’où je pars',lesson:'Avant d’avancer, je vous propose de regarder où vous en êtes. Le but n’est pas de vous juger mais d’avoir un point de comparaison dans trois mois, puis dans six. Les parents qui tiennent dans la durée sont souvent ceux qui voient le chemin qu’ils ont parcouru. Aujourd’hui, vous faites donc votre premier point sur votre stress, votre sentiment de compétence, votre solitude, votre regard sur votre enfant et votre confiance dans l’avenir. Il n’y a pas de bonne réponse, il y a seulement la vôtre aujourd’hui.',exo:'Faites votre point de départ dans « Mon évolution ». Il y a cinq curseurs et cela prend trois minutes. Écrivez ensuite une phrase qui commence par « Je commence ce parcours parce que… ».',obs:'Cette semaine, remarquez à quel moment de la journée le poids est le plus lourd. Contentez-vous de le remarquer, sans rien changer pour l’instant.',link:'evo'},
    {t:'L’effet Pygmalion',lesson:'Ce qu’on attend d’une personne finit souvent par arriver, parce que nos attentes changent notre façon de l’encourager, de lui laisser du temps et de remarquer ses essais. On appelle cela l’effet Pygmalion. Il ne s’agit pas de croire aux miracles. Il s’agit de regarder ce que nos gestes disent à notre enfant de ce que nous pensons de lui. Un enfant qui sent qu’on le croit capable essaie plus longtemps.',exo:'Choisissez une petite chose que votre enfant pourrait réussir cette semaine. Dites-lui une fois par jour que vous l’en croyez capable, et laissez-lui le temps d’essayer.',obs:'Notez ce qui change dans sa façon d’essayer, plutôt que dans le résultat.'},
    {t:'Les croyances qui freinent',lesson:'Vous vous êtes peut-être déjà dit « il ne pourra jamais », « avec son handicap, c’est inutile » ou « je dois tout faire à sa place ». Ces phrases ne sont pas des faits. Ce sont des croyances, que nous avons souvent héritées ou qu’un professionnel pressé nous a dites il y a dix ans. Une croyance qui aide n’a rien d’un mensonge optimiste. C’est une phrase tout aussi vraie, mais qui ouvre une porte au lieu de la fermer. « Il apprend à son rythme » est aussi vrai que « il est lent », et pourtant ces deux phrases ne vous emmènent pas au même endroit.',exo:'Écrivez trois phrases que vous vous dites sur votre enfant quand c’est difficile. Pour chacune, cherchez une phrase aussi vraie qui ouvre une porte.',obs:'Repérez la croyance qui revient le plus souvent dans votre tête.'},
    {t:'Mes objectifs à moi',lesson:'Un parcours sans objectif ressemble à une promenade. C’est agréable, mais on ne sait pas vraiment si l’on avance. Les objectifs dont je parle ici ne concernent pas votre enfant, ils vous concernent vous. Cela peut être dormir, souffler, mieux comprendre, oser demander ou arrêter de vous excuser. Choisissez-les petits et concrets, avec une date. Un objectif que vous pouvez tenir une semaine vaut mieux qu’un idéal pour toute l’année.',exo:'Écrivez un seul objectif pour le mois, en commençant par « D’ici un mois, je… ». Puis parlez-en à une personne.',obs:'Chaque soir, faites une croix si vous avez fait un pas vers cet objectif. Un soir sans croix n’est pas un échec, il vous renseigne simplement sur votre journée.'}
  ]},
  {m:'Représentations du handicap et inclusion',steps:[
    {t:'Le handicap selon les époques',lesson:'Le regard sur le handicap a beaucoup changé avec le temps. On l’a d’abord caché, puis on a voulu le soigner, le réparer et l’intégrer. Aujourd’hui, la Convention de l’ONU le décrit comme la rencontre entre une personne et un environnement plus ou moins accessible. Savoir cela change quelque chose, parce que ce que votre enfant ne peut pas faire dépend aussi de ce que le monde met ou ne met pas à sa portée. Ses limites ne reposent donc pas uniquement sur vos épaules, et vous pouvez agir sur ce qui l’entoure.',exo:'Ouvrez le photolangage, choisissez l’image qui dit le mieux ce que vous vivez avec le handicap aujourd’hui, et écrivez pourquoi.',obs:'Repérez une situation où la difficulté venait de l’environnement plutôt que de votre enfant.',link:'photo'},
    {t:'Ce que ces croyances font à mon regard',lesson:'Les idées que la société se fait du handicap s’invitent jusque dans notre cuisine. Elles nous font voir les difficultés avant la personne, et le diagnostic avant le prénom. Cette semaine, je vous propose d’inverser l’ordre et de regarder d’abord qui est votre enfant, puis ce dont il a besoin. Vous ne niez pas le handicap en faisant cela. Vous lui redonnez sa vraie place, celle d’une partie de sa vie et non de sa vie entière.',exo:'Décrivez votre enfant en dix lignes sans utiliser un seul mot de son dossier. Parlez de ses goûts, de son caractère, de son humour et de ses petites manières.',obs:'Quand vous présentez votre enfant à quelqu’un, remarquez si vous commencez par son prénom ou par son diagnostic.'},
    {t:'L’inclusion, concrètement',lesson:'L’inclusion, c’est d’abord quelque chose de très concret. C’est un enfant qui a sa place à table, à l’école, au club ou au magasin, avec les adaptations dont il a besoin. Elle réussit quand quelqu’un prépare le terrain, et beaucoup moins quand on jette l’enfant dans le grand bain. Ce quelqu’un, c’est souvent vous. Vous avez aussi le droit de choisir vos combats, parce que certains lieux méritent votre énergie et d’autres non.',exo:'Choisissez un lieu où vous aimeriez que votre enfant ait davantage sa place. Écrivez ce qui rendrait cela possible, que ce soit une personne, une adaptation ou une habitude.',obs:'Observez un lieu où l’inclusion marche déjà. Qu’est-ce qui fait que ça marche ?'},
    {t:'Une vision de l’avenir qui donne envie',lesson:'L’avenir fait peur surtout parce qu’il est flou. Un avenir que l’on souhaite, même imparfait, peut se construire. Il ne s’agit pas de faire un plan de carrière, mais d’avoir une image en tête. Où vit-il, avec qui, que fait-il le matin et qu’est-ce qui le fait rire ? Les parents qui ont cette image avancent vers elle, alors que les autres subissent souvent celle que d’autres ont choisie pour leur enfant.',exo:'Écrivez une journée de votre enfant dans dix ans, du réveil au coucher, la plus belle possible tout en restant réaliste.',obs:'Dans la semaine, remarquez un petit pas qui va déjà dans cette direction.'}
  ]},
  {m:'Émotions et résilience parentale',steps:[
    {t:'Mes émotions, mes signaux',lesson:'La colère, la tristesse, la honte, la peur et l’épuisement sont des émotions très fortes chez les parents d’un enfant différent, et on se les interdit souvent. Pourtant, ce sont des signaux et non des fautes. La colère vous dit que quelque chose est injuste, la tristesse que vous avez perdu quelque chose, et la peur que vous tenez à votre enfant. Quand on nomme une émotion, elle baisse d’un cran. Quand on la nie, elle ressort ailleurs, et souvent sur la mauvaise personne.',exo:'Trois fois cette semaine, quand l’émotion monte, nommez-la à voix basse. Dites par exemple « là, c’est de la colère », « là, c’est de la peur » ou « là, c’est de la tristesse », sans rien faire d’autre.',obs:'Repérez l’émotion que vous vous interdisez le plus.'},
    {t:'Réguler et lâcher',lesson:'On ne choisit pas ce qu’on ressent, mais on peut choisir ce qu’on en fait. Respirer plus lentement que l’émotion, sortir trente secondes, poser les mains à plat ou dire une phrase apprise par cœur sont des gestes qui calment le corps avant la tête. Lâcher prise ne veut pas dire renoncer. Cela veut dire arrêter de porter ce qui ne dépend pas de vous.',exo:'Choisissez un seul geste pour vous calmer, comme la respiration 4-6, les mains à plat, sortir un instant ou une phrase. Utilisez-le chaque fois que l’émotion monte, pendant une semaine.',obs:'Parmi vos soucis de la semaine, repérez ce qui ne dépend pas de vous. Écrivez-le, puis laissez-le de côté.',link:'breath'},
    {t:'Mes ressources de résilience',lesson:'La résilience n’est pas une qualité qu’on a ou qu’on n’a pas. Elle se construit avec des appuis, comme une personne qui écoute, un lieu qui apaise, une activité qui vous fait du bien ou une phrase qui vous tient debout. J’ai été placé en famille d’accueil à dix ans, et ce qui m’a aidé à tenir, ce sont mes parents d’accueil, qui sont devenus mon pilier. Je vous invite à trouver vos appuis, à les nommer et à aller vers eux volontairement.',exo:'Écrivez vos quatre appuis, c’est-à-dire une personne, un lieu, une activité et une phrase. Prévoyez ensuite un rendez-vous avec chacun d’eux dans le mois.',obs:'Remarquez ce qui vous recharge vraiment, et ce qui vous aide seulement à ne plus rien sentir.'},
    {t:'Bilan de mi-parcours',lesson:'Vous êtes à trois mois. C’est le moment de regarder le chemin que vous avez fait plutôt que la montagne qu’il reste à gravir. Refaites le point sur votre stress, votre sentiment de compétence, votre solitude, votre regard et votre confiance, puis comparez avec le départ sans vous juger. Ce qui a bougé vous appartient, et ce qui n’a pas bougé vous montre où porter vos efforts pendant les trois prochains mois. Vous pouvez aussi ajuster votre objectif, parce qu’il a le droit d’avoir changé.',exo:'Refaites le point dans « Mon évolution ». Relisez votre première phrase « Je commence ce parcours parce que… ».',obs:'Qu’est-ce que vous faites aujourd’hui que vous ne faisiez pas il y a trois mois ?',link:'evo'}
  ]},
  {m:'Changer de perspective et reconnaître les forces',steps:[
    {t:'Sa singularité',lesson:'Chaque personne en situation de handicap est d’abord une personne unique, avec ses goûts, son humour, ses peurs et ses talents. Le handicap décrit une partie de son fonctionnement, mais il ne dit pas qui elle est. Cette semaine, je vous propose de regarder votre enfant sans passer par le diagnostic, en vous intéressant à ce qu’il aime, à ce qu’il sait et à ce qu’il fait mieux que vous.',exo:'Faites la liste de cinq choses que votre enfant fait mieux que la plupart des gens. Cherchez bien, parce qu’il y en a.',obs:'Observez un moment où il est pleinement lui-même, sans effort. Que fait-il ?'},
    {t:'Ses talents, ses compétences',lesson:'Un talent n’a pas besoin d’être spectaculaire. Remarquer les détails, bien mémoriser, persévérer, sentir l’humeur des autres, rire aux éclats ou être fidèle sont de vraies compétences, et elles se cultivent. Quand on nomme une compétence, elle se renforce. Quand on ne la remarque pas, elle finit par s’éteindre.',exo:'Choisissez une compétence de votre enfant et créez une occasion de l’exercer cette semaine. Dites-lui ce que vous avez vu.',obs:'Comptez les fois où vous nommez une compétence, et les fois où vous nommez une difficulté.'},
    {t:'Encourager juste',lesson:'Encourager ne veut pas dire féliciter tout le temps. Il s’agit plutôt de trouver le bon dosage, parce que trop d’aide étouffe et que trop peu d’aide décourage. Un bon encouragement vise le pas suivant, celui que votre enfant peut atteindre avec un peu d’effort, et il parle de l’effort plutôt que du résultat. « Tu as essayé trois fois » porte plus loin que « bravo ».',exo:'Cette semaine, remplacez « bravo » par la description de ce que vous avez vu, par exemple « tu as attendu », « tu as demandé » ou « tu as réessayé ».',obs:'Repérez un moment où vous aidez par habitude alors que votre enfant pourrait essayer.'},
    {t:'Des solutions pour le quotidien',lesson:'Les problèmes concrets ont souvent des solutions concrètes. On peut prévenir avant un changement d’activité, montrer en images, proposer deux choix, simplifier une consigne ou préparer une sortie. Les outils de l’application sont là pour cela. Choisissez une seule difficulté du quotidien et essayez de la résoudre avec une méthode, plutôt qu’en y mettant encore plus de volonté.',exo:'Dans la boîte à outils, choisissez la situation que vous vivez le plus souvent et essayez une seule des pistes pendant sept jours.',obs:'Notez chaque soir si c’était mieux, pareil ou moins bien. Au bout de sept jours, vous pourrez décider de continuer ou de changer.',link:'advice'}
  ]},
  {m:'Les clés de l’inclusion au quotidien',steps:[
    {t:'Les formes de l’inclusion',lesson:'L’inclusion peut être scolaire, professionnelle, sociale ou liée au lieu de vie. Ce n’est pas une case à cocher, et il existe beaucoup de possibilités entre la classe ordinaire et l’institution spécialisée. Celle qui convient à votre enfant peut d’ailleurs changer avec l’âge. Quand vous connaissez les formes qui existent, vous pouvez choisir au lieu de subir.',exo:'Dessinez une ligne, avec « tout ordinaire » à gauche et « tout spécialisé » à droite. Placez-y l’endroit où se trouve votre enfant aujourd’hui, et celui où vous aimeriez qu’il soit dans deux ans.',obs:'Repérez une forme d’inclusion que vous ne connaissiez pas.'},
    {t:'Collaborer avec les professionnels',lesson:'Les professionnels savent des choses que vous ne savez pas, et vous savez des choses qu’ils ne sauront jamais. La collaboration commence quand chacun apporte sa part sans défendre son territoire. Si vous arrivez avec trois points écrits et des questions simples, et que vous repartez avec des décisions notées, vous devenez un vrai partenaire.',exo:'Préparez votre prochaine rencontre en écrivant trois points, à savoir ce qui va bien, ce qui vous inquiète et ce que vous demandez.',obs:'Pendant la rencontre, remarquez si l’on vous écoute vraiment. Si ce n’est pas le cas, redemandez calmement.',link:'pros'},
    {t:'Ma place dans mon entourage',lesson:'Vous avez changé, et votre regard sur la différence aussi. Autour de vous, il y a des personnes qui n’ont pas fait ce chemin et qui disent parfois des choses maladroites. Si vous le souhaitez, et quand vous en avez la force, vous pouvez faire évoluer un regard à la fois. Vous n’avez pas besoin de militer pour cela, il suffit de montrer votre enfant tel qu’il est.',exo:'Choisissez une personne de votre entourage et racontez-lui une chose de votre enfant qu’elle ne connaît pas et qui le montre tel qu’il est.',obs:'Observez ce qui change dans la façon dont cette personne parle de lui ensuite.'},
    {t:'Avant la dernière ligne droite',lesson:'Vous en êtes à cinq mois. Prenez un moment pour regarder ce que vous avez mis en place, ce qui tient tout seul maintenant et ce qui a encore un peu besoin de vous. Dans cette dernière phase, il ne s’agit pas d’en faire plus. Il s’agit de consolider ce qui marche et de décider ce que vous continuerez une fois le parcours terminé.',exo:'Relisez vos notes et vos dépôts. Écrivez trois choses qui ont changé et une qui résiste.',obs:'Cette semaine, n’ajoutez rien de nouveau et contentez-vous de maintenir ce qui est en place.'}
  ]},
  {m:'Consolider et devenir autonome',steps:[
    {t:'Le bilan des six mois',lesson:'Refaites le point une dernière fois et comparez vos trois moments, le départ, la mi-parcours et aujourd’hui. Ce qui a bougé est à vous. Ce qui n’a pas bougé n’est pas un échec, parce que certaines choses demandent plus de temps ou d’autres appuis. Ce que vous avez gagné ne se résume pas à des chiffres. Vous avez aujourd’hui des réflexes que vous n’aviez pas il y a six mois.',exo:'Faites le point final dans « Mon évolution ». Écrivez trois réflexes que vous avez acquis.',obs:'Remarquez une situation que vous gérez aujourd’hui sans y penser.',link:'evo'},
    {t:'Mes prochaines étapes',lesson:'La suite peut très bien exister sans parcours. Ce dont elle a besoin, c’est d’un rythme, avec un moment pour vous chaque semaine, des rencontres préparées, un dépôt quand cela pèse et une dose de lumière quand vous en avez besoin. Choisissez ce que vous voulez garder et laissez le reste.',exo:'Écrivez vos trois rituels pour les six prochains mois et notez-les dans votre agenda.',obs:'Essayez-les pendant une semaine et gardez ceux qui tiennent.'},
    {t:'Une vision à long terme',lesson:'Reprenez la journée dans dix ans que vous aviez écrite et relisez-la. Qu’est-ce qui a déjà avancé, et qu’est-ce qui manque encore ? Les grandes questions, comme ce qui se passera quand vous ne serez plus là, le logement ou les proches qui prendront le relais, se préparent par petites décisions, une par saison. Vous vous entraînez depuis six mois à faire des petits pas, alors continuez sur ce rythme.',exo:'Choisissez une seule décision à prendre dans les six prochains mois pour préparer l’avenir, et fixez-lui une date.',obs:'Nommez une personne à qui vous en parlerez.'},
    {t:'Le chemin parcouru',lesson:'Vous voilà au bout des vingt-quatre étapes, avec un enfant qui n’a pas attendu que vous ayez fini pour grandir. Vous avez regardé où vous en étiez, changé une partie de votre regard, appris à nommer vos émotions et trouvé vos appuis. Vous avez aussi vu les forces de votre enfant, préparé vos rencontres et choisi vos rituels. Vous n’êtes pas pour autant un parent parfait, et personne ne l’est. Vous êtes un parent plus éclairé qu’il y a six mois. C’est vous qui avez fait ce chemin, et vous pouvez en être fier ou fière.',exo:'Écrivez une lettre à la personne que vous étiez il y a six mois, et dites-lui ce que vous savez maintenant.',obs:'Gardez cette lettre et relisez-la un jour où tout vous paraît gris.'}
  ]}
];
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
const PHOTOS=[['🌄','Une aube'],['🌊','Une mer agitée'],['🧗','Une paroi'],['🌳','Un arbre'],['🚪','Une porte'],['🧭','Une boussole'],['🌧️','La pluie'],['🔥','Un feu'],['🪢','Un nœud'],['🌱','Une pousse'],['🏔️','Un col'],['🤲','Des mains']];
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
  ext:'<svg class="i" viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h5"/></svg>'
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
const LIM={me:30,draft:4000,q:1500,line:240,phrase:140,three:120,photo:2000,evo:1500,search:60};
const tel=(n,label)=>'<a class="tel" href="tel:'+String(n).replace(/[^0-9+]/g,'')+'">'+(label||n)+'</a>';
const HELP=[
  {t:'La Main Tendue',tel:'143',d:'Pour parler quand ça ne va pas, de jour comme de nuit.'},
  {t:'Pro Juventute, conseils aux parents',tel:'058 261 61 61',d:'Gratuit et confidentiel, 24 heures sur 24, pour toutes les questions de parents.'},
  {t:'Urgences',tel:'144',d:'En cas de danger immédiat pour la vie.'},
  {t:'Pro Infirmis',url:'https://www.proinfirmis.ch/fr/a-propos/prestations.html',label:'proinfirmis.ch',d:'Consultation sociale gratuite et confidentielle, dans votre canton.'}
];

/* ---------- état ---------- */
const DEF={tier:'free',me:'',age:'e',situation:'hand',weights:[],start:'',moods:{},depots:[],shared:{},steps:{},evo:{},photo:null,abc:[],phrases:[],routineDone:{},three:[],letters:[],questions:[],onboarded:false,doseDate:'',doseText:''};
const state={data:null,view:'today',prev:null,lastKey:null,lastSheet:null,sit:null,q:'',theme:'all',age:'all',sheet:null,upFeat:null,toast:'',exo:null,kit:'sits',tool:'timer',timer:{total:300,left:300,running:false,h:null},ft:{first:null,then:null,pick:'first'},confirmReset:false,sample:null,inClaude:false,busy:false,ctl:null,draft:'',qdraft:'',step:null,evoTime:'t1',depotMode:'listen',doseBusy:false,letter:null};
let toastTimer=null;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function load(){try{const d=JSON.parse(localStorage.getItem(KEY)||'null');if(d&&typeof d==='object')return Object.assign(JSON.parse(JSON.stringify(DEF)),d);}catch(e){}return JSON.parse(JSON.stringify(DEF));}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state.data));}catch(e){}}
function toast(m){state.toast=m;state.toastView=state.view;renderToast();clearTimeout(toastTimer);toastTimer=setTimeout(()=>{state.toast='';renderToast();},3000);}
function renderToast(){const old=document.querySelector('.toast');if(old)old.remove();if(state.toast){const el=document.createElement('div');el.className='toast';el.setAttribute('role','status');el.textContent=state.toast;document.getElementById('app').appendChild(el);}}
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
function currentStepIdx(){return Math.min(23,weekNo());}
function doneCount(){return Object.keys(D().steps).filter(k=>D().steps[k]).length;}
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

/* ---------- rendu ---------- */
const BACK_VIEWS=['sit','exo','step','photo','data','about','plans','evo','depots','antonio','letter'];
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
    key=state.view;html+=bar();
    switch(state.view){
      case 'today':html+=viewToday();break;
      case 'parcours':html+=viewParcours();break;
      case 'step':html+=viewStep();break;
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
    html+=tabs();
  }
  /* Les animations d'apparition ne jouent qu'en entrant sur un écran ou en ouvrant une feuille, pas à chaque appui. */
  const entering=key!==state.lastKey;state.lastKey=key;
  const sheetIn=!!state.sheet&&state.sheet!==state.lastSheet;state.lastSheet=state.sheet;
  if(state.sheet==='onboard')html+=sheetOnboard(sheetIn);
  if(state.sheet==='upgrade')html+=sheetUpgrade(sheetIn);
  app.className=base+(entering?' enter':'');
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
}
/* ---------- « Mon histoire » : adresse partageable (#histoire, sur le site) et un seul moment d'animation ---------- */
const STORY_HASH='#histoire';const TITLE0=document.title;
function syncStory(entering){
  const on=state.view==='about';
  try{document.title=on?'Mon histoire, par Antonio Company, créateur de Parent Écouté, Parent Éclairé':TITLE0;}catch(e){}
  if(SITE&&!on&&location.hash===STORY_HASH){try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}}
  if(!on||!entering)return;
  const el=document.querySelector('.avec');
  if(!el||!('IntersectionObserver' in window)||(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches))return;
  el.classList.add('arm');
  const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){el.classList.add('seen');io.disconnect();}},{threshold:.35});
  io.observe(el);
}
function openStory(){
  if(SITE&&location.hash!==STORY_HASH){location.hash=STORY_HASH.slice(1);return;}
  showStory();
}
function showStory(){if(state.view!=='about')state.prev=state.view;state.view='about';state.sheet=null;state.confirmReset=false;stopTimer();render();window.scrollTo(0,0);}
function bar(){
  const back=BACK_VIEWS.includes(state.view)?'<button type="button" class="back" data-act="back">'+I.back+'Retour</button>':'';
  const wm=back?'':'<span class="wordmark">'+LOGO+'<span>Parent écouté<small>parent éclairé</small></span></span>';
  return '<header class="bar">'+back+wm+'<button type="button" class="sos" data-act="go" data-view="sos">'+I.alert+'SOS</button></header>';
}
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
function viewIntro(){
  const cta=wide=>'<button type="button" class="btn primary'+(wide?' wide':'')+'" data-act="onboard">'+I.sun2+'Commencer gratuitement</button>';
  const priv=SITE?'Cette version de test est gratuite et tout ce que vous écrivez reste sur votre appareil. La phrase-miroir personnalisée arrivera avec la version complète. En attendant, chaque dépôt reçoit une question et une lumière.':'Vos notes restent sur votre appareil. Quand vous déposez, votre texte part sans votre nom pour recevoir une réponse.';
  return '<main id="main" tabindex="-1" class="view" style="padding-top:0">'+
    '<div class="herofull bleed"><img class="herobg" src="'+HERO+'" alt="Une goutte tombe sur un étang et dessine des cercles, dans la lumière d’une forêt." width="866" height="470" decoding="async" fetchpriority="high"><span class="pill test">Version de test</span><h1>Parent Écouté,<br>Parent Éclairé</h1><span class="by">Par Antonio Company</span><p class="tag">Un espace d’écoute pour tout parent en chemin, pour déposer ce qui pèse, recevoir chaque jour une dose de lumière et avancer six mois à votre rythme.</p>'+cta(false)+'</div>'+
    '<div class="pillars reveal d1">'+
    '<div class="pillar"><span class="ic">'+I.drop+'</span><div><h2>Écouté</h2><span>Vous déposez par écrit ce qui vous pèse, sans donner de prénom. En retour, vous recevez une phrase-miroir, une question qui ouvre et une lumière.</span></div></div>'+
    '<div class="pillar sun"><span class="ic">'+I.sun2+'</span><div><h2>Éclairé</h2><span>Vous recevez chaque matin la dose de lumière intérieure et vous suivez un parcours de six mois, à raison d’une étape par semaine.</span></div></div>'+
    '<div class="pillar"><span class="ic">'+I.user+'</span><div><h2>Accompagné, si vous le voulez</h2><span>Antonio Company, travailleur social depuis ses 19 ans, vous écrit chaque mois dans la formule « Avec Antonio ».</span></div></div>'+
    '</div>'+
    '<section class="voice reveal d2" aria-labelledby="voice-t"><h2 id="voice-t" class="sr">Qui est derrière cet espace</h2><p class="say">Avant d’accompagner des familles, j’ai moi-même été accueilli dans une famille.</p><p>J’ai été placé en famille d’accueil à dix ans, je suis travailleur social depuis mes 19 ans et je suis père de trois enfants. Moi aussi, j’ai connu ces périodes où la santé d’un enfant prend beaucoup de place.</p><p>Avec le temps, j’ai appris à composer, à apprendre et à évoluer avec la différence, et c’est ce que j’ai voulu mettre dans cet espace.</p><div class="who"><span class="av" aria-hidden="true">A</span><b>Antonio Company</b><button type="button" class="linkbtn" data-act="peek-about">Lire mon histoire</button></div></section>'+
    '<div class="cta-stack reveal d3">'+cta(true)+'</div>'+
    '<p class="hint" style="text-align:center">'+priv+'</p></main>'+
    '<footer class="foot"><button type="button" class="linkbtn" data-act="peek-plans">Formules</button>'+(SITE?'<a href="confidentialite.html">Confidentialité</a><a href="conditions.html">Conditions générales</a>':'')+'</footer>';
}
/* ---------- aujourd’hui ---------- */
function viewToday(){
  const d=D();const t=todayIso();const m=d.moods[t];const st=allSteps()[currentStepIdx()];const rd=recentDepot();
  let html='<main id="main" tabindex="-1" class="view" style="padding-top:0"><div class="band bleed" style="background-image:url('+HERO+')"><span class="label">'+esc(fmtDate(t))+', semaine '+(weekNo()+1)+'</span><h1 class="t1">'+esc(greeting())+(d.me?', '+esc(d.me):'')+'.</h1></div>';
  if(can('antonio'))html+=letterCard();
  if(!d.evo.t1)html+='<button type="button" class="card reveal d1" data-act="go" data-view="evo" style="text-align:left;cursor:pointer;border-color:var(--green)"><div class="row" style="justify-content:space-between;align-items:center"><span class="label" style="color:var(--green)">Pour commencer, 3 minutes</span><span class="pill green">Étape 1</span></div><p class="lesson" style="font-size:20px">Le questionnaire de départ</p><span class="hint">Il y a cinq curseurs et deux questions pour voir où vous en êtes aujourd’hui. Vous le referez à trois mois puis à six mois, et c’est ce qui vous montrera le chemin parcouru.</span><span class="btn primary small" style="align-self:flex-start;margin-top:4px">'+I.chart+'Faire mon point de départ</span></button>';
  html+='<div class="dose reveal d1"><span class="label">'+(new Date().getDay()===0?'Dose spéciale du dimanche':'La dose de lumière intérieure')+'</span><p>'+esc(doseText())+'</p><span class="sig">Antonio</span>'+
    (rd&&state.sample?(can('parcours')?'<div class="row"><button type="button" class="btn small" data-act="dose-perso"'+(state.doseBusy?' disabled':'')+'>'+I.sun2+(state.doseBusy?'Un instant…':(d.doseDate===t?'Une autre dose pour moi':'Ma dose, d’après ce que j’ai déposé'))+'</button></div>':'<div class="row"><button type="button" class="btn small" data-act="upgrade" data-f="dose">'+I.lock+'Ma dose personnalisée</button></div>'):'')+'</div>';
  html+=depotBox();
  html+='<button type="button" class="step now reveal d3" data-act="step" data-i="'+st.idx+'"><span class="n">'+(st.idx+1)+'</span><span class="tx"><span class="label">L’étape de la semaine</span><b>'+esc(st.t)+'</b></span><span class="chev">'+I.chev+'</span></button>';
  html+='<div class="card reveal d4"><span class="label">Comment ça va, là, maintenant ?</span><div class="moodrow">'+MOODS.map((x,i)=>'<button type="button" data-act="mood" data-i="'+i+'" aria-pressed="'+(m===i)+'" aria-label="'+esc(x[1])+'">'+x[0]+'</button>').join('')+'</div>'+(m!==undefined?'<p style="font-family:var(--font-display);font-size:17px;line-height:1.4">'+esc(MOOD_WORDS[m])+'</p>':'')+'</div>';
  return html+'</main>';
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
      '<textarea id="draft" maxlength="'+LIM.draft+'" placeholder="Qu’est-ce qui pèse, là, maintenant ? Écrivez comme ça vient, sans prénom." style="min-height:110px">'+esc(state.draft)+'</textarea>'+
      '<div class="chips" role="group" aria-label="Ce que vous attendez"><button type="button" class="chip" data-act="dmode" data-v="listen" aria-pressed="'+(state.depotMode==='listen')+'">Écoutez-moi</button><button type="button" class="chip" data-act="dmode" data-v="advice" aria-pressed="'+(state.depotMode==='advice')+'">Et concrètement, je fais quoi ?</button></div>'+
      '<div class="row" style="align-items:center">'+(state.busy?'<button type="button" class="btn" data-act="dstop">'+I.stop+'Arrêter</button>':'<button type="button" class="btn primary" data-act="dsend">'+I.drop+'Déposer</button>')+'<span class="count" id="draft-count" aria-hidden="true"></span></div>'+
      (state.sample===false?'<p class="hint">Dans cette version de test, votre texte ne quitte pas votre appareil. Vous recevez une question et une lumière choisies par l’application, et la phrase-miroir arrivera avec la version complète.</p>':'');
  }
  if(state.busy)html+='<div class="mirror"><div class="think" role="status"><span class="dotp"></span>Je vous lis…</div></div>';
  if(td&&!state.busy)html+=depotHtml(td,true);
  html+='</div>';return html;
}
function depotHtml(x,compact){
  let out='<div class="mirror"><span class="lbl">'+esc(fmtDate(x.date))+(x.time?' à '+esc(hm(x.time)):'')+'</span>'+(compact?'':'<p class="depot you">« '+esc(x.text.length>220?x.text.slice(0,220)+'…':x.text)+' »</p>');
  if(x.risk)out+=riskHtml('q');
  if(x.miroir)out+='<p class="m">'+esc(x.miroir)+'</p>';
  if(x.question)out+='<p class="q">'+esc(x.question)+'</p>';
  if(x.lumiere)out+='<p class="l">'+esc(x.lumiere)+'</p>';
  if(x.conseil)out+='<div class="q">'+mdLite(x.conseil)+'</div>';
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
  const text=clean(state.draft,LIM.draft);if(text.length<5){fieldErr('draft','Écrivez quelques mots, comme ça vient (cinq caractères au moins).');return;}
  if(depotsLeft()===0){openUpgrade('depots');render();return;}
  const d=D();const n=new Date();const dep={id:'d'+Date.now(),date:todayIso(),time:pad(n.getHours())+':'+pad(n.getMinutes()),text,mode:state.depotMode};
  if(RISK.test(text)){dep.risk=true;toast('Si c’est urgent, appelez le 143 (La Main Tendue) ou le 144, de jour comme de nuit.');}
  state.draft='';state.busy=true;render();
  if(!state.sample){
    dep.question=LOCAL_Q[dayIdx(LOCAL_Q.length)];dep.lumiere=WORDS[(dayIdx(WORDS.length)+3)%WORDS.length];
    d.depots.push(dep);state.busy=false;save();render();if(!dep.risk)toast('C’est déposé et gardé pour vous.');return;
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
  d.depots.push(dep);state.busy=false;state.ctl=null;save();render();
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
function stepLocked(idx){return idx>0&&!can('parcours');}
function viewParcours(){
  const cur=currentStepIdx();const steps=allSteps();const done=doneCount();const pct=Math.round(done/24*100);
  return '<main id="main" tabindex="-1" class="view" style="padding-top:0"><div class="band thin bleed" style="background-image:url('+HERO+');background-position:center 6%"><h1 class="t1">Le parcours</h1></div><p class="sub">Le parcours dure six mois, avec une étape par semaine. À chaque fois, vous avez deux minutes de lecture, une chose à essayer et une chose à observer.</p>'+
    '<div class="card"><div class="kv"><span>Semaine '+(weekNo()+1)+'</span><span>'+done+' sur 24 étapes</span></div><div class="progress"><b style="width:'+pct+'%"></b></div>'+
    '<div class="quick"><button type="button" class="btn" data-act="go" data-view="evo">'+I.chart+'Mon évolution</button><button type="button" class="btn" data-act="go" data-view="photo">'+(can('parcours')?I.image:I.lock)+'Photolangage</button></div></div>'+
    '<div class="months">'+PARCOURS.map((m,mi)=>'<div class="month"><h2><span class="n">'+(mi+1)+'</span>'+esc(m.m)+'</h2>'+m.steps.map((s,si)=>{const st=steps.find(x=>x.mi===mi&&x.si===si);const dn=!!D().steps[st.idx];const lk=stepLocked(st.idx);return '<button type="button" class="step'+(st.idx===cur?' now':'')+(dn?' done':'')+(lk?' locked':'')+'" data-act="step" data-i="'+st.idx+'"><span class="n">'+(lk?I.lock:dn?I.check:(st.idx+1))+'</span><span class="tx"><b>'+esc(s.t)+'</b><span>'+(st.idx===cur?'Cette semaine':'Semaine '+(st.idx+1))+'</span></span><span class="chev">'+I.chev+'</span></button>';}).join('')+'</div>').join('')+'</div>'+
    (can('parcours')?'<p class="hint">Vous pouvez avancer librement. Le parcours vous propose un rythme, mais vous restez libre du vôtre.</p>':lockline('Les 23 étapes suivantes font partie du Parcours, à 14 CHF par mois','parcours'))+'</main>';
}
function viewStep(){
  const steps=allSteps();const s=steps[state.step];if(!s){state.view='parcours';return viewParcours();}
  const dn=!!D().steps[s.idx];
  const links={evo:['go','evo',I.chart,'Faire le point dans Mon évolution'],photo:['go','photo',I.image,'Ouvrir le photolangage'],breath:['exo','breath',I.wind,'Respirer 4-6 maintenant'],advice:['kit','sits',I.bulb,'Ouvrir les situations'],pros:['sit','pros',I.bulb,'Parler aux professionnels']};
  const lk=s.link?links[s.link]:null;
  return '<main id="main" tabindex="-1" class="view"><div><span class="label">Étape '+(s.idx+1)+' sur 24, mois '+(s.mi+1)+'</span><h1 class="t1">'+esc(s.t)+'</h1><p class="sub">'+esc(PARCOURS[s.mi].m)+'</p></div>'+
    '<div class="card"><span class="label">En deux minutes</span><p class="lesson">'+esc(s.lesson)+'</p><p class="hint" style="text-align:right">Antonio</p></div>'+
    '<div class="exo"><span class="label">Cette semaine, j’essaie</span><p>'+esc(s.exo)+'</p></div>'+
    '<div class="card green"><span class="label">À observer</span><p>'+esc(s.obs)+'</p></div>'+
    (lk?'<button type="button" class="btn wide" data-act="'+lk[0]+'" data-view="'+lk[1]+'" data-id="'+lk[1]+'" data-v="'+lk[1]+'">'+lk[2]+lk[3]+'</button>':'')+
    '<div class="quick"><button type="button" class="btn'+(dn?'':' primary')+'" data-act="stepdone" data-i="'+s.idx+'">'+I.check+(dn?'Étape faite':'Marquer comme faite')+'</button>'+(s.idx<23?'<button type="button" class="btn" data-act="step" data-i="'+(s.idx+1)+'">Étape suivante '+I.chev+'</button>':'<button type="button" class="btn" data-act="go" data-view="evo">'+I.chart+'Mon évolution</button>')+'</div></main>';
}
/* ---------- évolution ---------- */
function viewEvo(){
  const e=D().evo;const t=state.evoTime;const cur=e[t]||{};
  const chips='<div class="chips">'+EVO_TIMES.map((x,i)=>{const lk=i>0&&!can('parcours');return '<button type="button" class="chip" data-act="evotime" data-v="'+x[0]+'" aria-pressed="'+(t===x[0])+'">'+(lk?I.lock+' ':'')+x[1]+(e[x[0]]?' ✓':'')+'</button>';}).join('')+'</div>';
  const scales=EVO_SCALES.map(s=>'<div class="scale"><b>'+esc(s.t)+'</b><input type="range" min="0" max="10" step="1" value="'+(cur[s.id]!==undefined?cur[s.id]:5)+'" data-evo="'+s.id+'" aria-label="'+esc(s.t)+'"><div class="row"><span><b>0</b> '+esc(s.lo)+'</span><span><b>10</b> '+esc(s.hi)+'</span></div></div>').join('');
  const opens=EVO_OPEN.map(o=>'<div class="field"><label for="evo-'+o[0]+'">'+esc(o[1])+'</label><textarea id="evo-'+o[0]+'" data-evoopen="'+o[0]+'" maxlength="'+LIM.evo+'" style="min-height:80px">'+esc(cur[o[0]]||'')+'</textarea></div>').join('');
  const have=EVO_TIMES.filter(x=>e[x[0]]);
  let bars='';
  if(have.length){bars='<div class="card"><span class="label">Le chemin</span><div class="bars">'+EVO_SCALES.map(s=>'<div class="barrow"><span>'+esc(s.t.replace('Mon ','').replace('Ma ',''))+'</span><div class="bartrack">'+EVO_TIMES.map((x,i)=>e[x[0]]?'<i class="t'+(i+1)+'"><b style="width:'+(Number(e[x[0]][s.id]||0)*10)+'%"></b></i>':'').join('')+'</div></div>').join('')+'</div><div class="legend">'+have.map(x=>'<span class="t'+(EVO_TIMES.indexOf(x)+1)+'">'+esc(x[1])+(e[x[0]].date?', '+esc(fmtDate(e[x[0]].date)):'')+'</span>').join('')+'</div><p class="hint">Avec le temps, le stress et la solitude devraient baisser, alors que la compétence, le regard et la confiance devraient monter. Tout ce qui bouge, c’est grâce à vous.</p></div>';}
  return '<main id="main" tabindex="-1" class="view"><div><span class="label">'+(t==='t1'?'Le questionnaire de départ':t==='t2'?'Le point à trois mois':'Le bilan à six mois')+'</span><h1 class="t1">Mon évolution</h1><p class="sub">Vous faites le point trois fois en six mois, au départ, à mi-parcours et au bilan. Il y a cinq curseurs et deux questions à chaque fois. Il n’y a pas de bonne réponse, seulement la vôtre aujourd’hui.</p></div>'+chips+bars+
    '<div class="card">'+scales+opens+'<button type="button" class="btn primary" data-act="evosave" style="align-self:flex-start">'+I.check+'Enregistrer ce point</button></div></main>';
}
/* ---------- photolangage ---------- */
function viewPhoto(){
  const p=D().photo||{};
  return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">Photolangage</h1><p class="sub">Choisissez l’image qui dit le mieux votre vécu aujourd’hui. Puis écrivez ce qu’elle évoque, et pourquoi vous l’avez choisie. Une image dit souvent ce que les mots n’osent pas.</p></div>'+
    '<div class="photos" role="group" aria-label="Images du photolangage">'+PHOTOS.map((x,i)=>'<button type="button" data-act="photopick" data-i="'+i+'" aria-pressed="'+(p.i===i)+'"><span>'+x[0]+'</span>'+x[1]+'</button>').join('')+'</div>'+
    '<div class="card"><div class="field"><label for="ptext">Ce qu’elle évoque pour moi</label><textarea id="ptext" maxlength="'+LIM.photo+'" style="min-height:120px">'+esc(p.text||'')+'</textarea></div><button type="button" class="btn primary" data-act="photosave" style="align-self:flex-start">'+I.check+'Garder</button>'+(p.date?'<p class="hint">Choisi le '+esc(fmtDate(p.date))+'. Vous pourrez refaire l’exercice au bilan et comparer.</p>':'')+'</div></main>';
}

/* ---------- boîte à outils ---------- */
function viewKit(){
  const seg='<div class="seg" role="group" aria-label="Rubriques de la boîte à outils"><button type="button" data-act="kit" data-v="sits" aria-pressed="'+(state.kit==='sits')+'">Situations</button><button type="button" data-act="kit" data-v="tools" aria-pressed="'+(state.kit==='tools')+'">Outils</button><button type="button" data-act="kit" data-v="me" aria-pressed="'+(state.kit==='me')+'">Pour moi</button></div>';
  let body='';
  if(state.kit==='sits')body=kitSits();else if(state.kit==='tools')body=kitTools();else body=kitMe();
  return '<main id="main" tabindex="-1" class="view" style="padding-top:0"><div class="band thin bleed" style="background-image:url('+HERO+');background-position:left 55%"><h1 class="t1">La boîte à outils</h1></div><p class="sub">'+(state.kit==='sits'?'Vous trouverez ici vingt-deux situations de la vraie vie, avec des pistes venues du terrain et toujours un mot pour vous.':state.kit==='tools'?'Ce sont les outils que les éducateurs utilisent tous les jours, et vous pouvez les poser sur la table de la cuisine.':'Deux minutes rien que pour vous, parce que vous êtes aussi une personne et pas seulement un parent.')+'</p>'+seg+body+'</main>';
}
function kitSits(){
  let list=SITS.filter(s=>(state.theme==='all'||s.th===state.theme)&&(state.age==='all'||s.ages.includes(state.age)));
  const q=state.q.trim().toLowerCase();if(q)list=list.filter(s=>(s.t+' '+s.s+' '+s.comp).toLowerCase().includes(q));
  return '<div class="search">'+I.search+'<input type="search" id="q" aria-label="Chercher une situation" maxlength="'+LIM.search+'" placeholder="Coucher, crise, école…" value="'+esc(state.q)+'" autocomplete="off" enterkeyhint="search"></div>'+
    '<div class="chips scroll" role="group" aria-label="Âge">'+Object.keys(AGES).map(k=>'<button type="button" class="chip" data-act="age" data-v="'+k+'" aria-pressed="'+(state.age===k)+'">'+AGES[k]+'</button>').join('')+'</div>'+
    '<div class="chips scroll" role="group" aria-label="Thème">'+Object.keys(THEMES).map(k=>'<button type="button" class="chip" data-act="theme" data-v="'+k+'" aria-pressed="'+(state.theme===k)+'">'+THEMES[k]+'</button>').join('')+'</div>'+
    '<div class="sits">'+(list.length?list.map(s=>'<button type="button" class="sit" data-act="sit" data-id="'+s.id+'"><span class="e">'+s.e+'</span><span class="tx"><b>'+esc(s.t)+'</b><span>'+esc(s.s)+'</span></span><span class="chev">'+I.chev+'</span></button>').join(''):'<p class="hint">Je n’ai rien trouvé pour ce mot. Vous pouvez le déposer sur l’accueil, et vous recevrez une réponse.</p>')+'</div>';
}
function viewSit(){
  const s=SITS.find(x=>x.id===state.sit);if(!s){state.view='kit';return viewKit();}
  const li=a=>'<ul class="list">'+a.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
  return '<main id="main" tabindex="-1" class="view"><div><span class="label">'+esc(liste(s.ages.map((a,i)=>i?AGES[a].toLowerCase():AGES[a])))+'</span><h1 class="t1">'+s.e+' '+esc(s.t)+'</h1><p class="sub">'+esc(s.s)+'</p></div>'+
    '<div class="card sec"><h2><span class="dot"></span>Ce qui se passe</h2><p>'+esc(s.comp)+'</p></div>'+
    '<div class="card sec ess"><h2><span class="dot"></span>Ce que vous pouvez essayer</h2>'+li(s.ess)+'</div>'+
    '<div class="card sec ev"><h2><span class="dot"></span>Ce qu’il vaut mieux éviter</h2>'+li(s.ev)+'</div>'+
    '<div class="comfort">'+esc(s.moi)+'</div>'+
    '<div class="card sec aide"><h2><span class="dot"></span>Quand demander de l’aide</h2><p>'+esc(s.aide)+'</p></div>'+
    '<div class="quick"><button type="button" class="btn" data-act="go" data-view="today">'+I.drop+'Déposer</button><button type="button" class="btn" data-act="kit" data-v="tools">'+I.tools+'Les outils</button></div></main>';
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
const FT_DIT={'Manger':'manger','Douche':'la douche','Dents':'les dents','Dodo':'le dodo','Jouer':'jouer','Tablette':'la tablette','École':'l’école','Voiture':'la voiture','Pause':'la pause','Câlin':'le câlin','Dehors':'aller dehors','Musique':'la musique','Histoire':'l’histoire','Habiller':'s’habiller','Doudou':'le doudou','Toilettes':'les toilettes'};
function toolFT(){const f=state.ft;const dit=v=>FT_DIT[v[1]]||v[1].toLowerCase();const card=(k,lbl,v,cls,vide)=>'<button type="button" class="ftcard '+cls+'" data-act="ftpick" data-k="'+k+'" style="'+(f.pick===k?'box-shadow:var(--shadow)':'')+'"><span class="lbl">'+lbl+'</span>'+(v?'<span class="big">'+v[0]+'</span><span class="txt">'+esc(v[1])+'</span>':'<span class="hint">'+vide+'</span>')+'</button>';return '<div class="card"><span class="label">Tableau « d’abord, ensuite »</span><p class="hint">Ce tableau montre deux images à votre enfant. La première est ce qu’il doit faire, et la seconde est ce qui lui fait plaisir juste après. Il accepte plus facilement la première quand il voit la seconde. Par exemple, d’abord les dents, ensuite l’histoire.</p><div class="ft">'+card('first','D’abord',f.first,'','Ce qu’il doit faire')+card('then','Ensuite',f.then,'then','Ce qui lui fait plaisir')+'</div>'+(f.first&&f.then?'<div class="comfort">Montrez-lui le tableau et dites « D’abord '+esc(dit(f.first))+', ensuite '+esc(dit(f.then))+' ».</div>':'')+'<p class="hint">Touchez une image pour '+(f[f.pick]?'changer':'remplir')+' la case <b>'+(f.pick==='first'?'D’abord':'Ensuite')+'</b>.</p><div class="picto">'+PICTOS.map((p,i)=>'<button type="button" data-act="ftset" data-i="'+i+'" aria-pressed="'+((f[f.pick]&&f[f.pick][1]===p[1])?'true':'false')+'"><span>'+p[0]+'</span>'+p[1]+'</button>').join('')+'</div></div>';}
function toolRoutine(){const d=D();const r=ROUTINE_DEF;const done=d.routineDone[todayIso()]||{};const all=r.every((x,i)=>done[i]);return '<div class="card"><span class="label">La routine du soir</span><p class="hint">Suivez le même ordre chaque soir. Laissez votre enfant cocher lui-même, pour qu’il sente que c’est lui qui avance.</p><div class="routine">'+r.map((x,i)=>'<button type="button" class="rstep'+(done[i]?' done':'')+'" data-act="rdone" data-i="'+i+'"><span class="e">'+x[0]+'</span><span class="t">'+esc(x[1])+'</span><span class="ck">'+(done[i]?I.check:'')+'</span></button>').join('')+'</div>'+(all?'<div class="comfort">Tout est fait. Bonne nuit à tous les deux.</div>':'')+'<button type="button" class="btn small" data-act="rreset" style="align-self:flex-start">Remettre à zéro</button></div>';}
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
  return '<main id="main" tabindex="-1" class="view" style="padding-top:0"><div class="band thin bleed" style="background-image:url('+HERO+');background-position:right 70%"><h1 class="t1">Moi</h1></div><p class="sub">Vous retrouvez ici votre formule, vos dépôts, votre humeur et vos réglages.</p>'+
    '<div class="card"><span class="label">Ma formule</span><div class="row" style="align-items:center;justify-content:space-between">'+badge()+'<span class="price" style="font-family:var(--font-display);font-size:22px">'+esc(T.p)+' CHF <small style="font-size:13px;color:var(--muted);font-family:var(--font-ui);font-weight:700">'+esc(T.per)+'</small></span></div>'+
    (tier()==='free'?'<p class="hint">Vous avez la dose, la boîte à outils, le SOS, trois dépôts écoutés et la première étape. Il vous reste '+depotsLeft()+' dépôt'+(depotsLeft()>1?'s':'')+'.</p>':tier()==='parcours'?'<p class="hint">Vous avez les dépôts sans limite, la dose personnalisée, les 24 étapes, Mon évolution et le photolangage.</p>':'<p class="hint">Vous avez tout Le parcours, le mot d’Antonio chaque mois et deux questions par mois.</p>')+
    '<button type="button" class="btn'+(tier()==='free'?' primary':'')+'" data-act="go" data-view="plans" style="align-self:flex-start">'+I.tag+(tier()==='free'?'Voir les formules':'Changer de formule')+'</button></div>'+
    (can('antonio')?'<button type="button" class="sit" data-act="go" data-view="antonio"><span class="e">'+I.mail+'</span><span class="tx"><b>Mes échanges avec Antonio</b><span>'+(DEMO?'Démonstration avec un exemple de mot et de réponse':'Prochain mot le '+esc(nextLetterDate())+', il vous reste '+ql+' question'+(ql>1?'s':''))+'</span></span><span class="chev">'+I.chev+'</span></button>':'<button type="button" class="sit" data-act="upgrade" data-f="antonio"><span class="e">'+I.lock+'</span><span class="tx"><b>Avec Antonio</b><span>Un mot par mois et deux questions</span></span><span class="chev">'+I.chev+'</span></button>')+
    '<button type="button" class="sit" data-act="go" data-view="depots"><span class="e">'+I.drop+'</span><span class="tx"><b>Mes dépôts</b><span>'+(d.depots.length?d.depots.length+' dépôt'+(d.depots.length>1?'s':'')+', le dernier le '+esc(fmtDate(ld.date)):'Aucun dépôt pour l’instant')+'</span></span><span class="chev">'+I.chev+'</span></button>'+
    '<div class="card"><span class="label">Mon humeur, quatorze jours</span>'+moodDots()+'<p class="hint">Chaque carré représente un jour, du plus ancien au plus récent. C’est ce qu’Antonio regardera en premier dans la formule Avec Antonio.</p></div>'+
    '<div class="menu-list"><button type="button" data-act="onboard">'+I.swap+'<span>Modifier le début (prénom, âge, situation)</span><span class="chev">'+I.chev+'</span></button><button type="button" data-act="go" data-view="data">'+I.download+'<span>Vos données et tout recommencer</span><span class="chev">'+I.chev+'</span></button><button type="button" data-act="go" data-view="about">'+I.info+'<span>L’histoire d’Antonio</span><span class="chev">'+I.chev+'</span></button>'+
    (SITE?'<a href="confidentialite.html">'+I.shield+'<span>Politique de confidentialité</span><span class="chev">'+I.chev+'</span></a><a href="conditions.html">'+I.note+'<span>Conditions générales</span><span class="chev">'+I.chev+'</span></a>':'')+'</div></main>';
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
    return t===k?'<button type="button" class="btn wide" disabled>'+I.check+'Votre formule</button>':'<button type="button" class="btn'+(k==='parcours'?' primary':'')+' wide" data-act="tier" data-v="'+k+'" aria-label="'+(k==='free'?'Revenir à la formule Découverte':'Choisir la formule '+esc(name))+'">'+(k==='free'?'Revenir à Découverte':'Choisir')+'</button>';
  };
  return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">Les formules</h1><p class="sub">Les formules sont sans engagement et vous pouvez arrêter à tout moment. Voici ce que chacune vous donne concrètement.</p></div>'+
    '<div class="card"><table class="cmp"><caption class="sr">Ce que comprend chaque formule</caption><thead><tr><th scope="col"><span class="sr">Ce qui est compris</span></th><th scope="col">Découverte<br>0</th><th scope="col" class="best">Parcours<br>14/mois</th><th scope="col">Antonio<br>49/mois</th></tr></thead><tbody>'+FEATURES.map(f=>'<tr><th scope="row">'+esc(f[0])+'</th>'+cell(f[1])+cell(f[2])+cell(f[3])+'</tr>').join('')+'</tbody></table></div>'+
    '<div class="plans">'+
    '<div class="plan"><h2 class="t2">Découverte</h2><div class="price">0 CHF <small>pour toujours</small></div><p>Cette formule vous permet de voir si l’espace vous parle. Vous avez la dose chaque jour, toute la boîte à outils, trois dépôts écoutés et la première étape.</p>'+btn('free')+'</div>'+
    '<div class="plan best"><span class="pill sun">Recommandé</span><h2 class="t2">Le parcours</h2><div class="price">14 CHF <small>par mois</small></div><p>Tous les cadenas disparaissent. Vous déposez autant que nécessaire avec la phrase-miroir, vous recevez une dose écrite pour vous, vous suivez les 24 étapes et vous voyez votre chemin sur six mois.</p>'+btn('parcours')+'</div>'+
    '<div class="plan"><h2 class="t2">Avec Antonio</h2><div class="price">49 CHF <small>par mois</small></div><p>Vous avez tout Le parcours, avec en plus un travailleur social qui vous connaît. <b>Chaque mois, Antonio lit les dépôts que vous choisissez de lui partager et vous écrit un mot personnel</b>, qui s’affiche en haut de votre accueil. <b>Deux fois par mois, vous pouvez lui poser une question</b> et il vous répond par écrit dans les 48 heures. Il ne demande jamais le prénom de votre enfant et ne pose jamais de diagnostic.</p>'+btn('antonio')+'</div></div>'+
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
  const where=state.sample?'Quand vous déposez, votre texte est envoyé sans votre nom pour écrire la réponse, et l’application ne le garde nulle part ailleurs que sur cet appareil.':'Dans cette version, rien de ce que vous écrivez n’est envoyé, ni à un serveur ni à Antonio.';
  return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">Vos données</h1><p class="sub">Vos dépôts, vos points et vos notes restent sur cet appareil. '+where+'</p></div>'+
    '<div class="card green"><span class="label">Bon à savoir</span><p class="hint">Vos dépôts ne sont pas protégés par un mot de passe. Si vous prêtez ce téléphone, verrouillez-le ou effacez d’abord vos notes. Sachez aussi que si vous effacez les données de votre navigateur, vos notes sont perdues, parce qu’il n’en existe aucune copie ailleurs.</p></div>'+
    '<div class="card"><span class="label">Recommencer depuis le début</span><p class="hint">Ce bouton efface tout ce qui est sur cet appareil, c’est-à-dire votre prénom, vos dépôts, vos étapes et vos points, puis il rouvre l’écran d’accueil et le questionnaire de départ. C’est utile pour faire tester l’application à une autre personne sur votre téléphone.</p>'+(state.confirmReset?'<div class="confirm" role="alert"><span>Effacer tout le contenu sur cet appareil ?</span><div class="row"><button type="button" class="btn danger" data-act="reset-yes">Oui, effacer</button><button type="button" class="btn" data-act="reset-no">Annuler</button></div></div>':'<button type="button" class="btn danger" data-act="reset" style="align-self:flex-start">'+I.trash+'Tout effacer et recommencer</button>')+'</div>'+
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
  const grp={today:['today'],parcours:['parcours','step','evo','photo'],kit:['kit','sit','exo'],me:['me','plans','depots','antonio','letter','data','about']};
  const cur=v=>grp[v].includes(state.view)?' aria-current="page"':'';
  return '<nav class="tabs" aria-label="Navigation"><div class="tabs-in"><button type="button" class="tab" data-act="go" data-view="today"'+cur('today')+'>'+I.sun2+'Aujourd’hui</button><button type="button" class="tab" data-act="go" data-view="parcours"'+cur('parcours')+'>'+I.path+'Parcours</button><button type="button" class="tab" data-act="go" data-view="kit"'+cur('kit')+'>'+I.kit+'Outils</button><button type="button" class="tab" data-act="go" data-view="me"'+cur('me')+'>'+I.user+'Moi</button></div></nav>';
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
function nav(v){state.prev=state.view;state.view=v;state.sheet=null;state.confirmReset=false;}
function handle(act,d,el){
  const data=D();
  switch(act){
    case 'peek-plans':state.prev=null;state.sheet=null;state.view='plans';break;
    case 'peek-about':openStory();return;
    case 'onboard':state.sheet='onboard';break;
    case 'ob':data[d.k]=d.v;save();break;
    case 'obw':{const i=data.weights.indexOf(d.v);if(i>=0)data.weights.splice(i,1);else data.weights.push(d.v);save();break;}
    case 'ob-done':{const m=document.getElementById('ob-me');data.me=clean(m?m.value:data.me,LIM.me);if(!data.start)data.start=todayIso();const first=!data.onboarded;data.onboarded=true;state.sheet=null;save();if(first)state.view='today';break;}
    case 'go':if(d.view==='about'){openStory();return;}if(d.view==='photo'&&!can('parcours')){openUpgrade('photo');break;}nav(d.view);if(d.view!=='kit'&&d.view!=='exo')stopTimer();break;
    case 'back':{if(!data.onboarded){state.view='today';break;}const v=state.view;let t;if(v==='sit'||v==='exo'){t='kit';stopTimer();}else if(v==='step'||v==='photo'||v==='evo')t='parcours';else if(v==='letter')t='antonio';else if(['plans','depots','antonio','data','about'].includes(v))t='me';else t='today';if(state.prev&&state.prev!==v&&state.prev!=='sos')t=state.prev;state.prev=null;state.view=t;break;}
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
    case 'step':{const i=Number(d.i);if(stepLocked(i)){openUpgrade('parcours');break;}state.step=i;nav('step');break;}
    case 'stepdone':data.steps[d.i]=!data.steps[d.i];save();if(data.steps[d.i])toast('Étape faite. Une par semaine, c’est le bon rythme.');break;
    case 'evotime':if(d.v!=='t1'&&!can('parcours')){openUpgrade('evo');break;}state.evoTime=d.v;break;
    case 'evosave':{if(state.evoTime!=='t1'&&!can('parcours')){openUpgrade('evo');break;}const rec={date:todayIso()};EVO_SCALES.forEach(s=>{const x=document.querySelector('[data-evo="'+s.id+'"]');rec[s.id]=x?Number(x.value):5;});EVO_OPEN.forEach(o=>{const x=document.querySelector('[data-evoopen="'+o[0]+'"]');rec[o[0]]=x?clean(x.value,LIM.evo):'';});const first=state.evoTime==='t1'&&!data.evo.t1;data.evo[state.evoTime]=rec;save();if(first){nav('today');render();window.scrollTo(0,0);toast('Votre point de départ est enregistré, et votre dose vous attend.');return;}render();toast('Point enregistré. Ce qui bouge est à vous.');return;}
    case 'photopick':data.photo=Object.assign({},data.photo||{},{i:Number(d.i)});save();break;
    case 'photosave':{const t=document.getElementById('ptext');if(!data.photo||data.photo.i===undefined){toast('Choisissez d’abord une image, puis écrivez ce qu’elle évoque.');return;}data.photo=Object.assign({},data.photo,{text:t?clean(t.value,LIM.photo):'',date:todayIso()});save();render();toast('Gardé.');return;}
    case 'tool':state.tool=d.v;if(d.v!=='timer')stopTimer();break;
    case 'tset':stopTimer();state.timer.total=Number(d.m)*60;state.timer.left=state.timer.total;break;
    case 'ttoggle':if(state.timer.running)stopTimer();else{if(state.timer.left===0)state.timer.left=state.timer.total;state.timer.running=true;state.timer.h=setInterval(tick,1000);}break;
    case 'treset':stopTimer();state.timer.left=state.timer.total;break;
    case 'minute':if(state.timer.running)stopTimer();else{state.timer.total=60;state.timer.left=60;state.timer.running=true;state.timer.h=setInterval(tick,1000);}break;
    case 'ftpick':state.ft.pick=d.k;break;
    case 'ftset':state.ft[state.ft.pick]=PICTOS[Number(d.i)];if(state.ft.pick==='first')state.ft.pick='then';break;
    case 'rdone':{const t=todayIso();data.routineDone[t]=data.routineDone[t]||{};data.routineDone[t][d.i]=!data.routineDone[t][d.i];save();break;}
    case 'rreset':data.routineDone[todayIso()]={};save();break;
    case 'abcadd':{const a=clean(document.getElementById('a1').value,LIM.line),b=clean(document.getElementById('a2').value,LIM.line),c=clean(document.getElementById('a3').value,LIM.line);if(!a&&!b&&!c){fieldErr('a1','Écrivez au moins une des trois lignes.');return;}const n=new Date();data.abc.push({date:todayIso(),time:pad(n.getHours())+':'+pad(n.getMinutes()),a,b,c});save();render();toast('Noté.');return;}
    case 'phadd':{const v=clean(document.getElementById('ph').value,LIM.phrase);if(!v){fieldErr('ph','Écrivez la phrase à garder.');return;}if(data.phrases.includes(v)){fieldErr('ph','Cette phrase est déjà dans votre liste.');return;}data.phrases.push(v);save();render();toast('Gardée.');return;}
    case 'phdel':data.phrases.splice(Number(d.i),1);save();break;
    case 'exo':state.exo=d.id;nav('exo');break;
    case 'threeadd':{const items=['t1','t2','t3'].map(id=>clean(document.getElementById(id).value,LIM.three)).filter(Boolean);if(!items.length){fieldErr('t1','Une seule chose suffit, écrivez-la ici.');return;}data.three.push({date:todayIso(),items});save();render();toast('Gardé.');return;}
    case 'depose':{const t=document.getElementById('dep');if(t)t.value='';toast('C’est déposé, vous n’avez plus à le garder en vous.');return;}
    case 'letter':state.letter=Number(d.i);nav('letter');break;
    case 'qsend':{const t=clean(state.qdraft,LIM.q);if(t.length<10){fieldErr('qdraft','Écrivez votre question en une phrase ou deux (dix caractères au moins).');return;}if(questionsLeft()===0){toast('Vos deux questions du mois sont posées.');return;}const risk=RISK.test(t);data.questions.push(risk?{id:'q'+Date.now(),date:todayIso(),text:t,risk:true}:{id:'q'+Date.now(),date:todayIso(),text:t});state.qdraft='';save();render();toast(risk?'Si c’est urgent, n’attendez pas et appelez le 143 ou le 144 maintenant.':(DEMO?'Votre question est gardée sur votre appareil. Dans cette version de test, elle n’est pas transmise à Antonio.':'Votre question est envoyée. Antonio répond par écrit sous 48 heures.'));return;}
    case 'sheet-close':state.sheet=null;break;
    case 'consent':if(window.PEPEConsent)window.PEPEConsent.set(d.v==='yes');break;
    case 'reset':state.confirmReset=true;break;
    case 'reset-no':state.confirmReset=false;break;
    case 'reset-yes':state.data=JSON.parse(JSON.stringify(DEF));try{localStorage.removeItem(KEY);}catch(e){}state.confirmReset=false;state.view='today';state.prev=null;render();window.scrollTo(0,0);toast('Effacé.');return;
    default:return;
  }
  render();
  if(['go','sit','back','exo','step','kit','letter','peek-plans','tier','ob-done'].includes(act))window.scrollTo(0,0);
}
const app=document.getElementById('app');
app.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el||el.tagName==='A'||el.tagName==='INPUT'||el.tagName==='LABEL')return;handle(el.dataset.act,el.dataset,el);});
app.addEventListener('change',e=>{const el=e.target;if(el.tagName==='INPUT'&&el.dataset.act==='share')handle('share',el.dataset,el);});
let typing=null;
app.addEventListener('input',e=>{
  const t=e.target;clearErr(t);
  if(t.id==='draft'){state.draft=t.value;updCount(t);}
  if(t.id==='qdraft')state.qdraft=t.value;
  if(t.id==='ob-me')D().me=String(t.value).slice(0,LIM.me);
  if(t.id==='q'){state.q=t.value;clearTimeout(typing);typing=setTimeout(()=>{const pos=t.selectionStart;render();const nq=document.getElementById('q');if(nq){nq.focus();try{nq.setSelectionRange(pos,pos);}catch(e){}}},250);}
});
/* Entrée valide les champs d'une seule ligne, comme sur un vrai formulaire. */
app.addEventListener('keydown',e=>{
  if(e.key!=='Enter'||e.isComposing)return;const t=e.target;
  if(t.id==='ph'){e.preventDefault();handle('phadd',{},t);}
  else if(t.id==='ob-me'){e.preventDefault();handle('ob-done',{},t);}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state.sheet&&state.sheet!=='onboard'){state.sheet=null;render();}});
try{if(/[?&](nouveau|reset|new)\b/.test(location.search)){localStorage.removeItem(KEY);if(history.replaceState)history.replaceState(null,'',location.pathname+location.hash);}}catch(e){}
state.data=load();
/* Sur le site, « Mon histoire » a sa propre adresse (…/#histoire) : on peut l'envoyer telle quelle, et le bouton Retour du téléphone fonctionne. */
const storyFirst=SITE&&location.hash===STORY_HASH;
if(storyFirst)state.view='about';
if(SITE)window.addEventListener('hashchange',()=>{
  if(location.hash===STORY_HASH){if(state.view!=='about')showStory();}
  else if(state.view==='about')handle('back',{},null);
});
state.inClaude=!SITE&&!!(window.claude&&typeof window.claude.use==='function');
if(SITE)state.sample=false;
/* Sur le site, l'accueil est déjà écrit dans la page (affichage immédiat, lisible sans JavaScript par les moteurs) : on le garde tel quel. */
if(app.getAttribute('data-prerender')==='intro'&&!D().onboarded&&!storyFirst){state.lastKey='intro';app.removeAttribute('data-prerender');}
else render();
if(!SITE)(async()=>{try{if(state.inClaude){const s=await window.claude.use('sample');state.sample=s||false;}else state.sample=false;}catch(e){state.sample=false;}if(D().onboarded||state.view==='plans')render();})();
})();
