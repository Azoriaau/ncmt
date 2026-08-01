import Reveal from "./Reveal";
import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <section id="contact" className="py-28 bg-surface/50">
      <div className="mx-auto max-w-6xl px-6 grid gap-12 md:grid-cols-2">
        <Reveal>
          <p className="font-mono text-accent-bright text-sm tracking-[0.3em] uppercase mb-3">
            Contact
          </p>
          <h2 className="font-display uppercase text-2xl sm:text-4xl tracking-tight">
            Got freight to move?
          </h2>
          <p className="mt-6 text-muted text-lg max-w-md">
            Tell us what, where and when. We&apos;ll come back with a straight
            answer and a fair price.
          </p>
          <div className="mt-8 space-y-2 text-muted">
            <p>
              <span className="text-foreground font-medium">Phone:</span>{" "}
              <a href="tel:+61437428349" className="hover:text-foreground transition-colors">
                (+61) 0437 428 349
              </a>
            </p>
            <p>
              <span className="text-foreground font-medium">Email:</span>{" "}
              <a
                href="mailto:ncmtwa@hotmail.com"
                className="hover:text-foreground transition-colors"
              >
                ncmtwa@hotmail.com
              </a>
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
