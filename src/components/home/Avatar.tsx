import Image from 'next/image';

export function Avatar() {
  return (
    <div className="w-12 h-12 rounded-full overflow-hidden">
      <Image
        src="/images/pfp.png"
        alt="Charles Shin"
        width={56}
        height={56}
        className="w-14 h-14 -mb-1"
      />
    </div>
  );
}
