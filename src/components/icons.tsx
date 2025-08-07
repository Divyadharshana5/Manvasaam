
import Image from "next/image";

export function ManvaasamLogo(props: Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'>) {
 const { width = 32, height = 32, ...rest } = props;
  return (
    <Image
      src="/bg-agri.png"
      width={Number(width)}
      height={Number(height)}
      alt="Manvaasam Logo"
      {...rest}
      className="drop-shadow-lg"
    />
  );
}
