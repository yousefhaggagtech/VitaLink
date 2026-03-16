import "@/styles/globals.css";
 
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <main className="flex-1 ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}