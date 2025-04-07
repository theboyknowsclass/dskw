import { Redirect } from 'expo-router';
import { useSourceImageStore } from '@stores';
import { Edit } from '@pages';

export const EditRoute: React.FC = () => {
  const { uri } = useSourceImageStore();

  if (!uri) return <Redirect href="/" />;

  return <Edit />;
};

export default EditRoute;
