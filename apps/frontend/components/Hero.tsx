import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { LANDING_IMG } from "@/config";
import Image from "next/image";

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="container mx-auto px-4">
        <div className="relative grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-6xl font-bold leading-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Collaborative Drawing Made Simple
            </h1>
            <p className="text-xl text-gray-400">
              Create, collaborate, and bring your ideas to life with our
              intuitive drawing platform. Draw together in real-time with
              anyone, anywhere.
            </p>
            <div className="flex items-center gap-4">
              <Button size="lg">
                Try Now <ArrowRight className="ml-2" />
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg"></div>
            <Image
              src={LANDING_IMG}
              width={1920}
              height={1080}
              alt="DrawTopia Interface"
              className="rounded-lg shadow-2xl border border-white/10"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
