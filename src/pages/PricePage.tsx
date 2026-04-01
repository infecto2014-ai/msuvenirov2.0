import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingOrderButton from '@/components/FloatingOrderButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shirt, Gift, FileText, Maximize, Coffee, CircleDot } from 'lucide-react';

const mugPrices = [
  { name: 'Кружка белая', qty1: '650', qty10: '450', qty30: '350', qty100: '315', qty200: '250' },
  { name: 'Кружка белая, цветная внутри или ручка', qty1: '750', qty10: '550', qty30: '470', qty100: '425', qty200: '340' },
  { name: 'Кружка ХАМЕЛЕОН', qty1: '1 100', qty10: '980', qty30: '890', qty100: '815', qty200: '650' },
  { name: 'Кружка глиттер градиент', qty1: '1 630', qty10: '980', qty30: '890', qty100: '815', qty200: '650' },
  { name: 'Кружка мрамор/зеркальное золото или серебро', qty1: '1 945', qty10: '1 170', qty30: '1 070', qty100: '970', qty200: '780' },
  { name: 'Кружка золото/серебро/стекло', qty1: '1 320', qty10: '790', qty30: '730', qty100: '660', qty200: '530' },
];

const badgePricesZnachki = [
  { name: 'Значок закатный 38 мм', qty25: '85', qty100: '45', qty200: '38', qty300: '35', qty400: '32', qty500: '30' },
  { name: 'Значок закатный 56 мм', qty25: '100', qty100: '49', qty200: '45', qty300: '41', qty400: '38', qty500: '33' },
  { name: 'Значок на цанге, круг 15 мм', qty25: '120', qty100: '110', qty200: '100', qty300: '92', qty400: '85', qty500: '75' },
  { name: 'Значок на цанге, круг 25 мм', qty25: '200', qty100: '185', qty200: '170', qty300: '155', qty400: '140', qty500: '125' },
  { name: 'Значок на цанге, круг 30 мм', qty25: '250', qty100: '230', qty200: '210', qty300: '190', qty400: '170', qty500: '150' },
  { name: 'Значок на цанге, круг 35 мм', qty25: '310', qty100: '285', qty200: '260', qty300: '240', qty400: '210', qty500: '190' },
];

const badgePricesBreloki = [
  { name: 'Брелок акриловый 40x56 мм', qty25: '130', qty100: '65', qty200: '60', qty300: '54', qty400: '49', qty500: '43' },
  { name: 'Брелок металлический', qty25: '500', qty100: '420', qty200: '400', qty300: '380', qty400: '350', qty500: '330' },
];

const magnetVinylPrices = [
  { name: 'Прямоугольник 40×60 мм', qty100: '35', qty200: '30', qty300: '28', qty400: '28', qty500: '26' },
  { name: 'Квадрат 60×60 мм', qty100: '36', qty200: '31', qty300: '30', qty400: '29', qty500: '28' },
  { name: 'Прямоугольник 60×80 мм', qty100: '39', qty200: '35', qty300: '33', qty400: '30', qty500: '29' },
  { name: 'Круг 68×68 мм', qty100: '36', qty200: '31', qty300: '30', qty400: '29', qty500: '28' },
  { name: 'Круг 50×50 мм', qty100: '35', qty200: '30', qty300: '28', qty400: '28', qty500: '26' },
];
const magnetAcrylPrices = [
  { name: 'Магнит акрил 105×105 мм', qty100: '160', qty200: '140', qty300: '120', qty400: '110', qty500: '90' },
  { name: 'Магнит акрил 105×70 мм', qty100: '160', qty200: '140', qty300: '120', qty400: '110', qty500: '90' },
  { name: 'Магнит акрил 80×55 мм', qty100: '130', qty200: '100', qty300: '90', qty400: '80', qty500: '75' },
];
const fabricProducts = [
  { name: 'Футболка унисекс 160–180 гр', price: 'от 400 ₽' },
  { name: 'Футболка детская 160–180 гр', price: 'от 300 ₽' },
  { name: 'Футболка оверсайз от 180 гр', price: 'от 700 ₽' },
  { name: 'Худи', price: 'от 1 300 ₽' },
  { name: 'Бейсболка', price: 'от 250 ₽' },
  { name: 'Шоппер', price: 'от 200 ₽' },
];

