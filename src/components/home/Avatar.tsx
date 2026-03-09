import Image from 'next/image';

export function Avatar() {
  return (
    <div className="w-12 h-12 rounded-full overflow-hidden pop-in" style={{ animationDelay: '400ms' }}>
      <Image
        src="/images/pfp.png"
        alt="Charles Shin"
        width={48}
        height={48}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
