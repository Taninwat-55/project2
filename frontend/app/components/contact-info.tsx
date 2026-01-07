import { Clock, Phone, Mail } from "lucide-react";

export function ContactInfo() {
  const cards = [
    {
      icon: Clock,
      title: "Support Hours",
      content: "Mon-Fri, 9:00-5:00pm EST",
    },
    {
      icon: Phone,
      title: "Phone Support",
      content: "+46 1234532",
    },
    {
      icon: Mail,
      title: "Email Us",
      content: "support@nexus.com",
    },
  ];

  return (
    <>
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex items-center gap-5 hover:border-zinc-700 transition-colors group"
        >
          {/* Icon Box */}
          <div className="w-12 h-12 rounded-xl bg-orange-900/30 flex items-center justify-center shrink-0 border border-orange-500/20 group-hover:border-orange-500/50 transition-colors">
            <card.icon className="w-6 h-6 text-orange-500" />
          </div>

          {/* Text Info */}
          <div>
            <h3 className="text-white font-bold text-lg">{card.title}</h3>
            <p className="text-zinc-400 text-sm">{card.content}</p>
          </div>
        </div>
      ))}
    </>
  );
}