export const isPostNew = (createdAt) => {
  if (!createdAt) return false;
  const created = new Date(createdAt).getTime();
  if (isNaN(created)) return false;
  
  const now = Date.now();
  const sixHours = 6 * 60 * 60 * 1000;
  return now - created < sixHours;
};