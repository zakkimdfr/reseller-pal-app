import { MessageCircle } from "lucide-react";

export default function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/628XXXXXXXXX?text=Halo%2C%20saya%20ingin%20tanya%20produk"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp"
      className="fixed bottom-6 right-6 z-[99] flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] shadow-[0_4px_20px_rgba(37,211,102,0.4)] transition hover:scale-110"
    >
      <span className="absolute inset-0 rounded-full bg-[#25d366]/40" style={{ animation: "wa-pulse 2.5s infinite" }} />
      <MessageCircle className="relative h-7 w-7 text-white" />
    </a>
  );
}
