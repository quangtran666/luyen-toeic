"use client";

import { Image as ImageIcon, Upload, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageInputProps {
	onImageSelect: (file: File, base64: string) => void;
	onError: (error: string) => void;
	disabled: boolean;
	value?: File | null;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FORMATS = ["image/jpeg", "image/png"];

// Validate image file
const validateImage = (file: File): string | null => {
	if (!ALLOWED_FORMATS.includes(file.type)) {
		return "Chỉ chấp nhận định dạng JPEG hoặc PNG";
	}
	if (file.size > MAX_FILE_SIZE) {
		return "Kích thước file không được vượt quá 5MB";
	}
	return null;
};

// Convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result as string;
			resolve(result);
		};
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
};

export function ImageInput({
	onImageSelect,
	onError,
	disabled,
	value,
}: ImageInputProps) {
	const [preview, setPreview] = useState<string | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Clear preview when value is cleared from parent
	useEffect(() => {
		if (value === null) {
			setPreview(null);
			setSelectedFile(null);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	}, [value]);

	// Handle file selection
	const handleFileSelect = useCallback(
		async (file: File) => {
			const error = validateImage(file);
			if (error) {
				onError(error);
				return;
			}

			try {
				const base64 = await fileToBase64(file);
				setPreview(base64);
				setSelectedFile(file);
				onImageSelect(file, base64);
			} catch {
				onError("Không thể đọc file hình ảnh");
			}
		},
		[onError, onImageSelect],
	);

	// Handle file input change
	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			handleFileSelect(file);
		}
	};

	// Handle paste event
	useEffect(() => {
		const handlePaste = async (e: ClipboardEvent) => {
			if (disabled) return;

			const items = e.clipboardData?.items;
			if (!items) return;

			for (const item of Array.from(items)) {
				if (item.type.startsWith("image/")) {
					e.preventDefault();
					const file = item.getAsFile();
					if (file) {
						await handleFileSelect(file);
					}
					break;
				}
			}
		};

		document.addEventListener("paste", handlePaste);
		return () => document.removeEventListener("paste", handlePaste);
	}, [disabled, handleFileSelect]);

	// Clear selection
	const handleClear = () => {
		setPreview(null);
		setSelectedFile(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	// Trigger file input click
	const handleButtonClick = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className="space-y-4">
			<input
				ref={fileInputRef}
				type="file"
				accept="image/jpeg,image/png"
				onChange={handleFileInputChange}
				disabled={disabled}
				className="hidden"
				aria-label="Chọn file hình ảnh"
			/>

			{!preview ? (
				<div
					className={cn(
						"border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 sm:p-8",
						disabled
							? "border-muted bg-muted/20 cursor-not-allowed"
							: "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/10 cursor-pointer",
					)}
					onClick={!disabled ? handleButtonClick : undefined}
					role="button"
					tabIndex={disabled ? -1 : 0}
					aria-label="Khu vực tải lên hình ảnh"
					onKeyDown={(e) => {
						if (!disabled && (e.key === "Enter" || e.key === " ")) {
							e.preventDefault();
							handleButtonClick();
						}
					}}
				>
					<div className="flex flex-col items-center gap-3 sm:gap-4">
						<div className="rounded-full bg-muted p-3 transition-transform hover:scale-105 sm:p-4">
							<ImageIcon className="size-6 text-muted-foreground sm:size-8" />
						</div>
						<div className="space-y-1.5 sm:space-y-2">
							<p className="text-sm font-medium sm:text-base">
								Nhấp để chọn hoặc dán hình ảnh (Ctrl+V)
							</p>
							<p className="text-xs text-muted-foreground">
								Hỗ trợ JPEG, PNG • Tối đa 5MB
							</p>
						</div>
						<Button
							type="button"
							variant="outline"
							size="sm"
							disabled={disabled}
							onClick={(e) => {
								e.stopPropagation();
								handleButtonClick();
							}}
							className="transition-all hover:scale-105"
						>
							<Upload className="mr-2 size-4" />
							Chọn file
						</Button>
					</div>
				</div>
			) : (
				<div className="relative animate-in fade-in slide-in-from-top-2 rounded-lg border bg-muted/20 p-3 transition-all sm:p-4">
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						className="absolute right-2 top-2 z-10 transition-all hover:scale-110"
						onClick={handleClear}
						disabled={disabled}
						aria-label="Xóa hình ảnh"
					>
						<X className="size-4" />
					</Button>
					<div className="flex flex-col gap-3">
						<div className="relative w-full overflow-hidden rounded-md bg-background shadow-sm">
							<img
								src={preview}
								alt="Xem trước hình ảnh câu hỏi"
								className="h-auto w-full max-h-96 object-contain transition-transform hover:scale-[1.02]"
							/>
						</div>
						{selectedFile && (
							<div className="flex items-center gap-2 text-xs text-muted-foreground">
								<ImageIcon className="size-3" />
								<span className="truncate">{selectedFile.name}</span>
								<span className="shrink-0">
									• {(selectedFile.size / 1024).toFixed(0)} KB
								</span>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
