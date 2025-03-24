import { cn } from "@/lib/utils";
import Image from "next/image";

type LogoProps = {
	// Define the size prop with default value
	size?: "small" | "medium" | "large";
	// Define the className prop
	className?: string;
} & React.ComponentPropsWithoutRef<"div">;

const Logo = ({
	className,
	size = "medium",
	...props
}: {
	className?: string;
	size?: "small" | "medium" | "large";
}) => {
	// Define fixed dimensions based on size prop
	const dimensions = {
		small: { width: 24, height: 24 },
		medium: { width: 62, height:62 },
		large: { width: 100, height: 100 },
	};

	const { width, height } = dimensions[size];

	return (
		<div style={{ width }} className='relative flex-shrink-0' {...props}>
			<Image
				src={"/logo1.png"}
				alt='logo'
				width={width}
				height={height}
				className={cn("object-contain", className)}
				priority={true}
			/>
		</div>
	);
};

export default Logo;
