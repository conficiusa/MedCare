'use client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

const DashboardBreadcrumb = () => {
  const pathname = usePathname();
  const pathnames = pathname.split("/").filter((x) => x);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          return (
            <BreadcrumbItem
              key={to}
              className={isLast ? "" : "hidden md:block"}
            >
              {isLast ? (
                <BreadcrumbPage>{value}</BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink href={to}>{value}</BreadcrumbLink>
                  <BreadcrumbSeparator className="hidden md:block" />
                </>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DashboardBreadcrumb;
