export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div id="main" tabIndex={-1} className="route-fade">
      {children}
    </div>
  );
}
