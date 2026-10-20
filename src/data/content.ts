/** Marketing copy. Bracketed text is a placeholder the owner must replace. */

export interface Advantage {
  icon: "pin" | "doc" | "grid" | "bolt" | "chat";
  title: string;
  text: string;
}

export const ADVANTAGES: Advantage[] = [
  { icon: "pin", title: "Qulay lokatsiyalar", text: "Toshkentning ish yurituvchi to'rt tumanida." },
  { icon: "doc", title: "Shaffof shartlar", text: "Narx va maydon oldindan ko'rinadi, yashirin to'lov yo'q." },
  { icon: "grid", title: "Turli hajmlar", text: "18 m² dan 85 m² gacha — jamoangizga qarab." },
  { icon: "bolt", title: "Tez ko'chib kirish", text: "Tayyor ofislar, ortiqcha kutishsiz." },
  { icon: "chat", title: "Vositachisiz", text: "To'g'ridan-to'g'ri bino menejeri bilan gaplashasiz." },
];

export interface Testimonial {
  demo: boolean;
  text: string;
  who: string;
}

export const TESTIMONIALS: Testimonial[] = [
  { demo: true, text: "Ofis tanlash jarayoni tez kechdi. Narx va maydon oldindan aniq ko'rsatilgani yoqdi.", who: "Mijoz nomi (demo)" },
  { demo: true, text: "Ko'rishga yozilgan kuniyoq menejer bog'landi va qulay vaqtni kelishdik.", who: "Kompaniya nomi (demo)" },
  { demo: true, text: "Kichik jamoamizga mos ofisni bir necha daqiqada topdik.", who: "Mijoz nomi (demo)" },
];

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Ofisni qanday ko'rish mumkin?",
    a: "Saytdagi “Ko'rishga yozilish” tugmasini bosing yoki telefon qiling. Menejer siz bilan bog'lanib, qulay vaqtni kelishadi. [Tahrirlanadi]",
  },
  {
    q: "Ijara shartnomasi qancha muddatga tuziladi?",
    a: "Shartnoma muddati kelishuv asosida belgilanadi. [Haqiqiy shartlarni shu yerga kiriting]",
  },
  {
    q: "Kommunal xizmatlar narxga kiradimi?",
    a: "Bu bino va ofisga qarab farq qiladi. Aniq shartlar har bir ofis tafsilotida ko'rsatiladi. [Tahrirlanadi]",
  },
  {
    q: "Ofisga qachon ko'chib kirish mumkin?",
    a: "Har bir ofis kartasida “Mavjud” muddati yozilgan. Aniq sanani menejer tasdiqlaydi. [Tahrirlanadi]",
  },
  {
    q: "Yuridik shaxslar bilan shartnoma tuziladimi?",
    a: "[Ha yoki yo'q javobini shu yerga kiriting.]",
  },
];
