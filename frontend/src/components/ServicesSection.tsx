"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollTriggerCoordinator } from "@/lib/scrollTriggerCoordinator";

const services = [
    {
        id: "01",
        title: "Miniature Model Making",
        description: (
            <>
                <strong>Industrial Models:</strong> Factory Layouts | Manufacturing Plants | Warehouses | Production Line &amp; Machinery Flow<br />
                <strong>Architectural Models:</strong> Townships | Commercial Complexes | SEZ | IT Parks | Institutional Buildings<br />
                <strong>Interior Models:</strong> Office Layout Models | Showroom Setups | Retail Store Models
            </>
        ),
        image: "/images/IMG_20210915_191342.jpg",
    },
    {
        id: "02",
        title: "Momento",
        description: (
            <>
                <strong>Corporate Mementos:</strong> Awards | Recognition Trophies | Achievement Models | Executive Gifts<br />
                <strong>Architectural Mementos:</strong> Building Replicas | Project Models | Landmark Replicas | Custom Scale Models<br />
                <strong>Custom Mementos:</strong> Personalized Models | Logo Displays | Commemorative Pieces | Premium Gifting
            </>
        ),
        image: "/images/memento.png",
    },
    {
        id: "03",
        title: "Allied Services",
        description: (
            <>
                <strong>Visualization Services:</strong> 3D Visualization | Architectural Renders | Walkthroughs | Presentation Models<br />
                <strong>Model Services:</strong> Model Photography | Model Videography | Scale Model Finishing | Custom Modifications<br />
                <strong>Logistics &amp; Support:</strong> BOQ &amp; Material Selection | Safe Packaging | Pan-India Delivery | Installation Support
            </>
        ),
        image: "/images/IMG_0721.JPG",
    }
];

