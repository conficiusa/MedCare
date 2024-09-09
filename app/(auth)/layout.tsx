import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="container flex items-center justify-center mb-20">
      <div className="w-full bg-gradient-to-t from-teal-50 lg:grid lg:min-h-[85dvh] lg:grid-cols-2 mt-10 max-w-6xl mx-auto">
        <div className="hidden bg-muted lg:block rounded-l-md">
          <div className="relative w-full h-full">
            <Image
              src={"/authPic.jpg"}
              alt="Image"
              fill
              priority
              className="object-cover rounded-l-md"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 to-transparent rounded-l-lg">
              <div className="absolute bottom-0 p-8 text-white">
                <h1 className="text-2xl font-semibold">
                  Get Started with Medcare Hub
                </h1>
                <p className="mt-4 text-muted-foreground text-sm">
                  Enjoy the convenience of virtual consultations from the
                  comfort of your home, eliminating the need for long wait times
                  and travel hassles
                </p>
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
