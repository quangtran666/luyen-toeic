import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
	return (
		<div className="container mx-auto max-w-2xl p-4 flex items-center justify-center min-h-screen">
			<Card className="w-full text-center">
				<CardHeader>
					<div className="mx-auto mb-4 text-6xl font-bold text-muted-foreground">
						404
					</div>
					<CardTitle className="text-2xl">Page Not Found</CardTitle>
					<CardDescription>
						The page you are looking for does not exist or has been moved
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						You might have followed a broken link or entered an incorrect URL
					</p>
				</CardContent>
				<CardFooter className="flex justify-center">
					<Button asChild>
						<Link href="/">Return Home</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
