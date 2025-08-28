import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Avatar, AvatarImage } from "../ui/avatar";
// first argument in CVA is base class, in this case all variants are different from each other
const avatarVariants = cva("", {
  variants: {
    size: {
      default: "h-9 w-9",
      xs: "h-4 w-4",
      sm: "h-6 w-6",
      lg: "h-10 w-10",
      xl: "h-[160px] w-[160px]",
    },
  },

  defaultVariants: {
    size: "default",
  },
});

// we didnt define size property in interface
// but UserAvatar can also accept size prop bcs we extended interface to VariantsProps
interface UserAvatarProps extends VariantProps<typeof avatarVariants> {
  imageUrl: string;
  name: string;
  className?: string; //in case we want to add our own classes
  onClick?: () => void;
}

function UserAvatar({
  imageUrl,
  size,
  className,
  onClick,
  name,
}: UserAvatarProps) {
  return (
    <Avatar
      className={cn(avatarVariants({ size, className }))}
      onClick={onClick}
    >
      <AvatarImage src={imageUrl} alt={name} />
    </Avatar>
  );
}

export default UserAvatar;
