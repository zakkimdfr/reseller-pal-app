import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    supabase
      .from("testimonials")
      .select("id, name, location, text, rating")
      .eq("is_published", true)
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        if (data) setTestimonials(data);
      });
  }, []);

  if (testimonials.length === 0) return null;

  return (
<<<<<<< HEAD
    <section id="testimonials" className="bg-white py-16 md:py-24 scroll-mt-20">
=======
    <section id="testimonials" className="py-16 md:py-24 scroll-mt-20">
>>>>>>> de76d127878e4568f1fddf8edfd693ffe015144c
      <div className="container">
        <div className="mb-12 text-center">
          <p className="mb-2 font-sans text-sm font-semibold uppercase tracking-widest text-secondary">Testimoni</p>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Apa Kata Mereka</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
<<<<<<< HEAD
            <Card key={t.id} className="border-border/60 bg-muted transition hover:shadow-lg">
              <CardContent className="p-7">
                <p className="mb-2 font-serif text-5xl leading-none text-secondary/40">"</p>
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="mb-5 font-sans text-sm font-light italic leading-relaxed text-muted-foreground">{t.text}</p>
=======
            <Card key={t.id} className="transition hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="mb-4 font-sans text-sm text-muted-foreground italic">"{t.text}"</p>
>>>>>>> de76d127878e4568f1fddf8edfd693ffe015144c
                <p className="font-sans text-sm font-semibold text-foreground">{t.name}</p>
                <p className="font-sans text-xs text-muted-foreground">{t.location}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
