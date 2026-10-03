"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatBRL } from "@/lib/format";

export type HeroSlide = {
  id: string;
  slug: string;
  name: string;
  price: string;
  image: string | null;
};

const SLIDE_DURATION = 5000;
const SWIPE_THRESHOLD = 50;

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // comeca em false (igual ao servidor) e so ajusta apos montar no cliente,
  // para nao gerar mismatch de hidratacao - matchMedia nao existe no servidor
  const [reduceMotion, setReduceMotion] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dragStartX = useRef<number | null>(null);
  const dragDeltaX = useRef(0);

  const goTo = useCallback(
    (i: number) => setIndex((i + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduceMotion(query.matches);
    // sincroniza o estado inicial com a media query do navegador (so existe no cliente)
    onChange();
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (paused || slides.length <= 1 || reduceMotion) return;

    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, slides.length, reduceMotion, index]);

  function handlePointerDown(e: React.PointerEvent) {
    dragStartX.current = e.clientX;
    dragDeltaX.current = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setPaused(true);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (dragStartX.current === null) return;
    dragDeltaX.current = e.clientX - dragStartX.current;
  }

  function handlePointerUp() {
    if (dragDeltaX.current > SWIPE_THRESHOLD) goTo(index - 1);
    else if (dragDeltaX.current < -SWIPE_THRESHOLD) goTo(index + 1);
    dragStartX.current = null;
    dragDeltaX.current = 0;
    setPaused(false);
  }

  if (slides.length === 0) return null;

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-surface-border bg-surface h-[320px] sm:h-[420px] md:h-[560px] touch-pan-y select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          aria-hidden={i !== index}
          className="absolute inset-0 transition-opacity duration-700 ease-out overflow-hidden"
          style={{ opacity: i === index ? 1 : 0, pointerEvents: i === index ? "auto" : "none" }}
        >
          {slide.image && (
            <div
              className="absolute inset-0"
              style={{
                animation:
                  i === index && !reduceMotion
                    ? `kenburns ${SLIDE_DURATION * (slides.length > 1 ? 1 : 1.6)}ms ease-out forwards`
                    : "none",
              }}
            >
              <Image
                src={slide.image}
                alt={slide.name}
                fill
                priority={i === 0}
                sizes="(min-width: 768px) 1152px, 100vw"
                className="object-cover"
                draggable={false}
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 flex items-end justify-between gap-4">
            <div
              style={{
                animation: i === index && !reduceMotion ? "slide-up-in 600ms ease-out 120ms both" : "none",
              }}
            >
              <h2 className="font-display text-3xl md:text-5xl text-white tracking-tight max-w-md">
                {slide.name}
              </h2>
              <p className="text-gold-soft text-lg md:text-xl font-semibold mt-2">
                {formatBRL(slide.price)}
              </p>
              <Link
                href={`/produtos/${slide.slug}`}
                className="inline-block mt-4 rounded-lg bg-gold text-black font-medium px-5 py-2.5 text-sm hover:brightness-110 hover:scale-105 active:scale-100 transition"
              >
                Ver produto
              </Link>
            </div>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Slide anterior"
            onClick={() => goTo(index - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 hover:scale-110 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Proximo slide"
            onClick={() => goTo(index + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 hover:scale-110 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 right-6 flex gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Ir para slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={`relative h-1.5 rounded-full overflow-hidden transition-all ${
                  i === index ? "w-8 bg-white/25" : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
              >
                {i === index && (
                  <span
                    key={`${index}-${paused}`}
                    className="absolute inset-y-0 left-0 bg-gold rounded-full"
                    style={{
                      animation:
                        !paused && !reduceMotion
                          ? `progress-grow ${SLIDE_DURATION}ms linear forwards`
                          : "none",
                      width: paused || reduceMotion ? "100%" : undefined,
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
