import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Share2, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const SharePage = () => {
  const { uniqueId } = useParams();
  const [copied, setCopied] = useState(false);
  
  const shareLink = `${window.location.origin}/experience/${uniqueId}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center"
      >
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-600" size={48} />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          🎉 Experience Created!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Your birthday surprise is ready! Share this link with the birthday person.
        </p>

        {/* Share Link Box */}
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-500 mb-2">Your Shareable Link:</p>
          <p className="text-indigo-600 font-mono text-sm md:text-base break-all">
            {shareLink}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <button
            onClick={copyToClipboard}
            className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <CheckCircle size={20} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={20} />
                Copy Link
              </>
            )}
          </button>
          
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Birthday Surprise!',
                  text: 'Someone created a special birthday surprise for you!',
                  url: shareLink,
                });
              } else {
                copyToClipboard();
              }
            }}
            className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors inline-flex items-center justify-center gap-2"
          >
            <Share2 size={20} />
            Share
          </button>
        </div>

        {/* Preview Button */}
        <a
          href={`/experience/${uniqueId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-indigo-600 hover:text-indigo-700 font-medium underline mb-4"
        >
          Preview the experience →
        </a>

        {/* Info */}
        <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-xl text-sm text-gray-600">
          <p className="flex items-center justify-center gap-2">
            <span>🔒</span>
            <span>This link will expire in 24 hours for privacy</span>
          </p>
        </div>

        {/* Home Button */}
        <a
          href="/"
          className="inline-block mt-6 text-gray-600 hover:text-gray-800 font-medium"
        >
          ← Create Another Experience
        </a>
      </motion.div>
    </div>
  );
};

export default SharePage;
