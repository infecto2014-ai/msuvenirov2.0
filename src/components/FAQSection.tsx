import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Сколько стоит печать на футболке?',
    answer: 'Стоимость печати зависит от размера изображения, количества цветов и тиража. Точную стоимость рассчитаем после получения макета — отправьте заявку, и мы ответим в течение часа.',
    link: '/price',
    linkText: 'Посмотреть стоимость в прайс-листе',
  },
  {
    question: 'Какие сроки изготовления заказа?',
    answer: 'Стандартный срок изготовления — 2-5 рабочих дней в зависимости от объёма заказа. Срочные заказы выполняем за 1 час при наличии готового макета. Для корпоративных тиражей сроки обсуждаются индивидуально.',
  },
  {
    question: 'Есть ли доставка?',
    answer: 'Да, мы осуществляем доставку по Калининграду и Калининградской области. Также вы можете забрать заказ самовывозом из нашей мастерской в ТЦ Экватор (2 этаж, ул. Ген. Челнокова 11, стр. 1). Работаем без выходных с 10:00 до 20:00.',
  },
  {
    question: 'Какой минимальный тираж?',
    answer: 'Минимального тиража нет — работаем от 1 штуки! Это идеально для создания уникальных подарков, тестовых образцов или индивидуальных заказов. При заказе от 10 штук действуют оптовые скидки.',
  },
  {
    question: 'В каком формате нужен макет?',
    answer: 'Принимаем макеты в форматах PNG (с прозрачным фоном), PDF, AI (Adobe Illustrator), CDR (CorelDRAW), PSD (Photoshop). Оптимальное разрешение для печати — от 300 dpi. Если у вас нет готового макета, наши дизайнеры помогут его создать за дополнительную плату.',
  },
  {
    question: 'Размерная сетка футболок',
    answer: 'size-chart',
  },
];

const FAQSection = () => {
  return (
    <section id="вопросы" className="py-16 sm:py-24 relative overflow-hidden" aria-label="Часто задаваемые вопросы">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/5 to-background" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full neon-border text-xs sm:text-sm font-medium text-primary mb-3">
            FAQ
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">
            Частые вопросы
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="glass-card rounded-xl px-6 border-border/50 data-[state=open]:neon-glow transition-all duration-300"
              >
                <AccordionTrigger className="text-left text-sm sm:text-base font-semibold text-foreground hover:text-primary hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                  {faq.answer === 'size-chart' ? (
                    <div>
                      <p className="mb-4">Футболки унисекс, бесшовные, 100% хлопок, 160 г/м²</p>
                      <div className="overflow-x-auto -mx-2">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-border/50">
                              <TableHead rowSpan={2} className="text-foreground font-semibold text-xs align-middle">Показатель</TableHead>
                              <TableHead colSpan={7} className="text-center text-foreground font-semibold text-xs">Размеры российские / международные</TableHead>
                              <TableHead rowSpan={2} className="text-foreground font-semibold text-xs text-center align-middle whitespace-nowrap">± см</TableHead>
                            </TableRow>
                            <TableRow className="border-border/50">
                              <TableHead className="text-center text-xs text-muted-foreground whitespace-nowrap">42 (XS)</TableHead>
                              <TableHead className="text-center text-xs text-muted-foreground whitespace-nowrap">44 (S)</TableHead>
                              <TableHead className="text-center text-xs text-muted-foreground whitespace-nowrap">46 (M)</TableHead>
                              <TableHead className="text-center text-xs text-muted-foreground whitespace-nowrap">48 (L)</TableHead>
                              <TableHead className="text-center text-xs text-muted-foreground whitespace-nowrap">50 (XL)</TableHead>
                              <TableHead className="text-center text-xs text-muted-foreground whitespace-nowrap">52 (XXL)</TableHead>
                              <TableHead className="text-center text-xs text-muted-foreground whitespace-nowrap">54 (XXXL)</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow className="border-border/50">
                              <TableCell className="font-medium text-foreground text-xs">A - Длина изделия</TableCell>
                              <TableCell className="text-center text-xs">68</TableCell>
                              <TableCell className="text-center text-xs">70</TableCell>
                              <TableCell className="text-center text-xs">72</TableCell>
                              <TableCell className="text-center text-xs">74</TableCell>
                              <TableCell className="text-center text-xs">76</TableCell>
                              <TableCell className="text-center text-xs">78</TableCell>
                              <TableCell className="text-center text-xs">80</TableCell>
                              <TableCell className="text-center text-xs">2</TableCell>
                            </TableRow>
                            <TableRow className="border-border/50">
                              <TableCell className="font-medium text-foreground text-xs">B - Ширина изделия</TableCell>
                              <TableCell className="text-center text-xs">46</TableCell>
                              <TableCell className="text-center text-xs">49</TableCell>
                              <TableCell className="text-center text-xs">52</TableCell>
                              <TableCell className="text-center text-xs">55</TableCell>
                              <TableCell className="text-center text-xs">58</TableCell>
                              <TableCell className="text-center text-xs">61</TableCell>
                              <TableCell className="text-center text-xs">64</TableCell>
                              <TableCell className="text-center text-xs">2</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p>{faq.answer}</p>
                      {'link' in faq && faq.link && (
                        <Link 
                          to={faq.link} 
                          className="inline-block mt-3 text-sm font-semibold text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                        >
                          {faq.linkText} →
                        </Link>
                      )}
                    </>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
