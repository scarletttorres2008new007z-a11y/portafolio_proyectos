import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

// nombre: [url, capturas extra al hacer scroll, texto del botón que abre la intro]
// Uso: node tools/capturas.mjs            (todos)
//      node tools/capturas.mjs cafe-flores (solo los que nombres)
const sitios = {
  'descubre-el-salvador': ['https://descubreelsalvador.netlify.app/', true],
  'cielo-de-flores': ['https://cielo-de-flores-demo.netlify.app/', true, 'Quiero mi café'],
  'cafe-flores': ['https://cafeflores.netlify.app/', true, 'Quiero mi café'],
  'aeod-landing': ['https://aeodlanding.netlify.app/', true],
  'aeod-backend': ['https://web-production-12fb4.up.railway.app', false],
  'aeod-gestion': ['https://web-production-12fb4.up.railway.app/gestion', false],
  'casa-petalo': ['https://floristerialanding.netlify.app/', true],
  'lumiere-cine': ['https://lumiere-cine-sv.netlify.app/', true],
  'navaja-barber': ['https://lanavajacut.netlify.app/', true],
  'el-caballero': ['https://elcaballerobarber.netlify.app/', true],
};

const ocultar = `
  netlify-drawer, [id^="netlify"], iframe[src*="netlify"], iframe[title*="Netlify"] { display:none !important; }
`;
async function limpiar(page) {
  await page.addStyleTag({ content: ocultar }).catch(() => {});
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('body *')) {
      if (el.children.length < 4 && /Powered by Netlify/i.test(el.textContent || '')) {
        let n = el;
        while (n.parentElement && getComputedStyle(n).position !== 'fixed') n = n.parentElement;
        (getComputedStyle(n).position === 'fixed' ? n : el).remove();
      }
    }
  }).catch(() => {});
}
async function irA(page, frac) {
  await page.evaluate(f => {
    const h = document.documentElement.scrollHeight - innerHeight;
    window.scrollTo({ top: Math.max(0, h * f), behavior: 'instant' });
  }, frac);
  await page.waitForTimeout(1800);
}

mkdirSync('assets/shots', { recursive: true });
const browser = await chromium.launch();
const solo = process.argv.slice(2);
for (const [nombre, [url, extra, intro]] of Object.entries(sitios)) {
  if (solo.length && !solo.includes(nombre)) continue;
  for (const movil of [false, true]) {
    const page = await browser.newPage(movil
      ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
      : { viewport: { width: 1440, height: 900 } });
    try { await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }); }
    catch (e) { console.log('aviso', nombre, e.message); }
    await page.waitForTimeout(9000);
    await limpiar(page);
    const sufijo = movil ? '-movil' : '';
    if (extra && !movil) {
      if (intro) {
        await page.getByText(intro).first().click({ timeout: 5000 }).catch(e => console.log('aviso', nombre, e.message));
        await page.waitForTimeout(3000);
      }
      for (const [k, f] of [[2, .22], [3, .45], [4, .7]]) {
        await irA(page, f);
        await limpiar(page);
        await page.screenshot({ path: `assets/shots/${nombre}-${k}.jpg`, type: 'jpeg', quality: 78 });
      }
    }
    await irA(page, 0);
    await page.mouse.wheel(0, 1).catch(() => {});
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);
    await limpiar(page);
    await page.screenshot({ path: `assets/shots/${nombre}${sufijo}.jpg`, type: 'jpeg', quality: 78 });
    console.log('ok', nombre, sufijo);
    await page.close();
  }
}
await browser.close();
