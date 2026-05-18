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
    <section id="testimonials" className="py-16 md:py-24 scroll-mt-20">
      <div className="container">
        <div className="mb-12 text-center">
          <p className="mb-2 font-sans text-sm font-semibold uppercase tracking-widest text-secondary">Testimoni</p>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Apa Kata Mereka</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.id} className="transition hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="mb-4 font-sans text-sm text-muted-foreground italic">"{t.text}"</p>
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
