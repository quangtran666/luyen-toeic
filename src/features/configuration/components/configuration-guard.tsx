"use client";

import type { ReactNode } from "react";
import { useConfiguration } from "../context/configuration-context";

interface ConfigurationGuardProps {
	children: ReactNode;
	fallback?: ReactNode;
}

export function ConfigurationGuard({
	children,
	fallback,
}: ConfigurationGuardProps) {
	const { isConfigured } = useConfiguration();

	if (!isConfigured) {
		return (
			fallback ?? (
				<div className="flex items-center justify-center p-8 text-center text-muted-foreground">
					Vui lòng cấu hình model và API key để bắt đầu
				</div>
			)
		);
	}

	return <>{children}</>;
}
