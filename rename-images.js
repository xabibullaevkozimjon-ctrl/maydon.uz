// my-images papkasidagi rasmlarni field-1.jpg ... field-50.jpg qilib public/img/fields ichiga ko'chiradi.
// Rasm 50 tadan kam bo'lsa, qaytadan takrorlanadi.
import fs from 'fs'
import path from 'path'
const src = 'my-images', dst = 'public/img/fields'
const files = fs.existsSync(src) ? fs.readdirSync(src).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort() : []
if (!files.length) { console.log("my-images papkasiga rasmlarni qo'ying, keyin qayta ishga tushiring."); process.exit(1) }
for (let i = 1; i <= 50; i++) fs.copyFileSync(path.join(src, files[(i - 1) % files.length]), path.join(dst, `field-${i}.jpg`))
if (fs.existsSync('dist/img/fields')) for (let i = 1; i <= 50; i++) fs.copyFileSync(path.join(dst, `field-${i}.jpg`), path.join('dist/img/fields', `field-${i}.jpg`))
console.log(`${files.length} ta rasm asosida 50 ta maydon rasmi tayyor. Sahifani yangilang.`)
