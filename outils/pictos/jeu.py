# Le jeu d'images de l'outil « D'abord, ensuite » et de la routine.
# Chaque ligne : identifiant | fichier d'origine (Mulberry Symbols, dossier EN) | libellé sous l'image | ce qu'on dit après « D'abord » ou « ensuite »
# Les groupes donnent l'ordre d'affichage. Une image peut figurer dans plusieurs groupes.
IMAGES = """
reveil | wake_up_,_to | Se réveiller | se réveiller
habiller | get_dressed_,_to | S’habiller | s’habiller
chaussettes | socks | Chaussettes | les chaussettes
chaussures | trainers | Chaussures | les chaussures
manteau | coat | Manteau | le manteau
bonnet | bobble_hat | Bonnet | le bonnet
coiffer | brush_hair_,_to | Se coiffer | se coiffer
lunettes | glasses | Lunettes | les lunettes
petitdej | breakfast_3 | Petit-déjeuner | le petit-déjeuner
sac | school_bag | Sac d’école | le sac d’école
manger | eat_1_,_to | Manger | manger
boire | drink_,_to | Boire | boire
repas | dinner | Repas | le repas
legumes | vegetables | Légumes | les légumes
fruit | fruit | Fruit | le fruit
dessert | cake_slice | Dessert | le dessert
gouter | biscuits | Goûter | le goûter
eau | water | Verre d’eau | le verre d’eau
table | set_table_,_to | Mettre la table | mettre la table
cuisiner | cook_,_to | Cuisiner | cuisiner
dents | brush_teeth_,_to | Dents | les dents
mains | wash_hands_,_to | Mains | se laver les mains
visage | wash_face_,_to | Visage | se laver le visage
douche | shower_1_,_to | Douche | la douche
bain | bathe_,_to | Bain | le bain
shampoing | shampoo_hair_,_to | Shampoing | le shampoing
secher | dry_hair_,_to | Sécher les cheveux | sécher les cheveux
toilettes | toilet | Toilettes | les toilettes
couche | nappy | Couche | changer la couche
ongles | clip_nails_,_to | Ongles | couper les ongles
moucher | tissues | Se moucher | se moucher
medicament | medicine | Médicament | le médicament
creme | cream_ointment | Crème | la crème
ecole | school | École | l’école
bus | bus | Bus | le bus
voiture | car | Voiture | la voiture
ceinture | seat_belt | Ceinture | la ceinture
train | train | Train | le train
magasin | shop | Magasin | le magasin
docteur | doctor_1a | Docteur | le docteur
dentiste | dentist_1a | Dentiste | le dentiste
coiffeur | haircut | Coiffeur | le coiffeur
logo | speech_language_therapist_1a | Logopédie | la logopédie
physio | physio_therapist_1a | Physio | la physio
ergo | occupational_therapist_1a | Ergo | l’ergo
piscine | swim_,_to | Piscine | la piscine
visite | visit_,_to | Visite | la visite
devoirs | write_,_to | Devoirs | les devoirs
attendre | wait_,_to | Attendre | attendre
jouer | play_,_to | Jouer | jouer
puzzle | jigsaw_puzzle | Puzzle | le puzzle
briques | lego | Briques | les briques
pate | playdough | Pâte à modeler | la pâte à modeler
dessiner | draw_,_to | Dessiner | dessiner
coloriage | colouring_book | Coloriage | le coloriage
peinture | paint_childs | Peinture | la peinture
ballon | ball | Ballon | le ballon
bulles | bubbles_blow | Bulles | les bulles
poupee | doll | Poupée | la poupée
voitures | car_toy | Petites voitures | les petites voitures
chanter | sing_,_to | Chanter | chanter
danser | dance_,_to | Danser | danser
instrument | musical_instruments | Instrument | l’instrument
dehors | go_outside_,_to | Dehors | aller dehors
place | play_area | Place de jeux | la place de jeux
toboggan | slide | Toboggan | le toboggan
balancoire | swing_,_to | Balançoire | la balançoire
velo | bicycle | Vélo | le vélo
trampoline | trampoline | Trampoline | le trampoline
courir | run_,_to | Courir | courir
sauter | jump_,_to | Sauter | sauter
sable | sand_pit | Bac à sable | le bac à sable
promenade | walk_,_to | Promenade | la promenade
cheval | ride_horse_,_to | Cheval | le cheval
luge | sledge | Luge | la luge
piquenique | picnic | Pique-nique | le pique-nique
jardin | back_garden | Jardin | le jardin
tablette | touch_screen | Tablette | la tablette
tele | childrens_tv | Dessin animé | le dessin animé
jeuvideo | computer_game | Jeu vidéo | le jeu vidéo
telephone | iPhone | Téléphone | le téléphone
musique | music | Musique | la musique
histoire | read_book_,_to | Histoire | l’histoire
glace | ice_cream | Glace | la glace
gateau | cake | Gâteau | le gâteau
chocolat | chocolate_bar | Chocolat | le chocolat
chien | dog | Chien | le chien
chat | cat | Chat | le chat
chatouilles | tickle_,_to | Chatouilles | les chatouilles
autocollants | stickers | Autocollants | les autocollants
surprise | present | Surprise | la surprise
calin | hug_,_to | Câlin | le câlin
doudou | teddy_bear | Doudou | le doudou
couverture | blanket | Couverture | la couverture
pause | relax_,_to | Pause | la pause
coincalme | sit_in_beanbag_,_to | Coin calme | le coin calme
casque | headphones | Casque | le casque
silence | quiet | Silence | le silence
repos | rest_,_to | Se reposer | se reposer
ranger | tidy_up_,_to | Ranger | ranger
pyjama | pyjamas | Pyjama | le pyjama
veilleuse | lamp | Veilleuse | la veilleuse
eteindre | turn_off_light_switch_,_to | Éteindre | éteindre la lumière
dodo | single_bed | Dodo | le dodo
"""

