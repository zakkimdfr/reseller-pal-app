import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Ibu Sari", loc: "Jakarta", text: "Setelah rutin minum BP Merah, daya tahan tubuh saya jauh lebih baik. Jarang sakit flu lagi!" },
  { name: "Pak Ahmad", loc: "Surabaya", text: "Belgie Serum bikin kulit istri saya lebih cerah dan halus. Sangat recommend!" },
  { name: "Mbak Dina", loc: "Bandung", text: "Anak saya suka BP Hijau, rasanya enak dan bikin mereka lebih sehat." },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <p className="mb-2 font-sans text-sm font-semibold uppercase tracking-widest text-secondary">Testimoni</p>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Apa Kata Mereka</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="transition hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="mb-4 font-sans text-sm text-muted-foreground italic">"{t.text}"</p>
                <p className="font-sans text-sm font-semibold text-foreground">{t.name}</p>
                <p className="font-sans text-xs text-muted-foreground">{t.loc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
