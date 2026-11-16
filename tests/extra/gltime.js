const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--headless=new'] });
  const page = await (await b.newContext({ ignoreHTTPSErrors: true })).newPage();
  await page.goto('https://localhost:8443/build/doux/lab.html?v=' + Date.now()); await page.waitForTimeout(400);
  const r = await page.evaluate(() => {
    const t = []; let t0 = performance.now(); const lap = n => { const x = performance.now(); t.push(n + ' ' + (x - t0).toFixed(1)); t0 = x; };
    const cv = document.createElement('canvas'); const gl = cv.getContext('webgl', { alpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'low-power', failIfMajorPerformanceCaveat: true }); lap('contexte');
    if (!gl) return t.concat(['pas de contexte']);
    const di = gl.getExtension('WEBGL_debug_renderer_info'); const nom = di ? gl.getParameter(di.UNMASKED_RENDERER_WEBGL) : '?'; lap('nom');
    const sh = (ty, src) => { const o = gl.createShader(ty); gl.shaderSource(o, src); gl.compileShader(o); gl.getShaderParameter(o, gl.COMPILE_STATUS); return o; };
    const v = sh(gl.VERTEX_SHADER, EAU_VS); lap('vs'); const f = sh(gl.FRAGMENT_SHADER, EAU_FS); lap('fs');
    const p = gl.createProgram(); gl.attachShader(p, v); gl.attachShader(p, f); gl.linkProgram(p); const ok = gl.getProgramParameter(p, gl.LINK_STATUS); lap('lien');
    return t.concat([String(nom).slice(0, 70), 'lien ' + ok]);
  });
  console.log(r.join(' | '));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
