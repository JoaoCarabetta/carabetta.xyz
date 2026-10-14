export type ProfileFilter = 'geral' | 'perfil-a' | 'perfil-b'

export const baseStats = {
  total: 1694,
  proLula: 809,
  neutro: 757,
  proBolsonaro: 128,
  weekDelta: 4,
  influencerScore: 67,
  audienceScore: 54,
  audienceProfiles: 1678,
}

export const filterOptions = [
  { value: 'geral', label: 'Geral · base completa (1694)' },
  { value: 'perfil-a', label: 'Perfil A · sentimento (1694)' },
  { value: 'perfil-b', label: 'Perfil B · engajamento (1694)' },
] as const

export const topSupporters = [
  { name: 'Marina Costa', handle: '@marinacosta', party: 'PT/SP', score: 94 },
  { name: 'Ricardo Alves', handle: '@ricardoalves', party: 'PT/MG', score: 91 },
  { name: 'Ana Beatriz Lima', handle: '@anablima', party: 'PSOL/RJ', score: 88 },
  { name: 'Pedro Henrique', handle: '@pedrohsocial', party: 'PT/BA', score: 85 },
  { name: 'Camila Duarte', handle: '@camiladuarte', party: 'PCdoB/PE', score: 82 },
  { name: 'João Vitor Rocha', handle: '@jvrocha', party: 'PT/CE', score: 80 },
  { name: 'Larissa Pinto', handle: '@larissapinto', party: 'PT/RS', score: 78 },
  { name: 'Felipe Araújo', handle: '@felipearaujo', party: 'PSOL/SP', score: 76 },
]

export const topOpposition = [
  { name: 'Felipe Moura', handle: '@felipemoura', party: 'PL/SP', score: 89 },
  { name: 'Juliana Prado', handle: '@julianaprado', party: 'PL/RJ', score: 84 },
  { name: 'Bruno Teixeira', handle: '@brunotx', party: 'NOVO/MG', score: 79 },
  { name: 'Larissa Nunes', handle: '@larissanunes', party: 'PL/GO', score: 76 },
  { name: 'Carlos Eduardo', handle: '@carlosedu', party: 'PL/PR', score: 73 },
  { name: 'Renata Souza', handle: '@renatasouza', party: 'PL/SC', score: 71 },
]

const seedProfiles = [
  { name: 'Gabriela Santos', meta: 'Influenciadora · SP', lula: 72, neutro: 18, bolso: 10 },
  { name: 'Thiago Ribeiro', meta: 'Comentarista · RJ', lula: 15, neutro: 22, bolso: 63 },
  { name: 'Helena Martins', meta: 'Jornalista · DF', lula: 41, neutro: 44, bolso: 15 },
  { name: 'Lucas Ferreira', meta: 'Podcaster · MG', lula: 58, neutro: 30, bolso: 12 },
  { name: 'Beatriz Oliveira', meta: 'Criadora · BA', lula: 66, neutro: 24, bolso: 10 },
  { name: 'André Souza', meta: 'Analista · RS', lula: 28, neutro: 51, bolso: 21 },
  { name: 'Patricia Mendes', meta: 'Colunista · PR', lula: 19, neutro: 27, bolso: 54 },
  { name: 'Rafael Campos', meta: 'Streamer · CE', lula: 61, neutro: 29, bolso: 10 },
  { name: 'Sofia Almeida', meta: 'Ativista · PE', lula: 78, neutro: 16, bolso: 6 },
  { name: 'Diego Carvalho', meta: 'Youtuber · SC', lula: 22, neutro: 33, bolso: 45 },
  { name: 'Mariana Lopes', meta: 'Pesquisadora · SP', lula: 49, neutro: 38, bolso: 13 },
  { name: 'Gustavo Nascimento', meta: 'Comentarista · RJ', lula: 34, neutro: 40, bolso: 26 },
  { name: 'Isabela Freitas', meta: 'Influenciadora · GO', lula: 55, neutro: 30, bolso: 15 },
  { name: 'Henrique Dias', meta: 'Podcaster · AM', lula: 62, neutro: 25, bolso: 13 },
  { name: 'Natalia Rocha', meta: 'Jornalista · PA', lula: 47, neutro: 36, bolso: 17 },
  { name: 'Vinicius Barros', meta: 'Creator · PB', lula: 70, neutro: 20, bolso: 10 },
  { name: 'Clara Menezes', meta: 'Analista · ES', lula: 38, neutro: 42, bolso: 20 },
  { name: 'Otávio Lima', meta: 'Colunista · MT', lula: 25, neutro: 35, bolso: 40 },
  { name: 'Amanda Vieira', meta: 'Ativista · MA', lula: 74, neutro: 18, bolso: 8 },
  { name: 'Bruno Costa', meta: 'Streamer · RN', lula: 44, neutro: 33, bolso: 23 },
]

export const profiles = seedProfiles

export const states = [
  { uf: 'SP', name: 'São Paulo', value: 312, pct: 92 },
  { uf: 'RJ', name: 'Rio de Janeiro', value: 198, pct: 78 },
  { uf: 'MG', name: 'Minas Gerais', value: 164, pct: 71 },
  { uf: 'BA', name: 'Bahia', value: 142, pct: 66 },
  { uf: 'RS', name: 'Rio Grande do Sul', value: 118, pct: 58 },
  { uf: 'PR', name: 'Paraná', value: 104, pct: 52 },
  { uf: 'PE', name: 'Pernambuco', value: 96, pct: 48 },
  { uf: 'CE', name: 'Ceará', value: 88, pct: 44 },
  { uf: 'DF', name: 'Distrito Federal', value: 76, pct: 39 },
  { uf: 'GO', name: 'Goiás', value: 64, pct: 33 },
]

export const perfilA = {
  positives: 67,
  negatives: 34,
  subtitle: 'Acompanhe menções positivas e negativas dos perfis da base.',
  topics: [
    { label: 'Economia', value: 82 },
    { label: 'Saúde', value: 71 },
    { label: 'Educação', value: 64 },
    { label: 'Meio ambiente', value: 48 },
  ],
}

export const perfilB = {
  favorable: 905,
  unfavorable: 789,
  subtitle:
    'Acompanhe em tempo real a evolução do engajamento e a polarização das redes sociais.',
  conquista: 87,
  palavras: 54,
  topics: [
    { label: 'Economia', value: 120 },
    { label: 'Educação', value: 98 },
    { label: 'Segurança', value: 86 },
    { label: 'Corrupção', value: 74 },
  ],
}
