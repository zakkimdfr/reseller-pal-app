import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

type Article = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image_url: string | null;
  published_at: string | null;
};

export default function NewsSection() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    supabase
      .from("articles")
      .select("id, title, excerpt, category, image_url, published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) setArticles(data);
      });
  }, []);

  if (articles.length === 0) return null;

  return (
    <section className="bg-muted/40 py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <p className="mb-2 font-sans text-sm font-semibold uppercase tracking-widest text-secondary">Artikel & Berita</p>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Wawasan Kesehatan</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((a) => (
            <Card key={a.id} className="overflow-hidden transition hover:shadow-lg">
              <div className="flex h-44 items-center justify-center bg-muted">
                {a.image_url ? (
                  <img src={a.image_url} alt={a.title} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <span className="font-serif text-base font-semibold text-muted-foreground">{a.category}</span>
                )}
              </div>
              <CardContent className="p-5">
                <p className="mb-2 font-sans text-xs font-medium uppercase tracking-wider text-secondary">{a.category}</p>
                <h3 className="mb-2 font-serif text-lg font-semibold text-foreground">{a.title}</h3>
                <p className="font-sans text-sm text-muted-foreground line-clamp-3">{a.excerpt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
