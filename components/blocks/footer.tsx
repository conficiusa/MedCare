"use client";
import { cn } from "@/lib/utils";
import { Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  return (
    <footer
      className={cn(
        "min-h-[50dvh] w-full container bg-black text-white z-50",
        pathname.includes("dashboard") && "hidden"
      )}
    >
      <div className="grid lg:grid-cols-[400px_1fr] md:p-10 border-b border-muted-foreground max-md:py-5 gap-y-5">
        <div className="hidden md:block">
          <h1 className="text-xl font-medium tracking-wide mb-5">
            Medcare Hub
          </h1>

          <ul className="text-sm text-muted-foreground md:space-y-3 max-md:flex max-md:item-center max-md:gap-3">
            <li className="flex items-center gap-2 pr-2">
              <Mail size={16} className="inline " />
              <a href="mailto:example@example.com">example@example.com</a>
            </li>

            <li className="flex items-center gap-2">
              <Mail size={16} className="inline " />
              <a href="0249906015">0249906015</a>
            </li>
          </ul>
          <div className="pt-5">
            <ul className="flex gap-3 items-center">
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="24"
                  height="24"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#0288D1"
                    d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"
                  ></path>
                  <path
                    fill="#FFF"
                    d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"
                  ></path>{" "}
                </svg>
                <span className="sr-only"></span>
              </li>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="24"
                  height="24"
                  viewBox="0 0 30 30"
                  className="fill-current text-white"
                >
                  {" "}
                  <path d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z"></path>{" "}
                </svg>
              </li>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="24"
                  height="24"
                  viewBox="0 0 48 48"
                >
                  {" "}
                  <path
                    fill="#039be5"
                    d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"
                  ></path>
                  <path
                    fill="#fff"
                    d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"
                  ></path>{" "}
                </svg>
              </li>
            </ul>
          </div>
        </div>
        <div className="grid md:grid-cols-3 grid-cols-2 gap-y-5 gap-x-3">
          <div>
            <h5 className="text-xs text-muted-foreground font-medium mb-4">
              Product
            </h5>
            <ul className="text-sm space-y-3">
              <li>
                <Link href="/rent">Our services</Link>
              </li>
              <li>
                <Link href="/rent">List your Practice</Link>
              </li>
              <li>
                <Link href="/pricing">Pricing</Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs text-muted-foreground font-medium mb-4">
              Company
            </h5>
            <ul className="text-sm space-y-3">
              <li>
                <Link href="/about-us">About us</Link>
              </li>
              <li>
                <Link href="/pricing">Why Medcare Hub</Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs text-muted-foreground font-medium mb-4">
              Support
            </h5>
            <ul className="text-sm space-y-3">
              <li>
                <Link href="/rent">Contact us</Link>
              </li>
              <li>
                <Link href="/rent">Locate us</Link>
              </li>
              <li>
                <Link href="/rent">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/pricing">FAQ.</Link>
              </li>
              <li>
                <Link href="/pricing">Terms of service</Link>
              </li>
            </ul>
          </div>
          <div className="md:hidden">
            <ul className="text-sm text-muted-foreground space-y-3">
              <li className="flex items-center gap-2 ">
                <MapPin size={16} className="inline " /> Tamale, Ghana
              </li>
              <li className="flex items-center gap-2 ">
                <Mail size={16} className="inline " />
                <a href="mailto:example@example.com">example@example.com</a>
              </li>

              <li className="flex items-center gap-2">
                <Mail size={16} className="inline " />
                <a href="0249906015">0249906015</a>
              </li>
            </ul>
            <div className="pt-5">
              <ul className="flex gap-3 items-center">
                <li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="24"
                    height="24"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#0288D1"
                      d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"
                    ></path>
                    <path
                      fill="#FFF"
                      d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"
                    ></path>{" "}
                  </svg>
                  <span className="sr-only"></span>
                </li>
                <li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="24"
                    height="24"
                    viewBox="0 0 30 30"
                    className="fill-current text-white"
                  >
                    {" "}
                    <path d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z"></path>{" "}
                  </svg>
                </li>
                <li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="24"
                    height="24"
                    viewBox="0 0 48 48"
                  >
                    {" "}
                    <path
                      fill="#039be5"
                      d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"
                    ></path>
                    <path
                      fill="#fff"
                      d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"
                    ></path>{" "}
                  </svg>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="py-2 md:px-10 md:py-5">
        <div className="text-sm text-muted-foreground font-semibold space-y-4">
          <p>Expert care from the comfort of your home, choose Medcare Hub</p>
          <p>
            &copy; {new Date().getFullYear()} Medcare Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
