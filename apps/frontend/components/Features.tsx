import { Eraser, Pencil, Users } from "lucide-react";

export const Features = () => {
  return (
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
              Express yourself with our intuitive drawing tools. Create stunning
              artwork with precision and ease.
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
              Work together seamlessly with your team. See changes instantly as
              they happen.
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
  );
};
