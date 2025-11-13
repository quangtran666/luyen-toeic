export interface ModelConfiguration {
	model: string;
	apiKey: string;
}

export interface ConfigurationContextValue {
	configuration: ModelConfiguration | null;
	isConfigured: boolean;
	updateConfiguration: (config: ModelConfiguration) => void;
	clearConfiguration: () => void;
}

export interface ModelOption {
	readonly value: string;
	readonly label: string;
	readonly provider: string;
}
