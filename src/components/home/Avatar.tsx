export function Avatar() {
  return (
    <div className="w-14 h-14 rounded-full overflow-hidden">
      <video
        src="/images/pfp.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  );
}
