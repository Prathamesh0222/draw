import { Button } from "@/components/ui/button";
import { Pencil, Users, Eraser, Star, ArrowRight, Github } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-foreground">
      <header className="fixed top-0 w-full z-50 border-b border-white/10 backdrop-blur-xl bg-black/30 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              DrawTopia
            </h1>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="icon">
                  <Github className="w-5 h-5" />
                </Button>
              </a>
              <Button>Start Drawing</Button>
            </div>
          </div>
        </div>
      </header>

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
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
                alt="DrawTopia Interface"
                className="rounded-lg shadow-2xl border border-white/10"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to create amazing drawings and collaborate
              seamlessly with your team
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-white/20">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
                <Pencil className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Free Drawing</h3>
              <p className="text-gray-400 leading-relaxed">
                Express yourself with our intuitive drawing tools. Create
                stunning artwork with precision and ease.
              </p>
            </div>

            <div className="p-8 rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-white/20">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Real-time Collaboration
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Work together seamlessly with your team. See changes instantly
                as they happen.
              </p>
            </div>

            <div className="p-8 rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-white/20">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6">
                <Eraser className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Easy Editing</h3>
              <p className="text-gray-400 leading-relaxed">
                Modify your drawings with simple tools. Undo, redo, and perfect
                your work effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              What Users Say
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Join thousands of satisfied users who trust DrawTopia for their
              creative projects
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "UI/UX Designer",
                company: "Design Co.",
                content:
                  "DrawTopia has transformed how our design team collaborates. The real-time features are incredible!",
              },
              {
                name: "Michael Chen",
                role: "Product Manager",
                company: "Tech Solutions",
                content:
                  "The intuitive interface and powerful tools make it perfect for quick sketches and detailed designs.",
              },
              {
                name: "Emily Rodriguez",
                role: "Creative Director",
                company: "Creative Studio",
                content:
                  "We've cut our design iteration time in half since switching to DrawTopia. It's a game-changer!",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="p-8 rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-white/20"
              >
                <div className="flex items-center gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-lg font-semibold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                    <p className="text-sm text-gray-500">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-12 mt-20 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                DrawTopia
              </h3>
              <p className="text-gray-400">
                A collaborative drawing platform where creativity knows no
                bounds
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors">Features</li>
                <li className="hover:text-white transition-colors">Pricing</li>
                <li className="hover:text-white transition-colors">
                  Documentation
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors">About</li>
                <li className="hover:text-white transition-colors">Blog</li>
                <li className="hover:text-white transition-colors">Careers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors">Privacy</li>
                <li className="hover:text-white transition-colors">Terms</li>
                <li className="hover:text-white transition-colors">
                  Cookie Policy
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DrawTopia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
