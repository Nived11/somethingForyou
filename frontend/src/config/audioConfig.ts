export interface AudioTrack {
  id: string;
  name: string;
  src: string;
}

export const defaultAudioTracks: AudioTrack[] = [
  {
    id: 'song1',
    name: 'Birthday Celebration',
    src: '/audio/song1.mpeg',
  },
  // Add more songs here
];
