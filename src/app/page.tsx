// @ (alias) refers to the src folder
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Image src="/logo.svg" width={50} height={50} alt="logo" />
      <p className="text-xl font-semibold tracking-tight">NewTube</p>
    </div>
  );
}
