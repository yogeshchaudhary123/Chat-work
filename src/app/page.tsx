import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-mesh selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="text-xl font-bold tracking-tight">ChatHub</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
              <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">Login</Link>
              <Link href="/signup" className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-hover transition-all">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              Connect <span className="text-gradient">Instantly</span><br />
              with Anyone, Anywhere.
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
              Experience the next generation of real-time communication. 
              Secure, fast, and beautiful chatting for individuals and teams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup" className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                Start Chatting Free
              </Link>
              <Link href="/login" className="w-full sm:w-auto px-8 py-4 glass rounded-2xl font-bold text-lg hover:bg-white/10 transition-colors">
                View Demo
              </Link>
            </div>

            {/* Hero Image Mockup */}
            <div className="mt-16 relative max-w-5xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[2.5rem] blur opacity-20"></div>
              <div className="relative glass rounded-[2rem] overflow-hidden shadow-2xl border border-white/20">
                <Image
                  src="/chat_app_hero.png"
                  alt="Chat App Interface"
                  width={1200}
                  height={675}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-surface-muted dark:bg-black/20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose ChatHub?</h2>
              <p className="text-gray-600 dark:text-gray-400">Everything you need for seamless communication.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Real-time Messaging",
                  desc: "Experience zero-latency messaging powered by cutting-edge WebSocket technology.",
                  icon: "⚡"
                },
                {
                  title: "End-to-End Encryption",
                  desc: "Your privacy is our priority. Every message is encrypted from sender to receiver.",
                  icon: "🔒"
                },
                {
                  title: "Media Sharing",
                  desc: "Share photos, videos, and documents instantly without quality loss.",
                  icon: "🖼️"
                }
              ].map((feature, i) => (
                <div key={i} className="p-8 glass rounded-3xl hover:scale-105 transition-transform">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">C</span>
            </div>
            <span className="font-bold">ChatHub</span>
          </div>
          <p className="text-sm text-gray-500">© 2024 ChatHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
