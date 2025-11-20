interface Props {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div className="h-full bg-muted flex items-center justify-center overflow-y-auto p-4 lg:p-8">
      <main className="w-full max-w-[420px]">
        {children}
      </main>
    </div>
  )
}
