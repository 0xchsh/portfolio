import { PageShell } from '@/components/shared/PageShell';
import { Presentation } from '@/components/presentation/Presentation';
import presentationData from '@/data/presentation.json';
import type { PresentationData } from '@/types/presentation';

export default function Writings() {
  return (
    <PageShell>
      <Presentation data={presentationData as PresentationData} />
    </PageShell>
  );
}
