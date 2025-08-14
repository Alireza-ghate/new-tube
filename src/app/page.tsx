// @ (alias) refers to the src folder
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <p className="text-3xl font-bold text-rose-500">
      hello world!
      <Button>click me</Button>
    </p>
  );
}
