import { Suspense } from 'react';
import SuccessContent from '@/components/component/SuccessContent';

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}