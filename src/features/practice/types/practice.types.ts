// Core type definitions for TOEIC Reading Practice feature

export type PracticePart = "5" | "6" | "7" | "auto";

export type InputMode = "text" | "image";

export interface ImageData {
	id: string;
	file: File;
	base64: string;
	preview: string;
}

export interface QuestionInput {
	mode: InputMode;
	part: PracticePart;
	content: string | string[]; // Text content or base64 image(s)
	imageFiles?: File[]; // Original files if image mode
}

export const IMAGE_CONSTRAINTS = {
	MAX_COUNT: 5,
	MAX_SIZE: 5 * 1024 * 1024, // 5MB
	ALLOWED_FORMATS: ["image/jpeg", "image/png"],
} as const;

export interface QuestionExplanation {
	questionNumber: string; // e.g., "101" or "1"
	part: PracticePart;
	questionText: string;
	options: {
		A: string;
		B: string;
		C: string;
		D: string;
	};
	correctAnswer: "A" | "B" | "C" | "D";
	explanation: {
		meaning: string; // Sentence/passage meaning
		grammarAnalysis: string; // Grammar explanation
		vocabularyNotes: string; // Key vocabulary
		whyCorrect: string; // Why the answer is correct
		whyOthersWrong?: string; // Why other options are wrong
		grammarPoint?: string; // Grammar concept name
		toeicTip?: string; // Optional TOEIC tip
	};
}

export interface PracticeState {
	input: QuestionInput | null;
	explanations: QuestionExplanation[];
	isProcessing: boolean;
	error: string | null;
}

export interface ConversationMessage {
	id: string;
	role: "user" | "assistant";
	content: QuestionInput | QuestionExplanation[];
	timestamp: Date;
	isStreaming?: boolean;
}

// Utility function to generate unique message IDs
export function generateMessageId(): string {
	return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
