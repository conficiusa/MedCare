import { MapPin, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/blocks/sidebar";
import { auth } from "@/auth";
import UserDp from "@/components/blocks/userDP";
import { ThemeToggler } from "@/components/blocks/themeToggler";

const Navbar = async () => {
  const session = await auth();
  return (
    <header className="container sticky top-0 left-0 py-4 bg-background/95 duration-500 flex items-center w-full z-50 backdrop-blur-[5.9px] backdrop-saturate-[180%] border-b-[1px]">
      <nav className="flex w-full justify-between">
        <div className="flex items-center  gap-4 max-sm:w-full">
          <div>
            <Sidebar>
              <Button size={"icon"} variant="ghost">
                <Menu className="w-5 h-5" />
              </Button>
            </Sidebar>
          </div>
          <h1 className="text-lg md:text-lg lg:text-xl font-semibold">
            {" "}
            MedCare Hub
          </h1>
        </div>
        <div className="flex sm:hidden items-center gap-5">
          {session ? (
            <div>
              <UserDp />
            </div>
          ) : (
            <Button asChild size={"sm"}>
              <Link href="/sign-in"> Join or Sign In</Link>
            </Button>
          )}
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

              <UserDp />
            </>
          )}
          <ThemeToggler />
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
