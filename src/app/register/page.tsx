import { Metadata } from 'next';
import { RegisterForm } from '@/features/auth/register-form';

export const metadata: Metadata = {
  title: 'Register Admin - IVR Admin',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <RegisterForm />
    </div>
  );
}
