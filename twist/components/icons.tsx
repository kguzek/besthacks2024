import { cn } from "@/lib/utils";
import { ArrowLeft, ChartPieIcon, Loader2, SettingsIcon, ShieldCheckIcon, UserIcon, ArrowRight, Plus } from "lucide-react";
import { FaAngleRight, FaCircleCheck, FaCrown, FaGithub } from "react-icons/fa6";
import { HiOutlineLogout } from "react-icons/hi";
import { RiSettings4Fill } from "react-icons/ri";

export type ValidIcon = keyof typeof Icons;

export const Icons = {
    Logo: ({
        className,
        ...props
    }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h1
            className={cn('text-2xl font-bold leading-none font-cal', className)}
            {...props}>
            tw
            <span className="text-primary">IST</span>
        </h1>
    ),
    HiOutlineLogout,
    Settings: RiSettings4Fill,
    Crown: FaCrown,
    LogOut: HiOutlineLogout,
    ArrowLeft,
    Right: FaAngleRight,
    Loading: Loader2,
    Profile: UserIcon,
    Safe: ShieldCheckIcon,
    Stats: ChartPieIcon,
    Settings2: SettingsIcon,
    ArrowRight: ArrowRight,
    Plus: Plus,
    Github: FaGithub,
    Done: FaCircleCheck 
}