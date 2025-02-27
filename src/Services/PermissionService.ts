export const verifyPermissionByService = (
  user: any,
  service: any,
  permission: string
) => {
  const seriveFound = user?.selectedInstance?.services?.filter(
    (s: any) => s?.typeProduct === service
  )[0];

  if (seriveFound != undefined) {
    const permissions: any[] = seriveFound?.permissions?.map(
      (p: any) => p?.enumTag
    );

    if (permission == null && permissions?.length > 0) {
      return true;
    }

    if (permissions?.includes(permission)) {
      return true;
    }
  }

  return false;
};
