export function setMusicUrl(newMemberUsername: string): string | undefined {
  switch (newMemberUsername) {
    case process.env.DISCORD_BONSAI_NAME:
      return process.env.BONSAI_URL ?? '';
    case process.env.DISCORD_ZARAKY_NAME:
      return process.env.ZARAKY_URL ?? '';
    case process.env.DISCORD_HOZ_NAME:
      return process.env.HOZ_URL ?? '';
    case process.env.DISCORD_TAMA_NAME:
      return process.env.TAMA_URL ?? '';
    case process.env.DISCORD_IKEDA_NAME:
      return process.env.IKEDA_URL ?? '';
    case process.env.DISCORD_MYRICA_NAME:
      return process.env.MYRICA_URL ?? '';
    case process.env.DISCORD_CHASO_NAME:
      return process.env.CHASO_URL ?? '';
    case process.env.DISCORD_SoIo_NAME:
      return process.env.SOIO_URL ?? '';
    case process.env.DISCORD_KANBAKU_NAME:
      return process.env.KANBAKU_URL ?? '';
  }
}
