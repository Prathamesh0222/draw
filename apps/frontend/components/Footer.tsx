export const Footer = () => {
  return (
    <footer className="border-t border-white/10 py-12 mt-20 text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              DrawTopia
            </h3>
            <p className="text-gray-400">
              A collaborative drawing platform where creativity knows no bounds
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
  );
};
