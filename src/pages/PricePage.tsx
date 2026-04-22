import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
const FloatingOrderButton = lazy(() => import('@/components/FloatingOrderButton'));
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shirt, Gift, FileText, Maximize, Coffee, CircleDot, CalendarDays } from 'lucide-react';
import {
  mugPrices,
  badgePricesZnachki,
  badgePricesBreloki,
  magnetVinylPrices,
  magnetAcrylPrices,
  fabricProducts,
  printingPrices,
  notebookPrices,
  operativePrices,
  businessCardPrices,
  wideFormatPrices,
  quarterlyCalendars,
  wallCalendars,
  desktopCalendars,
  pocketCalendars,
  calendarOptions,
} from '@/data/prices';



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
          <p className="text-xs sm:text-sm text-muted-foreground font-normal">Изготовление закатных значков, брелоков, магнитов и 3D-стикеров — мерч, промо, сувениры</p>
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
  const handleCalculate = () => {
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
        <div className="px-4 sm:px-6 pt-3">
          <Link to="/pechat_na_tkani" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            <Shirt className="w-4 h-4" />
            Подробнее об услуге «Печать на ткани» →
          </Link>
        </div>
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
              <p className="text-xs text-muted-foreground px-4 py-3 leading-relaxed">
                * Итоговая стоимость зависит от модели, цвета и количества изделий. Для точного расчёта свяжитесь с менеджером.
              </p>
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
                        onClick={handleCalculate}
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
          <p className="text-xs sm:text-sm text-muted-foreground font-normal">Цветная печать визиток, листовок, флаеров и блокнотов — оперативно и по доступным ценам</p>
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
          <p className="text-xs sm:text-sm text-muted-foreground font-normal">Печать баннеров, плёнок, вывесок и наклеек — наружная и интерьерная реклама в Калининграде</p>
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


const CalendarSection = () => (
  <AccordionItem value="Календари" className="border border-border/50 rounded-xl overflow-hidden mb-4 neon-border">
    <AccordionTrigger className="px-4 sm:px-6 py-4 sm:py-5 hover:no-underline hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3 text-left">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <CalendarDays className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-foreground">Календари</h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-normal">Печать календарей любого типа — квартальные, настенные, настольные и карманные с вашим дизайном</p>
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

const GiftsSection = () => (
  <AccordionItem value="Подарки" className="border-2 border-primary/40 rounded-xl overflow-hidden mb-4 neon-border ring-1 ring-primary/20 shadow-[0_0_15px_-3px_hsl(var(--primary)/0.3)]">
    <AccordionTrigger className="px-4 sm:px-6 py-4 sm:py-5 hover:no-underline hover:bg-primary/5 transition-colors bg-primary/5">
      <div className="flex items-center gap-3 text-left">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
          <Gift className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base sm:text-lg font-bold text-foreground">Подарки с вашим дизайном</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">Для вас</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground font-normal">Индивидуальная печать от 1 шт. — идеальный подарок для себя и близких</p>
        </div>
      </div>
    </AccordionTrigger>
    <AccordionContent className="px-0 pb-0">
      <div className="px-4 sm:px-6 pt-3">
        <Link to="/pechat_na_tkani" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          <Shirt className="w-4 h-4" />
          Подробнее об услуге «Печать на ткани» →
        </Link>
      </div>
      <Accordion type="multiple" className="px-4 sm:px-6 py-3 space-y-3">
        <AccordionItem value="clothes" className="border border-border/30 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/20 text-sm font-bold text-foreground">
            <div className="text-left">
              <h3 className="text-sm font-bold text-foreground">Одежда со смыслом</h3>
              <p className="text-xs font-normal text-muted-foreground mt-1">Футболки, худи, шоперы, кепки</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-0 pb-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow className="bg-muted/30"><TableHead className="font-bold text-foreground">Наименование</TableHead><TableHead className="font-bold text-foreground text-right">Цена</TableHead></TableRow></TableHeader>
                <TableBody>
                  <TableRow><TableCell className="font-medium text-foreground" colSpan={2}><span className="text-muted-foreground text-xs">Футболка хлопок 100% 180 гр</span></TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground pl-6">с печатью формата А5</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">1 350 ₽</TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground pl-6">с печатью формата А4</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">1 550 ₽</TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground pl-6">с печатью формата А3</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">1 850 ₽</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium text-foreground" colSpan={2}><span className="text-muted-foreground text-xs">Худи ПЕТЛЯ 100% хлопок</span></TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground pl-6">с печатью формата А5</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">2 350 ₽</TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground pl-6">с печатью формата А4</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">2 650 ₽</TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground pl-6">с печатью формата А3</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">2 950 ₽</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium text-foreground" colSpan={2}><span className="text-muted-foreground text-xs">Шопер хлопок 100%</span></TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground pl-6">с печатью формата А5</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">900 ₽</TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground pl-6">с печатью формата А4</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">1 200 ₽</TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground">Бейсболка велюр</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">1 100 ₽</TableCell></TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="px-4 py-3 bg-muted/20 border-t border-border/30">
              <p className="text-xs sm:text-sm font-semibold text-foreground mb-2">Цена печати на вашем изделии:</p>
              <div className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                <p>формата А5 — <span className="neon-text font-semibold">600 ₽</span></p>
                <p>формата А4 — <span className="neon-text font-semibold">800 ₽</span></p>
                <p>формата А3 — <span className="neon-text font-semibold">1 100 ₽</span></p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="dishes" className="border border-border/30 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/20 text-sm font-bold text-foreground">
            <div className="text-left">
              <h3 className="text-sm font-bold text-foreground">Посуда и уют</h3>
              <p className="text-xs font-normal text-muted-foreground mt-1">Кружки и подушки</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-0 pb-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow className="bg-muted/30"><TableHead className="font-bold text-foreground">Наименование</TableHead><TableHead className="font-bold text-foreground text-right">Цена</TableHead></TableRow></TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground">Кружка белая ПРЕМИУМ 330 мл</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">650 ₽</TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground">Кружка цв. внутри ПРЕМИУМ 330 мл</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">750 ₽</TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground">Кружка ХАМЕЛЕОН 330 мл</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">1 100 ₽</TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground">Кружка Пивная 630 мл</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">1 200 ₽</TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground">Подушка с наволочкой на молнии</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">1 450 ₽</TableCell></TableRow>
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="photogifts" className="border border-border/30 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/20 text-sm font-bold text-foreground">
            <div className="text-left">
              <h3 className="text-sm font-bold text-foreground">Фотоподарки на память</h3>
              <p className="text-xs font-normal text-muted-foreground mt-1">Пазлы, магниты, брелоки</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-0 pb-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow className="bg-muted/30"><TableHead className="font-bold text-foreground">Наименование</TableHead><TableHead className="font-bold text-foreground text-right">Цена</TableHead></TableRow></TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground">Пазл формата А3</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">950 ₽</TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground">Пазл формата А4</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">850 ₽</TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground">Пазл формата А5</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">650 ₽</TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground">Пазл сердце</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">850 ₽</TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground">Магнит Акрил 105×105 мм, 105×70 мм</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">250 ₽</TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground">Брелок Акрил 55×40 мм</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">150 ₽</TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground">Брелок Металлический 50×37 мм</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">500 ₽</TableCell></TableRow>
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="fun-stuff" className="border border-border/30 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/20 text-sm font-bold text-foreground">
            <div className="text-left">
              <h3 className="text-sm font-bold text-foreground">Прикольные мелочи</h3>
              <p className="text-xs font-normal text-muted-foreground mt-1">Значки, коврики для мышки, вымпелы</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-0 pb-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow className="bg-muted/30"><TableHead className="font-bold text-foreground">Наименование</TableHead><TableHead className="font-bold text-foreground text-right">Цена</TableHead></TableRow></TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground">Значки закатные от 10 шт</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">100 ₽/шт</TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground">Коврик для мыши</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">800 ₽</TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground">Вымпел</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">1 100 ₽</TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground">Новогодний шар 70 мм</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">450 ₽</TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground">Медаль металлическая</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">400 ₽</TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground">3D стикер 3 шт</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">500 ₽</TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground">Наклейка на авто</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">от 700 ₽</TableCell></TableRow>
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="operative-print" className="border border-border/30 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/20 text-sm font-bold text-foreground">
            <h3 className="text-sm font-bold text-foreground">Оперативная полиграфия</h3>
          </AccordionTrigger>
          <AccordionContent className="px-0 pb-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow className="bg-muted/30"><TableHead className="font-bold text-foreground">Услуга</TableHead><TableHead className="font-bold text-foreground text-right">Цена</TableHead></TableRow></TableHeader>
                <TableBody>
                  <TableRow><TableCell className="font-medium text-foreground" colSpan={2}><span className="text-muted-foreground text-xs">Печать формата А4</span></TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground pl-6">ч/б</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">15 ₽</TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground pl-6">цв</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">25 ₽</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium text-foreground" colSpan={2}><span className="text-muted-foreground text-xs">Печать формата А3</span></TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground pl-6">ч/б</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">30 ₽</TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground pl-6">цв</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">40 ₽</TableCell></TableRow>
                  <TableRow className="hover:bg-primary/5"><TableCell className="font-medium text-foreground">Редактирование документа</TableCell><TableCell className="text-right whitespace-nowrap neon-text font-semibold">от 50 ₽</TableCell></TableRow>
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
        <title>Прайс на полиграфию и печать сувениров в Калининграде | Мастерская сувениров</title>
        <meta name="description" content="Прайс-лист: печать на футболках, кружках, визитки, баннеры, календари, значки в Калининграде. Цены от производителя. Закажите расчёт!" />
        <meta name="keywords" content="прайс печать калининград, цены полиграфия калининград, печать на футболках цена, визитки калининград, широкоформатная печать, сувениры на заказ, календари печать, значки брелоки" />
        <link rel="canonical" href="https://msuvenirov.ru/price" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://msuvenirov.ru/" },
            { "@type": "ListItem", "position": 2, "name": "Прайс-лист", "item": "https://msuvenirov.ru/price" }
          ]
        })}</script>
        <meta property="og:title" content="Прайс на полиграфию и печать сувениров в Калининграде | Мастерская сувениров" />
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground">
              Прайс-лист
            </h1>
             <p className="text-muted-foreground mt-3 sm:mt-4 max-w-3xl mx-auto text-sm sm:text-base">
               Актуальные цены на DTF-печать, широкоформатную печать, визитки, календари и сувенирную продукцию. Собственное производство — точную стоимость уточняйте у менеджера.
               {' '}Подробнее о технологиях — в <Link to="/faq" className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors">разделе FAQ</Link>.
             </p>
           </header>

           <section className="max-w-3xl mx-auto" aria-label="Каталог услуг и цен">
            <Accordion type="multiple" defaultValue={['Подарки']}>
              <GiftsSection />
              <FabricPrintingSection />
              <MugSection />
              <BadgeSection />
              <WideFormatSection />
              <PolygraphySection />
              <CalendarSection />
            </Accordion>
          </section>

          <div className="text-center mt-10 sm:mt-14">
            <p className="text-muted-foreground text-sm mb-4">
              Нужен расчёт для тиража или индивидуального заказа?
            </p>
            <button
              onClick={() => {
                const orderButton = document.querySelector('[data-order-button]') as HTMLButtonElement;
                if (orderButton) orderButton.click();
              }}
              className="relative inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm gradient-btn gradient-btn-pulse [&]:text-white hover:text-white [&>*]:relative [&>*]:z-10"
            >
              <span>Получить расчёт</span>
            </button>
            <Link
              to="/faq"
              className="inline-block mt-6 text-sm text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
            >
              Частые вопросы о печати →
            </Link>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8 max-w-xl mx-auto">
            Информация на данной странице носит исключительно информационный характер и не является публичной офертой. 
            Точные цены и условия уточняйте у менеджера.
          </p>
        </div>
      </main>
      <Footer />
      <Suspense fallback={null}>
        <FloatingOrderButton />
      </Suspense>
    </div>
  );
};

export default PricePage;
