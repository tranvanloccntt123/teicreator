import { BlendMode, Group, Picture, Skia, createPicture } from '@shopify/react-native-skia';
import React from 'react';

const Painting = () => {
 const picture = React.useMemo(() => createPicture((canvas) => {
    const paint = Skia.Paint();
    paint.setBlendMode(BlendMode.Multiply);
    const path = Skia.Path.Make();
    path.close();
    canvas.drawPath(path, paint);
 }),[]);
 return <Group>
   <Picture picture={picture} />
 </Group>
};

export default Painting;