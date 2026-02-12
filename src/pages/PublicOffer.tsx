import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublicOffer = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>На главную</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <article className="max-w-3xl mx-auto prose prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold neon-text mb-8">
            Публичная оферта
          </h1>

          <p className="text-sm text-muted-foreground mb-6">
            Дата публикации: 01.01.2019<br />
            Действует с: 01.01.2019
          </p>

          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">1. Общие положения</h2>
              <p className="text-muted-foreground leading-relaxed">
                1.1. Настоящая публичная оферта (далее — «Оферта») является официальным предложением 
                ИП «Мастерская сувениров» (далее — «Исполнитель») заключить договор на оказание услуг 
                по изготовлению сувенирной продукции и печати на текстильных изделиях.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                1.2. Акцептом настоящей Оферты является оформление заказа через форму обратной связи 
                на сайте, по телефону или через мессенджеры, а также внесение предоплаты.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                1.3. Оферта вступает в силу с момента её размещения на сайте и действует до момента 
                её отзыва Исполнителем.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">2. Предмет договора</h2>
              <p className="text-muted-foreground leading-relaxed">
                2.1. Исполнитель обязуется по заказу Заказчика оказать услуги по изготовлению 
                сувенирной и печатной продукции, а Заказчик обязуется оплатить эти услуги.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                2.2. Конкретный перечень услуг, их стоимость и сроки исполнения согласовываются 
                сторонами индивидуально при оформлении каждого заказа.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">3. Порядок оформления заказа</h2>
              <p className="text-muted-foreground leading-relaxed">
                3.1. Заказчик оформляет заказ одним из следующих способов:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Через форму обратной связи на сайте</li>
                <li>По телефону: +7 952 114-23-50</li>
                <li>Через мессенджер Telegram</li>
                <li>Лично в офисе: г. Калининград, ТЦ Экватор, 2 этаж</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                3.2. После получения заказа Исполнитель связывается с Заказчиком для уточнения 
                деталей, согласования макета и стоимости.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                3.3. Заказ считается принятым в работу после согласования всех условий и получения 
                предоплаты (если применимо).
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">4. Оплата</h2>
              <p className="text-muted-foreground leading-relaxed">
                4.1. Стоимость услуг определяется индивидуально для каждого заказа и зависит от 
                сложности, тиража, используемых материалов и сроков изготовления.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                4.2. Оплата производится в рублях РФ наличным или безналичным расчётом.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                4.3. Предоплата составляет от 50% до 100% от стоимости заказа (по согласованию).
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">5. Сроки исполнения</h2>
              <p className="text-muted-foreground leading-relaxed">
                5.1. Сроки изготовления заказа устанавливаются индивидуально и зависят от объёма 
                и сложности работ.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                5.2. Срок исполнения исчисляется с момента согласования макета и получения предоплаты.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                5.3. Исполнитель вправе изменить сроки исполнения заказа по согласованию с Заказчиком 
                при наличии объективных причин.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">6. Гарантии и возврат</h2>
              <p className="text-muted-foreground leading-relaxed">
                6.1. Исполнитель гарантирует качество выполненных работ в соответствии с 
                согласованным макетом.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                6.2. Претензии по качеству принимаются в течение 3 дней с момента получения заказа.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                6.3. Возврат денежных средств возможен в случае выявления брака по вине Исполнителя 
                или при отмене заказа до начала производства.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">7. Ответственность сторон</h2>
              <p className="text-muted-foreground leading-relaxed">
                7.1. Стороны несут ответственность за неисполнение или ненадлежащее исполнение 
                своих обязательств в соответствии с законодательством РФ.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                7.2. Исполнитель не несёт ответственности за несоответствие цветопередачи при 
                печати относительно изображения на мониторе Заказчика.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">8. Авторские права и интеллектуальная собственность</h2>
              <p className="text-muted-foreground leading-relaxed">
                8.1. Заказчик гарантирует, что все материалы (изображения, логотипы, тексты, дизайны), 
                предоставляемые для изготовления заказа, не нарушают авторских прав, товарных знаков 
                или иных прав интеллектуальной собственности третьих лиц.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                8.2. Исполнитель не несёт ответственности за нарушение авторских прав и прав 
                интеллектуальной собственности третьих лиц в связи с использованием материалов, 
                предоставленных Заказчиком.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                8.3. В случае предъявления претензий третьими лицами в связи с нарушением их 
                авторских или иных прав, вызванным использованием материалов Заказчика, 
                Заказчик обязуется урегулировать такие претензии самостоятельно и за свой счёт.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                8.4. Исполнитель оставляет за собой право отказать в выполнении заказа, 
                если есть обоснованные подозрения в нарушении авторских прав или незаконности 
                содержания предоставленных материалов.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">9. Контактная информация</h2>
              <p className="text-muted-foreground leading-relaxed">
                ИП «Мастерская сувениров»<br />
                Адрес: г. Калининград, ТЦ Экватор, 2 этаж, Генерала Челнокова 9<br />
                Телефон: +7 952 114-23-50<br />
                email: msuvenirov39@yandex.ru
              </p>
            </div>
          </section>
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2019 Мастерская сувениров. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicOffer;
