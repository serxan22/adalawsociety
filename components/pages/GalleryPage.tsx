"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Camera, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { Badge } from "@/components/ui/badge";
import { EditableImage } from "@/components/cms/EditableImage";
import { EditableText } from "@/components/cms/EditableText";
import { useContent } from "@/lib/content/ContentContext";
import { cn } from "@/lib/utils";

const ASPECTS = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[2/3]", "aspect-[5/4]"];

const galleryImages = [
  {
    key: "gallery.image.1",
    fallback: "/images/placeholders/gallery-1.jpg",
    captionKey: "gallery.caption.1",
    caption: "Moot Court Finals Night",
  },
  {
    key: "gallery.image.2",
    fallback: "/images/placeholders/gallery-2.jpg",
    captionKey: "gallery.caption.2",
    caption: "Legal Talks Series",
  },
  {
    key: "gallery.image.3",
    fallback: "/images/placeholders/gallery-3.jpg",
    captionKey: "gallery.caption.3",
    caption: "Debate Championship",
  },
  {
    key: "gallery.image.4",
    fallback: "/images/placeholders/gallery-4.jpg",
    captionKey: "gallery.caption.4",
    caption: "Academic Excursion",
  },
  {
    key: "gallery.image.5",
    fallback: "/images/placeholders/event-1.jpg",
    captionKey: "gallery.caption.5",
    caption: "Orientation Week",
  },
  {
    key: "gallery.image.6",
    fallback: "/images/placeholders/event-2.jpg",
    captionKey: "gallery.caption.6",
    caption: "Blog Editorial Meeting",
  },
  {
    key: "gallery.image.7",
    fallback: "/images/placeholders/event-3.jpg",
    captionKey: "gallery.caption.7",
    caption: "Guest Lecture",
  },
  {
    key: "gallery.image.8",
    fallback: "/images/placeholders/event-4.jpg",
    captionKey: "gallery.caption.8",
    caption: "Team Building Retreat",
  },
  {
    key: "gallery.image.9",
    fallback: "/images/placeholders/event-5.jpg",
    captionKey: "gallery.caption.9",
    caption: "Networking Night",
  },
  {
    key: "gallery.image.10",
    fallback: "/images/placeholders/event-6.jpg",
    captionKey: "gallery.caption.10",
    caption: "Graduation Ceremony",
  },
] as const;

export function GalleryPage() {
  const { editMode, isSuperAdmin, getValue } = useContent();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const editing = editMode && isSuperAdmin;

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const showPrev = useCallback(
    () =>
      setLightboxIndex((current) =>
        current === null ? null : (current - 1 + galleryImages.length) % galleryImages.length,
      ),
    [],
  );
  const showNext = useCallback(
    () => setLightboxIndex((current) => (current === null ? null : (current + 1) % galleryImages.length)),
    [],
  );

  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, closeLightbox, showPrev, showNext]);

  const activeImage = lightboxIndex === null ? null : galleryImages[lightboxIndex];

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#3F6076] to-[#2F4C60] py-18 text-white md:py-22">
        <div className="absolute inset-0 hero-grid opacity-[0.14]" aria-hidden="true" />
        <div className="container-wide relative text-center">
          <Reveal className="mx-auto max-w-4xl">
            <Badge variant="light" className="mx-auto gap-2">
              <Camera className="h-4 w-4" aria-hidden="true" />
              <EditableText contentKey="gallery.eyebrow" fallback="ALS Moments" tag="span" />
            </Badge>
            <h1 className="mt-6 text-balance text-4xl font-black leading-tight md:text-6xl">
              <EditableText contentKey="gallery.title" fallback="Gallery" tag="span" />
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-white/78 md:text-lg">
              <EditableText
                contentKey="gallery.intro"
                fallback="A living record of debates, moot courts, talks, and community moments from ADA Law Society."
                tag="span"
              />
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-gradient-to-br from-[#3F6076] to-[#2F4C60]">
        <div className="container-wide">
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
            {galleryImages.map((item, index) => (
              <Reveal key={item.key} delay={index * 0.05} className="mb-5 break-inside-avoid">
                <div
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] shadow-[0_18px_50px_rgba(16,24,40,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(16,24,40,0.22)]",
                    ASPECTS[index % ASPECTS.length],
                    !editing && "cursor-zoom-in",
                  )}
                  onClick={!editing ? () => setLightboxIndex(index) : undefined}
                  role={!editing ? "button" : undefined}
                  tabIndex={!editing ? 0 : undefined}
                  onKeyDown={
                    !editing
                      ? (event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setLightboxIndex(index);
                          }
                        }
                      : undefined
                  }
                >
                  <EditableImage
                    contentKey={item.key}
                    fallback={item.fallback}
                    alt={item.caption}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition duration-500 group-hover:scale-105"
                  />
                  {!editing ? (
                    <>
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition duration-300 group-hover:opacity-100" />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 p-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <p className="text-sm font-bold text-white">
                          <EditableText contentKey={item.captionKey} fallback={item.caption} tag="span" />
                        </p>
                      </div>
                      <div className="pointer-events-none absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-black/30 text-white opacity-0 backdrop-blur transition duration-300 group-hover:opacity-100">
                        <ZoomIn className="h-4 w-4" aria-hidden="true" />
                      </div>
                    </>
                  ) : null}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeImage ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Gallery image viewer"
            onClick={closeLightbox}
          >
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close"
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition hover:border-white/40 hover:bg-white/20"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showPrev();
              }}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition hover:border-white/40 hover:bg-white/20 md:left-6"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-14 flex max-h-[80vh] w-full max-w-4xl flex-col items-center gap-4 md:mx-24"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative h-[65vh] w-full overflow-hidden rounded-lg border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
                <Image
                  src={getValue(activeImage.key, activeImage.fallback)}
                  alt={activeImage.caption}
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 768px) 90vw, 70vw"
                />
              </div>
              <div className="flex items-center gap-3 text-center">
                <p className="text-sm font-semibold text-white/85">
                  <EditableText contentKey={activeImage.captionKey} fallback={activeImage.caption} tag="span" />
                </p>
                <span className="h-1 w-1 rounded-full bg-white/40" aria-hidden="true" />
                <p className="text-xs font-medium text-white/50">
                  {lightboxIndex! + 1} / {galleryImages.length}
                </p>
              </div>
            </motion.div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
              aria-label="Next image"
              className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition hover:border-white/40 hover:bg-white/20 md:right-6"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
