"use client";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { whatsappUrl } from "@/lib/utils";

export function FloatingWhatsApp({ number, message }: { number: string; message: string }) {
  return (
    <motion.a
      href={whatsappUrl(number, message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with CH Furniture House on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200, damping: 18 }}
      className="fixed bottom-8 right-5 z-40 flex h-14 w-14 items-center justify-center
                 rounded-full bg-[#25D366] text-white shadow-[0_10px_40px_-8px_rgba(37,211,102,0.7)]
                 transition-transform hover:scale-110"
    >
      <MessageCircle className="h-7 w-7" />
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40" />
    </motion.a>
  );
}
