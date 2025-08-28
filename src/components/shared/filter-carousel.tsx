"use client";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

interface FilterCarouselProps {
  value?: string | null;
  isLoading?: boolean;
  onSelect: (value: string | null) => void; //required
  data: { value: string; label: string }[]; //required
}

function FilterCarousel({
  data,
  isLoading,
  onSelect,
  value, //categoryId in url type is undefined | string
}: FilterCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState<number>(0); //current number of item in carousel
  const [count, setCount] = useState<number>(0); //total number of items in carousel

  // we use this to control how many items we have in carousel and which one is active(is current item)
  // then we use current to control hide/show left fade and right fade based on current item position
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="relative w-full">
      {/* left fade */}
      {/* cn() used for make dynamic tailwind classes recommened instead of using js `` */}
      <div
        className={cn(
          "absolute left-12 top-0 buttom-0 w-12 z-10 h-[30px] bg-gradient-to-r from-white to-transparent pointer-events-none",
          current === 1 && "hidden" //mean if first item in carousel is active, hide left fade
        )}
      />
      <Carousel
        setApi={setApi}
        className="w-full px-12"
        opts={{ align: "start", dragFree: true }}
      >
        <CarouselContent className="-ml-3">
          {!isLoading && (
            <CarouselItem
              onClick={() => onSelect(null)} //bcs value parameter is falsy it will reset or deletes query string from url
              className="basis-auto pl-3"
            >
              <Badge
                variant={!value ? "default" : "secondary"}
                className="rounded-lg px-3 py-1 cursor-pointer text-sm whitespace-nowrap"
              >
                All
              </Badge>
            </CarouselItem>
          )}

          {isLoading &&
            Array.from({ length: 14 }).map((_, index) => (
              <CarouselItem key={index} className="basis-auto pl-3">
                <Skeleton className="rounded-lg px-3 py-1 h-full text-sm w-[100px] font-semibold">
                  &nbsp;
                </Skeleton>
              </CarouselItem>
            ))}

          {!isLoading &&
            data.map((item) => (
              <CarouselItem
                onClick={() => onSelect(item.value)} //whenever we click on any category item, item.value(its category id) set ot url as query string
                className="basis-auto pl-3"
                key={item.value}
              >
                {/* we can wrap badge inside Link component and use prefeching feature of it to make querying data faster */}
                <Badge
                  variant={value === item.value ? "default" : "secondary"}
                  className="rounded-lg px-3 py-1 cursor-pointer text-sm whitespace-nowrap"
                >
                  {item.label}
                </Badge>
              </CarouselItem>
            ))}
        </CarouselContent>
        {/* carousel buttons */}
        <CarouselPrevious
          className="left-0 z-20 disabled:hidden"
          // className={cn("left-0 z-20", current === 1 && "hidden")}
        />
        <CarouselNext
          className="right-0 z-20 disabled:hidden"
          // className={cn("right-0 z-20", current === count && "hidden")}
        />
      </Carousel>
      {/* right fade */}
      <div
        className={cn(
          "absolute right-12 top-0 buttom-0 w-12 z-10 h-[30px] bg-gradient-to-l from-white to-transparent pointer-events-none",
          current === count && "hidden" //if current item is last item in carousel( equals to total items in carousel), hide right fade
        )}
      />
    </div>
  );
}

export default FilterCarousel;
