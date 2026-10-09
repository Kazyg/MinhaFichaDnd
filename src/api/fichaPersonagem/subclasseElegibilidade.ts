export function nivelEntradaSubclasse(classe: string, versao: string): number {
  if (versao === 'DND_2024') return 3;
  const nome = classe.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (['clerigo', 'feiticeiro'].includes(nome)) return 1;
  if (['druida', 'mago'].includes(nome)) return 2;
  // The 2014 warlock stores its patron separately; subClasse is Pact Boon.
  return 3;
}
export function podeTerSubclasse(classe: string, nivel: number, versao: string): boolean {
  return nivel >= nivelEntradaSubclasse(classe, versao);
}
