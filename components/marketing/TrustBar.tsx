import { Container } from "@/components/ui/Container";
import { trustStats } from "@/lib/content";

export function TrustBar() {
  return (
    <div className="border-b border-gray-100 bg-white">
      <Container>
        <dl className="grid grid-cols-2 gap-y-6 py-8 sm:grid-cols-4">
          {trustStats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse text-center">
              <dt className="mt-1 text-sm text-gray-500">{stat.label}</dt>
              <dd className="font-heading text-xl font-extrabold text-primary sm:text-2xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </div>
  );
}
