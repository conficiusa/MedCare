import { MapPin, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/blocks/sidebar";
import { auth } from "@/auth";
import UserDp from "@/components/blocks/userDP";
import { ThemeToggler } from "@/components/blocks/themeToggler";
import { cn } from "@/lib/utils";
import Logo from "./logo";
import DoctorUserDp from "./doctorUserDp";
// import { gugi } from "@/lib/fonts";

const Navbar = async () => {
  const session = await auth();
  return (
    <header className="md:container max-md:px-2 sticky top-0 left-0 py-4 bg-background/95 duration-500 flex items-center w-full z-50 backdrop-blur-[5.9px] backdrop-saturate-[180%] border-b-[1px]">
      <nav className="flex w-full justify-between items-center">
        <div className="flex items-center gap-3  max-sm:w-full">
          <div>
            <Sidebar session={session}>
              <Button size={"icon"} variant="ghost">
                <Menu className="w-5 h-5" />
              </Button>
            </Sidebar>
          </div>
          <Link href="/">
            {/* // TODO: add back gugi */}
            <h1
              className={cn(
                "text-md  lg:text-xl font-bold flex items-center gap-1 "
              )}
            >
              MedCare Hub <Logo className="w-8 h-8" />
            </h1>
          </Link>
        </div>

        <div className="flex sm:hidden items-center gap-5">
          {session ? (
            <div>
              {session?.user?.role === "patient" ? (
                <UserDp />
              ) : (
                <DoctorUserDp />
              )}
            </div>
          ) : null}
          <ThemeToggler />
        </div>
        <ul className="text-sm sm:flex gap-8 items-center hidden ">
          <li className="hidden md:block">
            <Link href="/referral">
              Refer a friend{" "}
              <sup className="bg-green-100 dark:bg-green-950 text-primary p-[0.2rem] text-xs rounded">
                10% off
              </sup>
            </Link>
          </li>

          {!session ? (
            <>
              <Button asChild className="px-10">
                <Link href="/sign-in"> Join or Sign In</Link>
              </Button>
            </>
          ) : (
            <>
              {session.user.region && session.user.city && (
                <li className="flex justify-center items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 font-normal" />
                  {session.user.region}, {session.user.city}
                </li>
              )}

              {session?.user?.role === "patient" ? (
                <UserDp />
              ) : (
                <DoctorUserDp />
              )}
            </>
          )}
          <ThemeToggler />
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
