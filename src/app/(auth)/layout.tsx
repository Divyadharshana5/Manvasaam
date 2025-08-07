import Image from "next/image";
import Link from "next/link";
import Logo from "../../../Public/bg-agri.png"
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center auth-layout-background">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2">
      <Image src={Logo} alt=""  />
      {/* <span className="text-xl font-bold text-primary">Manvaasam</span>   */}
       
      </Link>
      {children}
    </div>
  );
}
