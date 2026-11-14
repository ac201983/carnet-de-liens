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
  'Vous n’êtes pas un mauvais parent parce que c’est dur. C’est dur parce que c’est dur.',
  'Ce que vous faites tous les jours sans que personne le voie, c’est précisément ce qui le tient debout.',
  'Une crise n’efface pas une bonne journée. Et une mauvaise journée n’efface pas des années d’amour.',
  'Vous avez le droit d’être fatigué·e d’une personne que vous aimez plus que tout.',
  'Ce n’est pas à vous d’avoir toutes les réponses. C’est à vous d’être là, et vous l’êtes.',
  'Demander de l’aide n’est pas abandonner. C’est tenir plus longtemps.',
  'Votre enfant ne vous compare à personne. Il vous préfère.',
  'Les progrès ne se mesurent pas aux autres enfants. Ils se mesurent à hier.',
  'Si vous avez pleuré dans la voiture aujourd’hui, vous êtes en bonne compagnie : des milliers de parents l’ont fait aussi.',
  'Vous n’avez pas à aimer chaque jour. Vous avez le droit d’aimer la personne et de détester la journée.',
  'La culpabilité est la preuve que vous vous souciez. Elle n’est pas la preuve que vous avez tort.',
  'Il y aura un soir où tout aura marché. Gardez-le quelque part. Pour les autres soirs.',
  'Prendre soin de vous, ce n’est pas du temps pris à votre enfant. C’est du temps rendu à votre enfant, en mieux.',
  'Personne ne connaît votre enfant comme vous. Les professionnels le savent. Les bons le disent.'
];
const PERMISSIONS=[
  ['Vous avez le droit','de ne pas aimer certaines journées.'],
  ['Vous avez le droit','de dire « je ne sais pas » à un professionnel.'],
  ['Vous avez le droit','de demander du répit sans vous justifier.'],
  ['Vous avez le droit','d’être en colère contre la situation, pas contre votre enfant.'],
  ['Vous avez le droit','de ne pas être un parent-thérapeute 24 heures sur 24.'],
  ['Vous avez le droit','d’avoir des projets qui ne concernent pas le handicap.'],
  ['Vous avez le droit','de pleurer devant votre enfant. Il apprend que les émotions passent.'],
  ['Vous avez le droit','de refuser un conseil, même bien intentionné.'],
  ['Vous avez le droit','de rire. Beaucoup. Y compris de la situation.'],
  ['Vous avez le droit','d’être fier ou fière pour des choses que personne d’autre ne remarque.']
];
const MOODS=[['😩','Épuisé·e'],['😔','Lourd'],['😐','Ça va'],['🙂','Plutôt bien'],['😊','Bien']];
const MOOD_WORDS={
  0:'Alors aujourd’hui, on vise petit : une seule chose, pas plus. Le reste peut attendre demain. Et si vous le pouvez, un message à quelqu’un : « journée dure ». Juste ça.',
  1:'Les journées lourdes ont une fin. Choisissez un moment de la journée qui sera à vous, même cinq minutes. Mettez-le dans votre tête comme un rendez-vous.',
  2:'« Ça va » est une très bonne réponse. Pas besoin de plus. Profitez-en pour faire une chose qui vous attend depuis longtemps, ou pour ne rien faire.',
  3:'Gardez ce « plutôt bien » quelque part : notez ce qui l’a permis. C’est votre mode d’emploi pour les jours gris.',
  4:'Un bon jour. Regardez votre enfant aujourd’hui comme si vous ne saviez rien de son dossier. Juste lui. Juste elle.'
};

