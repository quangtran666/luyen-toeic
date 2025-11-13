'use client';

import type { DeepPartial, ToeicAnalysis } from '../lib/schema';
import { ExplanationGrid } from './explanation-grid';
import { Loader } from '@/components/ai-elements/loader';
import { Shimmer } from '@/components/ai-elements/shimmer';
import { AlertCircle } from 'lucide-react';

interface AnalysisRendererProps {
	analysis: DeepPartial<ToeicAnalysis> | undefined;
	isLoading: boolean;
	error: Error | undefined;
}

export function AnalysisRenderer({
	analysis,
	isLoading,
	error,
}: AnalysisRendererProps) {
	if (error) {
		return (
			<div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
				<div className="flex items-start gap-3">
					<AlertCircle className="size-5 shrink-0 mt-0.5" />
					<div>
						<p className="font-medium">Đã xảy ra lỗi</p>
						<p className="text-sm mt-1">
							Không thể phân tích câu hỏi. Vui lòng thử lại.
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (isLoading && !analysis) {
		return (
			<div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
				<div className="flex items-center gap-3">
					<Loader size={20} />
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
		);
	}

	if (!analysis?.questions || analysis.questions.length === 0) {
		return null;
	}

	return (
		<div className="space-y-4">
			{isLoading && (
				<div className="flex items-center gap-2 text-sm text-primary">
					<Loader size={16} />
					<Shimmer>Đang hoàn thiện phân tích...</Shimmer>
				</div>
			)}

			<ExplanationGrid
				explanations={
					analysis.questions as DeepPartial<
						ToeicAnalysis['questions'][number]
					>[]
				}
			/>
		</div>
	);
}
