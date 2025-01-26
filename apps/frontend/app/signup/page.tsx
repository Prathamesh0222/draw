import Auth from "@/components/Auth";
import Providers from "@/components/Provider";

export default function SignupPage() {
  return (
    <div>
      <Providers>
        <Auth isSignin={false} />
      </Providers>
    </div>
  );
}
