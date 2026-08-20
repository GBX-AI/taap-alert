import { DISTRICTS } from '@/lib/data/districts';
import { DistrictView } from './view';

/** Static export needs every district route enumerated at build time. */
export function generateStaticParams() {
  return DISTRICTS.map((d) => ({ district: d.id }));
}

export default async function DistrictPage({ params }: { params: Promise<{ district: string }> }) {
  const { district } = await params;
  return <DistrictView districtId={district} />;
}
