export function slugify(name: string): string {
  const base = name
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const random = Math.floor(1000 + Math.random() * 9000);
  return `${base}-${random}`;
}
