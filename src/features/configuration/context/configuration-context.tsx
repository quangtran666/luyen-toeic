"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { STORAGE_KEY } from "../constants/configuration.constants";
import type {
	ConfigurationContextValue,
	ModelConfiguration,
} from "../types/configuration.types";

const ConfigurationContext = createContext<
	ConfigurationContextValue | undefined
>(undefined);

interface ConfigurationProviderProps {
	children: ReactNode;
}

export function ConfigurationProvider({
	children,
}: ConfigurationProviderProps) {
	const [configuration, setConfiguration] = useState<ModelConfiguration | null>(
		null,
	);
	const [isConfigured, setIsConfigured] = useState(false);

	useEffect(() => {
		const loadConfiguration = () => {
			try {
				if (typeof window === "undefined" || !window.localStorage) {
					console.warn(
						"localStorage is not available. Configuration will not persist.",
					);
					return;
				}

				const stored = localStorage.getItem(STORAGE_KEY);
				if (!stored) {
					return;
				}

				const parsed = JSON.parse(stored) as ModelConfiguration;

				if (parsed.model && parsed.apiKey) {
					setConfiguration(parsed);
					setIsConfigured(true);
				}
			} catch (error) {
				console.error("Failed to load configuration:", error);
			}
		};

		loadConfiguration();
	}, []);

	const updateConfiguration = (config: ModelConfiguration) => {
		try {
			if (typeof window === "undefined" || !window.localStorage) {
				console.warn(
					"localStorage is not available. Configuration will not persist.",
				);
				setConfiguration(config);
				setIsConfigured(true);
				return;
			}

			localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
			setConfiguration(config);
			setIsConfigured(true);
		} catch (error) {
			console.error("Failed to save configuration:", error);
			setConfiguration(config);
			setIsConfigured(true);
		}
	};

	const clearConfiguration = () => {
		try {
			if (typeof window !== "undefined" && window.localStorage) {
				localStorage.removeItem(STORAGE_KEY);
			}
		} catch (error) {
			console.error("Failed to clear configuration:", error);
		}

		setConfiguration(null);
		setIsConfigured(false);
	};

	const value: ConfigurationContextValue = {
		configuration,
		isConfigured,
		updateConfiguration,
		clearConfiguration,
	};

	return <ConfigurationContext value={value}>{children}</ConfigurationContext>;
}

export function useConfiguration() {
	const context = useContext(ConfigurationContext);
	if (context === undefined) {
		throw new Error(
			"useConfiguration must be used within a ConfigurationProvider",
		);
	}
	return context;
}
