import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqItems } from './data';

const FAQBlock = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqItems.map((item, i) => (
        <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/30 transition-colors"
            aria-expanded={openIdx === i}
          >
            <span className="font-semibold text-foreground text-sm sm:text-base pr-4">{item.q}</span>
            <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${openIdx === i ? 'rotate-180' : ''}`} />
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${openIdx === i ? 'max-h-60' : 'max-h-0'}`}>
            <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQBlock;
