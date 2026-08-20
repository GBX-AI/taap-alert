'use client';

import { DistrictMapScreen } from '@/components/MapScreen';

export function DistrictView({ districtId }: { districtId: string }) {
  return <DistrictMapScreen districtId={districtId} />;
}
