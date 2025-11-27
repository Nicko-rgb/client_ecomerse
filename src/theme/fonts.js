export const fontNames = {
  // PLAYPEN
  playpenExtraBold: 'PlaypenSans-ExtraBold',
  playpenBold: 'PlaypenSans-Bold',
  playpenRegular: 'PlaypenSans-Regular',

  // LEAGUE SPARTAN
  spartanBold: 'LeagueSpartan-Bold',
  spartanRegular: 'LeagueSpartan-Regular',
};

export function getFontAssets() {
  return {
    // PLAYPEN
    [fontNames.playpenExtraBold]: require('../../assets/fonts/playpen-sans/PlaypenSans-ExtraBold.ttf'),
    [fontNames.playpenBold]: require('../../assets/fonts/playpen-sans/PlaypenSans-Bold.ttf'),
    [fontNames.playpenRegular]: require('../../assets/fonts/playpen-sans/PlaypenSans-Regular.ttf'),
    // LEAGUE SPARTAN
    [fontNames.spartanBold]: require('../../assets/fonts/league-spartan/LeagueSpartan-Bold.ttf'),
    [fontNames.spartanRegular]: require('../../assets/fonts/league-spartan/LeagueSpartan-Regular.ttf'),
  };
}