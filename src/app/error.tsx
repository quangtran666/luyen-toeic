"use client";

import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

type ErrorProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

function getErrorMessage(error: Error): {
	title: string;
	description: string;
	suggestion: string;
} {
	const message = error.message.toLowerCase();

	if (message.includes("network") || message.includes("fetch")) {
		return {
			title: "Lỗi kết nối mạng",
			description: "Không thể kết nối đến máy chủ",
			suggestion:
				"Vui lòng kiểm tra kết nối internet của bạn và thử lại sau vài giây",
		};
	}

	if (message.includes("timeout")) {
		return {
			title: "Hết thời gian chờ",
			description: "Yêu cầu mất quá nhiều thời gian để xử lý",
			suggestion: "Vui lòng thử lại. Nếu vấn đề vẫn tiếp diễn, hãy thử lại sau",
		};
	}

	if (message.includes("api") || message.includes("server")) {
		return {
			title: "Lỗi máy chủ",
			description: "Máy chủ gặp sự cố khi xử lý yêu cầu",
			suggestion:
				"Chúng tôi đang khắc phục sự cố. Vui lòng thử lại sau vài phút",
		};
	}

	if (message.includes("rate limit")) {
		return {
			title: "Quá nhiều yêu cầu",
			description: "Bạn đã gửi quá nhiều yêu cầu trong thời gian ngắn",
			suggestion: "Vui lòng đợi một chút trước khi thử lại",
		};
	}

	return {
		title: "Đã xảy ra lỗi",
		description: "Ứng dụng gặp sự cố không mong muốn",
		suggestion: "Vui lòng thử lại hoặc tải lại trang",
	};
}

export default function Error({ error, reset }: ErrorProps) {
	useEffect(() => {
		console.error("Application error:", error);
	}, [error]);

	const errorInfo = getErrorMessage(error);

	return (
		<div
			className="container mx-auto max-w-2xl p-4 flex items-center justify-center min-h-screen"
			role="alert"
			aria-live="assertive"
		>
			<Card className="w-full">
				<CardHeader>
					<div className="flex items-start gap-3">
						<div className="rounded-full bg-destructive/10 p-2">
							<AlertCircle
								className="size-6 text-destructive"
								aria-hidden="true"
							/>
						</div>
						<div className="flex-1">
							<CardTitle className="text-2xl">{errorInfo.title}</CardTitle>
							<CardDescription className="mt-1.5">
								{errorInfo.description}
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<Alert>
						<AlertTitle>Gợi ý khắc phục</AlertTitle>
						<AlertDescription className="mt-2">
							{errorInfo.suggestion}
						</AlertDescription>
					</Alert>

					<details className="rounded-lg border bg-muted/50 p-4">
						<summary className="cursor-pointer text-sm font-medium hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded">
							Chi tiết kỹ thuật
						</summary>
						<div className="mt-3 space-y-2">
							<p className="text-sm font-mono text-muted-foreground break-all">
								{error.message || "Lỗi không xác định"}
							</p>
							{error.digest && (
								<p className="text-xs text-muted-foreground">
									Mã lỗi: <code className="font-mono">{error.digest}</code>
								</p>
							)}
						</div>
					</details>
				</CardContent>
				<CardFooter className="flex flex-col sm:flex-row gap-2">
					<Button
						onClick={reset}
						className="w-full sm:w-auto"
						aria-label="Thử lại tải trang"
					>
						<RefreshCw className="mr-2 size-4" aria-hidden="true" />
						Thử lại
					</Button>
					<Button
						variant="outline"
						onClick={() => (window.location.href = "/")}
						className="w-full sm:w-auto"
						aria-label="Quay về trang chủ"
					>
						<Home className="mr-2 size-4" aria-hidden="true" />
						Về trang chủ
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
