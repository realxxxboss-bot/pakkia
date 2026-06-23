import Link from "next/link";

function LogoMark() {
  return (
    <span className="grid h-8 w-8 flex-none grid-cols-3 grid-rows-3 gap-[2.5px] rounded-[11px] bg-primary p-1.5 shadow-clay-primary">
      {Array.from({ length: 9 }).map((_, i) => (
        <span
          key={i}
          className={`rounded-[2px] ${
            i === 1 || i === 4 || i === 8 ? "bg-amber" : "bg-white/40"
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
    links: ["hello@pakkia.fi", "Mon–Fri · 9–17 EET", "Finland · EU"],
  },
];

export default function Footer() {
  return (
    <footer className="mt-[30px] rounded-t-[48px] bg-dark px-0 pt-[74px] pb-[38px] text-white/60 shadow-clay-dark">
      <div className="mx-auto max-w-[1240px] px-[18px] sm:px-9 lg:px-16">
        <div className="grid grid-cols-2 gap-10 border-b-2 border-dashed border-white/[0.14] pb-[46px] lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-[18px] flex items-center gap-[11px] font-heading text-[21px] font-bold tracking-[-0.02em] text-white">
              <LogoMark />
              Pakkia
            </div>
            <p className="max-w-[32ch] text-[14.5px] leading-[1.6] text-white/[0.58]">
              Overnight-stay reporting for Finnish campsites. Compliance-ready,
              EU-hosted, refreshingly simple.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h5 className="mb-[18px] font-eyebrow text-[11px] font-semibold tracking-[0.12em] text-white/50 uppercase">
                {col.title}
              </h5>
              {col.links.map((link) => (
                <Link
                  key={link}
                  href="#"
                  className="block py-[7px] text-[15px] text-white/80 transition-colors hover:text-white"
                >
                  {link}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3.5 pt-[30px]">
          <div className="text-[13.5px]">
            Powered by <b className="font-semibold text-white">Growth Nexus</b>
          </div>
          <div className="font-eyebrow text-[11px] tracking-[0.06em] text-white/45">
            © 2026 Pakkia · pakkia.fi · Tehty Suomea varten
          </div>
        </div>
      </div>
    </footer>
  );
}
