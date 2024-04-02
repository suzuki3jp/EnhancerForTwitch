import { RightClickScroll } from './RightClickScroll';
import { TwitchVideo } from './TwitchVideo';
import { VolumeOverlay } from './VolumeOverlay';

const main = () => {
  const currentLocation = new URL(location.href);
  const locationWhitelist = ['www.twitch.tv'];

  if (locationWhitelist.includes(currentLocation.host)) {
    const video = new TwitchVideo();
    const overlay = new VolumeOverlay(video.getCurrentVolume());
    new RightClickScroll({
      start: () => {
        overlay.showOverlay();
      },
      end: () => {
        overlay.hideOverlay();
      },
      scrollUp: () => {
        const volume = video.incrementVolume();
        overlay.changeText(volume);
      },
      scrollDown: () => {
        const volume = video.decrementVolume();
        overlay.changeText(volume);
      },
    });
  }
};

const tryCatchMain = () => {
  try {
    main();
  } catch (error) {
    console.log(error);
    sleep(1_000).then(() => {
      tryCatchMain();
    });
  }
};

tryCatchMain();

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
