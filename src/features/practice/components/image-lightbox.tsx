"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ImageLightboxProps {
	src: string;
	alt: string;
	onClose: () => void;
}

export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("keydown", handleEscape);
		document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [onClose]);

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
			onClick={onClose}
		>
			<Button
				variant="ghost"
				size="icon"
				onClick={onClose}
				className="absolute right-4 top-4 size-10 rounded-full bg-white/10 hover:bg-white/20"
			>
				<X className="size-5 text-white" />
			</Button>
			<img
				src={src}
				alt={alt}
				className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
				onClick={(e) => e.stopPropagation()}
			/>
		</div>
	);
}
