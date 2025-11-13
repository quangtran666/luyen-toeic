import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { DeepPartial } from "../lib/schema";
import type { QuestionExplanation } from "../types/practice.types";

interface QuestionCardProps {
	explanation: DeepPartial<QuestionExplanation> | undefined;
	index?: number;
}

export function QuestionCard({ explanation, index = 0 }: QuestionCardProps) {
	if (!explanation) return null;

	const {
		questionNumber,
		part,
		questionText,
		options,
		correctAnswer,
		explanation: details,
	} = explanation;

	return (
		<Card
			className="animate-in fade-in slide-in-from-bottom-4 transition-all hover:shadow-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
			style={{ animationDelay: `${index * 100}ms` }}
			role="article"
			aria-label={`Giải thích câu ${questionNumber || "..."}`}
		>
			<CardHeader className="space-y-2 pb-4">
				<div className="flex items-center justify-between gap-2">
					<CardTitle
						className="text-base sm:text-lg"
						id={`question-${questionNumber}-title`}
					>
						Câu {questionNumber || "..."}
					</CardTitle>
					{part && (
						<Badge
							variant="outline"
							className="shrink-0"
							aria-label={`Part ${part}`}
						>
							Part {part}
						</Badge>
					)}
				</div>
				{questionText && (
					<CardDescription
						className="text-sm leading-relaxed sm:text-base"
						aria-label="Nội dung câu hỏi"
					>
						{questionText}
					</CardDescription>
				)}
			</CardHeader>

			<CardContent className="space-y-4 sm:space-y-5">
				{/* Options */}
				{options && (
					<div
						className="space-y-2"
						role="group"
						aria-labelledby={`question-${questionNumber}-options`}
					>
						<p
							className="text-sm font-medium"
							id={`question-${questionNumber}-options`}
						>
							Các lựa chọn:
						</p>
						<div className="space-y-2 text-sm" role="list">
							{(["A", "B", "C", "D"] as const).map((letter) => (
								<div
									key={letter}
									className={`flex items-start gap-2 rounded-md p-2 transition-colors ${
										letter === correctAnswer
											? "bg-primary/5 ring-1 ring-primary/20"
											: "hover:bg-muted/50"
									}`}
									role="listitem"
									aria-label={`Lựa chọn ${letter}${letter === correctAnswer ? " - Đáp án đúng" : ""}`}
								>
									<span className="font-semibold text-foreground">
										{letter}.
									</span>
									<span className="flex-1">{options[letter] || "..."}</span>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Correct Answer */}
				{correctAnswer && (
					<div
						className="flex items-center gap-2 rounded-lg bg-primary/5 p-3"
						role="status"
						aria-label={`Đáp án đúng là ${correctAnswer}`}
					>
						<span className="text-sm font-medium">Đáp án đúng:</span>
						<Badge variant="default" className="text-base font-bold">
							{correctAnswer}
						</Badge>
					</div>
				)}

				{/* Explanation Sections */}
				{details && (
					<div
						className="space-y-4 border-t pt-4"
						role="region"
						aria-label="Giải thích chi tiết"
					>
						{/* Meaning */}
						{details.meaning && (
							<section
								className="space-y-1.5"
								aria-labelledby={`question-${questionNumber}-meaning`}
							>
								<h4
									className="text-sm font-semibold"
									id={`question-${questionNumber}-meaning`}
								>
									Ý nghĩa:
								</h4>
								<p className="text-sm leading-relaxed text-muted-foreground">
									{details.meaning}
								</p>
							</section>
						)}

						{/* Grammar Analysis */}
						{details.grammarAnalysis && (
							<section
								className="space-y-1.5"
								aria-labelledby={`question-${questionNumber}-grammar`}
							>
								<h4
									className="text-sm font-semibold"
									id={`question-${questionNumber}-grammar`}
								>
									Phân tích ngữ pháp:
								</h4>
								<p className="text-sm leading-relaxed text-muted-foreground">
									{details.grammarAnalysis}
								</p>
							</section>
						)}

						{/* Vocabulary Notes */}
						{details.vocabularyNotes && (
							<section
								className="space-y-1.5"
								aria-labelledby={`question-${questionNumber}-vocab`}
							>
								<h4
									className="text-sm font-semibold"
									id={`question-${questionNumber}-vocab`}
								>
									Từ vựng quan trọng:
								</h4>
								<p className="text-sm leading-relaxed text-muted-foreground">
									{details.vocabularyNotes}
								</p>
							</section>
						)}

						{/* Why Correct */}
						{details.whyCorrect && (
							<section
								className="space-y-1.5"
								aria-labelledby={`question-${questionNumber}-why-correct`}
							>
								<h4
									className="text-sm font-semibold"
									id={`question-${questionNumber}-why-correct`}
								>
									Tại sao đáp án đúng:
								</h4>
								<p className="text-sm leading-relaxed text-muted-foreground">
									{details.whyCorrect}
								</p>
							</section>
						)}

						{/* Why Others Wrong (optional) */}
						{details.whyOthersWrong && (
							<section
								className="space-y-1.5"
								aria-labelledby={`question-${questionNumber}-why-wrong`}
							>
								<h4
									className="text-sm font-semibold"
									id={`question-${questionNumber}-why-wrong`}
								>
									Tại sao các đáp án khác sai:
								</h4>
								<p className="text-sm leading-relaxed text-muted-foreground">
									{details.whyOthersWrong}
								</p>
							</section>
						)}

						{/* Grammar Point (optional) */}
						{details.grammarPoint && (
							<div
								className="flex flex-wrap items-center gap-2"
								role="group"
								aria-label="Điểm ngữ pháp"
							>
								<span className="text-sm font-medium">Điểm ngữ pháp:</span>
								<Badge variant="secondary" className="font-normal">
									{details.grammarPoint}
								</Badge>
							</div>
						)}

						{/* TOEIC Tip (optional) */}
						{details.toeicTip && (
							<aside
								className="rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted/70"
								aria-label="Mẹo TOEIC"
							>
								<h4 className="mb-1.5 text-sm font-semibold">💡 Mẹo TOEIC:</h4>
								<p className="text-sm leading-relaxed text-muted-foreground">
									{details.toeicTip}
								</p>
							</aside>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
