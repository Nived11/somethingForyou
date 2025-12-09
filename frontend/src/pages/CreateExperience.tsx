import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Music,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Gift,
  X,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Hooks
import {
  useCreateExperience,
  usePhotoUpload,
  useMusicUpload,
} from "../hooks/experience";
import { useAudioPlayer } from "../hooks/audio";

// Components
import AudioPlayer from "../components/AudioPlayer";

// Config
import { defaultAudioTracks } from "../config/audioConfig";

const CreateExperience = () => {
  const navigate = useNavigate();

  const {
    step,
    setStep,
    isLoading,
    formData,
    updateFormData,
    canProceed,
    handleSubmit,
  } = useCreateExperience();

  const { photos, previewUrls, handlePhotoUpload, removePhoto } =
    usePhotoUpload(15);

  const {
    musicChoice,
    customMusicFile,
    customMusicPreview,
    customMusicUrl,
    handleCustomMusicUpload,
    removeCustomMusic,
    changeMusicChoice,
  } = useMusicUpload();

  const {
    isPlaying,
    currentTime,
    duration,
    currentTrack,
    isLoading: isAudioLoading,
    play,
    pause,
    stop,
    seek,
  } = useAudioPlayer();

  useEffect(() => {
    return () => {
      stop();
      if (customMusicUrl) {
        URL.revokeObjectURL(customMusicUrl);
      }
    };
  }, [customMusicUrl, stop]); // ✅ Now stop is in dependencies

  const onSubmit = () => {
    handleSubmit(photos, musicChoice, customMusicFile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6 md:py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <button
            onClick={() => (step === 1 ? navigate("/") : setStep(step - 1))}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors text-sm md:text-base"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex-1 mx-4 md:mx-8">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold transition-all text-sm md:text-base ${
                      step >= s
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 4 && (
                    <div
                      className={`flex-1 h-1 mx-1 md:mx-2 transition-all ${
                        step > s
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-8"
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  Let's Start
                </h2>
                <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
                  Who is this birthday surprise for? 🎂
                </p>

                <div className="space-y-5 md:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Birthday Person's Name *
                    </label>
                    <input
                      type="text"
                      value={formData.recipientName}
                      onChange={(e) =>
                        updateFormData("recipientName", e.target.value)
                      }
                      placeholder="e.g., Priya"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors text-sm md:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={formData.senderName}
                      onChange={(e) =>
                        updateFormData("senderName", e.target.value)
                      }
                      placeholder="e.g., Rahul"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors text-sm md:text-base"
                    />
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-xl flex items-start gap-3">
                    <Gift
                      className="text-indigo-600 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <div>
                      <p className="font-medium text-gray-800 mb-1 text-sm md:text-base">
                        Birthday Surprise
                      </p>
                      <p className="text-xs md:text-sm text-gray-600">
                        You'll create a 3D interactive experience with photos
                        and a message
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Photos */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  Add Photos
                </h2>
                <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
                  Upload 3-15 photos 📸
                </p>

                <div className="space-y-5 md:space-y-6">
                  <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-xl flex items-start gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      🔒
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 mb-1 text-sm md:text-base">
                        Privacy Protected
                      </p>
                      <p className="text-xs md:text-sm text-gray-600">
                        Your photos will be automatically deleted after 24 hours
                        for your privacy and security.
                      </p>
                    </div>
                  </div>

                  <label className="block">
                    <div className="border-4 border-dashed border-indigo-200 rounded-2xl p-8 md:p-12 text-center cursor-pointer hover:border-indigo-400 transition-colors">
                      <Upload
                        className="mx-auto text-indigo-500 mb-3 md:mb-4"
                        size={40}
                      />
                      <p className="text-base md:text-lg font-medium text-gray-700 mb-2">
                        Click to select multiple photos
                      </p>
                      <p className="text-xs md:text-sm text-gray-500">
                        {photos.length}/15 photos • JPG, PNG • Hold Ctrl/Cmd to
                        select multiple
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>

                  {previewUrls.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 md:h-32 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removePhoto(index)}
                            className="absolute top-1 right-1 md:top-2 md:right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 3: Message */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  Your Message
                </h2>
                <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
                  Write something special 💌
                </p>

                <div className="space-y-5 md:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Birthday Message *
                    </label>
                    <textarea
                      value={formData.customMessage}
                      onChange={(e) =>
                        updateFormData("customMessage", e.target.value)
                      }
                      placeholder="Write your birthday wishes here..."
                      rows={8}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors resize-none text-sm md:text-base"
                    />
                    <p className="text-xs md:text-sm text-gray-500 mt-2">
                      {formData.customMessage.length} characters
                    </p>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-xl">
                    <div className="flex items-start gap-3">
                      <MessageSquare
                        className="text-indigo-600 mt-1"
                        size={20}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800 mb-1">
                          Tip
                        </p>
                        <p className="text-xs md:text-sm text-gray-600">
                          Make it personal! Add memories or inside jokes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Music & Review */}
            {/* Step 4: Music & Review */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  Choose Music
                </h2>
                <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
                  Pick background music 🎵
                </p>

                <div className="space-y-5 md:space-y-6">
                  {/* Music Selection Tabs */}
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => {
                        stop();
                        changeMusicChoice(defaultAudioTracks[0].id);
                      }}
                      className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all text-sm md:text-base ${
                        musicChoice !== "custom"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      Default Songs ({defaultAudioTracks.length})
                    </button>
                    <button
                      onClick={() => {
                        stop();
                        changeMusicChoice("custom");
                      }}
                      className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all text-sm md:text-base ${
                        musicChoice === "custom"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      Upload Your Own
                    </button>
                  </div>

                  {/* Default Music Options */}
                  {musicChoice !== "custom" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Choose from our collection
                      </label>
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {defaultAudioTracks.map((track) => (
                          <div
                            key={track.id}
                            className={`block p-3 md:p-4 border-2 rounded-xl transition-all ${
                              musicChoice === track.id
                                ? "border-indigo-500 bg-indigo-50"
                                : "border-gray-200 hover:border-indigo-300"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <label className="flex items-center gap-3 cursor-pointer flex-1">
                                <input
                                  type="radio"
                                  name="music"
                                  value={track.id}
                                  checked={musicChoice === track.id}
                                  onChange={(e) =>
                                    changeMusicChoice(e.target.value)
                                  }
                                  className="w-4 h-4 text-indigo-600"
                                />
                                <div>
                                  <p className="font-medium text-gray-800 text-sm md:text-base">
                                    {track.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {track.src.split("/").pop()}
                                  </p>
                                </div>
                              </label>
                              <Music className="text-indigo-500" size={18} />
                            </div>

                            <AudioPlayer
                              isPlaying={
                                isPlaying && currentTrack === track.src
                              }
                              currentTime={
                                currentTrack === track.src ? currentTime : 0
                              }
                              duration={
                                currentTrack === track.src ? duration : 0
                              }
                              isLoading={
                                isAudioLoading && currentTrack === track.src
                              }
                              onPlayPause={() => {
                                if (currentTrack === track.src && isPlaying) {
                                  pause();
                                } else {
                                  play(track.src);
                                }
                              }}
                              onSeek={seek}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom Music Upload */}
                  {musicChoice === "custom" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Upload your music file
                      </label>

                      {!customMusicFile ? (
                        <label className="block">
                          <div className="border-4 border-dashed border-indigo-200 rounded-2xl p-8 md:p-10 text-center cursor-pointer hover:border-indigo-400 transition-colors">
                            <Music
                              className="mx-auto text-indigo-500 mb-3"
                              size={40}
                            />
                            <p className="text-base md:text-lg font-medium text-gray-700 mb-2">
                              Click to upload music
                            </p>
                            <p className="text-xs md:text-sm text-gray-500">
                              MP3, WAV, M4A, MPEG • Max 10MB
                            </p>
                          </div>
                          <input
                            type="file"
                            accept="audio/*,.mp3,.mpeg,.wav,.m4a,.ogg"
                            onChange={handleCustomMusicUpload}
                            className="hidden"
                          />
                        </label>
                      ) : (
                        <div className="bg-indigo-50 border-2 border-indigo-200 p-4 rounded-xl">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="bg-indigo-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                                {isAudioLoading &&
                                currentTrack === customMusicUrl ? (
                                  <Loader2 size={20} className="animate-spin" />
                                ) : (
                                  <Music size={20} />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-800 text-sm md:text-base truncate">
                                  {customMusicPreview}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {isAudioLoading &&
                                  currentTrack === customMusicUrl
                                    ? "Loading..."
                                    : "Custom music uploaded"}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                stop();
                                removeCustomMusic();
                              }}
                              disabled={
                                isAudioLoading &&
                                currentTrack === customMusicUrl
                              }
                              className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors flex-shrink-0 ml-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                              title={
                                isAudioLoading &&
                                currentTrack === customMusicUrl
                                  ? "Loading..."
                                  : "Remove"
                              }
                            >
                              <X size={16} />
                            </button>
                          </div>

                          {customMusicUrl && (
                            <div className="mt-2">
                              <AudioPlayer
                                isPlaying={
                                  isPlaying && currentTrack === customMusicUrl
                                }
                                currentTime={
                                  currentTrack === customMusicUrl
                                    ? currentTime
                                    : 0
                                }
                                duration={
                                  currentTrack === customMusicUrl ? duration : 0
                                }
                                isLoading={
                                  isAudioLoading &&
                                  currentTrack === customMusicUrl
                                }
                                onPlayPause={() => {
                                  if (
                                    currentTrack === customMusicUrl &&
                                    isPlaying
                                  ) {
                                    pause();
                                  } else {
                                    play(customMusicUrl);
                                  }
                                }}
                                onSeek={seek}
                              />
                            </div>
                          )}
                        </div>
                      )}

                      <div className="bg-blue-50 border-2 border-blue-200 p-3 md:p-4 rounded-xl mt-3 flex items-start gap-2">
                        <span className="text-blue-600 text-lg flex-shrink-0">
                          ℹ️
                        </span>
                        <p className="text-xs md:text-sm text-gray-600">
                          Make sure you have rights to use this music. The file
                          will be deleted after 24 hours.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 md:p-6 rounded-xl">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm md:text-base">
                      <Sparkles className="text-indigo-600" size={20} />
                      Summary
                    </h3>
                    <div className="space-y-2 text-xs md:text-sm">
                      <p>
                        <span className="font-medium">For:</span>{" "}
                        {formData.recipientName}
                      </p>
                      <p>
                        <span className="font-medium">From:</span>{" "}
                        {formData.senderName}
                      </p>
                      <p>
                        <span className="font-medium">Photos:</span>{" "}
                        {photos.length} memories
                      </p>
                      <p>
                        <span className="font-medium">Music:</span>{" "}
                        {musicChoice === "custom"
                          ? customMusicPreview || "Upload a music file"
                          : defaultAudioTracks.find((t) => t.id === musicChoice)
                              ?.name || "Select a song"}
                      </p>
                    </div>
                  </div>

                  {/* Free Badge */}
                  <div className="bg-green-50 border-2 border-green-300 p-5 md:p-6 rounded-xl text-center">
                    <p className="text-xl md:text-2xl font-bold text-green-600 mb-2">
                      🎉 Free!
                    </p>
                    <p className="text-gray-600 text-xs md:text-sm">
                      No payment needed
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 md:mt-8 pt-6 border-t">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-5 md:px-6 py-2 md:py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-gray-400 transition-colors text-sm md:text-base"
              >
                Back
              </button>
            )}

            <button
              onClick={() => {
                if (step === 4) {
                  onSubmit();
                } else {
                  setStep(step + 1);
                }
              }}
              disabled={
                !canProceed(
                  step,
                  photos.length,
                  musicChoice,
                  customMusicFile
                ) || isLoading
              }
              className={`ml-auto px-6 md:px-8 py-2 md:py-3 rounded-full font-semibold flex items-center gap-2 transition-all text-sm md:text-base ${
                canProceed(step, photos.length, musicChoice, customMusicFile) &&
                !isLoading
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <span>{step === 4 ? "Create Now" : "Next"}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateExperience;
