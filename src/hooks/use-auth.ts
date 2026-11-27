import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi, LoginPayload, RegisterPayload } from '@/lib/api/auth.api';
import { getApiErrorMessage } from '@/lib/api/axios';
import { useAuth } from '@/providers/auth-provider';

export { useAuth };

export function useLoginMutation() {
  const { login } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      login(data.accessToken, data.admin);
      toast.success('Signed in successfully');
      router.push('/dashboard');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useRegisterMutation() {
  const { login } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (data) => {
      login(data.accessToken, data.admin);
      toast.success('Account created successfully');
      router.push('/dashboard');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
