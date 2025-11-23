export const formatDate = (dateStr: string | Date | undefined): string | undefined => {
  if (!dateStr) return undefined;
  try {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    return date.toISOString().split('T')[0];
  } catch {
    return undefined;
  }
};
