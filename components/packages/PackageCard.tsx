import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface PackageCardProps {
  package: {
    id: string;
    name: string;
    duration: string;
    price: number;
    advance: number;
    image: string;
    slug: string;
  };
}

export default function PackageCard({ package: pkg }: PackageCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={pkg.image}
          alt={pkg.name}
          fill
          className="object-cover group-hover:scale-105 transition duration-500"
        />
        <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">Umrah</span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg">{pkg.name}</h3>
        <p className="text-sm text-on-surface-variant">{pkg.duration} • Colombo</p>
        <div className="mt-3 pt-3 border-t border-surface-container flex justify-between items-center">
          <div>
            <span className="text-sm text-on-surface-variant">From</span>
            <div className="font-bold text-primary text-xl">LKR {pkg.price.toLocaleString()}</div>
            <span className="text-xs text-gold font-bold">20% Advance: LKR {pkg.advance.toLocaleString()}</span>
          </div>
          <Link href={`/package/${pkg.slug}`}>
            <Button size="sm">View</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}