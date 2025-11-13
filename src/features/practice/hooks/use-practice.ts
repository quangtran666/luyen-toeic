"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { useState } from "react";
import { toeicAnalysisSchema } from "../lib/schema";
import type {
	ConversationMessage,
	QuestionInput,
} from "../types/practice.types";
import { generateMessageId } from "../types/practice.types";

export function usePractice() {
	const [messages, setMessages] = useState<ConversationMessage[]>([]);

	const { object, submit, isLoading, error, stop } = useObject({
		api: "/api/practice",
		schema: toeicAnalysisSchema,
		onFinish({ object, error }) {
			if (error) {
				console.error("Schema validation error:", error);
				return;
			}

			if (!object) {
				console.error("No object returned from stream");
				return;
			}

			// Save the completed analysis to the message content
			setMessages((prev) =>
				prev.map((msg) =>
					msg.role === "assistant" && msg.isStreaming
						? { ...msg, content: object.questions || [], isStreaming: false }
						: msg,
				),
			);
		},
		onError(error) {
			console.error("API error:", error);
		},
	});

	const addUserMessage = (input: QuestionInput): void => {
		const userMessage: ConversationMessage = {
			id: generateMessageId(),
			role: "user",
			content: input,
			timestamp: new Date(),
		};
		setMessages((prev) => [...prev, userMessage]);
	};

	const addAssistantMessage = (): void => {
		const assistantMessage: ConversationMessage = {
			id: generateMessageId(),
			role: "assistant",
			content: [],
			timestamp: new Date(),
			isStreaming: true,
		};
		setMessages((prev) => [...prev, assistantMessage]);
	};

	const submitQuestionAsync = (input: QuestionInput): void => {
		try {
			addUserMessage(input);
			addAssistantMessage();

			submit({
				mode: input.mode,
				part: input.part,
				content: input.content,
			});
		} catch (err) {
			console.error("Error submitting question:", err);
		}
	};

	const retryLastQuestion = (): void => {
		const lastUserMessage = [...messages]
			.reverse()
			.find((msg) => msg.role === "user");

		if (lastUserMessage && "mode" in lastUserMessage.content) {
			setMessages((prev) => {
				const lastMsg = prev[prev.length - 1];
				if (lastMsg?.role === "assistant") {
					return prev.slice(0, -1);
				}
				return prev;
			});

			submitQuestionAsync(lastUserMessage.content as QuestionInput);
		}
	};

	const reset = (): void => {
		stop();
		setMessages([]);
	};

	return {
		messages,
		isProcessing: isLoading,
		submitQuestionAsync,
		retryLastQuestion,
		reset,
		stop,
		analysis: object,
		error,
	};
}