GROUPES = [
    ('matin', 'Matin', 'reveil toilettes visage habiller chaussettes petitdej dents coiffer lunettes chaussures manteau bonnet sac ecole'),
    ('repas', 'Repas', 'mains table manger boire repas legumes fruit dessert gouter eau petitdej cuisiner'),
    ('toilette', 'Toilette', 'dents mains visage douche bain shampoing secher toilettes couche ongles moucher medicament creme'),
    ('sorties', 'Sorties', 'ecole sac devoirs bus voiture ceinture train magasin docteur dentiste coiffeur logo physio ergo piscine visite attendre'),
    ('jouer', 'Jeux', 'jouer puzzle briques pate dessiner coloriage peinture poupee voitures ballon bulles chanter danser instrument ranger'),
    ('dehors', 'Dehors', 'dehors promenade place toboggan balancoire sable velo trampoline ballon courir sauter cheval piscine luge piquenique jardin'),
    ('plaisirs', 'Plaisirs', 'histoire musique tablette tele jeuvideo telephone bulles chatouilles calin chien chat glace gateau chocolat autocollants surprise'),
    ('calme', 'Calme', 'pause coincalme casque silence repos couverture doudou calin musique histoire attendre'),
    ('soir', 'Soir', 'ranger bain douche pyjama dents toilettes histoire calin doudou veilleuse eteindre dodo'),
]
# La routine du soir (dans cet ordre).
ROUTINE = 'bain pyjama dents histoire calin dodo'.split()


def images():
    out = []
    for l in IMAGES.strip().split('\n'):
        p = [x.strip() for x in l.split('|')]
        assert len(p) == 4, l
        out.append(p)
    return out


def verifie():
    im = images()
    ids = [x[0] for x in im]
    assert len(ids) == len(set(ids)), 'identifiant en double'
    vus = set()
    for g, nom, liste in GROUPES:
        l = liste.split()
        assert len(l) == len(set(l)), 'doublon dans ' + g
        for i in l:
            assert i in ids, 'inconnu dans ' + g + ' : ' + i
            vus.add(i)
    seuls = [i for i in ids if i not in vus]
    assert not seuls, 'sans groupe : ' + ' '.join(seuls)
    for i in ROUTINE:
        assert i in ids, i
    return im


if __name__ == '__main__':
    im = verifie()
    print(len(im), 'images,', len(GROUPES), 'groupes')
    for g, nom, liste in GROUPES:
        print(' ', nom, len(liste.split()))


def js():
    """Les lignes à placer dans eparts/p2-content.js."""
    im = verifie()
    q = lambda t: "'" + t.replace("\\", "\\\\").replace("'", "\\'") + "'"
    out = ["/* Les images de « D'abord, ensuite » et de la routine : des Mulberry Symbols de Steve Lee (licence CC BY-SA 4.0), rangées dans img/pictos/<identifiant>.svg.",
           "   Chaque image : son identifiant, le mot écrit dessous, et ce qu'on dit après « D'abord » ou « ensuite ». La liste est tenue dans build/pictos/jeu.py. */",
           'const PICTOS=[' + ','.join('[' + q(x[0]) + ',' + q(x[2]) + ',' + q(x[3]) + ']' for x in im) + '];',
           "/* Les groupes donnent l'ordre des images à l'écran. Une image peut figurer dans plusieurs groupes. */",
           'const PICTO_GROUPES=[' + ','.join('[' + q(g) + ',' + q(n) + ',' + q(l) + ']' for g, n, l in GROUPES) + '];',
           'const ROUTINE_DEF=[' + ','.join(q(i) for i in ROUTINE) + '];']
    return '\n'.join(out) + '\n'


def credits():
    im = verifie()
    l = ['# Images de « D’abord, ensuite » et de la routine', '',
         str(len(im)) + ' images tirées des Mulberry Symbols, © 2018-2026 Steve Lee, partagées sous licence Creative Commons Attribution, Partage dans les mêmes conditions 4.0 (CC BY-SA 4.0).',
         'Source : https://github.com/mulberrysymbols/mulberry-symbols (dossier `EN`, relevé le 16 novembre 2026). Site : https://mulberrysymbols.org',
         'Licence : https://creativecommons.org/licenses/by-sa/4.0/deed.fr',
         'Les fichiers ont été renommés et allégés (outil svgo), sans retouche du dessin : chaque image a été comparée à son original. Elles restent sous la licence CC BY-SA 4.0.', '',
         '| Fichier | Mot affiché | Fichier d’origine |', '|---|---|---|']
    for x in im:
        l.append('| ' + x[0] + '.svg | ' + x[2] + ' | ' + x[1] + '.svg |')
    return '\n'.join(l) + '\n'
