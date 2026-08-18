import { DesktopSidebar, MobileNavigation } from "@/components/layout/SidebarNavigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Main content — offset by sidebar width on desktop */}
      <main
        className="
          w-full
          md:pl-[220px]
          transition-[padding-left] duration-300
          pb-20 md:pb-0
        "
        id="main-content"
      >
        {children}
      </main>

      {/* Mobile bottom navigation */}
      <MobileNavigation />
    </div>
  );
}
