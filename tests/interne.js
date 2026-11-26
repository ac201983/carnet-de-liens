// Les essais internes : quand PEPE_INTERNE=1, chaque onglet ouvert par un essai porte l'interrupteur « interne » du site
// (sessionStorage pepe-interne = 1). Là où la fabrication l'autorise, la commande en démonstration existe alors, comme avant le 26 novembre 2026.
// Sans cet interrupteur, le site se comporte comme pour un parent : la vente est fermée, et aucune commande n'est proposée.
// Ce fichier est chargé avant l'essai :  NODE_OPTIONS="-r /chemin/interne.js" node lancement.js
if (process.env.PEPE_INTERNE === '1') {
  let pw = null; try { pw = require('playwright'); } catch (e) { }
  const pose = () => { try { sessionStorage.setItem('pepe-interne', '1'); } catch (e) { } };
  if (pw) for (const nom of ['chromium', 'firefox', 'webkit']) {
    const type = pw[nom]; if (!type || type.__interne) continue; type.__interne = true;
    const lance = type.launch.bind(type);
    type.launch = async (...a) => {
      const b = await lance(...a); const nc = b.newContext.bind(b);
      b.newContext = async (...o) => { const c = await nc(...o); await c.addInitScript(pose); return c; };
      b.newPage = async (...o) => { const c = await b.newContext(...o); return c.newPage(); };
      return b;
    };
  }
}