/* ---------- situations: the advice library ---------- */
/* ages: e = enfant, a = ado, g = grand (adulte). themes: comp, comm, quot, ecole, fam, moi */
const SITS=[
  {id:'crise',e:'🌪️',t:'La crise',s:'Cris, pleurs, se jette au sol, casse',ages:['e','a','g'],th:'comp',
   comp:'Une crise n’est pas un caprice ni une attaque contre vous : c’est un débordement. Le cerveau n’arrive plus à traiter ce qui arrive (bruit, fatigue, frustration, imprévu, douleur) et il déborde. À ce moment-là, personne n’apprend rien : ni votre enfant, ni vous. L’objectif n’est pas d’éduquer, c’est de passer la vague en sécurité.',
   ess:['Moins de mots. Une phrase courte, calme, répétée : « Je suis là. On attend. »','Baissez la voix et la hauteur : accroupissez-vous, à distance, sans fixer du regard.','Sécurisez l’espace plutôt que la personne : écartez ce qui peut blesser, laissez de la place.','Attendez. Les crises montent, plafonnent, redescendent. Ne cherchez pas à les écourter par la discussion.','Après : un verre d’eau, un geste doux si accepté, et rien d’autre. On ne rejoue pas la scène. On en reparle plus tard, ou jamais.'],
   ev:['Raisonner, menacer, promettre pendant la crise : ça n’arrive pas au cerveau à ce moment-là.','Punir après coup pour quelque chose qui n’était pas un choix.','Vous juger pour avoir crié aussi. Ça arrive. Réparez simplement après.'],
   moi:'Pendant la crise, vous aussi vous débordez. Respirez par le ventre, trois fois, les pieds bien au sol. Vous avez le droit de sortir trente secondes si l’enfant est en sécurité.',
   aide:'Si les crises deviennent quotidiennes, plus longues, ou si quelqu’un se blesse, demandez une observation : pédiatre, équipe de l’institution, ou un·e éducateur·trice spécialisé·e qui vient à la maison. Notez avant/pendant/après dans l’outil « Journal avant-pendant-après » : trois semaines de notes valent mieux que n’importe quel récit.'},
  {id:'automut',e:'🩹',t:'Il ou elle se fait mal',s:'Se tape, se mord, se griffe',ages:['e','a','g'],th:'comp',
   comp:'Se faire mal est presque toujours un langage : une douleur qu’on ne sait pas dire (dents, ventre, oreilles), une tension trop forte, une recherche de sensation, ou un moyen d’obtenir quelque chose qui a marché une fois. Ce n’est pas « pour vous embêter ». Et ce n’est pas de votre faute.',
   ess:['D’abord la santé : faites vérifier qu’il n’y a pas de douleur cachée. C’est la cause la plus oubliée.','Protégez sans retenir fort : un coussin, une main douce qui dévie, un vêtement épais.','Proposez une sensation de remplacement au bon moment : presser une balle, mordre un objet prévu pour ça, une pression ferme sur les épaules si elle apaise.','Repérez ce qui précède : fatigue, bruit, transition, attente. C’est là qu’on agit, en amont.','Baissez les exigences les jours où ça monte. Ce n’est pas céder, c’est lire la météo.'],
   ev:['Crier ou réagir fort : si l’attention est le carburant, ça l’alimente.','Culpabiliser l’enfant (« regarde ce que tu te fais »).','Rester seul·e avec ça des mois sans en parler.'],
   moi:'Voir son enfant se faire mal est l’une des choses les plus dures qui existent. Si vous tremblez après, c’est normal. Parlez-en à quelqu’un qui comprend, pas à quelqu’un qui va s’affoler.',
   aide:'Parlez-en vite : pédiatre ou médecin traitant d’abord (douleur), puis un·e professionnel·le du comportement. En Suisse romande, Pro Infirmis et les associations (autisme suisse romande, insieme, Cerebral) orientent vers les bons services.'},
  {id:'refus',e:'🙅',t:'Le refus',s:'Ne veut pas s’habiller, sortir, manger, se laver',ages:['e','a','g'],th:'quot',
   comp:'Le refus est souvent la seule forme de pouvoir qu’une personne très accompagnée possède encore. Il protège aussi d’un inconfort que nous ne voyons pas : une étiquette qui gratte, une douche trop chaude, un changement trop brusque. Derrière « non », il y a presque toujours « pas comme ça » ou « pas maintenant ».',
   ess:['Donnez un choix entre deux options que vous acceptez toutes les deux : « le pull bleu ou le rouge ? » Pas « tu t’habilles ? ».','Annoncez avant : « dans cinq minutes, on va… ». Utilisez le minuteur visuel.','« D’abord… ensuite » : d’abord les dents, ensuite la tablette. Montrez-le avec le tableau.','Réduisez la demande au plus petit pas possible, et félicitez ce pas.','Laissez une sortie honorable : « tu veux le faire toi ou je t’aide ? »'],
   ev:['Le bras de fer : il n’y a pas de gagnant, seulement deux perdants fatigués.','Multiplier les demandes en même temps.','Négocier une fois la crise lancée.'],
   moi:'Un refus le matin, quand tout le monde est pressé, c’est une épreuve de nerfs. Préparez la veille ce qui peut l’être. Et acceptez qu’un matin sur quatre soit bancal.',
   aide:'Si les refus s’étendent à presque tout et depuis plusieurs semaines, cherchez un changement : santé, sommeil, événement, personne nouvelle. Un·e ergothérapeute peut aider pour les refus liés aux sensations (vêtements, douche, textures).'},
  {id:'transitions',e:'🔁',t:'Les transitions',s:'Passer d’une activité à l’autre, quitter un lieu',ages:['e','a','g'],th:'quot',
   comp:'Arrêter quelque chose d’agréable pour quelque chose d’incertain est difficile pour tout le monde ; pour une personne qui a besoin de prévisibilité, c’est une petite chute dans le vide. Le secret n’est pas d’être plus ferme, c’est de rendre la suite visible avant qu’elle arrive.',
   ess:['Prévenez deux fois : « encore 5 minutes », puis « encore 1 minute », avec le minuteur visuel.','Toujours le même signal de fin : une chanson, un geste, une phrase.','Montrez la suite : un pictogramme, une photo du lieu, l’objet qu’on emporte.','Donnez un rôle dans la transition : porter le sac, éteindre la lumière, fermer la porte.','Gardez un objet de transition qui fait le pont entre les deux moments.'],
   ev:['Interrompre sans prévenir, surtout un jeu ou un écran.','Changer la règle au dernier moment parce qu’on est pressé.'],
   moi:'Les transitions ratées, c’est souvent vous qui courez. Si une transition est toujours difficile, c’est elle qu’il faut changer, pas votre patience.',
   aide:'Un·e éducateur·trice ou un·e logopédiste formé·e à la communication alternative (pictogrammes, soutien gestuel) peut construire avec vous un emploi du temps visuel. En institution, demandez comment l’équipe fait : copiez ce qui marche là-bas.'},
  {id:'sommeil',e:'🌙',t:'Le coucher et la nuit',s:'Endormissement long, réveils, se lève',ages:['e','a'],th:'quot',
   comp:'Le sommeil est fragile chez beaucoup d’enfants en situation de handicap : le corps ne produit pas toujours les signaux au bon moment, l’angoisse de la séparation est plus forte, et la journée laisse trop de tension. Un coucher raté n’est pas un échec d’autorité.',
   ess:['Le même déroulé chaque soir, dans le même ordre, en images : bain, pyjama, dents, histoire, dodo. Utilisez la routine du soir.','Baissez la lumière et le bruit une heure avant ; les écrans plus tôt encore.','Un objet de nuit qui ne change jamais ; une veilleuse si besoin.','Si l’enfant se relève : raccompagnez sans parler, autant de fois qu’il faut, la même phrase douce.','Le matin, de la lumière et des mots chaleureux, quelle qu’ait été la nuit.'],
   ev:['Changer de méthode tous les trois jours.','Faire du coucher une négociation.','Vous culpabiliser de dormir avec lui ou elle certains soirs : parfois c’est la bonne décision pour que tout le monde dorme.'],
   moi:'Le manque de sommeil rend tout plus dur, et c’est vous qui le portez. Si vous êtes deux, alternez les nuits. Si vous êtes seul·e, la sieste n’est pas un luxe : c’est une nécessité médicale.',
   aide:'Si l’enfant dort moins de huit heures la plupart des nuits, ou si vous êtes épuisé·e depuis des semaines, parlez-en au pédiatre : il existe des solutions, y compris médicales, qui ne sont pas un aveu d’échec.'},
  {id:'repas',e:'🍽️',t:'Les repas',s:'Ne mange que trois choses, refuse les textures',ages:['e','a','g'],th:'quot',
   comp:'La sélectivité alimentaire tient souvent aux sensations (textures, odeurs, couleurs), pas au caractère. Pour certaines personnes, un aliment nouveau dans l’assiette est aussi menaçant qu’un insecte. Le repas, lui, doit rester un moment où l’on est ensemble, pas un champ de bataille.',
   ess:['Un aliment connu toujours présent dans l’assiette : la sécurité d’abord.','Le nouvel aliment à côté, pas dessus, en toute petite quantité, sans obligation de le goûter. Le voir vingt fois, c’est déjà un progrès.','Les mêmes couverts, la même place, la même heure.','Laissez toucher, sentir, jouer avec la nourriture : c’est une étape, pas une bêtise.','Félicitez l’effort, jamais la quantité.'],
   ev:['Forcer, chantage au dessert, « tu restes à table jusqu’à… ».','Cacher des aliments dans d’autres : la confiance est plus précieuse qu’une carotte.'],
   moi:'Si vous cuisinez trois repas différents chaque soir, vous avez le droit d’arrêter. Une assiette commune et un aliment refuge suffisent.',
   aide:'Un suivi avec un·e ergothérapeute ou un·e logopédiste spécialisé·e dans l’oralité change beaucoup de choses. Faites vérifier le poids et le fer une fois par an avec le médecin.'},
  {id:'parole',e:'💬',t:'Communiquer sans les mots',s:'Ne parle pas, peu, ou autrement',ages:['e','a','g'],th:'comm',
   comp:'Ne pas parler n’est pas ne rien dire. Votre enfant communique déjà : par le regard, le corps, les gestes, les cris, les objets qu’il apporte. La communication alternative (pictogrammes, soutien gestuel, tablette) ne remplace pas la parole : elle l’aide à venir, et quand elle ne vient pas, elle donne une voix. C’est prouvé, et c’est le contraire de « renoncer ».',
   ess:['Nommez ce qu’il ou elle fait, veut, regarde : « tu veux l’eau », en montrant l’eau. Tout le temps, sans attendre de réponse.','Laissez du temps : comptez jusqu’à dix dans votre tête après une question.','Offrez des choix visibles : deux objets, deux images. Le choix, c’est déjà une phrase.','Apprenez trois gestes ou pictogrammes utiles (encore, fini, aide) et utilisez-les vous-même.','Fêtez chaque tentative, même imparfaite.'],
   ev:['Faire à sa place avant qu’il ait eu le temps d’essayer.','Attendre la parole pour commencer la communication.','Poser des questions auxquelles il ne peut pas répondre.'],
   moi:'Ne pas entendre « maman » ou « papa » fait mal. Ce que vous entendez à la place, apprenez à le lire : c’est votre langue à vous deux, et elle est réelle.',
   aide:'Demandez une évaluation en logopédie orientée communication alternative et améliorée (CAA). Les associations (autisme suisse romande, insieme, Cerebral) connaissent les professionnel·les formé·es. En institution, demandez quels moyens l’équipe utilise, et utilisez les mêmes à la maison.'},
  {id:'dehors',e:'🛒',t:'Les sorties',s:'Magasin, bus, fête de famille, restaurant',ages:['e','a'],th:'quot',
   comp:'Dehors, tout est plus fort : lumière, bruit, odeurs, attente, regards. Ce qui tient à la maison ne tient pas toujours au supermarché, et ce n’est pas une régression. Une sortie réussie se prépare comme une expédition, et se termine avant la limite, pas après.',
   ess:['Préparez en images : où on va, ce qu’on fait, combien de temps, ce qu’on rapporte.','Un rôle : tenir la liste, mettre les objets dans le chariot.','Casque ou bouchons d’oreilles, un objet rassurant, une collation.','Visez court et réussi : dix minutes bien, plutôt que quarante jusqu’à la crise.','Prévoyez la sortie de secours : où aller si ça monte, et partez sans discuter.'],
   ev:['Les grandes surfaces à l’heure de pointe pour commencer.','Prolonger « encore un rayon » quand les signes sont là.'],
   moi:'Le regard des gens au magasin, on l’a tous senti. Une phrase prête aide : « Il a besoin d’une minute, merci. » Vous n’avez rien à expliquer.',
   aide:'Beaucoup de magasins et de piscines ont des heures calmes ; demandez. Une carte de priorité ou un justificatif peut éviter les files : renseignez-vous auprès de Pro Infirmis ou de l’association de votre région.'},
  {id:'regard',e:'👀',t:'Le regard des autres',s:'Remarques, pitié, conseils non demandés',ages:['e','a','g'],th:'fam',
   comp:'Le regard des autres blesse parce qu’il touche ce qui est déjà sensible chez nous. Les gens ne savent pas ; certains sont maladroits, quelques-uns méchants, la plupart simplement ignorants. Vous ne leur devez rien, ni explication ni pédagogie. Vous pouvez choisir, chaque fois, de protéger votre énergie.',
   ess:['Préparez deux phrases courtes, l’une qui ferme (« Merci, nous gérons. »), l’autre qui ouvre si vous en avez envie (« Il entend tout, vous pouvez lui dire bonjour. »).','Décidez à l’avance à qui vous expliquez, et à qui jamais.','Dans la famille, nommez ce dont vous avez besoin : « Pas de conseils, de la présence. »','Trouvez vos semblables : un groupe de parents vaut cent inconnus.'],
   ev:['Vous justifier auprès d’inconnus.','Couper tout lien avec la famille qui ne comprend pas : parfois ils apprennent lentement.'],
   moi:'Vous avez le droit de ne pas être l’ambassadeur du handicap tous les jours. Certains jours, on ferme les yeux et on passe.',
   aide:'Les groupes de parents (insieme, autisme suisse romande, Cerebral, et beaucoup de groupes locaux) existent pour ça : parler sans devoir expliquer.'},
  {id:'ecole',e:'🏫',t:'L’école',s:'Intégration, devoirs, réunions, enseignants',ages:['e','a'],th:'ecole',
   comp:'L’école est le premier lieu où la différence se mesure. Les enseignants sont souvent de bonne volonté et peu formés ; les réunions sont nombreuses et vous y êtes parfois seul·e face à plusieurs professionnels. Vous êtes pourtant la personne qui connaît le mieux l’enfant : c’est une expertise, pas une opinion.',
   ess:['Demandez un interlocuteur unique et un canal simple (cahier, mail hebdomadaire).','Avant chaque réunion : trois forces de votre enfant, deux difficultés, une demande. Écrit.','Partagez ce qui marche à la maison (gestes, pictos, routines) : copiez ce qui marche à l’école.','Les devoirs : courts, même heure, même place, et le droit de s’arrêter après quinze minutes.','Demandez les décisions par écrit, et ce que chacun fait.'],
   ev:['Arriver en réunion sans avoir écrit vos points : on ressort frustré·e.','Faire des devoirs un combat quotidien : l’école a besoin d’une famille, pas d’une deuxième école.'],
   moi:'Les réunions scolaires épuisent : préparez-les, venez à deux si possible, et autorisez-vous un café après, seul·e.',
   aide:'Chaque canton a un service de pédagogie spécialisée ; demandez à l’école quel appui est possible (soutien, ergothérapie, logopédie, aide à l’intégration). Pro Infirmis et les associations de parents vous aident à comprendre vos droits.'},
  {id:'fratrie',e:'👧👦',t:'Les frères et sœurs',s:'Jalousie, colère, trop sages, trop grands',ages:['e','a','g'],th:'fam',
   comp:'Les frères et sœurs vivent le handicap de l’intérieur, sans l’avoir choisi. Certains deviennent « trop sages » pour ne pas rajouter de poids ; d’autres explosent. Tous ont besoin d’être vus pour eux-mêmes, pas comme l’enfant « qui va bien ».',
   ess:['Un moment rien qu’à eux, régulier, même court, et sacré : le mercredi de midi, le samedi matin.','Des mots vrais, adaptés à l’âge : ce qu’a leur frère ou sœur, pourquoi ça prend de la place, et que ce n’est la faute de personne.','Le droit à la colère et à la jalousie, dits à voix haute, sans morale.','Ne leur confiez pas un rôle d’adulte : aider oui, être responsable non.','Demandez-leur ce qu’ils veulent que les autres sachent.'],
   ev:['« Tu as de la chance, toi. »','Faire d’eux les futurs tuteurs sans jamais leur demander.'],
   moi:'La culpabilité envers les autres enfants est l’une des plus lourdes. Dites-leur ce que vous ressentez simplement : « j’aimerais avoir plus de temps pour toi, et je t’aime autant ». Ils entendent.',
   aide:'Il existe des groupes de fratrie en Suisse romande (insieme, Cerebral, certaines fondations). Un espace où ils ne sont pas « le frère de ».'},
  {id:'ecrans',e:'📱',t:'Les écrans',s:'Tablette, jeux, vidéos en boucle',ages:['e','a'],th:'quot',
   comp:'L’écran apaise, occupe, et pour certains enfants c’est le seul endroit où tout est prévisible. Ce n’est pas un ennemi, c’est un outil puissant : il doit avoir un cadre visible, pas un cadre négociable.',
   ess:['Des moments fixes, visibles sur un planning en images, plutôt qu’une durée négociée.','Le minuteur visuel pour la fin, annoncé deux fois.','Un « après » attrayant : l’écran s’arrête quand quelque chose d’autre commence, pas quand rien ne commence.','Les écrans comme outil, aussi : pictogrammes, communication, musique pour se calmer.','Pas d’écran la dernière heure avant le coucher.'],
   ev:['Retirer l’écran brutalement : vous récupérez une crise.','Culpabiliser d’y avoir recours un jour difficile.'],
   moi:'L’écran qui vous donne vingt minutes pour respirer n’est pas une faute. C’est une pause. Prenez-la vraiment.',
   aide:'Si l’écran devient le seul intérêt et que tout le reste disparaît, parlez-en à l’équipe ou au pédiatre : on cherche alors ce qu’il remplace.'},
  {id:'ado',e:'🌱',t:'L’adolescence et le corps',s:'Puberté, intimité, humeur, pudeur',ages:['a','g'],th:'comm',
   comp:'Le corps change, les hormones aussi, et la compréhension ne suit pas toujours. L’intimité, la pudeur, la sexualité existent pour toute personne, handicap ou pas. Le silence protège moins que les mots simples et répétés.',
   ess:['Nommez les parties du corps avec les vrais mots, et les règles : ce qu’on fait seul, dans sa chambre, porte fermée.','Les règles : préparez en images avant les premières fois.','Apprenez le « non » et le « stop », à dire et à entendre, pour se protéger.','Respectez la pudeur nouvelle : frapper avant d’entrer, demander avant d’aider.','Parlez-en avec l’équipe ou l’école : les mêmes mots partout.'],
   ev:['Interdire ou punir des gestes intimes au lieu de les orienter vers le bon lieu.','Supposer que « ça ne le concerne pas ».'],
   moi:'Voir son enfant devenir un adulte différent de celui qu’on imaginait, c’est un deuil et une fierté mêlés. Les deux sont permis en même temps.',
   aide:'Des associations proposent de l’éducation sexuelle adaptée (SEHP en Suisse romande, par exemple). Le médecin et l’équipe sont des alliés : demandez un temps dédié.'},
  {id:'annonce',e:'🌫️',t:'On vient d’apprendre',s:'Diagnostic, premiers mois, sidération',ages:['e'],th:'moi',
   comp:'Les premiers mois après un diagnostic, on ne vit pas, on encaisse. Choc, déni, colère, tristesse, culpabilité, parfois soulagement d’avoir enfin un nom : tout cela est normal, dans n’importe quel ordre, en boucle. Et pendant ce temps-là, l’enfant est le même qu’hier. Il n’a pas changé. C’est la carte qui a changé, pas le territoire.',
   ess:['Ne prenez aucune grande décision le premier mois.','Une seule source d’information fiable à la fois ; fermez les forums la nuit.','Notez vos questions pour le prochain rendez-vous : elles arrivent à 3 h du matin, pas en consultation.','Dites-le à deux ou trois personnes choisies, pas à tout le monde.','Regardez votre enfant jouer. Longtemps. C’est le meilleur antidote au dossier.'],
   ev:['Chercher la cause, le coupable, la faute : il n’y en a pas.','Vous comparer aux parents qui « gèrent bien » : ils ont eu leurs premiers mois aussi.'],
   moi:'Vous avez le droit de pleurer l’enfant que vous aviez imaginé. Ce n’est pas trahir celui qui est là. C’est faire de la place pour l’aimer tel qu’il est.',
   aide:'Pro Infirmis vous reçoit gratuitement dès le diagnostic. Les associations spécialisées (autisme suisse romande, insieme, Cerebral, Procap) ont des permanences pour parents. Si le sol se dérobe, La Main Tendue au 143, jour et nuit.'},
  {id:'culpa',e:'🪞',t:'La culpabilité',s:'Pas assez, trop, mal, pas comme il faut',ages:['e','a','g'],th:'moi',
   comp:'La culpabilité des parents d’un enfant différent est quasi universelle et presque toujours injuste. Elle dit : « si j’avais… ». Elle ignore qu’on ne décide pas avec ce qu’on sait aujourd’hui, mais avec ce qu’on savait hier. Elle est un signe d’amour qui se trompe de cible.',
   ess:['Nommez-la quand elle vient : « c’est ma culpabilité qui parle ». Ça la fait reculer d’un pas.','Demandez-vous : « que dirais-je à mon meilleur ami dans la même situation ? » Puis dites-le-vous.','Faites la liste de ce que vous faites. Vraiment. Sur papier. Elle est longue.','Acceptez qu’une bonne décision puisse avoir de mauvaises journées.','Réparez quand il faut (« j’ai crié, pardon »), puis passez à autre chose.'],
   ev:['Le « je dois tout compenser », qui mène à l’épuisement.','Les comparaisons avec d’autres familles.'],
   moi:'Vous n’êtes pas en retard. Vous n’avez rien raté. Vous êtes là, ce soir, en train de chercher comment mieux faire. C’est exactement ce qu’un bon parent fait.',
   aide:'Si la culpabilité vous empêche de dormir ou de vous réjouir depuis des semaines, un·e psychologue qui connaît le handicap peut aider ; Pro Infirmis et les associations orientent. Ce n’est pas une faiblesse, c’est un soin.'},
  {id:'epuise',e:'🔋',t:'Je n’en peux plus',s:'Épuisement, isolement, à bout',ages:['e','a','g'],th:'moi',
   comp:'L’épuisement des proches aidants est un état, pas une faiblesse. Il arrive après des mois ou des années de vigilance sans relâche, de nuits coupées, de rendez-vous, de combats administratifs. Le corps finit par dire ce que vous n’osez pas dire. L’écouter n’est pas abandonner votre enfant : c’est rester debout pour lui.',
   ess:['Aujourd’hui : une seule chose. Le reste attend.','Dites-le à une personne, en une phrase : « je suis à bout ». Pas besoin de détails.','Demandez du répit : un week-end, une après-midi, une nuit. Ce n’est pas un luxe, c’est un soin.','Protégez une heure par semaine rien qu’à vous, dans l’agenda, comme un rendez-vous médical.','Dormez quand vous le pouvez, même mal, même peu.'],
   ev:['Attendre d’aller « vraiment mal » pour demander de l’aide.','Refuser l’aide proposée parce que « personne ne fera aussi bien ». Personne ne fera pareil. C’est très bien.'],
   moi:'Si vous lisez ceci à 2 h du matin, posez le téléphone après cette phrase : vous avez tenu aujourd’hui. C’est assez.',
   aide:'Pro Infirmis (service de relève), Croix-Rouge (garde à domicile), Cerebral (répit), votre commune (aide aux proches aidants) : des solutions existent et beaucoup sont financées. Si vous avez des idées noires, La Main Tendue au 143, maintenant.'},
  {id:'couple',e:'💑',t:'Le couple',s:'Plus de temps à deux, désaccords, solitude',ages:['e','a','g'],th:'fam',
   comp:'Le handicap d’un enfant met le couple à l’épreuve : fatigue, désaccords sur l’éducation, un parent qui porte plus, le désir qui s’éteint, les mots qui manquent. Ce n’est pas un manque d’amour : c’est que toute l’énergie part ailleurs. Le couple a besoin d’être nourri exprès, puisqu’il ne l’est plus par hasard.',
   ess:['Un rendez-vous à deux, régulier, même court, même à la maison après le coucher : sans parler du handicap.','Répartissez les rôles à voix haute : qui gère quoi, et révisez.','Dites ce que vous ressentez avec « je » : « je me sens seul·e », pas « tu ne fais rien ».','Acceptez que l’autre ne vive pas la même chose au même moment.','Demandez de l’aide à deux, pas l’un contre l’autre.'],
   ev:['Compter les points.','Attendre que ça aille mieux pour s’occuper du couple.'],
   moi:'Si vous êtes parent solo : votre couple, c’est vous avec vous-même. Les mêmes rendez-vous valent.',
   aide:'Des consultations de couple existent dans chaque canton (centres de consultation conjugale, souvent à tarif adapté). En parler à deux à un tiers, c’est parfois le début d’une autre conversation.'},
  {id:'aide',e:'🤝',t:'Demander de l’aide',s:'Répit, relève, droits, financement',ages:['e','a','g'],th:'moi',
   comp:'Demander de l’aide est la chose la plus difficile et la plus efficace que vous puissiez faire. Difficile parce qu’on a l’impression de ne pas y arriver ; efficace parce que personne n’est fait pour porter ça seul. Des aides existent, financées, et peu de familles les connaissent toutes.',
   ess:['Commencez par un rendez-vous chez Pro Infirmis : gratuit, dans votre canton, ils font le tour de ce à quoi vous avez droit.','Demandez l’allocation pour impotent (API) et le supplément pour soins intenses si vous êtes concerné·e : beaucoup de familles ne le font pas.','Répit : relève à domicile, week-ends, camps adaptés. Demandez les listes à l’association de votre région.','Acceptez l’aide informelle : un repas, une heure de garde, un trajet. Dites oui.','Faites une liste de ce que quelqu’un pourrait faire pour vous, pour répondre quand on vous demande « je peux faire quoi ? ».'],
   ev:['Attendre d’être à bout.','Penser que vous prenez la place de quelqu’un qui en aurait plus besoin.'],
   moi:'Vous n’êtes pas un dossier de plus. Vous êtes une famille qui a besoin d’un coup de main, comme toutes les familles, en plus fort.',
   aide:'Pro Infirmis · insieme · Cerebral · Procap · autisme suisse romande · Croix-Rouge (garde d’enfants malades, relève) · votre commune (proches aidants). Pro Juventute, conseils aux parents : 058 261 61 61, gratuit, jour et nuit.'},
  {id:'grandir',e:'🎓',t:'Grandir : vers 18 ans',s:'Majorité, curatelle, AI, institution, avenir',ages:['a','g'],th:'ecole',
   comp:'Vers 18 ans, tout change de cadre : l’assurance-invalidité passe au régime adulte, une mesure de protection (curatelle) peut être examinée, l’école s’arrête, et la question « et après ? » devient concrète. C’est beaucoup. Ça se prépare en petites décisions, pas en une seule grande, et il existe des gens dont c’est le métier de vous guider.',
   ess:['Prenez rendez-vous chez Pro Infirmis un an avant les 18 ans : ils font la carte des démarches.','Déposez la demande de rente AI adulte dès que possible.','Réfléchissez à la mesure de protection la plus légère qui protège assez : il en existe plusieurs.','Parlez-en avec votre enfant, dans ses mots : ce qu’il veut décider, ce qu’il veut qu’on l’aide à décider.','Visitez des lieux (ateliers, foyers, centres de jour) sans pression, pour vous faire une idée.'],
   ev:['Tout décider seul·e, sans votre enfant.','Croire que la curatelle vous retire votre place : elle la nomme.'],
   moi:'Ce passage réveille la question de l’après-vous. C’est normal qu’elle fasse peur. Elle fait moins peur quand il y a des noms, des papiers et des gens autour.',
   aide:'Pro Infirmis, insieme (brochures sur la protection de l’adulte, en langage simplifié aussi), la Justice de paix de votre canton, l’Office AI.'},
  {id:'loin',e:'🏡',t:'Quand il ou elle vit ailleurs',s:'Institution, foyer, séjours en famille',ages:['g'],th:'fam',
   comp:'Confier son enfant adulte à une institution est un projet de vie, pas un abandon, et pourtant la culpabilité est là. Les premières semaines, l’équipe apprend à le connaître ; vous apprenez à partager. La relation avec l’équipe se construit comme toutes les relations : par petites touches, dans la durée.',
   ess:['Écrivez pour l’équipe qui il est : ses goûts, ce qui l’apaise, comment il communique. C’est ce qui manque le plus les premiers jours.','Demandez qui est le ou la référent·e et comment on se parle au quotidien.','Préparez chaque rencontre (réseau, projet) : ce qui va bien, ce qui inquiète, ce que vous demandez.','Gardez des rituels : l’appel du mercredi, le gâteau du dimanche.','Dites à l’équipe ce qui marche à la maison, et copiez ce qui marche chez eux.'],
   ev:['Vérifier et corriger l’équipe sur tout : la confiance se construit, elle ne se décrète pas.','Vous excuser d’avoir une vie à vous.'],
   moi:'La maison vide le dimanche soir est l’un des moments les plus durs. Prévoyez-le : une sortie, un appel, un film. Pas le silence.',
   aide:'Les associations de parents (insieme, surtout) regroupent beaucoup de familles dont l’enfant vit en institution : elles savent exactement ce que vous vivez.'},
  {id:'pros',e:'🗂️',t:'Parler aux professionnels',s:'Rendez-vous, réunions, se faire entendre',ages:['e','a','g'],th:'ecole',
   comp:'Face à plusieurs professionnels, le parent se sent souvent petit, en retard d’un vocabulaire. Pourtant vous apportez la seule chose qu’ils n’ont pas : vingt-quatre heures par jour avec votre enfant. Un bon professionnel vous écoute ; un très bon vous le demande.',
   ess:['Trois points écrits avant chaque rendez-vous : ce qui va bien, ce qui inquiète, ce que je demande.','Demandez de reformuler ce que vous n’avez pas compris : « concrètement, ça veut dire quoi pour lui ? »','Demandez les décisions et qui fait quoi, par écrit.','Venez à deux si vous le pouvez : l’un parle, l’autre note.','Dites quand vous n’êtes pas d’accord, calmement : « je ne le vois pas comme ça à la maison, voilà ce que je vois ».'],
   ev:['Sortir d’un rendez-vous sans avoir posé votre question.','Accepter un jargon qui vous exclut.'],
   moi:'Vous n’avez pas besoin du bon vocabulaire pour avoir raison. Vous avez besoin de vos observations. Elles valent de l’or.',
   aide:'Utilisez le journal avant-pendant-après de l’app : trois semaines d’observations, apportées à un rendez-vous, changent la conversation.'},
  {id:'deuil',e:'🕊️',t:'L’enfant qu’on avait imaginé',s:'Accepter, sans renoncer',ages:['e','a','g'],th:'moi',
   comp:'Avant la naissance, on imagine une vie. Le handicap efface cette image, et il faut la pleurer pour pouvoir regarder l’enfant qui est là. Ce deuil-là revient par vagues, à chaque étape : la rentrée des autres, le permis des autres, le mariage des autres. Il ne signifie pas que vous n’aimez pas votre enfant. Il signifie que vous êtes humain·e.',
   ess:['Laissez venir la vague sans la juger ; elle passe toujours.','Nommez ce que vous perdez, précisément. Ce qui est nommé pèse moins.','Cherchez ce que vous n’auriez jamais eu sans lui, sans elle : une autre idée du temps, de la réussite, de la joie.','Entourez-vous de parents qui connaissent ce deuil-là : eux ne diront pas « mais il est tellement mignon ».'],
   ev:['Vous interdire la tristesse « parce qu’il y a pire ».','Vous forcer à la joie quand c’est le jour des larmes.'],
   moi:'Les deux sont vrais en même temps : vous pleurez ce qui ne sera pas, et vous êtes fou ou folle de qui est là. Vous n’avez pas à choisir.',
   aide:'Si la tristesse s’installe des semaines sans répit, un·e psychologue qui connaît le handicap, ou un groupe de parents. Et pour les nuits trop longues, La Main Tendue au 143.'}
];
const THEMES={all:'Tout',comp:'Comportement',comm:'Communication',quot:'Quotidien',ecole:'École, pros, avenir',fam:'Famille',moi:'Pour moi'};
const AGES={all:'Tous âges',e:'Enfant',a:'Ado',g:'Adulte'};

