export default function JsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Golden Ratio Creation",
    alternateName: "GR Creation",
    url: "https://grcreation.in",
    logo: "https://grcreation.in/images/GoldenRatio_Creation.png",
    description:
      "Bhopal-based design and build studio specializing in Architecture, Luxury Interior Design, Miniature Scale Model Making, and Turnkey Construction.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "26 Ambedkar Nagar, Suraj Nagar",
      addressLocality: "Bhopal",
      addressRegion: "Madhya Pradesh",
      postalCode: "462044",
      addressCountry: "IN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91-966-954-7084",
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+91-798-707-8460",
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    ],
    email: "contact@grcreation.in",
    // Update these with actual social profile URLs when available
    sameAs: [
      // "https://www.instagram.com/goldenratiocreation/",
      // "https://www.linkedin.com/company/goldenratiocreation/",
    ],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://grcreation.in/#localbusiness",
    name: "Golden Ratio Creation — Bhopal Studio",
    image: "https://grcreation.in/images/GoldenRatio_Creation.png",
    url: "https://grcreation.in",
    telephone: "+91-966-954-7084",
    email: "contact@grcreation.in",
    description:
      "Design and build studio in Bhopal specializing in miniature scale model making, interior design, architecture, momento making, and turnkey construction.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "26 Ambedkar Nagar, Suraj Nagar",
      addressLocality: "Bhopal",
      addressRegion: "Madhya Pradesh",
      postalCode: "462044",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 23.2599,
      longitude: 77.4126,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:30",
        closes: "19:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "00:00",
        closes: "00:00",
        description: "By Prior Appointment Only",
      },
    ],
    priceRange: "₹₹₹",
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Design & Build Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Miniature Scale Model Making",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Interior Design",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Architecture",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Momento Making",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Turnkey Construction",
          },
        },
      ],
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Golden Ratio Creation",
    url: "https://grcreation.in",
    description:
      "Design & Build Company in Bhopal — Architecture, Interior Design, Miniature Scale Models.",
    publisher: {
      "@type": "Organization",
      name: "Golden Ratio Creation",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}
