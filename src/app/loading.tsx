import { Shimmer } from "@/components/ai-elements/shimmer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
	return (
		<div
			className="container mx-auto max-w-4xl p-4 space-y-6"
			role="status"
			aria-live="polite"
			aria-label="Đang tải ứng dụng"
		>
			<div className="space-y-2">
				<Shimmer className="text-3xl font-bold">
					Loading TOEIC Practice...
				</Shimmer>
				<Shimmer className="text-muted-foreground">
					Preparing your practice session
				</Shimmer>
			</div>

			<Card aria-label="Đang tải khu vực nhập câu hỏi">
				<CardHeader>
					<Shimmer className="text-xl font-semibold">Question Input</Shimmer>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Shimmer>Select practice mode</Shimmer>
						<div
							className="h-10 bg-muted rounded-md animate-pulse"
							aria-hidden="true"
						/>
					</div>
					<div className="space-y-2">
						<Shimmer>Enter your question</Shimmer>
						<div
							className="h-32 bg-muted rounded-md animate-pulse"
							aria-hidden="true"
						/>
					</div>
					<div
						className="h-10 bg-muted rounded-md animate-pulse w-32"
						aria-hidden="true"
					/>
				</CardContent>
			</Card>

			<Card aria-label="Đang tải khu vực kết quả phân tích">
				<CardHeader>
					<Shimmer className="text-xl font-semibold">Analysis Results</Shimmer>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						{[1, 2, 3, 4].map((i) => (
							<div key={i} className="space-y-2">
								<Shimmer className="font-medium">Loading section...</Shimmer>
								<div
									className="h-20 bg-muted rounded-md animate-pulse"
									aria-hidden="true"
								/>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
