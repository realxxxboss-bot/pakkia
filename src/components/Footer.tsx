import Link from "next/link";

function LogoMark() {
  return (
    <span className="grid h-7 w-7 flex-none grid-cols-3 grid-rows-3 gap-[2px] rounded-[7px] bg-primary p-[5px]">
      {Array.from({ length: 9 }).map((_, i) => (
        <span
          key={i}
          className={`rounded-[1.5px] ${
            i === 0 || i === 4 || i === 8 ? "bg-amber" : "bg-white/55"
          }`}
        />
      ))}
    </span>
  );
}

const COLS = [
  {
    title: "Product",
    links: ["How it works", "Pricing", "Start free"],
  },
  {
    title: "Company",
    links: ["About", "Contact", "Privacy & GDPR"],
  },
  {
    title: "Contact",
    links: ["hello@pakkia.fi", "Mon-Fri · 9-17 EET", "Finland · EU"],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-dark text-white/70">
      <div className="mx-auto max-w-[1200px] px-5 pt-16 pb-9 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 gap-10 border-b border-white/10 pb-12 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-4 flex items-center gap-2.5 font-heading text-[19px] font-semibold tracking-[-0.02em] text-white">
              <LogoMark />
              Pakkia
            </div>
            <p className="max-w-[34ch] text-[14.5px] leading-[1.6] text-white/55">
              Overnight-stay reporting for Finnish campsites. Compliance-ready,
              EU-hosted, refreshingly simple.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h5 className="mb-4 font-eyebrow text-[11px] font-semibold tracking-[0.14em] text-white/45 uppercase">
                {col.title}
              </h5>
              <div className="flex flex-col gap-0.5">
                {col.links.map((link) => (
                  <Link
                    key={link}
                    href="#"
                    className="-mx-1 rounded-md px-1 py-[5px] text-[15px] text-white/75 transition-colors duration-150 hover:text-white"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3.5 pt-8">
          <div className="text-[13.5px] text-white/55">
            Powered by{" "}
            <b className="font-semibold text-white/85">Growth Nexus</b>
          </div>
          <div className="font-mono text-[12px] tracking-[0.02em] text-white/40">
            © 2026 Pakkia · pakkia.fi · Tehty Suomea varten
          </div>
        </div>
      </div>
    </footer>
  );
}
