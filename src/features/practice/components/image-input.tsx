"use client";

import { AlertCircle, Image as ImageIcon, Upload, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { ImageData } from "@/features/practice/types/practice.types";
import { IMAGE_CONSTRAINTS } from "@/features/practice/types/practice.types";
import { cn } from "@/lib/utils";

interface ImageInputProps {
	onImagesSelect: (images: ImageData[]) => void;
	onError: (error: string) => void;
	disabled: boolean;
	value?: ImageData[];
	maxImages?: number;
}

interface ImageError {
	id: string;
	message: string;
}

// Generate unique ID for each image
const generateImageId = (): string => {
	return `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Validate image file
const validateImage = (file: File): string | null => {
	if (
		!(IMAGE_CONSTRAINTS.ALLOWED_FORMATS as readonly string[]).includes(
			file.type,
		)
	) {
		return "Chỉ chấp nhận định dạng JPEG hoặc PNG";
	}
	if (file.size > IMAGE_CONSTRAINTS.MAX_SIZE) {
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
	onImagesSelect,
	onError,
	disabled,
	value = [],
	maxImages = 5,
}: ImageInputProps) {
	const [images, setImages] = useState<ImageData[]>(value);
	const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());
	const [imageErrors, setImageErrors] = useState<ImageError[]>([]);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Sync with parent value
	useEffect(() => {
		setImages(value);
	}, [value]);

	// Process and add files to collection
	const processFiles = useCallback(
		async (files: File[]) => {
			// Clear previous errors
			setImageErrors([]);

			// Check max count
			if (images.length + files.length > maxImages) {
				const errorId = generateImageId();
				setImageErrors([
					{
						id: errorId,
						message: `Bạn chỉ có thể tải lên tối đa ${maxImages} hình ảnh`,
					},
				]);
				onError(`Bạn chỉ có thể tải lên tối đa ${maxImages} hình ảnh`);
				return;
			}

			const newImages: ImageData[] = [];
			const errors: ImageError[] = [];

			for (const file of files) {
				const error = validateImage(file);
				if (error) {
					errors.push({
						id: generateImageId(),
						message: `${file.name}: ${error}`,
					});
					continue;
				}

				const id = generateImageId();
				setLoadingImages((prev) => new Set([...prev, id]));

				try {
					const base64 = await fileToBase64(file);
					newImages.push({
						id,
						file,
						base64,
						preview: base64,
					});
				} catch {
					errors.push({
						id: generateImageId(),
						message: `${file.name}: Không thể đọc file hình ảnh`,
					});
				} finally {
					setLoadingImages((prev) => {
						const next = new Set(prev);
						next.delete(id);
						return next;
					});
				}
			}

			// Update errors state
			if (errors.length > 0) {
				setImageErrors(errors);
				// Also call onError with the first error for backward compatibility
				onError(errors[0].message);
			}

			if (newImages.length > 0) {
				const updatedImages = [...images, ...newImages];
				setImages(updatedImages);
				onImagesSelect(updatedImages);
			}
		},
		[images, maxImages, onError, onImagesSelect],
	);

	// Handle file input change
	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			processFiles(Array.from(files));
		}
	};

	// Handle paste event
	useEffect(() => {
		const handlePaste = async (e: ClipboardEvent) => {
			if (disabled) return;

			const items = e.clipboardData?.items;
			if (!items) return;

			const imageFiles: File[] = [];
			for (const item of Array.from(items)) {
				if (item.type.startsWith("image/")) {
					const file = item.getAsFile();
					if (file) {
						imageFiles.push(file);
					}
				}
			}

			if (imageFiles.length > 0) {
				e.preventDefault();
				await processFiles(imageFiles);
			}
		};

		document.addEventListener("paste", handlePaste);
		return () => document.removeEventListener("paste", handlePaste);
	}, [disabled, processFiles]);

	// Handle drag and drop
	const handleDragOver = useCallback(
		(e: React.DragEvent) => {
			// Only handle if there are files being dragged
			if (e.dataTransfer.types.includes("Files")) {
				e.preventDefault();
				e.stopPropagation();
				if (!disabled) {
					setIsDragging(true);
				}
			}
		},
		[disabled],
	);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	}, []);

	const handleDrop = useCallback(
		async (e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);

			if (disabled) return;

			const files = Array.from(e.dataTransfer.files).filter((file) =>
				file.type.startsWith("image/"),
			);

			if (files.length > 0) {
				await processFiles(files);
			}
		},
		[disabled, processFiles],
	);

	// Remove individual image
	const handleRemoveImage = useCallback(
		(id: string) => {
			const updatedImages = images.filter((img) => img.id !== id);
			setImages(updatedImages);
			onImagesSelect(updatedImages);
		},
		[images, onImagesSelect],
	);

	// Clear all images
	const handleClearAll = useCallback(() => {
		setImages([]);
		setImageErrors([]);
		onImagesSelect([]);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}, [onImagesSelect]);

	// Dismiss individual error
	const handleDismissError = useCallback((errorId: string) => {
		setImageErrors((prev) => prev.filter((err) => err.id !== errorId));
	}, []);

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
				multiple
				onChange={handleFileInputChange}
				disabled={disabled}
				className="hidden"
				aria-label="Chọn file hình ảnh"
			/>

			{/* Error Display */}
			{imageErrors.length > 0 && (
				<div className="space-y-2">
					{imageErrors.map((error) => (
						<Alert key={error.id} variant="destructive" className="py-2">
							<AlertCircle className="size-4" />
							<AlertDescription className="flex items-center justify-between text-xs">
								<span>{error.message}</span>
								<Button
									type="button"
									variant="ghost"
									size="icon-sm"
									onClick={() => handleDismissError(error.id)}
									className="ml-2 size-5 shrink-0"
									aria-label="Đóng thông báo lỗi"
								>
									<X className="size-3" />
								</Button>
							</AlertDescription>
						</Alert>
					))}
				</div>
			)}

			{images.length === 0 ? null : (
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<p className="text-sm text-muted-foreground">
							{images.length}/{maxImages} hình ảnh
						</p>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={handleClearAll}
							disabled={disabled}
							className="h-8 text-xs"
						>
							<X className="mr-1 size-3" />
							Xóa tất cả
						</Button>
					</div>

					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{images.map((image) => (
							<div
								key={image.id}
								className="relative animate-in fade-in slide-in-from-top-2 rounded-lg border bg-muted/20 p-3 transition-all touch-manipulation"
							>
								<Button
									type="button"
									variant="ghost"
									size="icon-sm"
									className="absolute right-2 top-2 z-10 size-8 transition-all hover:scale-110 touch-manipulation"
									onClick={() => handleRemoveImage(image.id)}
									disabled={disabled}
									aria-label={`Xóa ${image.file.name}`}
								>
									<X className="size-4" />
								</Button>
								<div className="flex flex-col gap-2">
									<div className="relative w-full overflow-hidden rounded-md bg-background shadow-sm">
										{loadingImages.has(image.id) ? (
											<div className="flex h-32 items-center justify-center">
												<div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
											</div>
										) : (
											<img
												src={image.preview}
												alt={image.file.name}
												className="h-auto w-full max-h-32 object-contain transition-transform hover:scale-[1.02]"
											/>
										)}
									</div>
									<div className="flex items-center gap-2 text-xs text-muted-foreground">
										<ImageIcon className="size-3 shrink-0" />
										<span className="truncate">{image.file.name}</span>
										<span className="shrink-0">
											• {(image.file.size / 1024).toFixed(0)} KB
										</span>
									</div>
								</div>
							</div>
						))}
					</div>

					{images.length < maxImages && (
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={handleButtonClick}
							disabled={disabled || loadingImages.size > 0}
							className="w-full"
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
						>
							<Upload className="mr-2 size-4" />
							Thêm hình ảnh ({images.length}/{maxImages})
							{loadingImages.size > 0 && (
								<span className="ml-2 text-xs text-muted-foreground">
									(Đang tải {loadingImages.size}...)
								</span>
							)}
						</Button>
					)}
				</div>
			)}
		</div>
	);
}
