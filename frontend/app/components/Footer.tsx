import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white border-t border-white/10 pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-orange-600 flex items-center justify-center font-bold text-orange-600 text-xl">
                N
              </div>
              <span className="text-2xl font-bold tracking-tight">Nexus</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Empowering athletes everywhere to reach their peak performance through data and discipline.
            </p>
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-lg">Product</h4>
            <nav className="flex flex-col gap-3 text-gray-400 text-sm">
              <Link href="/workouts" className="hover:text-orange-500 transition-colors">My Workouts</Link>
              <Link href="/archive" className="hover:text-orange-500 transition-colors">Archive</Link>
              <Link href="/dashboard" className="hover:text-orange-500 transition-colors">Dashboard</Link>
              <Link href="/pricing" className="hover:text-orange-500 transition-colors">Pricing</Link>
            </nav>
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-lg">Company</h4>
            <nav className="flex flex-col gap-3 text-gray-400 text-sm">
              <Link href="/about" className="hover:text-orange-500 transition-colors">About Us</Link>
              <Link href="/careers" className="hover:text-orange-500 transition-colors">Careers</Link>
              <Link href="/privacy-policy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-orange-500 transition-colors">Terms of Service</Link>
            </nav>
          </div>

          {/* Support Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-lg">Support</h4>
            <nav className="flex flex-col gap-3 text-gray-400 text-sm">
              <Link href="/support" className="hover:text-orange-500 transition-colors">Help Center</Link>
              <Link href="/contact" className="hover:text-orange-500 transition-colors">Contact Us</Link>
              <Link href="#" className="hover:text-orange-500 transition-colors">Status</Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-4">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Nexus Fitness App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;