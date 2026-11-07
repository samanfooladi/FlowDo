// The four mascots that float around the 3D logo in the Hero.
// Change a position, size or float timing here; Hero.jsx just loops over this list.
//
// className: where it sits inside the Hero's centred mascot area, and how tall it is.
//   clamp(min, preferred, max) shrinks the height on smaller desktops so it never
//   runs into the title, the logo or the download buttons.
//   The bottom two use bottom-[calc(50%-265px)] instead of a plain %: the content is centred,
//   and that puts their feet just above the row of download buttons at any screen height.
//   (The button row is ~860px wide, so a plain bottom-[5%] would sit on top of the buttons.)
// width / height: the real pixel size of the .webp file.
// float: duration = seconds for one up (or down) move, delay = start offset, tilt = max degrees.
// The durations are all different, so the mascots never move in sync.

const DIR = '/assets/mascot'

export const HERO_MASCOTS = [
  {
    // Top-left: holding a checklist
    src: `${DIR}/flowdo-mascot-2-checklist.webp`,
    width: 480,
    height: 720,
    className: 'left-[3%] top-[11%] h-[clamp(190px,21vw,300px)]',
    float: { duration: 6, delay: 0, tilt: 1.5 },
  },
  {
    // Top-right: points left, toward the logo
    src: `${DIR}/flowdo-mascot-1-point.webp`,
    width: 480,
    height: 720,
    className: 'right-[3%] top-[9%] h-[clamp(190px,21vw,300px)]',
    float: { duration: 6.8, delay: 1.2, tilt: -1.5 },
  },
  {
    // Bottom-left: typing on a laptop
    src: `${DIR}/flowdo-mascot-3-typing.webp`,
    width: 476,
    height: 720,
    className: 'left-[11%] bottom-[calc(50%-265px)] h-[clamp(140px,15vw,220px)]',
    float: { duration: 7.4, delay: 0.6, tilt: 1.2 },
  },
  {
    // Bottom-right: stretching
    src: `${DIR}/flowdo-mascot-4-stretch.webp`,
    width: 361,
    height: 720,
    className: 'right-[12%] bottom-[calc(50%-265px)] h-[clamp(170px,19vw,270px)]',
    float: { duration: 5.6, delay: 2, tilt: -1.5 },
  },
]
