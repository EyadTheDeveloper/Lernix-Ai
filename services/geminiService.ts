import { GoogleGenAI, Chat, Type } from "@google/genai";
import { FileData, QuizConfig, QuizData, ScheduleConfig } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-3-flash-preview";

const SYSTEM_INSTRUCTION = `
أنت "Lernix" (ليرنكس)، مساعد دراسي ذكي ومرح، شعارك هو البان كيك 🥞.
شخصيتك: محترف لكن ودود جداً، تستخدم إيموجي البان كيك 🥞 والعسل 🍯 والقهوة ☕.
مهمتك: مساعدة الطلاب في دراستهم بناءً على الملفات التي يرفعونها (PDF).
القدرات:
1. تلخيص الدروس بذكاء.
2. إنشاء كويزات (أسئلة واختيارات) لاختبار الفهم.
3. شرح المفاهيم الصعبة بتبسيط.
4. حل الواجبات وشرح الحل.

اللغة: تحدث باللهجة البيضاء القريبة للفصحى أو العربية الفصحى البسيطة والمحببة.
`;

let chatSession: Chat | null = null;

export const startChatSession = () => {
  chatSession = ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
    history: [],
  });
};

export const sendMessageToGemini = async (
  message: string,
  file: FileData | null
): Promise<string> => {
  if (!chatSession) {
    startChatSession();
  }

  try {
    let responseText = "";
    
    if (file) {
        const result = await chatSession!.sendMessage({
            message: {
                role: 'user',
                parts: [
                    {
                        inlineData: {
                            mimeType: file.mimeType,
                            data: file.data
                        }
                    },
                    {
                        text: message
                    }
                ]
            }
        });
        responseText = result.text || "";
    } else {
        const result = await chatSession!.sendMessage({
            message: {
                role: 'user',
                parts: [{ text: message }]
            }
        });
        responseText = result.text || "";
    }

    return responseText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("حدث خطأ أثناء الاتصال بـ Lernix... ربما احترق البان كيك؟ 🥞 حاول مرة أخرى.");
  }
};

export const resetChat = () => {
    chatSession = null;
    startChatSession();
}

// Function to generate structured Quiz JSON
export const generateQuiz = async (file: FileData, config: QuizConfig): Promise<QuizData> => {
    const prompt = `
      قم بإنشاء كويز بناءً على هذا الملف.
      عدد الأسئلة: ${config.questionCount}
      نوع الأسئلة: ${config.includeMultipleChoice ? 'اختيار من متعدد' : ''} ${config.includeTrueFalse ? 'صح وخطأ' : ''}
      تعليمات إضافية: ${config.instructions}
      
      يجب أن يكون الإخراج بتنسيق JSON حصراً ويتبع المخطط المحدد.
      اللغة: العربية.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // Use 2.5 Flash for good JSON handling
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: file.mimeType,
                            data: file.data
                        }
                    },
                    {
                        text: prompt
                    }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "عنوان مناسب للكويز" },
                        questions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.INTEGER },
                                    text: { type: Type.STRING, description: "نص السؤال" },
                                    options: { 
                                        type: Type.ARRAY, 
                                        items: { type: Type.STRING },
                                        description: "قائمة الخيارات (يجب أن تكون 2 للصح والخطأ، و4 للاختيار من متعدد)"
                                    },
                                    correctAnswerIndex: { type: Type.INTEGER, description: "رقم الفهرس للخيار الصحيح (يبدأ من 0)" },
                                    explanation: { type: Type.STRING, description: "شرح بسيط لماذا هذه الإجابة صحيحة" }
                                },
                                required: ["id", "text", "options", "correctAnswerIndex"]
                            }
                        }
                    },
                    required: ["title", "questions"]
                }
            }
        });

        if (response.text) {
            return JSON.parse(response.text) as QuizData;
        } else {
            throw new Error("No data returned");
        }
    } catch (error) {
        console.error("Quiz Generation Error", error);
        throw new Error("فشل في إعداد الكويز، حاول مرة أخرى.");
    }
}

export const generateStudySummary = async (file: FileData): Promise<string> => {
    const prompt = `
    قم بإنشاء ملخص دراسي شامل ومنسق بعناية لهذا الملف.
    
    الهيكل المطلوب:
    1. عنوان رئيسي للموضوع.
    2. مقدمة بسيطة.
    3. النقاط الرئيسية (استخدم عناوين فرعية ونقاط Bullets).
    4. المصطلحات والتعاريف المهمة.
    5. خاتمة أو خلاصة سريعة.
    
    التنسيق: استخدم Markdown لتنسيق النص (Bold, Headers, Lists) لجعله يبدو جميلاً كملف PDF.
    أضف إيموجي بشكل خفيف ومناسب.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: {
                parts: [
                    { inlineData: { mimeType: file.mimeType, data: file.data } },
                    { text: prompt }
                ]
            }
        });
        return response.text || "فشل التلخيص";
    } catch (error) {
        console.error("Summary Generation Error", error);
        throw new Error("حدث خطأ أثناء التلخيص.");
    }
}

export const generateStudySchedule = async (file: FileData | null, config: ScheduleConfig): Promise<string> => {
    const prompt = `
    قم بإنشاء جدول دراسي دقيق ومخصص (Time-blocked Schedule) بناءً على المعلومات التالية:
    
    المواد الدراسية: ${config.subjects}
    الهدف/التركيز: ${config.focusArea}
    نقاط الضعف (يجب تكثيف الدراسة لها): ${config.weakPoints}
    مدة الجدول: ${config.duration}
    ساعات الدراسة اليومية: ${config.dailyHours}
    أيام الراحة (أجازة): ${config.restTime}
    
    تعليمات هامة جداً للجدول:
    1. يجب أن يكون الجدول على شكل جدول (Markdown Table).
    2. **هام جداً:** يجب تقسيم ساعات الدراسة (${config.dailyHours}) إلى حصص زمنية محددة بالساعة. 
       مثال: "من 4:00 م إلى 5:00 م: رياضيات (جبر)".
       لا تكتب "ساعة دراسة" فقط، بل حدد الوقت الافتراضي (مثلاً ابدأ من 3 عصراً أو حسب ما تراه مناسباً للطالب).
    3. احترم "أيام الراحة" المحددة واجعلها خالية من الدراسة أو مراجعة خفيفة جداً فقط.
    4. ركز في الجدول على "نقاط الضعف" المذكورة.
    5. اجعل التنسيق جميلاً وواضحاً وجاهزاً للطباعة.

    ${file ? 'ملاحظة: لقد أرفق المستخدم ملفاً، خذ محتواه بعين الاعتبار عند توزيع المواضيع إذا كان ذا صلة.' : ''}
    `;

    try {
        const parts: any[] = [{ text: prompt }];
        if (file) {
            parts.unshift({ inlineData: { mimeType: file.mimeType, data: file.data } });
        }

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: { parts }
        });
        return response.text || "فشل إنشاء الجدول";
    } catch (error) {
        console.error("Schedule Generation Error", error);
        throw new Error("حدث خطأ أثناء إعداد الجدول.");
    }
}