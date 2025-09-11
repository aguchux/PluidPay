'use client';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen w-screen overflow-hidden flex flex-col">{children}</div>;
}
