"use client";

import { AlertCircle, Loader2, Plus, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { PracticePart, QuestionInput } from "../types/practice.types";

interface PracticeInputProps {
	onSubmit: (input: QuestionInput) => void;
	isProcessing: boolean;
	onMessageSent?: () => void;
}

const PART_OPTIONS: { value: PracticePart; label: string }[] = [
	{ value: "5", label: "Part 5" },
	{ value: "6", label: "Part 6" },
	{ value: "7", label: "Part 7" },
	{ value: "auto", label: "Auto" },
];

export function PracticeInput({
	onSubmit,
	isProcessing,
	onMessageSent,
}: PracticeInputProps) {
	const [selectedPart, setSelectedPart] = useState<PracticePart>("5");
	const [textContent, setTextContent] = useState("");
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imageBase64, setImageBase64] = useState<string>("");
	const [validationError, setValidationError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const handleFileSelect = (file: File) => {
		if (file.size > 10 * 1024 * 1024) {
			setValidationError(
				"Hình ảnh quá lớn. Vui lòng chọn hình ảnh nhỏ hơn 10MB",
			);
			return;
		}

		const reader = new FileReader();
		reader.onload = (event) => {
			const base64 = event.target?.result as string;
			setImageFile(file);
			setImageBase64(base64);
			setTextContent("");
			setValidationError(null);
		};
		reader.onerror = () => {
			setValidationError("Không thể đọc hình ảnh. Vui lòng thử lại");
		};
		reader.readAsDataURL(file);
	};

	const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
		const items = e.clipboardData?.items;
		if (!items) return;

		for (const item of Array.from(items)) {
			if (item.type.startsWith("image/")) {
				e.preventDefault();
				const file = item.getAsFile();
				if (!file) continue;
				handleFileSelect(file);
				break;
			}
		}
	};

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			handleFileSelect(file);
		}
	};

	const handleClearImage = () => {
		setImageFile(null);
		setImageBase64("");
		setValidationError(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const validateInput = (): boolean => {
		// Check if we have image
		if (imageFile && imageBase64) {
			setValidationError(null);
			return true;
		}

		// Otherwise validate text
		if (!textContent.trim()) {
			setValidationError(
				"Vui lòng nhập nội dung câu hỏi TOEIC để nhận giải thích chi tiết",
			);
			return false;
		}
		if (textContent.trim().length < 10) {
			setValidationError(
				"Câu hỏi quá ngắn. Vui lòng nhập đầy đủ nội dung câu hỏi (ít nhất 10 ký tự)",
			);
			return false;
		}
		if (textContent.length > 5000) {
			setValidationError("Câu hỏi quá dài. Vui lòng giới hạn trong 5000 ký tự");
			return false;
		}
		setValidationError(null);
		return true;
	};

	const handleSubmit = () => {
		if (!validateInput()) {
			return;
		}

		const hasImage = imageFile && imageBase64;
		const input: QuestionInput = {
			mode: hasImage ? "image" : "text",
			part: selectedPart,
			content: hasImage ? imageBase64 : textContent,
			imageFile: hasImage ? imageFile : undefined,
		};

		onSubmit(input);

		setTextContent("");
		setImageFile(null);
		setImageBase64("");
		setValidationError(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}

		onMessageSent?.();
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey && !isProcessing) {
			e.preventDefault();
			handleSubmit();
		}
	};

	// Handle Enter key for image submission
	useEffect(() => {
		if (!imageFile || !imageBase64 || isProcessing) return;

		const handleGlobalKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				handleSubmit();
			}
		};

		window.addEventListener("keydown", handleGlobalKeyDown);
		return () => window.removeEventListener("keydown", handleGlobalKeyDown);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [imageFile, imageBase64, isProcessing, handleSubmit]);

	// Auto-resize textarea
	useEffect(() => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		textarea.style.height = "40px";
		const scrollHeight = textarea.scrollHeight;
		textarea.style.height = `${Math.min(scrollHeight, 200)}px`;
	}, []);

	return (
		<div className="space-y-2">
			{/* Image Preview */}
			{imageFile && imageBase64 && (
				<div className="relative rounded-md border bg-muted p-2">
					<img
						src={imageBase64}
						alt="Câu hỏi đã dán"
						className="max-h-[200px] w-full rounded object-contain"
					/>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={handleClearImage}
						disabled={isProcessing}
						className="absolute right-2 top-2 size-6 rounded-full bg-background/80 hover:bg-background"
					>
						<X className="size-3" />
					</Button>
				</div>
			)}

			{/* Error Display */}
			{validationError && (
				<Alert variant="destructive" className="py-2" role="alert">
					<AlertCircle className="size-4" />
					<AlertDescription className="text-xs">
						{validationError}
					</AlertDescription>
				</Alert>
			)}

			{/* Main Input Container */}
			<div className="flex items-end gap-2 rounded-md border bg-background p-2">
				{/* Add Image Button */}
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={() => fileInputRef.current?.click()}
					disabled={isProcessing}
					className="size-9 shrink-0"
					title="Thêm hình ảnh"
				>
					<Plus className="size-5" />
				</Button>

				{/* Hidden File Input */}
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					onChange={handleFileInputChange}
					className="hidden"
					aria-label="Chọn hình ảnh"
				/>

				{/* Text Input */}
				<Textarea
					ref={textareaRef}
					value={textContent}
					onChange={(e) => setTextContent(e.target.value)}
					onPaste={handlePaste}
					onKeyDown={handleKeyDown}
					disabled={isProcessing || !!(imageFile && imageBase64)}
					placeholder="Ask anything"
					className={cn(
						"min-h-[40px] max-h-[200px] resize-none border-0 p-2 text-sm shadow-none focus-visible:ring-0",
						isProcessing && "cursor-not-allowed opacity-50",
					)}
					rows={1}
					aria-label="Nhập nội dung câu hỏi TOEIC hoặc dán hình ảnh"
				/>

				{/* Part Selector */}
				<Select
					value={selectedPart}
					onValueChange={(value) => setSelectedPart(value as PracticePart)}
					disabled={isProcessing}
				>
					<SelectTrigger className="h-9 w-[90px] shrink-0 border-0 shadow-none focus:ring-0">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{PART_OPTIONS.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Submit Button */}
				<Button
					type="button"
					onClick={handleSubmit}
					disabled={isProcessing}
					size="icon"
					className="size-9 shrink-0 cursor-pointer"
					aria-label="Gửi câu hỏi"
				>
					{isProcessing ? (
						<Loader2 className="size-4 animate-spin" />
					) : (
						<Send className="size-4" />
					)}
				</Button>
			</div>
		</div>
	);
}
