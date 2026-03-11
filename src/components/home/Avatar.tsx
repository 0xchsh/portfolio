import Image from 'next/image';

export function Avatar() {
  return (
    <div className="w-14 h-14 rounded-full overflow-hidden">
      <Image
        src="/images/pfp.png"
        alt="Charles Shin"
        width={56}
        height={56}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
