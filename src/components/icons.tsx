
export function ManvaasamLogo(props: React.ImgHTMLAttributes<HTMLImageElement>) {
 const { width = 32, height = 32, ...rest } = props;
  return (
    <img
      src="/bg-agri.png"
      width={width}
      height={height}
      alt="Manvaasam Logo"
      {...rest}
      className="drop-shadow-lg"
    />
  );
}
