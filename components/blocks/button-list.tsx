"use client";
import { Option } from "@/components/ui/multi-select";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ButtonList = ({ specializations }: { specializations: Option[] }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleClick = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <>
      {specializations.slice(0, 18).map((item, index) => (
        <Button
          key={index}
          variant="default"
          className="flex items-center gap-2"
          onClick={() => handleClick(item?.value)}
        >
          {item?.label} <ArrowRight className="w-4 h-4" strokeWidth={1.8} />
        </Button>
      ))}
    </>
  );
};

export default ButtonList;
