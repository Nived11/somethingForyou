import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SceneManager from '../components/SceneManager';
import { getExperience } from '../utils/api';
import {type  ExperienceData } from '../types/experience';

const ViewExperience = () => {
  const { uniqueId } = useParams();
  const [experienceData, setExperienceData] = useState<ExperienceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchExperience = async () => {
      if (!uniqueId) {
        setError('Invalid experience link');
        setIsLoading(false);
        return;
      }

      try {
        const response = await getExperience(uniqueId);
        
        if (response.success) {
          setExperienceData(response.data);
        } else {
          setError(response.message || 'Experience not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load experience');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperience();
  }, [uniqueId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl">Loading your surprise...</p>
        </div>
      </div>
    );
  }

  if (error || !experienceData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-center px-4">
        <div>
          <h1 className="text-3xl md:text-4xl mb-4"> {error || 'Experience Not Found'}</h1>
          <p className="text-gray-400 mb-6">This link may have expired or doesn't exist.</p>
          <a 
            href="/" 
            className="inline-block bg-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors"
          >
            Create Your Own
          </a>
        </div>
      </div>
    );
  }

  return <SceneManager data={experienceData} />;
};

export default ViewExperience;
