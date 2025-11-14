import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamObject } from "ai";
import { toeicAnalysisSchema } from "@/features/practice/lib/schema";

export const maxDuration = 30;

/**
 * POST /api/practice
 * Stream TOEIC question analysis with structured output
 */
export async function POST(request: Request) {
	try {
		const {
			mode,
			part,
			content,
			apiKey,
			model: modelName,
		}: {
			mode: "text" | "image";
			part: "5" | "6" | "7" | "auto";
			content: string | string[];
			apiKey: string;
			model: string;
		} = await request.json();

		// Validate API key presence
		if (!apiKey || apiKey.trim() === "") {
			return new Response(JSON.stringify({ error: "API key là bắt buộc" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		// Validate model presence
		if (!modelName || modelName.trim() === "") {
			return new Response(JSON.stringify({ error: "Model là bắt buộc" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		// Validate image content format
		if (mode === "image") {
			if (Array.isArray(content)) {
				if (content.length === 0 || content.length > 5) {
					return new Response(
						JSON.stringify({ error: "Số lượng hình ảnh phải từ 1 đến 5" }),
						{ status: 400, headers: { "Content-Type": "application/json" } },
					);
				}
				if (content.some((img) => !img || img.trim() === "")) {
					return new Response(
						JSON.stringify({ error: "Nội dung hình ảnh không hợp lệ" }),
						{ status: 400, headers: { "Content-Type": "application/json" } },
					);
				}
			} else {
				if (!content || content.trim() === "") {
					return new Response(
						JSON.stringify({ error: "Nội dung hình ảnh không hợp lệ" }),
						{ status: 400, headers: { "Content-Type": "application/json" } },
					);
				}
			}
		}

		const openrouter = createOpenRouter({ apiKey });
		const model = openrouter(modelName);

		// Build enhanced system prompt with detailed explanation structure
		let systemPrompt = `Bạn là một trợ lý TOEIC chuyên nghiệp. Nhiệm vụ của bạn là phân tích câu hỏi TOEIC Reading và cung cấp giải thích CỰC KỲ CHI TIẾT bằng tiếng Việt đơn giản, dễ hiểu.

QUAN TRỌNG - Cấu trúc giải thích cho mỗi câu hỏi:

1. PHÂN TÍCH CÂU HỎI:
   - Xác định loại câu hỏi (ngữ pháp, từ vựng, đọc hiểu)
   - Xác định điểm kiến thức cần kiểm tra
   - Dịch câu hỏi sang tiếng Việt nếu cần

2. GIẢI THÍCH ĐÁP ÁN ĐÚNG:
   - Giải thích TẠI SAO đáp án này đúng
   - Phân tích ngữ pháp chi tiết (thì, cấu trúc câu, từ loại)
   - Giải thích nghĩa của từ vựng với ví dụ cụ thể
   - Dịch câu hoàn chỉnh sang tiếng Việt

3. PHÂN TÍCH CÁC ĐÁP ÁN SAI:
   - Với MỖI đáp án sai, giải thích TẠI SAO nó sai
   - Chỉ ra lỗi ngữ pháp hoặc nghĩa không phù hợp
   - So sánh với đáp án đúng để làm rõ sự khác biệt

4. KIẾN THỨC NGỮ PHÁP:
   - Giải thích quy tắc ngữ pháp liên quan
   - Đưa ra công thức hoặc cấu trúc
   - Cho ví dụ minh họa bằng câu tiếng Anh và dịch tiếng Việt
   - Liệt kê các trường hợp đặc biệt cần lưu ý

5. TỪ VỰNG QUAN TRỌNG:
   - Liệt kê các từ vựng quan trọng trong câu
   - Giải thích nghĩa, từ loại, cách dùng
   - Đưa ra ví dụ thực tế trong ngữ cảnh TOEIC
   - Các từ đồng nghĩa hoặc trái nghĩa nếu có

6. MẸO TOEIC:
   - Cách nhận biết nhanh loại câu hỏi này
   - Chiến lược làm bài hiệu quả
   - Những lỗi thường gặp cần tránh
   - Thời gian nên dành cho loại câu này

Với mỗi câu hỏi, hãy cung cấp:
- Số câu hỏi (nếu có, nếu không thì đánh số từ 1)
- Phần (Part 5, 6, hoặc 7)
- Nội dung câu hỏi và các lựa chọn A/B/C/D
- Đáp án đúng
- Giải thích chi tiết theo cấu trúc 6 phần ở trên

Sử dụng ngôn ngữ đơn giản, tránh thuật ngữ phức tạp. Mục tiêu là giúp người học HIỂU SÂU, không chỉ biết đáp án. Hãy giải thích như thể bạn đang dạy một người bạn học tiếng Anh.`;

		if (part === "auto") {
			systemPrompt += `\n\nTự động phát hiện loại Part:
- Part 5: Câu hỏi điền vào chỗ trống trong một câu đơn (thường kiểm tra ngữ pháp và từ vựng)
- Part 6: Câu hỏi điền vào chỗ trống trong một đoạn văn ngắn (kiểm tra ngữ pháp, từ vựng và ngữ cảnh)
- Part 7: Câu hỏi dựa trên việc đọc hiểu đoạn văn dài (kiểm tra khả năng đọc hiểu và suy luận)`;
		}

		// Build messages based on mode
		const messages =
			mode === "image"
				? [
						{
							role: "user" as const,
							content: Array.isArray(content)
								? [
										{
											type: "text" as const,
											text: `Phân tích các câu hỏi TOEIC Part ${part} trong ${content.length} hình ảnh`,
										},
										...content.map((img) => ({
											type: "image" as const,
											image: img.startsWith("data:")
												? img
												: `data:image/jpeg;base64,${img}`,
										})),
									]
								: [
										{
											type: "text" as const,
											text: `Phân tích các câu hỏi TOEIC Part ${part} trong hình ảnh`,
										},
										{
											type: "image" as const,
											image: content.startsWith("data:")
												? content
												: `data:image/jpeg;base64,${content}`,
										},
									],
						},
					]
				: [
						{
							role: "user" as const,
							content: `Phân tích các câu hỏi TOEIC Part ${part}:\n\n${content}`,
						},
					];

		const result = streamObject({
			model,
			schema: toeicAnalysisSchema,
			system: systemPrompt,
			messages,
			temperature: 0.7,
			providerOptions: {
				openrouter: {
					provider: {
						order: ["alibaba"],
						allow_fallbacks: false,
					},
				},
			},
		});

		return result.toTextStreamResponse();
	} catch (error) {
		console.error("API error:", error);
		return new Response(
			JSON.stringify({ error: "Không thể xử lý yêu cầu. Vui lòng thử lại" }),
			{ status: 500, headers: { "Content-Type": "application/json" } },
		);
	}
}
