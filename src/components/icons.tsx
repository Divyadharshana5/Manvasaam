import Image from 'next/image';
import type { SVGProps } from 'react';

export function ManvaasamLogo(props: Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'> & { src?: string, alt?: string }) {
  const { width = 32, height = 32, ...rest } = props;
  return (
    <Image
      {...rest}
      src="https://storage.googleapis.com/aai-web-samples/community-images/manvaasam/logo_3.png"
      alt="Manvaasam Logo"
      width={width}
      height={height}
    />
  );
}