/* ---------- self-care exercises ---------- */
const EXOS=[
  {id:'breath',ico:'wind',t:'Respirer 4-6',s:'Deux minutes qui calment le corps',how:'Inspirez par le nez en comptant jusqu’à 4, expirez par la bouche en comptant jusqu’à 6. Suivez le cercle : il grandit, vous inspirez ; il rétrécit, vous expirez. Dix fois.'},
  {id:'trois',ico:'star',t:'Trois choses',s:'Qui ont été bien aujourd’hui, même minuscules',how:'Écrivez trois choses. Un café chaud compte. Un sourire compte. Le fait d’être encore debout compte.'},
  {id:'deposer',ico:'wind',t:'Déposer',s:'Écrire ce qui pèse, puis l’effacer',how:'Écrivez tout ce qui tourne dans votre tête, sans vous relire. Rien n’est gardé. Quand c’est écrit, c’est posé quelque part hors de vous.'},
  {id:'droit',ico:'heart',t:'Vous avez le droit',s:'Dix permissions à relire',how:''},
  {id:'minute',ico:'timer',t:'Une minute pour moi',s:'Soixante secondes, les yeux fermés',how:'Posez le téléphone à l’envers. Fermez les yeux. Écoutez les sons autour. Quand ça sonne, c’est fini.'},
  {id:'appeler',ico:'phone',t:'Parler à quelqu’un',s:'Maintenant, pas plus tard',how:''}
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
  'Ce matin, avant la liste des choses à faire, une seule question : qu’est-ce qui va bien, là, maintenant ? Même petit. Même fragile. Commencez par là.',
  'Vous portez beaucoup. Posez une chose aujourd’hui, une seule, rien qu’une heure : un rendez-vous reporté, une tâche déléguée, un « non » poli. Le monde tient.',
  'Votre enfant vous regarde comme personne ne vous regardera jamais. Pas pour ce que vous réussissez. Pour le fait que vous soyez là.',
  'La culpabilité frappe à la porte chaque jour à la même heure. Vous n’êtes pas obligé·e d’ouvrir. Dites-lui : « je t’ai entendue », et retournez à votre journée.',
  'Vous n’avez pas raté hier. Hier est passé. Aujourd’hui a dix-sept heures encore devant lui.',
  'Les progrès de votre enfant ne se mesurent pas à ceux des autres. Ils se mesurent à lui, à elle, il y a six mois. Regardez bien.',
  'Vous êtes fatigué·e parce que vous faites le travail de trois personnes. Pas parce que vous êtes faible. La fatigue est une information, pas un verdict.',
  'Aujourd’hui, dites à quelqu’un une vraie phrase : « c’est dur en ce moment ». Juste ça. Vous verrez ce qui revient.',
  'Vos attentes font pousser votre enfant ou le freinent. Attendez de lui quelque chose de possible aujourd’hui, et dites-le-lui à voix haute.',
  'Il y a une chose que vous faites tous les jours et que personne ne voit. Je la vois. Elle compte.',
  'Un enfant différent apprend à ses parents une autre idée du temps. Vous êtes en train de l’apprendre. Ça ne s’enseigne nulle part ailleurs.',
  'Si vous lisez ceci à une heure où tout le monde dort, vous avez tenu la journée entière. C’est beaucoup. Reposez-vous maintenant.',
  'Cherchez aujourd’hui une seule fois où votre enfant a essayé. Pas réussi : essayé. Et nommez-le : « j’ai vu que tu as essayé ».',
  'Vous avez le droit de rire de tout ça, parfois. Le rire n’enlève rien à la gravité. Il la rend portable.',
  'Le regard des autres pèse. Vous n’êtes pas là pour l’éduquer. Vous êtes là pour votre enfant, et pour vous. Le reste peut attendre.',
  'Ce que vous craignez pour l’avenir n’est pas arrivé. Ce qui arrive, c’est aujourd’hui. Et aujourd’hui, vous êtes là.',
  'Dites-vous ce que vous diriez à votre meilleur ami s’il vivait votre vie. Puis croyez-le autant que lui vous croirait.',
  'Dimanche : rien à réussir. Une promenade, un café, un silence. Les familles qui tiennent sont celles qui s’arrêtent parfois.'
];
/* ---------- Le parcours en 24 étapes (6 mois) ---------- */
const PARCOURS=[
  {m:'Accueil, point de départ et changement de regard',steps:[
    {t:'D’où je pars',lesson:'Avant d’avancer, on regarde où l’on est. Pas pour se juger : pour avoir un point de comparaison dans trois mois, puis dans six. Les parents qui tiennent sont ceux qui voient leur chemin. Aujourd’hui, vous faites votre premier point : stress, sentiment de compétence, solitude, et votre regard sur votre enfant. Il n’y a pas de bonne réponse. Il y a la vôtre, à cette date.',exo:'Faites le point de départ dans « Mon évolution » (cinq curseurs, trois minutes). Puis écrivez une phrase : « Je commence ce parcours parce que… »',obs:'Cette semaine, remarquez à quel moment de la journée le poids est le plus lourd. Juste remarquer.',link:'evo'},
    {t:'L’effet Pygmalion',lesson:'Ce qu’on attend d’une personne finit souvent par arriver, parce que nos attentes changent la façon dont on l’encourage, dont on lui laisse le temps, dont on remarque ses essais. C’est l’effet Pygmalion. Il ne s’agit pas de croire au miracle : il s’agit de vérifier ce que nos gestes disent à notre enfant de ce qu’on pense de lui. Un enfant qui sent qu’on le croit capable essaie plus longtemps.',exo:'Choisissez une petite chose que votre enfant pourrait réussir cette semaine. Dites-lui une fois par jour que vous le croyez capable. Donnez-lui le temps d’essayer.',obs:'Notez ce qui change dans sa façon d’essayer, pas dans le résultat.'},
    {t:'Les croyances qui freinent',lesson:'« Il ne pourra jamais… », « avec son handicap, c’est inutile de… », « je dois tout faire à sa place ». Ces phrases ne sont pas des faits : ce sont des croyances, souvent héritées, parfois dites par un professionnel pressé il y a dix ans. Une croyance aidante n’est pas un mensonge optimiste : c’est une phrase vraie qui ouvre une porte au lieu de la fermer. « Il apprend à son rythme » est aussi vrai que « il est lent », et ne mène pas au même endroit.',exo:'Écrivez trois phrases que vous vous dites sur votre enfant quand c’est difficile. Pour chacune, trouvez une phrase aussi vraie qui ouvre une porte.',obs:'Repérez la croyance qui revient le plus souvent dans votre tête.'},
    {t:'Mes objectifs à moi',lesson:'Un parcours sans objectif, c’est une promenade : agréable, mais on ne sait pas si l’on avance. Vos objectifs ne concernent pas votre enfant : ils vous concernent, vous. Dormir, souffler, comprendre, oser demander, cesser de vous excuser. Petits, concrets, datés. Un objectif que vous pouvez tenir une semaine vaut mieux qu’un idéal pour l’année.',exo:'Écrivez un objectif pour le mois : « D’ici un mois, je… » Un seul. Dites-le à une personne.',obs:'Chaque soir, une croix si vous avez fait un pas vers lui. Pas de croix n’est pas un échec : c’est une information.'}
  ]},
  {m:'Représentations du handicap et inclusion',steps:[
    {t:'Le handicap selon les époques',lesson:'Le handicap n’a pas toujours été vu de la même manière : caché, soigné, réparé, intégré, et aujourd’hui, dans la Convention de l’ONU, pensé comme la rencontre entre une personne et un environnement plus ou moins accessible. Savoir cela change quelque chose : ce que votre enfant ne peut pas faire dépend aussi de ce que le monde met ou ne met pas à sa portée. Vous n’êtes pas seul·e responsable de ses limites. Et vous pouvez agir sur l’environnement.',exo:'Photolangage : choisissez l’image qui dit le mieux votre vécu du handicap aujourd’hui, et écrivez pourquoi.',obs:'Repérez une situation où c’est l’environnement, pas votre enfant, qui a créé la difficulté.',link:'photo'},
    {t:'Ce que ces croyances font à mon regard',lesson:'Les représentations collectives s’invitent dans la cuisine. Elles nous font voir les difficultés avant la personne, le diagnostic avant le prénom. Cette semaine, on inverse l’ordre : d’abord qui il est, ensuite ce dont il a besoin. Ce n’est pas nier le handicap, c’est le remettre à sa place : une partie de la vie, pas toute la vie.',exo:'Décrivez votre enfant en dix lignes sans utiliser un seul mot du dossier. Goûts, caractère, humour, manières.',obs:'Remarquez quand vous présentez votre enfant aux autres : par son prénom ou par son diagnostic ?'},
    {t:'L’inclusion, concrètement',lesson:'L’inclusion n’est pas un slogan : c’est un enfant qui a une place à la table, à l’école, au club, au magasin, avec les adaptations qu’il faut. Elle réussit quand quelqu’un prépare le terrain, pas quand on jette l’enfant dans le grand bain. Vous êtes souvent ce quelqu’un. Vous avez le droit de choisir vos combats : certains lieux valent l’énergie, d’autres non.',exo:'Choisissez un lieu où vous aimeriez que votre enfant ait plus sa place. Écrivez ce qui le rendrait possible : une personne, une adaptation, une habitude.',obs:'Observez un lieu où l’inclusion marche déjà. Qu’est-ce qui fait que ça marche ?'},
    {t:'Une vision de l’avenir qui donne envie',lesson:'L’avenir fait peur parce qu’il est flou. Un avenir souhaité, même imparfait, se construit. Pas un plan de carrière : une image. Où vit-il, avec qui, qu’est-ce qu’il fait le matin, qu’est-ce qui le fait rire ? Les parents qui ont une image avancent vers elle. Ceux qui n’en ont pas subissent celle des autres.',exo:'Écrivez une journée de votre enfant dans dix ans, la plus belle possible et réaliste. Du réveil au coucher.',obs:'Dans la semaine, remarquez un petit pas qui va déjà dans cette direction.'}
  ]},
  {m:'Émotions et résilience parentale',steps:[
    {t:'Mes émotions, mes signaux',lesson:'Colère, tristesse, honte, peur, épuisement : les émotions des parents d’un enfant différent sont fortes et souvent interdites. Elles sont pourtant des signaux, pas des fautes. La colère dit « c’est injuste ». La tristesse dit « j’ai perdu quelque chose ». La peur dit « je tiens à lui ». Nommer l’émotion la fait baisser d’un cran. La nier la fait sortir ailleurs, souvent sur la mauvaise personne.',exo:'Trois fois cette semaine, quand ça monte, nommez à voix basse : « là, c’est de la colère / de la peur / de la tristesse ». Rien d’autre.',obs:'Repérez l’émotion que vous vous interdisez le plus.'},
    {t:'Réguler et lâcher',lesson:'On ne décide pas de ne pas ressentir. On peut décider de ce qu’on fait avec. Respirer plus lentement que l’émotion, sortir trente secondes, poser les mains à plat, dire une phrase apprise par cœur : ce sont des gestes qui ramènent le corps avant la tête. Lâcher prise n’est pas renoncer : c’est arrêter de tenir ce qui ne dépend pas de vous.',exo:'Choisissez un geste de régulation (respirer 4-6, mains à plat, sortir, une phrase). Utilisez-le chaque fois que ça monte, pendant une semaine. Un seul geste.',obs:'Notez ce qui ne dépend pas de vous dans vos soucis de la semaine. Écrivez-le, puis posez-le.',link:'breath'},
    {t:'Mes ressources de résilience',lesson:'La résilience n’est pas une qualité qu’on a ou pas : c’est ce qui se construit avec des appuis. Une personne qui écoute, un lieu qui apaise, une activité qui rend à soi-même, une phrase qui tient. J’ai été placé à dix ans ; ce qui m’a tenu, ce sont deux personnes et un endroit. Trouvez les vôtres. Nommez-les. Allez-y exprès.',exo:'Écrivez vos quatre appuis : une personne, un lieu, une activité, une phrase. Programmez un rendez-vous avec chacun dans le mois.',obs:'Remarquez ce qui vous recharge vraiment, et ce qui ne fait que vous anesthésier.'},
    {t:'Bilan de mi-parcours',lesson:'Trois mois. Il est temps de regarder le chemin, pas la montagne. Refaites le point : stress, compétence, solitude, regard. Comparez avec le départ sans vous juger. Ce qui a bougé vous appartient. Ce qui n’a pas bougé indique où porter l’effort des trois mois à venir. Et ajustez votre objectif : il a le droit d’avoir changé.',exo:'Refaites le point dans « Mon évolution ». Relisez votre première phrase « Je commence ce parcours parce que… ».',obs:'Qu’est-ce que vous faites aujourd’hui que vous ne faisiez pas il y a trois mois ?',link:'evo'}
  ]},
  {m:'Changer de perspective et reconnaître les forces',steps:[
    {t:'Sa singularité',lesson:'Chaque personne en situation de handicap est d’abord une personne singulière : des goûts, un humour, des peurs, des talents. Le handicap décrit une partie de son fonctionnement, pas son identité. Cette semaine, on apprend à regarder sans la grille : ce qu’il aime, ce qu’il sait, ce qu’il fait mieux que vous.',exo:'Listez cinq choses que votre enfant fait mieux que la plupart des gens. Cherchez bien : il y en a.',obs:'Observez un moment où il est pleinement lui-même, sans effort. Que fait-il ?'},
    {t:'Ses talents, ses compétences',lesson:'Un talent n’est pas forcément spectaculaire. Remarquer les détails, mémoriser, persévérer, ressentir l’humeur des autres, rire aux éclats, être fidèle : ce sont des compétences, et elles se cultivent. Une compétence nommée se renforce. Une compétence ignorée s’éteint.',exo:'Choisissez une compétence de votre enfant et créez une occasion de l’exercer cette semaine. Dites-lui ce que vous avez vu.',obs:'Comptez les fois où vous nommez une compétence, et les fois où vous nommez une difficulté.'},
    {t:'Encourager juste',lesson:'Encourager, ce n’est pas féliciter tout le temps : c’est ajuster. Trop d’aide étouffe, trop peu décourage. Le bon encouragement vise le pas suivant, celui qui est à portée avec un peu d’effort, et il nomme l’effort plutôt que le résultat. « Tu as essayé trois fois » porte plus loin que « bravo ».',exo:'Cette semaine, remplacez « bravo » par la description de ce que vous avez vu : « tu as attendu », « tu as demandé », « tu as réessayé ».',obs:'Repérez un moment où vous aidez par habitude alors que votre enfant pourrait essayer.'},
    {t:'Des solutions pour le quotidien',lesson:'Les problèmes concrets ont souvent des solutions concrètes : prévenir avant une transition, montrer en images, offrir deux choix, simplifier une consigne, préparer la sortie. Les outils de l’application sont là pour ça. Choisissez un seul point de friction du quotidien et attaquez-le avec une méthode, pas avec plus de volonté.',exo:'Choisissez la situation la plus fréquente dans « Conseils » et essayez une seule des pistes pendant sept jours.',obs:'Notez chaque soir : mieux, pareil, moins bien. Après sept jours, décidez.',link:'advice'}
  ]},
  {m:'Les clés de l’inclusion au quotidien',steps:[
    {t:'Les formes de l’inclusion',lesson:'Scolaire, professionnelle, sociale, résidentielle : l’inclusion n’est pas une case à cocher mais un continuum. Entre la classe ordinaire et l’institution spécialisée, il existe mille nuances, et la bonne pour votre enfant peut changer avec l’âge. Connaître les formes qui existent, c’est pouvoir choisir au lieu de subir.',exo:'Dessinez une ligne : à gauche « tout ordinaire », à droite « tout spécialisé ». Placez où votre enfant est aujourd’hui, et où vous aimeriez qu’il soit dans deux ans.',obs:'Repérez une forme d’inclusion dont vous n’aviez pas connaissance.'},
    {t:'Collaborer avec les professionnels',lesson:'Les professionnels savent des choses que vous ne savez pas. Vous savez des choses qu’ils ne sauront jamais. La collaboration commence quand chacun apporte sa part sans défendre son territoire. Trois points écrits avant chaque rencontre, des questions simples, des décisions notées : vous devenez un partenaire, pas un visiteur.',exo:'Préparez votre prochaine rencontre avec trois points écrits : ce qui va bien, ce qui inquiète, ce que je demande.',obs:'Pendant la rencontre, remarquez si vous êtes écouté·e. Si non, redemandez, calmement.',link:'pros'},
    {t:'Ma place dans mon entourage',lesson:'Vous avez changé. Votre regard sur la différence a changé. Autour de vous, il y a des gens qui n’ont pas fait ce chemin et qui disent des choses maladroites. Vous pouvez, si vous le souhaitez et quand vous en avez la force, faire bouger un regard à la fois. Pas en militant : en montrant votre enfant tel qu’il est.',exo:'Choisissez une personne de votre entourage et racontez-lui une chose de votre enfant qu’elle ne connaît pas et qui le montre tel qu’il est.',obs:'Observez ce qui change dans la façon dont cette personne parle de lui ensuite.'},
    {t:'Avant la dernière ligne droite',lesson:'Cinq mois. Prenez un moment pour regarder ce que vous avez mis en place, ce qui tient tout seul maintenant, et ce qui a besoin d’encore un peu de vous. La dernière phase ne consiste pas à en faire plus : elle consiste à consolider ce qui marche et à décider ce qui continuera sans parcours.',exo:'Relisez vos notes et vos dépôts. Écrivez trois choses qui ont changé et une qui résiste.',obs:'Cette semaine, ne rajoutez rien. Maintenez.'}
  ]},
  {m:'Consolider et devenir autonome',steps:[
    {t:'Le bilan des six mois',lesson:'Refaites le point une dernière fois et regardez les trois courbes : départ, mi-parcours, aujourd’hui. Ce qui a bougé est à vous. Ce qui n’a pas bougé n’est pas un échec : certaines choses demandent plus de temps ou d’autres appuis. Les acquis, ce ne sont pas seulement des chiffres : ce sont des réflexes que vous avez maintenant et que vous n’aviez pas.',exo:'Faites le point final dans « Mon évolution ». Écrivez trois réflexes que vous avez acquis.',obs:'Remarquez une situation que vous gérez aujourd’hui sans y penser.',link:'evo'},
    {t:'Mes prochaines étapes',lesson:'La suite n’a pas besoin d’un parcours pour exister. Elle a besoin d’un rythme : un moment pour vous chaque semaine, une rencontre préparée, un dépôt quand ça pèse, une dose quand il faut. Choisissez ce que vous gardez. Laissez le reste.',exo:'Écrivez vos trois rituels pour les six prochains mois. Mettez-les dans votre agenda.',obs:'Testez-les une semaine. Gardez ceux qui tiennent.'},
    {t:'Une vision à long terme',lesson:'Revenez à la journée dans dix ans que vous aviez écrite. Relisez-la. Qu’est-ce qui a déjà avancé ? Qu’est-ce qui manque ? Les grandes questions, l’après-vous, le logement, les proches qui prendront le relais, se préparent en petites décisions, une par saison. Vous avez six mois d’entraînement à faire des petits pas. Continuez.',exo:'Choisissez une seule décision pour les six prochains mois qui prépare l’avenir. Datez-la.',obs:'Nommez une personne à qui vous en parlerez.'},
    {t:'Le chemin parcouru',lesson:'Vous êtes arrivé·e au bout de vingt-quatre étapes, avec un enfant qui n’a pas attendu que vous ayez fini pour grandir. Vous avez regardé où vous étiez, changé une partie de votre regard, appris à nommer vos émotions, trouvé vos appuis, vu les forces de votre enfant, préparé vos rencontres, et choisi vos rituels. Vous n’êtes pas devenu·e un parent parfait. Vous êtes devenu·e un parent plus éclairé. C’était la promesse. Vous l’avez tenue vous-même.',exo:'Écrivez une lettre à vous-même d’il y a six mois. Dites-lui ce que vous savez maintenant.',obs:'Gardez cette lettre. Relisez-la un jour gris.'}
  ]}
];
/* ---------- Mon évolution (questionnaire) ---------- */
const EVO_SCALES=[
  {id:'stress',t:'Mon niveau de stress',lo:'calme',hi:'à bout'},
  {id:'comp',t:'Mon sentiment de compétence comme parent',lo:'perdu·e',hi:'solide'},
  {id:'seul',t:'Ma solitude face à la situation',lo:'entouré·e',hi:'seul·e'},
  {id:'regard',t:'Mon regard sur mon enfant',lo:'je vois d’abord ses difficultés',hi:'je vois d’abord qui il est'},
  {id:'confiance',t:'Ma confiance dans l’avenir',lo:'peur',hi:'confiance'}
];
const EVO_OPEN=[['avant','Que connaissiez-vous du handicap avant d’y être confronté·e dans votre vie de famille ?'],['change','Votre regard a-t-il changé depuis ? Qu’est-ce qui a changé, et comment l’expliquez-vous ?']];
const EVO_TIMES=[['t1','Point de départ'],['t2','Mi-parcours (3 mois)'],['t3','Bilan (6 mois)']];
/* ---------- Photolangage ---------- */
const PHOTOS=[['🌄','Une aube'],['🌊','Une mer agitée'],['🧗','Une paroi'],['🌳','Un arbre'],['🚪','Une porte'],['🧭','Une boussole'],['🌧️','La pluie'],['🔥','Un feu'],['🪢','Un nœud'],['🌱','Une pousse'],['🏔️','Un col'],['🤲','Des mains']];
/* ---------- Formules ---------- */
const PLANS=[
  {t:'Découverte',p:'0',per:'7 jours',best:false,items:['La dose de lumière chaque jour','Les conseils et les outils','Déposer, trois fois']},
  {t:'Le parcours',p:'14',per:'par mois',best:true,items:['Tout Découverte, sans limite','Le parcours de six mois en 24 étapes','Mon évolution : départ, mi-parcours, bilan','Déposer autant que nécessaire, avec la phrase-miroir']},
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
  ['Déposer, phrase-miroir','3 dépôts','Illimité','Illimité'],
  ['« Et concrètement ? »','3 fois','Illimité','Illimité'],
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
  antonio:{t:'Avec Antonio',s:'Chaque mois, Antonio lit les dépôts que vous choisissez de lui partager et vous écrit un mot personnel. Deux fois par mois, vous pouvez lui poser une question ; il répond par écrit sous 48 heures.'}
};
const LETTER_EXAMPLE='J’ai lu ce que vous avez déposé ce mois-ci. Ce que j’entends d’abord, c’est la fatigue des soirs, et le fait que vous êtes resté·e là malgré tout. Les enfants ne retiennent pas nos cris ; ils retiennent qu’on est revenu.\nJ’ai vu aussi quelque chose bouger : vous avez commencé à nommer ce qui précède les crises. C’est exactement par là qu’on ouvre une porte.\nPour le mois qui vient, une seule piste : le « d’abord, ensuite » au moment du coucher, dix soirs de suite, sans chercher le parfait. On en reparle dans votre prochain mot.';
const QA_EXAMPLE={q:'Mon fils de 9 ans refuse d’aller à l’école le matin, ça finit en cris. Je fais quoi ?',a:'Commencez par la veille, pas par le matin : la tenue préparée, le sac fermé, et une phrase courte annoncée au coucher sur ce qui se passera demain. Le matin, moins de mots, un seul choix (« chaussures ou veste d’abord ? ») et le même ordre chaque jour. Si le refus dure plus de deux semaines, demandez un rendez-vous à l’enseignant·e : quelque chose se passe là-bas que vous ne voyez pas d’ici. Et dites-vous que ce refus n’est pas contre vous.'};
const WEIGHTS=[['solitude','La solitude'],['fatigue','La fatigue'],['culpa','La culpabilité'],['doutes','Les doutes'],['regard','Le regard des autres'],['pros','Les professionnels'],['charge','La charge mentale'],['couple','Le couple']];
/* Tant que le serveur n'existe pas, les échanges avec Antonio sont une démonstration : rien n'est transmis. */
const DEMO=true;
const LIM={me:30,draft:4000,q:1500,line:240,phrase:140,three:120,photo:2000,evo:1500,search:60};
const tel=(n,label)=>'<a class="tel" href="tel:'+String(n).replace(/[^0-9+]/g,'')+'">'+(label||n)+'</a>';
const HELP=[
  {t:'La Main Tendue',tel:'143',d:'Jour et nuit, pour parler, quand ça ne va pas.'},
  {t:'Pro Juventute, conseils aux parents',tel:'058 261 61 61',d:'Gratuit et confidentiel, 24 heures sur 24, pour toutes les questions de parents.'},
  {t:'Urgences',tel:'144',d:'Danger immédiat pour la vie.'},
  {t:'Pro Infirmis',url:'https://www.proinfirmis.ch/fr/a-propos/prestations.html',label:'proinfirmis.ch',d:'Consultation sociale gratuite et confidentielle, dans votre canton.'}
];

