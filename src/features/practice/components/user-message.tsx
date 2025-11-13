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
	const { mode, part, content, imageFile } = input;
	const [showLightbox, setShowLightbox] = useState(false);

	return (
		<>
			<Message from="user" role="article" aria-label="Câu hỏi của bạn">
				{mode === "image" && content && (
					<MessageAttachments>
						<div
							onClick={() => setShowLightbox(true)}
							className="cursor-pointer"
						>
							<MessageAttachment
								data={{
									type: "file",
									url: content,
									mediaType: "image/png",
									filename: imageFile?.name || "question-image.png",
								}}
								aria-label={`Hình ảnh câu hỏi: ${imageFile?.name || "question-image.png"}`}
							/>
						</div>
					</MessageAttachments>
				)}
				<MessageContent>
					{mode === "text" && <p className="whitespace-pre-wrap">{content}</p>}
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
					</div>
				</MessageContent>
			</Message>

			{showLightbox && mode === "image" && content && (
				<ImageLightbox
					src={content}
					alt={imageFile?.name || "question-image.png"}
					onClose={() => setShowLightbox(false)}
				/>
			)}
		</>
	);
}
