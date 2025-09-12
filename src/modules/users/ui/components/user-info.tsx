import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const userInfoVarints = cva("flex items-center gap-1", {
  variants: {
    size: {
      default: "[&_p]:text-sm [&_svg]:size-4", // [&-p]:text-sm means select all p and apply text-sm
      lg: "[&_p]:text-base [&_svg]:size-5 [&_p]:font-medium [&_p]:text-black",
      sm: "[&_p]:text-xs [&_svg]:size-3.5",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface UserInfoProps extends VariantProps<typeof userInfoVarints> {
  name: string;
  className?: string;
}
function UserInfo({ name, className, size }: UserInfoProps) {
  return (
    // flex items-center gap-1 styles that we defined in cva as base style goes into this div
    <div className={cn(userInfoVarints({ size, className }))}>
      <Tooltip>
        <TooltipTrigger asChild>
          <p className="text-gray-500 hover:text-gray-800 line-clamp-1">
            {name}
          </p>
        </TooltipTrigger>
        <TooltipContent align="center" className="bg-black/70">
          {name}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export default UserInfo;
