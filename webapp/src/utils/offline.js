import localforage from 'localforage';
localforage.config({ name: 'my-soundtrack' });

export async function saveTrackBlob(id, blob){
  await localforage.setItem('track-' + id, blob);
}
export async function getTrackBlob(id){
  return await localforage.getItem('track-' + id);
}
export async function removeTrackBlob(id){
  return await localforage.removeItem('track-' + id);
}
