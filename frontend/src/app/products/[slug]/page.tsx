"use client";

import React, { useEffect, useRef, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Tag } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "@/components/Footer";
import ProjectInquirySection from "@/components/ui/ProjectInquirySection";
import { fetchProduct, fetchProducts, type Product, getMediaUrl } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

function formatPrice(price: number, currency: string = "INR"): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

export default function ProductDetailsPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const resolvedParams = React.use(params);

    const [product, setProduct] = useState<Product | null>(null);
    const [moreProducts, setMoreProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const heroTitleRef = useRef<HTMLHeadingElement>(null);
    const galleryRef = useRef<HTMLDivElement>(null);

    /* ── Fetch product data ──────────────────────────────────── */
    useEffect(() => {
        let cancelled = false;

        async function loadData() {
            try {
                const [prod, allProducts] = await Promise.all([
                    fetchProduct(resolvedParams.slug),
                    fetchProducts(),
                ]);

                if (cancelled) return;

                setProduct(prod);
                // Get 2 random "more products" excluding the current one
                const others = allProducts.filter((p) => p.slug !== prod.slug);
                setMoreProducts(others.slice(0, 2));
            } catch (err) {
                console.error("Failed to load product:", err);
                if (!cancelled) setError(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadData();
        return () => {
            cancelled = true;
        };
    }, [resolvedParams.slug]);

    /* ── GSAP entrance animations ────────────────────────────── */
    useEffect(() => {
        if (loading || !product) return;

        // Title animation
        gsap.fromTo(
            heroTitleRef.current,
            { opacity: 0, y: 100 },
            { opacity: 1, y: 0, duration: 1.2, ease: "power4.out", delay: 0.1 }
        );

        // Stagger gallery images
        if (galleryRef.current) {
            const items = galleryRef.current.querySelectorAll(".gallery-item");
            gsap.fromTo(
                items,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: galleryRef.current,
                        start: "top 80%",
                    },
                }
            );
        }
    }, [loading, product]);

    /* ── Error state → 404 ───────────────────────────────────── */
    if (error) {
        notFound();
    }

    /* ── Loading skeleton ────────────────────────────────────── */
    if (loading || !product) {
        return (
            <main className="min-h-screen bg-[#f5f2ec] text-black pt-24">
                {/* Top Bar */}
                <div className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 lg:px-16 py-6 bg-[#f5f2ec]/90 backdrop-blur-md border-b border-black/5">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] hover:text-[#2a7a6e] transition-colors duration-300 group"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                        All Products
                    </Link>
                </div>

                <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20 pb-20 animate-pulse">
                    {/* Title skeleton */}
                    <div className="py-20 md:py-32">
                        <div className="h-24 md:h-40 lg:h-56 w-3/4 bg-black/10 rounded-lg" />
                    </div>
                    {/* Content skeleton */}
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                        <div className="lg:w-1/3 flex flex-col gap-6">
                            <div className="h-6 w-48 bg-black/10 rounded" />
                            <div className="h-4 w-full bg-black/10 rounded" />
                            <div className="h-4 w-full bg-black/10 rounded" />
                            <div className="h-4 w-2/3 bg-black/10 rounded" />
                            <div className="h-20 w-full bg-black/10 rounded-xl mt-4" />
                        </div>
                        <div className="lg:w-2/3 flex flex-col gap-12">
                            <div className="w-full aspect-[16/10] bg-black/10 rounded-xl" />
                            <div className="w-full aspect-[16/10] bg-black/10 rounded-xl" />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    const hasDiscount = product.discountPrice != null && product.discountPrice > 0;
    const discountPercent = hasDiscount
        ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
        : 0;

    return (
        <main className="min-h-screen bg-[#f5f2ec] text-black pt-24">
            {/* ── Top Bar (Back link) ────────────────────────────── */}
            <div className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 lg:px-16 py-6 bg-[#f5f2ec]/90 backdrop-blur-md border-b border-black/5">
                <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] hover:text-[#2a7a6e] transition-colors duration-300 group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                    All Products
                </Link>
            </div>

            <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20 pb-20">
                {/* ── Giant Hero Title ─────────────────────────────────── */}
                <div className="py-20 md:py-32">
                    <h1
                        ref={heroTitleRef}
                        className="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] font-black uppercase tracking-tighter leading-[0.85] text-black break-words"
                    >
                        {product.title}
                    </h1>
                </div>

                {/* ── Split Layout: Left Content & Right Gallery ────────── */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

                    {/* Left Column (Sticky Details) */}
                    <div className="lg:w-1/3">
                        <div className="sticky top-32 flex flex-col gap-10">

                            {/* Category */}
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-[1px] bg-[#2a7a6e]" />
                                <p className="text-[#2a7a6e] text-[10px] md:text-[11px] font-semibold tracking-[0.2em] uppercase">
                                    {product.category}
                                </p>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold mb-4">
                                    About This Product
                                </h3>
                                <p className="text-black/70 text-base md:text-lg leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Price Card */}
                            <div className="bg-[#ede9e1] rounded-2xl p-6 border border-black/10 shadow-[4px_4px_16px_rgba(0,0,0,0.04),-4px_-4px_16px_rgba(255,255,255,0.7)]">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/50 mb-3">
                                    Pricing
                                </p>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl md:text-4xl font-black text-black">
                                        {formatPrice(
                                            hasDiscount ? product.discountPrice! : product.price,
                                            product.currency
                                        )}
                                    </span>
                                    {hasDiscount && (
                                        <>
                                            <span className="text-lg text-black/40 line-through">
                                                {formatPrice(product.price, product.currency)}
                                            </span>
                                            <span className="text-xs font-bold text-[#2a7a6e] bg-[#2a7a6e]/10 px-2 py-1 rounded-full">
                                                {discountPercent}% OFF
                                            </span>
                                        </>
                                    )}
                                </div>
                                {product.sku && (
                                    <p className="text-xs text-black/40 mt-3 tracking-wider">
                                        SKU: {product.sku}
                                    </p>
                                )}
                                {product.stock != null && (
                                    <p className={`text-xs mt-2 font-medium ${product.stock > 0 ? "text-[#2a7a6e]" : "text-red-500"}`}>
                                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                                    </p>
                                )}
                            </div>

                            {/* Specifications */}
                            {product.specifications && product.specifications.length > 0 && (
                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold mb-4">
                                        Specifications
                                    </h3>
                                    <dl className="text-sm md:text-base text-black/80">
                                        {product.specifications.map((spec, idx) => (
                                            <div
                                                key={idx}
                                                className={`flex justify-between py-3 ${idx === 0 ? "border-t" : ""
                                                    } border-b border-black/10`}
                                            >
                                                <dt className="text-black/50 font-medium">{spec.label}</dt>
                                                <dd className="text-right max-w-[60%] font-medium">{spec.value}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            )}

                            {/* Tags */}
                            {product.tags && product.tags.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Tag className="w-4 h-4 text-black/40" />
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/50">
                                            Tags
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {product.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="text-xs px-3 py-1.5 rounded-full bg-black/5 text-black/60 border border-black/10 font-medium"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column (Gallery) */}
                    <div className="lg:w-2/3" ref={galleryRef}>
                        <div className="flex flex-col gap-12 md:gap-20">
                            {/* Gallery Images */}
                            {product.gallery && product.gallery.length > 0 ? (
                                product.gallery.map((img, idx) => (
                                    <div key={idx} className="gallery-item flex flex-col gap-4">
                                        <div className="w-full relative overflow-hidden rounded-xl bg-black/5">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={getMediaUrl(img.src)}
                                                alt={`${product.title} - ${idx}`}
                                                className="w-full h-auto object-cover"
                                            />
                                        </div>
                                        {img.caption && (
                                            <p className="text-black/60 text-sm md:text-base font-light italic">
                                                {img.caption}
                                            </p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="gallery-item flex flex-col gap-4">
                                    <div className="w-full relative overflow-hidden rounded-xl bg-black/5">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={getMediaUrl(product.image)}
                                            alt={product.title}
                                            className="w-full h-auto object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Product Inquiry / Contact Section ─────────────────── */}
            <ProjectInquirySection />

            {/* ── More Products ──────────────────────────────────────── */}
            {moreProducts.length > 0 && (
                <div className="bg-[#0a0a0a] py-24 border-t border-black/5">
                    <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-12 h-[1px] bg-[#2a7a6e]"></div>
                            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-[#2a7a6e]">
                                More Products
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
                            {moreProducts.map((nextProd) => (
                                <Link
                                    key={nextProd._id}
                                    href={`/products/${nextProd.slug}`}
                                    className="group flex flex-col gap-6"
                                >
                                    {/* Image Card */}
                                    <div className="relative w-full aspect-[4/3] lg:aspect-[16/10] rounded-[30px] overflow-hidden shadow-lg">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={getMediaUrl(nextProd.image)}
                                            alt={nextProd.title}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />

                                        {/* Hover Overlay with Button */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                            <div className="bg-white text-black px-8 py-3 flex items-center gap-2 rounded-full font-medium tracking-wide translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:scale-105">
                                                <span>VIEW PRODUCT</span>
                                            </div>
                                        </div>

                                        {/* Price Badge */}
                                        <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                                            <span className="text-xs font-bold text-black">
                                                {formatPrice(
                                                    nextProd.discountPrice && nextProd.discountPrice > 0
                                                        ? nextProd.discountPrice
                                                        : nextProd.price,
                                                    nextProd.currency
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col gap-2 px-1">
                                        <p className="text-[#f5f2ec]/50 text-xs md:text-sm font-mono tracking-wider uppercase">
                                            /{nextProd.category}
                                        </p>
                                        <h3 className="text-2xl md:text-3xl font-medium text-[#f5f2ec]">
                                            {nextProd.title}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </main>
    );
}
