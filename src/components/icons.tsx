import Image from 'next/image';
import type { SVGProps } from 'react';

export function ManvaasamLogo(props: SVGProps<SVGSVGElement> & { width?: number, height?: number }) {
  const { width = 32, height = 32, className, ...rest } = props;
  return (
    <Image
      {...rest}
      src="https://storage.googleapis.com/aai-web-samples/community-images/manvaasam/logo_2.png"
      alt="Manvaasam Logo"
      width={width}
      height={height}
      className={className}
    />
  );
}
