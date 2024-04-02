import { VolumeController } from './modules';

const main = () => {
  const currentLocation = new URL(location.href);
  const locationWhitelist = ['www.twitch.tv'];

  if (locationWhitelist.includes(currentLocation.host)) {
    new VolumeController();
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
