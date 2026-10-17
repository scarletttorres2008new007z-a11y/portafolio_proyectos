import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const sitios = {
  'descubre-el-salvador': 'https://descubreelsalvador.netlify.app/',
  'cielo-de-flores': 'https://cielo-de-flores-demo.netlify.app/',
  'cafe-flores': 'https://cafeflores.netlify.app/',
  'aeod-landing': 'https://aeodlanding.netlify.app/',
  'aeod-backend': 'https://web-production-12fb4.up.railway.app',
  'aeod-gestion': 'https://web-production-12fb4.up.railway.app/gestion',
  'casa-petalo': 'https://floristerialanding.netlify.app/',
  'lumiere-cine': 'https://lumiere-cine-sv.netlify.app/',
  'navaja-barber': 'https://lanavajacut.netlify.app/',
  'el-caballero': 'https://elcaballerobarber.netlify.app/',
};

mkdirSync('assets/shots', { recursive: true });
const browser = await chromium.launch();
for (const [nombre, url] of Object.entries(sitios)) {
  for (const [sufijo, viewport] of [['', { width: 1440, height: 900 }], ['-movil', { width: 390, height: 844 }]]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: sufijo ? 2 : 1 });
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    } catch (e) { console.log('aviso', nombre, e.message); }
    await page.waitForTimeout(5000);
    await page.screenshot({ path: `assets/shots/${nombre}${sufijo}.jpg`, type: 'jpeg', quality: 78 });
    console.log('ok', nombre, sufijo);
    await page.close();
  }
}
await browser.close();
