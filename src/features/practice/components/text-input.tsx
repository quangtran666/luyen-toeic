"use client";

import { FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface TextInputProps {
	value: string;
	onChange: (value: string) => void;
	disabled: boolean;
}

export function TextInput({ value, onChange, disabled }: TextInputProps) {
	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		onChange(e.target.value);
	};

	return (
		<div className="space-y-2.5">
			<label
				htmlFor="text-input"
				className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
			>
				<FileText className="size-4" />
				<span>Dán nội dung câu hỏi vào đây</span>
			</label>
			<Textarea
				id="text-input"
				value={value}
				onChange={handleChange}
				disabled={disabled}
				placeholder="Dán một hoặc nhiều câu hỏi TOEIC vào đây...&#10;&#10;Ví dụ:&#10;101. The company will _____ a new product next month.&#10;(A) launch&#10;(B) launches&#10;(C) launched&#10;(D) launching"
				className={cn(
					"min-h-48 resize-y font-mono text-sm transition-all duration-200 focus:ring-2",
					disabled && "cursor-not-allowed opacity-50",
				)}
				aria-label="Nhập nội dung câu hỏi TOEIC"
			/>
			<p className="text-xs text-muted-foreground">
				💡 Có thể dán một hoặc nhiều câu hỏi cùng lúc
			</p>
		</div>
	);
}
