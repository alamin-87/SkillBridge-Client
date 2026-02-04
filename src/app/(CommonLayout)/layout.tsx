import { Footer } from "@/components/layouts/footer";
import { Navbar } from "@/components/layouts/Navbar";

export default function commonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar></Navbar>
      {children}
      <Footer></Footer>
    </div>
  );
}
