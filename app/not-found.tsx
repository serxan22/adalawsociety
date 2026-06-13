import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bg-gradient-to-br from-[#3F6076] to-[#2F4C60] py-24">
      <div className="container-wide text-center">
        <p className="text-sm font-semibold uppercase text-als-red">404</p>
        <h1 className="mt-4 text-4xl font-bold text-white">Page not found</h1>
        <p className="mx-auto mt-4 max-w-xl text-white/75">
          The page you are looking for may have moved, or the mock data entry has not been
          created yet.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-als-red px-5 text-sm font-semibold text-white"
        >
          Back home
        </Link>
      </div>
    </section>
  );
}
