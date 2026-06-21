import { AuthForm } from "../auth-form";
import { AuthStage } from "../auth-stage";

export default function SignupPage() {
  return (
    <AuthStage mode="signup">
      <AuthForm mode="signup" />
    </AuthStage>
  );
}
