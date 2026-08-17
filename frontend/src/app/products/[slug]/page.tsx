import type { Metadata } from "next";
import { fetchProduct, getMediaUrl } from "@/lib/api";
import ProductDetailClient from "./ProductDetailClient";

type Props = {
  params: Promise<{ slug: string }>;
};

function formatPriceForSchema(price: number): string {
  return price.toFixed(2);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await fetchProduct(slug);
    const imageUrl = product.image
      ? getMediaUrl(product.image).startsWith("http")
        ? getMediaUrl(product.image)
        : `https://grcreation.in${getMediaUrl(product.image)}`
      : "/images/GoldenRatio_Creation.png";

    const displayPrice =
      product.discountPrice && product.discountPrice > 0
        ? product.discountPrice
        : product.price;

    return {
      title: `${product.title} — ${product.category}`,
      description:
        product.description ||
        `${product.title} — a ${product.category} product by Golden Ratio Creation. ₹${displayPrice}. Buy online or inquire now.`,
      alternates: {
        canonical: `/products/${slug}`,
      },
      openGraph: {
        title: `${product.title} — Golden Ratio Creation`,
        description:
          product.description ||
          `Shop ${product.title} from Golden Ratio Creation — ${product.category}.`,
        url: `/products/${slug}`,
        type: "website",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: product.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.title} — Golden Ratio Creation`,
        description:
          product.description ||
          `Shop ${product.title} from Golden Ratio Creation.`,
        images: [imageUrl],
      },
      other: {
        // Product structured data injected via JSON-LD script in the page
        "product:price:amount": formatPriceForSchema(displayPrice),
        "product:price:currency": product.currency || "INR",
      },
    };
  } catch {
    return {
      title: "Product",
      description: "View product details at Golden Ratio Creation.",
    };
  }
}

export default async function ProductDetailsPage({ params }: Props) {
  const { slug } = await params;

  // Attempt to fetch product data for JSON-LD structured data
  let productJsonLd: string | null = null;
  try {
    const product = await fetchProduct(slug);
    const imageUrl = product.image
      ? getMediaUrl(product.image).startsWith("http")
        ? getMediaUrl(product.image)
        : `https://grcreation.in${getMediaUrl(product.image)}`
      : "https://grcreation.in/images/GoldenRatio_Creation.png";

    const displayPrice =
      product.discountPrice && product.discountPrice > 0
        ? product.discountPrice
        : product.price;

    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      description: product.description,
      image: imageUrl,
      sku: product.sku || product.slug,
      brand: {
        "@type": "Brand",
        name: "Golden Ratio Creation",
      },
      offers: {
        "@type": "Offer",
        url: `https://grcreation.in/products/${slug}`,
        priceCurrency: product.currency || "INR",
        price: formatPriceForSchema(displayPrice),
        availability:
          product.stock != null && product.stock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        seller: {
          "@type": "Organization",
          name: "Golden Ratio Creation",
        },
      },
      category: product.category,
    };

    productJsonLd = JSON.stringify(schema);
  } catch {
    // Product fetch failed — skip JSON-LD, client will handle 404
  }

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: productJsonLd }}
        />
      )}
      <ProductDetailClient slug={slug} />
    </>
  );
}
