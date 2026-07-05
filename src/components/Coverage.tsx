import Reveal from "./Reveal";
import VideoLoop from "./VideoLoop";

const stats = [
  { value: "24/7", label: "Dispatch" },
  { value: "1M+", label: "Kms per year" },
  { value: "100%", label: "Family owned" },
];

export default function Coverage() {
  return (
    <section id="coverage" className="relative py-28 overflow-hidden">
      <VideoLoop
        src="/videos/coverage.mp4"
        className="absolute inset-0 h-full w-full opacity-40"
        label="coverage.mp4 — map-to-highway transition"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="font-mono text-accent-bright text-sm tracking-[0.3em] uppercase mb-3">
            Coverage
          </p>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight max-w-2xl">
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
                <div className="text-3xl sm:text-4xl font-semibold text-accent-bright">
                  {s.value}
                </div>
                <div className="text-muted text-sm mt-1">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
