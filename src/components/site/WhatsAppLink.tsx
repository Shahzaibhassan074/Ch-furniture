"use client";
import { whatsappUrl } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Renders an anchor that opens WhatsApp click-to-chat with a prefilled message.
 * If `productName` is supplied, a product-specific message is built.
 */
export function WhatsAppLink({
  number,
  baseMessage,
  productName,
  className,
  children,
  ...rest
}: {
  number: string;
  baseMessage: string;
  productName?: string;
  className?: string;
  children: ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const message = productName
    ? `Hello CH Furniture House,\nI'm interested in the ${productName} shown on your website. Please provide pricing, available wood options, delivery information, and customization options.`
    : baseMessage;

  return (
    <a
      href={whatsappUrl(number, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
}
