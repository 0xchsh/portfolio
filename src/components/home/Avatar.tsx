export function Avatar() {
  return (
    <div className="w-14 h-14 rounded-full overflow-hidden">
      <video
        src="/images/pfp.webm?v=2"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  );
}
