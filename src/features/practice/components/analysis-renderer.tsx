"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Loader } from "@/components/ai-elements/loader";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
	Reasoning,
	ReasoningContent,
	ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import type { DeepPartial, ToeicAnalysis } from "../lib/schema";
import { ExplanationGrid } from "./explanation-grid";

interface AnalysisRendererProps {
	analysis: DeepPartial<ToeicAnalysis> | undefined;
	isLoading: boolean;
	error: Error | undefined;
	reasoningContent?: string;
	isReasoningStreaming?: boolean;
	reasoningDuration?: number;
	onRetry?: () => void;
}

export function AnalysisRenderer({
	analysis,
	isLoading,
	error,
	reasoningContent = "Đang phân tích cấu trúc câu hỏi, xác định loại ngữ pháp, và tìm kiếm từ vựng liên quan để đưa ra giải thích chi tiết...",
	isReasoningStreaming = false,
	reasoningDuration,
	onRetry,
}: AnalysisRendererProps) {
	if (error) {
		const errorMessage = error.message.toLowerCase();
		let errorTitle = "Đã xảy ra lỗi";
		let errorDescription = "Không thể phân tích câu hỏi. Vui lòng thử lại.";
		let errorSuggestion = "";

		if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
			errorTitle = "Lỗi kết nối";
			errorDescription = "Không thể kết nối đến máy chủ AI";
			errorSuggestion = "Kiểm tra kết nối internet và thử lại";
		} else if (errorMessage.includes("timeout")) {
			errorTitle = "Hết thời gian chờ";
			errorDescription = "Yêu cầu mất quá nhiều thời gian";
			errorSuggestion = "Thử lại với câu hỏi ngắn hơn hoặc đợi một chút";
		} else if (errorMessage.includes("rate limit")) {
			errorTitle = "Quá nhiều yêu cầu";
			errorDescription = "Bạn đã gửi quá nhiều yêu cầu";
			errorSuggestion = "Vui lòng đợi một chút trước khi thử lại";
		} else if (
			errorMessage.includes("api key") ||
			errorMessage.includes("unauthorized")
		) {
			errorTitle = "Lỗi xác thực";
			errorDescription = "Không thể xác thực với dịch vụ AI";
			errorSuggestion = "Vui lòng liên hệ quản trị viên";
		} else if (errorMessage.includes("model") || errorMessage.includes("ai")) {
			errorTitle = "Lỗi AI";
			errorDescription = "Mô hình AI gặp sự cố khi xử lý";
			errorSuggestion = "Thử lại hoặc thử với câu hỏi khác";
		}

		return (
			<Message from="assistant" role="article" aria-label="Thông báo lỗi">
				<MessageContent>
					<div
						className="rounded-lg border border-destructive/50 bg-destructive/5 p-4"
						role="alert"
						aria-live="assertive"
					>
						<div className="flex items-start gap-3">
							<div className="rounded-full bg-destructive/10 p-1.5 shrink-0">
								<AlertCircle
									className="size-4 text-destructive"
									aria-hidden="true"
								/>
							</div>
							<div className="flex-1 space-y-3">
								<div>
									<p className="font-medium text-destructive">{errorTitle}</p>
									<p className="text-sm text-muted-foreground mt-1">
										{errorDescription}
									</p>
								</div>
								{errorSuggestion && (
									<p className="text-sm text-muted-foreground italic">
										💡 {errorSuggestion}
									</p>
								)}
								{onRetry && (
									<Button
										onClick={onRetry}
										size="sm"
										variant="outline"
										className="gap-2"
										aria-label="Thử lại phân tích câu hỏi"
									>
										<RefreshCw className="size-3.5" aria-hidden="true" />
										Thử lại
									</Button>
								)}
								<details className="text-xs">
									<summary className="cursor-pointer text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded">
										Chi tiết lỗi
									</summary>
									<p className="mt-1 font-mono text-muted-foreground break-all">
										{error.message}
									</p>
								</details>
							</div>
						</div>
					</div>
				</MessageContent>
			</Message>
		);
	}

	if (isLoading && !analysis) {
		return (
			<Message from="assistant" role="article" aria-label="Đang phân tích">
				<MessageContent>
					<div
						className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
						role="status"
						aria-live="polite"
						aria-busy="true"
					>
						<div className="flex items-center gap-3">
							<Loader size={20} aria-hidden="true" />
							<div className="flex-1">
								<Shimmer className="text-base font-medium">
									Đang phân tích câu hỏi TOEIC...
								</Shimmer>
								<p className="text-sm text-muted-foreground mt-1">
									AI đang đọc và phân tích nội dung
								</p>
							</div>
						</div>
					</div>
				</MessageContent>
			</Message>
		);
	}

	if (!analysis?.questions || analysis.questions.length === 0) {
		return null;
	}

	return (
		<Message from="assistant" role="article" aria-label="Kết quả phân tích">
			<MessageContent>
				<div className="space-y-4">
					{isLoading && (
						<div
							className="flex items-center gap-2 text-sm text-primary"
							role="status"
							aria-live="polite"
							aria-label="Đang hoàn thiện phân tích"
						>
							<Loader size={16} aria-hidden="true" />
							<Shimmer>Đang hoàn thiện phân tích...</Shimmer>
						</div>
					)}

					<ExplanationGrid
						explanations={
							analysis.questions as DeepPartial<
								ToeicAnalysis["questions"][number]
							>[]
						}
					/>
				</div>
			</MessageContent>
		</Message>
	);
}
