'use client'

import { RecoilRoot } from 'recoil';
import { AuthProvider } from '@/contexts/AuthContext';
import Notification from '@/components/notification';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <AuthProvider>
        {children}
        <Notification />
      </AuthProvider>
    </RecoilRoot>
  );
}