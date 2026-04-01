import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingOrderButton from '@/components/FloatingOrderButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shirt, Gift, FileText, Maximize, Coffee, CircleDot, CalendarDays } from 'lucide-react';

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

const notebookPrices = [
  { name: 'Блокнот А5', qty20: '150', qty50: '110', qty100: '100', qty200: '95', qty300: '80' },
  { name: 'Блокнот А6', qty20: '85', qty50: '75', qty100: '70', qty200: '65', qty300: '60' },
];

const operativePrices = [
  { format: 'А3', paper: 'Тонкая (80 гр)', s50: '65', s100: '56', s200: '45', d50: '110', d100: '97', d200: '86' },
  { format: '', paper: 'Плотная (115–300 гр)', s50: '120', s100: '108', s200: '96', d50: '195', d100: '175', d200: '155' },
  { format: 'А4', paper: 'Тонкая (80 гр)', s50: '40', s100: '34', s200: '30', d50: '60', d100: '54', d200: '48' },
  { format: '', paper: 'Плотная (115–300 гр)', s50: '80', s100: '70', s200: '62', d50: '125', d100: '113', d200: '100' },
  { format: 'А5', paper: 'Тонкая (80 гр)', s50: '25', s100: '20', s200: '18', d50: '35', d100: '30', d200: '27' },
  { format: '', paper: 'Плотная (115–300 гр)', s50: '40', s100: '35', s200: '31', d50: '65', d100: '56', d200: '50' },
  { format: '1/3 А4 (Еврофлаер)', paper: 'Тонкая (80 гр)', s50: '15', s100: '14', s200: '13', d50: '25', d100: '20', d200: '18' },
  { format: '', paper: 'Плотная (115–300 гр)', s50: '25', s100: '23', s200: '21', d50: '45', d100: '38', d200: '34' },
  { format: 'А6', paper: 'Тонкая (80 гр)', s50: '25', s100: '20', s200: '18', d50: '25', d100: '20', d200: '18' },
  { format: '', paper: 'Плотная (115–300 гр)', s50: '20', s100: '18', s200: '16', d50: '30', d100: '29', d200: '25' },
];

const businessCardPrices = [
  { name: 'Односторонняя', qty100: '7,5', qty300: '6,5', qty500: '5,5' },
  { name: 'Двусторонняя', qty100: '12,5', qty300: '10,5', qty500: '9,5' },
];

const wideFormatPrices = [
  { name: 'Плёнка самоклеящаяся с печатью (белая глянцевая, матовая)', price: '1 050' },
  { name: 'Плёнка самоклеящаяся с печатью (белая глянцевая, матовая) с контурным резом', price: '1 350' },
  { name: 'Плёнка самоклеящаяся (белая и цветная / глянцевая, матовая) с контурным резом, на монтажке', price: '2 300' },
  { name: 'Баннерная ткань (склейка, пробивание люверсов)', price: '1 300' },
  { name: 'Печать на плёнке OneVision (сетка на самоклеющейся основе)', price: '1 450' },
  { name: 'Накатка виниловой плёнки на ПВХ-пластик 3–10 мм', price: 'от 4 800' },
];

const quarterlyCalendars = [
  { name: '«Стандарт+» (4 поля)', midi50: '610', mini50: '400', midi100: '580', mini100: '370' },
  { name: '«Стандарт» (2 поля)', midi50: '395', mini50: '270', midi100: '390', mini100: '345' },
  { name: '«Классик» (1 поле)', midi50: '340', mini50: '255', midi100: '335', mini100: '250' },
  { name: '«Одноблочный» (2 поля)', midi50: '335', mini50: '270', midi100: '300', mini100: '260' },
];

const wallCalendars = [
  { name: 'Плакат (1 лист А3)', qty1_20: '180', qty21_50: '175', qty51_100: '170', qty100plus: '165' },
  { name: 'Перекидной А4 (13 листов)', qty1_20: '695', qty21_50: '540', qty51_100: '480', qty100plus: '420' },
  { name: 'Перекидной А3 (13 листов)', qty1_20: '1 390', qty21_50: '1 080', qty51_100: '960', qty100plus: '840' },
];

const desktopCalendars = [
  { name: 'Обычный домик', qty20: '60', qty50: '55', qty100: '45' },
  { name: 'Домик с отрывными месяцами', qty20: '270', qty50: '265', qty100: '240' },
];

const pocketCalendars = [
  { qty: 'до 100 шт.', price: '625' },
  { qty: '200 шт.', price: '1 170' },
  { qty: '300 шт.', price: '1 795' },
  { qty: '500 шт.', price: '2 185' },
  { qty: '1 000 шт.', price: '4 055' },
  { qty: '10 000 шт.', price: '17 160' },
];

