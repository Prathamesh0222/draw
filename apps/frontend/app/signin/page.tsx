import Auth from "@/components/Auth";
import Providers from "@/components/Provider";

export default function SignInPage() {
  return (
    <div>
      <Providers>
        <Auth isSignin={true} />
      </Providers>
    </div>
  );
}
