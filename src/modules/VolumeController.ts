import { TwitchVideo } from './TwitchVideo';
import { VolumeOverlay } from './VolumeOverlay';
import { MouseControl } from './MouseControl';

/**
 * Twitchの音量をスクロールで管理する
 */
export class VolumeController {
  constructor() {
    const video = new TwitchVideo();
    const overlay = new VolumeOverlay();
    const scroll = new MouseControl();

    scroll.addEventListener('start', () => overlay.showOverlay());
    scroll.addEventListener('end', () => overlay.hideOverlay());
    scroll.addEventListener('up', () => {
      const volume = video.incrementVolume();
      overlay.changeText(volume);
    });
    scroll.addEventListener('down', () => {
      const volume = video.decrementVolume();
      overlay.changeText(volume);
    });
    scroll.addEventListener('click', () => {
      const volume = video.toggleMute();
      overlay.changeText(volume);
    });
  }
}
