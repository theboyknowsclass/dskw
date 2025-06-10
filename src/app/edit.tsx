import { Redirect } from 'expo-router';
import { useSourceImageStore } from '@stores';
import { Edit } from '@pages';
import { IsDefaultSourceImage } from '@types';

export const EditRoute: React.FC = () => {
  const { sourceImage } = useSourceImageStore();

  if (IsDefaultSourceImage(sourceImage)) return <Redirect href="/" />;

  return <Edit />;
};

export default EditRoute;
