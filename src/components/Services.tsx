import Reveal from "./Reveal";

const services = [
  {
    title: "General freight",
    body: "Palletised and loose freight moved daily on scheduled runs. Full loads or part loads - same care either way.",
    image: "/images/service-general.jpg",
    alt: "Forklift loading palletised freight into a curtain-side trailer",
  },
  {
    title: "Regional distribution",
    body: "City to the regions and back. We know the routes, the receivers and the roads other carriers avoid.",
    image: "/images/service-regional.jpg",
    alt: "Aerial view of a regional town on the edge of the outback at dusk",
  },
  {
    title: "Dedicated fleet",
    body: "Your freight, our trucks, one standing arrangement. Dedicated vehicles and drivers for ongoing contract work.",
    image: "/images/service-dedicated.jpg",
    alt: "NCMT Kenworth road train with tipper trailers on a red dirt road",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-28 bg-background">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="font-mono text-accent-bright text-sm tracking-[0.3em] uppercase mb-3">
            Services
          </p>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight max-w-2xl">
            What we carry, and how.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.12}>
              <div className="group rounded-2xl overflow-hidden bg-surface border border-white/5 hover:border-accent/40 transition-colors">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.alt}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium mb-2">{s.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
