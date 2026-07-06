import Reveal from "./Reveal";
import CoverageMap from "./CoverageMap";

const stats = [
  { value: "24/7", label: "Dispatch" },
  { value: "1M+", label: "Kms per year" },
  { value: "100%", label: "Family owned" },
];

export default function Coverage() {
  return (
    <section id="coverage" className="relative py-28 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <Reveal>
            <p className="font-mono text-accent-bright text-sm tracking-[0.3em] uppercase mb-3">
              Coverage
            </p>
            <h2 className="font-display uppercase text-2xl sm:text-4xl tracking-tight max-w-2xl">
              City depots. Regional roads. One network.
            </h2>
            <p className="mt-6 max-w-xl text-muted text-lg">
              From metro distribution centres to the towns at the end of the
              line, NCMT runs scheduled and dedicated services across the
              country.
            </p>
          </Reveal>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.1}>
                <div>
                  <div className="font-display text-3xl sm:text-4xl text-accent-bright">
                    {s.value}
                  </div>
                  <div className="text-muted text-sm mt-1">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.15}>
          <CoverageMap />
        </Reveal>
      </div>
    </section>
  );
}
