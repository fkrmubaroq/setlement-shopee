export default function Title({
  title,
  subTitle,
}: {
  title: string;
  subTitle?: string;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      {subTitle && <p className="text-muted-foreground">{subTitle}</p>}
    </div>
  );
}
