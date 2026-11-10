// Every mascot picture. Each exists as .webp and .png in public/assets/mascot/,
// all 720px tall with a transparent background. `width` is the real pixel width,
// so the browser can reserve the right space while the image loads.
// Use them with <MascotImage name="coffee" /> (src/components/ui/MascotImage.jsx).

export const MASCOT_DIR = '/assets/mascot'
export const MASCOT_HEIGHT = 720

export const MASCOTS = {
  point: { file: 'flowdo-mascot-1-point', width: 480 },
  checklist: { file: 'flowdo-mascot-2-checklist', width: 480 },
  typing: { file: 'flowdo-mascot-3-typing', width: 476 },
  stretch: { file: 'flowdo-mascot-4-stretch', width: 361 },
  guide: { file: 'flowdo-mascot-5-guide', width: 409 },
  desk: { file: 'flowdo-mascot-6-desk', width: 564 },
  coffee: { file: 'flowdo-mascot-7-coffee', width: 424 },
  meditate: { file: 'flowdo-mascot-8-meditate', width: 470 },
  sleep: { file: 'flowdo-mascot-9-sleep', width: 556 },
  cheer: { file: 'flowdo-mascot-10-cheer', width: 495 },
  wave: { file: 'flowdo-mascot-11-wave', width: 295 },
  peek: { file: 'flowdo-mascot-12-peek', width: 265 },
  cart: { file: 'flowdo-mascot-13-cart', width: 561 },
}

// The four mascots floating around the 3D logo in the Hero (hidden at 960px and below).
// className: where it sits inside the Hero and how tall it is. clamp() shrinks them a bit
//   on small desktops so they never run into the title or the logo.
// float: loop = seconds for one full up-and-down, delay = start offset (negative = start
//   part-way through), tilt = max degrees. All loops differ, so they never move in sync.
export const HERO_MASCOTS = [
  {
    name: 'checklist', // top-left
    className: 'left-[3%] top-[11%] h-[clamp(200px,21vw,300px)]',
    float: { loop: 6, delay: 0, tilt: 1.5 },
  },
  {
    name: 'point', // top-right
    className: 'right-[3%] top-[9%] h-[clamp(200px,21vw,300px)]',
    float: { loop: 6.8, delay: -2.1, tilt: -1.5 },
  },
  {
    name: 'typing', // bottom-left
    className: 'left-[11%] bottom-[5%] h-[clamp(150px,15vw,220px)]',
    float: { loop: 7.4, delay: -4.4, tilt: 1.2 },
  },
  {
    name: 'stretch', // bottom-right
    className: 'right-[12%] bottom-[5%] h-[clamp(180px,19vw,270px)]',
    float: { loop: 5.6, delay: -1.3, tilt: -1.5 },
  },
]
