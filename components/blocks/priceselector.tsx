"use client";

import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";
import { FormBuilder } from "./formBuilder";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { onDoctorBoardingSchema4 } from "@/lib/schema";

interface PriceInputProps {
  className?: string;
  suggestedPrices?: number[];
  form: UseFormReturn<z.output<typeof onDoctorBoardingSchema4>>;
}
export function PriceInput({
  className,
  form,
  suggestedPrices = [50.0, 100.0, 200.0, 250.0, 300.0],
}: PriceInputProps) {
  const handleIncrement = () => {
    const currentValue = rate || 0;
    form.setValue("rate", Number((currentValue + 1).toFixed(2)));
  };

  const rate = useMemo(() => {
    return form.watch("rate");
  }, [form]);

  const handleDecrement = () => {
    const currentValue = rate || 0;
    if (currentValue > 0) {
      form.setValue("rate", Number((currentValue - 1).toFixed(2)));
    }
  };
  const handleSliderChange = (value: number[]) => {
    form.setValue("rate", Number(value[0].toFixed(2)));
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <div className="relative">
            <span className="font-medium absolute top-[56%] left-2">
              GHS
            </span>
            <FormBuilder label="Set consultation fee" name="rate">
              <Input
                type="number"
                className="pl-11 pr-20 text-lg"
                placeholder="0.00"
              />
            </FormBuilder>
          </div>
          <div className="absolute right-2 top-[75%] -translate-y-1/2 flex flex-col">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-5 px-1"
              onClick={handleIncrement}
              aria-label="Increase price"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-5 px-1"
              onClick={handleDecrement}
              aria-label="Decrease price"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="pt-4">
        <Slider
          min={30}
          max={1000}
          step={20}
          onValueChange={handleSliderChange}
          aria-label="Adjust price"
          defaultValue={[rate]}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestedPrices.map((price) => (
          <Button
            key={price}
            variant="outline"
            size="sm"
            type="button"
            onClick={() => form.setValue("rate", Number(price.toFixed(2)))}
          >
            {formatCurrency(price)}
          </Button>
        ))}
      </div>
    </div>
  );
}
