/**
 * Auth route-group layout. The premium background + card framing now live in
 * <AuthStage> (composed by each page), so this is just a full-height wrapper.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="min-h-screen">{children}</main>;
}
