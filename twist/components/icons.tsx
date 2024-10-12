import { cn } from "@/lib/utils";
import { HiOutlineLogout } from "react-icons/hi";

export type ValidIcon = keyof typeof Icons;

export const Icons = {
    Logo: ({
        className,
        ...props
    }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h1
            className={cn('text-xl leading-none font-cal', className)}
            {...props}>
            tw
            <span className="text-primary">IST</span>
        </h1>
    ),
    HiOutlineLogout
}