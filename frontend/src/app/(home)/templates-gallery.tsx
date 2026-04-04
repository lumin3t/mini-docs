"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { cn } from "@/lib/utils";
import templates from "@/constants/templates";

export const TemplatesGallery = () => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const onTemplateClick = async (title: string, initialContent: any) => {
    try {
      setIsCreating(true);

      const content =
        initialContent && Object.keys(initialContent).length > 0
          ? initialContent
          : { type: "doc", content: [] };

      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      // ✅ SAFER DEBUG
      if (!response.ok) {
        const text = await response.text();
        console.error("API ERROR:", text);
        throw new Error("Failed to create document");
      }

      const data = await response.json();

      if (!data?._id) {
        throw new Error("Invalid response from server");
      }

      router.push(`/documents/${data._id}`);
    } catch (error) {
      console.error("Creation failed:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-[#F1F3F4]">
      <div className="max-w-screen-xl mx-auto px-16 py-8 flex flex-col gap-y-4">
        <h3 className="font-medium text-gray-700">
          Start a new document
        </h3>

        <Carousel>
          <CarouselContent className="-ml-4">
            {templates.map((template) => (
              <CarouselItem
                key={template.id}
                className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-[14.285714%] pl-4"
              >
                <div
                  className={cn(
                    "flex flex-col gap-y-2.5",
                    isCreating && "pointer-events-none opacity-50"
                  )}
                >
                  <button
                    disabled={isCreating}
                    onClick={() =>
                      onTemplateClick(
                        template.label,
                        template.initialContent
                      )
                    }
                    className={cn(
                      "aspect-[3/4] w-full rounded-sm bg-white bg-center bg-no-repeat bg-cover hover:border-blue-500 hover:shadow-sm transition-all flex items-center justify-center group",
                      isCreating && "cursor-wait"
                    )}
                    style={{
                      backgroundImage: template.imageUrl
                        ? `url(${template.imageUrl})`
                        : "none",
                    }}
                  >
                    {!template.imageUrl && (
                      <span className="text-4xl text-blue-600 font-light group-hover:scale-110 transition-transform">
                        +
                      </span>
                    )}
                  </button>

                  <p className="text-sm font-medium text-gray-600 truncate">
                    {template.label}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="hidden md:flex -left-12 hover:bg-white" />
          <CarouselNext className="hidden md:flex -right-12 hover:bg-white" />
        </Carousel>
      </div>
    </div>
  );
};