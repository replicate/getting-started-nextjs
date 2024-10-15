import { Suspense } from 'react';
import VisualizeContent from './VisualizeContent';

export default function VisualizePage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const initialPrompt = typeof searchParams.prompt === 'string' ? searchParams.prompt : '';

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VisualizeContent initialPrompt={initialPrompt} />
    </Suspense>
  );
}