export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      OrphanagesMap: undefined;
      OrphanageDetails: { id: number } | undefined;
      OrphanageListDetails: undefined;
      EditOrphanage: { id: number };
      SelectMapPosition: undefined;
      OrphanageData: { positon: { latitude: number; longitude: number } };
    }
  }
}
