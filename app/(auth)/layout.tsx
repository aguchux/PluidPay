'use client';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-screen justify-center items-center overflow-hidden flex flex-col">
      {children}
    </div>
  );
}
