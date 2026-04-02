import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
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

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <article className="max-w-3xl mx-auto prose prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold neon-text mb-8">
            Политика конфиденциальности
          </h1>

          <p className="text-sm text-muted-foreground mb-6">
            Дата публикации: 20.02.2020<br />
            Последнее обновление: 12.02.2026
          </p>

          <section className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">1. Общие положения</h2>
              <p className="text-muted-foreground leading-relaxed">
                1.1. Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок 
                обработки и защиты персональных данных пользователей сайта Индивидуального предпринимателя 
                Ледневой Анны Сергеевны (далее — «Оператор»).
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                1.2. Политика разработана в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ 
                «О персональных данных» и иными нормативными правовыми актами Российской Федерации.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                1.3. Используя сайт и предоставляя свои персональные данные, Пользователь выражает 
                согласие с условиями настоящей Политики. В случае несогласия с условиями Политики 
                Пользователь должен прекратить использование сайта.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                1.4. Настоящая Политика применяется исключительно к данному сайту. Оператор не контролирует 
                и не несёт ответственности за сайты третьих лиц, на которые Пользователь может перейти 
                по ссылкам, размещённым на сайте.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">2. Какие данные мы собираем</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                2.1. Данные, предоставляемые Пользователем добровольно при оформлении заказа или 
                обращении через форму обратной связи:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Имя и фамилия</li>
                <li>Номер телефона</li>
                <li>Адрес электронной почты (e-mail)</li>
                <li>Адрес доставки (при необходимости)</li>
                <li>Иные данные, сообщённые Пользователем по собственной инициативе</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3 mb-3">
                2.2. Данные, собираемые автоматически при посещении сайта:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>IP-адрес</li>
                <li>Тип и версия браузера</li>
                <li>Операционная система</li>
                <li>Дата и время посещения</li>
                <li>Адрес страницы, с которой был осуществлён переход</li>
                <li>Продолжительность пребывания на сайте</li>
                <li>Данные файлов cookies</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">3. Цели обработки данных</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                3.1. Персональные данные обрабатываются в следующих целях:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Оформление и исполнение заказов</li>
                <li>Связь с Пользователем для уточнения деталей заказа</li>
                <li>Информирование о статусе заказа</li>
                <li>Информирование о новых акциях, товарах и услугах (с согласия Пользователя)</li>
                <li>Улучшение качества работы сайта и обслуживания</li>
                <li>Проведение статистических и аналитических исследований</li>
                <li>Исполнение обязательств, предусмотренных законодательством РФ</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">4. Хранение и защита данных</h2>
              <p className="text-muted-foreground leading-relaxed">
                4.1. Оператор принимает необходимые организационные и технические меры для защиты 
                персональных данных от неправомерного или случайного доступа, уничтожения, изменения, 
                блокирования, копирования, распространения и иных неправомерных действий.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                4.2. Персональные данные хранятся на защищённых серверах и обрабатываются 
                с использованием средств автоматизации.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                4.3. Персональные данные хранятся не дольше, чем этого требуют цели их обработки, 
                если иной срок не установлен законодательством Российской Федерации.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                4.4. По достижении целей обработки или в случае утраты необходимости в обработке 
                персональные данные подлежат уничтожению в срок не более 30 дней.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">5. Передача данных третьим лицам</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                5.1. Оператор не передаёт персональные данные третьим лицам, за исключением следующих случаев:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>С согласия Пользователя</li>
                <li>По требованию законодательства Российской Федерации (по запросу суда, 
                  правоохранительных или иных уполномоченных государственных органов)</li>
                <li>Для исполнения заказа (передача данных службам доставки)</li>
                <li>Для защиты прав и законных интересов Оператора</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                5.2. При передаче данных Оператор требует от третьих лиц соблюдения конфиденциальности 
                и обеспечения безопасности персональных данных.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">6. Права пользователя</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                6.1. Пользователь имеет право:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Получить информацию об обработке своих персональных данных</li>
                <li>Требовать уточнения, блокирования или уничтожения своих персональных данных</li>
                <li>Отозвать согласие на обработку персональных данных путём направления 
                  письменного уведомления на e-mail: msuvenirov39@yandex.ru</li>
                <li>Обжаловать действия или бездействие Оператора в уполномоченный орган по защите 
                  прав субъектов персональных данных (Роскомнадзор)</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                6.2. В случае отзыва согласия на обработку персональных данных Оператор прекращает 
                обработку и уничтожает данные в течение 30 дней с момента получения уведомления, 
                если иное не предусмотрено законодательством.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">7. Файлы cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                7.1. Сайт использует файлы cookies для обеспечения корректной работы, 
                улучшения пользовательского опыта и сбора статистики посещений.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                7.2. Пользователь может отключить использование файлов cookies в настройках 
                своего браузера. При этом некоторые функции сайта могут работать некорректно.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">8. Заключительные положения</h2>
              <p className="text-muted-foreground leading-relaxed">
                8.1. Оператор вправе вносить изменения в настоящую Политику без предварительного 
                уведомления Пользователя. Новая редакция Политики вступает в силу с момента 
                её размещения на сайте.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                8.2. Действующая редакция Политики конфиденциальности размещена на данной странице.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">9. Контактная информация</h2>
              <p className="text-muted-foreground leading-relaxed">
                Индивидуальный предприниматель Леднева Анна Сергеевна<br />
                Адрес: г. Калининград, ТЦ Экватор, 2 этаж, ул. Ген. Челнокова 11, стр. 1<br />
                Телефон: +7 952 114-23-50<br />
                E-mail: msuvenirov39@yandex.ru
              </p>
            </div>
          </section>
        </article>
      </main>

      <footer className="border-t border-border/50 py-6">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2020 ИП Леднева А.С. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
