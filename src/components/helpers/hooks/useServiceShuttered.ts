import { useEffect, useState } from 'react';
import { getServiceShutteredStatus } from '../utils';

export default function useServiceShuttered(isCalledFromConfPage = false): boolean {
  const [serviceShuttered, setServiceShuttered] = useState<boolean>(false);

  useEffect(() => {
    const isServiceShuttered = async () => {
      try {
        const status = await getServiceShutteredStatus();
        setServiceShuttered(status);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        setServiceShuttered(false);
      } finally {
        if (isCalledFromConfPage) {
          PCore.getContainerUtils().closeContainerItem(
            PCore.getContainerUtils().getActiveContainerItemContext('app/primary'),
            { skipDirtyCheck: true }
          );
        }
      }
    };

    isServiceShuttered();
  }, []);

  return serviceShuttered;
}
