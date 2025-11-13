"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfigurationGuard } from "@/features/configuration/components/configuration-guard";
import { SettingsButton } from "@/features/configuration/components/settings-button";
import { SettingsDialog } from "@/features/configuration/components/settings-dialog";
import { ConfigurationProvider } from "@/features/configuration/context/configuration-context";
import { AnalysisRenderer } from "@/features/practice/components/analysis-renderer";
import { ConversationContainer } from "@/features/practice/components/conversation-container";
import { PracticeInput } from "@/features/practice/components/practice-input";
import { UserMessage } from "@/features/practice/components/user-message";
import { usePractice } from "@/features/practice/hooks/use-practice";
import type { QuestionInput } from "@/features/practice/types/practice.types";

export default function Home() {
	return (
		<ConfigurationProvider>
			<HomeContent />
		</ConfigurationProvider>
	);
}

function HomeContent() {
	const {
		messages,
		analysis,
		isProcessing,
		submitQuestionAsync,
		retryLastQuestion,
		reset,
		error,
	} = usePractice();

	const lastMessageRef = useRef<HTMLDivElement>(null);
	const previousMessageCountRef = useRef(messages.length);
	const [settingsOpen, setSettingsOpen] = useState(false);

	// Focus management for new messages
	useEffect(() => {
		if (messages.length > previousMessageCountRef.current) {
			// New message added, scroll and announce
			lastMessageRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
			});
		}
		previousMessageCountRef.current = messages.length;
	}, [messages.length]);

	return (
		<div className="flex h-screen flex-col bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 supports-[height:100dvh]:h-dvh">
			{/* Settings Button - Fixed at top right */}
			<SettingsButton onClick={() => setSettingsOpen(true)} />
			<SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />

			{/* Main Content */}
			<main className="flex flex-1 overflow-hidden">
				<div className="mx-auto flex h-full w-full max-w-[1400px] flex-col px-3 sm:px-4 md:px-6 lg:px-8">
					{/* Conversation Section - Scrollable */}
					<section
						className="relative flex-1 overflow-y-auto py-4 sm:py-6 md:py-8"
						role="region"
						aria-label="Cuộc trò chuyện"
					>
						{/* New Message Button - Fixed at top left */}
						{messages.length > 0 && (
							<Button
								variant="outline"
								size="icon"
								onClick={reset}
								className="fixed left-4 top-4 z-50 size-12 cursor-pointer rounded-full shadow-lg sm:left-6 sm:top-6"
								title="Tạo cuộc trò chuyện mới"
							>
								<MessageCircle className="size-5" />
							</Button>
						)}

						<ConversationContainer isEmpty={messages.length === 0}>
							{messages.map((message, index) => {
								const isLastMessage = index === messages.length - 1;

								if (message.role === "user") {
									return (
										<div
											key={message.id}
											ref={isLastMessage ? lastMessageRef : null}
										>
											<UserMessage input={message.content as QuestionInput} />
										</div>
									);
								}

								// For assistant messages, use saved content if available, otherwise use streaming analysis
								const messageAnalysis = message.isStreaming
									? analysis
									: ({
											questions: message.content,
										} as typeof analysis);

								return (
									<div
										key={message.id}
										ref={isLastMessage ? lastMessageRef : null}
									>
										<AnalysisRenderer
											analysis={messageAnalysis}
											isLoading={message.isStreaming || false}
											error={error}
											onRetry={retryLastQuestion}
										/>
									</div>
								);
							})}
						</ConversationContainer>
					</section>

					{/* Input Section - Fixed at bottom */}
					<section
						className="shrink-0 py-3 sm:py-4"
						role="region"
						aria-label="Khu vực nhập câu hỏi"
					>
						<ConfigurationGuard>
							<PracticeInput
								onSubmit={submitQuestionAsync}
								isProcessing={isProcessing}
							/>
						</ConfigurationGuard>
					</section>
				</div>
			</main>
		</div>
	);
}
