export function Footer() {
  return (
    <footer className="py-4 border-t">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground max-w-3xl">
        <p>© {new Date().getFullYear()} 吵架包赢 | 免责声明：仅供娱乐，请文明吵架</p>
      </div>
    </footer>
  );
}