import Link from 'next/link';
import { Code, Zap, Target, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Master AI-Assisted Coding with
            <span className="text-blue-600"> Cursor</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Cut down on headaches and supercharge your development workflow. 
            Learn from experts how to leverage AI tools effectively.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/classes"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              Browse Classes
            </Link>
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Learn with Us?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We understand the frustration of learning new tools. Our courses are designed 
            to save you time and reduce the learning curve.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Fast Learning</h3>
            <p className="text-gray-600">
              Get up to speed quickly with practical, hands-on lessons designed by 
              developers who use these tools daily.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Real-World Focus</h3>
            <p className="text-gray-600">
              Learn through real projects and scenarios you'll encounter in your 
              actual development work.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Code className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Best Practices</h3>
            <p className="text-gray-600">
              Learn the patterns and practices that experienced developers use to 
              maximize their productivity.
            </p>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What You'll Learn
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Backend Development', desc: 'Build APIs and server-side applications' },
              { title: 'Frontend Development', desc: 'Create beautiful, responsive user interfaces' },
              { title: 'UI/UX Design', desc: 'Design intuitive and engaging experiences' },
              { title: 'Full-Stack Projects', desc: 'Complete end-to-end application development' },
            ].map((course, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm">{course.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-blue-600 rounded-2xl p-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Stop Struggling, Start Building
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join hundreds of developers who have accelerated their workflow by mastering 
              AI-assisted coding tools. No more endless tutorials or trial-and-error.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                'Reduce development time by 50%+',
                'Learn industry best practices',
                'Live classes with Q&A',
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
            <Link
              href="/register"
              className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Learning Today
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Coding Workflow?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join our next class and start building faster today.
          </p>
          <Link
            href="/classes"
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            View Upcoming Classes
          </Link>
        </div>
      </section>
    </div>
  );
}
