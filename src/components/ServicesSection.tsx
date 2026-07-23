"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSmoothScroll } from "./SmoothScrollProvider";

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        id: "01",
        title: "Miniature Model Making",
        description: (
            <>
                <strong>Industrial Models:</strong> Factory Layouts | Manufacturing Plants | Warehouses | Production Line & Machinery Flow<br />
                <strong>Architectural Models:</strong> Townships | Commercial Complexes | SEZ | IT Parks | Institutional Buildings<br />
                <strong>Interior Models:</strong> Office Layout Models | Showroom Setups | Retail Store Models
            </>
        ),
        image: "/images/IMG_20210915_191342.jpg",
    },
    {
        id: "02",
        title: "Allied Services",
        description: (
            <>
                3D Visualization & Walkthroughs | BOQ & Material Selection | Model Photography & Videography | Safe Packaging & Pan-India Delivery
            </>
        ),
        image: "/images/IMG_0721.JPG",
    },
    {
        id: "03",
        title: "Interior Design Services",
        description: (
            <>
                Residential Interiors | Corporate Offices | Retail & Showroom Design | Restaurants & Cafes | Modular Kitchen | False Ceiling & Lighting Design | 2D Layouts & 3D Renders | Turnkey Execution
            </>
        ),
        image: "/images/IMG_0615.jpg",
    }
];

export default function ServicesSection() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
    const textsRef = useRef<(HTMLDivElement | null)[]>([]);
    const { isReady } = useSmoothScroll();

    useEffect(() => {
        if (!isReady || !wrapperRef.current || !sectionRef.current) return;

        const scrollContainer = document.querySelector("#smooth-scroll-container") as HTMLElement;

        const ctx = gsap.context(() => {
            let currentIndex = 0;

            const goToStep = (nextIndex: number) => {
                if (nextIndex === currentIndex) return;

                // Text out
                gsap.to(textsRef.current[currentIndex], { y: -50, opacity: 0, duration: 0.6, ease: "power2.inOut", overwrite: "auto" });

                if (nextIndex > currentIndex) {
                    // Scrolling down: Bring next image(s) in
                    for (let i = currentIndex + 1; i <= nextIndex; i++) {
                        gsap.fromTo(imagesRef.current[i],
                            { clipPath: "inset(50% round 12px)", zIndex: i + 1 },
                            { clipPath: "inset(0% round 12px)", duration: 1, ease: "power3.out", overwrite: "auto" }
                        );
                    }
                } else {
                    // Scrolling up: Shrink current image(s) out
                    for (let i = currentIndex; i > nextIndex; i--) {
                        gsap.to(imagesRef.current[i], {
                            clipPath: "inset(50% round 12px)",
                            duration: 1,
                            ease: "power3.out",
                            overwrite: "auto"
                        });
                    }
                }

                // Text in
                gsap.fromTo(textsRef.current[nextIndex],
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: "power2.out", overwrite: "auto" }
                );

                currentIndex = nextIndex;
            };

            // Initial states
            gsap.set(imagesRef.current[0], { clipPath: "inset(0% round 12px)", zIndex: 1 });
            gsap.set(textsRef.current[0], { opacity: 1, y: 0 });
            for (let i = 1; i < services.length; i++) {
                gsap.set(imagesRef.current[i], { clipPath: "inset(50% round 12px)", zIndex: i + 1 });
                gsap.set(textsRef.current[i], { opacity: 0, y: 50 });
            }

            gsap.set(progressBarRef.current, { transformOrigin: "left center", scaleX: 0 });

            // Progress bar timeline (scrubbed)
            ScrollTrigger.create({
                trigger: wrapperRef.current,
                scroller: scrollContainer,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
                onUpdate: (self) => {
                    if (progressBarRef.current) {
                        gsap.set(progressBarRef.current, { scaleX: self.progress });
                    }
                }
            });

            // Discrete triggers for images and text
            services.forEach((_, i) => {
                if (i === 0) return;
                ScrollTrigger.create({
                    trigger: `#dummy-${i}`,
                    scroller: scrollContainer,
                    start: "top 50%", // Trigger when dummy hits middle of screen
                    onEnter: () => goToStep(i),
                    onLeaveBack: () => goToStep(i - 1),
                });
            });

        }, wrapperRef);

        // Give time for layout, then refresh ScrollTrigger
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 200);

        return () => ctx.revert();
    }, [isReady]);

    return (
        <div ref={wrapperRef} id="services-wrapper" className="relative h-[300vh]">
            {/* Dummy triggers for scroll steps */}
            <div id="dummy-1" className="absolute top-[100vh] h-[100vh] w-full pointer-events-none" />
            <div id="dummy-2" className="absolute top-[200vh] h-[100vh] w-full pointer-events-none" />

            <section
                ref={sectionRef}
                data-scroll
                data-scroll-sticky
                data-scroll-target="#services-wrapper"
                className="relative z-10 bg-[#f5f2ec] text-black h-screen flex flex-col lg:flex-row overflow-hidden"
            >

                {/* LEFT HALF: Image & Progress */}
                <div className="w-full lg:w-1/2 h-[50vh] lg:h-full flex flex-col items-center justify-center relative border-b lg:border-b-0 lg:border-r border-black/10 p-6">

                    {/* Images Container */}
                    <div className="relative bg-blue-200 h-[70vh] w-full max-w-[300px] sm:max-w-[500px] aspect-[4/5] rounded-xl overflow-hidden shadow-2xl bg-black/5">
                        {services.map((service, index) => (
                            <img
                                key={`img-${service.id}`}
                                ref={(el) => {
                                    imagesRef.current[index] = el;
                                }}
                                src={service.image}
                                alt={service.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        ))}
                    </div>

                    {/* Progress Bar Container */}
                    <div className="mt-8 lg:mt-12 w-full max-w-[300px] sm:max-w-[400px] h-[2px] bg-black/10 relative rounded-full overflow-hidden">
                        <div
                            ref={progressBarRef}
                            className="absolute top-0 left-0 h-full bg-black w-full"
                        />
                    </div>
                </div>

                {/* RIGHT HALF: Text Content */}
                <div className="w-full lg:w-1/2 h-[50vh] lg:h-full relative flex flex-col justify-center p-6 md:p-12 lg:p-24 lg:pl-20">

                    {/* Top Header Section */}
                    <div className="max-w-[500px] mb-12 lg:mb-20">
                        <div className="flex items-center gap-4 mb-4 lg:mb-6">
                            <div className="w-10 md:w-12 h-[1px] bg-black/20"></div>
                            <p className="text-black/50 text-[10px] md:text-[11px] tracking-[0.25em] uppercase font-medium">Our Expertise</p>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-[4rem] font-medium tracking-tight text-black leading-[1.05]">
                            WHAT WE OFFER
                        </h2>
                    </div>

                    {/* Changing Services Info */}
                    <div className="relative w-full h-56 lg:h-72">
                        {services.map((service, index) => (
                            <div
                                key={`text-${service.id}`}
                                ref={(el) => {
                                    textsRef.current[index] = el;
                                }}
                                className="absolute inset-0 flex flex-col justify-center pointer-events-none"
                            >
                                <span className="text-black/50 font-mono mb-4 text-sm tracking-widest">
                                    /{service.id}
                                </span>
                                <h3 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-4">
                                    {service.title}
                                </h3>
                                <div className="text-black/70 max-w-[500px] leading-relaxed text-sm md:text-base space-y-2">
                                    {service.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
