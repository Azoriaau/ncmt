import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Journey from "@/components/Journey";
import Coverage from "@/components/Coverage";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://ncmt.com.au/#business",
  name: "NCMT Transport",
  alternateName: "North Central Midlands Transport",
  url: "https://ncmt.com.au",
  telephone: "+61437428049",
  email: "ncmtwa@hotmail.com",
  image: "https://ncmt.com.au/videos/hero-still.jpg",
  description:
    "Family-owned transport and freight company. General freight, regional distribution and dedicated fleet services across Australia.",
  address: {
    "@type": "PostalAddress",
    addressRegion: "WA",
    addressCountry: "AU",
  },
  areaServed: "Australia",
  knowsAbout: [
    "General freight",
    "Regional distribution",
    "Dedicated fleet",
  ],
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Nav />
      <Hero />
      <Services />
      <Journey />
      <Coverage />
      <Contact />
      <Footer />
    </main>
  );
}