const calendarOptions = [
  { name: 'Металлические планки', price: '85' },
  { name: 'Магнитный курсор с подложкой', price: '100' },
  { name: 'Матовая ламинация', price: '35' },
];

const categories = [souvenirs];

const MugSection = () => (
  <AccordionItem value="Кружки" className="border border-border/50 rounded-xl overflow-hidden mb-4 neon-border">
    <AccordionTrigger className="px-4 sm:px-6 py-4 sm:py-5 hover:no-underline hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3 text-left">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Coffee className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-foreground">Кружки</h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-normal">Печать на кружках методом сублимации — идеально для корпоративных подарков и промоакций</p>
        </div>
      </div>
    </AccordionTrigger>
    <AccordionContent className="px-0 pb-0">
      <div className="overflow-x-auto">
        <Table aria-label="Цены на кружки с печатью">
          <caption className="sr-only">Прайс-лист на кружки с сублимацией — цены за штуку в зависимости от тиража</caption>
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
          <h2 className="text-base sm:text-lg font-bold text-foreground">Значки, брелоки, магниты</h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-normal">Закатные значки, значки на цанге, брелоки, магниты, стикеры 3D</p>
        </div>
      </div>
    </AccordionTrigger>
    <AccordionContent className="px-0 pb-0">
      <Accordion type="multiple" className="px-4 sm:px-6 py-3 space-y-3">
        <AccordionItem value="znachki" className="border border-border/30 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/20 text-sm font-bold text-foreground">
            <h3 className="text-sm font-bold text-foreground">Значки</h3>
          </AccordionTrigger>
          <AccordionContent className="px-0 pb-0">
            <div className="overflow-x-auto">
              <QtyTable items={badgePricesZnachki} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="breloki" className="border border-border/30 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/20 text-sm font-bold text-foreground">
            <h3 className="text-sm font-bold text-foreground">Брелоки</h3>
          </AccordionTrigger>
          <AccordionContent className="px-0 pb-0">
            <div className="overflow-x-auto">
              <QtyTable items={badgePricesBreloki} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="magnity" className="border border-border/30 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/20 text-sm font-bold text-foreground">
            <h3 className="text-sm font-bold text-foreground">Магниты</h3>
          </AccordionTrigger>
          <AccordionContent className="px-0 pb-0">
            <p className="px-4 py-2 text-sm font-bold neon-text">Магнит винил 0,4–0,7 мм</p>
            <div className="overflow-x-auto">
              <MagnetTable items={magnetVinylPrices} />
            </div>
            <div className="overflow-x-auto mt-4">
              <MagnetTable items={magnetAcrylPrices} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="stikery3d" className="border border-border/30 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/20 text-sm font-bold text-foreground">
            <h3 className="text-sm font-bold text-foreground">Стикеры 3D из эпоксидной смолы</h3>
          </AccordionTrigger>
          <AccordionContent className="px-0 pb-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-bold text-foreground">Тип вырубки</TableHead>
                    <TableHead className="font-bold text-foreground text-center">Стоимость за 1 см²</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-primary/5 transition-colors">
                    <TableCell className="font-medium text-foreground">Простая вырубка</TableCell>
                    <TableCell className="text-center whitespace-nowrap neon-text font-semibold">5 ₽/см²</TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-primary/5 transition-colors">
                    <TableCell className="font-medium text-foreground">Сложная вырубка</TableCell>
                    <TableCell className="text-center whitespace-nowrap neon-text font-semibold">6,5 ₽/см²</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="px-4 py-3 bg-muted/20 border-t border-border/30">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Минимальная сумма заказа — <span className="neon-text font-semibold">2 000 ₽</span>
              </p>
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
          <h2 className="text-base sm:text-lg font-bold text-foreground">Печать на ткани</h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-normal">DTF-печать на футболках, худи, шопперах — от 1 штуки, своё производство в Калининграде</p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-0 pb-0">
        {/* Изделия */}
        <Accordion type="multiple" className="px-4 sm:px-6 py-3">
          <AccordionItem value="products" className="border border-border/30 rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/20 text-sm font-bold text-foreground">
              <h3 className="text-sm font-bold text-foreground">Изделие</h3>
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

const PolygraphySection = () => (
  <AccordionItem value="Полиграфия" className="border border-border/50 rounded-xl overflow-hidden mb-4 neon-border">
    <AccordionTrigger className="px-4 sm:px-6 py-4 sm:py-5 hover:no-underline hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3 text-left">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-foreground">Полиграфия</h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-normal">Блокноты, листовки, флаеры, визитки</p>
        </div>
      </div>
    </AccordionTrigger>
    <AccordionContent className="px-0 pb-0">
      <Accordion type="multiple" className="px-4 sm:px-6 py-3 space-y-3">
        {/* Блокнот */}
        <AccordionItem value="bloknot" className="border border-border/30 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/20 text-sm font-bold text-foreground">
            <h3 className="text-sm font-bold text-foreground">Блокнот</h3>
          </AccordionTrigger>
          <AccordionContent className="px-0 pb-0">
            <p className="px-4 py-2 text-xs text-muted-foreground">
              40 листов 80 гр/м², обложка цветная 240 гр/м², сборка на металлическую пружину
            </p>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-bold text-foreground">Формат</TableHead>
                    <TableHead className="font-bold text-foreground text-center">20 шт</TableHead>
                    <TableHead className="font-bold text-foreground text-center">50 шт</TableHead>
                    <TableHead className="font-bold text-foreground text-center">100 шт</TableHead>
                    <TableHead className="font-bold text-foreground text-center">200 шт</TableHead>
                    <TableHead className="font-bold text-foreground text-center">300 шт</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notebookPrices.map((item) => (
                    <TableRow key={item.name} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty20} ₽</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty50} ₽</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty100} ₽</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty200} ₽</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty300} ₽</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Оперативная полиграфия */}
        <AccordionItem value="operative" className="border border-border/30 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/20 text-sm font-bold text-foreground">
            <h3 className="text-sm font-bold text-foreground">Оперативная полиграфия (Листовки, флаеры, плакаты) — цветная печать</h3>
          </AccordionTrigger>
          <AccordionContent className="px-0 pb-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-bold text-foreground" rowSpan={2}>Формат</TableHead>
                    <TableHead className="font-bold text-foreground" rowSpan={2}>Плотность</TableHead>
                    <TableHead className="font-bold text-foreground text-center" colSpan={3}>
                      <div>1-сторонняя</div>
                      <div className="text-xs font-normal text-muted-foreground">50 / 100 / 200 шт</div>
                    </TableHead>
                    <TableHead className="font-bold text-foreground text-center" colSpan={3}>
                      <div>2-сторонняя</div>
                      <div className="text-xs font-normal text-muted-foreground">50 / 100 / 200 шт</div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operativePrices.map((row, i) => (
                    <TableRow key={i} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="font-medium text-foreground">{row.format}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{row.paper}</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{row.s50}</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{row.s100}</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{row.s200}</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{row.d50}</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{row.d100}</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{row.d200}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Визитки */}
        <AccordionItem value="vizitki" className="border border-border/30 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/20 text-sm font-bold text-foreground">
            <h3 className="text-sm font-bold text-foreground">Визитки</h3>
          </AccordionTrigger>
          <AccordionContent className="px-0 pb-0">
            <p className="px-4 py-2 text-xs text-muted-foreground">
              Бумага: глянцевая или матовая 300 гр/м²
            </p>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-bold text-foreground">Вид печати</TableHead>
                    <TableHead className="font-bold text-foreground text-center">100 шт</TableHead>
                    <TableHead className="font-bold text-foreground text-center">300 шт</TableHead>
                    <TableHead className="font-bold text-foreground text-center">500 шт</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {businessCardPrices.map((item) => (
                    <TableRow key={item.name} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty100} ₽</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty300} ₽</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty500} ₽</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </AccordionContent>
  </AccordionItem>
);

