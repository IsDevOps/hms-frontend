export const getInitials = (fullName: string) => {
  if (!fullName) return '';

  const names = fullName
    .trim()
    .split(' ')
    .filter((name) => name.length > 0);

  if (names.length === 1) {
    return names[0].substring(0, 2).toUpperCase();
  }

  const firstInitial = names[0][0];
  const lastInitial = names[names.length - 1][0];

  return (firstInitial + lastInitial).toUpperCase();
};
