import { useNavigate } from 'react-router-dom';
import { Gift, Camera, Music, ArrowRight, Sparkles, Heart, } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Camera, text: 'Add your photos' },
    { icon: Music, text: 'Pick music' },
    { icon: Sparkles, text: '3D animations' },
    { icon: Heart, text: 'Share the link' },
  ];

  const steps = [
    { num: 1, title: 'Upload', desc: 'Add photos & names' },
    { num: 2, title: 'Customize', desc: 'Message & music' },
    { num: 3, title: 'Share', desc: 'Get unique link' },
    { num: 4, title: 'Celebrate!', desc: 'They experience it' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="inline-block bg-indigo-100 px-5 py-2 rounded-full mb-6">
            <p className="text-indigo-700 font-semibold flex items-center gap-2 text-sm md:text-base">
              <Gift size={18} />
              Birthday Surprise
            </p>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              SomeThing
            </span>
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
             4
            </span>
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              U
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-3 max-w-3xl mx-auto px-4">
            Create an interactive birthday surprise with photos & music
          </p>

          <p className="text-base md:text-lg text-gray-600 mb-8 px-4">
            A fun 3D experience they can explore 🎉
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/create')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-full text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow inline-flex items-center gap-2"
          >
            Create Now
            <ArrowRight size={20} />
          </motion.button>

          {/* Free Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <span className="inline-block bg-green-50 border-2 border-green-300 px-4 md:px-6 py-2 rounded-full text-green-700 font-semibold text-sm md:text-base">
              🎉 Free to Use!
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 mb-3">
          What's Inside?
        </h2>
        <p className="text-center text-gray-600 mb-10 md:mb-12 max-w-2xl mx-auto px-4 text-sm md:text-base">
          Simple steps to create something special
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <feature.icon size={28} className="text-indigo-600" />
              </div>
              <p className="text-gray-700 font-medium text-sm md:text-base">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-12 max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 mb-8 md:mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="text-center relative"
              >
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.num}
                </div>
                <h3 className="font-bold text-gray-800 mb-2 text-base md:text-lg">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>

                {/* Arrow for large screens */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-[60%] w-[80%]">
                    <ArrowRight className="text-gray-300" size={24} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl md:rounded-3xl p-6 md:p-10 max-w-3xl mx-auto text-center">
          <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-3xl">
            🔒
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
            Your Privacy Matters
          </h3>
          <p className="text-gray-700 text-sm md:text-base">
            All photos and data are automatically deleted after <span className="font-bold text-blue-600">24 hours</span>.
            We don't store your memories permanently - your privacy is our priority.
          </p>
        </div>
      </section>


      {/* Experience Preview */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl md:rounded-3xl p-6 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
            The Experience
          </h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto text-sm md:text-base px-4">
            They'll go through an interactive 3D journey: walk to a house, knock on doors, discover a surprise party,
            see your photos in a gallery, and read your special message.
          </p>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 text-xs md:text-sm px-4">
            <span className="bg-white px-3 md:px-4 py-2 rounded-full text-gray-700">🚶 Walk</span>
            <span className="bg-white px-3 md:px-4 py-2 rounded-full text-gray-700">🚪 Knock</span>
            <span className="bg-white px-3 md:px-4 py-2 rounded-full text-gray-700">🎉 Party</span>
            <span className="bg-white px-3 md:px-4 py-2 rounded-full text-gray-700">📸 Photos</span>
            <span className="bg-white px-3 md:px-4 py-2 rounded-full text-gray-700">💌 Message</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 md:py-16 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl md:rounded-3xl p-8 md:p-12 shadow-2xl max-w-4xl mx-auto"
        >
          <h2 className="text-2xl md:text-5xl font-bold mb-3 md:mb-4">
            Ready to Start?
          </h2>
          <p className="text-base md:text-xl mb-6 md:mb-8 opacity-90">
            Create your birthday surprise in just 5 minutes
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/create')}
            className="bg-white text-indigo-600 px-8 md:px-10 py-4 md:py-5 rounded-full text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow inline-flex items-center gap-2"
          >
            Create Free Now
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 md:py-8 text-center text-gray-600 text-sm">
        <p>© 2025 SomethingForYou. Made with ❤️ for birthdays.</p>
      </footer>
    </div>
  );
};

export default Home;
