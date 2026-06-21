import { AuthForm } from "../auth-form";
import { AuthStage } from "../auth-stage";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <AuthStage mode="login">
      <AuthForm mode="login" next={next} />
    </AuthStage>
  );
}
