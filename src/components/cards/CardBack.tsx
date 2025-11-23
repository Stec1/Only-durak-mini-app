import React from 'react';
import { CardFrame } from './CardFrame';
import { BackArtImage } from './BackArtImage';

type Props = {
  uri?: string;
};

export default function CardBack({ uri }: Props) {
  return (
    <CardFrame>
      <BackArtImage uri={uri} />
    </CardFrame>
  );
}
