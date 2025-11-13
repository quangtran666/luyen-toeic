"use client";

import { Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useConfiguration } from "@/features/configuration/context/configuration-context";

interface SettingsButtonProps {
	onClick: () => void;
}

export function SettingsButton({ onClick }: SettingsButtonProps) {
	const { isConfigured } = useConfiguration();

	return (
		<div className="relative">
			<Button
				variant="outline"
				size="icon"
				onClick={onClick}
				className="fixed right-4 top-4 z-50 size-12 cursor-pointer rounded-full shadow-lg sm:right-6 sm:top-6"
				aria-label={
					isConfigured
						? "Mở cài đặt"
						: "Mở cài đặt - Cần cấu hình model và API key"
				}
				title={isConfigured ? "Cài đặt" : "Cài đặt - Cần cấu hình"}
			>
				<Settings className="size-5" />
			</Button>

			{/* Configuration status indicator */}
			{!isConfigured && (
				<Badge
					variant="destructive"
					className="fixed right-3 top-3 z-50 size-3 rounded-full border-2 border-white p-0 dark:border-zinc-950 sm:right-5 sm:top-5"
					aria-hidden="true"
				/>
			)}
		</div>
	);
}
