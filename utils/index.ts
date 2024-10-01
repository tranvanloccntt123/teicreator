export {
  getComponentTransform,
  updateComponentTransform,
  componentSize,
  resizePosition,
  resizeComponentFitWorkspace,
  findCurrentComponent,
  rootTranslate,
  temperatureUp,
  createNewWorspace,
  paintLinePath,
  setCurrentWorkspace,
  setCurrentComponent,
  pushComponentToCurrentWorkspace,
  pushComponentToDraftWorkspace,
  setDraftWorkspace,
  pushWorkspace,
  clearCurrentComponent,
  deleteComponentById,
  updateCurrentWorkspace,
  updatePaintStatus,
  updatePaintParams,
} from "./workspace";

export {
  pickColorAt,
  pickImage,
  fitComponentSize,
  resizeImage,
} from "./images";

export {
  radFromAngle,
  radBetween2Vector,
  angleBetween2Vector,
  distanceBetween2Vector,
  vectorOnCircleLine,
  vectorOnDiagonalLine,
  radToDegree,
  vectorFromRadians,
  scalePathData,
} from "./transform";

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const first = <T = any>(arr: Array<T>) => arr?.[0] || undefined;

export const last = <T = any>(arr: Array<T>) =>
  arr?.[arr?.length - 1] || undefined;

export const hasIndex = <T = any>(arr: Array<T>, index: number): boolean =>
  Boolean(arr[index]);
