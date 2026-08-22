"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        id: "01",
        title: "MINIATURE MODEL MAKING",
        description: (
            <>
                <p><strong>Industrial Models*:</strong> Factory Layouts | Manufacturing Plants | Warehouses | Production Line &amp; Machinery Flow</p>
                <p><strong>*Architectural Models:</strong> Townships | Commercial Complexes | SEZ | IT Parks | Institutional Buildings</p>
                <p><strong>Interior Models*:</strong> Office Layout Models | Showroom Setups | Retail Store Models</p>
            </>
        ),
        video: "/video/MINIMODELMAKE.mp4",
        poster: "/images/IMG_20210915_191342.jpg",
    },
    {
        id: "02",
        title: "MOMENTO",
        description: (
            <>
                <p><strong>Corporate Mementos*:</strong> Awards | Recognition Trophies | Achievement Models | Executive Gifts</p>
                <p><strong>*Architectural Mementos:</strong> Building Replicas | Project Models | Landmark Replicas | Custom Scale Models</p>
                <p><strong>Custom Mementos*:</strong> Personalized Models | Logo Displays | Commemorative Pieces | Premium Gifting</p>
            </>
        ),
        video: "/video/MEMENTO.mp4",
        poster: "/images/memento.png",
    },
    {
        id: "03",
        title: "ALLIED SERVICES",
        description: (
            <>
                <p><strong>Industrial Models*:</strong> Factory Layouts | Manufacturing Plants | Warehouses | Production Line &amp; Machinery Flow</p>
                <p><strong>*Architectural Models:</strong> Townships | Commercial Complexes | SEZ | IT Parks | Institutional Buildings</p>
                <p><strong>Interior Models*:</strong> Office Layout Models | Showroom Setups | Retail Store Models</p>
            </>
        ),
        video: "/video/ALLIED.mp4",
        poster: "/images/IMG_0721.JPG",
    },
];

export default function ServicesSection() {
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Auto-play all videos in parallel on mount
    useEffect(() => {
        videoRefs.current.forEach((vid) => {
            if (vid) vid.play().catch(() => {});
        });
    }, []);

    useEffect(() => {
        const cards = cardRefs.current.filter(Boolean);

        // Set initial hidden state BEFORE paint so there's no flash
        gsap.set(headerRef.current, { y: 44, opacity: 0 });
        gsap.set(cards, { y: 72, opacity: 0 });

        const ctx = gsap.context(() => {
            // Header slides up
            gsap.to(headerRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: headerRef.current,
                    start: "top 88%",
                    once: true,
                },
            });

            // Cards staggered reveal
            gsap.to(cards, {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "power3.out",
                stagger: 0.18,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    once: true,
                },
            });
        });

        return () => {
            ctx.revert();
            // Restore visibility on cleanup so HMR doesn't leave elements hidden
            gsap.set(headerRef.current, { clearProps: "all" });
            gsap.set(cards, { clearProps: "all" });
        };
    }, []);

    return (
        <section ref={sectionRef} id="services-section" className="services-section-root">
            {/* Header */}
            <div ref={headerRef} className="services-header">
                <div className="services-eyebrow">
                    <div className="services-eyebrow-line" />
                    <span className="services-eyebrow-text">Our Expertise</span>
                </div>
                <h2 className="services-heading">OUR SERVICES</h2>
            </div>

            {/* Cards Grid */}
            <div className="services-grid">
                {services.map((service, index) => (
                    <div
                        key={service.id}
                        ref={(el) => { cardRefs.current[index] = el; }}
                        className="service-card"
                    >
                        {/* Video — always playing, fully contained */}
                        <div className="service-card-video-wrapper">
                            <video
                                ref={(el) => { videoRefs.current[index] = el; }}
                                src={service.video}
                                poster={service.poster}
                                muted
                                loop
                                playsInline
                                className="service-card-video"
                            />
                        </div>

                        {/* Text */}
                        <div className="service-card-content">
                            <h3 className="service-card-title">{service.title}</h3>
                            <div className="service-card-desc">{service.description}</div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .services-section-root {
                    background: #f5f2ec;
                    padding: 80px 40px 100px;
                    width: 100%;
                    box-sizing: border-box;
                }
                .services-header {
                    max-width: 1200px;
                    margin: 0 auto 48px;
                }
                .services-eyebrow {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 10px;
                }
                .services-eyebrow-line {
                    width: 40px;
                    height: 1px;
                    background: rgba(0,0,0,0.2);
                }
                .services-eyebrow-text {
                    font-size: 11px;
                    letter-spacing: 0.25em;
                    text-transform: uppercase;
                    color: rgba(0,0,0,0.45);
                    font-weight: 500;
                }
                .services-heading {
                    font-size: clamp(2.2rem, 5vw, 4rem);
                    font-weight: 800;
                    letter-spacing: -0.02em;
                    color: #111;
                    line-height: 1.05;
                    margin: 0;
                }
                .services-grid {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                }
                @media (max-width: 900px) {
                    .services-section-root { padding: 60px 20px 80px; }
                    .services-grid { grid-template-columns: 1fr; gap: 24px; }
                }
                @media (min-width: 901px) and (max-width: 1100px) {
                    .services-grid { grid-template-columns: repeat(2, 1fr); }
                }
                /* Card — hover lifts card, resets on mouse leave (pure CSS) */
                .service-card {
                    background: #f5f2ec;
                    border-radius: 20px;
                    overflow: visible;
                    border: none;
                    cursor: pointer;
                    transition: box-shadow 0.35s ease, transform 0.35s ease;
                    box-shadow:
                        8px 8px 20px rgba(0,0,0,0.12),
                        -6px -6px 16px rgba(255,255,255,0.85);
                    will-change: transform, box-shadow;
                }
                .service-card:hover {
                    transform: translateY(-5px) scale(1.01);
                    box-shadow:
                        14px 14px 32px rgba(0,0,0,0.16),
                        -9px -9px 22px rgba(255,255,255,0.92);
                }

                /* Video fully contained inside its wrapper */
                .service-card-video-wrapper {
                    position: relative;
                    width: calc(100% - 16px);
                    aspect-ratio: 16 / 10;
                    overflow: hidden;
                    background: #1a1a1a;
                    border-radius: 14px;
                    margin: 8px 8px 0;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.22);
                }
                .service-card-video {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }

                .service-card-content {
                    padding: 22px 22px 26px;
                }
                .service-card-title {
                    font-size: 1.6rem;
                    font-weight: 800;
                    font-style: normal;
                    color: #111;
                    margin: 0 0 14px;
                    letter-spacing: -0.01em;
                    line-height: 1.15;
                }
                .service-card-desc {
                    font-size: 0.88rem;
                    color: #555;
                    line-height: 1.7;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .service-card-desc p { margin: 0; color: #555; }
                .service-card-desc strong { color: #333; font-weight: 600; }
            `}</style>
        </section>
    );
}
