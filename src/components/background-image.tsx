export const BackgroundImage = () => {
  return (
    <div style={{
      backgroundImage: "url('/images/flares2.png')",
      opacity: 0.5,
      top: 65,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: -1,
      backgroundSize: 'cover',
      backgroundPosition: 'top',
    }}
      className="fixed inset-0 -z-20 h-screen w-screen object-cover"
    >
    </div>
  )
}
