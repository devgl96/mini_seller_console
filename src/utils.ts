function saveDataStorage(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getDataStorage(key: string) {
  const data = localStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  }
  return null;
}

export { saveDataStorage, getDataStorage };