const WideFormatSection = () => (
  <AccordionItem value="Широкоформатная печать" className="border border-border/50 rounded-xl overflow-hidden mb-4 neon-border">
    <AccordionTrigger className="px-4 sm:px-6 py-4 sm:py-5 hover:no-underline hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3 text-left">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Maximize className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-foreground">Широкоформатная печать</h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-normal">Баннеры, плёнки, вывески и интерьерная печать</p>
        </div>
      </div>
    </AccordionTrigger>
    <AccordionContent className="px-0 pb-0">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-bold text-foreground">Наименование</TableHead>
              <TableHead className="font-bold text-foreground text-right">
                <div>Стоимость</div>
                <div className="text-xs font-normal text-muted-foreground">1 м²</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wideFormatPrices.map((item) => (
              <TableRow key={item.name} className="hover:bg-primary/5 transition-colors">
                <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                <TableCell className="text-right whitespace-nowrap neon-text font-semibold">{item.price} ₽</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AccordionContent>
  </AccordionItem>
);

const PriceSection = ({ category }: { category: typeof souvenirs }) => (
  <AccordionItem value={category.title} className="border border-border/50 rounded-xl overflow-hidden mb-4 neon-border">
    <AccordionTrigger className="px-4 sm:px-6 py-4 sm:py-5 hover:no-underline hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3 text-left">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          {category.icon}
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-foreground">{category.title}</h2>
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

const CalendarSection = () => (
  <AccordionItem value="Календари" className="border border-border/50 rounded-xl overflow-hidden mb-4 neon-border">
    <AccordionTrigger className="px-4 sm:px-6 py-4 sm:py-5 hover:no-underline hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3 text-left">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <CalendarDays className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-foreground">Календари</h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-normal">Квартальные, настенные, настольные и карманные календари</p>
        </div>
      </div>
    </AccordionTrigger>
    <AccordionContent className="px-0 pb-0">
      <Accordion type="multiple" className="px-4 sm:px-6 py-3 space-y-3">
        {/* Квартальные */}
        <AccordionItem value="quarterly" className="border border-border/30 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/20 text-sm font-bold text-foreground">
            <div className="text-left">
              <span>Квартальные календари</span>
              <p className="text-xs font-normal text-muted-foreground mt-1">МИНИ — ширина 297 мм, МИДИ — ширина 335 мм</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-0 pb-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-bold text-foreground" rowSpan={2}>Вид календаря</TableHead>
                    <TableHead className="font-bold text-foreground text-center" colSpan={2}>50 шт</TableHead>
                    <TableHead className="font-bold text-foreground text-center" colSpan={2}>100 шт</TableHead>
                  </TableRow>
                  <TableRow className="bg-muted/20">
                    <TableHead className="font-bold text-foreground text-center text-xs">МИДИ</TableHead>
                    <TableHead className="font-bold text-foreground text-center text-xs">МИНИ</TableHead>
                    <TableHead className="font-bold text-foreground text-center text-xs">МИДИ</TableHead>
                    <TableHead className="font-bold text-foreground text-center text-xs">МИНИ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quarterlyCalendars.map((item) => (
                    <TableRow key={item.name} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.midi50} ₽</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.mini50} ₽</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.midi100} ₽</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.mini100} ₽</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Настенные и плакатные */}
        <AccordionItem value="wall" className="border border-border/30 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/20 text-sm font-bold text-foreground">
            <div className="text-left">
              <span>Настенные и плакатные календари</span>
              <p className="text-xs font-normal text-muted-foreground mt-1">Бумага 170 гр</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-0 pb-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-bold text-foreground">Формат</TableHead>
                    <TableHead className="font-bold text-foreground text-center">1–20 шт</TableHead>
                    <TableHead className="font-bold text-foreground text-center">21–50 шт</TableHead>
                    <TableHead className="font-bold text-foreground text-center">51–100 шт</TableHead>
                    <TableHead className="font-bold text-foreground text-center">100+ шт</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wallCalendars.map((item) => (
                    <TableRow key={item.name} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty1_20} ₽</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty21_50} ₽</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty51_100} ₽</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty100plus} ₽</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Настольные домики */}
        <AccordionItem value="desktop" className="border border-border/30 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/20 text-sm font-bold text-foreground">
            <div className="text-left">
              <span>Настольные календари «Домики»</span>
              <p className="text-xs font-normal text-muted-foreground mt-1">200×95 мм</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-0 pb-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-bold text-foreground">Вид домика</TableHead>
                    <TableHead className="font-bold text-foreground text-center">до 20 шт</TableHead>
                    <TableHead className="font-bold text-foreground text-center">50 шт</TableHead>
                    <TableHead className="font-bold text-foreground text-center">100 шт</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {desktopCalendars.map((item) => (
                    <TableRow key={item.name} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty20} ₽</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty50} ₽</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.qty100} ₽</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Карманные */}
        <AccordionItem value="pocket" className="border border-border/30 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/20 text-sm font-bold text-foreground">
            <div className="text-left">
              <span>Карманные календари</span>
              <p className="text-xs font-normal text-muted-foreground mt-1">60×90 мм</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-0 pb-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-bold text-foreground">Тираж</TableHead>
                    <TableHead className="font-bold text-foreground text-center">Цена за тираж</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pocketCalendars.map((item) => (
                    <TableRow key={item.qty} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="font-medium text-foreground">{item.qty}</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.price} ₽</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Дополнительные опции */}
        <AccordionItem value="calendar-options" className="border border-border/30 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/20 text-sm font-bold text-foreground">
            <h3 className="text-sm font-bold text-foreground">Дополнительные опции</h3>
          </AccordionTrigger>
          <AccordionContent className="px-0 pb-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-bold text-foreground">Услуга</TableHead>
                    <TableHead className="font-bold text-foreground text-center">Цена</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calendarOptions.map((item) => (
                    <TableRow key={item.name} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold">{item.price} ₽</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </AccordionContent>
  </AccordionItem>
);

const PricePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Helmet>
        <title>Цены на печать и сувениры в Калининграде | Мастерская сувениров</title>
        <meta name="description" content="Прайс-лист: печать на футболках, кружках, визитки, баннеры, календари, значки в Калининграде. Цены от производителя. Закажите расчёт!" />
        <meta name="keywords" content="прайс печать калининград, цены полиграфия калининград, печать на футболках цена, визитки калининград, широкоформатная печать, сувениры на заказ, календари печать, значки брелоки" />
        <link rel="canonical" href="https://msuvenirov.ru/price" />
        <meta property="og:title" content="Цены на печать и сувениры в Калининграде | Мастерская сувениров" />
        <meta property="og:description" content="Актуальные цены на печать, полиграфию и сувенирную продукцию. Собственное производство в Калининграде." />
        <meta property="og:url" content="https://msuvenirov.ru/price" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ru_RU" />
        <meta property="og:site_name" content="Мастерская сувениров" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Прайс-лист — Мастерская сувениров Калининград",
          "description": "Актуальные цены на печать на футболках, кружках, значках, баннерах, полиграфию и календари в Калининграде.",
          "url": "https://msuvenirov.ru/price",
          "mainEntity": {
            "@type": "OfferCatalog",
            "name": "Прайс-лист Мастерской сувениров",
            "itemListElement": [
              {
                "@type": "OfferCatalog",
                "name": "Печать на ткани",
                "description": "DTF-печать на футболках, худи, шопперах от 1 штуки"
              },
              {
                "@type": "OfferCatalog",
                "name": "Полиграфия",
                "description": "Визитки, листовки, блокноты, плакаты — цветная печать"
              },
              {
                "@type": "OfferCatalog",
                "name": "Широкоформатная печать",
                "description": "Баннеры, плёнки, вывески, печать на ПВХ-пластике"
              },
              {
                "@type": "OfferCatalog",
                "name": "Календари",
                "description": "Квартальные, настенные, настольные и карманные календари"
              },
              {
                "@type": "OfferCatalog",
                "name": "Значки, брелоки, магниты",
                "description": "Закатные значки, брелоки, виниловые и акриловые магниты, стикеры 3D"
              },
              {
                "@type": "OfferCatalog",
                "name": "Кружки с печатью",
                "description": "Сублимация на кружках — белые, хамелеон, глиттер, мрамор"
              }
            ]
          },
          "publisher": {
            "@type": "LocalBusiness",
            "name": "Мастерская сувениров",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Калининград",
              "addressRegion": "Калининградская область",
              "addressCountry": "RU"
            },
            "url": "https://msuvenirov.ru"
          }
        })}</script>
      </Helmet>
      <Header />
      <main className="pt-24 sm:pt-28 pb-12 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          <header className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black">
              <span className="text-foreground">Прайс-лист на полиграфию </span>
              <span className="neon-text">и печать сувениров в Калининграде</span>
            </h1>
            <p className="text-muted-foreground mt-3 sm:mt-4 max-w-xl mx-auto text-sm sm:text-base">
              Актуальные цены на DTF-печать, широкоформатную печать, визитки, календари и сувенирную продукцию. Собственное производство — точную стоимость уточняйте у менеджера.
            </p>
          </header>

          <section className="max-w-3xl mx-auto" aria-label="Каталог услуг и цен">
            <Accordion type="multiple" defaultValue={['Печать на ткани']}>
              <FabricPrintingSection />
              <MugSection />
              <BadgeSection />
              <WideFormatSection />
              <PolygraphySection />
              <CalendarSection />
              {categories.map((cat) => (
                <PriceSection key={cat.title} category={cat} />
              ))}
            </Accordion>
          </section>

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

          <p className="text-center text-xs text-muted-foreground mt-8 max-w-xl mx-auto">
            Информация на данной странице носит исключительно информационный характер и не является публичной офертой. 
            Точные цены и условия уточняйте у менеджера.
          </p>
        </div>
      </main>
      <Footer />
      <FloatingOrderButton />
    </div>
  );
};

export default PricePage;
