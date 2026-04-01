import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shirt, Gift, FileText, Maximize } from 'lucide-react';

const fabricPrinting = {
  icon: <Shirt className="w-5 h-5 text-primary" />,
  title: 'Печать на ткани',
  description: 'Футболки, худи, толстовки, шопперы и другой текстиль с вашим дизайном',
  items: [
    { name: 'Футболка с печатью (DTF)', from: 'от 1 200 ₽', note: 'A4 формат, хлопок' },
    { name: 'Худи с печатью', from: 'от 2 800 ₽', note: 'DTF / сублимация' },
    { name: 'Толстовка с печатью', from: 'от 2 500 ₽', note: 'DTF / сублимация' },
    { name: 'Шоппер с печатью', from: 'от 800 ₽', note: 'DTF печать' },
    { name: 'Кепка с печатью', from: 'от 900 ₽', note: 'DTF / вышивка' },
    { name: 'Детская футболка', from: 'от 1 000 ₽', note: 'A4 формат' },
  ],
  examples: ['Корпоративные футболки', 'Мерч для фан-клубов', 'Семейные комплекты'],
};

const souvenirs = {
  icon: <Gift className="w-5 h-5 text-primary" />,
  title: 'Сувенирная продукция',
  description: 'Кружки, магниты, брелоки, медали, бокалы и другие подарки',
  items: [
    { name: 'Кружка с печатью', from: 'от 600 ₽', note: 'Сублимация, 330 мл' },
    { name: 'Магнит', from: 'от 150 ₽', note: 'Акрил / металл' },
    { name: 'Брелок с печатью', from: 'от 200 ₽', note: 'Акрил / металл' },
    { name: 'Бокал с гравировкой', from: 'от 800 ₽', note: 'Лазерная гравировка' },
    { name: 'Медаль / награда', from: 'от 500 ₽', note: 'Металл, лазер' },
    { name: 'Новогодний шар', from: 'от 400 ₽', note: 'С индивидуальным дизайном' },
  ],
  examples: ['Корпоративные подарки', 'Сувениры к праздникам', 'Наградная продукция'],
};

const polygraphy = {
  icon: <FileText className="w-5 h-5 text-primary" />,
  title: 'Полиграфия',
  description: 'Визитки, листовки, буклеты, наклейки и другая печатная продукция',
  items: [
    { name: 'Визитки (100 шт)', from: 'от 800 ₽', note: 'Мелованная бумага 350г' },
    { name: 'Листовки A5 (100 шт)', from: 'от 1 500 ₽', note: '4+4, мелованная' },
    { name: 'Буклет A4→A5', from: 'от 2 000 ₽', note: '100 шт, 1 фальц' },
    { name: 'Наклейки (лист A4)', from: 'от 300 ₽', note: 'Плоттерная / цифровая' },
    { name: 'Календарь настенный', from: 'от 500 ₽', note: 'С вашим дизайном' },
    { name: 'Грамота / диплом', from: 'от 200 ₽', note: 'Печать на плотной бумаге' },
  ],
  examples: ['Фирменный стиль', 'Рекламные материалы', 'Промо-наклейки'],
};

const wideFormat = {
  icon: <Maximize className="w-5 h-5 text-primary" />,
  title: 'Широкоформатная печать',
  description: 'Баннеры, вывески, постеры, наклейки на авто и интерьерная печать',
  items: [
    { name: 'Баннер (м²)', from: 'от 500 ₽', note: 'Литой / ламинированный' },
    { name: 'Постер A1', from: 'от 400 ₽', note: 'Фотобумага / матовая' },
    { name: 'Наклейка на авто (м²)', from: 'от 1 200 ₽', note: 'Плёнка Oracal' },
    { name: 'Интерьерная печать (м²)', from: 'от 800 ₽', note: 'Холст / фотообои' },
    { name: 'Рулонный стенд (ролл-ап)', from: 'от 3 500 ₽', note: '85×200 см' },
    { name: 'Вывеска / табличка', from: 'от 1 000 ₽', note: 'ПВХ / композит' },
  ],
  examples: ['Оформление витрин', 'Выставочные стенды', 'Реклама на транспорте'],
};

const categories = [fabricPrinting, souvenirs, polygraphy, wideFormat];

const PriceSection = ({ category }: { category: typeof fabricPrinting }) => (
  <AccordionItem value={category.title} className="border border-border/50 rounded-xl overflow-hidden mb-4 neon-border">
    <AccordionTrigger className="px-4 sm:px-6 py-4 sm:py-5 hover:no-underline hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3 text-left">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          {category.icon}
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">{category.title}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground font-normal">{category.description}</p>
        </div>
      </div>
    </AccordionTrigger>
    <AccordionContent className="px-0 pb-0">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-bold text-foreground">Наименование</TableHead>
              <TableHead className="font-bold text-foreground text-right">Цена</TableHead>
              <TableHead className="font-bold text-foreground hidden sm:table-cell">Примечание</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {category.items.map((item) => (
              <TableRow key={item.name} className="hover:bg-primary/5 transition-colors">
                <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                <TableCell className="text-right whitespace-nowrap neon-text font-semibold">{item.from}</TableCell>
                <TableCell className="text-muted-foreground hidden sm:table-cell">{item.note}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Примеры работ */}
      <div className="px-4 sm:px-6 py-4 bg-muted/20 border-t border-border/30">
        <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">Примеры работ:</p>
        <div className="flex flex-wrap gap-2">
          {category.examples.map((ex) => (
            <span key={ex} className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              {ex}
            </span>
          ))}
        </div>
      </div>
    </AccordionContent>
  </AccordionItem>
);

const PricePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      <main className="pt-24 sm:pt-28 pb-12 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          <header className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black">
              <span className="text-foreground">Наш </span>
              <span className="neon-text">прайс-лист</span>
            </h1>
            <p className="text-muted-foreground mt-3 sm:mt-4 max-w-xl mx-auto text-sm sm:text-base">
              Актуальные цены на все виды печати и сувенирной продукции. Точную стоимость уточняйте у менеджера.
            </p>
          </header>

          <div className="max-w-3xl mx-auto">
            <Accordion type="multiple" defaultValue={['Печать на ткани']}>
              {categories.map((cat) => (
                <PriceSection key={cat.title} category={cat} />
              ))}
            </Accordion>
          </div>

          {/* CTA */}
          <div className="text-center mt-10 sm:mt-14">
            <p className="text-muted-foreground text-sm mb-4">
              Нужен расчёт для тиража или индивидуального заказа?
            </p>
            <a
              href="/#контакты"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm gradient-btn gradient-btn-pulse"
            >
              Получить расчёт
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricePage;
