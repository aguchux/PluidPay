'use client';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen justify-center items-center w-full overflow-x-hidden flex flex-col">
      {children}
    </div>
  );
}
