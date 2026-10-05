import { Picture } from "@/components/Picture";
import { RevealImage } from "@/components/RevealImage";
import { RevealText } from "@/components/RevealText";

/**
 * Three photographs of the landscape we build in, scattered across the width
 * at different depths. Each moves at its own speed.
 */
export function Coast() {
  return (
    <section aria-labelledby="coast-title" className="frame overflow-hidden pt-[clamp(7rem,14vw,14rem)] pb-[clamp(5rem,9vw,8rem)]">
      <div className="grid-12 gap-y-14">
        <div className="col-span-3 row-span-2 md:col-span-4 md:row-span-1">
          <RevealImage parallax={10} className="aspect-[3/4]">
            <Picture
              name="coast-mist"
              alt="Low tide on a rocky shore, green weed on the stones, the sea dissolving into mist."
              sizes="(min-width: 768px) 30vw, 75vw"
              className="block h-full w-full"
            />
          </RevealImage>
        </div>

        <div className="col-span-4 md:col-span-6 md:col-start-6 md:pt-[6vw]">
          <p className="t-meta text-muted">Liguria</p>
          <RevealText as="h2" id="coast-title" className="t-h2 mt-6">
            Between the mountains <em className="it">and the sea.</em>
          </RevealText>
          <p className="t-lead mt-8 max-w-[44ch] text-ink-2">
            The region is rarely more than thirty kilometres deep. Nothing here is flat, and almost every building we work
            on stands on a terrace someone once built by hand.
          </p>
        </div>

        <div className="col-span-4 md:col-span-4 md:col-start-6 md:mt-[2vw]">
          <RevealImage parallax={5} from="left" className="aspect-[5/4]">
            <Picture
              name="rock-reflection"
              alt="A dark island of rock mirrored in still, shallow water under a pale sky."
              sizes="(min-width: 768px) 30vw, 100vw"
              className="block h-full w-full"
            />
          </RevealImage>
        </div>

        <div className="col-span-3 col-start-2 md:col-span-3 md:col-start-10 md:mt-[14vw]">
          <RevealImage parallax={14} from="top" delay={0.15} className="aspect-[2/3]">
            <Picture
              name="cliffs"
              alt="Green cliffs falling into a dark, restless sea, with low sun breaking through cloud."
              sizes="(min-width: 768px) 22vw, 70vw"
              position="35% 50%"
              className="block h-full w-full"
            />
          </RevealImage>
        </div>
      </div>
    </section>
  );
}
