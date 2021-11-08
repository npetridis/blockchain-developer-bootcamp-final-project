import { AppModes } from 'components/Layout/types';
import { useRouter } from 'next/router';

export const useAppMode = (): AppModes => {
  const { query } = useRouter();
  const { mode } = query;

  if (mode === undefined) {
    return AppModes.Loading;
  } else if (mode === AppModes.ERC20) {
    return AppModes.ERC20;
  } else if (mode === AppModes.PTRD) {
    return AppModes.PTRD;
  }
  return AppModes.Ether;
}
