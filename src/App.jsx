import { sections } from './sections'

// Renders every section in the order listed in src/sections/index.js.
export default function App() {
  return (
    <main>
      {sections.map((Section, index) => (
        <Section key={index} />
      ))}
    </main>
  )
}
