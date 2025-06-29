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
      <section className="relative min-h-[90vh] flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 themed-bg-secondary"></div>
          <div className="absolute top-20 left-10 w-64 h-64 themed-accent opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 themed-accent opacity-10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 w-full py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 themed-text-primary animate-fadeIn leading-tight">
              VisNovel
            </h1>
            <p className="text-xl md:text-2xl mb-10 themed-text-secondary max-w-3xl mx-auto animate-fadeIn" style={{animationDelay: '0.3s'}}>
              AI-Powered Novel Reader with Intelligent Image Generation
            </p>
            <p className="text-lg mb-10 themed-text-secondary max-w-2xl mx-auto animate-fadeIn" style={{animationDelay: '0.5s'}}>
              Transform your reading experience with AI-generated illustrations, smart bookmarks, and personalized reading analytics.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {isAuthenticated ? (
                <Link
                  to="/bookshelf"
                  className="px-8 py-4 themed-accent-bg hover:opacity-90 rounded-md font-medium text-lg transition-all duration-300 shadow-lg transform hover:-translate-y-1 cursor-pointer animate-fadeIn text-white"
                  style={{animationDelay: '0.6s'}}
                >
                  Go to Bookshelf <FaArrowRight className="ml-2 inline animate-bounceX" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-8 py-4 themed-accent-bg hover:opacity-90 rounded-md font-medium text-lg transition-all duration-300 shadow-lg transform hover:-translate-y-1 cursor-pointer animate-fadeIn text-white"
                    style={{animationDelay: '0.6s'}}
                  >
                    Start Reading Free
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-4 themed-bg-primary themed-text-primary themed-border border hover:border-themed-accent rounded-md font-medium text-lg transition-all duration-300 cursor-pointer animate-fadeIn"
                    style={{animationDelay: '0.7s'}}
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Stats Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <StatCard number="10K+" label="Books Read" delay="0.8s" />
              <StatCard number="50K+" label="Images Generated" delay="0.9s" />
              <StatCard number="100K+" label="Happy Readers" delay="1.0s" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 themed-bg-primary relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-20 right-10 w-72 h-72 themed-accent opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 themed-accent opacity-5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1 themed-accent-bg rounded-full text-white text-sm font-medium mb-4 animate-fadeIn">POWERFUL FEATURES</div>
            <h2 className="text-3xl font-bold themed-text-primary animate-fadeIn" style={{animationDelay: '0.2s'}}>Everything You Need for Reading</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FaBook className="text-4xl themed-accent" />}
              title="Smart Novel Upload"
              description="Upload .txt and .epub files with automatic formatting and pagination."
            />
            <FeatureCard
              icon={<FaImage className="text-4xl themed-accent" />}
              title="AI Image Generation"
              description="Generate contextual illustrations for each page to enhance your reading experience."
            />
            <FeatureCard
              icon={<FaBookmark className="text-4xl themed-accent" />}
              title="Smart Bookmarks"
              description="Save important passages and create personal notes with ease."
            />
            <FeatureCard
              icon={<FaChartLine className="text-4xl themed-accent" />}
              title="Reading Analytics"
              description="Track your reading progress, speed, and time spent on each book."
            />
            <FeatureCard
              icon={<FaUser className="text-4xl themed-accent" />}
              title="Personal Bookshelf"
              description="Organize your digital library with custom categories and tags."
            />
            <FeatureCard
              icon={<FaShieldAlt className="text-4xl themed-accent" />}
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
                title="Desktop"
                description="Full-featured reading experience on your computer"
                delay="0.3s"
              />
            </div>
            <div className="relative z-10 w-full sm:w-1/3 flex justify-center">
              <PlatformCard
                icon={FaTabletAlt}
                title="Tablet"
                description="Perfect for comfortable reading on tablets"
                delay="0.4s"
              />
            </div>
            <div className="relative z-10 w-full sm:w-1/3 flex justify-center">
              <PlatformCard
                icon={FaMobileAlt}
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
            <UseCaseCard title="Fiction Readers" delay="0.3s" />
            <UseCaseCard title="Students" delay="0.4s" />
            <UseCaseCard title="Book Clubs" delay="0.5s" />
            <UseCaseCard title="Researchers" delay="0.6s" />
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
function FeatureCard({ icon, title, description }) {
  return (
    <div className="themed-bg-secondary rounded-lg p-6 themed-border border hover:border-themed-accent transition-all duration-300 hover:shadow-lg transform hover:-translate-y-2 animate-fadeIn">
      <div className="mb-4 transform transition-transform duration-300 group-hover:scale-110">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 themed-text-primary">{title}</h3>
      <p className="themed-text-secondary">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description, isLast }) {
  return (
    <div className="themed-bg-primary rounded-lg p-6 themed-border border hover:border-themed-accent transition-all duration-300 hover:shadow-lg transform hover:-translate-y-2 animate-fadeIn flex flex-col items-start relative" style={{animationDelay: `${0.3 + parseInt(number) * 0.1}s`}}>
      {/* Step number circle */}
      <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full themed-accent-bg border themed-accent-border font-bold text-lg shadow-lg text-white mb-2 md:mb-0 md:absolute md:-top-5 md:-left-5">
        {number}
      </div>
      <div className="pl-0 md:pl-8 w-full">
        <h3 className="text-xl font-semibold mb-2 themed-text-primary">{title}</h3>
        <p className="themed-text-secondary">{description}</p>
      </div>
    </div>
  );
}

function PlatformCard({ icon: Icon, title, description, delay }) {
  return (
    <div
      className="themed-bg-primary p-4 sm:p-6 rounded-lg themed-border border hover:border-themed-accent transition-all duration-300 hover:shadow-lg hover:shadow-themed-accent/10 transform hover:-translate-y-2 animate-fadeIn w-full max-w-sm"
      style={{ animationDelay: delay }}
    >
      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto themed-accent-bg rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
        <Icon color="white" size={24} className="sm:w-8 sm:h-8" />
      </div>
      <p className="text-base sm:text-lg font-medium themed-text-primary text-center">{title}</p>
      <p className="mt-2 themed-text-secondary text-xs sm:text-sm text-center">{description}</p>
    </div>
  );
}

function UseCaseCard({ title, delay }) {
  return (
    <div className="themed-bg-primary rounded-lg p-4 themed-border border hover:border-themed-accent transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 animate-fadeIn" style={{animationDelay: delay}}>
      <div className="flex items-center">
        <FaCheck className="themed-accent mr-2" />
        <h3 className="font-medium themed-text-primary">{title}</h3>
      </div>
    </div>
  );
}

function StatCard({ number, label, delay }) {
  return (
    <div className="text-center animate-fadeIn" style={{animationDelay: delay}}>
      <div className="text-3xl font-bold themed-accent mb-2">{number}</div>
      <div className="themed-text-secondary">{label}</div>
    </div>
  );
}

function FaqItem({ question, answer, delay, isOpen, onToggle }) {
  return (
    <div className="themed-border border rounded-lg overflow-hidden animate-fadeIn hover:border-themed-accent transition-all duration-300" style={{animationDelay: delay}}>
      <button
        className="w-full px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center themed-bg-primary hover:opacity-90 text-left cursor-pointer"
        onClick={onToggle}
      >
        <span className="font-medium themed-text-primary text-sm sm:text-base pr-2">{question}</span>
        <HiOutlineChevronDown className={`transition-transform duration-200 themed-accent flex-shrink-0 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 sm:px-6 py-3 sm:py-4 themed-bg-secondary">
          <p className="themed-text-secondary text-sm sm:text-base leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
