-- Security hardening for msuvenirov.ru (idempotent; safe to re-run).

-- ---------------------------------------------------------------------------
-- 1. orders: заявки с сайта. Доступ ТОЛЬКО через service role (edge-функции).
--    RLS включён, политик для anon/authenticated нет => чтение и запись закрыты.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  name            text NOT NULL,
  phone           text NOT NULL,
  contact_method  text NOT NULL DEFAULT 'phone',
  email           text,
  comment         text,
  estimate        jsonb,
  estimate_total  numeric,
  page            text,
  file_names      text[],
  ip              text,
  telegram_ok     boolean NOT NULL DEFAULT false,
  telegram_error  text
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- На случай, если ранее были созданы какие-либо политики — убираем (идемпотентно).
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can read orders" ON public.orders;

-- Дополнительно к RLS: убираем права у публичных ролей (defense in depth).
REVOKE ALL ON TABLE public.orders FROM anon, authenticated;

-- Для rate limit по IP за последние минуты.
CREATE INDEX IF NOT EXISTS orders_ip_created_at_idx
  ON public.orders (ip, created_at);

-- ---------------------------------------------------------------------------
-- 2. reviews: анонимная вставка запрещена (на новом сайте формы отзывов нет).
--    Публично читаются только одобренные отзывы.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can insert reviews" ON public.reviews;

DROP POLICY IF EXISTS "Anyone can read approved reviews" ON public.reviews;
CREATE POLICY "Anyone can read approved reviews"
ON public.reviews
FOR SELECT
TO public
USING (is_approved = true);

-- Права на запись у публичных ролей не нужны: пишет только service role.
REVOKE INSERT, UPDATE, DELETE ON TABLE public.reviews FROM anon, authenticated;

-- Ограничения на данные. NOT VALID — существующие строки не проверяются,
-- но все новые/изменяемые строки обязаны соответствовать.
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_name_length_check;
ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_name_length_check
  CHECK (char_length(name) BETWEEN 1 AND 80) NOT VALID;

ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_content_length_check;
ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_content_length_check
  CHECK (char_length(content) BETWEEN 1 AND 2000) NOT VALID;

ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_rating_range_check;
ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_rating_range_check
  CHECK (rating BETWEEN 1 AND 5) NOT VALID;

-- ---------------------------------------------------------------------------
-- 3. promo_codes: публичное чтение закрыто. Проверка промокодов идёт через
--    edge-функцию verify-promo (service role).
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can read active promo codes" ON public.promo_codes;
REVOKE ALL ON TABLE public.promo_codes FROM anon, authenticated;
