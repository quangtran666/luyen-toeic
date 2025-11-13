import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamObject } from 'ai';
import { toeicAnalysisSchema } from '@/features/practice/lib/schema';

export const maxDuration = 30;

/**
 * POST /api/practice
 * Stream TOEIC question analysis with structured output
 */
export async function POST(request: Request) {
  try {
    const { mode, part, content }: { 
      mode: 'text' | 'image';
      part: '5' | '6' | '7' | 'auto';
      content: string;
    } = await request.json();
    
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }
    
    const openrouter = createOpenRouter({ apiKey });
    const model = openrouter('nvidia/nemotron-nano-12b-v2-vl:free');
    
    // Build system prompt
    let systemPrompt = `Bạn là một trợ lý TOEIC chuyên nghiệp. Phân tích câu hỏi TOEIC Reading và cung cấp giải thích chi tiết bằng tiếng Việt.

Với mỗi câu hỏi, hãy cung cấp:
1. Số câu hỏi (nếu có, nếu không thì đánh số từ 1)
2. Phần (Part 5, 6, hoặc 7)
3. Nội dung câu hỏi và các lựa chọn A/B/C/D
4. Đáp án đúng
5. Giải thích chi tiết bao gồm ý nghĩa, ngữ pháp, từ vựng, lý do đáp án đúng/sai, điểm ngữ pháp, và mẹo TOEIC`;

    if (part === 'auto') {
      systemPrompt += `\n\nTự động phát hiện loại Part:
- Part 5: Câu hỏi điền vào chỗ trống trong một câu đơn
- Part 6: Câu hỏi điền vào chỗ trống trong một đoạn văn ngắn
- Part 7: Câu hỏi dựa trên việc đọc hiểu đoạn văn dài`;
    }
    
    // Build messages based on mode
    const messages = mode === 'image' 
      ? [
          {
            role: 'user' as const,
            content: [
              { type: 'text' as const, text: `Phân tích các câu hỏi TOEIC Part ${part} trong hình ảnh` },
              { type: 'image' as const, image: content },
            ],
          },
        ]
      : [
          {
            role: 'user' as const,
            content: `Phân tích các câu hỏi TOEIC Part ${part}:\n\n${content}`,
          },
        ];
    
    const result = streamObject({
      model,
      schema: toeicAnalysisSchema,
      system: systemPrompt,
      messages,
      temperature: 0.7,
    });
    
    return result.toTextStreamResponse();
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: 'Không thể xử lý yêu cầu. Vui lòng thử lại' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
