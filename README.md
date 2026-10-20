# Prime Ofis — Toshkentda ofis ijarasi

React 19 · Vite · TypeScript · Leaflet · SheetJS

Qorong'i premium dizaynli ofis ijarasi sayti va unga mos boshqaruv paneli.
Xarita haqiqiy (OpenStreetMap, API kaliti kerak emas), arizalar Excelga chiqadi.

---

## Tez boshlash

```bash
npm install
npm run dev
```

- Sayt: http://localhost:5173
- Boshqaruv paneli: http://localhost:5173/admin
- Boshlang'ich parol: **`prime2026`** — ishga tushirishdan oldin almashtiring

Boshqa buyruqlar:

```bash
npm run build      # production build → dist/
npm run preview    # build'ni lokalda ko'rish
npx tsc --noEmit   # tiplarni tekshirish
```

Node 20+ kerak.

---

## ⚠️ Eng muhim narsa: arizalar qayerda saqlanadi

**Hozirgi holatda arizalar faqat o'sha brauzerda saqlanadi.**

Ya'ni mijoz o'z telefonidan ariza yuborsa, u sizning kompyuteringizdagi
boshqaruv paneliga **tushmaydi**. Chunki bu statik sayt — server yo'q, ma'lumot
hech qayerga yuborilmaydi.

Bu demo va sinov uchun yetarli, lekin haqiqiy ish uchun server kerak.
Quyida eng oson yechim — **Google Sheets**, bepul va 10 daqiqada tayyor bo'ladi.

### Google Sheets orqali ulash (tavsiya etiladi)

