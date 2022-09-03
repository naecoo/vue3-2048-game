import { createI18n } from 'vue-i18n';

export enum LOCALE {
  CN = 'zh-cn',
  EN = 'en'
};
const messages = {
  [LOCALE.CN]: {
    message: {
      score: '分数',
      best_score: '最高分',
      size: '尺寸：',
      new_game: '新游戏',
      undo: '撤回',
      game_over: '游戏结束！'
    }
  },
  [LOCALE.EN]: {
    message: {
      score: 'SCORE',
      best_score: 'BEST',
      size: 'SIZE:',
      new_game: 'NEW GAME',
      undo: 'UNDO',
      game_over: 'GAME OVER!'
    }
  }
};

export default createI18n({
  legacy: false,
  locale: LOCALE.EN,
  messages
});
