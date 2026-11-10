// Brand words with the moving indigo-to-white gradient (see .shine-text in index.css).
// <h2>What is <ShineText>Flowdo</ShineText>?</h2>
export default function ShineText({ className = '', children }) {
  return <span className={`shine-text ${className}`}>{children}</span>
}
