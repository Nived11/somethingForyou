import { useState } from 'react';
import Arrival from '../scenes/Arrival';
import DoorScene from '../scenes/DoorScene';
// import DarkRoom from '../scenes/DarkRoom';
// import Celebration from '../scenes/Celebration';
// import Gallery from '../scenes/Gallery';
// import Finale from '../scenes/Finale';
import {type ExperienceData } from '../types/experience';

interface Props {
  data: ExperienceData;
}

const SceneManager = ({ data }: Props) => {
  const [currentScene, setCurrentScene] = useState(0);
  
  const scenes = [
    { component: Arrival, name: 'arrival' },
    { component: DoorScene, name: 'door' },
    // { component: DarkRoom, name: 'darkRoom' },
    // { component: Celebration, name: 'celebration' },
    // { component: Gallery, name: 'gallery' },
    // { component: Finale, name: 'finale' },
  ];

  const goToNextScene = () => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(currentScene + 1);
    }
  };

  const CurrentSceneComponent = scenes[currentScene].component;

  return (
    <div className="w-full h-screen overflow-hidden">
      <CurrentSceneComponent
        data={data}
        onNext={goToNextScene}
        isActive={true}
      />
    </div>
  );
};

export default SceneManager;