**1-qadam.** [sheets.new](https://sheets.new) da yangi jadval oching. Nomini
`Arizalar` qo'ying.

**2-qadam.** Yuqoridagi menyudan **Kengaytmalar → Apps Script** ni tanlang.
Ochilgan oynadagi kodni o'chirib, quyidagini qo'ying:

```javascript
// Arizalarni Google Sheets'ga yozadi va qaytarib beradi.
const SHEET = "Arizalar";
const HEADERS = ["id", "createdAt", "status", "type", "name", "phone",
                 "officeId", "date", "area", "budget", "message",
                 "utm_source", "utm_campaign", "note"];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
  if (sh.getLastRow() === 0) sh.appendRow(HEADERS);
  return sh;
}

// Sayt ariza yuborganda ishlaydi
function doPost(e) {
  const lead = JSON.parse(e.postData.contents);
  const sh = sheet_();
  sh.appendRow([
    lead.id || "L" + Date.now().toString(36).toUpperCase(),
    lead.createdAt || new Date().toISOString(),
    lead.status || "new",
    lead.type || "", lead.name || "", lead.phone || "",
    lead.officeId || "", lead.date || "", lead.area || "",
    lead.budget || "", lead.message || "",
    (lead.utm && lead.utm.utm_source) || "",
    (lead.utm && lead.utm.utm_campaign) || "",
    lead.note || "",
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Boshqaruv paneli ro'yxatni so'raganda ishlaydi
function doGet() {
  const sh = sheet_();
  const rows = sh.getDataRange().getValues().slice(1);
  const leads = rows.map(function (r) {
    return {
      id: String(r[0]), createdAt: String(r[1]), status: r[2] || "new",
      type: r[3], name: r[4], phone: String(r[5]),
      officeId: r[6] || undefined, date: r[7] || undefined,
      area: r[8] || undefined, budget: r[9] || undefined,
      message: r[10] || undefined,
      utm: { utm_source: r[11], utm_campaign: r[12] },
      note: r[13] || undefined, page: "/",
    };
  });
  return ContentService
    .createTextOutput(JSON.stringify(leads))
    .setMimeType(ContentService.MimeType.JSON);
}
```

**3-qadam.** O'ng yuqoridagi **Deploy → New deployment** tugmasini bosing.

- Type: **Web app**
- Execute as: **Me**
- Who has access: **Anyone**

**Deploy** bosing, ruxsat so'rasa tasdiqlang. Chiqqan `https://script.google.com/...`
havolasini nusxalang.

**4-qadam.** `src/data/config.ts` faylida:

```ts
api: {
  offices: null,
  buildings: null,
  leads: "https://script.google.com/macros/s/.../exec",  // ← shu yerga
}
```

Tamom. Endi:

- Mijoz telefonidan yuborgan ariza to'g'ridan-to'g'ri Google Sheets'ga tushadi
- Boshqaruv paneli o'sha jadvaldan o'qiydi — qaysi kompyuterdan kirsangiz ham ko'rinadi
- Jadvalning o'zi ham Excel: **Fayl → Yuklab olish → .xlsx**

> **Eslatma:** ulanmaguningizcha boshqaruv panelidagi "Sozlamalar" bo'limi bu
> haqda ogohlantirib turadi — bu ataylab, chunki arizalar yo'qolib ketishini
> bilmay qolish eng yomoni.

---

## Boshqaruv paneli

`/admin` manzilida. Kirish paroli `src/data/config.ts` da.

### Nima qila oladi

| Imkoniyat | Izoh |
|---|---|
| Arizalarni ko'rish | Yangi / Tasdiqlangan / Rad etilgan bo'limlari |
| Tasdiqlash va rad etish | Bir bosishda, holati darhol o'zgaradi |
| Qidirish | Ism, telefon yoki ID bo'yicha |
| Menejer izohi | Har bir arizaga eslatma yozish |
| Excelga saqlash | **Hamma** arizani bitta faylga |
| Exceldan yuklash | Eski faylni qaytarib yuklab, birlashtirish |
| Ofislar ro'yxati | Butun inventar, band/bo'sh holati bilan |

### Excel qanday ishlaydi

Bu qismni alohida tushuntiray, chunki siz aynan shuni so'ragandingiz.

**"Excelga saqlash"** tugmasi har safar **barcha** arizalarni yozadi — bugungisini
ham, kechagisini ham. Ya'ni yangi fayl eskisining **o'rnini bosadi**, yonida
turmaydi. Shuning uchun har kuni bitta tugma bossangiz, doim to'liq ro'yxat
qo'lingizda bo'ladi.

**"Excelni yuklash"** esa teskari yo'nalish: eski faylni qaytarib yuklaysiz va
undagi arizalar hozirgi ro'yxatga **qo'shiladi**. Bu quyidagi hollarda kerak:

- Brauzer ma'lumotini tozalab yuborgan bo'lsangiz
- Boshqa kompyuterga o'tgan bo'lsangiz
- Hamkasbingiz o'z faylini sizga yuborgan bo'lsa

Takrorlanish bo'lmaydi: har bir arizaning o'z ID'si bor, bir faylni ikki marta
yuklasangiz ham ro'yxat o'zgarmaydi.

**Kundalik tartib** (serversiz ishlayotgan bo'lsangiz):

1. Ertalab panelni ochasiz
2. Kechagi faylni **"Excelni yuklash"** bilan yuklaysiz
3. Yangi arizalarni tasdiqlaysiz
4. **"Excelga saqlash"** bosasiz — hammasi bitta yangi faylda

Google Sheets'ga ulangan bo'lsangiz bu tartib umuman kerak emas — hammasi
jadvalda yig'ilib boradi.

### Parolni almashtirish

Panelning **Sozlamalar** bo'limida yangi parolni yozib "Hisoblash" bosing,
chiqqan qatorni `src/data/config.ts` dagi `passwordHash` o'rniga qo'ying.

Yoki terminalda:

```bash
node -e "console.log(require('crypto').createHash('sha256').update('yangi-parol'+'prime-ofis-2026').digest('hex'))"
```

> **Bu parol to'liq himoya emas.** Tekshiruv brauzerda bajariladi, ya'ni kod
> ichida turadi — texnikani biladigan odam uni aylanib o'tishi mumkin.
> Tasodifiy mehmonlarni to'xtatadi, xolos.
>
> Jiddiy himoya kerak bo'lsa, hostingning o'z vositasidan foydalaning:
> **Vercel** → Settings → Deployment Protection,
> **Netlify** → Site settings → Access control → Password protection,
> **Cloudflare** → Zero Trust → Access.
> Bu usulda parol serverda tekshiriladi va panel kodi umuman yuklanmaydi.

---

## Nimani qayerdan o'zgartirasiz

| Nima | Fayl |
|---|---|
| Brend nomi, telefon, Telegram, manzil | `src/data/config.ts` |
| Admin paroli | `src/data/config.ts` → `ADMIN` |
| Binolar va ofislar | `src/data/offices.ts` |
| Savol-javob, afzalliklar, sharhlar | `src/data/content.ts` |
| Ranglar, shriftlar | `src/index.css` |

Kod bilmasangiz ham `src/data/` ichidagi uch fayl yetarli.

### Yangi ofis qo'shish

```ts
{
  id: "O19",
  buildingId: "B1",
  roomId: "R-55",      // o'z hisobotingizdagi xona ID'si
  roomNo: "55",
  area: 44,
  floor: 5,
  monthlyRent: 8_400_000,
  status: "Bo'sh",     // faqat "Bo'sh" bo'lganlar saytda ko'rinadi
  available: "Hozir",
  furnished: true,
  description: "...",
  amenities: ["Wi-Fi", "Lift"],
  images: galleryFor(19),
}
```

Ofisni saytdan yashirish uchun o'chirish shart emas — `status` ni `"Band"`
qiling, ro'yxatdan chiqib ketadi.

### Haqiqiy rasm qo'yish

`images: galleryFor(19)` o'rniga:

```ts
images: ["/rasmlar/ofis-55-1.jpg", "/rasmlar/ofis-55-2.jpg"],
```

Rasmlarni `public/rasmlar/` papkasiga joylang. Hozirgi SVG chizmalar
`src/lib/art.ts` da generatsiya qilinadi.

---

## Dizayn haqida

Sayt deyarli qora-oq. **Bitta** ta'kid rang bor — jez (`#d6ae6b`) — va u faqat
bitta narsani bildiradi: **bo'sh ofis**. "Bo'sh" belgisi, yozilish tugmasi,
xaritadagi tanlangan bino, 3D binodagi yoritilgan qavat. Bezak uchun hech qayerda
ishlatilmaydi. Shuning uchun sahifaga qaraganingizda ko'z o'zi bo'sh joylarga tushadi.

### Qavatlar bo'limi

Bosh sahifadagi 3D bino — chizma emas, boshqaruv elementi. Har bir plita bitta
qavat, ma'lumot `offices.ts` dan olinadi:

- Yoritilgan qavat = bo'sh ofis bor
- Ustiga olib borsangiz = nechta ofis, qancha maydon, qancha narx
- Bosilsa = ro'yxat o'sha qavatga filtrlanadi

Inventar o'zgarsa chizma ham o'zgaradi — qo'lda yangilash shart emas.

Sarlavha va narxlar serif shriftda (Instrument Serif), qolgani Inter'da.

---

## Xarita

OpenStreetMap ma'lumoti, CARTO'ning qorong'i tiles'i. **API kalit kerak emas.**

Bino koordinatalari `src/data/offices.ts` dagi `lat` / `lng` maydonlarida.
Aniq nuqtani olish: Google Maps'da joyni o'ng tugma bilan bosing — birinchi
qatordagi ikki raqam o'sha.

Yandex yoki Google'ga o'tish: `src/components/map/LocationMap.tsx` dagi
`<TileLayer>` ni almashtiring. Markerlar va mantiq o'zgarmaydi.

---

## Analitika

Hodisalar `window.dataLayer` ga yoziladi — Google Tag Manager darhol o'qiydi.
GA4 yoki Meta Pixel uchun `src/lib/analytics.ts` dagi `track` ga bir qator qo'shasiz.

| Hodisa | Qachon |
|---|---|
| `office_view` | Ofis tafsiloti ochilganda |
| `office_filter` | Filtr o'zgarganda |
| `viewing_open` / `viewing_request` | Yozilish oynasi ochilganda / yuborilganda |
| `lead_form_submit` | "Ofis topib bering" yuborilganda |
| `phone_click`, `telegram_click`, `whatsapp_click` | Aloqa bosilganda |

UTM parametrlari sessiya davomida saqlanadi — mijoz uch sahifa o'tib ariza
qoldirsa ham, qaysi reklamadan kelgani ma'lum bo'ladi.

---

## Tuzilma

```
src/
  data/           config, binolar va ofislar, matnlar
  lib/            format, filtrlar, analitika, arizalar ombori, Excel, auth
  admin/          boshqaruv paneli (alohida bundle)
  components/
    layout/       Header, Footer, MobileBar
    home/         Hero, Stats, Buildings, Advantages, Finder, Faq, Closing
    building/     BuildingExplorer — 3D qavatlar
    offices/      OfficeCard, Filters, OfficeSection, OfficeDialog
    map/          LocationMap (Leaflet), Locations
    forms/        ViewingDialog
    ui/           Button, Field, Badge, Modal, Icon
  styles/         components.css, building.css, admin.css
```

Boshqaruv paneli alohida bundle sifatida yuklanadi — oddiy mehmon uchun
Excel kutubxonasi umuman yuklanmaydi.

---

## Deploy

Statik sayt. **Muhim:** `/admin` ishlashi uchun hosting noma'lum manzillarni
`index.html` ga yo'naltirishi kerak. Buning uchun `vercel.json` va
`public/_redirects` fayllari allaqachon tayyor.

**Vercel / Netlify:** repozitoriyni ulang, framework avtomatik aniqlanadi.
Build buyrug'i `npm run build`, papka `dist`.

**Oddiy hosting:** `npm run build` qiling, `dist/` ichidagini serverga yuklang.
Nginx uchun:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```
#   o f i s i j a r a  
 