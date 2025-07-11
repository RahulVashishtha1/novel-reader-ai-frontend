import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FaBook,
  FaImage,
  FaBookmark,
  FaChartLine,
  FaUser,
  FaShieldAlt,
  FaArrowRight,
  FaCheck,
  FaMobileAlt,
  FaDesktop,
  FaTabletAlt
} from 'react-icons/fa';
import { HiOutlineChevronDown } from 'react-icons/hi';

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen themed-bg-secondary">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Modern, vibrant SVG background shapes and colorful dots */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          {/* Layered SVG blobs for depth and color (higher opacity, more saturated) */}
          <svg className="absolute top-[-60px] left-[-80px] w-[340px] h-[340px] opacity-90" viewBox="0 0 400 400" fill="none"><path d="M320,120Q340,200,260,260Q180,320,100,260Q20,200,100,120Q180,40,260,120Q320,180,320,120Z" fill="#6366f1"/></svg>
          <svg className="absolute bottom-[-80px] right-[-60px] w-[300px] h-[300px] opacity-90" viewBox="0 0 400 400" fill="none"><path d="M300,200Q320,280,240,320Q160,360,80,320Q0,280,80,200Q160,120,240,200Q320,280,300,200Z" fill="#d946ef"/></svg>
          <svg className="absolute top-1/2 left-1/2 w-[180px] h-[180px] opacity-80" style={{transform:'translate(-50%,-50%)'}} viewBox="0 0 400 400" fill="none"><path d="M200,80Q240,160,160,240Q80,320,200,320Q320,320,240,240Q160,160,200,80Z" fill="#fbbf24"/></svg>
          {/* Colorful blurred dots/drops (higher opacity, drop shadow) */}
          <div className="absolute top-10 left-1/2 w-16 h-16 bg-emerald-400 opacity-90 rounded-full blur-2xl shadow-lg" style={{transform:'translateX(-50%)'}}></div>
          <div className="absolute bottom-20 right-1/3 w-10 h-10 bg-fuchsia-500 opacity-90 rounded-full blur-xl shadow-md"></div>
          <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-yellow-400 opacity-90 rounded-full blur-lg shadow-md"></div>
          <div className="absolute bottom-10 left-1/5 w-14 h-14 bg-indigo-500 opacity-80 rounded-full blur-xl shadow-lg"></div>
          <div className="absolute top-1/4 right-1/4 w-12 h-12 bg-pink-500 opacity-90 rounded-full blur-lg shadow-md"></div>
        </div>
        <div className="w-full max-w-2xl mx-auto py-10 md:py-16 text-center flex flex-col items-center justify-center z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 themed-text-primary animate-fadeIn leading-tight" style={{letterSpacing: '0.01em'}}>
            VisNovel
          </h1>
          <div className="flex justify-center mb-4">
            <span className="inline-block h-1 w-20 rounded-full themed-accent-bg opacity-70"></span>
          </div>
          <p className="text-xl md:text-2xl mb-6 themed-text-secondary animate-fadeIn font-medium" style={{animationDelay: '0.3s'}}>
            AI-Powered Novel Reader with Intelligent Image Generation
          </p>
          <p className="text-base mb-8 themed-text-secondary animate-fadeIn" style={{animationDelay: '0.5s'}}>
            Transform your reading experience with AI-generated illustrations, smart bookmarks, and personalized reading analytics.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {isAuthenticated ? (
              <Link
                to="/bookshelf"
                className="px-8 py-3 themed-accent-bg hover:opacity-90 rounded-xl font-semibold text-lg transition-all duration-300 shadow-md transform hover:-translate-y-1 cursor-pointer animate-fadeIn text-white"
                style={{animationDelay: '0.6s'}}
              >
                Go to Bookshelf <FaArrowRight className="ml-2 inline animate-bounceX" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-3 themed-accent-bg hover:opacity-90 rounded-xl font-semibold text-lg transition-all duration-300 shadow-md transform hover:-translate-y-1 cursor-pointer animate-fadeIn text-white"
                  style={{animationDelay: '0.6s'}}
                >
                  Start Reading Free
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 themed-bg-primary themed-text-primary themed-border border hover:border-themed-accent rounded-xl font-semibold text-lg transition-all duration-300 cursor-pointer animate-fadeIn"
                  style={{animationDelay: '0.7s'}}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
          {/* Stats Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <StatCard number="10K+" label="Books Read" delay="0.8s" iconBg="bg-blue-500" icon={<FaBook className='text-white'/>} />
            <StatCard number="50K+" label="Images Generated" delay="0.9s" iconBg="bg-pink-500" icon={<FaImage className='text-white'/>} />
            <StatCard number="100K+" label="Happy Readers" delay="1.0s" iconBg="bg-yellow-400" icon={<FaUser className='text-white'/>} />
          </div>
        </div>
      </section>
      {/* Elegant Divider */}
      <div className="w-full flex justify-center my-4 md:my-8">
        <div className="h-[2px] w-2/3 max-w-2xl themed-accent-bg opacity-20 rounded-full"></div>
      </div>

      {/* Features Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 themed-bg-primary relative overflow-hidden">
        {/* Subtle accent shape */}
        <div className="absolute top-20 right-10 w-48 h-48 themed-accent opacity-10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 themed-accent opacity-10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <div className="inline-block px-4 py-1 themed-accent-bg rounded-full text-white text-base font-semibold mb-3 animate-fadeIn shadow-md">POWERFUL FEATURES</div>
            <h2 className="text-3xl font-bold themed-text-primary animate-fadeIn" style={{animationDelay: '0.2s'}}>Everything You Need for Reading</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              iconBg="bg-blue-500"
              icon={<FaBook className="text-2xl text-white" />}
              title="Smart Novel Upload"
              description="Upload .txt and .epub files with automatic formatting and pagination."
            />
            <FeatureCard
              iconBg="bg-pink-500"
              icon={<FaImage className="text-2xl text-white" />}
              title="AI Image Generation"
              description="Generate contextual illustrations for each page to enhance your reading experience."
            />
            <FeatureCard
              iconBg="bg-green-500"
              icon={<FaBookmark className="text-2xl text-white" />}
              title="Smart Bookmarks"
              description="Save important passages and create personal notes with ease."
            />
            <FeatureCard
              iconBg="bg-yellow-400"
              icon={<FaChartLine className="text-2xl text-white" />}
              title="Reading Analytics"
              description="Track your reading progress, speed, and time spent on each book."
            />
            <FeatureCard
              iconBg="bg-purple-500"
              icon={<FaUser className="text-2xl text-white" />}
              title="Personal Bookshelf"
              description="Organize your digital library with custom categories and tags."
            />
            <FeatureCard
              iconBg="bg-orange-400"
              icon={<FaShieldAlt className="text-2xl text-white" />}
              title="Secure & Private"
              description="Your books and reading data are encrypted and accessible only to you."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 themed-bg-secondary relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-64 h-64 themed-accent opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 themed-accent opacity-5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1 themed-accent-bg rounded-full text-white text-sm font-medium mb-4 animate-fadeIn">SIMPLE PROCESS</div>
            <h2 className="text-3xl font-bold themed-text-primary animate-fadeIn" style={{animationDelay: '0.2s'}}>How It Works</h2>
          </div>

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8 mt-8 mb-8">
            {/* Thread line behind all steps */}
            <div className="hidden md:block absolute left-0 right-0 top-1/2 z-0" style={{height: '4px', background: 'linear-gradient(90deg, var(--accent-color) 0%, transparent 100%)', borderRadius: '2px', opacity: 0.4}}></div>
            <div className="relative z-10 w-full md:w-1/3"><StepCard number="1" title="Upload Your Novel" description="Upload your .txt or .epub file and let our system format it for optimal reading." /></div>
            <div className="relative z-10 w-full md:w-1/3"><StepCard number="2" title="Generate Images" description="AI creates contextual illustrations for each page to bring your story to life." /></div>
            <div className="relative z-10 w-full md:w-1/3"><StepCard number="3" title="Start Reading" description="Enjoy your personalized reading experience with bookmarks, notes, and analytics." isLast /></div>
          </div>
        </div>
      </section>

      {/* Platform Support Section */}
      <section className="py-16 px-4 themed-bg-primary relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-40 left-10 w-64 h-64 themed-accent opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 themed-accent opacity-5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1 themed-accent-bg rounded-full text-white text-sm font-medium mb-4 animate-fadeIn">CROSS-PLATFORM</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-12 themed-text-primary animate-fadeIn" style={{animationDelay: '0.2s'}}>Read Anywhere</h2>

          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mt-12 mb-12">
            <div className="relative z-10 w-full sm:w-1/3 flex justify-center">
              <PlatformCard
                icon={FaDesktop}
                iconBg="bg-blue-500"
                title="Desktop"
                description="Full-featured reading experience on your computer"
                delay="0.3s"
              />
            </div>
            <div className="relative z-10 w-full sm:w-1/3 flex justify-center">
              <PlatformCard
                icon={FaTabletAlt}
                iconBg="bg-purple-500"
                title="Tablet"
                description="Perfect for comfortable reading on tablets"
                delay="0.4s"
              />
            </div>
            <div className="relative z-10 w-full sm:w-1/3 flex justify-center">
              <PlatformCard
                icon={FaMobileAlt}
                iconBg="bg-pink-500"
                title="Mobile"
                description="Read on the go with mobile-optimized interface"
                delay="0.5s"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 themed-bg-secondary relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-40 right-10 w-64 h-64 themed-accent opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-64 h-64 themed-accent opacity-5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1 themed-accent-bg rounded-full text-white text-sm font-medium mb-4 animate-fadeIn">PERFECT FOR</div>
            <h2 className="text-3xl font-bold themed-text-primary animate-fadeIn" style={{animationDelay: '0.2s'}}>Ideal For</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <UseCaseCard title="Fiction Readers" delay="0.3s" iconBg="bg-blue-500" icon={<FaBook className='text-white'/>} />
            <UseCaseCard title="Students" delay="0.4s" iconBg="bg-green-500" icon={<FaChartLine className='text-white'/>} />
            <UseCaseCard title="Book Clubs" delay="0.5s" iconBg="bg-pink-500" icon={<FaUser className='text-white'/>} />
            <UseCaseCard title="Researchers" delay="0.6s" iconBg="bg-purple-500" icon={<FaCheck className='text-white'/>} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 themed-bg-primary relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-64 themed-accent opacity-5"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 themed-accent opacity-5 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold mb-6 themed-text-primary animate-fadeIn">Start Your Reading Journey Today</h2>
          <p className="text-xl mb-8 themed-text-secondary animate-fadeIn" style={{animationDelay: '0.2s'}}>Join thousands of readers who have transformed their reading experience with VisNovel.</p>

          <div className="flex flex-wrap justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/bookshelf"
                className="px-8 py-4 themed-accent-bg hover:opacity-90 rounded-md font-medium text-lg transition-all duration-300 shadow-lg transform hover:-translate-y-1 cursor-pointer animate-fadeIn text-white"
                style={{animationDelay: '0.3s'}}
              >
                Go to Bookshelf
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-4 themed-accent-bg hover:opacity-90 rounded-md font-medium text-lg transition-all duration-300 shadow-lg transform hover:-translate-y-1 cursor-pointer animate-fadeIn text-white"
                  style={{animationDelay: '0.3s'}}
                >
                  Start Reading Free
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 themed-bg-secondary themed-text-primary themed-border border hover:border-themed-accent rounded-md font-medium text-lg transition-all duration-300 cursor-pointer animate-fadeIn"
                  style={{animationDelay: '0.4s'}}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 themed-bg-secondary relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-64 h-64 themed-accent opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 themed-accent opacity-5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2.5s'}}></div>

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1 themed-accent-bg rounded-full text-white text-sm font-medium mb-4 animate-fadeIn">QUESTIONS</div>
            <h2 className="text-3xl font-bold themed-text-primary animate-fadeIn" style={{animationDelay: '0.2s'}}>Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            <FaqItem
              question="Is VisNovel free to use?"
              answer="Yes, VisNovel is completely free to use. You can upload novels, generate AI images, and access all core features without any cost."
              delay="0.3s"
              isOpen={activeFaq === 0}
              onToggle={() => toggleFaq(0)}
            />
            <FaqItem
              question="What file formats are supported?"
              answer="We currently support .txt and .epub file formats. More formats will be added in the future."
              delay="0.4s"
              isOpen={activeFaq === 1}
              onToggle={() => toggleFaq(1)}
            />
            <FaqItem
              question="How does AI image generation work?"
              answer="Our AI analyzes the text content of each page and generates contextual illustrations that match the story's mood and setting."
              delay="0.5s"
              isOpen={activeFaq === 2}
              onToggle={() => toggleFaq(2)}
            />
            <FaqItem
              question="Can I read offline?"
              answer="Currently, VisNovel requires an internet connection for AI image generation and data synchronization. Offline reading is planned for future updates."
              delay="0.6s"
              isOpen={activeFaq === 3}
              onToggle={() => toggleFaq(3)}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper Components
function FeatureCard({ icon, iconBg, title, description }) {
  return (
    <div className="themed-bg-secondary/80 rounded-xl p-6 themed-border border hover:border-themed-accent transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 animate-fadeIn backdrop-blur-md shadow-md group flex flex-col items-start">
      <div className={`mb-4 w-12 h-12 flex items-center justify-center rounded-full shadow-md ${iconBg}`}>{icon}</div>
      <h3 className="text-xl font-bold mb-2 themed-text-primary">{title}</h3>
      <p className="themed-text-secondary text-base font-medium">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description, isLast }) {
  return (
    <div className="themed-bg-primary/80 rounded-2xl p-8 themed-border border hover:border-themed-accent transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 animate-fadeIn flex flex-col items-start relative backdrop-blur-md shadow-md" style={{animationDelay: `${0.3 + parseInt(number) * 0.1}s`}}>
      {/* Step number circle */}
      <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full themed-accent-bg border themed-accent-border font-extrabold text-2xl shadow-lg text-white mb-2 md:mb-0 md:absolute md:-top-6 md:-left-6">
        {number}
      </div>
      <div className="pl-0 md:pl-10 w-full">
        <h3 className="text-2xl font-bold mb-2 themed-text-primary">{title}</h3>
        <p className="themed-text-secondary text-base font-medium">{description}</p>
      </div>
    </div>
  );
}

function PlatformCard({ icon: Icon, iconBg, title, description, delay }) {
  return (
    <div
      className="themed-bg-primary/80 p-6 rounded-2xl themed-border border hover:border-themed-accent transition-all duration-300 hover:shadow-xl hover:shadow-themed-accent/10 transform hover:-translate-y-2 animate-fadeIn w-full max-w-sm backdrop-blur-md shadow-lg"
      style={{ animationDelay: delay }}
    >
      <div className={`w-16 h-16 mx-auto flex items-center justify-center mb-4 shadow-lg rounded-full ${iconBg}`}>
        <Icon color="white" size={32} className="w-8 h-8" />
      </div>
      <p className="text-lg font-bold themed-text-primary text-center">{title}</p>
      <p className="mt-2 themed-text-secondary text-base text-center font-medium">{description}</p>
    </div>
  );
}

function UseCaseCard({ title, delay, iconBg, icon }) {
  return (
    <div className="themed-bg-primary/80 rounded-2xl p-6 themed-border border hover:border-themed-accent transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 animate-fadeIn backdrop-blur-md shadow-md flex items-center gap-3" style={{animationDelay: delay}}>
      <div className={`w-10 h-10 flex items-center justify-center rounded-full shadow-md ${iconBg}`}>{icon}</div>
      <h3 className="font-semibold themed-text-primary text-lg">{title}</h3>
    </div>
  );
}

function StatCard({ number, label, delay, iconBg, icon }) {
  return (
    <div className="text-center animate-fadeIn px-6 py-8 rounded-xl shadow-lg themed-bg-primary/80 backdrop-blur-md border themed-border flex flex-col items-center" style={{animationDelay: delay}}>
      <div className={`mb-3 w-12 h-12 flex items-center justify-center rounded-full shadow-md ${iconBg}`}>{icon}</div>
      <div className="text-4xl font-extrabold themed-accent mb-2 drop-shadow-md">{number}</div>
      <div className="themed-text-secondary text-lg font-semibold">{label}</div>
    </div>
  );
}

function FaqItem({ question, answer, delay, isOpen, onToggle }) {
  return (
    <div className="themed-border border rounded-2xl overflow-hidden animate-fadeIn hover:border-themed-accent transition-all duration-300 backdrop-blur-md shadow-md themed-bg-primary/80" style={{animationDelay: delay}}>
      <button
        className="w-full px-6 py-4 flex justify-between items-center themed-bg-primary/80 hover:opacity-95 text-left cursor-pointer font-semibold text-base rounded-t-2xl"
        onClick={onToggle}
      >
        <span className="themed-text-primary pr-2">{question}</span>
        <HiOutlineChevronDown className={`transition-transform duration-200 themed-accent flex-shrink-0 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-4 themed-bg-secondary/80 rounded-b-2xl">
          <p className="themed-text-secondary text-base leading-relaxed font-medium">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
