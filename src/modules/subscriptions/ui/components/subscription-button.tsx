import { Button, ButtonProps } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";

interface SubscriptionButtonProps {
  onClick: ButtonProps["onClick"];
  disabled: boolean;
  isSubscribed: boolean;
  className?: string;
  size?: ButtonProps["size"];
}

function SubscriptionButton({
  disabled,
  isSubscribed,
  onClick,
  className,
  size,
}: SubscriptionButtonProps) {
  const { isSignedIn } = useAuth();
  if (!isSignedIn)
    return <Skeleton className="rounded-full w-[85px] h-[30px]" />;

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn("rounded-full", className)}
      size={size}
      variant={isSubscribed ? "secondary" : "default"}
    >
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  );
}

export default SubscriptionButton;
