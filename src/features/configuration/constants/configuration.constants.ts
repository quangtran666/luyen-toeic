import type { ModelOption } from "../types/configuration.types";

export const STORAGE_KEY = "toeic-practice-config" as const;

export const MODEL_OPTIONS: readonly ModelOption[] = [
	{
		value: "qwen/qwen3-vl-8b-instruct",
		label: "Qwen: Qwen3 VL 8B Instruct",
		provider: "OpenRouter",
	},
	{
		value: "custom",
		label: "Custom Model",
		provider: "Custom",
	},
] as const;
