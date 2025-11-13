"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { MODEL_OPTIONS } from "../constants/configuration.constants";
import { useConfiguration } from "../context/configuration-context";

interface SettingsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
	const { configuration, updateConfiguration } = useConfiguration();

	const [modelSelection, setModelSelection] = useState("");
	const [customModel, setCustomModel] = useState("");
	const [apiKey, setApiKey] = useState(configuration?.apiKey || "");
	const [errors, setErrors] = useState<{
		model?: string;
		customModel?: string;
		apiKey?: string;
	}>({});

	useEffect(() => {
		if (open && configuration) {
			// Check if current model is in predefined options
			const isPredefinedModel = MODEL_OPTIONS.some(
				(option) => option.value === configuration.model,
			);

			if (isPredefinedModel) {
				setModelSelection(configuration.model);
				setCustomModel("");
			} else {
				// It's a custom model
				setModelSelection("custom");
				setCustomModel(configuration.model);
			}

			setApiKey(configuration.apiKey);
			setErrors({});
		}
	}, [open, configuration]);

	const validateForm = () => {
		const newErrors: { model?: string; customModel?: string; apiKey?: string } =
			{};

		if (!modelSelection) {
			newErrors.model = "Vui lòng chọn model";
		}

		if (modelSelection === "custom" && !customModel.trim()) {
			newErrors.customModel = "Vui lòng nhập tên model";
		}

		if (!apiKey) {
			newErrors.apiKey = "API key là bắt buộc";
		} else if (apiKey.length < 10) {
			newErrors.apiKey = "API key không hợp lệ";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSave = () => {
		if (!validateForm()) {
			return;
		}

		const finalModel =
			modelSelection === "custom" ? customModel.trim() : modelSelection;
		updateConfiguration({ model: finalModel, apiKey });
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Cấu hình</DialogTitle>
					<DialogDescription>
						Cấu hình model AI và API key của bạn để sử dụng ứng dụng
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-4">
					<Field>
						<FieldLabel htmlFor="model">Model</FieldLabel>
						<FieldContent>
							<Select value={modelSelection} onValueChange={setModelSelection}>
								<SelectTrigger id="model" className="w-full">
									<SelectValue placeholder="Chọn model" />
								</SelectTrigger>
								<SelectContent>
									{MODEL_OPTIONS.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FieldDescription>
								Chọn model AI để phân tích và tương tác
							</FieldDescription>
							{errors.model && <FieldError>{errors.model}</FieldError>}
						</FieldContent>
					</Field>

					{modelSelection === "custom" && (
						<Field>
							<FieldLabel htmlFor="customModel">Tên Model Tùy Chỉnh</FieldLabel>
							<FieldContent>
								<Input
									id="customModel"
									type="text"
									placeholder="Nhập tên model (ví dụ: gpt-4-vision-preview)"
									value={customModel}
									onChange={(e) => setCustomModel(e.target.value)}
									aria-invalid={!!errors.customModel}
								/>
								<FieldDescription>
									Nhập tên model từ OpenRouter hoặc provider khác
								</FieldDescription>
								{errors.customModel && (
									<FieldError>{errors.customModel}</FieldError>
								)}
							</FieldContent>
						</Field>
					)}

					<Field>
						<FieldLabel htmlFor="apiKey">API Key</FieldLabel>
						<FieldContent>
							<Input
								id="apiKey"
								type="password"
								placeholder="Nhập API key của bạn"
								value={apiKey}
								onChange={(e) => setApiKey(e.target.value)}
								aria-invalid={!!errors.apiKey}
							/>
							<FieldDescription>
								API key từ OpenRouter để sử dụng các model AI
							</FieldDescription>
							{errors.apiKey && <FieldError>{errors.apiKey}</FieldError>}
						</FieldContent>
					</Field>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Hủy
					</Button>
					<Button onClick={handleSave}>Lưu</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
