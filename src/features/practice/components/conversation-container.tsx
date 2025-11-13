"use client";

import { MessageCircle } from "lucide-react";
import type { ReactNode } from "react";
import {
	Conversation,
	ConversationContent,
	ConversationEmptyState,
	ConversationScrollButton,
} from "@/components/ai-elements/conversation";

interface ConversationContainerProps {
	children: ReactNode;
	isEmpty?: boolean;
}

export function ConversationContainer({
	children,
	isEmpty = false,
}: ConversationContainerProps) {
	return (
		<Conversation
			className="rounded-lg border bg-white shadow-sm dark:bg-zinc-950"
			role="log"
			aria-live="polite"
			aria-label="Lịch sử hội thoại với AI"
		>
			<ConversationContent>
				{isEmpty ? (
					<ConversationEmptyState
						title="Chưa có câu hỏi nào"
						description="Nhập câu hỏi TOEIC Reading để bắt đầu luyện tập"
						icon={<MessageCircle className="size-12" aria-hidden="true" />}
					/>
				) : (
					children
				)}
			</ConversationContent>
			<ConversationScrollButton aria-label="Cuộn xuống tin nhắn mới nhất" />
		</Conversation>
	);
}
