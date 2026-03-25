export function arrayToObject(array: any[], key: string, valueKey:string) {
  const temp:Record<string, any> = {};
  array.forEach(item => {
    temp[item[key]] = item[valueKey];
  });
  return temp;
}