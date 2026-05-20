import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Testimonial = {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
};

export default function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>([]);

  useEffect(() => {
    supabase
      .from("testimonials")
      .select("id, name, location, text, rating")
      .eq("is_published", true)
      .order("display_order", { ascending: true })
      .then(({ data }) => data && setItems(data));
  }, []);

  if (items.length === 0) return null;

  return (
    <section id="testimonials" className="bg-white px-[5%] py-20 md:py-24 scroll-mt-20">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-secondary">Testimoni</p>
        <h2 className="font-serif font-bold leading-[1.1] text-foreground" style={{ fontSize: "clamp(34px, 5vw, 56px)" }}>
          Apa Kata Mereka
        </h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <div key={t.id} className="rounded-[10px] border border-muted bg-muted/40 p-7">
              <div className="mb-3 font-serif text-[60px] leading-[0.8] text-secondary/40">"</div>
              <div className="mb-3.5 tracking-[2px] text-secondary">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="inline h-3.5 w-3.5 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="mb-5 font-sans text-[14.5px] font-light italic leading-[1.7] text-muted-foreground">{t.text}</p>
              <div className="font-sans text-sm font-medium text-foreground">{t.name}</div>
              <div className="mt-0.5 font-sans text-xs text-muted-foreground">{t.location}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
