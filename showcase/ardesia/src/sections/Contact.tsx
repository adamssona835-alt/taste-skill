import { site } from "@/data/site";
import { Picture } from "@/components/Picture";
import { RevealImage } from "@/components/RevealImage";
import { RevealText } from "@/components/RevealText";
import { Button } from "@/components/Button";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="frame py-[clamp(7rem,15vw,15rem)]">
      <div className="grid-12 items-end gap-y-14">
        <div className="col-span-4 md:col-span-8">
          <p className="t-meta text-muted">Commissions</p>
          <RevealText as="h2" id="contact-title" className="t-hero mt-8">
            Tell us about <em className="it">your site.</em>
          </RevealText>
          <p className="t-lead mt-10 max-w-[44ch] text-ink-2">
            We take on six to eight new commissions a year, in Liguria and across the Mediterranean. The first
            conversation always happens on the land itself.
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6">
            <Button href={`mailto:${site.email}?subject=A%20new%20project`}>{site.cta}</Button>
            <div className="t-small">
              <a href={site.phoneHref} className="link-line block">
                {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="link-line mt-1 block text-muted">
                {site.email}
              </a>
            </div>
          </div>
        </div>

        <div className="col-span-3 col-start-2 md:col-span-3 md:col-start-10">
          <RevealImage from="right" parallax={6} className="aspect-[4/5]">
            <Picture
              name="round-window"
              alt="A round window in a dark room, warm afternoon light falling across a table below it."
              sizes="(min-width: 768px) 24vw, 70vw"
              className="block h-full w-full"
            />
          </RevealImage>
        </div>
      </div>
    </section>
  );
}
