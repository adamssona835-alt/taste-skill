import { images, srcSet, fallbackSrc } from "@/lib/images";

type Props = {
  name: string;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  /** CSS object-position, used for intentional crops */
  position?: string;
};

/**
 * Responsive AVIF/WebP picture with a blurred placeholder baked into the
 * background, so frames never flash empty while a photograph loads.
 */
export function Picture({ name, alt, sizes, className, imgClassName, priority, position }: Props) {
  const meta = images[name];
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet(name, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(name, "webp")} sizes={sizes} />
      <img
        src={fallbackSrc(name)}
        alt={alt}
        width={meta.width}
        height={meta.height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className={imgClassName ?? "h-full w-full object-cover"}
        style={{
          objectPosition: position,
          backgroundImage: `url(${meta.blur})`,
          backgroundSize: "cover",
          backgroundPosition: position ?? "center",
        }}
      />
    </picture>
  );
}
