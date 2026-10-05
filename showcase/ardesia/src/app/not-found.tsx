import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="frame flex min-h-[100dvh] flex-col justify-end pb-[12vh]">
      <p className="t-meta text-muted">Not found</p>
      <h1 className="t-hero mt-6 max-w-[12ch]">
        This room was <em className="it">never built.</em>
      </h1>
      <Link href="/" className="link-line link-line--on mt-12 w-fit">
        Return to the studio
      </Link>
    </main>
  );
}
