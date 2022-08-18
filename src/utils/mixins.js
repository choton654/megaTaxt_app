import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window');
const [shortDimension, longDimension] = width < height ? [width, height] : [height, width];
const guidelineBaseWidth = 414;
const guidelineBaseHeight = 896;

const horizontalFactor = shortDimension / guidelineBaseWidth;
const verticalFactor = longDimension / guidelineBaseHeight;

export const horizontalScale = size => horizontalFactor * size;
export const verticalScale = size => verticalFactor * size;
