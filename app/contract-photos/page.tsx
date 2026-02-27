import Header from "@/components/Header";
import Image from "next/image";

const photos = [
  { src: "/contract-photos/p1.jpg", alt: "계약서 1페이지" },
  { src: "/contract-photos/p2.jpg", alt: "계약서 2페이지" },
  { src: "/contract-photos/p3.jpg", alt: "계약서 3페이지" },
];

export default function ContractPhotosPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Header />
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-3xl">
        <div className="flex flex-col gap-4 sm:gap-6">
          {photos.map((photo, i) => (
            <a
              key={photo.src}
              href={photo.src}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-pink-100"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={800}
                height={1100}
                className="w-full h-auto"
                priority={i === 0}
              />
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
