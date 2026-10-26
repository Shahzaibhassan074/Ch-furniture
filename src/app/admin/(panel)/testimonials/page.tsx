import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { TestimonialsManager } from "@/components/admin/TestimonialsManager";

export const dynamic = "force-dynamic";

const getTestimonials = unstable_cache(
  () => prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } }),
  ["admin-testimonials"],
  { tags: ["testimonials"] }
);

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();
  return <TestimonialsManager testimonials={testimonials} />;
}
