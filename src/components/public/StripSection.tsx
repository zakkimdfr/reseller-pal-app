export default function StripSection() {
  const items = [
    "Berbasis di Bandung",
    "Pengiriman ke seluruh Indonesia",
    "Produk original & bergaransi",
    "Konsultasi gratis via WhatsApp",
  ];
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 bg-secondary px-[5%] py-3">
      {items.map((t) => (
        <div key={t} className="flex items-center gap-2 font-sans text-[12.5px] font-medium text-primary">
          <span className="h-1 w-1 shrink-0 rounded-full bg-primary/70" />
          {t}
        </div>
      ))}
    </div>
  );
}
