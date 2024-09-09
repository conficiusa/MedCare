import { MapPin, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/blocks/sidebar";
import SignUpPopover from "@/components/blocks/signupPopover";
import { auth } from "@/auth";
import UserDp from "@/components/blocks/userDP";

const Navbar = async () => {
  const session = await auth();
  return (
    <header className="container sticky top-0 left-0 py-4 bg-background/95 duration-500 flex items-center w-full z-50 backdrop-blur-[5.9px] backdrop-saturate-[180%] border-b-[1px]">
      <nav className="flex w-full justify-between">
        <div className="flex items-center justify-center gap-4">
          <Sidebar>
            <Button size={"icon"} variant="ghost">
              <Menu className="w-5 h-5" />
            </Button>
          </Sidebar>
          <h1 className="text-xl font-semibold"> MedCare Hub</h1>
        </div>
        <ul className="text-sm flex gap-8 items-center">
          <li>
            <Link href="/referral">
              Refer a friend{" "}
              <sup className="bg-teal-100 text-primary p-[0.2rem] text-xs rounded">
                10% off
              </sup>
            </Link>
          </li>
          <li className="flex justify-center items-center gap-2">
            <MapPin className="w-3.5 h-3.5 font-normal" />
            Nothern Region,Tamale
          </li>
          {!session ? (
            <>
              <SignUpPopover>
                <Button variant={"ghost"}>Sign Up</Button>
              </SignUpPopover>
              <Button asChild>
                <Link href="/signin"> Sign In</Link>
              </Button>
            </>
          ) : (
            <UserDp />
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
