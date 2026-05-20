
-- Testimonials table
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  text TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published testimonials" ON public.testimonials
  FOR SELECT TO anon USING (is_published = true);
CREATE POLICY "Authenticated can view all testimonials" ON public.testimonials
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can insert testimonials" ON public.testimonials
  FOR INSERT TO authenticated WITH CHECK (is_admin_or_owner(auth.uid()));
CREATE POLICY "Admin can update testimonials" ON public.testimonials
  FOR UPDATE TO authenticated USING (is_admin_or_owner(auth.uid()));
CREATE POLICY "Admin can delete testimonials" ON public.testimonials
  FOR DELETE TO authenticated USING (is_admin_or_owner(auth.uid()));

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Articles / News table
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'Berita',
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published articles" ON public.articles
  FOR SELECT TO anon USING (is_published = true);
CREATE POLICY "Authenticated can view all articles" ON public.articles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can insert articles" ON public.articles
  FOR INSERT TO authenticated WITH CHECK (is_admin_or_owner(auth.uid()));
CREATE POLICY "Admin can update articles" ON public.articles
  FOR UPDATE TO authenticated USING (is_admin_or_owner(auth.uid()));
CREATE POLICY "Admin can delete articles" ON public.articles
  FOR DELETE TO authenticated USING (is_admin_or_owner(auth.uid()));

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed testimonials
INSERT INTO public.testimonials (name, location, text, rating, display_order) VALUES
  ('Ibu Sari', 'Jakarta', 'Setelah rutin minum BP Merah, daya tahan tubuh saya jauh lebih baik. Jarang sakit flu lagi!', 5, 1),
  ('Pak Ahmad', 'Surabaya', 'Belgie Serum bikin kulit istri saya lebih cerah dan halus. Sangat recommend!', 5, 2),
  ('Mbak Dina', 'Bandung', 'Anak saya suka BP Hijau, rasanya enak dan bikin mereka lebih sehat.', 5, 3);

-- Seed articles
INSERT INTO public.articles (title, slug, excerpt, content, category, is_published, published_at) VALUES
  ('Manfaat Propolis untuk Daya Tahan Tubuh', 'manfaat-propolis-daya-tahan-tubuh',
   'Propolis dikenal sebagai antioksidan alami yang membantu memperkuat sistem imun.',
   'Propolis adalah zat resin yang dikumpulkan oleh lebah dari kuncup tanaman. Kaya akan flavonoid, propolis terbukti membantu meningkatkan daya tahan tubuh, mempercepat penyembuhan luka, dan melawan radikal bebas.',
   'Kesehatan', true, now()),
  ('Tips Merawat Kulit dengan Bahan Alami', 'tips-merawat-kulit-bahan-alami',
   'Kulit sehat tidak harus mahal. Kenali bahan-bahan alami untuk perawatan harian.',
   'Perawatan kulit dengan bahan alami semakin populer. Belgie Serum mengandung ekstrak alami yang membantu mencerahkan dan melembabkan kulit secara optimal.',
   'Kecantikan', true, now()),
  ('Pola Hidup Sehat di Era Modern', 'pola-hidup-sehat-era-modern',
   'Cara menjaga kesehatan di tengah kesibukan dan polusi kota.',
   'Hidup sehat di era modern butuh komitmen. Kombinasikan suplemen alami, olahraga teratur, dan istirahat cukup untuk hasil optimal.',
   'Lifestyle', true, now());
