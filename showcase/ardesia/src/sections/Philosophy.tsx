import { principles } from "@/data/site";
import { Picture } from "@/components/Picture";
import { RevealImage } from "@/components/RevealImage";
import { RevealText } from "@/components/RevealText";

export function Philosophy() {
  return (
    <section aria-labelledby="philosophy-title" className="frame pb-[clamp(6rem,12vw,12rem)]">
      <div className="grid-12 gap-y-16">
        {/* Image pair: a tall threshold, and hands at work overlapping its lower edge. */}
        <div className="relative col-span-4 md:col-span-6 lg:col-span-6">
          <RevealImage parallax={7} className="aspect-[4/5] w-[86%] md:w-[88%]">
            <Picture
              name="threshold"
              alt="A doorway in a board-marked concrete wall opens onto a white corridor of repeated frames."
              sizes="(min-width: 768px) 45vw, 86vw"
              className="block h-full w-full"
            />
          </RevealImage>
          <div className="relative -mt-[28%] ml-auto w-[52%] border-[10px] border-bg md:-mt-[34%] md:w-[48%] md:border-[14px]">
            <RevealImage from="left" delay={0.25} className="aspect-[4/3]">
              <Picture
                name="hands-clay"
                alt="Two hands pressing and shaping wet clay on a wooden workbench."
                sizes="(min-width: 768px) 24vw, 52vw"
                className="block h-full w-full"
              />
            </RevealImage>
          </div>
        </div>

        <div className="col-span-4 md:col-span-5 md:col-start-8 md:pt-[8vw]">
          <RevealText as="h2" id="philosophy-title" className="t-h2">
            Material first, <em className="it">then</em> form.
          </RevealText>
          <p className="t-lead mt-8 max-w-[44ch] text-ink-2">
            Ardesia was founded in 2009 by two architects trained in restoration. We still work the way restorers do:
            survey first, change as little as possible, and build with what the place already has.
          </p>

          <ul className="mt-14 border-t border-line pt-10 md:mt-20">
            {principles.map((p, i) => (
              <li key={p.title} className={i ? "mt-10" : ""}>
                <h3 className="font-display text-[1.6rem] leading-[1.15] tracking-[-0.01em]">{p.title}</h3>
                <p className="mt-3 max-w-[42ch] text-ink-2">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