export default function ServicesSection() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const textsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (!wrapperRef.current || !sectionRef.current) return;

        const SECTION_ID = "services-section";
        scrollTriggerCoordinator.register(SECTION_ID);

        let ctx: gsap.Context | undefined;
        let raf1 = 0;
        let raf2 = 0;

        raf1 = requestAnimationFrame(() => {
            raf2 = requestAnimationFrame(() => {
                ctx = gsap.context(() => {
                    let currentIndex = 0;

                    const goToStep = (nextIndex: number) => {
                        if (nextIndex === currentIndex) return;

                        // Fade out current text
                        gsap.to(textsRef.current[currentIndex], {
                            y: -50, opacity: 0, duration: 0.6, ease: "power2.inOut", overwrite: "auto",
                        });

                        if (nextIndex > currentIndex) {
                            // Scrolling down: reveal next card(s)
                            for (let i = currentIndex + 1; i <= nextIndex; i++) {
                                gsap.fromTo(
                                    cardsRef.current[i],
                                    { clipPath: "inset(50% round 24px)", zIndex: i + 1 },
                                    { clipPath: "inset(0% round 24px)", duration: 1, ease: "power3.out", overwrite: "auto" }
                                );
                            }
                        } else {
                            // Scrolling up: shrink current card(s) out
                            for (let i = currentIndex; i > nextIndex; i--) {
                                gsap.to(cardsRef.current[i], {
                                    clipPath: "inset(50% round 24px)", duration: 1, ease: "power3.out", overwrite: "auto",
                                });
                            }
                        }

                        // Fade in next text
                        gsap.fromTo(
                            textsRef.current[nextIndex],
                            { y: 50, opacity: 0 },
                            { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: "power2.out", overwrite: "auto" }
                        );

                        currentIndex = nextIndex;
                    };

                    // Initial states
                    gsap.set(cardsRef.current[0], { clipPath: "inset(0% round 24px)", zIndex: 1 });
                    gsap.set(textsRef.current[0], { opacity: 1, y: 0 });
                    for (let i = 1; i < services.length; i++) {
                        gsap.set(cardsRef.current[i], { clipPath: "inset(50% round 24px)", zIndex: i + 1 });
                        gsap.set(textsRef.current[i], { opacity: 0, y: 50 });
                    }

                    gsap.set(progressBarRef.current, { transformOrigin: "left center", scaleX: 0 });

                    // Progress bar (scrubbed)
                    ScrollTrigger.create({
                        trigger: wrapperRef.current,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 1,
                        onUpdate: (self) => {
                            if (progressBarRef.current) {
                                gsap.set(progressBarRef.current, { scaleX: self.progress });
                            }
                        },
                    });

                    // Discrete triggers for card transitions
                    services.forEach((_, i) => {
                        if (i === 0) return;
                        ScrollTrigger.create({
                            trigger: `#dummy-${i}`,
                            start: "top 50%",
                            onEnter: () => goToStep(i),
                            onLeaveBack: () => goToStep(i - 1),
                        });
                    });
                }, wrapperRef);

                ScrollTrigger.refresh();
                scrollTriggerCoordinator.ready(SECTION_ID);
            });
        });

        return () => {
            cancelAnimationFrame(raf1);
            cancelAnimationFrame(raf2);
            scrollTriggerCoordinator.ready(SECTION_ID);
            if (ctx) ctx.revert();
        };
    }, []);

    return (
        <div ref={wrapperRef} id="services-section" className="relative h-[300vh]">
            {/* Dummy triggers for scroll steps */}
            <div id="dummy-1" className="absolute top-[100vh] h-[100vh] w-full pointer-events-none" />
            <div id="dummy-2" className="absolute top-[200vh] h-[100vh] w-full pointer-events-none" />

            <section
                ref={sectionRef}
                className="sticky top-0 z-10 bg-[#f5f2ec] text-black h-screen flex flex-col items-center justify-center overflow-hidden pt-10"
            >
                {/* Section Header */}
                <div className="w-[90vw] max-w-[1200px] mb-6 md:mb-8 z-30">
                    <div className="flex items-center gap-4 mb-2 sm:mb-3">
                        <div className="w-10 md:w-12 h-[1px] bg-black/20"></div>
                        <p className="text-black/50 text-[10px] md:text-[11px] tracking-[0.25em] uppercase font-medium">Our Expertise</p>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4rem] font-bold tracking-tight text-black leading-[1.05]">
                        OUR SERVICES
                    </h2>
                </div>

                {/* Unified Card Container */}
                <div className="relative w-[90vw] max-w-[1200px] h-[65vh] max-h-[700px] rounded-[24px] overflow-hidden shadow-2xl mb-16">
                    {/* Stacked service cards — each is a full card with image bg + text overlay */}
                    {services.map((service, index) => (
                        <div
                            key={`card-${service.id}`}
                            ref={(el) => {
                                cardsRef.current[index] = el;
                            }}
                            className="absolute inset-0"
                        >
                            {/* Full-bleed background image */}
                            <img
                                src={service.image}
                                alt={service.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />

                            {/* Gradient overlay — stronger for text legibility */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: "linear-gradient(to top, rgba(17,17,17,0.95) 0%, rgba(17,17,17,0.8) 30%, rgba(17,17,17,0.4) 60%, transparent 100%)",
                                }}
                            />

                            {/* Text content overlay — positioned at bottom */}
                            <div
                                ref={(el) => {
                                    textsRef.current[index] = el;
                                }}
                                className="absolute inset-x-0 bottom-0 pointer-events-none"
                            >
                                <div className="p-6 sm:p-8 md:p-10 lg:p-14 xl:p-16 w-full max-w-4xl">
                                    {/* Service number */}
                                    <span className="text-white/60 font-mono text-[10px] sm:text-xs lg:text-sm tracking-[0.2em] uppercase block mb-3 lg:mb-4">
                                        /{service.id}
                                    </span>

                                    {/* Service title */}
                                    <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold mb-4 md:mb-5 lg:mb-6 text-white leading-[1.05] tracking-tight">
                                        {service.title}
                                    </h3>

                                    {/* Thin separator */}
                                    <div className="w-16 md:w-20 h-[1px] bg-white/20 mb-4 md:mb-5 lg:mb-6" />

                                    {/* Service description */}
                                    <div className="text-white/80 max-w-[600px] leading-relaxed text-sm sm:text-base md:text-lg space-y-1 font-light">
                                        {service.description}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Progress Bar — below the card */}
                <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 w-[min(300px,60vw)] h-[2px] bg-black/10 rounded-full overflow-hidden z-20">
                    <div
                        ref={progressBarRef}
                        className="absolute top-0 left-0 h-full bg-black w-full"
                    />
                </div>

                {/* Step indicators — small dots */}
                <div className="absolute bottom-4 md:bottom-6 right-8 md:right-12 lg:right-16 xl:right-20 flex items-center gap-3 z-20 hidden md:flex">
                    {services.map((service) => (
                        <span
                            key={`dot-${service.id}`}
                            className="text-black/30 font-mono text-[10px] tracking-[0.15em] uppercase"
                        >
                            {service.id}
                        </span>
                    ))}
                </div>
            </section>
        </div>
    );
}
