import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Crisp, beautiful SVG for Bharat Saathi (BS)
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="50%" stop-color="#1E293B" />
      <stop offset="100%" stop-color="#090D16" />
    </linearGradient>
    <linearGradient id="saffronGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF9933" />
      <stop offset="100%" stop-color="#F57C00" />
    </linearGradient>
    <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#138808" />
      <stop offset="100%" stop-color="#0D5C05" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047" />
      <stop offset="100%" stop-color="#EAB308" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="10" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background base -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />

  <!-- Outer Ring Accent -->
  <circle cx="256" cy="256" r="210" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="8" />

  <!-- Tricolor dynamic curved ribbon -->
  <path d="M 120 180 Q 256 120 392 180" fill="none" stroke="url(#saffronGrad)" stroke-width="18" stroke-linecap="round" />
  <path d="M 110 256 Q 256 210 402 256" fill="none" stroke="#FFFFFF" stroke-opacity="0.95" stroke-width="12" stroke-linecap="round" />
  <path d="M 120 332 Q 256 392 392 332" fill="none" stroke="url(#greenGrad)" stroke-width="18" stroke-linecap="round" />

  <!-- Central Ashoka Chakra & Shield Core -->
  <circle cx="256" cy="256" r="92" fill="#0F172A" stroke="url(#goldGrad)" stroke-width="6" filter="url(#glow)" />
  <circle cx="256" cy="256" r="76" fill="none" stroke="#38BDF8" stroke-width="3" stroke-dasharray="6,4" />
  <circle cx="256" cy="256" r="28" fill="#1E3A8A" stroke="#FFFFFF" stroke-width="3" />

  <!-- 24 Chakra spokes -->
  ${Array.from({ length: 24 }).map((_, i) => {
    const angle = (i * 360) / 24;
    const rad = (angle * Math.PI) / 180;
    const x1 = 256 + 28 * Math.cos(rad);
    const y1 = 256 + 28 * Math.sin(rad);
    const x2 = 256 + 74 * Math.cos(rad);
    const y2 = 256 + 74 * Math.sin(rad);
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#60A5FA" stroke-width="2.5" />`;
  }).join('\n  ')}

  <!-- Center Star Hub -->
  <circle cx="256" cy="256" r="10" fill="#F8FAFC" />

  <!-- Bottom Brand Text Monogram 'भारत' subtle accent -->
  <text x="256" y="440" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="34" letter-spacing="4" fill="#E2E8F0">BHARAT SAATHI</text>
  <text x="256" y="468" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="18" letter-spacing="6" fill="#F59E0B">CITIZEN PORTAL</text>
</svg>`;

// Maskable icon with 15% safe padding
const maskableSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="saffronGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF9933" />
      <stop offset="100%" stop-color="#F57C00" />
    </linearGradient>
    <linearGradient id="greenGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#138808" />
      <stop offset="100%" stop-color="#0D5C05" />
    </linearGradient>
    <linearGradient id="goldGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047" />
      <stop offset="100%" stop-color="#EAB308" />
    </linearGradient>
  </defs>

  <!-- Full-bleed background -->
  <rect width="512" height="512" fill="url(#bgGrad2)" />

  <!-- Scaled down to 76% in center for safe circle/squircle masking -->
  <g transform="translate(61.44, 61.44) scale(0.76)">
    <circle cx="256" cy="256" r="210" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="8" />
    <path d="M 120 180 Q 256 120 392 180" fill="none" stroke="url(#saffronGrad2)" stroke-width="20" stroke-linecap="round" />
    <path d="M 110 256 Q 256 210 402 256" fill="none" stroke="#FFFFFF" stroke-opacity="0.95" stroke-width="14" stroke-linecap="round" />
    <path d="M 120 332 Q 256 392 392 332" fill="none" stroke="url(#greenGrad2)" stroke-width="20" stroke-linecap="round" />
    <circle cx="256" cy="256" r="92" fill="#0F172A" stroke="url(#goldGrad2)" stroke-width="7" />
    <circle cx="256" cy="256" r="76" fill="none" stroke="#38BDF8" stroke-width="3" stroke-dasharray="6,4" />
    <circle cx="256" cy="256" r="28" fill="#1E3A8A" stroke="#FFFFFF" stroke-width="3" />
    ${Array.from({ length: 24 }).map((_, i) => {
      const angle = (i * 360) / 24;
      const rad = (angle * Math.PI) / 180;
      const x1 = 256 + 28 * Math.cos(rad);
      const y1 = 256 + 28 * Math.sin(rad);
      const x2 = 256 + 74 * Math.cos(rad);
      const y2 = 256 + 74 * Math.sin(rad);
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#60A5FA" stroke-width="2.5" />`;
    }).join('\n    ')}
    <circle cx="256" cy="256" r="10" fill="#F8FAFC" />
    <text x="256" y="440" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="36" letter-spacing="4" fill="#E2E8F0">BHARAT SAATHI</text>
  </g>
</svg>`;

async function run() {
  const svgPath = path.join(publicDir, 'icon.svg');
  fs.writeFileSync(svgPath, svgContent);
  console.log('Saved icon.svg');

  const svgBuffer = Buffer.from(svgContent);
  const maskableSvgBuffer = Buffer.from(maskableSvgContent);

  await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Generated pwa-192x192.png');

  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Generated pwa-512x512.png');

  await sharp(maskableSvgBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Generated pwa-maskable-512x512.png');

  await sharp(svgBuffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  await sharp(svgBuffer).resize(32, 32).png().toFile(path.join(publicDir, 'favicon.ico'));
  console.log('Generated favicon.ico');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
