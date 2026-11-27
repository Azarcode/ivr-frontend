import { Metadata } from 'next';
import { LoginForm } from '@/features/auth/login-form';

export const metadata: Metadata = {
  title: 'Sign In - IVR Admin',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <LoginForm />
    </div>
  );
}
