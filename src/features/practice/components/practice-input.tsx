"use client";

import { AlertCircle, Loader2, Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import type {
	ImageData,
	PracticePart,
	QuestionInput,
} from "../types/practice.types";
import { ImageInput } from "./image-input";

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
	const [selectedPart, setSelectedPart] = useState<PracticePart>("auto");
	const [textContent, setTextContent] = useState("");
	const [images, setImages] = useState<ImageData[]>([]);
	const [validationError, setValidationError] = useState<string | null>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const handleImagesSelect = (selectedImages: ImageData[]) => {
		setImages(selectedImages);
		if (selectedImages.length > 0) {
			setTextContent("");
		}
		setValidationError(null);
	};

	const handleImageError = (error: string) => {
		setValidationError(error);
	};

	const validateInput = useCallback((): boolean => {
		// Check if we have images
		if (images.length > 0) {
			setValidationError(null);
			return true;
		}

		// Otherwise validate text
		if (!textContent.trim()) {
			setValidationError("Vui lòng nhập nội dung hoặc chọn hình ảnh");
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
	}, [images, textContent]);

	const handleSubmit = useCallback(() => {
		if (!validateInput()) {
			return;
		}

		const hasImages = images.length > 0;
		const input: QuestionInput = {
			mode: hasImages ? "image" : "text",
			part: selectedPart,
			content: hasImages ? images.map((img) => img.base64) : textContent,
			imageFiles: hasImages ? images.map((img) => img.file) : undefined,
		};

		onSubmit(input);

		setTextContent("");
		setImages([]);
		setValidationError(null);

		onMessageSent?.();
	}, [images, onMessageSent, onSubmit, selectedPart, textContent, validateInput]);

	const handleTextareaKeyDown = (
		e: React.KeyboardEvent<HTMLTextAreaElement>,
	) => {
		if (e.key === "Enter" && !e.shiftKey && !isProcessing) {
			e.preventDefault();
			handleSubmit();
		}
	};

	useEffect(() => {
		if (images.length === 0) {
			return;
		}

		const handleGlobalKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Enter" || event.shiftKey || isProcessing) {
				return;
			}

			const target = event.target as Node | null;
			const container = containerRef.current;
			const isBodyTarget =
				target === document.body || target === document.documentElement;
			const isInsideContainer =
				container && target instanceof Node
					? container.contains(target)
					: false;

			if (!isInsideContainer && !isBodyTarget) {
				return;
			}

			event.preventDefault();
			handleSubmit();
		};

		document.addEventListener("keydown", handleGlobalKeyDown);
		return () => {
			document.removeEventListener("keydown", handleGlobalKeyDown);
		};
	}, [handleSubmit, images.length, isProcessing]);

	// Auto-resize textarea
	useEffect(() => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		textarea.style.height = "40px";
		const scrollHeight = textarea.scrollHeight;
		textarea.style.height = `${Math.min(scrollHeight, 200)}px`;
	}, []);

	return (
		<div className="space-y-3">
			{/* Image Input Section */}
			{images.length === 0 && (
				<ImageInput
					onImagesSelect={handleImagesSelect}
					onError={handleImageError}
					disabled={isProcessing}
					value={images}
					maxImages={5}
				/>
			)}

			{/* Image Preview with Count Badge */}
			{images.length > 0 && (
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<Badge variant="secondary" className="text-xs">
							{images.length}/5 hình ảnh
						</Badge>
					</div>
					<ImageInput
						onImagesSelect={handleImagesSelect}
						onError={handleImageError}
						disabled={isProcessing}
						value={images}
						maxImages={5}
					/>
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
		<div
			ref={containerRef}
			className="flex items-end gap-2 rounded-md border bg-background p-2"
		>
				{/* Text Input */}
		<Textarea
					ref={textareaRef}
					value={textContent}
					onChange={(e) => setTextContent(e.target.value)}
			onKeyDown={handleTextareaKeyDown}
					disabled={isProcessing || images.length > 0}
					placeholder="Ask anything"
					className={cn(
						"min-h-[40px] max-h-[200px] resize-none border-0 p-2 text-sm shadow-none focus-visible:ring-0",
						isProcessing && "cursor-not-allowed opacity-50",
					)}
					rows={1}
					aria-label="Nhập nội dung câu hỏi TOEIC hoặc chọn hình ảnh"
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
