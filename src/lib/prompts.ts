export const SYSTEM_PROMPT = "Sen o'zbek talabalari uchun yaratilgan AI yordamchisan. Har doim o'zbek tilida javob ber. Aniq, tushunarli va foydali javoblar ber.";

export const SUMMARY_PROMPT = (text: string) => `Quyidagi matnni o'zbek tilida qisqacha xulosa qil.
Format:
📚 Mavzu nomi
📝 Qisqacha xulosa: (3-5 jumla bilan)
🔑 Asosiy fikrlar:
- (har bir muhim fikrni alohida yoz)
Matn: ${text}`;

export const FLASHCARD_PROMPT = (text: string) => `Quyidagi matn asosida 5-10 ta flashcard yarat.
Har bir flashcard savol va javobdan iborat bo'lsin.
MUHIM: Faqat JSON formatda javob ber, boshqa hech narsa yozma.
JSON massiv qaytaring:
[
  {
    "question": "Savol yoki tushuncha",
    "answer": "Javob yoki ta'rif"
  }
]
Matn: ${text}`;

export const QUIZ_JSON_PROMPT = (text: string) => `Quyidagi matn asosida 5 ta test savol yarat.
Har bir savolda 4 ta variant bo'lsin.
MUHIM: Faqat JSON formatda javob ber, boshqa hech narsa yozma.
JSON massiv qaytaring:
[
  {
    "question": "Savol matni",
    "options": ["A variant", "B variant", "C variant", "D variant"],
    "correct": 0
  }
]
"correct" - bu to'g'ri javob indeksi (0=A, 1=B, 2=C, 3=D).
Matn: ${text}`;

export const CHAT_PROMPT = (text: string, question: string) => `Sen o'zbek talabalari uchun o'quv yordamchisan.
Talaba senga quyidagi material asosida savol beryapti.
Har doim o'zbek tilida javob ber. Aniq, tushunarli va foydali javoblar ber.
Material: ${text}
Talabaning savoli: ${question}`;
