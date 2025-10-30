// C:\beatflow\frontend\src\context\PlayerContext.jsx

import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';
import useAuth from '../hooks/useAuth';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const { accessToken } = useAuth(); // Get the token from AuthContext
  const [player, setPlayer] = useState(null); // The Spotify Player object
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [deviceId, setDeviceId] = useState(null); // The ID of this browser player
  const [currentSong, setCurrentSong] = useState(null); // The full track object from Spotify
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const intervalRef = useRef(null);
  const accessTokenRef = useRef(accessToken);

  // Keep the ref updated with the latest token
  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  // Cleanup progress interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Effect 1: Define the SDK Ready function. Runs ONCE.
  // This fixes the 'onSpotifyWebPlaybackSDKReady is not defined' error.
  useEffect(() => {
    console.log("PlayerContext mounted. Setting up SDK ready callback...");

    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log('Spotify SDK Ready!');
      const playerInstance = new window.Spotify.Player({
        name: 'BeatFlow Web Player',
        getOAuthToken: (cb) => {
          const token = accessTokenRef.current;
          if (token) {
            console.log("SDK requested token, providing...");
            cb(token);
          } else {
            console.error("SDK requested token, but accessToken is not ready.");
            cb(null); // It will fail auth, which is correct for now
          }
        },
        volume: 0.5,
      });

      // --- Player Listeners ---
      playerInstance.addListener('ready', ({ device_id }) => {
        console.log('Spotify Player Ready, Device ID:', device_id);
        setDeviceId(device_id);
        setIsPlayerReady(true);
      });

      playerInstance.addListener('not_ready', ({ device_id }) => {
        console.warn('Device ID has gone offline', device_id);
        setIsPlayerReady(false);
      });

      playerInstance.addListener('player_state_changed', (state) => {
        if (!state) {
          console.log('Player state is null (e.g., logged out)');
          setIsPlaying(false);
          setCurrentSong(null);
          setProgress(0);
          return;
        }

        const currentTrack = state.track_window.current_track;
        setCurrentSong(currentTrack);
        setIsPlaying(!state.paused);
        setProgress(state.position);
        setDuration(state.duration);

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        
        if (!state.paused) {
          intervalRef.current = setInterval(() => {
            setProgress((prevProgress) => {
              if (prevProgress + 1000 > state.duration) {
                clearInterval(intervalRef.current);
                return state.duration;
              }
              return prevProgress + 1000;
            });
          }, 1000);
        }
      });

      playerInstance.addListener('initialization_error', ({ message }) => console.error('Failed to initialize', message));
      playerInstance.addListener('authentication_error', ({ message }) => console.error('Failed to authenticate', message));
      playerInstance.addListener('account_error', ({ message }) => alert(`Account error: ${message} - You must have Spotify Premium.`));
      playerInstance.addListener('playback_error', ({ message }) => console.error('Playback error:', message));

      setPlayer(playerInstance); // Save the player instance to state
    };
    
    // In case script is already loaded
    if (window.Spotify) {
        console.log("Spotify SDK already loaded, manually calling onReady.");
        window.onSpotifyWebPlaybackSDKReady();
    } else {
        console.log("Waiting for Spotify SDK script to load...");
    }

  }, []); // Runs only once on mount

  // Effect 2: Connect the player.
  // This now waits for BOTH the player instance AND the access token.
  // This fixes the "accessToken is not ready" and "401" errors.
  useEffect(() => {
    if (player && accessToken) {
      console.log("Access token is ready, connecting player...");
      player.connect().then(success => {
        if (success) {
          console.log('Spotify Player connected successfully!');
        }
      });
    }
  }, [player, accessToken]); // Re-run when player or token becomes available

  // --- Play Function ---
  const playSong = useCallback((spotifyUri) => {
    if (!deviceId || !player) {
      console.error('Player not ready or Device ID missing');
      return;
    }
    
    const token = accessTokenRef.current;
    if (!token) {
        console.error("Cannot play song, Spotify access token is missing.");
        return;
    }

    console.log("Attempting to play URI:", spotifyUri, "on Device:", deviceId);

    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      body: JSON.stringify({
        uris: [spotifyUri],
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).catch(err => console.error("Play request failed", err));

  }, [deviceId, player]);

  // --- Player Controls ---
  const togglePlayPause = useCallback(() => {
    if (!player) return;
    player.togglePlay();
  }, [player]);

  const playNext = useCallback(() => {
    if (!player) return;
    player.nextTrack();
  }, [player]);

  const playPrevious = useCallback(() => {
    if (!player) return;
    player.previousTrack();
  }, [player]);

  const handleSeek = useCallback((newPosition) => {
    if (!player) return;
    player.seek(newPosition * 1000);
  }, [player]);
  
  const handleVolumeChange = useCallback((newVolume) => {
     if (!player) return;
     player.setVolume(newVolume);
  }, [player]);

  return (
    <PlayerContext.Provider
      value={{
        isPlayerReady,
        currentSong,
        isPlaying,
        progress,
        duration,
        playSong,
        togglePlayPause,
        playNext,
        playPrevious,
        handleSeek,
        handleVolumeChange
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContext;