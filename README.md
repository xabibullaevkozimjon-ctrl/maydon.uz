# Maydon.uz — futbol maydonlarini onlayn band qilish

React + Tailwind CSS. Server KERAK EMAS. Tayyor ko'rinishi: dist/index.html (ikki marta bosing). Batafsil: BOSHLASH.txt

    npm install
    npm run dev

## Demo hisoblar (parol: demo123)
- 900000001 — Buyurtma beruvchi 1
- 900000003 — Buyurtma beruvchi 2
- 900000002 — Qabul qiluvchi

## RASMLAR — public/img papkasi
- public/img/fields/field-1.jpg ... field-50.jpg — maydon rasmlari (shu nomda almashtiring)
- public/img/bg-login.jpg — kirish sahifasi foni
- public/img/bg-hero.jpg — yuqoridagi katta banner foni
- public/img/default.jpg — rasm topilmasa chiqadigan rasm
Maydon nomi, manzili va narxi: src/data/fields.js (saqlangach sahifani yangilang)

## Eslatma
Ma'lumotlar bitta brauzer ichida umumiy (bir nechta oyna/tab ishlaydi). Boshqa telefon/kompyuter bilan ulashish uchun server kerak.
50 ta tayyor maydonning buyurtmalari barcha qabul qiluvchilarda ko'rinadi; o'zi qo'shgan maydon buyurtmalari faqat o'zida.

## Rasmlarni tez almashtirish
1. Rasmlaringizni `my-images` papkasiga tashlang (jpg, png, webp).
2. Terminalda: `npm run rasm`
3. Sahifani yangilang. 50 tadan kam rasm bo'lsa, takrorlanadi.

## Yangiliklar
- Kirishda avval rol tanlanadi (Buyurtma beruvchi 1 / 2 / Qabul qiluvchi), keyin Ro'yxatdan o'tish, keyin Kirish.
- Kirishda raqamning birinchi raqamlarini yozsangiz, ro'yxatdan o'tgan raqamlar chiqadi. Parol yonidagi ko'z tugmasi parolni ko'rsatadi.
- Tepada Profil: ism, telefon, parol va rasmni o'zgartirish.
- Qabul qiluvchi hamma 50 ta maydon nomi, manzili, narxi va rasmini o'zgartira oladi. O'zgarish ikkala Buyurtma beruvchida ham ko'rinadi.
