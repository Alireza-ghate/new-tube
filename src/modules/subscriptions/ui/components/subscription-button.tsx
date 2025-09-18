import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn("rounded-full", className)}
      size={size}
      variant={isSubscribed ? "secondary" : "default"} //if user has already subscribed so show this version of btn
    >
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  );
}

export default SubscriptionButton;
