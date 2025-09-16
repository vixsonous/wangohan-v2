export async function ColumnLine() {
  return (
    <div className="flex w-full gap-2">
      <div className="h-0.5 bg-primary-text w-full"></div>
      <div className="h-0.5 w-2 bg-primary-text hidden md:flex"></div>
      <div className="h-0.5 bg-primary-text w-full"></div>
    </div>
  )
}