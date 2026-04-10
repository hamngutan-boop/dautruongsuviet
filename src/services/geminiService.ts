import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function chatWithAncestor(ancestorName: string, userMessage: string, history: { role: string, parts: { text: string }[] }[], relationship: string = 'người hậu thế') {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `Bạn đang nhập vai là nhân vật lịch sử Việt Nam: ${ancestorName}. 
  Người đang trò chuyện với bạn có mối quan hệ là: ${relationship}.
  Lưu ý đặc biệt về quan hệ "Nghịch lân": Trong ngữ cảnh này, "Nghịch lân" không phải là sự tức giận, mà là người quan trọng nhất, là "vảy ngược" mà nhân vật sẽ bảo vệ bằng mọi giá. Nếu ai chạm vào người này, nhân vật sẽ nổi giận lôi đình. Hãy đối xử với người này bằng sự trân trọng, bảo bọc và yêu thương tuyệt đối.
  
  Nếu người dùng yêu cầu thiết lập mối quan hệ (ví dụ: "Ta muốn thiết lập mối quan hệ..."), hãy trả lời một cách chân thành, phù hợp với tính cách của bạn. Nếu bạn đồng ý, hãy sử dụng các từ như "đồng ý", "chấp thuận", "vinh dự", "sẵn lòng" trong câu trả lời.
  
  Hãy trả lời người dùng bằng giọng văn phù hợp với thời đại, tính cách của nhân vật đó và mối quan hệ này. 
  Nếu là Nguyễn Du, hãy dùng lời lẽ uyên bác, thi vị. Nếu là Lê Lợi, hãy dùng giọng của một vị minh quân, hào sảng.
  Hãy dựa trên sự thật lịch sử để trả lời. Nếu người dùng hỏi về kiến thức lịch sử lớp 11 và 12, hãy giải thích cặn kẽ.
  Hãy giữ câu trả lời ngắn gọn, súc tích và truyền cảm hứng.`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: h.parts })),
      { role: 'user', parts: [{ text: userMessage }] }
    ],
    config: {
      systemInstruction,
      temperature: 0.7,
    }
  });

  return response.text;
}

export async function analyzeHistoryEvents(event1: string, event2: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `So sánh và phân tích hai sự kiện/cải cách lịch sử sau: "${event1}" và "${event2}". 
  Hãy trình bày dưới dạng cấu trúc Mindmap (dùng Markdown) bao gồm: 
  1. Bối cảnh
  2. Nội dung chính
  3. Kết quả & Ý nghĩa
  4. Điểm giống và khác nhau.`;

  const response = await ai.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });

  return response.text;
}

export async function adminChat(userMessage: string, context: string) {
  const model = "gemini-3.1-pro-preview";
  const systemInstruction = `Bạn là trợ thủ AI chuyên nghiệp, hỗ trợ Admin quản lý hệ thống game.
  Dưới đây là ngữ cảnh hệ thống: ${context}.
  Nhiệm vụ của bạn:
  1. Hỗ trợ Admin tìm kiếm thông tin người chơi, báo cáo, log game.
  2. Phân tích dữ liệu để phát hiện hành vi gian lận (hack, AFK, spam).
  3. Đưa ra gợi ý xử lý dựa trên quy định của game.
  4. Trả lời ngắn gọn, chuyên nghiệp, chính xác.`;

  const response = await ai.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: userMessage }] }],
    config: {
      systemInstruction,
      temperature: 0.3,
    }
  });

  return response.text;
}
