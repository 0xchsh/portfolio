import { Presentation } from '@/components/presentation/Presentation';
import presentationData from '@/data/presentation.json';
import type { PresentationData } from '@/types/presentation';

export default function Home() {
  return <Presentation data={presentationData as PresentationData} />;
}
