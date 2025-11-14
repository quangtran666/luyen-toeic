"use client";

import { useState } from "react";
import {
	Message,
	MessageAttachment,
	MessageAttachments,
	MessageContent,
} from "@/components/ai-elements/message";
import { Badge } from "@/components/ui/badge";
import type { QuestionInput } from "../types/practice.types";
import { ImageLightbox } from "./image-lightbox";

interface UserMessageProps {
	input: QuestionInput;
}

const PART_LABELS: Record<string, string> = {
	"5": "Part 5",
	"6": "Part 6",
	"7": "Part 7",
	auto: "Auto",
};

export function UserMessage({ input }: UserMessageProps) {
	const { mode, part, content, imageFiles } = input;
	const [showLightbox, setShowLightbox] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);

	const images = mode === "image" && Array.isArray(content) ? content : [];
	const hasImages = images.length > 0;

	return (
		<>
			<Message from="user" role="article" aria-label="Câu hỏi của bạn">
				{mode === "image" && hasImages && (
					<MessageAttachments>
						{images.map((imageUrl, index) => (
							<div
								key={index}
								onClick={() => {
									setSelectedImageIndex(index);
									setShowLightbox(true);
								}}
								className="cursor-pointer"
							>
								<MessageAttachment
									data={{
										type: "file",
										url: imageUrl,
										mediaType: "image/png",
										filename:
											imageFiles?.[index]?.name ||
											`question-image-${index + 1}.png`,
									}}
									aria-label={`Hình ảnh câu hỏi ${index + 1}: ${imageFiles?.[index]?.name || `question-image-${index + 1}.png`}`}
								/>
							</div>
						))}
					</MessageAttachments>
				)}
				<MessageContent>
					{mode === "text" && typeof content === "string" && (
						<p className="whitespace-pre-wrap">{content}</p>
					)}
					<div
						className="mt-2 flex items-center gap-2"
						role="group"
						aria-label="Thông tin câu hỏi"
					>
						<Badge
							variant="secondary"
							className="text-xs"
							aria-label={`Phần thi: ${PART_LABELS[part]}`}
						>
							{PART_LABELS[part]}
						</Badge>
						<Badge
							variant="outline"
							className="text-xs"
							aria-label={`Loại nhập: ${mode === "text" ? "Văn bản" : "Hình ảnh"}`}
						>
							{mode === "text" ? "Văn bản" : "Hình ảnh"}
						</Badge>
						{hasImages && images.length > 1 && (
							<Badge
								variant="outline"
								className="text-xs"
								aria-label={`Số lượng hình ảnh: ${images.length}`}
							>
								{images.length} hình ảnh
							</Badge>
						)}
					</div>
				</MessageContent>
			</Message>

			{showLightbox && hasImages && (
				<ImageLightbox
					src={images[selectedImageIndex]}
					alt={
						imageFiles?.[selectedImageIndex]?.name ||
						`question-image-${selectedImageIndex + 1}.png`
					}
					onClose={() => setShowLightbox(false)}
				/>
			)}
		</>
	);
}