const printingPrices = [
  { format: 'А6', qty1_4: '600 ₽', qty5_10: '350 ₽', qty20_50: '280 ₽' },
  { format: 'А5', qty1_4: '600 ₽', qty5_10: '450 ₽', qty20_50: '330 ₽' },
  { format: 'А4', qty1_4: '900 ₽', qty5_10: '650 ₽', qty20_50: '450 ₽' },
  { format: 'А3', qty1_4: '1 300 ₽', qty5_10: '900 ₽', qty20_50: '680 ₽' },
];

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

const categories = [souvenirs, polygraphy, wideFormat];

const MugSection = () => (
  <AccordionItem value="Кружки" className="border border-border/50 rounded-xl overflow-hidden mb-4 neon-border">
    <AccordionTrigger className="px-4 sm:px-6 py-4 sm:py-5 hover:no-underline hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3 text-left">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Coffee className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">Кружки</h3>
          <p className="text-xs sm:text-sm text-muted-foreground font-normal">Кружки с сублимацией — белые, хамелеон, глиттер, мрамор и другие</p>
        </div>
      </div>
    </AccordionTrigger>
    <AccordionContent className="px-0 pb-0">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-bold text-foreground">Наименование</TableHead>
              <TableHead className="font-bold text-foreground text-center">1 шт</TableHead>
              <TableHead className="font-bold text-foreground text-center">10 шт</TableHead>
              <TableHead className="font-bold text-foreground text-center">30 шт</TableHead>
              <TableHead className="font-bold text-foreground text-center">100 шт</TableHead>
              <TableHead className="font-bold text-foreground text-center">200 шт</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mugPrices.map((item) => (
              <TableRow key={item.name} className="hover:bg-primary/5 transition-colors">
                <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty1} ₽</TableCell>
                <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty10} ₽</TableCell>
                <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty30} ₽</TableCell>
                <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty100} ₽</TableCell>
                <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty200} ₽</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AccordionContent>
  </AccordionItem>
);