/* ---------- état ---------- */
const DEF={tier:'free',me:'',age:'e',situation:'hand',weights:[],start:'',moods:{},depots:[],shared:{},steps:{},evo:{},photo:null,abc:[],phrases:[],routineDone:{},three:[],letters:[],questions:[],onboarded:false,doseDate:'',doseText:''};
const state={data:null,view:'today',prev:null,lastKey:null,lastSheet:null,sit:null,q:'',theme:'all',age:'all',sheet:null,upFeat:null,toast:'',exo:null,kit:'sits',tool:'timer',timer:{total:300,left:300,running:false,h:null},ft:{first:null,then:null,pick:'first'},confirmReset:false,sample:null,inClaude:false,busy:false,ctl:null,draft:'',qdraft:'',step:null,evoTime:'t1',depotMode:'listen',doseBusy:false,letter:null};
let toastTimer=null;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function load(){try{const d=JSON.parse(localStorage.getItem(KEY)||'null');if(d&&typeof d==='object')return Object.assign(JSON.parse(JSON.stringify(DEF)),d);}catch(e){}return JSON.parse(JSON.stringify(DEF));}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state.data));}catch(e){}}
function toast(m){state.toast=m;renderToast();clearTimeout(toastTimer);toastTimer=setTimeout(()=>{state.toast='';renderToast();},3000);}
function renderToast(){const old=document.querySelector('.toast');if(old)old.remove();if(state.toast){const el=document.createElement('div');el.className='toast';el.setAttribute('role','status');el.textContent=state.toast;document.getElementById('app').appendChild(el);}}
const D=()=>state.data;
const pad=n=>String(n).padStart(2,'0');
const todayIso=()=>{const d=new Date();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());};
const fmtDate=iso=>{const p=iso.split('-');return p[2]+'.'+p[1]+'.'+p[0];};
const MONTHS_FR=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
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
  if(!D().onboarded&&state.view==='plans'){base='app nobar';key='peek';html='<header class="bar"><button type="button" class="back" data-act="back">'+I.back+'Retour</button></header>'+viewPlans();}
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
}
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
  const priv=SITE?'Version de test, gratuite. Tout ce que vous écrivez reste sur votre appareil. La phrase-miroir personnalisée arrivera avec la version complète ; d’ici là, chaque dépôt reçoit une question et une lumière.':'Vos notes restent sur votre appareil. Quand vous déposez, votre texte part sans votre nom pour recevoir une réponse.';
  return '<main id="main" tabindex="-1" class="view" style="padding-top:0">'+
    '<div class="herofull bleed"><img class="herobg" src="'+HERO+'" alt="Une goutte tombe sur un étang et dessine des cercles, dans la lumière d’une forêt." width="866" height="470" decoding="async" fetchpriority="high"><span class="pill test">Version de test</span><h1>Parent Écouté,<br>Parent Éclairé</h1><span class="by">Par Antonio Company</span><p class="tag">Un espace d’écoute pour tout parent en chemin. Déposez ce qui pèse, recevez chaque jour une dose de lumière, avancez six mois à votre rythme.</p>'+cta(false)+'</div>'+
    '<div class="pillars reveal d1">'+
    '<div class="pillar"><span class="ic">'+I.drop+'</span><div><h2>Écouté</h2><span>Vous déposez, par écrit, sans prénom. Vous recevez une phrase-miroir, une question qui ouvre, une lumière.</span></div></div>'+
    '<div class="pillar sun"><span class="ic">'+I.sun2+'</span><div><h2>Éclairé</h2><span>La dose de lumière intérieure chaque matin, et un parcours de six mois, une étape par semaine.</span></div></div>'+
    '<div class="pillar"><span class="ic">'+I.user+'</span><div><h2>Accompagné, si vous le voulez</h2><span>Antonio Company, éducateur social depuis vingt ans, vous écrit chaque mois dans la formule « Avec Antonio ».</span></div></div>'+
    '</div>'+
    '<div class="cta-stack reveal d2">'+cta(true)+'</div>'+
    '<p class="hint" style="text-align:center">'+priv+'</p></main>'+
    '<footer class="foot"><button type="button" class="linkbtn" data-act="peek-plans">Formules</button>'+(SITE?'<a href="confidentialite.html">Confidentialité</a><a href="conditions.html">Conditions générales</a>':'')+'</footer>';
}
/* ---------- aujourd’hui ---------- */
function viewToday(){
  const d=D();const t=todayIso();const m=d.moods[t];const st=allSteps()[currentStepIdx()];const rd=recentDepot();
  let html='<main id="main" tabindex="-1" class="view" style="padding-top:0"><div class="band bleed" style="background-image:url('+HERO+')"><span class="label">'+esc(fmtDate(t))+' · semaine '+(weekNo()+1)+'</span><h1 class="t1">'+esc(greeting())+(d.me?', '+esc(d.me):'')+'.</h1></div>';
  if(can('antonio'))html+=letterCard();
  if(!d.evo.t1)html+='<button type="button" class="card reveal d1" data-act="go" data-view="evo" style="text-align:left;cursor:pointer;border-color:var(--green)"><div class="row" style="justify-content:space-between;align-items:center"><span class="label" style="color:var(--green)">Pour commencer · 3 minutes</span><span class="pill green">Étape 1</span></div><p class="lesson" style="font-size:20px">Le questionnaire de départ</p><span class="hint">Cinq curseurs et deux questions sur là où vous en êtes aujourd’hui. On le refera à trois mois et à six mois : c’est ce qui vous montrera le chemin parcouru.</span><span class="btn primary small" style="align-self:flex-start;margin-top:4px">'+I.chart+'Faire mon point de départ</span></button>';
  html+='<div class="dose reveal d1"><span class="label">'+(new Date().getDay()===0?'Dose spéciale du dimanche':'La dose de lumière intérieure')+'</span><p>'+esc(doseText())+'</p><span class="sig">Antonio</span>'+
    (rd&&state.sample?(can('parcours')?'<div class="row"><button type="button" class="btn small" data-act="dose-perso"'+(state.doseBusy?' disabled':'')+'>'+I.sun2+(state.doseBusy?'Un instant…':(d.doseDate===t?'Une autre dose pour moi':'Ma dose, d’après ce que j’ai déposé'))+'</button></div>':'<div class="row"><button type="button" class="btn small" data-act="upgrade" data-f="dose">'+I.lock+'Ma dose personnalisée</button></div>'):'')+'</div>';
  html+=depotBox();
  html+='<button type="button" class="step now reveal d3" data-act="step" data-i="'+st.idx+'"><span class="n">'+(st.idx+1)+'</span><span class="tx"><span class="label">Éclairé · l’étape de la semaine</span><b>'+esc(st.t)+'</b></span><span class="chev">'+I.chev+'</span></button>';
  html+='<div class="card reveal d4"><span class="label">Comment ça va, là, maintenant ?</span><div class="moodrow">'+MOODS.map((x,i)=>'<button type="button" data-act="mood" data-i="'+i+'" aria-pressed="'+(m===i)+'" aria-label="'+esc(x[1])+'">'+x[0]+'</button>').join('')+'</div>'+(m!==undefined?'<p style="font-family:var(--font-display);font-size:17px;line-height:1.4">'+esc(MOOD_WORDS[m])+'</p>':'')+'</div>';
  return html+'</main>';
}
function letterCard(){
  const L=D().letters;const l=L.length?L[L.length-1]:null;
  const txt=l?l.text:LETTER_EXAMPLE;
  return '<button type="button" class="letter reveal d1" data-act="letter" data-i="'+(l?L.length-1:-1)+'"><div class="from"><span class="av" aria-hidden="true">A</span><div><b>'+(l?'Le mot d’Antonio · '+esc(MONTHS_FR[Number(l.date.slice(5,7))-1]):'Le mot d’Antonio · exemple')+'</b><span>'+(l?esc(fmtDate(l.date)):'Démonstration : voici à quoi il ressemblera')+'</span></div></div><p>'+esc(txt.split('\n')[0])+'</p><span class="hint">'+(l?'Lire ':'Lire l’exemple ')+I.chev+'</span></button>';
}
function depotBox(){
  const left=depotsLeft();const today=todayIso();const td=D().depots.filter(x=>x.date===today).slice(-1)[0];
  const head=lab=>'<div class="row" style="justify-content:space-between;align-items:center">'+lab+(left!==Infinity&&left>0?'<span class="pill">'+left+' dépôt'+(left>1?'s':'')+' offert'+(left>1?'s':'')+'</span>':'')+'</div>';
  let html='<div class="card reveal d2">';
  if(left===0){
    html+=head('<span class="label">Écouté · Déposer</span>')+'<p class="lesson" style="font-size:18px">Vos trois dépôts Découverte sont utilisés.</p>'+lockline('Déposer sans limite, avec la phrase-miroir','depots')+'<button type="button" class="btn primary" data-act="upgrade" data-f="depots" style="align-self:flex-start">Passer au Parcours · 14 CHF/mois</button>';
  }else{
    html+=head('<label class="label" for="draft">Écouté · Déposer</label>')+
      '<textarea id="draft" maxlength="'+LIM.draft+'" placeholder="Qu’est-ce qui pèse, là, maintenant ? Écrivez comme ça vient, sans prénom." style="min-height:110px">'+esc(state.draft)+'</textarea>'+
      '<div class="chips" role="group" aria-label="Ce que vous attendez"><button type="button" class="chip" data-act="dmode" data-v="listen" aria-pressed="'+(state.depotMode==='listen')+'">Être écouté·e</button><button type="button" class="chip" data-act="dmode" data-v="advice" aria-pressed="'+(state.depotMode==='advice')+'">Et concrètement, je fais quoi ?</button></div>'+
      '<div class="row" style="align-items:center">'+(state.busy?'<button type="button" class="btn" data-act="dstop">'+I.stop+'Arrêter</button>':'<button type="button" class="btn primary" data-act="dsend">'+I.drop+'Déposer</button>')+'<span class="count" id="draft-count" aria-hidden="true"></span></div>'+
      (state.sample===false?'<p class="hint">Version de test : l’écoute est locale (une question, une lumière) et votre texte ne quitte pas votre appareil. La phrase-miroir arrive avec la version complète.</p>':'');
  }
  if(state.busy)html+='<div class="mirror"><div class="think" role="status"><span class="dotp"></span>Je vous lis…</div></div>';
  if(td&&!state.busy)html+=depotHtml(td,true);
  html+='</div>';return html;
}
function depotHtml(x,compact){
  let out='<div class="mirror"><span class="lbl">'+esc(fmtDate(x.date))+(x.time?' · '+esc(x.time):'')+'</span>'+(compact?'':'<p class="depot you">« '+esc(x.text.length>220?x.text.slice(0,220)+'…':x.text)+' »</p>');
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
  return 'Tu es la voix de « Parent Écouté, Parent Éclairé », un espace d’écoute créé par Antonio Company, éducateur social (vingt ans auprès de familles d’enfants en situation de handicap ou en difficulté, père, placé lui-même à dix ans). Un parent vient de déposer ce qui pèse. Ta tâche : l’écouter, pas le conseiller. Réponds UNIQUEMENT avec un objet JSON : {"miroir":"...","question":"...","lumiere":"..."}.\n'+
  '« miroir » : une ou deux phrases qui reformulent ce que le parent vit, avec ses mots, en nommant l’émotion probable sans l’imposer (« on dirait que… »), sans aucun conseil, sans jugement, sans minimiser. « question » : une seule question ouverte, courte, qui aide le parent à voir plus clair ou à se reconnecter à ses ressources ; jamais « pourquoi ». « lumiere » : une phrase chaleureuse et vraie, jamais mièvre, qui reconnaît ce que le parent fait déjà, ou lui donne une permission (droit à la fatigue, à la colère, au repos). Français de Suisse romande, vouvoiement, aucun prénom, aucun diagnostic. Si le message évoque un danger immédiat (idées suicidaires, violence grave), « lumiere » commence par inviter doucement à appeler le 143 (La Main Tendue) ou le 144.\n\nContexte : '+ctx()+'.\n\nDÉPÔT :\n"""\n'+text.slice(0,6000)+'\n"""';
}
function advicePrompt(){
  return 'Tu es la voix de « Parent Écouté, Parent Éclairé », celle d’un éducateur social expérimenté (vingt ans auprès d’enfants, d’adolescents et d’adultes en situation de handicap ou en difficulté, formateur, père). Tu parles à un parent, en français de Suisse romande, vouvoiement, chaleur, zéro jargon, zéro jugement. Aucun diagnostic, aucun trouble nommé, aucun médicament, aucun prénom. Contexte : '+ctx()+'.\n'+
  'Structure en quatre parties courtes avec ces titres exacts précédés de « ## » : « Ce que j’entends » (deux phrases, sans juger, qui reconnaissent l’effort), « Ce que vous pouvez essayer » (trois pistes concrètes en liste à puces, réalistes ce soir ou cette semaine : prévisibilité, moins de mots, choix entre deux options, d’abord/ensuite, routines visuelles, sécurité d’abord, observer ce qui précède), « Pour vous » (une ou deux phrases pour le parent lui-même), « Si ça continue » (une phrase : quand et à qui demander de l’aide, sans dramatiser ; pédiatre ou médecin, l’équipe de l’institution ou de l’école, Pro Infirmis, associations de parents ; La Main Tendue 143 si le parent va très mal). Maximum 200 mots. Pas de gras. Termine par une phrase courte et vraie.';
}
const RISK=/(suicid|me tuer|en finir|plus envie de vivre|le tuer|la tuer|je vais le frapper|je vais la frapper)/i;
async function sendDepot(){
  const text=clean(state.draft,LIM.draft);if(text.length<5){fieldErr('draft','Écrivez quelques mots, comme ça vient (cinq caractères au moins).');return;}
  if(depotsLeft()===0){openUpgrade('depots');render();return;}
  const d=D();const n=new Date();const dep={id:'d'+Date.now(),date:todayIso(),time:pad(n.getHours())+':'+pad(n.getMinutes()),text,mode:state.depotMode};
  if(RISK.test(text))toast('Si c’est urgent : 143 (La Main Tendue) ou 144. Vous n’êtes pas seul·e.');
  state.draft='';state.busy=true;render();
  if(!state.sample){
    dep.question=LOCAL_Q[dayIdx(LOCAL_Q.length)];dep.lumiere=WORDS[(dayIdx(WORDS.length)+3)%WORDS.length];
    d.depots.push(dep);state.busy=false;save();render();toast('Déposé. Gardé pour vous.');return;
  }
  state.ctl=new AbortController();
  try{
    if(state.depotMode==='advice'){
      const res=await state.sample([{role:'user',content:advicePrompt()},{role:'user',content:text}],{signal:state.ctl.signal,cache:false});
      dep.conseil=res.text;
    }else{
      const r=await state.sample.json(listenPrompt(text),{signal:state.ctl.signal,cache:false});
      dep.miroir=String((r&&r.miroir)||'').trim();dep.question=String((r&&r.question)||'').trim();dep.lumiere=String((r&&r.lumiere)||'').trim();
      if(!dep.miroir&&!dep.question)dep.question=LOCAL_Q[0];
    }
  }catch(e){
    if(e&&e.code==='not_granted')state.sample=false;
    dep.question=dep.question||LOCAL_Q[dayIdx(LOCAL_Q.length)];dep.lumiere=dep.lumiere||'Déposé. Même sans réponse, c’est posé quelque part hors de vous.';
    if(e&&e.code!=='cancelled'&&e.code!=='not_granted')toast('La réponse n’est pas venue cette fois. Votre dépôt est gardé.');
  }
  d.depots.push(dep);state.busy=false;state.ctl=null;save();render();
}
async function concret(id){
  const d=D();const dep=d.depots.find(x=>x.id===id);if(!dep||!state.sample)return;
  if(!can('parcours')&&d.depots.filter(x=>x.conseil).length>=FREE_DEPOTS){openUpgrade('depots');render();return;}
  state.busy=true;render();state.ctl=new AbortController();
  try{const res=await state.sample([{role:'user',content:advicePrompt()},{role:'user',content:dep.text}],{signal:state.ctl.signal,cache:false});dep.conseil=res.text;}
  catch(e){if(e&&e.code!=='cancelled')toast('Pas de réponse cette fois. Réessayez dans un instant.');}
  state.busy=false;state.ctl=null;save();render();
}
async function dosePerso(){
  const ld=recentDepot();if(!ld||!state.sample)return;
  if(!can('parcours')){openUpgrade('dose');render();return;}
  state.doseBusy=true;render();
  try{
    const r=await state.sample('Tu écris « la dose de lumière intérieure » de « Parent Écouté, Parent Éclairé », créé par Antonio Company, éducateur social. Un parent a déposé ceci il y a peu : """'+ld.text.slice(0,1500)+'""" (le '+fmtDate(ld.date)+'). Écris pour lui, pour aujourd’hui '+fmtDate(todayIso())+', une dose de 45 à 70 mots : une phrase qui montre que tu as entendu ce qu’il a déposé (sans le répéter mot à mot), une phrase qui éclaire ou donne une permission, et une petite chose à faire ou à regarder aujourd’hui. Français de Suisse romande, vouvoiement, aucun prénom, aucun conseil médical, aucune mièvrerie, pas de titre, pas de guillemets, pas de signature. Réponds avec le texte seul.',{cache:false,modelTier:'quick'});
    D().doseDate=todayIso();D().doseText=r.text.trim();save();
  }catch(e){if(e&&e.code==='not_granted')state.sample=false;toast('La dose personnalisée n’est pas venue. Celle du jour reste là.');}
  state.doseBusy=false;render();
}
/* ---------- parcours ---------- */
function stepLocked(idx){return idx>0&&!can('parcours');}
function viewParcours(){
  const cur=currentStepIdx();const steps=allSteps();const done=doneCount();const pct=Math.round(done/24*100);
  return '<main id="main" tabindex="-1" class="view" style="padding-top:0"><div class="band thin bleed" style="background-image:url('+HERO+');background-position:center 6%"><h1 class="t1">Le parcours</h1></div><p class="sub">Six mois, vingt-quatre étapes, une par semaine : deux minutes à lire, une chose à essayer, une chose à observer.</p>'+
    '<div class="card"><div class="kv"><span>Semaine '+(weekNo()+1)+'</span><span>'+done+' / 24 étapes</span></div><div class="progress"><b style="width:'+pct+'%"></b></div>'+
    '<div class="quick"><button type="button" class="btn" data-act="go" data-view="evo">'+I.chart+'Mon évolution</button><button type="button" class="btn" data-act="go" data-view="photo">'+(can('parcours')?I.image:I.lock)+'Photolangage</button></div></div>'+
    '<div class="months">'+PARCOURS.map((m,mi)=>'<div class="month"><h2><span class="n">'+(mi+1)+'</span>'+esc(m.m)+'</h2>'+m.steps.map((s,si)=>{const st=steps.find(x=>x.mi===mi&&x.si===si);const dn=!!D().steps[st.idx];const lk=stepLocked(st.idx);return '<button type="button" class="step'+(st.idx===cur?' now':'')+(dn?' done':'')+(lk?' locked':'')+'" data-act="step" data-i="'+st.idx+'"><span class="n">'+(lk?I.lock:dn?I.check:(st.idx+1))+'</span><span class="tx"><b>'+esc(s.t)+'</b><span>'+(st.idx===cur?'Cette semaine':'Semaine '+(st.idx+1))+'</span></span><span class="chev">'+I.chev+'</span></button>';}).join('')+'</div>').join('')+'</div>'+
    (can('parcours')?'<p class="hint">Vous pouvez avancer librement : le parcours propose un rythme, il ne l’impose pas.</p>':lockline('Les 23 étapes suivantes font partie du Parcours · 14 CHF/mois','parcours'))+'</main>';
}
function viewStep(){
  const steps=allSteps();const s=steps[state.step];if(!s){state.view='parcours';return viewParcours();}
  const dn=!!D().steps[s.idx];
  const links={evo:['go','evo',I.chart,'Faire le point dans Mon évolution'],photo:['go','photo',I.image,'Ouvrir le photolangage'],breath:['exo','breath',I.wind,'Respirer 4-6 maintenant'],advice:['kit','sits',I.bulb,'Ouvrir les situations'],pros:['sit','pros',I.bulb,'Parler aux professionnels']};
  const lk=s.link?links[s.link]:null;
  return '<main id="main" tabindex="-1" class="view"><div><span class="label">Mois '+(s.mi+1)+' · '+esc(PARCOURS[s.mi].m)+' · étape '+(s.idx+1)+' / 24</span><h1 class="t1">'+esc(s.t)+'</h1></div>'+
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
  const scales=EVO_SCALES.map(s=>'<div class="scale"><b>'+esc(s.t)+'</b><input type="range" min="0" max="10" step="1" value="'+(cur[s.id]!==undefined?cur[s.id]:5)+'" data-evo="'+s.id+'" aria-label="'+esc(s.t)+'"><div class="row"><span>0 · '+esc(s.lo)+'</span><span>10 · '+esc(s.hi)+'</span></div></div>').join('');
  const opens=EVO_OPEN.map(o=>'<div class="field"><label for="evo-'+o[0]+'">'+esc(o[1])+'</label><textarea id="evo-'+o[0]+'" data-evoopen="'+o[0]+'" maxlength="'+LIM.evo+'" style="min-height:80px">'+esc(cur[o[0]]||'')+'</textarea></div>').join('');
  const have=EVO_TIMES.filter(x=>e[x[0]]);
  let bars='';
  if(have.length){bars='<div class="card"><span class="label">Le chemin</span><div class="bars">'+EVO_SCALES.map(s=>'<div class="barrow"><span>'+esc(s.t.replace('Mon ','').replace('Ma ',''))+'</span><div class="bartrack">'+EVO_TIMES.map((x,i)=>e[x[0]]?'<i class="t'+(i+1)+'"><b style="width:'+(Number(e[x[0]][s.id]||0)*10)+'%"></b></i>':'').join('')+'</div></div>').join('')+'</div><div class="legend">'+have.map(x=>'<span class="t'+(EVO_TIMES.indexOf(x)+1)+'">'+esc(x[1])+(e[x[0]].date?' · '+esc(fmtDate(e[x[0]].date)):'')+'</span>').join('')+'</div><p class="hint">Le stress et la solitude ont vocation à baisser ; la compétence, le regard et la confiance à monter. Ce qui bouge est à vous.</p></div>';}
  return '<main id="main" tabindex="-1" class="view"><div><span class="label">'+(t==='t1'?'Le questionnaire de départ':t==='t2'?'Le point à trois mois':'Le bilan à six mois')+'</span><h1 class="t1">Mon évolution</h1><p class="sub">Trois points sur six mois : départ, mi-parcours, bilan. Cinq curseurs et deux questions. Pas de bonne réponse : la vôtre, à cette date.</p></div>'+chips+bars+
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
  return '<main id="main" tabindex="-1" class="view" style="padding-top:0"><div class="band thin bleed" style="background-image:url('+HERO+');background-position:left 55%"><h1 class="t1">La boîte à outils</h1></div><p class="sub">'+(state.kit==='sits'?'Vingt-deux situations de la vraie vie, avec les pistes d’un éducateur, et toujours un mot pour vous.':state.kit==='tools'?'Ceux que les éducateurs utilisent tous les jours. Pour la table de la cuisine.':'Deux minutes. Pas pour devenir un meilleur parent : pour rester une personne.')+'</p>'+seg+body+'</main>';
}
function kitSits(){
  let list=SITS.filter(s=>(state.theme==='all'||s.th===state.theme)&&(state.age==='all'||s.ages.includes(state.age)));
  const q=state.q.trim().toLowerCase();if(q)list=list.filter(s=>(s.t+' '+s.s+' '+s.comp).toLowerCase().includes(q));
  return '<div class="search">'+I.search+'<input type="search" id="q" aria-label="Chercher une situation" maxlength="'+LIM.search+'" placeholder="Chercher : coucher, crise, école…" value="'+esc(state.q)+'" autocomplete="off" enterkeyhint="search"></div>'+
    '<div class="chips scroll" role="group" aria-label="Âge">'+Object.keys(AGES).map(k=>'<button type="button" class="chip" data-act="age" data-v="'+k+'" aria-pressed="'+(state.age===k)+'">'+AGES[k]+'</button>').join('')+'</div>'+
    '<div class="chips scroll" role="group" aria-label="Thème">'+Object.keys(THEMES).map(k=>'<button type="button" class="chip" data-act="theme" data-v="'+k+'" aria-pressed="'+(state.theme===k)+'">'+THEMES[k]+'</button>').join('')+'</div>'+
    '<div class="sits">'+(list.length?list.map(s=>'<button type="button" class="sit" data-act="sit" data-id="'+s.id+'"><span class="e">'+s.e+'</span><span class="tx"><b>'+esc(s.t)+'</b><span>'+esc(s.s)+'</span></span><span class="chev">'+I.chev+'</span></button>').join(''):'<p class="hint">Rien pour ce mot. Déposez-le sur l’accueil : on vous répond.</p>')+'</div>';
}
function viewSit(){
  const s=SITS.find(x=>x.id===state.sit);if(!s){state.view='kit';return viewKit();}
  const li=a=>'<ul class="list">'+a.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
  return '<main id="main" tabindex="-1" class="view"><div><span class="label">'+s.ages.map(a=>AGES[a]).join(' · ')+'</span><h1 class="t1">'+s.e+' '+esc(s.t)+'</h1><p class="sub">'+esc(s.s)+'</p></div>'+
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
function toolTimer(){const t=state.timer;const mins=[1,2,3,5,10,15];return '<div class="card green" style="align-items:center"><span class="label">Minuteur visuel</span><p class="hint" style="text-align:center">Le temps qui reste se voit. « Quand le vert a disparu, on range. »</p><div class="timerwrap"><div class="ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" style="fill:none;stroke:var(--surface);stroke-width:12"/><circle id="arc" cx="60" cy="60" r="52" style="fill:none;stroke:var(--green);stroke-width:12;stroke-linecap:round;stroke-dasharray:326.7;stroke-dashoffset:0"/></svg><div class="num" id="tnum">'+Math.floor(t.left/60)+':'+pad(t.left%60)+'</div></div><div class="bigrow">'+mins.map(m=>'<button type="button" class="btn small'+(t.total===m*60?' primary':'')+'" data-act="tset" data-m="'+m+'">'+m+' min</button>').join('')+'</div><div class="bigrow"><button type="button" class="btn primary" data-act="ttoggle">'+(t.running?I.stop+'Pause':I.timer+'Lancer')+'</button><button type="button" class="btn" data-act="treset">Remettre</button></div></div></div>';}
function drawTimer(){const t=state.timer;const arc=document.getElementById('arc');const num=document.getElementById('tnum');if(!arc||!num)return;const frac=t.total?t.left/t.total:0;arc.style.strokeDashoffset=String(326.7*(1-frac));num.textContent=Math.floor(t.left/60)+':'+pad(t.left%60);arc.style.stroke=frac<.2?'var(--coral)':'var(--green)';}
function tick(){const t=state.timer;if(!t.running)return;t.left=Math.max(0,t.left-1);drawTimer();if(t.left===0){t.running=false;clearInterval(t.h);t.h=null;try{if(navigator.vibrate)navigator.vibrate([200,100,200]);}catch(e){}toast('C’est fini. Bravo.');render();}}
function stopTimer(){const t=state.timer;t.running=false;if(t.h){clearInterval(t.h);t.h=null;}}
function toolFT(){const f=state.ft;const card=(k,lbl,v,cls)=>'<button type="button" class="ftcard '+cls+'" data-act="ftpick" data-k="'+k+'" style="'+(f.pick===k?'box-shadow:var(--shadow)':'')+'"><span class="lbl">'+lbl+'</span>'+(v?'<span class="big">'+v[0]+'</span><span class="txt">'+esc(v[1])+'</span>':'<span class="hint">Choisissez en dessous</span>')+'</button>';return '<div class="card"><span class="label">Tableau « d’abord, ensuite »</span><p class="hint">D’abord ce qu’il faut faire, ensuite ce qui fait plaisir. Montrez-le, pointez-le, c’est tout.</p><div class="ft">'+card('first','D’abord',f.first,'')+card('then','Ensuite',f.then,'then')+'</div><p class="hint">Vous remplissez : <b>'+(f.pick==='first'?'D’abord':'Ensuite')+'</b></p><div class="picto">'+PICTOS.map((p,i)=>'<button type="button" data-act="ftset" data-i="'+i+'" aria-pressed="'+((f[f.pick]&&f[f.pick][1]===p[1])?'true':'false')+'"><span>'+p[0]+'</span>'+p[1]+'</button>').join('')+'</div></div>';}
function toolRoutine(){const d=D();const r=ROUTINE_DEF;const done=d.routineDone[todayIso()]||{};const all=r.every((x,i)=>done[i]);return '<div class="card"><span class="label">La routine du soir</span><p class="hint">Dans l’ordre, chaque soir pareil. L’enfant coche lui-même : c’est lui qui avance.</p><div class="routine">'+r.map((x,i)=>'<button type="button" class="rstep'+(done[i]?' done':'')+'" data-act="rdone" data-i="'+i+'"><span class="e">'+x[0]+'</span><span class="t">'+esc(x[1])+'</span><span class="ck">'+(done[i]?I.check:'')+'</span></button>').join('')+'</div>'+(all?'<div class="comfort">Tout est fait. Bonne nuit à tous les deux.</div>':'')+'<button type="button" class="btn small" data-act="rreset" style="align-self:flex-start">Remettre à zéro</button></div>';}
function toolABC(){const d=D();const list=d.abc.slice().reverse().slice(0,10);return '<div class="card"><span class="label">Journal avant, pendant, après</span><p class="hint">Trois lignes à chaque fois que ça déborde. Après trois semaines, on voit ce qui précède. C’est ce que demandera tout professionnel.</p><div class="abc"><div class="field"><label for="a1">Avant</label><input type="text" id="a1" maxlength="'+LIM.line+'" placeholder="Où, quand, qui, quoi juste avant" autocomplete="off"></div><div class="field"><label for="a2">Pendant</label><input type="text" id="a2" maxlength="'+LIM.line+'" placeholder="Ce qui s’est passé, combien de temps" autocomplete="off"></div><div class="field"><label for="a3">Après</label><input type="text" id="a3" maxlength="'+LIM.line+'" placeholder="Ce qui a aidé, ce qui a suivi" autocomplete="off"></div></div><button type="button" class="btn primary" data-act="abcadd" style="align-self:flex-start">'+I.plus+'Noter</button></div>'+(list.length?'<div class="log">'+list.map(x=>'<div class="logi"><span class="d">'+esc(fmtDate(x.date))+' · '+esc(x.time)+'</span><span><b>Avant :</b> '+esc(x.a)+'</span><span><b>Pendant :</b> '+esc(x.b)+'</span><span><b>Après :</b> '+esc(x.c)+'</span></div>').join('')+'</div>':'');}
function toolPhr(){const d=D();return '<div class="card"><span class="label">Mes phrases qui marchent</span><p class="hint">Celles qui calment, qui font rire, qui débloquent. Pour vous, pour l’autre parent, pour la grand-mère qui garde samedi.</p><div class="field"><label class="sr" for="ph">Une phrase qui marche</label><input type="text" id="ph" maxlength="'+LIM.phrase+'" placeholder="Ex. : « On respire comme le dragon »" autocomplete="off" enterkeyhint="done"></div><button type="button" class="btn primary" data-act="phadd" style="align-self:flex-start">'+I.plus+'Garder</button>'+(d.phrases.length?'<div class="phr">'+d.phrases.map((p,i)=>'<div><span>'+esc(p)+'</span><button type="button" class="btn small ghost" data-act="phdel" data-i="'+i+'" aria-label="Retirer cette phrase">'+I.trash+'</button></div>').join('')+'</div>':'')+'</div>';}
function kitMe(){
  return '<div class="ex">'+EXOS.map(x=>'<button type="button" class="sit" data-act="exo" data-id="'+x.id+'"><span class="e">'+I[x.ico]+'</span><span class="tx"><b>'+esc(x.t)+'</b><span>'+esc(x.s)+'</span></span><span class="chev">'+I.chev+'</span></button>').join('')+'</div>'+
    '<div class="comfort">'+esc(WORDS[(dayIdx(WORDS.length)+5)%WORDS.length])+'</div>';
}
function viewExo(){
  const x=EXOS.find(e=>e.id===state.exo);if(!x){state.view='kit';return viewKit();}
  let body='';
  if(x.id==='breath')body='<div class="breath"><div class="orbwrap" aria-hidden="true"><div class="orb"></div></div><div class="txt">Le cercle grandit : inspirez. Il rétrécit : expirez.</div></div>';
  else if(x.id==='trois'){const t=D().three.slice().reverse().slice(0,5);body='<div class="card"><div class="field"><input type="text" id="t1" aria-label="Première chose" maxlength="'+LIM.three+'" placeholder="Une" autocomplete="off"></div><div class="field"><input type="text" id="t2" aria-label="Deuxième chose" maxlength="'+LIM.three+'" placeholder="Deux" autocomplete="off"></div><div class="field"><input type="text" id="t3" aria-label="Troisième chose" maxlength="'+LIM.three+'" placeholder="Trois" autocomplete="off"></div><button type="button" class="btn primary" data-act="threeadd" style="align-self:flex-start">'+I.star+'Garder</button></div>'+(t.length?'<div class="log">'+t.map(e=>'<div class="logi"><span class="d">'+esc(fmtDate(e.date))+'</span><span>'+esc(e.items.join(' · '))+'</span></div>').join('')+'</div>':'');}
  else if(x.id==='deposer')body='<div class="card"><textarea id="dep" aria-label="Ce qui pèse (rien n’est gardé)" maxlength="10000" style="min-height:200px" placeholder="Tout ce qui tourne…"></textarea><button type="button" class="btn primary" data-act="depose" style="align-self:flex-start">'+I.wind+'Déposer et effacer</button><p class="hint">Rien n’est enregistré : quand vous appuyez, le texte disparaît. Pour être écouté·e, utilisez « Déposer » sur l’accueil.</p></div>';
  else if(x.id==='droit')body='<div class="perm">'+PERMISSIONS.map(p=>'<div><b>'+esc(p[0])+'</b> '+esc(p[1])+'</div>').join('')+'</div>';
  else if(x.id==='minute')body='<div class="card green" style="align-items:center"><div class="ring" style="width:200px;height:200px"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" style="fill:none;stroke:var(--surface);stroke-width:12"/><circle id="arc" cx="60" cy="60" r="52" style="fill:none;stroke:var(--green);stroke-width:12;stroke-linecap:round;stroke-dasharray:326.7;stroke-dashoffset:0"/></svg><div class="num" id="tnum" style="font-size:44px">'+Math.floor(state.timer.left/60)+':'+pad(state.timer.left%60)+'</div></div><button type="button" class="btn primary" data-act="minute">'+(state.timer.running?I.stop+'Arrêter':I.timer+'Une minute')+'</button></div>';
  else if(x.id==='appeler')body='<div class="log">'+HELP.map(h=>'<div class="logi"><b>'+esc(h.t)+'</b>'+(h.tel?'<span style="font-size:22px">'+tel(h.tel)+'</span>':'<a href="'+h.url+'" target="_blank" rel="noopener noreferrer" style="font-size:18px;font-weight:800">'+esc(h.label)+' '+I.ext+'<span class="sr"> (nouvel onglet)</span></a>')+'<span class="hint">'+esc(h.d)+'</span></div>').join('')+'</div>';
  return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">'+esc(x.t)+'</h1>'+(x.how?'<p class="sub">'+esc(x.how)+'</p>':'')+'</div>'+body+'</main>';
}
function viewSOS(){
  return '<main id="main" tabindex="-1" class="view sosview" style="padding-top:14px"><header class="bar"><button type="button" class="back" data-act="go" data-view="today">'+I.back+'Sortir</button></header>'+
    '<div><h1 class="t1" style="color:var(--coral)">Là, maintenant.</h1><p class="sub">Rien à réussir. Juste passer la vague. Dans l’ordre :</p></div>'+
    '<div class="sosstep"><span class="n">1</span><div class="tx"><b>Sécurité</b><span>Écartez ce qui peut blesser. Laissez de la place. Ne retenez pas si ce n’est pas nécessaire.</span></div></div>'+
    '<div class="sosstep"><span class="n">2</span><div class="tx"><b>Moins</b><span>Moins de mots, moins de lumière, moins de bruit. Une phrase, calme, répétée : « Je suis là. On attend. »</span></div></div>'+
    '<div class="sosstep"><span class="n">3</span><div class="tx"><b>Vous</b><span>Pieds au sol. Respirez avec le cercle. Vous avez le droit de sortir trente secondes si tout est sûr.</span></div></div>'+
    '<div class="breath"><div class="orbwrap" aria-hidden="true"><div class="orb"></div></div><div class="txt">Inspirez… expirez…</div></div>'+
    '<div class="sosstep"><span class="n">4</span><div class="tx"><b>Après</b><span>Un verre d’eau. Un geste doux si accepté. On ne rejoue pas la scène. On ne punit pas une vague. Plus tard, notez ce qui a précédé.</span></div></div>'+
    '<div class="emg"><b>Si quelqu’un est en danger</b><span>Urgences : '+tel('144')+' · Police : '+tel('117')+'</span><span>Si c’est vous qui n’en pouvez plus : La Main Tendue '+tel('143')+', jour et nuit.</span></div>'+
    '<button type="button" class="btn primary wide" data-act="go" data-view="today">C’est passé. Revenir.</button><p class="hint">Ce que vous venez de faire, c’est exactement ce qu’un professionnel aurait fait.</p></main>';
}
/* ---------- moi ---------- */
function moodDots(){const d=D();const out=[];for(let i=13;i>=0;i--){const dt=new Date(Date.now()-i*86400000);const k=dt.getFullYear()+'-'+pad(dt.getMonth()+1)+'-'+pad(dt.getDate());const m=d.moods[k];out.push('<i class="'+(m!==undefined?'m'+m:'')+'"></i>');}const n=out.filter(x=>x.indexOf('class="m')>0).length;return '<div class="mooddots" role="img" aria-label="Humeur notée '+n+' jour'+(n>1?'s':'')+' sur les quatorze derniers">'+out.join('')+'</div>';}
function viewMe(){
  const d=D();const T=TIERS[tier()];const ld=lastDepot();const ql=questionsLeft();
  return '<main id="main" tabindex="-1" class="view" style="padding-top:0"><div class="band thin bleed" style="background-image:url('+HERO+');background-position:right 70%"><h1 class="t1">Moi</h1></div><p class="sub">Votre formule, vos dépôts, votre humeur, vos réglages.</p>'+
    '<div class="card"><span class="label">Ma formule</span><div class="row" style="align-items:center;justify-content:space-between">'+badge()+'<span class="price" style="font-family:var(--font-display);font-size:22px">'+esc(T.p)+' CHF <small style="font-size:13px;color:var(--muted);font-family:var(--font-ui);font-weight:700">'+esc(T.per)+'</small></span></div>'+
    (tier()==='free'?'<p class="hint">La dose, la boîte à outils, le SOS, trois dépôts écoutés et la première étape. '+depotsLeft()+' dépôt'+(depotsLeft()>1?'s':'')+' restant'+(depotsLeft()>1?'s':'')+'.</p>':tier()==='parcours'?'<p class="hint">Dépôts sans limite, dose personnalisée, les 24 étapes, Mon évolution, photolangage.</p>':'<p class="hint">Tout Le parcours, le mot d’Antonio chaque mois et deux questions par mois.</p>')+
    '<button type="button" class="btn'+(tier()==='free'?' primary':'')+'" data-act="go" data-view="plans" style="align-self:flex-start">'+I.tag+(tier()==='free'?'Voir les formules':'Changer de formule')+'</button></div>'+
    (can('antonio')?'<button type="button" class="sit" data-act="go" data-view="antonio"><span class="e">'+I.mail+'</span><span class="tx"><b>Mes échanges avec Antonio</b><span>'+(DEMO?'Démonstration · exemples de mot et de réponse':'Prochain mot le '+esc(nextLetterDate())+' · '+ql+' question'+(ql>1?'s':''))+'</span></span><span class="chev">'+I.chev+'</span></button>':'<button type="button" class="sit" data-act="upgrade" data-f="antonio"><span class="e">'+I.lock+'</span><span class="tx"><b>Avec Antonio</b><span>Un mot chaque mois, deux questions, réponse sous 48 h</span></span><span class="chev">'+I.chev+'</span></button>')+
    '<button type="button" class="sit" data-act="go" data-view="depots"><span class="e">'+I.drop+'</span><span class="tx"><b>Mes dépôts</b><span>'+(d.depots.length?d.depots.length+' dépôt'+(d.depots.length>1?'s':'')+' · dernier le '+esc(fmtDate(ld.date)):'Aucun dépôt pour l’instant')+'</span></span><span class="chev">'+I.chev+'</span></button>'+
    '<div class="card"><span class="label">Mon humeur, quatorze jours</span>'+moodDots()+'<p class="hint">Un carré par jour, du plus ancien au plus récent. C’est ce qu’Antonio regardera en premier dans la formule Avec Antonio.</p></div>'+
    '<div class="menu-list"><button type="button" data-act="onboard">'+I.swap+'<span>Modifier le début (prénom, âge, situation)</span><span class="chev">'+I.chev+'</span></button><button type="button" data-act="go" data-view="data">'+I.download+'<span>Vos données · recommencer depuis le début</span><span class="chev">'+I.chev+'</span></button><button type="button" data-act="go" data-view="about">'+I.info+'<span>Pourquoi cet espace</span><span class="chev">'+I.chev+'</span></button>'+
    (SITE?'<a href="confidentialite.html">'+I.shield+'<span>Politique de confidentialité</span><span class="chev">'+I.chev+'</span></a><a href="conditions.html">'+I.note+'<span>Conditions générales</span><span class="chev">'+I.chev+'</span></a>':'')+'</div></main>';
}
function viewDepots(){
  const list=D().depots.slice().reverse();
  return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">Mes dépôts</h1><p class="sub">Tout ce que vous avez déposé, et ce que vous avez reçu. Ça reste ici, sur votre appareil.'+(can('antonio')?(DEMO?' Dans la version complète, Antonio ne lira que les dépôts cochés « Partager » ; dans cette version de test, rien ne lui est transmis.':' Seuls les dépôts cochés « Partager » sont lus par Antonio.'):'')+'</p></div>'+
    (list.length?'<div class="depots">'+list.map(x=>depotHtml(x,false)).join('')+'</div>':'<div class="card"><p>Rien encore. Le premier dépôt se fait sur l’accueil, dans « Écouté · Déposer ».</p><button type="button" class="btn primary" data-act="go" data-view="today" style="align-self:flex-start">'+I.drop+'Déposer</button></div>')+'</main>';
}
/* ---------- formules ---------- */
function cell(v){if(v===true)return '<td>'+I.check+'<span class="sr">inclus</span></td>';if(v===false)return '<td class="no"><span aria-hidden="true">—</span><span class="sr">non inclus</span></td>';return '<td class="tx">'+esc(v)+'</td>';}
function viewPlans(){
  const t=tier();const peek=!D().onboarded;
  const btn=k=>{
    const name=TIERS[k].t;
    if(peek)return k==='free'?'<button type="button" class="btn wide" data-act="onboard">Commencer gratuitement</button>':'<button type="button" class="btn'+(k==='parcours'?' primary':'')+' wide" data-act="tier" data-v="'+k+'" aria-label="Choisir la formule '+esc(name)+'">Choisir</button>';
    return t===k?'<button type="button" class="btn wide" disabled>'+I.check+'Votre formule</button>':'<button type="button" class="btn'+(k==='parcours'?' primary':'')+' wide" data-act="tier" data-v="'+k+'" aria-label="'+(k==='free'?'Revenir à la formule Découverte':'Choisir la formule '+esc(name))+'">'+(k==='free'?'Revenir à Découverte':'Choisir')+'</button>';
  };
  return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">Les formules</h1><p class="sub">Sans engagement, résiliable à tout moment. Ce que chaque formule donne, concrètement :</p></div>'+
    '<div class="card"><table class="cmp"><caption class="sr">Ce que comprend chaque formule</caption><thead><tr><th scope="col"><span class="sr">Ce qui est compris</span></th><th scope="col">Découverte<br>0</th><th scope="col" class="best">Parcours<br>14/mois</th><th scope="col">Antonio<br>49/mois</th></tr></thead><tbody>'+FEATURES.map(f=>'<tr><th scope="row">'+esc(f[0])+'</th>'+cell(f[1])+cell(f[2])+cell(f[3])+'</tr>').join('')+'</tbody></table></div>'+
    '<div class="plans">'+
    '<div class="plan"><h2 class="t2">Découverte</h2><div class="price">0 CHF <small>pour toujours</small></div><p>Pour voir si l’espace vous parle : la dose chaque jour, toute la boîte à outils, trois dépôts écoutés, la première étape.</p>'+btn('free')+'</div>'+
    '<div class="plan best"><span class="pill sun">Le plus choisi</span><h2 class="t2">Le parcours</h2><div class="price">14 CHF <small>par mois</small></div><p>Les cadenas disparaissent : déposez autant que nécessaire avec la phrase-miroir, recevez votre dose à vous, suivez les 24 étapes et voyez votre chemin sur six mois.</p>'+btn('parcours')+'</div>'+
    '<div class="plan"><h2 class="t2">Avec Antonio</h2><div class="price">49 CHF <small>par mois</small></div><p>Tout Le parcours, et un éducateur qui vous connaît : <b>chaque mois, Antonio lit les dépôts que vous choisissez de lui partager et vous écrit un mot personnel</b>, qui s’affiche en haut de votre accueil. <b>Deux fois par mois, vous lui posez une question</b> ; il répond par écrit sous 48 heures. Jamais de prénom d’enfant, jamais de diagnostic.</p>'+btn('antonio')+'</div></div>'+
    '<p class="hint">Version de test : choisir une formule change l’interface pour la montrer. Aucun paiement n’est demandé et rien n’est transmis à Antonio. Les prix sont ceux prévus pour la Suisse.'+(SITE?' <a href="conditions.html">Conditions générales</a>':'')+'</p></main>';
}
function sheetUpgrade(sheetIn){
  const u=UP[state.upFeat]||UP.parcours;const anto=state.upFeat==='antonio';
  return '<div class="backdrop" data-act="sheet-close"></div><div class="sheet'+(sheetIn?' in':'')+'" role="dialog" aria-modal="true" aria-labelledby="up-title" tabindex="-1"><div class="sheet-in"><div class="grab"></div><span class="label">'+I.lock+' Fait partie '+(anto?'de la formule Avec Antonio':'du Parcours')+'</span><h2 id="up-title" class="t2" style="font-family:var(--font-display);font-weight:500">'+esc(u.t)+'</h2><p>'+esc(u.s)+'</p>'+
    (anto?'':'<button type="button" class="btn primary wide" data-act="tier" data-v="parcours">Le parcours · 14 CHF/mois</button>')+
    '<button type="button" class="btn'+(anto?' primary':'')+' wide" data-act="tier" data-v="antonio">Avec Antonio · 49 CHF/mois</button>'+
    '<button type="button" class="btn ghost wide" data-act="sheet-close">Plus tard</button><p class="hint" style="text-align:center">Version de test : la formule s’active sans paiement, pour voir l’interface.</p></div></div>';
}
/* ---------- avec Antonio ---------- */
function viewAntonio(){
  const d=D();const L=d.letters.slice().reverse();const Q=d.questions.slice().reverse();const ql=questionsLeft();
  return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">Mes échanges avec Antonio</h1><p class="sub">Un éducateur qui vous connaît, sans que vous ayez à tout raconter : il lit ce que vous choisissez de partager.</p></div>'+
    (DEMO?'<div class="demo-note"><b>Démonstration.</b> Dans cette version de test, rien n’est transmis à Antonio : vos questions et vos dépôts cochés restent sur votre appareil, et le mot comme la réponse affichés ici sont des exemples. Les vrais échanges commenceront à l’ouverture des abonnements.</div>':'')+
    '<div class="card sun"><div class="kv"><span>Le mot d’Antonio</span><span>'+(DEMO?'le 1er de chaque mois':esc(nextLetterDate()))+'</span></div><div class="kv"><span>Dépôts cochés ce mois</span><span>'+sharedThisMonth()+'</span></div><div class="kv"><span>Questions restantes ce mois</span><span>'+ql+' / '+Q_PER_MONTH+'</span></div><p class="hint">Pour partager un dépôt, cochez « Partager avec Antonio » sous le dépôt. Sans dépôt partagé, le mot d’Antonio se base sur votre humeur et vos étapes.</p></div>'+
    (ql>0?'<div class="card"><label class="label" for="qdraft">Poser une question à Antonio</label><textarea id="qdraft" maxlength="'+LIM.q+'" placeholder="Une situation, une décision, un doute… Sans prénom." style="min-height:90px">'+esc(state.qdraft)+'</textarea><button type="button" class="btn primary" data-act="qsend" style="align-self:flex-start">'+I.send+(DEMO?'Enregistrer ma question':'Envoyer · réponse sous 48 h')+'</button></div>':'<div class="card"><span class="label">Poser une question à Antonio</span><p>Vos deux questions du mois sont posées. Vous pourrez en poser à nouveau le '+esc(nextLetterDate())+'. En attendant, « Déposer » reste ouvert.</p></div>')+
    (Q.length?Q.map(q=>'<div class="qa"><span class="st">'+esc(fmtDate(q.date))+(q.answer?' · réponse d’Antonio le '+esc(fmtDate(q.answeredAt)):(DEMO?' · gardée sur votre appareil, non transmise (version de test)':' · en attente, réponse sous 48 h'))+'</span><p class="q">'+esc(q.text)+'</p>'+(q.answer?'<p class="a">'+esc(q.answer)+'</p>':'')+'</div>').join(''):'')+
    ((DEMO||!Q.length)?'<div class="qa"><span class="st">Exemple de question et de réponse</span><p class="q">'+esc(QA_EXAMPLE.q)+'</p><p class="a">'+esc(QA_EXAMPLE.a)+'</p></div>':'')+
    '<div><span class="label">Les mots d’Antonio</span></div>'+
    (L.length?L.map((l,i)=>'<button type="button" class="letter" data-act="letter" data-i="'+(d.letters.length-1-i)+'"><div class="from"><span class="av" aria-hidden="true">A</span><div><b>'+esc(MONTHS_FR[Number(l.date.slice(5,7))-1])+'</b><span>'+esc(fmtDate(l.date))+'</span></div></div><p>'+esc(l.text.split('\n')[0])+'</p></button>').join(''):'<button type="button" class="letter" data-act="letter" data-i="-1"><div class="from"><span class="av" aria-hidden="true">A</span><div><b>Exemple de mot</b><span>'+(DEMO?'Démonstration':'Votre premier arrive le '+esc(nextLetterDate()))+'</span></div></div><p>'+esc(LETTER_EXAMPLE.split('\n')[0])+'</p><span class="hint">Lire l’exemple '+I.chev+'</span></button>')+'</main>';
}
function viewLetter(){
  const i=state.letter;const l=i>=0?D().letters[i]:null;const txt=l?l.text:LETTER_EXAMPLE;
  return '<main id="main" tabindex="-1" class="view"><div><span class="label">'+(l?'Le mot d’Antonio · '+esc(fmtDate(l.date)):'Exemple · à quoi ressemblera le mot d’Antonio')+'</span><h1 class="t1">'+(D().me?'Bonjour '+esc(D().me)+',':'Bonjour,')+'</h1></div>'+
    '<div class="letter">'+txt.split('\n').map(p=>'<p>'+esc(p)+'</p>').join('')+'<div class="from" style="margin-top:6px"><span class="av" aria-hidden="true">A</span><div><b>Antonio Company</b><span>éducateur social</span></div></div></div>'+
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
  const where=state.sample?'Quand vous déposez, votre texte est envoyé sans votre nom pour écrire la réponse ; l’application ne le garde nulle part ailleurs que sur cet appareil.':'Dans cette version, rien de ce que vous écrivez n’est envoyé : ni à un serveur, ni à Antonio.';
  return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">Vos données</h1><p class="sub">Tout reste sur cet appareil : vos dépôts, vos points, vos notes. '+where+'</p></div>'+
    '<div class="card green"><span class="label">Bon à savoir</span><p class="hint">Vos dépôts ne sont pas protégés par un mot de passe : si vous prêtez ce téléphone, verrouillez-le ou effacez d’abord vos notes. Et si vous effacez les données de votre navigateur, elles sont perdues : il n’y a pas de copie ailleurs.</p></div>'+
    '<div class="card"><span class="label">Recommencer depuis le début</span><p class="hint">Efface tout ce qui est sur cet appareil (prénom, dépôts, étapes, points) et rouvre l’écran d’accueil et le questionnaire de départ. Utile pour faire tester l’app à une autre personne sur votre téléphone.</p>'+(state.confirmReset?'<div class="confirm" role="alert"><span>Effacer tout le contenu sur cet appareil ?</span><div class="row"><button type="button" class="btn danger" data-act="reset-yes">Oui, effacer</button><button type="button" class="btn" data-act="reset-no">Annuler</button></div></div>':'<button type="button" class="btn danger" data-act="reset" style="align-self:flex-start">'+I.trash+'Tout effacer et recommencer</button>')+'</div>'+
    consentCard()+
    '<div class="card"><span class="label">Pour les tests</span><p class="hint">Vous pouvez aussi ouvrir l’app avec <b>?nouveau</b> à la fin de l’adresse : elle repart de zéro sur cet appareil.</p></div></main>';
}
function viewAbout(){
  return '<main id="main" tabindex="-1" class="view"><img class="medal small" src="'+MEDAL+'" alt="Logo de Parent Écouté, Parent Éclairé : une goutte tombe sur un étang, dans la lumière d’une forêt." width="120" height="120" loading="lazy" decoding="async"><div><h1 class="t1" style="text-align:center">Pourquoi cet espace</h1></div><div class="card"><p class="quote">« Parce qu’un parent écouté devient un parent éclairé. Et un parent éclairé devient un parent confiant, aligné et pleinement acteur du bien-être de son enfant. »</p></div>'+
    '<div class="card"><span class="label">Qui parle</span><p>Antonio Company, éducateur social et formateur à la pratique professionnelle. Placé en famille d’accueil à dix ans, il a connu ce que change la présence d’une personne qui écoute. Père de trois enfants, vingt ans auprès de personnes en situation de handicap et de leurs familles. En 2025, il a imaginé « Parent Écouté, Parent Éclairé » : un accompagnement de six mois pour les parents, puis un espace d’écoute ouvert à tout parent en chemin. Cette application en est la forme qui tient dans la poche, avec lui derrière, pour celles et ceux qui le souhaitent.</p></div>'+
    '<div class="card green"><span class="label">Ce que ce n’est pas</span><ul class="list"><li>Pas un diagnostic ni une thérapie : pour ça, le pédiatre, le médecin, les thérapeutes.</li><li>Pas une urgence : en danger, le '+tel('144')+' ; à bout, le '+tel('143')+'.</li><li>Pas un remplaçant des gens : un pont vers eux.</li></ul></div><p class="hint">Version de test.</p></main>';
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
    '<div class="field"><span class="flabel" id="ob-l-w">Ce qui pèse le plus en ce moment (plusieurs possibles)</span><div class="chips" role="group" aria-labelledby="ob-l-w">'+WEIGHTS.map(x=>w(x[0],x[1])).join('')+'</div></div>'+
    '<p class="hint">Pas de prénom pour votre enfant : rien de lui ne doit quitter votre poche.</p>'+
    '<button type="button" class="btn primary wide" data-act="ob-done">'+I.sun2+(d.onboarded?'Enregistrer':'Recevoir ma première dose')+'</button></div></div>';
}
function mdLite(t){const lines=String(t).split('\n');let out='';let inl=false;for(const raw of lines){const l=raw.replace(/\*\*(.+?)\*\*/g,'$1');if(/^\s*[-•]\s+/.test(l)){if(!inl){out+='<ul class="list">';inl=true;}out+='<li>'+esc(l.replace(/^\s*[-•]\s+/,''))+'</li>';continue;}if(inl){out+='</ul>';inl=false;}if(/^#{1,3}\s/.test(l))out+='<p style="font-weight:800;margin-top:6px;color:var(--green)">'+esc(l.replace(/^#{1,3}\s*/,''))+'</p>';else if(l.trim())out+='<p>'+esc(l)+'</p>';}if(inl)out+='</ul>';return out;}

/* ---------- actions ---------- */
function nav(v){state.prev=state.view;state.view=v;state.sheet=null;state.confirmReset=false;}
function handle(act,d,el){
  const data=D();
  switch(act){
    case 'peek-plans':state.prev=null;state.sheet=null;state.view='plans';break;
    case 'onboard':state.sheet='onboard';break;
    case 'ob':data[d.k]=d.v;save();break;
    case 'obw':{const i=data.weights.indexOf(d.v);if(i>=0)data.weights.splice(i,1);else data.weights.push(d.v);save();break;}
    case 'ob-done':{const m=document.getElementById('ob-me');data.me=clean(m?m.value:data.me,LIM.me);if(!data.start)data.start=todayIso();const first=!data.onboarded;data.onboarded=true;state.sheet=null;save();if(first)state.view='today';break;}
    case 'go':if(d.view==='photo'&&!can('parcours')){openUpgrade('photo');break;}nav(d.view);if(d.view!=='kit'&&d.view!=='exo')stopTimer();break;
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
    case 'tier':if(!TIERS[d.v])return;data.tier=d.v;state.sheet=null;save();if(!data.onboarded){state.view='today';state.sheet='onboard';break;}toast('Version de test : formule « '+TIERS[d.v].t+' » activée.');break;
    case 'step':{const i=Number(d.i);if(stepLocked(i)){openUpgrade('parcours');break;}state.step=i;nav('step');break;}
    case 'stepdone':data.steps[d.i]=!data.steps[d.i];save();if(data.steps[d.i])toast('Étape faite. Une par semaine, c’est le bon rythme.');break;
    case 'evotime':if(d.v!=='t1'&&!can('parcours')){openUpgrade('evo');break;}state.evoTime=d.v;break;
    case 'evosave':{if(state.evoTime!=='t1'&&!can('parcours')){openUpgrade('evo');break;}const rec={date:todayIso()};EVO_SCALES.forEach(s=>{const x=document.querySelector('[data-evo="'+s.id+'"]');rec[s.id]=x?Number(x.value):5;});EVO_OPEN.forEach(o=>{const x=document.querySelector('[data-evoopen="'+o[0]+'"]');rec[o[0]]=x?clean(x.value,LIM.evo):'';});const first=state.evoTime==='t1'&&!data.evo.t1;data.evo[state.evoTime]=rec;save();if(first){nav('today');render();window.scrollTo(0,0);toast('Point de départ enregistré. Votre dose vous attend.');return;}render();toast('Point enregistré. Ce qui bouge est à vous.');return;}
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
    case 'threeadd':{const items=['t1','t2','t3'].map(id=>clean(document.getElementById(id).value,LIM.three)).filter(Boolean);if(!items.length){fieldErr('t1','Une chose suffit : écrivez-la ici.');return;}data.three.push({date:todayIso(),items});save();render();toast('Gardé.');return;}
    case 'depose':{const t=document.getElementById('dep');if(t)t.value='';toast('Déposé. Ce n’est plus que sur vous.');return;}
    case 'letter':state.letter=Number(d.i);nav('letter');break;
    case 'qsend':{const t=clean(state.qdraft,LIM.q);if(t.length<10){fieldErr('qdraft','Écrivez votre question en une phrase ou deux (dix caractères au moins).');return;}if(questionsLeft()===0){toast('Vos deux questions du mois sont posées.');return;}const risk=RISK.test(t);data.questions.push({id:'q'+Date.now(),date:todayIso(),text:t});state.qdraft='';save();render();toast(risk?'Si c’est urgent, n’attendez pas : 143 ou 144, maintenant.':(DEMO?'Gardée sur votre appareil. Version de test : elle n’est pas transmise à Antonio.':'Envoyée. Antonio répond par écrit sous 48 heures.'));return;}
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
try{if(/[?&](nouveau|reset|new)\b/.test(location.search)){localStorage.removeItem(KEY);if(history.replaceState)history.replaceState(null,'',location.pathname);}}catch(e){}
state.data=load();
state.inClaude=!SITE&&!!(window.claude&&typeof window.claude.use==='function');
if(SITE)state.sample=false;
/* Sur le site, l'accueil est déjà écrit dans la page (affichage immédiat, lisible sans JavaScript par les moteurs) : on le garde tel quel. */
if(app.getAttribute('data-prerender')==='intro'&&!D().onboarded){state.lastKey='intro';app.removeAttribute('data-prerender');}
else render();
if(!SITE)(async()=>{try{if(state.inClaude){const s=await window.claude.use('sample');state.sample=s||false;}else state.sample=false;}catch(e){state.sample=false;}if(D().onboarded||state.view==='plans')render();})();
})();
