/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { EXERCISES } from "./src/data/exercises";
import { UserAssessment, Routine, Exercise } from "./src/types";
import { createClient } from "@supabase/supabase-js";

// Load environment variables (.env)
dotenv.config();

const PORT = 3000;
const app = express();

app.use(express.json());

// Initialize GoogleGenAI SDK correctly with server-only key and appropriate request headers
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// Initialize Supabase Client on Server Side for dynamic exercise fetching
const rawSupabaseUrl = process.env.VITE_SUPABASE_URL || "";
const rawSupabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "";

const cleanSupabaseUrl = rawSupabaseUrl.trim().replace(/^['"]|['"]$/g, "");
const cleanSupabaseKey = rawSupabaseKey.trim().replace(/^['"]|['"]$/g, "");

const isUrlValid = /^https?:\/\//i.test(cleanSupabaseUrl);

const supabase = cleanSupabaseUrl && cleanSupabaseKey && !cleanSupabaseUrl.includes("your-project") && isUrlValid
  ? createClient(cleanSupabaseUrl, cleanSupabaseKey)
  : null;

// Helper to fetch active exercises dynamically from Supabase
async function getActiveExercises(): Promise<Exercise[]> {
  if (!supabase) {
    return EXERCISES;
  }
  try {
    const { data, error } = await supabase
      .from("exercises")
      .select("*")
      .eq("is_active", true);

    if (error) {
      console.warn("Supabase fetch error in backend:", error.message);
      return EXERCISES;
    }

    if (data && data.length > 0) {
      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        area: row.area,
        duration: row.duration,
        instructions: Array.isArray(row.instructions) ? row.instructions : JSON.parse(row.instructions || "[]"),
        commonMistakes: Array.isArray(row.common_mistakes) ? row.common_mistakes : JSON.parse(row.common_mistakes || "[]"),
        contraindications: Array.isArray(row.contraindications) ? row.contraindications : JSON.parse(row.contraindications || "[]"),
        locationStyle: row.location_style,
        type: row.exercise_type,
        imageUrl: row.image_url || undefined,
      }));
    }
  } catch (err) {
    console.warn("Exception fetching active exercises from Supabase backend:", err);
  }
  return EXERCISES;
}

// Helper to find a fallback rule-based routine
function generateRuleBasedRoutine(assessment: UserAssessment, currentExercises: Exercise[] = EXERCISES): Routine {
  const { painArea, location, availableTime, redFlags } = assessment;

  // Under red-flag scenarios, safety notice is active (handled on frontend, but we guarantee safe output)
  const isRedFlag = redFlags && redFlags.length > 0;

  // We filter by area first
  let eligible = currentExercises.filter((ex) => {
    // If red flags exist, only select very gentle eye or breathing exercises
    if (isRedFlag) {
      return ex.type === "breathing" || ex.type === "eye";
    }
    // Match current pain area or general body area
    return ex.area.toLowerCase() === painArea.toLowerCase();
  });

  if (eligible.length === 0) {
    // general default exercises
    eligible = currentExercises.filter((ex) => ex.area === "Cổ vai gáy" || ex.area === "Đầu");
  }

  if (eligible.length === 0) {
    eligible = EXERCISES.filter((ex) => ex.area === "Cổ vai gáy" || ex.area === "Đầu");
  }

  // Filter based on location style (Floor exercises shouldn't be recommended in a Desk context)
  if (location === "Văn phòng") {
    eligible = eligible.filter((ex) => ex.locationStyle !== "Floor");
  }

  // Sort exercises to pick a diverse subset up to the availableTime limit
  // Each exercise duration is around 30-60s. We fit as many as we can into availableTime * 60 seconds
  const maxSeconds = availableTime * 60;
  let selected: Exercise[] = [];
  let currentSeconds = 0;

  for (const ex of eligible) {
    if (currentSeconds + ex.duration <= maxSeconds) {
      selected.push(ex);
      currentSeconds += ex.duration;
    }
  }

  // Just in case selected is empty, pick at least 2 exercises
  if (selected.length === 0) {
    selected = eligible.slice(0, 2);
  }

  const durationMin = Math.ceil(currentSeconds / 60) || 1;

  return {
    id: `routine_fallback_${Date.now()}`,
    name: `Cấu Trình ${durationMin} Phút Chữa Cháy Vùng ${painArea || "Cơ Thể"}`,
    description: `Đơn kê dãn cơ cấp tốc được Cô Em tinh lọc kỹ càng giúp giải tháo mệt mỏi vùng ${painArea || "cơ thể"} tức thì!`,
    exercises: selected,
    rationale: `Đồng nghiệp AI đang bận làm báo cáo slide thuyết trình cho sếp rồi! Đích thân Cô Em tự bốc dán giáo án chuẩn chỉnh này cho vùng ${painArea || "mỏi mệt"} của sếp, cứ yên tâm tập theo cho dãn gân giãn cốt nha!`
  };
}

// API endpoint to generate a personalized routine using Gemini AI (with a robust rule-based fallback!)
app.post("/api/generate-routine", async (req, res) => {
  try {
    const { assessment, skipHistory } = req.body;
    
    if (!assessment) {
      return res.status(400).json({ error: "Missing user assessment data" });
    }

    const { painArea, painScore, location, availableTime, redFlags } = assessment as UserAssessment;

    // Fetch dynamic exercises from Supabase
    const currentExercises = await getActiveExercises();

    // Safety Gate: Check for red flags
    if (redFlags && redFlags.length > 0) {
      const fallback = generateRuleBasedRoutine(assessment, currentExercises);
      return res.json({
        routine: fallback,
        safetyNotice: true,
        message: "Phát hiện triệu chứng báo động! Cô Em khuyên bạn nên thăm khám y khoa ngay lập tức. Chúng tớ đã tạo một bài thở cực nhẹ nhàng để xoa dịu tinh thần bạn lúc này thôi nhé.",
      });
    }

    if (!ai) {
      console.warn("GEMINI_API_KEY is not defined. Falling back to rule-based routine builder.");
      const fallback = generateRuleBasedRoutine(assessment, currentExercises);
      return res.json({ routine: fallback, modelUsed: "Fallback Rule-Based" });
    }

    // Build lists of eligible exercise IDs
    const eligibleExercises = currentExercises.filter((ex) => {
      // In Office, skip Floor style
      if (location === "Văn phòng" && ex.locationStyle === "Floor") return false;
      return true;
    });

    const itemsText = eligibleExercises.map(ex => {
      return `- ID: "${ex.id}" | Tên: "${ex.name}" | Vùng: "${ex.area}" | Thời lượng: ${ex.duration}s | Kiểu: "${ex.type}" | Mô tả: "${ex.description}"`;
    }).join("\n");

    const skipHistoryText = skipHistory && skipHistory.length > 0
      ? `Danh sách các bài tập quá khứ người dùng hay Skip hoặc báo Đau (hãy CỐ GẮNG TRÁNH các ID này): [${skipHistory.join(", ")}]`
      : "";

    const userPrompt = `
Hãy tạo một routine phục hồi sức khỏe văn phòng cá nhân hóa với các thông số sau:
- Vùng bị đau mỏi chính: "${painArea}" (Điểm đau: ${painScore}/10)
- Bối cảnh vị trí tập: "${location}"
- Thời lượng rảnh rỗi tối đa: ${availableTime} phút (vui lòng chọn các động tác có tổng thời lượng (duration) gộp lại KHÔNG được vượt quá ${availableTime * 60} giây)
${skipHistoryText}

VUI LÒNG CHỌN DANH SÁCH BÀI TẬP TỪ CÁC ĐỘNG TÁC CHÍNH QUY SAU:
${itemsText}

Yêu cầu đầu ra:
1. Trả về đúng định dạng JSON tuân thủ schema quy định.
2. Đặt cho routine một cái tên thật hóm hỉnh, dễ thương, mặn mà bằng tiếng Việt (ví dụ: "3 Phút Trị Nghiến Răng Sếp Giục", "Cứu Vai Tròn Trị Trọng Trách Deadline").
3. Viết lời giải thích (rationale) siêu tâm lý, mang đậm tính "đồng nghiệp cô em trà sữa" chiều chuộng bạn văn phòng, mặn mà hóm hỉnh.
4. Tổng thời lượng các động tác được chọn không vượt quá ${availableTime * 60} giây. Hãy xếp từ 2 đến 6 bài tập tùy thời gian rảnh.
`;

    const systemInstruction = 
      "Bạn là 'Cô Em Công Sở' - một đồng nghiệp số quốc dân cực kỳ xinh xắn, tinh nghịch, mặn mà và sâu sắc. " +
      "Nhiệm vụ của bạn là thiết lập danh sách bài tập phục hồi cho bạn đồng nghiệp văn phòng đang mệt mỏi. " +
      "Bạn luôn nói chuyện duyên dáng, có chút 'nhây nhựa' hài hước hóm hỉnh, nhưng cực kỳ chân thành và biết chăm sóc người khác bằng trái tim. " +
      "Bạn chỉ lấy động tác có ID nằm trong danh sách được cung cấp. Tuyệt đối không tự bịa ra ID hoặc động tác mới không có trong danh sách.";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["routineName", "routineDescription", "exerciseIds", "rationaleText"],
          properties: {
            routineName: {
              type: Type.STRING,
              description: "Tên routine tiếng Việt dễ thương mặn mà"
            },
            routineDescription: {
              type: Type.STRING,
              description: "Mô tả ngắn dí dỏm"
            },
            exerciseIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Danh sách các exercise ID được chọn từ danh sách chính quy"
            },
            rationaleText: {
              type: Type.STRING,
              description: "Lời khuyên cá nhân hóa, ấm áp, hóm hỉnh từ Cô Em giải thích lý do thiết kế bài này"
            }
          }
        }
      }
    });

    const dataText = response.text;
    if (!dataText) {
      throw new Error("No response text from Gemini");
    }

    const parsed = JSON.parse(dataText.trim());

    // Validate the chosen exercise IDs
    const matchedExercises: Exercise[] = [];
    if (Array.isArray(parsed.exerciseIds)) {
      parsed.exerciseIds.forEach((id: string) => {
        const found = currentExercises.find(e => e.id === id);
        if (found) {
          matchedExercises.push(found);
        }
      });
    }

    // Fallback if AI returned no valid exercise IDs
    if (matchedExercises.length === 0) {
      console.warn("AI returned no matching exercise IDs. Triggering fallback.");
      const fallback = generateRuleBasedRoutine(assessment, currentExercises);
      return res.json({ routine: fallback, modelUsed: "Fallback due to empty selection" });
    }

    const durationSeconds = matchedExercises.reduce((sum, ex) => sum + ex.duration, 0);

    const routine: Routine = {
      id: `ai_${Date.now()}`,
      name: parsed.routineName || `Routine Phục Hồi Đặc Biệt Cho Vùng ${painArea}`,
      description: parsed.routineDescription || `Routine cứu sinh thiết kế bởi Cô Em thương mến`,
      exercises: matchedExercises,
      rationale: parsed.rationaleText || `Bởi vì bữa nay bạn báo mệt mỏi rã rời ở miền ${painArea}, Cô Em sắm sửa tức tốc bài này để xả bớt nặng gánh lo âu nha!`
    };

    return res.json({
      routine,
      modelUsed: "gemini-3.5-flash"
    });

  } catch (error: any) {
    console.error("Routine generation engine error:", error);
    // Bulletproof Fallback
    try {
      const fallbackAssessment = req.body.assessment || {
        painArea: "Cổ vai gáy",
        painScore: 5,
        location: "Văn phòng",
        availableTime: 3,
        redFlags: []
      };
      const activeExs = await getActiveExercises();
      const fallback = generateRuleBasedRoutine(fallbackAssessment, activeExs);
      return res.json({
        routine: fallback,
        errorHint: error.message || "An error occurred with Gemini API",
        modelUsed: "Fallback Rule-Based"
      });
    } catch (fallbackErr) {
      return res.status(500).json({ error: "Critically failed to build routine" });
    }
  }
});

// Setup Express+Vite integration based on development vs production runtime environment
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development server with Vite middleware integration
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production build static serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Cô Em Công Sở Webserver] running on http://localhost:${PORT}`);
  });
}

initServer().catch((err) => {
  console.error("Server cluster boot crash state:", err);
});