const MagnetTable = ({ items }: { items: Array<{ name: string; qty100: string; qty200: string; qty300: string; qty400: string; qty500: string }> }) => (
  <Table>
    <TableHeader>
      <TableRow className="bg-muted/30">
        <TableHead className="font-bold text-foreground">Наименование</TableHead>
        <TableHead className="font-bold text-foreground text-center">100 шт</TableHead>
        <TableHead className="font-bold text-foreground text-center">200 шт</TableHead>
        <TableHead className="font-bold text-foreground text-center">300 шт</TableHead>
        <TableHead className="font-bold text-foreground text-center">400 шт</TableHead>
        <TableHead className="font-bold text-foreground text-center">500 шт</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {items.map((item) => (
        <TableRow key={item.name} className="hover:bg-primary/5 transition-colors">
          <TableCell className="font-medium text-foreground">{item.name}</TableCell>
          <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty100} ₽</TableCell>
          <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty200} ₽</TableCell>
          <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty300} ₽</TableCell>
          <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty400} ₽</TableCell>
          <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty500} ₽</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const QtyTable = ({ items }: { items: Array<{ name: string; qty25: string; qty100: string; qty200: string; qty300: string; qty400: string; qty500: string }> }) => (
  <Table>
    <TableHeader>
      <TableRow className="bg-muted/30">
        <TableHead className="font-bold text-foreground">Наименование</TableHead>
        <TableHead className="font-bold text-foreground text-center">25 шт</TableHead>
        <TableHead className="font-bold text-foreground text-center">100 шт</TableHead>
        <TableHead className="font-bold text-foreground text-center">200 шт</TableHead>
        <TableHead className="font-bold text-foreground text-center">300 шт</TableHead>
        <TableHead className="font-bold text-foreground text-center">400 шт</TableHead>
        <TableHead className="font-bold text-foreground text-center">500 шт</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {items.map((item) => (
        <TableRow key={item.name} className="hover:bg-primary/5 transition-colors">
          <TableCell className="font-medium text-foreground">{item.name}</TableCell>
          <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty25} ₽</TableCell>
          <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty100} ₽</TableCell>
          <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty200} ₽</TableCell>
          <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty300} ₽</TableCell>
          <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty400} ₽</TableCell>
          <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty500} ₽</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const BadgeSection = () => (
  <AccordionItem value="Значки" className="border border-border/50 rounded-xl overflow-hidden mb-4 neon-border">
    <AccordionTrigger className="px-4 sm:px-6 py-4 sm:py-5 hover:no-underline hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3 text-left">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <CircleDot className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">Значки, брелоки, магниты</h3>
          <p className="text-xs sm:text-sm text-muted-foreground font-normal">Закатные значки, значки на цанге, брелоки, магниты на виниле</p>
        </div>
      </div>
    </AccordionTrigger>
    <AccordionContent className="px-0 pb-0">
      <Accordion type="multiple" className="px-4 sm:px-6 py-3 space-y-3">
        <AccordionItem value="znachki" className="border border-border/30 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/20 text-sm font-bold text-foreground">
            Значки
          </AccordionTrigger>
          <AccordionContent className="px-0 pb-0">
            <div className="overflow-x-auto">
              <QtyTable items={badgePricesZnachki} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="breloki" className="border border-border/30 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/20 text-sm font-bold text-foreground">
            Брелоки
          </AccordionTrigger>
          <AccordionContent className="px-0 pb-0">
            <div className="overflow-x-auto">
              <QtyTable items={badgePricesBreloki} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="magnity" className="border border-border/30 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/20 text-sm font-bold text-foreground">
            Магниты
          </AccordionTrigger>
          <AccordionContent className="px-0 pb-0">
            <p className="px-4 py-2 text-sm font-bold text-foreground">Магнит винил 0,4–0,7 мм</p>
            <div className="overflow-x-auto">
              <MagnetTable items={magnetVinylPrices} />
            </div>
            <div className="overflow-x-auto mt-4">
              <MagnetTable items={magnetAcrylPrices} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </AccordionContent>
  </AccordionItem>
);
const FabricPrintingSection = () => {
  const handleCalculate = (format: string) => {
    const orderBtn = document.querySelector('[data-order-button]') as HTMLElement;
    if (orderBtn) orderBtn.click();
  };

  return (
    <AccordionItem value="Печать на ткани" className="border border-border/50 rounded-xl overflow-hidden mb-4 neon-border">
      <AccordionTrigger className="px-4 sm:px-6 py-4 sm:py-5 hover:no-underline hover:bg-muted/30 transition-colors">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Shirt className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground">Печать на ткани</h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-normal">Футболки, худи, шопперы и другой текстиль с вашим дизайном</p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-0 pb-0">
        {/* Изделия */}
        <Accordion type="multiple" className="px-4 sm:px-6 py-3">
          <AccordionItem value="products" className="border border-border/30 rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/20 text-sm font-bold text-foreground">
              Изделие
            </AccordionTrigger>
            <AccordionContent className="px-0 pb-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-bold text-foreground">Наименование</TableHead>
                    <TableHead className="font-bold text-foreground text-right">Цена</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fabricProducts.map((item) => (
                    <TableRow key={item.name} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                      <TableCell className="text-right whitespace-nowrap neon-text font-semibold">{item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Цена нанесения */}
        <div className="px-4 sm:px-6 pb-4">
          <h4 className="text-sm font-bold text-foreground mb-3">Цена нанесения (DTF)</h4>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-bold text-foreground">Формат</TableHead>
                  <TableHead className="font-bold text-foreground text-center">1–4 шт</TableHead>
                  <TableHead className="font-bold text-foreground text-center">5–10 шт</TableHead>
                  <TableHead className="font-bold text-foreground text-center">20–50 шт</TableHead>
                  <TableHead className="font-bold text-foreground text-center">50+ шт</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {printingPrices.map((row) => (
                  <TableRow key={row.format} className="hover:bg-primary/5 transition-colors">
                    <TableCell className="font-medium text-foreground">{row.format}</TableCell>
                    <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{row.qty1_4}</TableCell>
                    <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{row.qty5_10}</TableCell>
                    <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{row.qty20_50}</TableCell>
                    <TableCell className="text-center">
                      <button
                        onClick={() => handleCalculate(row.format)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold gradient-btn gradient-btn-pulse"
                      >
                        Рассчитать
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Доп. информация */}
        <div className="px-4 sm:px-6 py-4 bg-muted/20 border-t border-border/30 space-y-1.5">
          <p className="text-xs sm:text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Дополнительное нанесение</span> на другой стороне изделия — <span className="neon-text font-semibold">70%</span> от указанной стоимости.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Возможна добавочная стоимость за сложность нанесения. Стоимость метода сублимации и шелкографии — уточняйте у менеджера.
          </p>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

const PriceSection = ({ category }: { category: typeof souvenirs }) => (
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
              <FabricPrintingSection />
              <MugSection />
              <BadgeSection />
              {categories.map((cat) => (
                <PriceSection key={cat.title} category={cat} />
              ))}
            </Accordion>
          </div>

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
      <FloatingOrderButton />
    </div>
  );
};

export default PricePage;
