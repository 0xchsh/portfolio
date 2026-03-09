import Image from 'next/image';

export function Avatar() {
  return (
    <div className="w-12 h-12 rounded-full overflow-hidden">
      <video
        autoPlay
        muted
        playsInline
        poster="/images/pfp.png"
        className="w-full h-full object-cover"
      >
        <source src="/images/pfp.webm" type="video/webm" />
        <Image
          src="/images/pfp.png"
          alt="Charles Shin"
          width={48}
          height={48}
          className="w-full h-full object-cover"
        />
      </video>
    </div>
  );
}
