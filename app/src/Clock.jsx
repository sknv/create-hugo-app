const { h } = window.preact

export default function Clock() {
  const time = new Date().toLocaleTimeString()
  return <span>{time}</span>
}
