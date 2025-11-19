export const fontNames = {
  playpenExtraBold: 'PlaypenSans-ExtraBold',
  playpenBold: 'PlaypenSans-Bold',
  playpenRegular: 'PlaypenSans-Regular',
  spartanBold: 'LeagueSpartan-Bold',
};

export function getFontAssets() {
  return {
    [fontNames.playpenExtraBold]: require('../../assets/fonts/playpen-sans/static/PlaypenSans-ExtraBold.ttf'),
    [fontNames.playpenBold]: require('../../assets/fonts/playpen-sans/static/PlaypenSans-Bold.ttf'),
    [fontNames.playpenRegular]: require('../../assets/fonts/playpen-sans/static/PlaypenSans-Regular.ttf'),
    [fontNames.spartanBold]: require('../../assets/fonts/league-spartan/LeagueSpartan-Bold.otf'),
  };
}