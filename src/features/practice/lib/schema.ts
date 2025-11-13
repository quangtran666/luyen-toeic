import { z } from "zod";

/**
 * Shared Zod schema for TOEIC question analysis
 * Used by both client (useObject) and server (streamObject)
 */
export const toeicAnalysisSchema = z.object({
	questions: z.array(
		z.object({
			questionNumber: z.string().describe('Question number, e.g., "101"'),
			part: z.enum(["5", "6", "7"]).describe("TOEIC part"),
			questionText: z.string().describe("The question text"),
			options: z
				.object({
					A: z.string(),
					B: z.string(),
					C: z.string(),
					D: z.string(),
				})
				.describe("Answer options"),
			correctAnswer: z.enum(["A", "B", "C", "D"]).describe("Correct answer"),
			explanation: z.object({
				meaning: z
					.string()
					.describe("Meaning of the sentence/passage in Vietnamese"),
				grammarAnalysis: z
					.string()
					.describe("Grammar explanation in Vietnamese"),
				vocabularyNotes: z
					.string()
					.describe("Key vocabulary notes in Vietnamese"),
				whyCorrect: z
					.string()
					.describe("Why the answer is correct in Vietnamese"),
				whyOthersWrong: z
					.string()
					.optional()
					.describe("Why other options are wrong"),
				grammarPoint: z.string().optional().describe("Grammar concept name"),
				toeicTip: z.string().optional().describe("TOEIC tip"),
			}),
		}),
	),
});

export type ToeicAnalysis = z.infer<typeof toeicAnalysisSchema>;

// Utility type for partial/streaming objects
export type DeepPartial<T> = T extends object
	? {
			[P in keyof T]?: DeepPartial<T[P]>;
		}
	: T;
