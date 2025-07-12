import { SignInForm } from '@/components/auth/SignInForm';
import { Providers } from '@/components/providers';

export default function SignInPage() {
  return (
    <Providers>
      <SignInForm />
    </Providers>
  );
} 